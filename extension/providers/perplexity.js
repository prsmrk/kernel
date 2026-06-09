window.KernelProviders = window.KernelProviders || [];

window.KernelProviders.push({
  name: 'Perplexity',
  hostname: 'perplexity.ai',

  getEditor() {
    // TODO: verify selector against current Perplexity DOM
    // Perplexity may use a plain textarea — check both
    return (
      document.querySelector('textarea') ||
      document.querySelector('div[contenteditable="true"]') ||
      null
    );
  },

  // Perplexity may use a plain <textarea>, which requires direct .value assignment
  // rather than execCommand. Override injectText if needed after DOM verification.
});
