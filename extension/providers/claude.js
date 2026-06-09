window.KernelProviders = window.KernelProviders || [];

window.KernelProviders.push({
  name: 'Claude',
  hostname: 'claude.ai',

  getEditor() {
    // Claude uses ProseMirror — multiple contenteditable divs may exist.
    // The main prompt input is consistently the last one in the DOM.
    const editors = document.querySelectorAll('div[contenteditable="true"]');
    return editors.length > 0 ? editors[editors.length - 1] : null;
  },
});
