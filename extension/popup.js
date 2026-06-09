const FIELDS = [
  'name', 'description', 'website', 'industry',
  'targetUsers', 'revenueModel', 'stage', 'goals',
  'competitors', 'brandVoice', 'additionalContext'
];

async function loadSaved() {
  const data = await chrome.storage.local.get('kernelProject');
  const project = data.kernelProject || {};
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el && project[id]) el.value = project[id];
  });
}

document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const project = {};
  FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (el) project[id] = el.value.trim();
  });

  await chrome.storage.local.set({ kernelProject: project });

  const btn = document.getElementById('saveBtn');
  btn.textContent = '✓ Saved!';
  btn.classList.add('saved');

  setTimeout(() => {
    btn.textContent = 'Save Context';
    btn.classList.remove('saved');
  }, 2000);
});

loadSaved();
