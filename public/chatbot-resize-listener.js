(function () {
  "use strict";

  // Chatbot resize listener - automatically handles iframe resizing
  window.addEventListener("message", function (e) {
    if (e.data && e.data.type === "CHATBOT_RESIZE") {
      const iframe = document.querySelector('iframe[src*="/widget"]');
      if (iframe && e.data.styles) {
        Object.assign(iframe.style, e.data.styles);
      }
    }
  });

  console.log("Chatbot resize listener initialized");
})();
