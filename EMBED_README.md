# Chatbot Iframe Integration

This document explains how to embed the chatbot component in other projects using iframe integration.

## Overview

The chatbot can be embedded in any website using a simple JavaScript widget that creates an iframe. This approach provides:

- **Easy Integration**: Just include a script tag
- **Isolation**: The chatbot runs in its own iframe context
- **Customization**: Extensive configuration options
- **Cross-Origin Support**: Works across different domains
- **Responsive Design**: Adapts to different screen sizes

## Quick Start

### 1. Basic Integration

Add this to your HTML:

```html
<!-- Include the chatbot embed script -->
<script src="https://chat.com/embed/chatbot-embed.js"></script>

<!-- Initialize the chatbot widget -->
<script>
    ChatbotWidget.init({
        iframeUrl: 'https://chat.com/iframe',
        position: 'bottom-right',
        theme: 'dark'
    });
</script>
```

### 2. Auto-initialization with Data Attributes

```html
<script 
    src="https://chat.com/embed/chatbot-embed.js"
    data-chatbot-widget
    data-iframe-url="https://chat.com/iframe"
    data-position="bottom-right"
    data-theme="dark"
    data-auto-open="false"
    data-toggle-button-text="Chat with us"
    data-toggle-button-icon="💬">
</script>
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `iframeUrl` | string | `/iframe` | URL to the chatbot iframe page |
| `position` | string | `'bottom-right'` | Widget position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `theme` | string | `'dark'` | Color theme: `'dark'` or `'light'` |
| `autoOpen` | boolean | `false` | Whether to open chatbot automatically on page load |
| `showToggleButton` | boolean | `true` | Whether to show the toggle button |
| `toggleButtonText` | string | `'Chat with us'` | Text for the toggle button |
| `toggleButtonIcon` | string | `'💬'` | Icon/emoji for the toggle button |
| `defaultWidth` | string | `'400px'` | Default width of the chatbot iframe |
| `defaultHeight` | string | `'600px'` | Default height of the chatbot iframe |
| `zIndex` | number | `9999` | Z-index of the widget |
| `customStyles` | object | `{}` | Custom CSS styles to apply to the widget |

## API Reference

### Methods

#### `ChatbotWidget.init(options)`
Initialize the chatbot widget with the given options.

```javascript
ChatbotWidget.init({
    iframeUrl: 'https://chat.com/iframe',
    position: 'bottom-right',
    theme: 'dark',
    autoOpen: false
});
```

#### `ChatbotWidget.open()`
Open the chatbot.

```javascript
ChatbotWidget.open();
```

#### `ChatbotWidget.close()`
Close the chatbot.

```javascript
ChatbotWidget.close();
```

#### `ChatbotWidget.toggle()`
Toggle the chatbot state.

```javascript
ChatbotWidget.toggle();
```

#### `ChatbotWidget.isOpen()`
Check if the chatbot is currently open.

```javascript
if (ChatbotWidget.isOpen()) {
    console.log('Chatbot is open');
}
```

#### `ChatbotWidget.isReady()`
Check if the chatbot is ready to use.

```javascript
if (ChatbotWidget.isReady()) {
    console.log('Chatbot is ready');
}
```

#### `ChatbotWidget.updateConfig(newConfig)`
Update the widget configuration at runtime.

```javascript
ChatbotWidget.updateConfig({
    position: 'bottom-left',
    theme: 'light',
    toggleButtonText: 'Support'
});
```

#### `ChatbotWidget.destroy()`
Destroy the widget and clean up resources.

```javascript
ChatbotWidget.destroy();
```

## Events

The widget communicates with the parent window through postMessage events:

### Outgoing Events (from widget to parent)

- `CHATBOT_READY`: Fired when the chatbot is ready to use
- `CHATBOT_TOGGLED`: Fired when the chatbot is toggled (includes `isOpen` state)
- `CHATBOT_CLOSED`: Fired when the chatbot is closed

### Incoming Events (from parent to widget)

- `OPEN_CHATBOT`: Open the chatbot
- `CLOSE_CHATBOT`: Close the chatbot
- `TOGGLE_CHATBOT`: Toggle the chatbot state
- `SET_USER_ID`: Set a custom user ID

### Event Handling Example

```javascript
// Listen for events from the chatbot
window.addEventListener('message', function(event) {
    // Verify origin for security
    if (event.origin !== 'https://chat.com') return;
    
    const { type, data } = event.data || {};
    
    switch (type) {
        case 'CHATBOT_READY':
            console.log('Chatbot is ready');
            break;
        case 'CHATBOT_TOGGLED':
            console.log('Chatbot toggled:', data.isOpen);
            break;
        case 'CHATBOT_CLOSED':
            console.log('Chatbot closed');
            break;
    }
});

// Send events to the chatbot
const iframe = document.getElementById('chatbot-iframe');
iframe.contentWindow.postMessage({ type: 'OPEN_CHATBOT' }, '*');
```

## Framework Integration

### React

```jsx
import React, { useEffect, useRef } from 'react';

