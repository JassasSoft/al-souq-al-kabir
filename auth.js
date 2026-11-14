// نظام الدخول المشترك: البريد الإلكتروني + كلمة المرور عبر Firebase Auth
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const app = getApps()[0] || initializeApp({
  apiKey: "AIzaSyB8WmKff45q2jRlFm5xkGytJgt-_5Cx3J8",
  authDomain: "alsouq-alkabeer-2052c.firebaseapp.com",
  projectId: "alsouq-alkabeer-2052c",
  storageBucket: "alsouq-alkabeer-2052c.firebasestorage.app",
  messagingSenderId: "835295635291",
  appId: "1:835295635291:web:e1f09baff25b50fac11c7e"
});
export const firebaseApp = app;
export const auth = getAuth(app);

// رقم واتساب: 0912345678 | 912345678 | +249912345678  ->  249912345678
export function normalizePhone(raw) {
  const plus = String(raw || '').trim().startsWith('+');
  let d = String(raw || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (plus) return d.length >= 8 && d.length <= 15 ? d : null;
  if (d.startsWith('249') && d.length === 12) return d;
  if (d.startsWith('0') && d.length === 10) return '249' + d.slice(1);
  if (d.length === 9) return '249' + d;
  return null;
}
const bridge = u => { try { localStorage.setItem('user_device_id', u.uid); } catch (e) {} };

const ERR = {
  'auth/invalid-credential': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth/user-not-found': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth/wrong-password': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
  'auth/missing-password': 'أدخل كلمة المرور',
  'auth/email-already-in-use': 'هذا البريد مسجل من قبل. جرّب تسجيل الدخول',
  'auth/weak-password': 'كلمة المرور ضعيفة: استخدم ٦ أحرف على الأقل',
  'auth/too-many-requests': 'محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة',
  'auth/network-request-failed': 'تحقق من اتصالك بالإنترنت',
  'auth/operation-not-allowed': 'تسجيل الدخول غير مفعّل في Firebase (فعّل Email/Password)',
  'app/bad-phone': 'رقم الواتساب غير صحيح. مثال: 0912345678'
};
export const arabicError = e => ERR[e && e.code] || 'حدث خطأ غير متوقع. حاول مرة أخرى';

export async function signUp({ email, password, name, type, whatsapp }) {
  let w = null;
  if (whatsapp && whatsapp.trim()) { w = normalizePhone(whatsapp); if (!w) throw { code: 'app/bad-phone' }; }
  const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
  await updateProfile(user, { displayName: name });
  sendEmailVerification(user).catch(() => {});
  try {
    const data = { name, email: user.email, type, createdAt: serverTimestamp() };
    if (w) data.whatsapp = w;
    await setDoc(doc(getFirestore(app), 'users', user.uid), data);
  } catch (e) { console.warn('users doc:', e.code); }
  bridge(user); return user;
}
export async function signIn({ email, password }) {
  const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
  bridge(user); return user;
}
export const resetPassword = email => sendPasswordResetEmail(auth, email.trim());
export async function getProfile(uid) {
  try { const s = await getDoc(doc(getFirestore(app), 'users', uid)); return s.exists() ? s.data() : null; } catch (e) { return null; }
}
export async function signOutUser() {
  try { localStorage.removeItem('user_device_id'); } catch (e) {}
  await signOut(auth);
}
export const onUser = cb => onAuthStateChanged(auth, cb);

// حارس الصفحات: يحوّل الزائر لصفحة الدخول ويرجعه بعدها. admin:true يتطلب وثيقة admins/{uid} في Firestore
export function requireAuth({ admin = false } = {}) {
  const reveal = () => { const g = document.getElementById('authGate'); if (g) g.remove(); };
  if (!admin) setTimeout(reveal, 6000);
  onAuthStateChanged(auth, async u => {
    if (!u) { location.replace('login.html?next=' + encodeURIComponent(location.pathname.split('/').pop() + location.search)); return; }
    bridge(u);
    if (admin) {
      let ok = false;
      try { ok = (await getDoc(doc(getFirestore(app), 'admins', u.uid))).exists(); } catch (e) {}
      if (!ok) {
        document.body.innerHTML = '<p style="min-height:100vh;display:grid;place-content:center;text-align:center;line-height:2;background:#0f0a14;color:#f5f1ea;font-family:sans-serif">هذه الصفحة للمشرفين فقط.<br><a href="index.html" style="color:#f2b84b">العودة للرئيسية</a></p>';
      }
    }
    reveal();
  });
}
