// Global polyfills and configurations
global.alert = (msg) => console.log('[Alert]:', msg);
global.confirm = (msg) => {
    console.log('[Confirm]:', msg);
    return true;
};
global.prompt = (msg) => {
    console.log('[Prompt]:', msg);
    return null;
};

// Add any other global configurations needed for the server
global.isServer = true;

// Use CommonJS exports
module.exports = {}; 