(function () {
  'use strict';
  // تهريب النصوص قبل وضعها في innerHTML: استخدمها مع أي نص يكتبه المستخدم
  window.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  window.toast = function (msg) {
    var t = document.createElement('div');
    t.className = 'souq-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 2600);
  };
  // اهتزاز خفيف عند لمس الأزرار والشريط السفلي
  document.addEventListener('click', function (e) {
    if (navigator.vibrate && e.target.closest('button,.nav-item,a.cat-box')) navigator.vibrate(8);
  }, { passive: true });
  // شريط عدم الاتصال
  var bar;
  function net() {
    if (!navigator.onLine) {
      if (!bar) { bar = document.createElement('div'); bar.className = 'souq-offline'; bar.setAttribute('role', 'status'); bar.textContent = 'أنت غير متصل بالإنترنت'; document.body.appendChild(bar); }
    } else if (bar) { bar.remove(); bar = null; }
  }
  addEventListener('online', net); addEventListener('offline', net); net();
  if ('serviceWorker' in navigator) addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
})();

// تسجيل خروج فعلي من Firebase (يستبدل أي نسخة قديمة في الصفحات)
window.logout = async function () {
  if (!confirm('هل تريد تسجيل الخروج؟')) return;
  try { var m = await import('./auth.js'); await m.signOutUser(); } catch (e) {}
  location.href = 'login.html';
};
