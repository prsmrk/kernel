window.KernelProviders = window.KernelProviders || [];

window.KernelProviders.push({
  name: 'Grok',
  hostname: 'grok.com',

  getEditor() {
    // TODO: verify selector against current Grok DOM
    const editors = document.querySelectorAll('div[contenteditable="true"]');
    return editors.length > 0 ? editors[editors.length - 1] : null;
  },
});
