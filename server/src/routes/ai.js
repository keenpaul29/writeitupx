const express = require('express');
const apiLimiter = require('../middleware/rateLimiter.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { validateAuth, validateRequest } = require('../middleware/aiMiddleware.js');

const router = express.Router();

// Validate Gemini API key
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

let genAI;
let model;

async function initializeAI() {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    // Test the model
    console.log('Testing Gemini AI connection...');
    const testResult = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Test connection' }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });

    if (!testResult.response) {
      throw new Error('Model test failed');
    }

    console.log('✅ Gemini AI initialized successfully');
  } catch (error) {
    console.error('Error initializing Gemini AI:', error);
    process.exit(1);
  }
}

// Initialize AI on startup
initializeAI();

router.post('/suggestions', [validateAuth, validateRequest, apiLimiter], async (req, res) => {
  try {
    if (!model) {
      throw new Error('AI model not initialized');
    }

    const { text, context } = req.body;
    
    const prompt = `As a professional writing assistant, analyze the following text and provide 3-5 specific suggestions to improve its clarity, tone, and effectiveness. Consider this is a ${context}.

Text to analyze:
${text}

Please format your response with exactly 3-5 detailed suggestions. Each suggestion should:
1. Start with a bullet point (•)
2. Include a clear title/summary
3. Be followed by a detailed explanation

Example format:
• Enhance Clarity: Your opening paragraph could be more concise. Consider removing redundant phrases and focusing on the key message. This will help readers grasp your main point immediately.
• Improve Structure: The transition between your second and third paragraphs needs work. Add a connecting sentence that bridges these ideas to create a smoother flow.

Focus your suggestions on:
- Clarity and conciseness
- Professional tone
- Structure and organization
- Grammar and word choice`;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    if (!result || !result.response) {
      throw new Error('No response from Gemini AI');
    }
    
    const response = result.response;
    const responseText = response.text();
    console.log('Raw AI response:', responseText); // Debug log
    
    // Enhanced suggestion parsing
    const suggestions = [];
    let currentSuggestion = '';
    
    responseText.split('\n').forEach(line => {
      line = line.trim();
      if (line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line)) {
        // If we have a previous suggestion, save it
        if (currentSuggestion) {
          suggestions.push(currentSuggestion.trim());
        }
        // Start a new suggestion
        currentSuggestion = line.replace(/^[•\-\d\.]+\s*/, '');
      } else if (currentSuggestion && line) {
        // Append to current suggestion with proper spacing
        currentSuggestion += ' ' + line;
      }
    });
    
    // Add the last suggestion if exists
    if (currentSuggestion) {
      suggestions.push(currentSuggestion.trim());
    }

    // Filter out any empty suggestions and ensure minimum length
    const validSuggestions = suggestions
      .filter(suggestion => suggestion.length >= 10)
      .map(suggestion => ({
        title: suggestion.split(':')[0].trim(),
        fullText: suggestion
      }));

    if (validSuggestions.length === 0) {
      console.log('No suggestions found in response:', responseText); // Debug log
      throw new Error('No valid suggestions generated');
    }

    // Take at most 5 suggestions
    const finalSuggestions = validSuggestions.slice(0, 5);
    
    res.json({ suggestions: finalSuggestions });
  } catch (error) {
    console.error('AI suggestion error:', error);
    
    // Handle specific error types
    if (error.message?.includes('API key not valid')) {
      res.status(500).json({ error: 'AI service configuration error. Please contact support.' });
    } else if (error.message?.includes('No response') || error.message?.includes('not initialized')) {
      res.status(500).json({ error: 'AI service is currently unavailable. Please try again later.' });
    } else if (error.message?.includes('model')) {
      res.status(500).json({ error: 'AI model configuration error. Please contact support.' });
    } else {
      res.status(500).json({ error: 'An error occurred while generating suggestions.' });
    }
  }
});

module.exports = router;