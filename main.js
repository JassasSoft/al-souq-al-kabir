// ==========================================
//  نظام الذكاء التلقائي لاكتشاف الأجهزة
// ==========================================

class DeviceIntelligence {
    constructor() {
        this.deviceType = this.detectDevice();
        this.screenSize = window.innerWidth;
        this.isTouch = this.checkTouch();
        this.applyDeviceClasses();
        this.optimizeForDevice();
    }

    // 1. كشف نوع الجهاز بدقة
    detectDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const platform = navigator.platform;
        
        // كشف التابلت (الأدق)
        if (/android/i.test(userAgent) && /tablet/i.test(userAgent)) return 'tablet';
        if (/ipad/i.test(userAgent)) return 'tablet';
        if (/android/i.test(userAgent) && !/mobile/i.test(userAgent)) return 'tablet';
        
        // كشف الآيفون
        if (/iphone|ipod/i.test(userAgent)) return 'iphone';
        
        // كشف الأندرويد (موبايل)
        if (/android/i.test(userAgent)) return 'android';
        
        // كشف الآيباد (iOS 13+)
        if (platform === 'MacIntel' && navigator.maxTouchPoints > 1) return 'tablet';
        
        // كشف سطح المكتب
        return 'desktop';
    }

    // 2. هل الجهاز يعمل باللمس؟
    checkTouch() {
        return (('ontouchstart' in window) || 
                (navigator.maxTouchPoints > 0) || 
                window.matchMedia('(pointer: coarse)').matches);
    }

    // 3. تطبيق كلاسات CSS حسب الجهاز
    applyDeviceClasses() {
        document.body.classList.add(
            `device-${this.deviceType}`,
            this.isTouch ? 'touch-device' : 'mouse-device',
            `screen-${this.getScreenCategory()}`
        );
        
        // إضافة data-attribute للـ HTML
        document.documentElement.setAttribute('data-device', this.deviceType);
        document.documentElement.setAttribute('data-touch', this.isTouch);
    }

    // 4. تصنيف حجم الشاشة
    getScreenCategory() {
        if (this.screenSize < 640) return 'mobile';
        if (this.screenSize < 768) return 'mobile-large';
        if (this.screenSize < 1024) return 'tablet';
        if (this.screenSize < 1280) return 'desktop-small';
        return 'desktop-large';
    }

    // 5. تحسينات خاصة لكل جهاز
    optimizeForDevice() {
        // تحسينات الموبايل
        if (this.deviceType === 'iphone' || this.deviceType === 'android') {
            this.optimizeMobile();
        }
        // تحسينات التابلت
        else if (this.deviceType === 'tablet') {
            this.optimizeTablet();
        }
        // تحسينات الديسكتوب
        else {
            this.optimizeDesktop();
        }
    }

    optimizeMobile() {
        // تقليل عدد الأعمدة في الشبكة
        document.documentElement.style.setProperty('--grid-columns', '2');
        document.documentElement.style.setProperty('--card-padding', '12px 8px');
        document.documentElement.style.setProperty('--icon-size', '45px');
        document.documentElement.style.setProperty('--font-size-base', '0.85rem');
        
        // تحسين اللمس
        document.documentElement.style.setProperty('--touch-target-size', '48px');
    }

    optimizeTablet() {
        document.documentElement.style.setProperty('--grid-columns', '3');
        document.documentElement.style.setProperty('--card-padding', '16px 12px');
        document.documentElement.style.setProperty('--icon-size', '55px');
        document.documentElement.style.setProperty('--font-size-base', '0.9rem');
    }

    optimizeDesktop() {
        document.documentElement.style.setProperty('--grid-columns', '4');
        document.documentElement.style.setProperty('--card-padding', '20px 15px');
        document.documentElement.style.setProperty('--icon-size', '65px');
        document.documentElement.style.setProperty('--font-size-base', '1rem');
        
        // إضافة تأثيرات hover للديسكتوب
        if (!this.isTouch) {
            document.body.classList.add('hover-enabled');
        }
    }

    // 6. دالة مساعدة للحصول على معلومات الجهاز
    getDeviceInfo() {
        return {
            type: this.deviceType,
            screenSize: this.screenSize,
            category: this.getScreenCategory(),
            isTouch: this.isTouch,
            platform: navigator.platform,
            language: navigator.language
        };
    }
}

// ==========================================
// 🎨 تحديث CSS Variables ديناميكياً
// ==========================================

