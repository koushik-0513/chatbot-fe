/**
 * Chatbot Embed Script
 * Easy integration for embedding the chatbot in any website
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    iframeUrl: 'https://chat.com/iframe', // Update this to your deployed URL
    defaultWidth: '400px',
    defaultHeight: '600px',
    zIndex: 9999,
    position: 'bottom-right',
    theme: 'dark', // 'dark' or 'light'
    autoOpen: false,
    showToggleButton: true,
    toggleButtonText: 'Chat with us',
    toggleButtonIcon: '💬',
    customStyles: {},
    trustedOrigins: [
      'http://localhost:3000',
      'https://chat.com'
    ]
  };

  // State management
  let chatbotWidget = null;
  let isOpen = false;
  let isReady = false;
  let config = { ...CONFIG };

  // Utility functions
  function createElement(tag, attributes = {}, styles = {}) {
    const element = document.createElement(tag);
    Object.assign(element, attributes);
    Object.assign(element.style, styles);
    return element;
  }

  function addStyles() {
    if (document.getElementById('chatbot-embed-styles')) return;

    const styles = `
      #chatbot-widget-container {
        position: fixed;
        z-index: ${config.zIndex};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      #chatbot-widget-container.bottom-right {
        bottom: 20px;
        right: 20px;
      }
      
      #chatbot-widget-container.bottom-left {
        bottom: 20px;
        left: 20px;
      }
      
      #chatbot-widget-container.top-right {
        top: 20px;
        right: 20px;
      }
      
      #chatbot-widget-container.top-left {
        top: 20px;
        left: 20px;
      }
      
      #chatbot-toggle-button {
        background: ${config.theme === 'dark' ? '#a86dff' : '#007bff'};
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;
        justify-content: center;
      }
      
      #chatbot-toggle-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }
      
      #chatbot-toggle-button:active {
        transform: translateY(0);
      }
      
      #chatbot-iframe {
        border: none;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        width: ${config.defaultWidth};
        height: ${config.defaultHeight};
        background: ${config.theme === 'dark' ? '#16191e' : '#ffffff'};
      }
      
      #chatbot-iframe.hidden {
        opacity: 0;
        transform: scale(0.9) translateY(20px);
        pointer-events: none;
      }
      
      #chatbot-iframe.visible {
        opacity: 1;
        transform: scale(1) translateY(0);
        pointer-events: auto;
      }
      
      .chatbot-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        width: ${config.defaultWidth};
        height: ${config.defaultHeight};
        background: ${config.theme === 'dark' ? '#16191e' : '#ffffff'};
        border-radius: 12px;
        color: ${config.theme === 'dark' ? '#fafafa' : '#333333'};
        font-size: 14px;
      }
      
      .chatbot-loading::after {
        content: '';
        width: 20px;
        height: 20px;
        border: 2px solid ${config.theme === 'dark' ? '#a86dff' : '#007bff'};
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-left: 10px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    const styleElement = createElement('style', {
      id: 'chatbot-embed-styles',
      textContent: styles
    });

    document.head.appendChild(styleElement);
  }

  function createWidget() {
    if (chatbotWidget) return;

    // Create container
    chatbotWidget = createElement('div', {
      id: 'chatbot-widget-container',
      className: config.position
    });

    // Create iframe
    const iframe = createElement('iframe', {
      id: 'chatbot-iframe',
      src: config.iframeUrl,
      className: 'hidden',
      title: 'Chatbot',
      allow: 'microphone; camera'
    });

    // Create toggle button
    const toggleButton = createElement('button', {
      id: 'chatbot-toggle-button',
      innerHTML: `${config.toggleButtonIcon} ${config.toggleButtonText}`,
      onclick: toggleChatbot
    });

    // Create loading indicator
    const loadingDiv = createElement('div', {
      className: 'chatbot-loading',
      innerHTML: 'Loading chatbot...'
    });

    // Assemble widget
    chatbotWidget.appendChild(iframe);
    chatbotWidget.appendChild(toggleButton);
    chatbotWidget.appendChild(loadingDiv);

    // Apply custom styles
    Object.assign(chatbotWidget.style, config.customStyles);

    // Add to page
    document.body.appendChild(chatbotWidget);

    // Setup iframe communication
    setupIframeCommunication(iframe);

    // Auto-open if configured
    if (config.autoOpen) {
      setTimeout(() => {
        openChatbot();
      }, 1000);
    }
  }

  function setupIframeCommunication(iframe) {
    window.addEventListener('message', function(event) {
      // Check if message is from our iframe
      if (event.source !== iframe.contentWindow) return;

      const { type, data } = event.data || {};

      switch (type) {
        case 'CHATBOT_READY':
          isReady = true;
          hideLoading();
          if (isOpen) {
            showIframe();
          }
          break;
        case 'CHATBOT_TOGGLED':
          isOpen = data.isOpen;
          break;
        case 'CHATBOT_CLOSED':
          isOpen = false;
          hideIframe();
          break;
      }
    });
  }

  function showIframe() {
    const iframe = document.getElementById('chatbot-iframe');
    const toggleButton = document.getElementById('chatbot-toggle-button');
    
    if (iframe) {
      iframe.classList.remove('hidden');
      iframe.classList.add('visible');
    }
    
    if (toggleButton) {
      toggleButton.innerHTML = `✕ Close Chat`;
    }
  }

  function hideIframe() {
    const iframe = document.getElementById('chatbot-iframe');
    const toggleButton = document.getElementById('chatbot-toggle-button');
    
    if (iframe) {
      iframe.classList.remove('visible');
      iframe.classList.add('hidden');
    }
    
    if (toggleButton) {
      toggleButton.innerHTML = `${config.toggleButtonIcon} ${config.toggleButtonText}`;
    }
  }

  function hideLoading() {
    const loadingDiv = document.querySelector('.chatbot-loading');
    if (loadingDiv) {
      loadingDiv.style.display = 'none';
    }
  }

  function toggleChatbot() {
    if (isOpen) {
      closeChatbot();
    } else {
      openChatbot();
    }
  }

  function openChatbot() {
    isOpen = true;
    if (isReady) {
      showIframe();
    }
    
    // Send message to iframe
    const iframe = document.getElementById('chatbot-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'OPEN_CHATBOT' }, '*');
    }
  }

  function closeChatbot() {
    isOpen = false;
    hideIframe();
    
    // Send message to iframe
    const iframe = document.getElementById('chatbot-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ type: 'CLOSE_CHATBOT' }, '*');
    }
  }

  // Public API
  window.ChatbotWidget = {
    init: function(options = {}) {
      config = { ...CONFIG, ...options };
      addStyles();
      createWidget();
    },
    
    open: openChatbot,
    close: closeChatbot,
    toggle: toggleChatbot,
    
    isOpen: function() {
      return isOpen;
    },
    
    isReady: function() {
      return isReady;
    },
    
    updateConfig: function(newConfig) {
      config = { ...config, ...newConfig };
      // Recreate widget with new config
      if (chatbotWidget) {
        chatbotWidget.remove();
        chatbotWidget = null;
        createWidget();
      }
    },
    
    destroy: function() {
      if (chatbotWidget) {
        chatbotWidget.remove();
        chatbotWidget = null;
      }
      isOpen = false;
      isReady = false;
    }
  };

  // Auto-initialize if data attributes are present
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.querySelector('script[data-chatbot-widget]');
    if (script) {
      const options = {
        iframeUrl: script.dataset.iframeUrl || CONFIG.iframeUrl,
        position: script.dataset.position || CONFIG.position,
        theme: script.dataset.theme || CONFIG.theme,
        autoOpen: script.dataset.autoOpen === 'true',
        showToggleButton: script.dataset.showToggleButton !== 'false',
        toggleButtonText: script.dataset.toggleButtonText || CONFIG.toggleButtonText,
        toggleButtonIcon: script.dataset.toggleButtonIcon || CONFIG.toggleButtonIcon
      };
      
      window.ChatbotWidget.init(options);
    }
  });

})();
