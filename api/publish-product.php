<?php
// api/publish-product.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// 1. إعدادات الاتصال بقاعدة البيانات (MySQL) - قم بتعديلها لتناسب بيانات سيرفرك
$host = "localhost";
$db_name = "alsouq_alakebeer"; // اسم قاعدة البيانات الخاصة بك
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["success" => false, "message" => "فشل الاتصال بقاعدة البيانات: " . $exception->getMessage()]);
    exit;
}

// 2. التحقق من أن الطلب المرسل هو POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // استقبال البيانات النصية من الـ FormData
    $category_id = isset($_POST['category_id']) ? $_POST['category_id'] : null;
    $state       = isset($_POST['state']) ? $_POST['state'] : null;
    $city        = isset($_POST['city']) ? $_POST['city'] : null;
    $description = isset($_POST['description']) ? $_POST['description'] : null;
    $price       = isset($_POST['price']) ? $_POST['price'] : null;
    $whatsapp    = isset($_POST['whatsapp']) ? $_POST['whatsapp'] : null;
    $features    = isset($_POST['features']) ? $_POST['features'] : '[]';

    // التحقق الأساسي من وجود البيانات المطلوبة
    if (!$category_id || !$state || !$city || !$description || !$price || !$whatsapp) {
        echo json_encode(["success" => false, "message" => "الرجاء إكمال كافة الحقول المطلوبة."]);
        exit;
    }

    // 3. معالجة ورفع الملفات الحقيقية للصور
    $uploaded_images = [];
    $upload_dir = "../uploads/"; // المجلد الذي ستخزن فيه الصور حقيقياً
    
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true); // إنشاء المجلد تلقائياً إذا لم يكن موجوداً
    }

    // المرور على مصفوفة الصور القادمة من الـ FormData
    if (isset($_FILES['images'])) {
        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            $file_name = $_FILES['images']['name'][$key];
            $file_size = $_FILES['images']['size'][$key];
            $file_tmp  = $_FILES['images']['tmp_name'][$key];
            $file_type = $_FILES['images']['type'][$key];
            
            // توليد اسم فريد لكل صورة لمنع التكرار والمسح
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $new_file_name = "img_" . time() . "_" . uniqid() . "." . $file_ext;
            $target_file = $upload_dir . $new_file_name;

            // الامتدادات المسموح بها لضمان الأمان
            $extensions = ["jpeg", "jpg", "png", "webp"];
            
            if (in_array($file_ext, $extensions) === true) {
                if (move_uploaded_file($file_tmp, $target_file)) {
                    // حفظ المسار النسبي للصورة لاستدعائه لاحقاً في صفحة الأقسام
                    $uploaded_images[] = "uploads/" . $new_file_name;
                }
            }
        }
    }

    // التأكد من أن المستخدم نجح برفع 3 صور على الأقل بالسيرفر
    if (count($uploaded_images) < 3) {
        echo json_encode(["success" => false, "message" => "فشل رفع الحد الأدنى من الصور (3 صور على الأقل)."]);
        exit;
    }

    // تحويل مصفوفة مسارات الصور إلى نص JSON لتخزينها في حقل واحد بالقاعدة
    $images_json = json_encode($uploaded_images);

    // 4. إدخال البيانات الحقيقية في جدول قاعدة البيانات
    try {
        $query = "INSERT INTO products (category_id, state, city, description, price, whatsapp, features, images, created_at) 
                  VALUES (:category_id, :state, :city, :description, :price, :whatsapp, :features, :images, NOW())";
        
        $stmt = $conn->prepare($query);
        
        $stmt->bindParam(':category_id', $category_id);
        $stmt->bindParam(':state', $state);
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':price', $price);
        $stmt->bindParam(':whatsapp', $whatsapp);
        $stmt->bindParam(':features', $features);
        $stmt->bindParam(':images', $images_json);
        
        if ($stmt->execute()) {
            // إرسال استجابة النجاح الحقيقية لتشغيل الـ Modal الفخم في الفرونت إند
            echo json_encode(["success" => true, "message" => "تم حفظ الإعلان بنجاح في قاعدة البيانات."]);
        } else {
            echo json_encode(["success" => false, "message" => "حدث خطأ أثناء كتابة البيانات."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "خطأ في قاعدة البيانات: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["success" => false, "message" => "نوع الطلب غير مدعوم."]);
}
?>
