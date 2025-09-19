// Chatbot Widget Embed Script
// This script can be included in any website to add the chatbot widget

interface ChatbotConfig {
  apiUrl?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  theme?: "light" | "dark";
  primaryColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  width?: string;
  height?: string;
  zIndex?: number;
  showWelcomeMessage?: boolean;
  welcomeMessage?: string;
}

interface ChatbotWidget {
  init: (config?: ChatbotConfig) => void;
  destroy: () => void;
  updateConfig: (config: Partial<ChatbotConfig>) => void;
  show: () => void;
  hide: () => void;
}

class ChatbotEmbedScript {
  private widgetElement: HTMLElement | null = null;
  private config: ChatbotConfig = {};
  private isInitialized = false;
  private scriptUrl: string;

  constructor(scriptUrl: string) {
    this.scriptUrl = scriptUrl;
  }

  private async loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${this.scriptUrl}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = this.scriptUrl;
      script.type = "module";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load chatbot script"));
      
      document.head.appendChild(script);
    });
  }

  private async loadStyles(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if styles are already loaded
      if (document.querySelector(`link[href*="chatbot-widget"]`)) {
        resolve();
        return;
      }

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = this.scriptUrl.replace(".js", ".css");
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Don't fail if CSS doesn't exist
      
      document.head.appendChild(link);
    });
  }

  private createWidgetElement(): HTMLElement {
    const widget = document.createElement("chatbot-widget");
    
    // Set attributes based on config
    if (this.config.apiUrl) widget.setAttribute("api-url", this.config.apiUrl);
    if (this.config.position) widget.setAttribute("position", this.config.position);
    if (this.config.theme) widget.setAttribute("theme", this.config.theme);
    if (this.config.primaryColor) widget.setAttribute("primary-color", this.config.primaryColor);
    if (this.config.buttonColor) widget.setAttribute("button-color", this.config.buttonColor);
    if (this.config.buttonTextColor) widget.setAttribute("button-text-color", this.config.buttonTextColor);
    if (this.config.width) widget.setAttribute("width", this.config.width);
    if (this.config.height) widget.setAttribute("height", this.config.height);
    if (this.config.zIndex) widget.setAttribute("z-index", this.config.zIndex.toString());
    if (this.config.showWelcomeMessage !== undefined) {
      widget.setAttribute("show-welcome", this.config.showWelcomeMessage.toString());
    }
    if (this.config.welcomeMessage) widget.setAttribute("welcome-message", this.config.welcomeMessage);

    return widget;
  }

  async init(config: ChatbotConfig = {}): Promise<void> {
    if (this.isInitialized) {
      console.warn("Chatbot widget is already initialized");
      return;
    }

    this.config = { ...config };

    try {
      // Load the widget script and styles
      await Promise.all([
        this.loadScript(),
        this.loadStyles()
      ]);

      // Wait for custom element to be defined
      await customElements.whenDefined("chatbot-widget");

      // Create and append widget element
      this.widgetElement = this.createWidgetElement();
      document.body.appendChild(this.widgetElement);

      this.isInitialized = true;
      console.log("Chatbot widget initialized successfully");
    } catch (error) {
      console.error("Failed to initialize chatbot widget:", error);
      throw error;
    }
  }

  destroy(): void {
    if (this.widgetElement && this.widgetElement.parentNode) {
      this.widgetElement.parentNode.removeChild(this.widgetElement);
      this.widgetElement = null;
    }
    this.isInitialized = false;
    console.log("Chatbot widget destroyed");
  }

  updateConfig(newConfig: Partial<ChatbotConfig>): void {
    if (!this.isInitialized) {
      console.warn("Chatbot widget is not initialized");
      return;
    }

    this.config = { ...this.config, ...newConfig };
    
    if (this.widgetElement && "updateConfig" in this.widgetElement) {
      (this.widgetElement as any).updateConfig(newConfig);
    }
  }

  show(): void {
    if (!this.isInitialized) {
      console.warn("Chatbot widget is not initialized");
      return;
    }

    if (this.widgetElement) {
      this.widgetElement.style.display = "block";
    }
  }

  hide(): void {
    if (!this.isInitialized) {
      console.warn("Chatbot widget is not initialized");
      return;
    }

    if (this.widgetElement) {
      this.widgetElement.style.display = "none";
    }
  }
}

// Global initialization function
declare global {
  interface Window {
    ChatbotWidget: ChatbotWidget;
  }
}

// Auto-initialize if data attributes are present
function autoInitialize() {
  const script = document.currentScript as HTMLScriptElement;
  if (!script) return;

  const config: ChatbotConfig = {};
  
  // Read configuration from script tag attributes
  const attributes = [
    "api-url", "position", "theme", "primary-color", "button-color", 
    "button-text-color", "width", "height", "z-index", "show-welcome", "welcome-message"
  ];

  attributes.forEach(attr => {
    const value = script.getAttribute(`data-${attr}`);
    if (value) {
      const key = attr.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) as keyof ChatbotConfig;
      if (key === "zIndex") {
        (config as any)[key] = parseInt(value);
      } else if (key === "showWelcomeMessage") {
        (config as any)[key] = value === "true";
      } else {
        (config as any)[key] = value;
      }
    }
  });

  // Get script URL
  const scriptUrl = script.src || script.getAttribute("data-script-url");
  if (!scriptUrl) {
    console.error("Chatbot widget: script URL not found");
    return;
  }

  // Initialize widget
  const widget = new ChatbotEmbedScript(scriptUrl);
  widget.init(config);

  // Expose to global scope
  window.ChatbotWidget = widget as any;
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoInitialize);
} else {
  autoInitialize();
}

export { ChatbotEmbedScript, type ChatbotConfig, type ChatbotWidget };
