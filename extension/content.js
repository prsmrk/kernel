// Kernel — content script orchestrator
// Provider files run first (see manifest.json) and register into window.KernelProviders.
// This file contains zero provider-specific code.

const BUTTON_ID = 'kernel-inject-btn';

// ─── Provider lookup ────────────────────────────────────────────────────────

function getProvider() {
  return (window.KernelProviders || []).find(p =>
    window.location.hostname.includes(p.hostname)
  );
}

// ─── Context formatting ─────────────────────────────────────────────────────

function formatContext(project) {
  const fields = [
    ['Project',            project.name],
    ['Description',        project.description],
    ['Website',            project.website],
    ['Industry',           project.industry],
    ['Target Users',       project.targetUsers],
    ['Revenue Model',      project.revenueModel],
    ['Stage',              project.stage],
    ['Goals',              project.goals],
    ['Competitors',        project.competitors],
    ['Brand Voice',        project.brandVoice],
    ['Additional Context', project.additionalContext],
  ].filter(([, v]) => v && v.trim());

  if (fields.length === 0) return null;

  const lines = fields.map(([k, v]) => `${k}: ${v}`).join('\n');
  return `[Project Context]\n${lines}\n\n---\n\n`;
}

// ─── Base text injection (works for ProseMirror contenteditable editors) ────
// Providers can override injectText() if their editor needs different handling.

function baseInjectText(editor, text) {
  editor.focus();

  const sel = window.getSelection();
  const range = document.createRange();
  range.setStart(editor, 0);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);

  const ok = document.execCommand('insertText', false, text);

  if (!ok) {
    // Fallback for editors that block execCommand
    editor.textContent = text + editor.textContent;
    editor.dispatchEvent(new Event('input', { bubbles: true }));
  }

  return true;
}

function injectContext(provider, contextText) {
  const editor = provider.getEditor();
  if (!editor) return false;

  if (typeof provider.injectText === 'function') {
    return provider.injectText(editor, contextText);
  }

  return baseInjectText(editor, contextText);
}

// ─── Button UI ───────────────────────────────────────────────────────────────

function setStatus(btn, message, color) {
  btn.textContent = message;
  btn.style.background = color;
  btn.style.transition = 'none';
  setTimeout(() => {
    btn.textContent = '⚡ Inject Context';
    btn.style.background = '#6366f1';
    btn.style.transition = 'background 0.15s';
  }, 2500);
}

function createButton(provider) {
  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.textContent = '⚡ Inject Context';
  btn.title = `Kernel — ${provider.name}`;
  btn.style.cssText = `
    position: fixed;
    bottom: 96px;
    right: 20px;
    z-index: 10000;
    background: #6366f1;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 14px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(0,0,0,0.35);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    transition: background 0.15s;
    letter-spacing: 0.01em;
  `;

  btn.addEventListener('mouseenter', () => { btn.style.background = '#4f46e5'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = '#6366f1'; });

  btn.addEventListener('click', async () => {
    const data = await chrome.storage.local.get('kernelProject');
    const project = data.kernelProject;

    if (!project || !project.name) {
      setStatus(btn, '⚠ Open popup to save context', '#f59e0b');
      return;
    }

    const contextText = formatContext(project);
    if (!contextText) {
      setStatus(btn, '⚠ No fields filled in', '#f59e0b');
      return;
    }

    const success = injectContext(provider, contextText);
    if (success) {
      setStatus(btn, '✓ Context injected!', '#10b981');
    } else {
      setStatus(btn, '⚠ Click into the chat first', '#f59e0b');
    }
  });

  return btn;
}

// ─── Init ────────────────────────────────────────────────────────────────────

function init() {
  if (document.getElementById(BUTTON_ID)) return;

  const provider = getProvider();
  if (!provider) return;

  if (!provider.getEditor()) return;

  document.body.appendChild(createButton(provider));
}

// Re-run on DOM changes to handle SPA navigation
const observer = new MutationObserver(() => {
  if (!document.getElementById(BUTTON_ID)) init();
});

observer.observe(document.body, { childList: true, subtree: true });

init();
