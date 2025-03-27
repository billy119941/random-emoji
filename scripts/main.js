// 全局变量
let currentCategory = 'all';
let currentPage = 1;
let itemsPerPage = 24;
let filteredEmojis = [];
let allEmojis = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 移除右下角的 Twemoji 测试窗口
    const testDialog = document.querySelector('.twemoji-test-dialog');
    if (testDialog) {
        testDialog.remove();
    }
    
    // 移除可能的关闭测试按钮 - 使用有效的选择器
    const closeTestBtn = document.querySelector('.close-test-btn');
    if (closeTestBtn) {
        const testContainer = closeTestBtn.closest('.test-container, .dialog-container');
        if (testContainer) {
            testContainer.remove();
        } else {
            closeTestBtn.remove();
        }
    }
    
    // 查找包含"关闭测试"文本的按钮
    document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent.includes('关闭测试')) {
            const testContainer = btn.closest('.test-container, .dialog-container');
            if (testContainer) {
                testContainer.remove();
            } else {
                btn.remove();
            }
        }
    });
    
    // 移除右下角的测试面板
    const testPanel = document.querySelector('.emoji-test-panel, .test-panel');
    if (testPanel) {
        testPanel.remove();
    }
    
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
    
    // 初始化表情云
    initEmojiCloud();
    
    // 设置当前年份
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // 确保选择器样式在所有浏览器中都能正常工作
    document.querySelectorAll('.count-option input').forEach(input => {
        // 初始检查
        if(input.checked) {
            input.closest('.count-option').classList.add('selected');
        }
        
        // 监听变化
        input.addEventListener('change', function() {
            // 移除所有选中类
            document.querySelectorAll('.count-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // 为当前选中项添加类
            if(this.checked) {
                this.closest('.count-option').classList.add('selected');
            }
        });
    });
});

// 合并所有表情数据
function combineEmojiData() {
    allEmojis = [];
    
    // 检查并等待 emojiData 加载
    if (typeof emojiData === 'undefined') {
        setTimeout(combineEmojiData, 100);
        return;
    }
    
    // 遍历所有类别
    for (const category in emojiData) {
        emojiData[category].forEach(emoji => {
            emoji.category = category;
            allEmojis.push(emoji);
        });
    }
    
    filteredEmojis = [...allEmojis];
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
        // 移除所有现有的点击事件监听器
        const newBtn = generateBtn.cloneNode(true);
        generateBtn.parentNode.replaceChild(newBtn, generateBtn);
        
        // 添加新的点击事件监听器
        newBtn.addEventListener('click', function(event) {
            generateRandomEmoji();
            // 阻止事件冒泡，防止其他监听器被触发
            event.stopPropagation();
        });
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
function generateRandomEmoji() {
    // 获取随机表情
    const randomIndex = Math.floor(Math.random() * allEmojis.length);
    const randomEmoji = allEmojis[randomIndex];
    
    // 更新表情显示
    const emojiResult = document.getElementById('emoji-result');
    const emojiName = document.getElementById('emoji-name');
    
    if (emojiResult && emojiName) {
        // 清空元素内容后再设置新的表情
        emojiResult.innerHTML = '';
        emojiResult.textContent = randomEmoji.emoji;
        
        // 使用 Twemoji 解析并替换为图片
        if (typeof twemoji === 'object') {
            twemoji.parse(emojiResult, {
                folder: 'svg',
                ext: '.svg',
                base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/'
            });
        }
        
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
function initEmojiCloud() {
    const emojiCloud = document.querySelector('.emoji-cloud');
    
    if (emojiCloud && allEmojis.length > 0) {
        emojiCloud.innerHTML = '';
        
        // 随机选择表情并添加到云
        Array.from({ length: 12 }, () => {
            const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)].emoji;
            const span = document.createElement('span');
            span.textContent = randomEmoji;
            emojiCloud.appendChild(span);
        });
    }
}