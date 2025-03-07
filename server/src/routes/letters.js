const express = require('express');
const passport = require('passport');
const { google } = require('googleapis');
const Letter = require('../models/letter');
const router = express.Router();

// Helper function to setup Google Drive client
const setupDriveClient = (user) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: user.googleAccessToken,
    refresh_token: user.googleRefreshToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
};

// Helper function to ensure user has a Letters folder
const ensureLettersFolder = async (drive, user) => {
  if (user.googleDriveFolderId) {
    return user.googleDriveFolderId;
  }

  const folderMetadata = {
    name: 'Letters',
    mimeType: 'application/vnd.google-apps.folder'
  };

  const response = await drive.files.create({
    resource: folderMetadata,
    fields: 'id'
  });

  user.googleDriveFolderId = response.data.id;
  await user.save();

  return user.googleDriveFolderId;
};

// Get all letters
router.get('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const letters = await Letter.find({
        $or: [
          { user: req.user._id },
          { 'collaborators.user': req.user._id }
        ]
      }).populate('user', 'name email');
      res.json(letters);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching letters' });
    }
  }
);

// Get single letter
router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const letter = await Letter.findOne({
        _id: req.params.id,
        $or: [
          { user: req.user._id },
          { 'collaborators.user': req.user._id }
        ]
      }).populate('user', 'name email');

      if (!letter) {
        return res.status(404).json({ message: 'Letter not found or insufficient permissions' });
      }

      res.json(letter);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching letter' });
    }
  }
);

// Create new letter
router.post('/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { title, content, collaborators } = req.body;
      const letter = await Letter.create({
        title,
        content,
        collaborators,
        user: req.user._id
      });
      res.status(201).json(letter);
    } catch (error) {
      res.status(500).json({ message: 'Error creating letter' });
    }
  }
);

// Update letter
router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { title, content, collaborators } = req.body;
      const letter = await Letter.findOne({
        _id: req.params.id,
        $or: [
          { user: req.user._id },
          { 'collaborators.user': req.user._id, 'collaborators.accessLevel': 'write' }
        ]
      });

      if (!letter) {
        return res.status(404).json({ message: 'Letter not found or insufficient permissions' });
      }

      if (title) letter.title = title;
      if (content) letter.content = content;
      if (collaborators && req.user._id.equals(letter.user)) {
        letter.collaborators = collaborators;
      }

      await letter.save();
      res.json(letter);
    } catch (error) {
      res.status(500).json({ message: 'Error updating letter' });
    }
  }
);

// Save letter to Google Drive with improved organization
router.post('/:id/save-to-drive',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const letter = await Letter.findOne({ _id: req.params.id, user: req.user._id });
      if (!letter) {
        return res.status(404).json({ message: 'Letter not found' });
      }

      const drive = setupDriveClient(req.user);
      const folderId = await ensureLettersFolder(drive, req.user);
      
      const fileMetadata = {
        name: `${letter.title}_v${letter.version}.txt`,
        mimeType: 'text/plain',
        parents: letter.googleDriveFileId ? undefined : [folderId],
        properties: {
          letterVersion: letter.version.toString(),
          status: letter.status,
          format: letter.format,
          lastEditor: req.user.email
        }
      };

      // Use the plain text content from the request
      const plainTextContent = req.body.content;

      const media = {
        mimeType: 'text/plain',
        body: plainTextContent
      };

      let response;
      if (letter.googleDriveFileId) {
        // Update existing file
        response = await drive.files.update({
          fileId: letter.googleDriveFileId,
          resource: fileMetadata,
          media: media
        });
      } else {
        // Create new file
        response = await drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id'
        });
        
        letter.googleDriveFileId = response.data.id;
      }

      letter.lastSyncedWithDrive = new Date();
      await letter.save();

      res.json({ 
        message: 'Saved to Google Drive',
        googleDriveFileId: letter.googleDriveFileId
      });
    } catch (error) {
      console.error('Google Drive save error:', error);
      res.status(500).json({ message: 'Error saving to Google Drive' });
    }
  }
);

// Delete letter
router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const letter = await Letter.findOne({ 
        _id: req.params.id,
        user: req.user._id
      });
      
      if (!letter) {
        return res.status(404).json({ message: 'Letter not found' });
      }

      // If letter was saved to Drive, delete it there too
      if (letter.googleDriveFileId) {
        try {
          const drive = setupDriveClient(req.user);
          await drive.files.delete({ fileId: letter.googleDriveFileId });
        } catch (driveError) {
          console.error('Error deleting from Google Drive:', driveError);
          // Continue with letter deletion even if Drive deletion fails
        }
      }

      await letter.deleteOne();
      res.json({ message: 'Letter deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting letter' });
    }
  }
);

module.exports = router;
