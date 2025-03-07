import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { getLetters, deleteLetter, saveLetterToDrive } from '../services/letterService';
import { formatDate } from '../utils/dateUtils';

const Dashboard = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState(null);
  const [savingToDrive, setSavingToDrive] = useState({});

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      const data = await getLetters();
      setLetters(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching letters:', err);
      setError('Failed to load letters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (letter) => {
    setLetterToDelete(letter);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!letterToDelete) return;
    
    try {
      await deleteLetter(letterToDelete._id);
      setLetters(letters.filter(letter => letter._id !== letterToDelete._id));
      setDeleteDialogOpen(false);
      setLetterToDelete(null);
    } catch (err) {
      console.error('Error deleting letter:', err);
      setError('Failed to delete letter. Please try again.');
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setLetterToDelete(null);
  };

  const handleSaveToDrive = async (letter) => {
    try {
      setSavingToDrive({ ...savingToDrive, [letter._id]: true });
      await saveLetterToDrive(letter._id, letter.content);
      
      // Update the letter in the list to show it's been saved to Drive
      setLetters(letters.map(l => 
        l._id === letter._id 
          ? { ...l, lastSyncedWithDrive: new Date().toISOString() } 
          : l
      ));
    } catch (err) {
      console.error('Error saving to Drive:', err);
      setError('Failed to save to Google Drive. Please try again.');
    } finally {
      setSavingToDrive({ ...savingToDrive, [letter._id]: false });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Letters
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={RouterLink}
            to="/editor"
          >
            New Letter
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : letters.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You don't have any letters yet
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Create your first letter to get started
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={RouterLink}
              to="/editor"
            >
              Create Letter
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Saved to Drive</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {letters.map((letter) => (
                  <TableRow key={letter._id}>
                    <TableCell component="th" scope="row">
                      {letter.title || 'Untitled Letter'}
                    </TableCell>
                    <TableCell>{formatDate(letter.createdAt)}</TableCell>
                    <TableCell>{formatDate(letter.updatedAt)}</TableCell>
                    <TableCell>
                      {letter.lastSyncedWithDrive 
                        ? formatDate(letter.lastSyncedWithDrive) 
                        : 'Not saved'}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          component={RouterLink}
                          to={`/editor/${letter._id}`}
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save to Google Drive">
                        <span>
                          <IconButton
                            onClick={() => handleSaveToDrive(letter)}
                            disabled={savingToDrive[letter._id]}
                            aria-label="save to drive"
                          >
                            {savingToDrive[letter._id] ? (
                              <CircularProgress size={24} />
                            ) : (
                              <CloudUploadIcon />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeleteClick(letter)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Letter</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{letterToDelete?.title || 'Untitled Letter'}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 