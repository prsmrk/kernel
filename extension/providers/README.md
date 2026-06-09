# Kernel Providers

Each file in this directory registers one AI provider into the `window.KernelProviders` registry. `content.js` reads the registry on load, matches the current hostname, and delegates all DOM interaction to the matched provider.

## Provider Interface

```js
window.KernelProviders.push({
  // Display name (shown in button tooltip)
  name: 'Claude',

  // Matched against window.location.hostname via .includes()
  hostname: 'claude.ai',

  // Required. Return the editor element to inject text into, or null if not found.
  getEditor() {
    return document.querySelector('...');
  },

  // Optional. Override only if the default execCommand injection doesn't work
  // for this provider's editor. Receives the element returned by getEditor().
  // Must return true on success, false on failure.
  injectText(editor, text) {
    editor.value = text + editor.value;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  },
});
```

## Adding a New Provider

1. Create `providers/<name>.js` using the interface above.
2. Add the hostname to `host_permissions` in `manifest.json`.
3. Add the hostname to the `matches` array in `manifest.json`.
4. Add the file to the `js` array in `manifest.json` (before `content.js`).

## Provider Status

| Provider    | Status     | Notes                                      |
|-------------|------------|--------------------------------------------|
| Claude      | Working    | ProseMirror contenteditable, last-editor selector |
| ChatGPT     | Stub       | TODO: verify selector                      |
| Gemini      | Stub       | TODO: verify selector                      |
| Grok        | Stub       | TODO: verify selector                      |
| Perplexity  | Stub       | TODO: may need textarea override           |
