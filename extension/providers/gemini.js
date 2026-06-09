window.KernelProviders = window.KernelProviders || [];

window.KernelProviders.push({
  name: 'Gemini',
  hostname: 'gemini.google.com',

  getEditor() {
    // TODO: verify selector against current Gemini DOM
    // Gemini uses a rich-text input — inspect the prompt area for the correct selector
    return document.querySelector('div[contenteditable="true"]') || null;
  },
});
