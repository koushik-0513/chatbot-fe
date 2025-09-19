# Chatbot Widget - Embeddable Script

This project provides an embeddable chatbot widget that can be easily integrated into any website using a simple script tag or web component.

## Features

- 🚀 **Easy Integration** - Just add a script tag to your HTML
- 🎨 **Customizable** - Full control over appearance and behavior
- 📱 **Responsive** - Works on all devices and screen sizes
- 🔧 **Flexible** - Multiple integration methods (script tag, web component)
- ⚡ **Lightweight** - Optimized bundle size
- 🎯 **Multiple Pages** - Home, Chat, Help, and News sections
- 🎭 **Theming** - Light and dark themes with custom colors

## Quick Start

### Method 1: Script Tag (Recommended)

Add this script tag to your HTML:

```html
<script 
    src="https://your-domain.com/chatbot-combined.js"
    data-chatbot-widget
    data-api-url="https://your-api-domain.com"
    data-position="bottom-right"
    data-theme="light"
    data-primary-color="#3b82f6"
    data-button-color="#3b82f6"
    data-button-text-color="#ffffff"
    data-width="400px"
    data-height="700px"
    data-z-index="9999"
    data-show-welcome="false"
    data-welcome-message="Welcome to Our Support Chat">
</script>
```

### Method 2: Web Component

```html
<!-- Load the widget script -->
<script src="https://your-domain.com/chatbot-widget.js"></script>

<!-- Use the web component -->
<chatbot-widget
    api-url="https://your-api-domain.com"
    position="bottom-right"
    theme="light"
    primary-color="#3b82f6"
    button-color="#3b82f6"
    button-text-color="#ffffff"
    width="400px"
    height="700px"
    z-index="9999"
    show-welcome="false"
    welcome-message="Welcome to Our Support Chat">
</chatbot-widget>
```

## Configuration Options

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `api-url` | string | `""` | Your backend API URL |
| `position` | string | `"bottom-right"` | Widget position (bottom-right, bottom-left, top-right, top-left) |
| `theme` | string | `"light"` | Color theme (light, dark) |
| `primary-color` | string | `"#3b82f6"` | Primary color for the widget |
| `button-color` | string | `"#3b82f6"` | Chat button color |
| `button-text-color` | string | `"#ffffff"` | Chat button text color |
| `width` | string | `"400px"` | Widget width |
| `height` | string | `"700px"` | Widget height |
| `z-index` | number | `9999` | CSS z-index value |
| `show-welcome` | boolean | `true` | Show welcome message |
| `welcome-message` | string | `"Welcome to Our Website"` | Custom welcome message |

## JavaScript API

When using the script tag method, you get access to a global `ChatbotWidget` object:

```javascript
// Show the widget
window.ChatbotWidget.show();

// Hide the widget
window.ChatbotWidget.hide();

// Update configuration
window.ChatbotWidget.updateConfig({
    position: 'bottom-left',
    theme: 'dark',
    primaryColor: '#ff6b6b'
});

// Destroy the widget
window.ChatbotWidget.destroy();
```

## Building the Widget

### Prerequisites

Install the required dependencies:

```bash
npm install
```

### Build Commands

```bash
# Build only the widget
npm run build:widget

# Build both the Next.js app and widget
npm run build:all

# Build the Next.js app only
npm run build
```

### Output Files

After building, you'll find these files in the `dist/widget/` directory:

- `chatbot-widget.js` - The main widget component
- `chatbot-embed.js` - The embed script
- `chatbot-combined.js` - Combined script with auto-initialization
- `chatbot-widget.css` - Styles for the widget

## Deployment

1. Build the widget using `npm run build:widget`
2. Upload the files from `dist/widget/` to your CDN or static hosting
3. Update the script URLs in your HTML to point to your deployed files

### Example Deployment Structure

```
https://your-domain.com/
├── chatbot-widget.js
├── chatbot-embed.js
├── chatbot-combined.js
└── chatbot-widget.css
```

## Examples

Check the `examples/` directory for complete usage examples:

- `basic-usage.html` - Simple integration example
- `advanced-usage.html` - Interactive demo with controls
- `web-component-usage.html` - Web component usage

## Customization

### CSS Custom Properties

The widget uses CSS custom properties for theming:

```css
:root {
  --chatbot-primary: #3b82f6;
  --chatbot-button-color: #3b82f6;
  --chatbot-button-text-color: #ffffff;
}
```

### Custom Styling

You can override the widget styles by targeting the widget elements:

```css
chatbot-widget {
  /* Your custom styles */
}

chatbot-widget .chat-button {
  /* Custom button styles */
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Widget Not Loading

1. Check that the script URL is correct and accessible
2. Ensure your API URL is properly configured
3. Check the browser console for errors

### Styling Issues

1. Make sure the CSS file is loaded
2. Check for CSS conflicts with your existing styles
3. Verify the z-index is appropriate for your page

### API Connection Issues

1. Verify the API URL is correct
2. Check CORS settings on your backend
3. Ensure the API is accessible from the client

## Development

### Project Structure

```
src/
├── widget/
│   ├── chatbot-widget.tsx    # Main widget component
│   └── embed-script.ts       # Embed script
├── components/               # React components
├── hooks/                    # Custom hooks
├── types/                    # TypeScript types
└── ...
```

### Adding New Features

1. Modify the widget component in `src/widget/chatbot-widget.tsx`
2. Update the configuration interface if needed
3. Rebuild using `npm run build:widget`
4. Test with the example files

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact [your-email@domain.com] or create an issue in the repository.
