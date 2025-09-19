#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  distDir: path.resolve(__dirname, '../dist/widget'),
  publicDir: path.resolve(__dirname, '../public/widget'),
  cdnUrl: process.env.CDN_URL || 'https://your-domain.com/widget',
};

console.log('🚀 Starting widget deployment process...');

// Ensure directories exist
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

// Copy files from dist to public
function copyFiles() {
  const files = [
    'chatbot-widget.js',
    'chatbot-embed.js', 
    'chatbot-combined.js',
    'chatbot-widget.css'
  ];

  files.forEach(file => {
    const srcPath = path.join(config.distDir, file);
    const destPath = path.join(config.publicDir, file);
    
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`📄 Copied: ${file}`);
    } else {
      console.warn(`⚠️  File not found: ${file}`);
    }
  });
}

// Generate deployment info
function generateDeploymentInfo() {
  const info = {
    buildDate: new Date().toISOString(),
    version: require('../package.json').version,
    files: [
      'chatbot-widget.js',
      'chatbot-embed.js',
      'chatbot-combined.js',
      'chatbot-widget.css'
    ],
    cdnUrl: config.cdnUrl,
    usage: {
      scriptTag: `<script src="${config.cdnUrl}/chatbot-combined.js" data-chatbot-widget data-api-url="YOUR_API_URL"></script>`,
      webComponent: `<script src="${config.cdnUrl}/chatbot-widget.js"></script>\n<chatbot-widget api-url="YOUR_API_URL"></chatbot-widget>`
    }
  };

  const infoPath = path.join(config.publicDir, 'deployment-info.json');
  fs.writeFileSync(infoPath, JSON.stringify(info, null, 2));
  console.log('📋 Generated deployment info');
}

// Main deployment process
function deploy() {
  try {
    console.log('🔧 Ensuring directories exist...');
    ensureDir(config.distDir);
    ensureDir(config.publicDir);

    console.log('📦 Copying files...');
    copyFiles();

    console.log('📋 Generating deployment info...');
    generateDeploymentInfo();

    console.log('✅ Widget deployment completed successfully!');
    console.log(`📁 Files available at: ${config.publicDir}`);
    console.log(`🌐 CDN URL: ${config.cdnUrl}`);
    console.log('\n📖 Usage examples:');
    console.log('Script Tag:');
    console.log(`<script src="${config.cdnUrl}/chatbot-combined.js" data-chatbot-widget data-api-url="YOUR_API_URL"></script>`);
    console.log('\nWeb Component:');
    console.log(`<script src="${config.cdnUrl}/chatbot-widget.js"></script>`);
    console.log(`<chatbot-widget api-url="YOUR_API_URL"></chatbot-widget>`);
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
deploy();
