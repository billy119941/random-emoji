// 全局变量
let currentCategory = 'all';
let currentPage = 1;
let itemsPerPage = 24;
let filteredEmojis = [];
let allEmojis = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化语言
    initLanguage();
    
    // 合并所有表情数据
    combineEmojiData();
    
    // 初始化表情网格
    initEmojiGrid();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 生成一个随机表情
    generateRandomEmoji();
    
    // 初始化手风琴
    initAccordion();
    
    // 初始化滚动到顶部按钮
    initScrollToTop();
    
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

// 合并所有表情数据
function combineEmojiData() {
    allEmojis = [];
    
    // 检查emojiData是否存在
    if (typeof emojiData === 'undefined') {
        console.error('emojiData未定义，请检查emoji-data.js文件是否正确加载');
        // 添加测试数据，以防emojiData未加载
        const testData = {
            test: [
                { emoji: "😀", name: "笑脸", keywords: ["smile", "happy", "joy", "笑", "高兴"] },
                { emoji: "😃", name: "大笑", keywords: ["laugh", "happy", "joy", "大笑", "开心"] }
            ]
        };
        
        // 使用测试数据
        for (const category in testData) {
            testData[category].forEach(emoji => {
                emoji.category = category;
                allEmojis.push(emoji);
            });
        }
        
        console.log('使用测试数据，共', allEmojis.length, '个表情');
        return;
    }
    
    // 遍历所有类别
    for (const category in emojiData) {
        emojiData[category].forEach(emoji => {
            // 添加类别信息
            emoji.category = category;
            allEmojis.push(emoji);
        });
    }
    
    // 初始化过滤后的表情
    filteredEmojis = [...allEmojis];
    console.log('表情数据已加载，共', allEmojis.length, '个表情');
}

// 初始化表情网格
function initEmojiGrid() {
    // 过滤表情
    filterEmojis();
    
    // 渲染表情网格
    renderEmojiGrid();
    
    // 渲染分页
    renderPagination();
}

// 初始化事件监听器
function initEventListeners() {
    // 生成随机表情按钮
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateRandomEmoji);
    }
    
    // 复制按钮
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyEmoji);
    }
    
    // 类别按钮
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有活动类
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // 添加活动类到当前按钮
            this.classList.add('active');
            
            // 设置当前类别
            currentCategory = this.getAttribute('data-category');
            
            // 重置当前页
            currentPage = 1;
            
            // 初始化表情网格
            initEmojiGrid();
        });
    });
    
    // 搜索按钮
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // 重置当前页
            currentPage = 1;
            
            // 初始化表情网格
            initEmojiGrid();
        });
    }
    
    // 搜索输入框回车事件
    const searchInput = document.getElementById('emoji-search');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                // 重置当前页
                currentPage = 1;
                
                // 初始化表情网格
                initEmojiGrid();
            }
        });
    }
    
    // 语言选择器
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
}

// 生成随机表情
// 生成随机表情
function generateRandomEmoji() {
    // 获取随机表情
    const randomIndex = Math.floor(Math.random() * allEmojis.length);
    const randomEmoji = allEmojis[randomIndex];
    
    // 更新表情显示
    const emojiResult = document.getElementById('emoji-result');
    const emojiName = document.getElementById('emoji-name');
    
    if (emojiResult && emojiName) {
        emojiResult.textContent = randomEmoji.emoji;
        
        // 根据当前语言显示名称
        if (currentLanguage === 'en') {
            // 英文名称通常是 keywords 的第一个
            emojiName.textContent = randomEmoji.keywords[0].charAt(0).toUpperCase() + randomEmoji.keywords[0].slice(1);
        } else {
            emojiName.textContent = randomEmoji.name;
        }
        
        // 添加动画效果
        emojiResult.classList.remove('pulse');
        void emojiResult.offsetWidth; // 触发重绘
        emojiResult.classList.add('pulse');
    }
}

// 复制表情
function copyEmoji() {
    const emojiResult = document.getElementById('emoji-result');
    
    if (emojiResult) {
        const emoji = emojiResult.textContent;
        
        // 尝试复制到剪贴板
        navigator.clipboard.writeText(emoji)
            .then(() => {
                showNotification(getTranslation('notifications.copied'), 'success');
            })
            .catch(() => {
                // 如果 API 不可用，使用备用方法
                const textarea = document.createElement('textarea');
                textarea.value = emoji;
                textarea.style.position = 'fixed';
                textarea.style.opacity = 0;
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        showNotification(getTranslation('notifications.copied'), 'success');
                    } else {
                        showNotification(getTranslation('notifications.error'), 'error');
                    }
                } catch (err) {
                    showNotification(getTranslation('notifications.error'), 'error');
                }
                
                document.body.removeChild(textarea);
            });
    }
}

// 过滤表情
function filterEmojis() {
    // 获取搜索关键字
    const searchInput = document.getElementById('emoji-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // 过滤表情
    filteredEmojis = allEmojis.filter(emoji => {
        // 类别过滤
        const categoryMatch = currentCategory === 'all' || emoji.category === currentCategory;
        
        // 搜索过滤
        let searchMatch = true;
        if (searchTerm) {
            searchMatch = emoji.name.toLowerCase().includes(searchTerm) || 
                          emoji.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));
        }
        
        return categoryMatch && searchMatch;
    });
}

