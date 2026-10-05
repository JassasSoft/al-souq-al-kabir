// ==========================================
// 🎨 الأنماط المشتركة - تُحقن تلقائياً
// ==========================================
const sharedStyles = `
<style>
:root {
    --gold: #ffbd59;
    --gold-light: #ffd699;
    --gold-dark: #cc9533;
    --gold-glow: rgba(255, 189, 89, 0.4);
    --bg-primary: #0d0212;
    --bg-secondary: #1a0a2e;
    --bg-card: #161616;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --shadow-gold: 0 8px 32px rgba(255, 189, 89, 0.3);
    --radius-sm: 12px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: 'Cairo', sans-serif;
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
    color: var(--text-primary);
    min-height: 100vh;
    padding-bottom: 100px;
}

/* ==========================================
   🤖 المساعد الذكي
========================================== */
.smart-assistant {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 360px;
    max-width: 90%;
    max-height: 70vh;
    background: linear-gradient(145deg, #1a0a2e, #0d0212);
    border: 2px solid var(--gold);
    border-radius: 20px;
    box-shadow: 0 10px 40px rgba(255, 189, 89, 0.3);
    z-index: 9998;
    display: none;
    flex-direction: column;
    overflow: hidden;
}

.smart-assistant.active {
    display: flex;
    animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(30px) scale(0.9); }
    to { opacity: 1; transform: translateY(0) scale(1); }
}

.assistant-header {
    background: linear-gradient(90deg, var(--gold), var(--gold-dark));
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 12px;
}

.assistant-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #000;
    flex-shrink: 0;
}

.assistant-avatar i {
    font-size: 1.8rem;
    color: var(--gold-dark);
}

.assistant-header-info { flex: 1; }

.assistant-header-info h3 {
    color: #000;
    font-size: 1rem;
    font-weight: 900;
    margin: 0;
}

.assistant-status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.75rem;
    color: #000;
    font-weight: 600;
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.close-assistant {
    background: rgba(0, 0, 0, 0.2);
    border: none;
    color: #000;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.close-assistant:active {
    background: rgba(0, 0, 0, 0.4);
    transform: rotate(90deg);
}

.assistant-body {
    padding: 15px;
    min-height: 250px;
    max-height: 50vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.message {
    max-width: 85%;
    padding: 12px 15px;
    border-radius: 15px;
    font-size: 0.9rem;
    line-height: 1.6;
    animation: messageIn 0.3s ease-out;
}

@keyframes messageIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.message.bot {
    background: rgba(255, 189, 89, 0.1);
    border: 1px solid rgba(255, 189, 89, 0.3);
    color: #fff;
    align-self: flex-start;
    border-bottom-right-radius: 5px;
}

.message.user {
    background: var(--gold);
    color: #000;
    align-self: flex-end;
    border-bottom-left-radius: 5px;
    font-weight: 600;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 12px 15px;
    background: rgba(255, 189, 89, 0.1);
    border: 1px solid rgba(255, 189, 89, 0.3);
    border-radius: 15px;
    align-self: flex-start;
    width: fit-content;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--gold);
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-10px); opacity: 1; }
}

.assistant-footer {
    padding: 15px;
    display: flex;
    gap: 10px;
    border-top: 1px solid rgba(255, 189, 89, 0.2);
    background: rgba(0, 0, 0, 0.3);
}

.assistant-input {
    flex: 1;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 189, 89, 0.3);
    border-radius: 25px;
    padding: 12px 18px;
    color: #fff;
    font-size: 0.9rem;
    outline: none;
    font-family: 'Cairo', sans-serif;
}

.assistant-input:focus {
    border-color: var(--gold);
    background: rgba(255, 255, 255, 0.15);
}

.assistant-input::placeholder { color: var(--text-secondary); }

.send-button {
    background: var(--gold);
    border: none;
    color: #000;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(255, 189, 89, 0.4);
    flex-shrink: 0;
}

.send-button:active { transform: scale(0.9); }

.assistant-toggle {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 65px;
    height: 65px;
    background: linear-gradient(145deg, var(--gold), var(--gold-dark));
    border: 3px solid #fff;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 6px 25px rgba(255, 189, 89, 0.5);
    z-index: 9997;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.assistant-toggle i {
    font-size: 1.8rem;
    color: #000;
}

.assistant-toggle:active { transform: scale(0.9); }

.assistant-toggle::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 18px;
    height: 18px;
    background: #22c55e;
    border-radius: 50%;
    border: 3px solid var(--bg-primary);
    animation: pulse 2s infinite;
}

/* ==========================================
   📱 الشريط السفلي
========================================== */
.bottom-nav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 2px solid var(--gold);
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    z-index: 9999;
    box-shadow: 0 -4px 20px rgba(255, 189, 89, 0.2);
}

.nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    text-decoration: none;
    color: var(--text-secondary);
    transition: all 0.3s;
    padding: 5px 15px;
}

.nav-item i { font-size: 1.3rem; transition: all 0.3s; }
.nav-item span { font-size: 0.75rem; font-weight: 600; }

.nav-item.active { color: var(--gold); }

.nav-item.active i {
    transform: scale(1.2);
    filter: drop-shadow(0 2px 8px var(--gold-glow));
}
</style>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
`;

