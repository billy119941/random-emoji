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
        'faq.q4': '如何为社交媒体帖子选择完美的表情？',
        'faq.a4': '使用我们的随机表情生成器，您可以快速找到适合您社交媒体帖子的表情。通过分类浏览或随机生成功能，为您的内容增添趣味性和个性化。',
        'faq.q5': '如何在创意写作中使用表情？',
        'faq.a5': '表情可以让您的创意写作更加生动有趣。使用随机生成功能可以激发灵感，或者通过分类浏览找到最适合您故事情境的表情。',
        'faq.q6': '如何为Instagram标题选择合适的表情？',
        'faq.a6': '为Instagram选择表情时，可以使用我们的分类功能找到与您照片主题相匹配的表情，或使用随机功能为您的标题增添意外惊喜。',
        'faq.q7': '如何在派对游戏中使用表情生成器？',
        'faq.a7': '我们的随机表情生成器非常适合派对游戏！可以用于表情猜谜、情绪模仿游戏，或者创造有趣的即兴故事。',
        'faq.q8': '这个工具适合孩子使用吗？',
        'faq.a8': '是的！我们的表情生成器对孩子很友好，可以帮助他们学习表达情感，增进沟通能力，还能在学习过程中获得乐趣。',
        'faq.q9': '如何使用表情进行创意头脑风暴？',
        'faq.a9': '随机表情可以激发创意思维！每次生成新表情都可能带来新的灵感，帮助您突破思维定式，产生新想法。',
        'faq.q10': '如何为TikTok视频选择表情？',
        'faq.a10': '使用我们的工具可以快速为您的TikTok视频找到有趣的表情。可以用于视频标题、评论互动，或作为创意灵感来源。',
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
        'faq.q4': 'How to choose perfect emojis for social media posts?',
        'faq.a4': 'Use our random emoji generator to quickly find emojis that suit your social media posts. Browse by category or use the random generation feature to add fun and personality to your content.',
        'faq.q5': 'How to use emojis in creative writing?',
        'faq.a5': 'Emojis can make your creative writing more vibrant and interesting. Use the random generation feature for inspiration or browse categories to find emojis that best fit your story context.',
        'faq.q6': 'How to select emojis for Instagram captions?',
        'faq.a6': 'When choosing emojis for Instagram, use our categories to find emojis that match your photo theme, or use the random feature to add unexpected fun to your captions.',
        'faq.q7': 'How to use the emoji generator for party games?',
        'faq.a7': 'Our random emoji generator is perfect for party games! Use it for emoji charades, emotion mimicking games, or creating fun impromptu stories.',
        'faq.q8': 'Is this tool suitable for kids?',
        'faq.a8': 'Yes! Our emoji generator is kid-friendly and can help them learn emotional expression, improve communication skills, and have fun while learning.',
        'faq.q9': 'How to use emojis for creative brainstorming?',
        'faq.a9': 'Random emojis can spark creative thinking! Each new emoji generated can bring fresh inspiration, helping you break through mental blocks and generate new ideas.',
        'faq.q10': 'How to choose emojis for TikTok videos?',
        'faq.a10': 'Use our tool to quickly find fun emojis for your TikTok videos. They can be used for video captions, comment interaction, or as a source of creative inspiration.',
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