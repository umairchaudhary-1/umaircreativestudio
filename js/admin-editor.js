/* ============================================================
   ADMIN EDITOR — Umair Creative Studio
   Yeh chhota sa "mini admin panel" hai jo kisi bhi page ke
   andar text aur images change/replace karne dega, bina
   kisi backend/server ke.

   KAISE USE KARNA HAI:
   1) Is file ko js/admin-editor.js mein rehne dein (already hai).
   2) Jis page ko edit karna ho (index.html, about.html, etc),
      us ke </body> tag se THEEK PEHLE ye line dalein:

      <script src="js/admin-editor.js"></script>

   3) Woh page normal tareeke se browser mein khol lein
      (file:// se ya localhost se — dono chalega).
   4) Address bar mein page ke URL ke aakhir mein #admin laga dein.
      Misal: index.html#admin
      (Bina #admin ke normal visitors ko koi edit button nazar
      nahi aayega — panel chupa rehta hai.)
   5) Neeche-right corner mein ek "✏️ Edit Mode" button aayega.
      Usay click karein.
   6) Ab: 
        - Kisi bhi TEXT par click karke seedha type/change kar
          sakte hain (jaisay Word document mein).
        - Kisi bhi IMAGE (agar page mein <img> tag ho) par click
          karein to file choose karne ka box khulega — nayi image
          choose karte hi wahi purani image ki jagah lag jayegi.
   7) Jab sab kuch change ho jaye, "💾 Save / Download" button
      dabayein. Ek naya HTML file download ho jayega (same naam,
      jaisay index.html).
   8) Us download hui file ko apne folder mein purani file ki
      jagah paste/replace kar dein (overwrite). Bas — website
      update ho jayegi.

   NOTE: Yeh sab kuch aap ke apne computer/browser mein hota hai,
   koi data kahin bahar nahi jata.
============================================================ */

(function () {
  // Sirf #admin hone par hi panel dikhayega — public users ko nahi.
  if (location.hash.replace('#', '').split('?')[0] !== 'admin') return;

  let editing = false;

  // ---------- Floating toggle button ----------
  const bar = document.createElement('div');
  bar.id = 'admin-editor-bar';
  bar.innerHTML = `
    <button id="ae-toggle">✏️ Edit Mode: OFF</button>
    <button id="ae-save" style="display:none;">💾 Save / Download</button>
    <span id="ae-hint" style="display:none;">Text par click karke likhein • Image par click karke badlein</span>
  `;
  Object.assign(bar.style, {
    position: 'fixed',
    bottom: '18px',
    right: '18px',
    zIndex: 999999,
    background: '#111',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '10px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    boxShadow: '0 6px 20px rgba(0,0,0,.35)'
  });
  const styleBtn = (b) => Object.assign(b.style, {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontSize: '13px'
  });

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();

  function init() {
    document.body.appendChild(bar);
    styleBtn(document.getElementById('ae-toggle'));
    styleBtn(document.getElementById('ae-save'));
    document.getElementById('ae-toggle').addEventListener('click', toggleEdit);
    document.getElementById('ae-save').addEventListener('click', saveFile);
  }

  function toggleEdit() {
    editing = !editing;
    document.getElementById('ae-toggle').textContent = editing
      ? '✏️ Edit Mode: ON'
      : '✏️ Edit Mode: OFF';
    document.getElementById('ae-save').style.display = editing ? 'inline-block' : 'none';
    document.getElementById('ae-hint').style.display = editing ? 'inline' : 'none';

    // Sab text editable bana dein (admin bar chhor kar)
    document.body.contentEditable = editing ? 'true' : 'false';

    // Images par click-to-replace lagayein
    document.querySelectorAll('img').forEach((img) => {
      if (editing) {
        img.style.cursor = 'pointer';
        img.style.outline = '2px dashed #2563eb';
        img.addEventListener('click', onImageClick);
      } else {
        img.style.cursor = '';
        img.style.outline = '';
        img.removeEventListener('click', onImageClick);
      }
    });
  }

  function onImageClick(e) {
    if (!editing) return;
    e.preventDefault();
    e.stopPropagation();
    const img = e.currentTarget;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { img.src = ev.target.result; };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function saveFile() {
    // Admin bar ko hata kar HTML nikalein taake woh save file mein na jaye
    bar.style.display = 'none';
    document.body.contentEditable = 'false';

    const htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (location.pathname.split('/').pop() || 'page.html').replace('#admin', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Admin bar wapis dikhayein
    bar.style.display = 'flex';
    document.body.contentEditable = editing ? 'true' : 'false';
  }
})();