// حقن الأنماط في الصفحة
document.head.insertAdjacentHTML('beforeend', sharedStyles);

// ==========================================
// 🧩 HTML المشترك - يُحقن في نهاية body
// ==========================================
const sharedHTML = `
<!-- المساعد الذكي -->
<div id="smartAssistant" class="smart-assistant">
    <div class="assistant-header">
        <div class="assistant-avatar">
            <i class="fas fa-user-tie"></i>
        </div>
        <div class="assistant-header-info">
            <h3>مستشار السوق الكبير</h3>
            <div class="assistant-status">
                <span class="status-dot"></span>
                <span>متصل الآن</span>
            </div>
        </div>
        <button class="close-assistant" onclick="toggleAssistant()">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="assistant-body" id="chatBody">
        <div class="message bot">
            مرحباً بك في السوق الكبير! أنا مستشارك الذكي، هنا لمساعدتك في العثور على أفضل المنتجات والخدمات. كيف يمكنني مساعدتك اليوم؟
        </div>
    </div>
    <div class="assistant-footer">
        <input type="text" placeholder="اكتب سؤالك هنا..." class="assistant-input" id="assistantInput">
        <button class="send-button" onclick="sendMessage()">
            <i class="fas fa-paper-plane"></i>
        </button>
    </div>
</div>

<button class="assistant-toggle" onclick="toggleAssistant()">
    <i class="fas fa-user-tie"></i>
</button>

<!-- الشريط السفلي -->
<nav class="bottom-nav">
    <a href="index.html" class="nav-item" data-page="index">
        <i class="fas fa-home"></i>
        <span>الرئيسية</span>
    </a>
    <a href="my-ads.html" class="nav-item" data-page="my-ads">
        <i class="fas fa-shopping-bag"></i>
        <span>الطلبات</span>
    </a>
    <a href="profile.html" class="nav-item" data-page="profile">
        <i class="fas fa-user"></i>
        <span>حسابي</span>
    </a>
    <a href="login.html" class="nav-item" data-page="login">
        <i class="fas fa-sign-out-alt"></i>
        <span>خروج</span>
    </a>
</nav>
`;

document.body.insertAdjacentHTML('beforeend', sharedHTML);

// ==========================================
// 🎯 تحديد الصفحة النشطة في الشريط السفلي
// ==========================================
const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === currentPage) {
        item.classList.add('active');
    }
});

// ==========================================
// 🤖 وظائف المساعد الذكي
// ==========================================
const chatBody = document.getElementById('chatBody');
const assistantInput = document.getElementById('assistantInput');

window.toggleAssistant = function() {
    const assistant = document.getElementById('smartAssistant');
    assistant.classList.toggle('active');
};

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
}

// قاعدة المعرفة الذكية
const knowledgeBase = {
    'مرحبا': 'أهلاً وسهلاً بك في السوق الكبير! 🎉 كيف يمكنني مساعدتك اليوم؟',
    'اهلا': 'أهلاً بك! أنا هنا لخدمتك. ما الذي تبحث عنه؟',
    'السلام': 'وعليكم السلام ورحمة الله! كيف يمكنني مساعدتك؟',
    'سعر': '💰 الأسعار تتفاوت حسب المنتج والتاجر. يمكنك تصفح الأقسام المختلفة لمعرفة الأسعار الحالية.',
    'توصيل': '🚚 نعم، نوفر خدمة التوصيل لجميع ولايات السودان! التوصيل داخل نيالا خلال 24 ساعة.',
    'دفع': ' طرق الدفع: الدفع عند الاستلام، بنكك، فوري، التحويل البنكي.',
    'تاجر': 'لدينا 3 أنواع: تاجر عادي، قطاعي، جملة. أي نوع يناسبك؟',
    'هاتف': '📱 قسم الهواتف يحتوي على أحدث الهواتف الذكية وملحقاتها.',
    'عقار': '🏠 قسم العقارات: أراضي، منازل، شقق، محلات تجارية.',
    'سيارة': ' سيارات جديدة ومستعملة بجميع الماركات.',
    'شكرا': 'العفو!  سعيد بخدمتك. هل هناك أي شيء آخر؟',
    'default': 'لم أفهم سؤالك تماماً. هل يمكنك إعادة صياغته؟ أو اسألني عن: الأسعار، التوصيل، الأقسام، الباقات.'
};

function getSmartResponse(message) {
    const lowerMsg = message.toLowerCase().trim();
    for (const [key, response] of Object.entries(knowledgeBase)) {
        if (lowerMsg.includes(key)) return response;
    }
    return knowledgeBase['default'];
}

window.sendMessage = function() {
    const message = assistantInput.value.trim();
    if (!message) return;
    
    addMessage(message, 'user');
    assistantInput.value = '';
    showTyping();
    
    setTimeout(() => {
        removeTyping();
        const response = getSmartResponse(message);
        addMessage(response, 'bot');
    }, 800);
};

assistantInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

console.log('✅ المكونات المشتركة تم تحميلها بنجاح!');