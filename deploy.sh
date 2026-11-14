#!/data/data/com.termux/files/usr/bin/bash
# نشر المنصة بأمر واحد:  bash deploy.sh        (مفتاح imgbb ثم GitHub ثم Firebase Hosting)
#                        bash deploy.sh rules  (نشر القواعد، بعد إضافة نفسك مشرفًا)
set -e
PROJECT="alsouq-alkabeer-2052c"
cd "$(dirname "$0")"

echo "== 0) نقل النسخ الاحتياطية القديمة خارج المشروع (لكي لا تُنشر) =="
mkdir -p "$HOME/souq-old-backups"
for f in *.before-* *.pre-final-*; do
  if [ -e "$f" ]; then mv -f "$f" "$HOME/souq-old-backups/"; fi
done

command -v firebase >/dev/null 2>&1 || { echo "تثبيت أدوات Firebase (مرة واحدة)..."; npm install -g firebase-tools; }
if firebase login:list 2>&1 | grep -q "No authorized accounts"; then
  echo "== تسجيل الدخول إلى Firebase (مرة واحدة) =="
  firebase login --no-localhost
fi

if [ "$1" = "rules" ]; then
  read -r -p "هل نشرت الموقع الجديد وأضفت نفسك مشرفًا وصدّرت نسخة احتياطية؟ (y/n) " A
  [ "$A" = "y" ] || { echo "تم الإلغاء. أكمل الخطوات أولًا."; exit 0; }
  firebase deploy --only firestore:rules,database --project "$PROJECT"
  echo "تم نشر القواعد."
  exit 0
fi

echo "== 1) مفتاح imgbb =="
KEYFILE="$HOME/.souq_imgbb"
if grep -q 'imgbbKey: ""' config.js; then
  KEY=""; [ -f "$KEYFILE" ] && KEY="$(cat "$KEYFILE")"
  if [ -z "$KEY" ]; then
    read -r -p "الصق مفتاح imgbb الجديد (أو Enter للتخطي): " KEY
    [ -n "$KEY" ] && echo "$KEY" > "$KEYFILE"
  fi
  if [ -n "$KEY" ]; then sed -i "s|imgbbKey: \"\"|imgbbKey: \"$KEY\"|" config.js; echo "تم ضبط المفتاح."; fi
else
  echo "المفتاح مضبوط مسبقًا."
fi

echo "== 2) GitHub =="
git config user.name  >/dev/null 2>&1 || git config user.name  "JassasSoft"
git config user.email >/dev/null 2>&1 || git config user.email "jassassoft@users.noreply.github.com"
git config --global credential.helper store
git add -A
if git diff --cached --quiet; then
  echo "لا توجد تغييرات جديدة للرفع."
else
  git commit -m "تحديث المنصة $(date +%F)"
  git push
fi

echo "== 3) Firebase Hosting =="
firebase deploy --only hosting --project "$PROJECT"
echo ""
echo "تم! الرابط: https://$PROJECT.web.app"