// 渲染表情网格
// 渲染表情网格
function renderEmojiGrid() {
    const emojiGrid = document.getElementById('emoji-grid');
    
    if (emojiGrid) {
        // 清空网格
        emojiGrid.innerHTML = '';
        
        // 计算分页
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredEmojis.length);
        
        // 如果没有匹配的表情
        if (filteredEmojis.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = currentLanguage === 'zh' ? '没有找到匹配的表情' : 'No matching emojis found';
            emojiGrid.appendChild(noResults);
            return;
        }
        
        // 渲染表情项
        for (let i = startIndex; i < endIndex; i++) {
            const emoji = filteredEmojis[i];
            
            // 创建表情项
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item';
            
            // 创建表情
            const emojiSpan = document.createElement('div');
            emojiSpan.className = 'emoji';
            emojiSpan.textContent = emoji.emoji;
            
            // 创建名称
            const nameSpan = document.createElement('p');
            nameSpan.className = 'name';
            
            // 根据当前语言显示名称
            if (currentLanguage === 'en') {
                // 英文名称通常是 keywords 的第一个
                nameSpan.textContent = emoji.keywords[0].charAt(0).toUpperCase() + emoji.keywords[0].slice(1);
            } else {
                nameSpan.textContent = emoji.name;
            }
            
            // 添加点击事件
            emojiItem.addEventListener('click', function() {
                // 更新表情显示
                const emojiResult = document.getElementById('emoji-result');
                const emojiName = document.getElementById('emoji-name');
                
                if (emojiResult && emojiName) {
                    emojiResult.textContent = emoji.emoji;
                    
                    // 根据当前语言显示名称
                    if (currentLanguage === 'en') {
                        emojiName.textContent = emoji.keywords[0].charAt(0).toUpperCase() + emoji.keywords[0].slice(1);
                    } else {
                        emojiName.textContent = emoji.name;
                    }
                    
                    // 添加动画效果
                    emojiResult.classList.remove('pulse');
                    void emojiResult.offsetWidth; // 触发重绘
                    emojiResult.classList.add('pulse');
                }
            });
            
            // 添加到表情项
            emojiItem.appendChild(emojiSpan);
            emojiItem.appendChild(nameSpan);
            
            // 添加到网格
            emojiGrid.appendChild(emojiItem);
        }
    }
}

// 渲染分页
function renderPagination() {
    const pagination = document.getElementById('pagination');
    
    if (pagination) {
        // 清空分页
        pagination.innerHTML = '';
        
        // 计算总页数
        const totalPages = Math.ceil(filteredEmojis.length / itemsPerPage);
        
        // 如果只有一页，不显示分页
        if (totalPages <= 1) {
            return;
        }
        
        // 添加上一页按钮
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&laquo;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderEmojiGrid();
                renderPagination();
                
                // 滚动到分类区域顶部
                const categoriesSection = document.querySelector('.categories');
                if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        pagination.appendChild(prevBtn);
        
        // 添加页码按钮
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // 调整起始页
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.addEventListener('click', function() {
                currentPage = i;
                renderEmojiGrid();
                renderPagination();
                
                // 滚动到分类区域顶部
                const categoriesSection = document.querySelector('.categories');
                if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            pagination.appendChild(pageBtn);
        }
        
        // 添加下一页按钮
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '&raquo;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                renderEmojiGrid();
                renderPagination();
                
                // 滚动到分类区域顶部
                const categoriesSection = document.querySelector('.categories');
                if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
        pagination.appendChild(nextBtn);
    }
}

// 初始化手风琴
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        if (header) {
            header.addEventListener('click', function() {
                // 切换活动状态
                item.classList.toggle('active');
            });
        }
    });
}

// 初始化滚动到顶部按钮
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        // 监听滚动事件
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        // 添加点击事件
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// 显示通知
function showNotification(message, type) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到文档
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自动关闭
    setTimeout(() => {
        notification.classList.remove('show');
        
        // 移除元素
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 初始化表情云
// 初始化表情云
function initEmojiCloud() {
    const emojiCloud = document.querySelector('.emoji-cloud');
    
    if (emojiCloud) {
        // 清空云
        emojiCloud.innerHTML = '';
        
        // 检查 allEmojis 是否有数据
        if (allEmojis.length === 0) {
            console.error('表情数据未加载，无法初始化表情云');
            return;
        }
        
        // 随机选择12个表情
        const randomEmojis = [];
        const totalEmojis = allEmojis.length;
        
        for (let i = 0; i < 12; i++) {
            const randomIndex = Math.floor(Math.random() * totalEmojis);
            randomEmojis.push(allEmojis[randomIndex].emoji);
        }
        
        // 添加到云
        randomEmojis.forEach((emoji, index) => {
            const span = document.createElement('span');
            span.textContent = emoji;
            emojiCloud.appendChild(span);
        });
    }
}

// 在页面加载时初始化表情云
document.addEventListener('DOMContentLoaded', function() {
    initEmojiCloud();
});