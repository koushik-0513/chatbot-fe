// CSS Classes and styling
export const LAYOUT = {
  MESSAGE_MAX_WIDTH: "max-w-[70%]",
  PROSE_SIZE: "prose-sm",
} as const;

export const COLLAPSED_IFRAME_STYLES = {
  width: "60px",
  height: "60px",
  zIndex: 9999,
  borderRadius: "12px",
  position: "fixed",
  bottom: "20px",
  right: "20px",
  maxWidth: "none",
  maxHeight: "none",
} as const;

export const DEFAULT_IFRAME_STYLES = {
  width: "400px",
  height: "700px",
  borderRadius: "12px",
  maxWidth: "90vw",
  maxHeight: "90vh",
} as const;

export const INITIAL_FRAME_STYLES = {
  width: "60px",
  height: "60px",
  zIndex: 9999,
  borderRadius: "12px",
  position: "fixed",
} as const;

export const MAXIMIZED_IFRAME_STYLES = {
  width: "500px",
  height: "900px",
  borderRadius: "12px",
  maxWidth: "100%",
  maxHeight: "100%",
} as const;
