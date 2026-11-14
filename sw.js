// غيّر رقم النسخة عند كل تحديث كبير ليتجدد الكاش عند المستخدمين
const V = 'souq-v5';
const SHELL = ['./', 'index.html', 'offline.html', 'logo-mark.webp', 'login.html', 'manifest.webmanifest', 'theme.css', 'ui.css', 'shell.css', 'shell.js', 'app.js', 'esc.js', 'geo.js', 'auth.js', 'icons/icon-192.png', 'icons/icon-512.png'];
const CDN = /(^|\.)(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)$/;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;

  // لا نلمس Firebase أو المصادقة أو الـ API أبدًا: بيانات المستخدمين لا تُخزَّن
  if (!same && !CDN.test(url.hostname)) return;
  if (same && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/__/'))) return;

  // الصفحات: الشبكة أولًا، ثم النسخة المحفوظة، ثم صفحة "لا يوجد اتصال"
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then(m => m || caches.match('offline.html')))
    );
    return;
  }

  // الملفات الثابتة: من الكاش فورًا وتتحدث في الخلفية
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req)
        .then(res => {
          if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(V).then(c => c.put(req, copy)); }
          return res;
        })
        .catch(() => cached);
      return cached || fresh;
    })
  );
});
