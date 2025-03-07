const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: Object,
    required: true,
    default: {
      type: 'doc',
      content: []
    }
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    accessLevel: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    }
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  googleDriveFileId: {
    type: String
  },
  lastSyncedWithDrive: {
    type: Date
  },
  version: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp and version before saving
letterSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  this.version += 1;
  next();
});

module.exports = mongoose.model('Letter', letterSchema);
