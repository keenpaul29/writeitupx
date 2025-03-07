const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function verifyGeminiApiKey() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    console.log('Initializing Gemini AI...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Try a simple test prompt
    console.log('Testing model with a simple prompt...');
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: 'Hello, are you working?' }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 200,
      },
    });
    
    const response = await result.response;
    if (response && response.text()) {
      console.log('\n✅ Gemini API key is valid and model is working');
      console.log('Test response:', response.text().slice(0, 100) + '...');
      return true;
    } else {
      throw new Error('No valid response received from the model');
    }
  } catch (error) {
    console.error('\n❌ Error verifying Gemini API key:', error.message);
    console.log('\nPlease make sure:');
    console.log('1. You have set a valid GEMINI_API_KEY in your .env file');
    console.log('2. Your API key has access to the Gemini API');
    console.log('3. You can get an API key from: https://makersuite.google.com/app/apikey');
    return false;
  }
}

// Run the verification if this script is run directly
if (require.main === module) {
  verifyGeminiApiKey();
}

module.exports = verifyGeminiApiKey; 