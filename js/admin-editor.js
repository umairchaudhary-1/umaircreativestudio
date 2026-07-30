(function () {
  // Check if #admin is in the URL
  if (window.location.hash !== '#admin') return;

  let isEditing = false;

  // Create UI Toolbar
  const toolbar = document.createElement('div');
  toolbar.id = 'admin-editor-toolbar';
  toolbar.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#111827;color:#fff;padding:12px 18px;border-radius:10px;box-shadow:0 10px 25px rgba(0,0,0,0.4);font-family:sans-serif;display:flex;gap:12px;align-items:center;';

  const statusBtn = document.createElement('button');
  statusBtn.innerText = '✏️ Edit Mode: OFF';
  statusBtn.style.cssText = 'background:#374151;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:bold;';

  const saveBtn = document.createElement('button');
  saveBtn.innerText = '💾 Save / Download HTML';
  saveBtn.style.cssText = 'background:#10B981;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:bold;display:none;';

  toolbar.appendChild(statusBtn);
  toolbar.appendChild(saveBtn);
  document.body.appendChild(toolbar);

  // Toggle Edit Mode
  statusBtn.addEventListener('click', function () {
    isEditing = !isEditing;
    if (isEditing) {
      statusBtn.innerText = '✏️ Edit Mode: ON';
      statusBtn.style.background = '#2563EB';
      saveBtn.style.display = 'inline-block';
      toggleEditing(true);
    } else {
      statusBtn.innerText = '✏️ Edit Mode: OFF';
      statusBtn.style.background = '#374151';
      saveBtn.style.display = 'none';
      toggleEditing(false);
    }
  });

  function toggleEditing(enable) {
    const targets = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, li, td, th');
    targets.forEach(el => {
      if (!toolbar.contains(el)) {
        el.contentEditable = enable ? 'true' : 'false';
        el.style.outline = enable ? '1px dashed #3B82F6' : 'none';
      }
    });
  }

  // Save / Download Execution
  saveBtn.addEventListener('click', function () {
    // Temporarily turn off edit outlines
    toggleEditing(false);

    // Clone current HTML
    const cloneDoc = document.documentElement.cloneNode(true);

    // Remove editor toolbar from cloned HTML
    const cloneToolbar = cloneDoc.querySelector('#admin-editor-toolbar');
    if (cloneToolbar) cloneToolbar.remove();

    // Clean inline attributes added during editing
    const editables = cloneDoc.querySelectorAll('[contenteditable]');
    editables.forEach(el => {
      el.removeAttribute('contenteditable');
      if (el.getAttribute('style') === 'none') {
        el.removeAttribute('style');
      }
    });

    const fullHtml = '<!DOCTYPE html>\n' + cloneDoc.outerHTML;

    // Detect File Name (e.g. index.html, about.html)
    let pageName = window.location.pathname.split('/').pop();
    if (!pageName || pageName === '') pageName = 'index.html';
    if (!pageName.endsWith('.html')) pageName += '.html';

    // Trigger File Download
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = pageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Re-enable editing UI
    toggleEditing(true);
    alert('Aap ki updated file download ho gayi hai! Is file ko GitHub par upload karke old file replace kar dein.');
  });
})();
