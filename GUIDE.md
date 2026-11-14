# دليل النشر الكامل

الفكرة: **ملف الـ zip فيه المنصة كاملة**. تضعه داخل مستودع GitHub، ثم تنشره على Firebase.
الطريقة الموصى بها هي **Termux** (أسهل وأقل أخطاء). وفي الآخر طريقة بديلة بدون Termux.

---
## الطريقة أ: Termux (موصى بها)

### 1) تجهيز Termux (مرة واحدة)
```
pkg update -y && pkg upgrade -y
pkg install -y git nodejs unzip nano
termux-setup-storage
```
- بعد آخر أمر تظهر نافذة إذن التخزين: اضغط "سماح".
- لو ظهر خطأ في `pkg` (المستودع متوقف)، فنسخة Termux قديمة: ثبّتها من F-Droid أو من صفحة Termux على GitHub.

### 2) تنزيل ملف الـ zip إلى الجوال
نزّل `souq-alkabir-updated.zip` من المحادثة. ثم تأكد من مكانه:
```
ls ~/storage/downloads | grep souq
```

### 3) سحب مشروعك من GitHub ودمج التحديث
```
cd ~
git clone https://github.com/JassasSoft/al-souq-al-kabir.git
cd al-souq-al-kabir
unzip -o ~/storage/downloads/souq-alkabir-updated*.zip
```
- `unzip -o` يستبدل الملفات الموجودة بالجديدة (هذا المقصود). وستبقى بعض الملفات القديمة التي لم تعد مستخدمة، وهي غير ضارة.
- لو المجلد موجود من قبل: `cd ~/al-souq-al-kabir && git pull` ثم أعد أمر `unzip`.

### 4) شغّل سكربت النشر (يفعل كل شيء)
```
bash deploy.sh
```
السكربت يعمل بالترتيب:
1. يسأل عن **مفتاح imgbb الجديد** ويضعه في `config.js` (ويحفظه عندك بالجوال فلا يسألك مرة ثانية).
2. يرفع التعديلات إلى **GitHub** (`git add` ثم `commit` ثم `push`).
3. ينشر الموقع على **Firebase Hosting**.

أثناء التشغيل ستواجه ثلاثة أسئلة (أول مرة فقط):
- **GitHub:** يطلب Username وPassword. اكتب اسم مستخدمك، وفي Password الصق **Personal Access Token**:
  GitHub ← Settings ← Developer settings ← Personal access tokens ← Fine-grained tokens ← Generate ← اختر مستودع المشروع ← Permissions ← Contents = **Read and write**. (الكتابة لا تظهر أثناء اللصق، وهذا طبيعي.)
- **Firebase:** يعطيك رابطًا، فافتحه في المتصفح وسجّل بحساب Firebase، وانسخ الكود الذي يظهر والصقه في Termux.
- لا تشارك التوكن ولا المفتاح مع أحد.

عند النجاح يظهر: `تم! الرابط: https://alsouq-alkabeer-2052c.web.app`

### 5) أنشئ حسابك ثم اجعل نفسك مالكًا
1. افتح الموقع ← حساب جديد (إيميلك وكلمة المرور).
2. Firebase Console ← Authentication ← Users ← انسخ **User UID** لحسابك.
3. **Firestore:** Firestore Database ← Data ← Start collection
   - Collection ID: `admins` ← Document ID: الصق الـ UID
   - Field: `role` (string) = `owner` ← Save.
4. **Realtime Database:** Data ← اضغط **+** بجانب اسم القاعدة ← Name: `admins` ← ثم أضف تحته: Name = الـ UID، Value = `owner`.
5. افتح `/admin.html`. لو ظهرت اللوحة فأنت مالك.
> في الجوال: من قائمة Chrome ⋮ فعّل **Desktop site** لتظهر الأزرار كاملة.

### 6) افتح الحماية (القواعد)
**قبلها:** Realtime Database ← Data ← ⋮ ← **Export JSON** (نسخة احتياطية).
```
bash deploy.sh rules
```
يسألك للتأكيد، ثم ينشر قواعد Firestore وRealtime Database.
- لا تفعل هذه الخطوة قبل الخطوتين ٤ و٥، وإلا يتعطل الموقع.
- **بديل بدون سطر أوامر:** Firestore ← Rules ← الصق محتوى `firestore.rules` ← Publish. وRealtime Database ← Rules ← الصق `database.rules.json` ← Publish.