function updateResponsiveVariables() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // تحديث المتغيرات حسب حجم الشاشة الفعلي
    document.documentElement.style.setProperty('--vw', width + 'px');
    document.documentElement.style.setProperty('--vh', height + 'px');
    
    // حساب النسب المئوية الدقيقة
    if (width < 640) {
        document.documentElement.style.setProperty('--container-padding', '12px');
        document.documentElement.style.setProperty('--gap-size', '10px');
    } else if (width < 1024) {
        document.documentElement.style.setProperty('--container-padding', '20px');
        document.documentElement.style.setProperty('--gap-size', '15px');
    } else {
        document.documentElement.style.setProperty('--container-padding', '40px');
        document.documentElement.style.setProperty('--gap-size', '20px');
    }
}

// ==========================================
// 🚀 تشغيل النظام عند تحميل الصفحة
// ==========================================

let deviceSystem;

document.addEventListener('DOMContentLoaded', () => {
    // تهيئة نظام الذكاء
    deviceSystem = new DeviceIntelligence();
    
    // تحديث المتغيرات
    updateResponsiveVariables();
    
    // طباعة معلومات الجهاز (للتطوير)
    console.log(' Device Info:', deviceSystem.getDeviceInfo());
    
    // الاستماع لتغير حجم الشاشة
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateResponsiveVariables();
            // إعادة كشف الجهاز في حالة التغير الكبير
            const newDevice = deviceSystem.detectDevice();
            if (newDevice !== deviceSystem.deviceType) {
                location.reload(); // إعادة تحميل لتطبيق التغييرات
            }
        }, 250);
    });
});

// ==========================================
// 🎯 الكود الأصلي لـ Firebase (مع الحفاظ عليه)
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB8WmKff45q2jRlFm5xkGytJgt-_5Cx3J8",
    authDomain: "alsouq-alkabeer-2052c.firebaseapp.com",
    projectId: "alsouq-alkabeer-2052c",
    storageBucket: "alsouq-alkabeer-2052c.firebasestorage.app",
    messagingSenderId: "835295635291",
    appId: "1:835295635291:web:e1f09baff25b50fac11c7e",
    measurementId: "G-WTC5HE9BB1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function loadActiveGeo() {
    const savedState = localStorage.getItem('filteredState') || "جنوب دارفور";
    const savedCity = localStorage.getItem('filteredCity') || "نيالا";
    const geoLabel = document.getElementById('currentGeoLabel');
    if (geoLabel) geoLabel.innerText = `${savedCity} - ${savedState}`;
}
loadActiveGeo();

onSnapshot(collection(db, "ads"), (snapshot) => {
    let text = "مرحباً بكم في تطبيق السوق الكبير 🇸";
    snapshot.forEach((doc) => { 
        if(doc.data().type === "إعلان متحرك في الشريط") {
            text = doc.data().text; 
        } 
    });
    const tickerBox = document.getElementById('ticker-box');
    if (tickerBox) tickerBox.innerHTML = `<span>${text}</span>`;
}, (error) => {
    console.error("خطأ في جلب بيانات الإعلانات:", error);
});

window.fastNavigate = function(url) { 
    window.location.href = url; 
};

const sidebar = document.getElementById('sidebarOverlay');
const openBtn = document.getElementById('openSidebarBtn');
const closeBtn = document.getElementById('closeSidebarBtn');

if (openBtn && sidebar) {
    openBtn.addEventListener('click', () => sidebar.classList.add('active'));
}
if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => sidebar.classList.remove('active'));
}
if (sidebar) {
    sidebar.addEventListener('click', (e) => { 
        if(e.target === sidebar) sidebar.classList.remove('active'); 
    });
}

document.querySelectorAll('.data-turbo').forEach(elem => {
    elem.addEventListener('click', function(e) {
        this.style.transform = "scale(0.95)";
        this.style.borderColor = "var(--gold)";
        
        let destination = this.getAttribute('href');
        const savedState = localStorage.getItem('filteredState') || "جنوب دارفور";
        const savedCity = localStorage.getItem('filteredCity') || "نيالا";
        
        const separator = destination.includes('?') ? '&' : '?';
        destination += `${separator}state=${encodeURIComponent(savedState)}&city=${encodeURIComponent(savedCity)}`;
        
        setTimeout(() => { 
            window.location.href = destination; 
        }, 100);
    });
});

window.openLocationPicker = function() {
    console.log("فتح نافذة اختيار الموقع...");
};