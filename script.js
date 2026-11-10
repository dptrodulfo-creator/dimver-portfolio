/* ==========================================================
   CONFIG — fill these in. Empty values are shown as disabled
   instead of pretending to work. Nothing here is invented.
   ========================================================== */
const CONFIG = {
  email:             'dptrodulfo@catsu.edu.ph',
  cv: '',             // path or URL to your CV, e.g. 'assets/Dimver-Rodulfo-CV.pdf'          // e.g. 'you@example.com'
  formEndpoint:      'https://formspree.io/f/mbggnvde',  
  links: {
    github:          'https://github.com/dptrodulfo-creator',
    linkedin:         'https://www.linkedin.com/in/dimver-paul-rodulfo-80745344a/', 
    taskflowRepo: '', taskflowDemo: '',
    boardnearRepo: '', boardnearDemo: '',
    medtrackRepo: '', medtrackDemo: ''
  }
};

document.documentElement.classList.add('js');
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ---------- Icons ---------- */
if (window.lucide) lucide.createIcons();

/* ---------- Links from CONFIG ---------- */
function applyLinks() {
  let missing = false;
  $$('[data-link]').forEach(el => {
    const key = el.dataset.link;
    const url = key === 'email' ? (CONFIG.email && `mailto:${CONFIG.email}`) : key === 'cv' ? CONFIG.cv : CONFIG.links[key];
    if (url) {
      el.href = url;
      if (el.dataset.text === 'email') el.textContent = CONFIG.email;
    } else {
      missing = true;
      el.removeAttribute('href');
      el.setAttribute('aria-disabled', 'true');
      el.dataset.disabled = 'true';
      el.removeAttribute('target');
      el.title = key === 'cv' ? 'CV not added yet' : 'Link not set up yet';
      el.addEventListener('click', e => e.preventDefault());
    }
  });
  if (missing) $('#linkNote').hidden = false;
}
applyLinks();

/* ---------- Theme (saved in LocalStorage) ---------- */
const root = document.documentElement;
const themeBtn = $('#themeToggle');
function setTheme(theme) {
  root.dataset.theme = theme;
  try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
  const dark = theme === 'dark';
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  themeBtn.setAttribute('aria-checked', String(dark));
  $('#themeLabel').textContent = dark ? 'Light mode' : 'Dark mode';
}
themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
setTheme(root.dataset.theme === 'dark' ? 'dark' : 'light'); // default is light

/* ---------- Mobile navigation ---------- */
const menuBtn = $('#menuBtn');
function toggleNav(open) {
  document.body.classList.toggle('nav-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}
menuBtn.addEventListener('click', () => toggleNav(!document.body.classList.contains('nav-open')));
$('#scrim').addEventListener('click', () => toggleNav(false));
$$('.nav-link').forEach(l => l.addEventListener('click', () => toggleNav(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleNav(false); });

/* ---------- Active nav highlighting ---------- */
const sections = $$('main section[id]');
const navLinks = $$('.nav-link');
let clickedId = null;
navLinks.forEach(l => l.addEventListener('click', () => { clickedId = l.getAttribute('href').slice(1); }));
function updateActiveLink() {
  const y = window.scrollY + window.innerHeight * 0.35;
  const passed = sections.filter(s => s.getBoundingClientRect().top + window.scrollY <= y);
  let current = (passed.length ? passed : [sections[0]]);
  const topOf = s => Math.round(s.getBoundingClientRect().top + window.scrollY);
  const maxTop = Math.max(...current.map(topOf));
  const tied = current.filter(s => topOf(s) === maxTop); // Skills and About share a row
  let id = tied[0].id;
  if (clickedId && tied.some(s => s.id === clickedId)) id = clickedId; else clickedId = null;
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) id = sections[sections.length - 1].id;
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
}

/* ---------- Back to top ---------- */
const toTop = $('#toTop');
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 600);
  updateActiveLink();
}, { passive: true });
updateActiveLink();

/* ---------- Scroll reveal ---------- */
const revealEls = $$('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

/* ---------- Footer year ---------- */
$('#year').textContent = new Date().getFullYear();

/* ---------- Contact form ---------- */
const form = $('#contactForm');
const status = $('#formStatus');
function setStatus(msg, type) { status.textContent = msg; status.className = `form-status ${type || ''}`; }

form.addEventListener('submit', async e => {
  e.preventDefault();
  const fields = [...form.elements].filter(f => f.name);
  let valid = true;
  fields.forEach(f => {
    const ok = f.value.trim() && f.checkValidity();
    f.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (!valid) return setStatus('Please fill in every field with a valid value.', 'error');

    // No form service connected: fall back to the visitor's own email app.
  if (!CONFIG.formEndpoint) {
    if (!CONFIG.email) {
      return setStatus('The contact form is not set up yet.dptrodulfo@catsu.edu.ph.js (CONFIG.email).', 'error');
    }
    const d = Object.fromEntries(new FormData(form));
    const body = `${d.message}\n\n— ${d.name} (${d.email})`;
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
    return setStatus('Opening your email app. Press Send there to deliver your message.', 'ok');
  }

  setStatus('Sending…');
  try {
    const res = await fetch(CONFIG.formEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    form.reset();
    setStatus('Message sent. Thank you!', 'ok');
  } catch (err) {
    setStatus('Message could not be sent. Please try again or use the email link.', 'error');
  }
});