const ChatbotWidget = ({ 
    iframeUrl, 
    position = 'bottom-right', 
    theme = 'dark',
    autoOpen = false,
    toggleButtonText = 'Chat with us',
    toggleButtonIcon = '💬'
}) => {
    const scriptRef = useRef(null);
    
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://chat.com/embed/chatbot-embed.js';
        script.async = true;
        script.onload = () => {
            if (window.ChatbotWidget) {
                window.ChatbotWidget.init({
                    iframeUrl,
                    position,
                    theme,
                    autoOpen,
                    toggleButtonText,
                    toggleButtonIcon
                });
            }
        };
        
        document.head.appendChild(script);
        scriptRef.current = script;
        
        return () => {
            if (scriptRef.current) {
                document.head.removeChild(scriptRef.current);
            }
            if (window.ChatbotWidget) {
                window.ChatbotWidget.destroy();
            }
        };
    }, [iframeUrl, position, theme, autoOpen, toggleButtonText, toggleButtonIcon]);
    
    return null;
};

export default ChatbotWidget;
```

### Vue

```vue
<template>
  <div ref="chatbotContainer"></div>
</template>

<script>
export default {
  name: 'ChatbotWidget',
  props: {
    iframeUrl: { type: String, required: true },
    position: { type: String, default: 'bottom-right' },
    theme: { type: String, default: 'dark' },
    autoOpen: { type: Boolean, default: false },
    toggleButtonText: { type: String, default: 'Chat with us' },
    toggleButtonIcon: { type: String, default: '💬' }
  },
  mounted() {
    this.loadChatbot();
  },
  beforeUnmount() {
    this.destroyChatbot();
  },
  methods: {
    loadChatbot() {
      const script = document.createElement('script');
      script.src = 'https://chat.com/embed/chatbot-embed.js';
      script.async = true;
      script.onload = () => {
        if (window.ChatbotWidget) {
          window.ChatbotWidget.init({
            iframeUrl: this.iframeUrl,
            position: this.position,
            theme: this.theme,
            autoOpen: this.autoOpen,
            toggleButtonText: this.toggleButtonText,
            toggleButtonIcon: this.toggleButtonIcon
          });
        }
      };
      document.head.appendChild(script);
    },
    destroyChatbot() {
      if (window.ChatbotWidget) {
        window.ChatbotWidget.destroy();
      }
    }
  }
};
</script>
```

### Angular

```typescript
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-chatbot-widget',
  template: '<div></div>'
})
export class ChatbotWidgetComponent implements OnInit, OnDestroy {
  @Input() iframeUrl: string = 'https://chat.com/iframe';
  @Input() position: string = 'bottom-right';
  @Input() theme: string = 'dark';
  @Input() autoOpen: boolean = false;
  @Input() toggleButtonText: string = 'Chat with us';
  @Input() toggleButtonIcon: string = '💬';

  private script: HTMLScriptElement | null = null;

  ngOnInit() {
    this.loadChatbot();
  }

  ngOnDestroy() {
    this.destroyChatbot();
  }

  private loadChatbot() {
    this.script = document.createElement('script');
    this.script.src = 'https://chat.com/embed/chatbot-embed.js';
    this.script.async = true;
    this.script.onload = () => {
      if (window.ChatbotWidget) {
        window.ChatbotWidget.init({
          iframeUrl: this.iframeUrl,
          position: this.position,
          theme: this.theme,
          autoOpen: this.autoOpen,
          toggleButtonText: this.toggleButtonText,
          toggleButtonIcon: this.toggleButtonIcon
        });
      }
    };
    document.head.appendChild(this.script);
  }

  private destroyChatbot() {
    if (this.script) {
      document.head.removeChild(this.script);
    }
    if (window.ChatbotWidget) {
      window.ChatbotWidget.destroy();
    }
  }
}
```

## Security Considerations

1. **Origin Validation**: Always validate the origin of messages from the iframe
2. **HTTPS**: Use HTTPS for both the parent site and the chatbot iframe
3. **Content Security Policy**: Configure CSP headers appropriately
4. **Trusted Domains**: Maintain a whitelist of trusted domains

## Styling and Customization

### Custom CSS

You can override the default styles by targeting the widget elements:

```css
#chatbot-widget-container {
    /* Custom container styles */
}

#chatbot-toggle-button {
    /* Custom button styles */
    background: #your-brand-color;
    border-radius: 25px;
}

#chatbot-iframe {
    /* Custom iframe styles */
    border-radius: 15px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
```

### Custom Styles via Configuration

```javascript
ChatbotWidget.init({
    iframeUrl: 'https://chat.com/iframe',
    customStyles: {
        'border-radius': '15px',
        'box-shadow': '0 10px 40px rgba(0, 0, 0, 0.3)'
    }
});
```

## Troubleshooting

### Common Issues

1. **Widget not appearing**: Check if the script loaded correctly and the iframe URL is accessible
2. **Styling issues**: Ensure there are no CSS conflicts with your site's styles
3. **Cross-origin errors**: Verify CORS headers are configured correctly
4. **Mobile responsiveness**: Test on different screen sizes and devices

### Debug Mode

Enable debug mode to see console logs:

```javascript
ChatbotWidget.init({
    iframeUrl: 'https://chat.com/iframe',
    debug: true // This will log additional information to console
});
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Examples

See the `public/embed/examples/` directory for complete working examples:

- `basic-usage.html` - Simple integration
- `advanced-usage.html` - Advanced features and controls
- `web-component-usage.html` - Web component and framework integration

## Support

For issues and questions:
1. Check the examples in the `examples/` directory
2. Review the browser console for error messages
3. Verify your configuration options
4. Test with the basic integration first

## License

This chatbot widget is part of your chatbot application and follows the same license terms.
