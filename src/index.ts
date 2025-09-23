// Main export for the chatbot library
export { Chatbot } from './components/chatbot';

// Export types that consumers might need
export type { TChatbotProps } from './types/types';

// Export utility functions if needed
export { cn } from './lib/utils';

// Export hooks that might be useful
export { useAutoMaximize } from './hooks/use-auto-maximize';
export { useDebounce } from './hooks/use-debounce';

// Note: Consumers should import the CSS file separately:
// import 'my-chatbot-widget/src/styles/chatbot.css';
