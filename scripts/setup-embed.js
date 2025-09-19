#!/usr/bin/env node

/**
 * Setup script for chatbot iframe embedding
 * This script helps configure the chatbot for iframe embedding
 */

const fs = require('fs');
const path = require('path');

const EMBED_URL_PLACEHOLDER = 'https://yourdomain.com';
const IFRAME_URL_PLACEHOLDER = '/iframe';

function updateEmbedScript(domain) {
  const embedScriptPath = path.join(__dirname, '..', 'public', 'embed', 'chatbot-embed.js');
  
  if (!fs.existsSync(embedScriptPath)) {
    console.error('❌ Embed script not found at:', embedScriptPath);
    return false;
  }
  
  let content = fs.readFileSync(embedScriptPath, 'utf8');
  
  // Update the iframe URL in the embed script
  content = content.replace(
    /iframeUrl: '\/iframe'/g,
    `iframeUrl: '${domain}/iframe'`
  );
  
  // Update trusted origins
  content = content.replace(
    /trustedOrigins: \[\s*'http:\/\/localhost:3000',\s*'https:\/\/yourdomain\.com'\s*\]/g,
    `trustedOrigins: [
      'http://localhost:3000',
      '${domain}'
    ]`
  );
  
  fs.writeFileSync(embedScriptPath, content);
  console.log('✅ Updated embed script with domain:', domain);
  return true;
}

function updateExampleFiles(domain) {
  const examplesDir = path.join(__dirname, '..', 'public', 'embed', 'examples');
  
  if (!fs.existsSync(examplesDir)) {
    console.log('⚠️  Examples directory not found, skipping...');
    return;
  }
  
  const exampleFiles = fs.readdirSync(examplesDir).filter(file => file.endsWith('.html'));
  
  exampleFiles.forEach(file => {
    const filePath = path.join(examplesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Update script src URLs
    content = content.replace(
      /src="\.\/chatbot-embed\.js"/g,
      `src="${domain}/embed/chatbot-embed.js"`
    );
    
    // Update iframe URLs
    content = content.replace(
      /data-iframe-url="\/iframe"/g,
      `data-iframe-url="${domain}/iframe"`
    );
    
    content = content.replace(
      /iframeUrl: '\/iframe'/g,
      `iframeUrl: '${domain}/iframe'`
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated example file: ${file}`);
  });
}

function updateReadme(domain) {
  const readmePath = path.join(__dirname, '..', 'EMBED_README.md');
  
  if (!fs.existsSync(readmePath)) {
    console.log('⚠️  README not found, skipping...');
    return;
  }
  
  let content = fs.readFileSync(readmePath, 'utf8');
  
  // Update example URLs
  content = content.replace(
    /https:\/\/yourdomain\.com/g,
    domain
  );
  
  fs.writeFileSync(readmePath, content);
  console.log('✅ Updated README with domain:', domain);
}

function createDeploymentInfo() {
  const deploymentInfo = {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    files: {
      embedScript: '/embed/chatbot-embed.js',
      iframePage: '/iframe',
      examples: '/embed/examples/',
      styles: '/embed/chatbot-iframe.css'
    },
    usage: {
      basic: 'Include the embed script and call ChatbotWidget.init()',
      autoInit: 'Use data attributes for automatic initialization',
      frameworks: 'React, Vue, Angular examples available'
    },
    endpoints: {
      iframe: '/iframe',
      embed: '/embed/chatbot-embed.js',
      styles: '/embed/chatbot-iframe.css'
    }
  };
  
  const infoPath = path.join(__dirname, '..', 'public', 'embed', 'deployment-info.json');
  fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
  console.log('✅ Created deployment info file');
}

function main() {
  const args = process.argv.slice(2);
  const domain = args[0];
  
  if (!domain) {
    console.log(`
🤖 Chatbot Iframe Embed Setup

Usage: node scripts/setup-embed.js <domain>

Examples:
  node scripts/setup-embed.js https://myapp.com
  node scripts/setup-embed.js https://chatbot.example.com
  node scripts/setup-embed.js http://localhost:3000

This script will:
1. Update the embed script with your domain
2. Update example files with correct URLs
3. Update the README with your domain
4. Create deployment information file
    `);
    process.exit(1);
  }
  
  console.log('🚀 Setting up chatbot iframe embedding...');
  console.log('Domain:', domain);
  console.log('');
  
  try {
    // Update files
    updateEmbedScript(domain);
    updateExampleFiles(domain);
    updateReadme(domain);
    createDeploymentInfo();
    
    console.log('');
    console.log('🎉 Setup complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Deploy your application to:', domain);
    console.log('2. Test the iframe page:', `${domain}/iframe`);
    console.log('3. Test the embed script:', `${domain}/embed/chatbot-embed.js`);
    console.log('4. Check the examples:', `${domain}/embed/examples/`);
    console.log('');
    console.log('Integration example:');
    console.log(`<script src="${domain}/embed/chatbot-embed.js"></script>`);
    console.log(`<script>`);
    console.log(`  ChatbotWidget.init({`);
    console.log(`    iframeUrl: '${domain}/iframe',`);
    console.log(`    position: 'bottom-right',`);
    console.log(`    theme: 'dark'`);
    console.log(`  });`);
    console.log(`</script>`);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  updateEmbedScript,
  updateExampleFiles,
  updateReadme,
  createDeploymentInfo
};
