# Chatbot Widget Usage Guide

This guide explains how to properly use the chatbot widget as a node module in your application.

## Installation

```bash
npm install my-chatbot-widget
```

## Usage

### 1. Import the CSS Styles (Required)

**IMPORTANT**: You must import the chatbot CSS file in your application for the UI to work correctly.

```css
/* In your main CSS file or component */
@import 'my-chatbot-widget/src/styles/chatbot.css';
```

Or in a React component:

```tsx
import 'my-chatbot-widget/src/styles/chatbot.css';
```

### 2. Import and Use the Chatbot Component

```tsx
import React, { useState } from 'react';
import { Chatbot } from 'my-chatbot-widget';
import 'my-chatbot-widget/src/styles/chatbot.css';

function App() {
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <div className="app">
      <button onClick={() => setShowChatbot(true)}>
        Open Chatbot
      </button>
      
      {showChatbot && (
        <Chatbot
          onClose={() => setShowChatbot(false)}
          isMaximized={isMaximized}
          onMaximizeChange={setIsMaximized}
        />
      )}
    </div>
  );
}

export default App;
```

### 3. Props

The `Chatbot` component accepts the following props:

```tsx
interface TChatbotProps {
  onClose: () => void;
  isMaximized?: boolean;
  onMaximizeChange?: (isMaximized: boolean) => void;
}
```

- `onClose`: Callback function called when the chatbot is closed
- `isMaximized`: Optional boolean to control the maximized state externally
- `onMaximizeChange`: Optional callback called when the maximize state changes

## Styling

### CSS Variables

The chatbot uses CSS custom properties (variables) for theming. All styles are scoped under the `.chatbot-container` class to prevent conflicts with your application's styles.

### Dark Mode

To enable dark mode, add the `dark` class to the chatbot container:

```tsx
<div className="dark">
  <Chatbot onClose={() => {}} />
</div>
```

### Custom Styling

You can override the chatbot's appearance by targeting the `.chatbot-container` class:

```css
.chatbot-container {
  --primary: #your-color;
  --background: #your-background;
  /* ... other variables */
}
```

## Troubleshooting

### UI Appears Broken or Unstyled

**Problem**: The chatbot appears with broken layout, missing colors, or incorrect styling.

**Solution**: Make sure you've imported the CSS file:
```tsx
import 'my-chatbot-widget/src/styles/chatbot.css';
```

### Styles Conflict with Your Application

**Problem**: The chatbot styles interfere with your application's styles.

**Solution**: All chatbot styles are scoped under `.chatbot-container`. If conflicts persist, increase the specificity of your application's CSS or use CSS modules.

### TypeScript Errors

**Problem**: TypeScript cannot find type definitions.

**Solution**: The package includes TypeScript definitions. Make sure your `tsconfig.json` includes the node_modules types:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

## Dependencies

The chatbot requires these peer dependencies in your application:

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "framer-motion": ">=10.0.0"
}
```

Make sure these are installed in your consuming application.

## Example Integration

Here's a complete example of integrating the chatbot into a Next.js application:

```tsx
// pages/_app.tsx or app/layout.tsx
import 'my-chatbot-widget/src/styles/chatbot.css';

// components/ChatbotWrapper.tsx
import React, { useState } from 'react';
import { Chatbot } from 'my-chatbot-widget';

export function ChatbotWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <>
      {/* Floating button to open chatbot */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        💬
      </button>

      {/* Chatbot modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Chatbot
            onClose={() => setIsOpen(false)}
            isMaximized={isMaximized}
            onMaximizeChange={setIsMaximized}
          />
        </div>
      )}
    </>
  );
}
```

## Support

If you encounter any issues, please check:

1. CSS file is properly imported
2. Required dependencies are installed
3. React version compatibility
4. No CSS conflicts with existing styles

For additional help, please refer to the project documentation or create an issue in the repository.
