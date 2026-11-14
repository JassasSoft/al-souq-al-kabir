// هيكل موحّد لكل الصفحات: قائمة جانبية + شريط سفلي + مساعد آلي (إجابات جاهزة)
(function () {
  'use strict';
  var page = location.pathname.split('/').pop() || 'index.html';
  var ON_INDEX = page === 'index.html';
  var NO_NAV = { 'chat.html': 1, 'ad.html': 1, 'admin.html': 1, 'admin-premium.html': 1, 'login.html': 1, 'register.html': 1, 'splash.html': 1, 'welcome.html': 1, 'offline.html': 1, 'bot.html': 1, 'subscribe.html': 1, 'add-product.html': 1 };
  var LEGACY = { 'policy.html': 1, 'notifications.html': 1, 'plans.html': 1, 'trader-dashboard.html': 1, 'about.html': 1 };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, text, attrs) {
    var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text;
    if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e;
  }
  function icon(c) { var i = el('i', c); i.setAttribute('aria-hidden', 'true'); return i; }

  // 1) إزالة المكونات القديمة المتكررة في الصفحات القديمة
  if (LEGACY[page]) {
    ['.bottom-nav', '.parent-bottom-navbar', '#sidebarOverlay', '#sidebarContainer', '.sidebar-overlay', '#menu-overlay', '#overlay', '.sidebar', '#sidebar', '.smart-assistant', '.assistant-toggle', '#smartAssistant']
      .forEach(function (s) { document.querySelectorAll(s).forEach(function (n) { n.remove(); }); });
  }
  // صور كسولة لتخفيف التحميل
  document.querySelectorAll('img:not([loading])').forEach(function (i, n) { if (n > 1) { i.loading = 'lazy'; i.decoding = 'async'; } });

  // 2) القائمة الجانبية
  var veil = el('div', 's-veil'), drawer = el('aside', 's-drawer', null, { 'aria-label': 'القائمة الرئيسية' });
  drawer.inert = true;
  var head = el('div', 's-dh'); head.append(el('b', null, 'القائمة'));
  var x = el('button', 's-x', null, { type: 'button', 'aria-label': 'إغلاق القائمة' }); x.append(icon('fa-solid fa-xmark')); head.append(x);
  var user = el('a', 's-user', null, { href: 'login.html' }), av = el('div', 's-av'), uw = el('div'), un = el('b', null, 'تسجيل الدخول'), um = el('small', null, 'أنشئ حسابك أو سجّل دخولك');
  av.append(icon('fa-solid fa-user')); uw.append(un, um); user.append(av, uw);
  var menu = el('nav', 's-menu');
  [['index.html', 'fa-solid fa-house', 'الرئيسية'], ['category.html', 'fa-solid fa-table-cells-large', 'الأقسام والبحث'], ['add-product.html', 'fa-solid fa-circle-plus', 'إضافة إعلان'],
   ['my-ads.html', 'fa-solid fa-list', 'إعلاناتي'], ['chat.html', 'fa-regular fa-comments', 'المحادثات'], ['plans.html', 'fa-solid fa-crown', 'الباقات والاشتراكات'],
   ['trader-dashboard.html', 'fa-solid fa-store', 'لوحة التاجر'], ['about.html', 'fa-solid fa-circle-info', 'عن السوق الكبير'], ['policy.html', 'fa-solid fa-shield-halved', 'الخصوصية والشروط']]
    .forEach(function (m) { var a = el('a', null, null, { href: m[0] }); a.append(icon(m[1]), document.createTextNode(m[2])); menu.append(a); });
  var out = el('button', null, null, { type: 'button' }); out.append(icon('fa-solid fa-right-from-bracket'), document.createTextNode('تسجيل الخروج')); out.hidden = true;
  out.onclick = function () { if (window.logout) window.logout(); };
  menu.append(out);
  drawer.append(head, user, menu);
  function toggle(open) { drawer.classList.toggle('open', open); veil.classList.toggle('open', open); drawer.inert = !open; if (open) x.focus(); }
  x.onclick = veil.onclick = function () { toggle(false); };
  addEventListener('keydown', function (e) { if (e.key === 'Escape') { toggle(false); bot.classList.remove('open'); } });
  // أي زر قائمة قديم في الصفحات يفتح القائمة الموحدة
  window.toggleSidebar = window.toggleMenu = window.openSidebar = window.openSidebarDrawer = function () { toggle(!drawer.classList.contains('open')); };
  window.closeSidebar = window.closeSidebarDrawer = function () { toggle(false); };

  // 3) المساعد الآلي: إجابات جاهزة دقيقة (ليس ذكاءً اصطناعيًا)
  var QA = [
    ['كيف أنشر إعلانًا؟', 'اضغط زر + في الشريط السفلي، اختر القسم والموقع، اكتب الوصف والسعر وأضف رقم واتساب، ثم انشر. يلزم تسجيل الدخول.'],
    ['كيف أتواصل مع البائع؟', 'من صفحة الإعلان اضغط زر واتساب، أو راسله داخل التطبيق.'],
    ['التاجر والمستفيد', 'التاجر ينشر بضائعه وخدماته ويتابع إعلاناته ويشترك في الباقات. المستفيد يتصفح ويتواصل مع البائعين بسهولة وأمان. ويمكنك تغيير نوع حسابك من صفحة حسابي.'],
    ['الباقات والاشتراك', 'تجد الباقات وأسعارها في صفحة الباقات والاشتراكات من القائمة الجانبية.'],
    ['الإبلاغ عن إعلان', 'افتح الإعلان واضغط "الإبلاغ عن الإعلان"، ويصل بلاغك لفريق الإدارة.'],
    ['نصائح الأمان', 'عاين السلعة قبل الدفع، قابل البائع في مكان عام، ولا تشارك كلمة مرورك أو أي رمز تحقق مع أحد.']
  ];
  var KW = [[/إعلان|نشر|انشر|أضيف|اضيف/, 0], [/تواصل|واتس|رقم|اكلم|أكلم/, 1], [/تاجر|مستفيد|حساب/, 2], [/باقة|اشتراك|سعر|اسعار|أسعار/, 3], [/بلاغ|ابلغ|أبلغ|مخالف/, 4], [/أمان|امان|نصب|احتيال|دفع/, 5]];
  var bot = el('section', 's-bot', null, { 'aria-label': 'المساعد الآلي' });
  var bh = el('div', 's-bh'), bt = el('div'); bt.append(document.createTextNode('مساعد السوق الكبير'), el('small', null, 'مساعد آلي بإجابات جاهزة'));
  var bx = el('button', 's-x', null, { type: 'button', 'aria-label': 'إغلاق' }); bx.append(icon('fa-solid fa-xmark')); bh.append(bt, bx);
  var bb = el('div', 's-bb'), bq = el('div', 's-q'), bf = el('form', 's-bf'), bi = el('input', null, null, { placeholder: 'اكتب سؤالك...', 'aria-label': 'سؤالك' }), bs = el('button', null, 'إرسال', { type: 'submit' });
  bf.append(bi, bs); bot.append(bh, bb, bq, bf);
  function say(t, c) { bb.append(el('div', 's-m ' + c, t)); bb.scrollTop = bb.scrollHeight; }
  function ask(t) {
    say(t, 'u'); var i = -1;
    QA.forEach(function (q, n) { if (q[0] === t) i = n; });
    if (i < 0) KW.forEach(function (k) { if (i < 0 && k[0].test(t)) i = k[1]; });
    say(i >= 0 ? QA[i][1] : 'لم أفهم سؤالك تمامًا. اختر أحد الأسئلة السريعة، أو راجع صفحة "عن السوق الكبير".', 'b');
  }
  QA.forEach(function (q) { var b = el('button', null, q[0], { type: 'button' }); b.onclick = function () { ask(q[0]); }; bq.append(b); });
  bf.onsubmit = function (e) { e.preventDefault(); var v = bi.value.trim(); if (v) { bi.value = ''; ask(v.slice(0, 200)); } };
  bx.onclick = function () { bot.classList.remove('open'); };
  say('أهلًا بك في السوق الكبير! اختر سؤالًا من الأسفل.', 'b');
  var fab = el('button', 's-fab', null, { type: 'button', 'aria-label': 'المساعد' }); fab.append(icon('fa-solid fa-headset'));
  fab.onclick = function () { bot.classList.toggle('open'); };

  if (!ON_INDEX) document.body.append(veil, drawer);

  // 4) الشريط السفلي والمساعد
  if (ON_INDEX) { document.body.append(fab, bot); }
  else if (!NO_NAV[page]) {
    var nav = el('nav', 's-nav', null, { 'aria-label': 'التنقل' });
    [['index.html', 'fa-solid fa-house', 'الرئيسية', ['index.html']], ['category.html', 'fa-solid fa-table-cells-large', 'الأقسام', ['category.html']], ['add-product.html', 'fa-solid fa-plus', 'أضف', ['add-product.html'], 'add'],
     ['chat.html', 'fa-regular fa-comments', 'المحادثات', ['chat.html']], ['profile.html', 'fa-regular fa-user', 'حسابي', ['profile.html', 'my-ads.html']]]
      .forEach(function (n) { var a = el('a', n[4] || '', null, { href: n[0] }); if (n[3].indexOf(page) > -1) { a.classList.add('on'); a.setAttribute('aria-current', 'page'); } a.append(icon(n[1]), document.createTextNode(n[2])); nav.append(a); });
    document.body.append(nav, fab, bot); document.body.classList.add('s-has-nav');
  }

  // 5) اسم المستخدم + اهتزاز خفيف
  import('./auth.js').then(function (m) {
    m.onUser(function (u) {
      un.textContent = u ? (u.displayName || 'عضو') : 'تسجيل الدخول';
      um.textContent = u ? (u.email || '') : 'أنشئ حسابك أو سجّل دخولك';
      user.setAttribute('href', u ? 'profile.html' : 'login.html'); out.hidden = !u;
      av.textContent = u && u.displayName ? u.displayName.trim().charAt(0) : ''; if (!av.textContent) av.append(icon('fa-solid fa-user'));
    });
  }).catch(function () {});
})();