### 7) تحديثات المستقبل
كل مرة تأخذ مني ملفًا جديدًا:
```
cd ~/al-souq-al-kabir
unzip -o ~/storage/downloads/ملف-التحديث.zip
bash deploy.sh
```

---
## الطريقة ب: بدون Termux (رفع الملفات من الجوال)
> تنفع **فقط لو** موقعك ينشر تلقائيًا من GitHub. للتأكد: في المستودع افتح المجلد `.github/workflows`، فإن وجدت ملفًا اسمه يحوي `firebase-hosting` فالنشر تلقائي. وإلا فالرفع لـ GitHub لا ينشر الموقع، وتحتاج Termux.

1. فكّ الضغط على الجوال (تطبيق الملفات أو ZArchiver).
2. افتح المستودع في Chrome (فعّل Desktop site) ← **Add file** ← **Upload files**.
3. اختر **كل الملفات** داخل المجلد الرئيسي (الملفات فقط، وليس المجلدات)، وانتظر اكتمال الرفع ثم **Commit changes**. الحد الأقصى ١٠٠ ملف في المرة.
4. **المجلدات:** افتح مجلد `icons` في المستودع ← Add file ← Upload files ← ارفع صور PNG الأربع. وتجاهل مجلد `legacy` فهو للنسخ القديمة ولا يُنشر.
5. عدّل `config.js` من GitHub (أيقونة القلم) وضع مفتاح imgbb ← Commit.
6. بعد اكتمال النشر التلقائي (تبويب Actions) أكمل من الخطوتين ٥ و٦ أعلاه. القواعد تنشرها يدويًا من لوحة Firebase.

---
## بعد النشر
**قائمة اختبار:**
1. حساب جديد ← يدخل ويظهر اسمك في القائمة الجانبية.
2. إضافة إعلان بـ٣ صور ← يظهر في الرئيسية وفي قسمه.
3. افتح الإعلان ← الصور والسعر وزر واتساب.
4. "إعلاناتي" ← تظهر إعلاناتك ويمكنك تحديد "تم البيع".
5. `/admin.html` ← يفتح لك، ويُرفض غيرك.
6. من الأدمن: غيّر سعرًا ← تأكد أنه تغيّر في صفحة الباقات. وغيّر نص الشريط ← يظهر في الرئيسية.

**لو رأيت نسخة قديمة:** أغلق التبويب وافتحه مرة ثانية، أو Chrome ← الإعدادات ← إعدادات الموقع ← امسح بيانات الموقع. (الموقع يخزن نسخة للعمل بدون إنترنت وتتحدث عند الزيارة التالية.)

**مشاكل شائعة:**
- `Permission denied` عند push ← التوكن خطأ أو انتهت صلاحيته، أنشئ توكنًا جديدًا.
- `rejected (fetch first)` عند push ← نفّذ `git pull --rebase` ثم `bash deploy.sh`.
- فشل `npm install -g firebase-tools` ← انسخ الخطأ وأرسله لي.
- الصور لا ترفع ← مفتاح imgbb غير مضبوط: `cat config.js` للتأكد.

## لوحة الإدارة
- **الاشتراكات:** تفعيل (يمنح الرتبة ويرسل الكود لدردشة التاجر) أو رفض بسبب.
- **الإعلانات:** بحث وتمييز (٧/١٤/٣٠ يومًا) وحذف. **البلاغات:** فتح أو حذف أو تجاهل.
- **الأسعار:** ١٣ سعرًا تظهر فورًا في الباقات. **الشريط المتحرك:** نص مع معاينة.
- **المشرفون (للمالك):** أضف بإيميل مستخدم مسجّل.

## الخطوة التالية
بعد تثبيت المنصة نحوّلها لتطبيق أندرويد عبر PWABuilder (pwabuilder.com) من الرابط، ثم نرفعه على Google Play.
