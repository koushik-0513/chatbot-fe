#!/usr/bin/env node

const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const widgetConfig = require('../webpack.widget.config');
const embedConfig = require('../webpack.embed.config');

// Ensure dist directory exists
const distDir = path.resolve(__dirname, '../dist/widget');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build widget
console.log('Building chatbot widget...');
webpack(widgetConfig, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error('Widget build failed:', err || stats.compilation.errors);
    process.exit(1);
  }
  
  console.log('Widget build completed successfully');
  
  // Build embed script
  console.log('Building embed script...');
  webpack(embedConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error('Embed script build failed:', err || stats.compilation.errors);
      process.exit(1);
    }
    
    console.log('Embed script build completed successfully');
    
    // Copy CSS file if it exists
    const cssSource = path.resolve(__dirname, '../src/styles/globals.css');
    const cssDest = path.resolve(distDir, 'chatbot-widget.css');
    
    if (fs.existsSync(cssSource)) {
      fs.copyFileSync(cssSource, cssDest);
      console.log('CSS file copied successfully');
    }
    
    // Create a combined script that includes both widget and embed functionality
    createCombinedScript();
    
    console.log('Widget build process completed!');
    console.log('Generated files:');
    console.log('- dist/widget/chatbot-widget.js');
    console.log('- dist/widget/chatbot-embed.js');
    console.log('- dist/widget/chatbot-widget.css');
    console.log('- dist/widget/chatbot-combined.js');
  });
});

function createCombinedScript() {
  const widgetPath = path.resolve(distDir, 'chatbot-widget.js');
  const embedPath = path.resolve(distDir, 'chatbot-embed.js');
  const combinedPath = path.resolve(distDir, 'chatbot-combined.js');
  
  let widgetContent = '';
  let embedContent = '';
  
  if (fs.existsSync(widgetPath)) {
    widgetContent = fs.readFileSync(widgetPath, 'utf8');
  }
  
  if (fs.existsSync(embedPath)) {
    embedContent = fs.readFileSync(embedPath, 'utf8');
  }
  
  // Create a combined script that loads the widget and provides the embed functionality
  const combinedContent = `
// Combined Chatbot Widget Script
// This script includes both the widget and embed functionality

${widgetContent}

${embedContent}

// Auto-initialize when loaded
(function() {
  if (typeof window !== 'undefined') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeWidget);
    } else {
      initializeWidget();
    }
  }
  
  function initializeWidget() {
    // Check if there's a script tag with chatbot configuration
    const script = document.querySelector('script[data-chatbot-widget]');
    if (!script) return;
    
    const config = {};
    const attributes = [
      'api-url', 'position', 'theme', 'primary-color', 'button-color', 
      'button-text-color', 'width', 'height', 'z-index', 'show-welcome', 'welcome-message'
    ];
    
    attributes.forEach(attr => {
      const value = script.getAttribute(\`data-\${attr}\`);
      if (value) {
        const key = attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        if (key === 'zIndex') {
          config[key] = parseInt(value);
        } else if (key === 'showWelcomeMessage') {
          config[key] = value === 'true';
        } else {
          config[key] = value;
        }
      }
    });
    
    // Initialize the widget
    if (window.ChatbotWidget && window.ChatbotWidget.init) {
      window.ChatbotWidget.init(config);
    }
  }
})();
`;
  
  fs.writeFileSync(combinedPath, combinedContent);
  console.log('Combined script created successfully');
}
