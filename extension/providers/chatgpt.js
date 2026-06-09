window.KernelProviders = window.KernelProviders || [];

window.KernelProviders.push({
  name: 'ChatGPT',
  hostname: 'chatgpt.com',

  getEditor() {
    // TODO: verify selector against current ChatGPT DOM
    // ChatGPT also uses a ProseMirror contenteditable editor
    const editors = document.querySelectorAll('div[contenteditable="true"]');
    return editors.length > 0 ? editors[editors.length - 1] : null;
  },
});
