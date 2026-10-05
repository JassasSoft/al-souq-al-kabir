// ==========================================
// 🤖 المساعد الذكي العام
// ==========================================

function createSmartAssistant() {
    const assistantHTML = `
        <div id="smartAssistant" class="smart-assistant">
            <div class="assistant-header">
                <h3>🤖 المساعد الافتراضي للسوق</h3>
                <button class="close-assistant" onclick="toggleAssistant()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="assistant-body">
                <div class="assistant-message">
                    مرحباً بك في متجر السوق الكبير! أنا هنا لمساعدتك في العثور على أفضل المنتجات والخدمات. تفضل بطرح استفسارك.
                </div>
            </div>
            <div class="assistant-footer">
                <input type="text" placeholder="اكتب استفسارك هنا..." class="assistant-input">
                <button class="send-button" onclick="sendMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
        <button class="assistant-toggle" onclick="toggleAssistant()">
            <i class="fas fa-robot"></i>
        </button>
    `;
    document.body.insertAdjacentHTML('beforeend', assistantHTML);
}

function toggleAssistant() {
    const assistant = document.getElementById('smartAssistant');
    assistant.classList.toggle('active');
}

function sendMessage() {
    const input = document.querySelector('.assistant-input');
    const message = input.value.trim();
    if (message) {
        console.log('رسالة:', message);
        input.value = '';
        // هنا يمكن إضافة منطق الرد التلقائي
    }
}

// ==========================================
// 📱 الشريط السفلي العام
// ==========================================

function createBottomNav() {
    const navHTML = `
        <nav class="bottom-nav">
            <a href="index.html" class="nav-item ${window.location.pathname.includes('index') ? 'active' : ''}">
                <i class="fas fa-home"></i>
                <span>الرئيسية</span>
            </a>
            <a href="orders.html" class="nav-item ${window.location.pathname.includes('orders') ? 'active' : ''}">
                <i class="fas fa-shopping-bag"></i>
                <span>الطلبات</span>
            </a>
            <a href="profile.html" class="nav-item ${window.location.pathname.includes('profile') ? 'active' : ''}">
                <i class="fas fa-user"></i>
                <span>حسابي</span>
            </a>
            <a href="logout.html" class="nav-item">
                <i class="fas fa-sign-out-alt"></i>
                <span>خروج</span>
            </a>
        </nav>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
}

// ==========================================
//  قائمة البنوك السودانية
// ==========================================

const sudaneseBanks = [
    { id: 1, name: 'بنك الخرطوم', code: 'BOK' },
    { id: 2, name: 'بنك فيصل الإسلامي', code: 'FIB' },
    { id: 3, name: 'بنك البركة السوداني', code: 'BBS' },
    { id: 4, name: 'بنك الأسرة', code: 'FAB' },
    { id: 5, name: 'بنك التضامن الإسلامي', code: 'TIB' },
    { id: 6, name: 'بنك الإجماد', code: 'IJB' },
    { id: 7, name: 'بنك أم درمان الوطني', code: 'ADNB' },
    { id: 8, name: 'بنك النيلين', code: 'NIB' },
    { id: 9, name: 'بنك الاستثمار', code: 'IB' },
    { id: 10, name: 'بنك المزارع', code: 'FAB' },
    { id: 11, name: 'بنك النيل', code: 'NB' },
    { id: 12, name: 'بنك الخليج', code: 'GB' },
    { id: 13, name: 'بنك السودان', code: 'SB' },
    { id: 14, name: 'بنك المستقبل', code: 'FB' },
    { id: 15, name: 'بنك الصادرات', code: 'EB' },
    { id: 16, name: 'بنك الجمهورية', code: 'RB' },
    { id: 17, name: 'بنك الواحة', code: 'OB' },
    { id: 18, name: 'بنك الشمال', code: 'NOB' },
    { id: 19, name: 'بنك كرين', code: 'KB' },
    { id: 20, name: 'بنك سوبا', code: 'SUB' },
    { id: 21, name: 'بنك الشامل', code: 'CB' },
    { id: 22, name: 'بنك دبي الإسلامي', code: 'DIB' },
    { id: 23, name: 'بنك الإمداد', code: 'IMB' },
    { id: 24, name: 'بنك بوش', code: 'BUB' },
    { id: 25, name: 'بنك النيل الأزرق', code: 'BNB' },
    { id: 26, name: 'بنك السافانا', code: 'SVB' },
    { id: 27, name: 'بنك السلام', code: 'SLB' },
    { id: 28, name: 'بنك الريح', code: 'RIB' },
    { id: 29, name: 'بنك النيل الأبيض', code: 'WNB' },
    { id: 30, name: 'بنك الزرقاء', code: 'ZB' }
];

function createBankSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const bankHTML = `
        <div class="bank-selector">
            <h3>اختر البنك</h3>
            <select class="bank-dropdown">
                <option value="">-- اختر البنك --</option>
                ${sudaneseBanks.map(bank => `
                    <option value="${bank.code}">${bank.name}</option>
                `).join('')}
            </select>
        </div>
    `;
    container.innerHTML = bankHTML;
}

// ==========================================
// 🚀 تهيئة المكونات عند تحميل الصفحة
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    createSmartAssistant();
    createBottomNav();
});