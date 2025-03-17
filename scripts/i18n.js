// 全局变量
let currentLanguage = 'zh';
const translations = {
    zh: {
        'nav.home': '首页',
        'nav.categories': '分类',
        'nav.about': '关于',
        'hero.title': '随机表情生成器',
        'hero.subtitle': '为您的消息和社交媒体添加趣味',
        'buttons.generate': '生成随机表情',
        'buttons.copy': '复制',
        'categories.title': '表情分类',
        'categories.all': '全部',
        'categories.smileys': '笑脸与情感',
        'categories.people': '人物',
        'categories.animals': '动物与自然',
        'categories.food': '食物与饮料',
        'categories.travel': '旅行与地点',
        'categories.activities': '活动',
        'categories.objects': '物品',
        'categories.symbols': '符号',
        'categories.flags': '旗帜',
        'search.placeholder': '搜索表情...',
        'about.title': '关于 Random Emoji Generator',
        'about.description': 'Random Emoji Generator 是一个免费的在线工具，帮助您快速找到和使用表情符号。无论是用于社交媒体、短信还是电子邮件，我们都能让您轻松找到完美的表情。',
        'about.features': '功能特点',
        'about.feature1': '随机生成表情符号',
        'about.feature2': '按类别浏览',
        'about.feature3': '搜索功能',
        'about.feature4': '一键复制',
        'about.feature5': '多语言支持',
        'faq.title': '常见问题',
        'faq.q1': '如何使用随机表情生成器？',
        'faq.a1': '只需点击"生成随机表情"按钮，系统会立即为您生成一个随机表情。您也可以通过分类浏览或搜索特定表情。',
        'faq.q2': '我可以在任何地方使用这些表情吗？',
        'faq.a2': '是的，您可以在任何支持 Unicode 表情符号的平台上使用这些表情，包括社交媒体、短信、电子邮件等。',
        'faq.q3': '为什么有些表情在不同设备上显示不同？',
        'faq.a3': '表情符号的显示取决于您的设备和操作系统。不同平台（如 Apple、Google、Microsoft 等）对同一表情符号有不同的设计风格。',
        'footer.tagline': '为您的内容增添表情',
        'footer.links': '快速链接',
        'footer.home': '首页',
        'footer.categories': '分类',
        'footer.about': '关于',
        'footer.followUs': '关注我们',
        'footer.shareOn': '分享至你的社交媒体',
        'footer.rights': '保留所有权利',
        'notifications.copied': '已复制到剪贴板',
        'notifications.error': '复制失败'
    },
    en: {
        'nav.home': 'Home',
        'nav.categories': 'Categories',
        'nav.about': 'About',
        'hero.title': 'Random Emoji Generator',
        'hero.subtitle': 'Add fun to your messages and social media',
        'buttons.generate': 'Generate Random Emoji',
        'buttons.copy': 'Copy',
        'categories.title': 'Emoji Categories',
        'categories.all': 'All',
        'categories.smileys': 'Smileys & Emotion',
        'categories.people': 'People',
        'categories.animals': 'Animals & Nature',
        'categories.food': 'Food & Drink',
        'categories.travel': 'Travel & Places',
        'categories.activities': 'Activities',
        'categories.objects': 'Objects',
        'categories.symbols': 'Symbols',
        'categories.flags': 'Flags',
        'search.placeholder': 'Search emojis...',
        'about.title': 'About Random Emoji Generator',
        'about.description': 'Random Emoji Generator is a free online tool that helps you quickly find and use emojis. Whether for social media, text messages, or emails, we make it easy to find the perfect emoji.',
        'about.features': 'Features',
        'about.feature1': 'Generate random emojis',
        'about.feature2': 'Browse by category',
        'about.feature3': 'Search functionality',
        'about.feature4': 'One-click copy',
        'about.feature5': 'Multi-language support',
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'How to use the Random Emoji Generator?',
        'faq.a1': 'Simply click the "Generate Random Emoji" button, and the system will immediately generate a random emoji for you. You can also browse by category or search for specific emojis.',
        'faq.q2': 'Can I use these emojis anywhere?',
        'faq.a2': 'Yes, you can use these emojis on any platform that supports Unicode emojis, including social media, text messages, emails, etc.',
        'faq.q3': 'Why do some emojis look different on different devices?',
        'faq.a3': 'The display of emojis depends on your device and operating system. Different platforms (such as Apple, Google, Microsoft, etc.) have different design styles for the same emoji.',
        'footer.tagline': 'Add emojis to your content',
        'footer.links': 'Quick Links',
        'footer.home': 'Home',
        'footer.categories': 'Categories',
        'footer.about': 'About',
        'footer.followUs': 'Follow Us',
        'footer.shareOn': 'Share on Social Media',
        'footer.rights': 'All Rights Reserved',
        'notifications.copied': 'Copied to clipboard',
        'notifications.error': 'Copy failed'
    }
};

// 初始化语言
function initLanguage() {
    // 设置默认语言为英语
    currentLanguage = 'en';
    
    // 更新语言选择器
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    // 应用翻译
    applyTranslations();
}

// 更改语言
function changeLanguage(lang) {
    if (translations[lang]) {
        currentLanguage = lang;
        
        // 应用翻译
        applyTranslations();
        
        // 更新表情名称显示
        const emojiName = document.getElementById('emoji-name');
        const emojiResult = document.getElementById('emoji-result');
        
        if (emojiName && emojiResult) {
            // 查找当前显示的表情
            const currentEmoji = emojiResult.textContent;
            const foundEmoji = allEmojis.find(emoji => emoji.emoji === currentEmoji);
            
            if (foundEmoji) {
                // 根据当前语言显示名称
                if (lang === 'en') {
                    // 英文名称通常是 keywords 的第一个
                    emojiName.textContent = foundEmoji.keywords[0].charAt(0).toUpperCase() + foundEmoji.keywords[0].slice(1);
                } else {
                    emojiName.textContent = foundEmoji.name;
                }
            }
        }
        
        // 重新渲染表情网格
        if (typeof renderEmojiGrid === 'function') {
            renderEmojiGrid();
        }
    }
}

// 应用翻译
function applyTranslations() {
    // 翻译所有带有 data-i18n 属性的元素
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLanguage][key]) {
            el.textContent = translations[currentLanguage][key];
        }
    });
    
    // 翻译所有带有 data-i18n-placeholder 属性的元素
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLanguage][key]) {
            el.placeholder = translations[currentLanguage][key];
        }
    });
}

// 获取翻译
function getTranslation(key) {
    return translations[currentLanguage][key] || key;
}