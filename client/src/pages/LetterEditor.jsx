import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Lightbulb as LightbulbIcon,
} from '@mui/icons-material';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { getLetter, createLetter, updateLetter, saveLetterToDrive } from '../services/letterService';
import { getWritingSuggestions } from '../services/aiService';
import { formatDate } from '../utils/dateUtils';

// Debounce function for auto-save
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const LetterEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [letter, setLetter] = useState(null);
  const [title, setTitle] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [savingToDrive, setSavingToDrive] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // Memoize fetchLetter to prevent recreation on each render
  const fetchLetter = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLetter(id);
      setLetter(data);
      setTitle(data.title || '');
      
      // Convert content from raw JSON to EditorState
      if (data.content) {
        try {
          const contentState = convertFromRaw(JSON.parse(data.content));
          setEditorState(EditorState.createWithContent(contentState));
        } catch (err) {
          console.error('Error parsing content:', err);
          // If content can't be parsed, create empty editor
          setEditorState(EditorState.createEmpty());
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching letter:', err);
      setError('Failed to load letter. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch letter if editing an existing one
  useEffect(() => {
    if (id) {
      fetchLetter();
    }
  }, [id, fetchLetter]);

  // Save letter (create or update)
  const saveLetter = async () => {
    try {
      setSaving(true);
      
      // Convert editor content to raw JSON
      const contentState = editorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));
      
      let savedLetter;
      
      if (id) {
        // Update existing letter
        savedLetter = await updateLetter(id, {
          title,
          content: rawContent,
        });
        setSuccessMessage('Letter updated successfully');
      } else {
        // Create new letter
        savedLetter = await createLetter({
          title,
          content: rawContent,
        });
        setSuccessMessage('Letter created successfully');
        // Redirect to edit page with new ID
        navigate(`/editor/${savedLetter._id}`, { replace: true });
      }
      
      setLetter(savedLetter);
      setError(null);
    } catch (err) {
      console.error('Error saving letter:', err);
      setError('Failed to save letter. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save with debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(() => {
      if (id && title.trim() !== '') {
        saveLetter();
      }
    }, 2000),
    [id, title, editorState]
  );

  // Trigger auto-save when content changes
  useEffect(() => {
    if (id && !loading) {
      debouncedSave();
    }
  }, [id, title, editorState, loading, debouncedSave]);

  // Save to Google Drive
  const handleSaveToDrive = async () => {
    try {
      setSavingToDrive(true);
      
      // Convert editor content to plain text for Drive
      const contentState = editorState.getCurrentContent();
      const plainText = contentState.getPlainText('\n');
      
      await saveLetterToDrive(id, plainText);
      
      setSuccessMessage('Saved to Google Drive successfully');
      
      // Update letter with new sync time
      setLetter({
        ...letter,
        lastSyncedWithDrive: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error saving to Drive:', err);
      setError('Failed to save to Google Drive. Please try again.');
    } finally {
      setSavingToDrive(false);
    }
  };

  // Get AI writing suggestions
  const handleGetSuggestions = async () => {
    try {
      setError(null);
      setLoadingSuggestions(true);
      
      const plainText = editorState.getCurrentContent().getPlainText();
      if (!plainText.trim()) {
        setError('Please enter some text to get suggestions.');
        return;
      }

      // Get suggestions from AI
      const suggestionsList = await getWritingSuggestions(plainText, 'formal letter');
      setSuggestions(suggestionsList);
    } catch (err) {
      console.error('Error getting suggestions:', err);
      setError(err.message || 'Failed to get writing suggestions. Please try again.');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle editor commands
  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // Map keys to commands
  const mapKeyToEditorCommand = (e) => {
    return getDefaultKeyBinding(e);
  };

  // Handle editor focus
  const focus = () => {
    document.querySelector('.DraftEditor-root').focus();
  };

  // Close success message
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
            aria-label="back to dashboard"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {id ? 'Edit Letter' : 'New Letter'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          <TextField
            label="Letter Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            placeholder="Enter a title for your letter"
          />

          {letter && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Last updated: {formatDate(letter.updatedAt)}
              </Typography>
              {letter.lastSyncedWithDrive && (
                <Typography variant="body2" color="text.secondary">
                  Last saved to Drive: {formatDate(letter.lastSyncedWithDrive)}
                </Typography>
              )}
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              border: '1px solid #ccc',
              borderRadius: 1,
              p: 2,
              minHeight: '300px',
              cursor: 'text',
              mb: 2,
            }}
            onClick={focus}
          >
            <Editor
              editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              keyBindingFn={mapKeyToEditorCommand}
              placeholder="Start writing your letter here..."
              spellCheck={true}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={saveLetter}
                disabled={saving || title.trim() === ''}
                sx={{ mr: 2 }}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
              {id && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleSaveToDrive}
                  disabled={savingToDrive || title.trim() === ''}
                >
                  {savingToDrive ? 'Saving to Drive...' : 'Save to Drive'}
                </Button>
              )}
            </Box>
            <Tooltip title="Get AI writing suggestions">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<LightbulbIcon />}
                onClick={handleGetSuggestions}
                disabled={loadingSuggestions}
              >
                {loadingSuggestions ? 'Getting suggestions...' : 'Get Suggestions'}
              </Button>
            </Tooltip>
          </Box>
        </Paper>

        {suggestions.length > 0 && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Writing Suggestions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {suggestions.map((suggestion, index) => (
                <Box key={index}>
                  <Chip
                    label={suggestion.title}
                    color="primary"
                    variant={selectedSuggestion === index ? "filled" : "outlined"}
                    onClick={() => setSelectedSuggestion(selectedSuggestion === index ? null : index)}
                    sx={{ mb: 1, cursor: 'pointer' }}
                  />
                  {selectedSuggestion === index && (
                    <Paper 
                      elevation={0} 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        mt: 1, 
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 1,
                        '& p': { m: 0 }
                      }}
                    >
                      <Typography variant="body1" color="text.primary">
                        {suggestion.fullText}
                      </Typography>
                    </Paper>
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message={successMessage}
      />
    </Container>
  );
};

export default LetterEditor; 