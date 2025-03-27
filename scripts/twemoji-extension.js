/**
 * Twemoji扩展功能 - 提供额外的Twemoji数据和API集成
 */

// 创建Twemoji数据源
function initTwemojiData() {
    // 定义一个包含额外Twemoji的数组
    const twemojiData = [
        { emoji: "🔥", name: "Fire", keywords: ["fire", "flame", "hot"], category: "objects" },
        { emoji: "✅", name: "Check Mark", keywords: ["check", "mark", "verified"], category: "symbols" },
        { emoji: "🚀", name: "Rocket", keywords: ["rocket", "space", "launch"], category: "travel" },
        { emoji: "💯", name: "Hundred Points", keywords: ["hundred", "points", "score"], category: "symbols" },
        { emoji: "⭐", name: "Star", keywords: ["star", "rating", "favorite"], category: "symbols" },
        { emoji: "🌈", name: "Rainbow", keywords: ["rainbow", "colorful", "weather"], category: "animals" },
        { emoji: "💎", name: "Gem Stone", keywords: ["gem", "diamond", "jewel"], category: "objects" },
        { emoji: "🎉", name: "Party Popper", keywords: ["party", "celebration", "congratulations"], category: "activities" },
        { emoji: "👑", name: "Crown", keywords: ["crown", "king", "queen", "royal"], category: "objects" },
        { emoji: "🎮", name: "Video Game", keywords: ["game", "controller", "play"], category: "activities" }
    ];
    
    // 为每个emoji添加来源标记
    twemojiData.forEach(item => {
        item.source = "twemoji";
    });
    
    return twemojiData;
}

// 从API获取Twemoji数据
async function fetchTwemojiFromAPI() {
    try {
        // 使用fetch API调用emoji数据源
        const response = await fetch('https://emoji-api.com/emojis?access_key=YOUR_API_KEY');
        
        if (!response.ok) {
            throw new Error('网络请求失败');
        }
        
        const data = await response.json();
        
        // 处理API返回的数据，转换为我们需要的格式
        const apiEmojis = data.map(item => {
            return {
                emoji: item.character,
                name: item.unicodeName,
                keywords: item.slugs || [item.slug],
                category: item.group,
                source: "api-twemoji"
            };
        });
        
        console.log(`从API获取了${apiEmojis.length}个表情`);
        return apiEmojis;
    } catch (error) {
        console.error('获取Twemoji数据失败:', error);
        // 如果API调用失败，返回空数组，确保不影响现有功能
        return [];
    }
}

// 更可靠的API调用函数 - 使用公共CDN资源
async function fetchAdditionalEmojis() {
    try {
        // 使用更可靠的公共CDN资源获取emoji数据
        // 注意：这是使用jsDelivr CDN访问emoji数据的一种方式
        const response = await fetch('https://cdn.jsdelivr.net/npm/emoji-datasource@14.0.0/emoji.json');
        
        if (!response.ok) {
            console.warn('API请求失败，将使用备用数据');
            return getBackupEmojis(); // 使用备用数据
        }
        
        const data = await response.json();
        console.log('从网络获取到', data.length, '个emoji');
        
        // 确保返回格式正确，只选取有unicode表示的emoji
        const formattedData = data
            .filter(item => item.unified && item.unified.length > 0) // 确保有unicode值
            .map(item => {
                // 将unicode十六进制字符串转换成实际emoji
                const codePoints = item.unified.split('-').map(hex => parseInt(hex, 16));
                const emoji = String.fromCodePoint(...codePoints);
                
                return {
                    emoji: emoji,
                    name: item.name || item.short_name || "emoji",
                    keywords: item.short_names || [item.short_name || "emoji"],
                    category: item.category || "symbols",
                    source: "network-emoji"
                };
            });
        
        // 仅选择部分网络emoji，避免数量过多
        const selection = formattedData.slice(0, 100); // 限制为额外的100个emoji
        console.log('选择了', selection.length, '个网络emoji添加到库中');
        return selection;
    } catch (error) {
        console.error('加载额外emoji失败:', error);
        console.log('将使用备用数据');
        return getBackupEmojis(); // 出错时使用备用数据
    }
}

// 备用数据函数 - 确保即使API失败也有额外emoji
function getBackupEmojis() {
    // 一组精选emoji，确保多样性
    return [
        { emoji: "🥳", name: "Partying Face", keywords: ["party", "celebration"], category: "smileys", source: "twemoji" },
        { emoji: "🤩", name: "Star-Struck", keywords: ["star", "excited"], category: "smileys", source: "twemoji" },
        { emoji: "🥰", name: "Smiling Face with Hearts", keywords: ["love", "smile"], category: "smileys", source: "twemoji" },
        { emoji: "🦄", name: "Unicorn", keywords: ["unicorn", "mythical"], category: "animals", source: "twemoji" },
        { emoji: "🌮", name: "Taco", keywords: ["taco", "food"], category: "food", source: "twemoji" },
        { emoji: "🎸", name: "Guitar", keywords: ["guitar", "music"], category: "activities", source: "twemoji" },
        { emoji: "🧬", name: "DNA", keywords: ["dna", "science"], category: "objects", source: "twemoji" },
        { emoji: "🏝️", name: "Desert Island", keywords: ["island", "beach"], category: "travel", source: "twemoji" },
        { emoji: "🪐", name: "Ringed Planet", keywords: ["planet", "space"], category: "travel", source: "twemoji" },
        { emoji: "✨", name: "Sparkles", keywords: ["sparkle", "shiny"], category: "symbols", source: "twemoji" },
        { emoji: "⚡", name: "High Voltage", keywords: ["lightning", "energy"], category: "symbols", source: "twemoji" },
        { emoji: "🍄", name: "Mushroom", keywords: ["mushroom", "fungus"], category: "food", source: "twemoji" },
        { emoji: "🧸", name: "Teddy Bear", keywords: ["bear", "toy"], category: "objects", source: "twemoji" },
        { emoji: "🧩", name: "Puzzle Piece", keywords: ["puzzle", "game"], category: "activities", source: "twemoji" },
        { emoji: "🧠", name: "Brain", keywords: ["brain", "mind"], category: "people", source: "twemoji" }
    ];
}

// 修改初始化函数，整合本地和API数据
async function initEmojiData() {
    // 获取本地数据
    const localTwemojiData = initTwemojiData();
    
    // 获取API数据
    let apiData = [];
    try {
        apiData = await fetchTwemojiFromAPI();
    } catch (error) {
        console.error('API调用失败，将仅使用本地数据');
    }
    
    // 合并数据并返回
    return [...localTwemojiData, ...apiData];
}

// 初始化变量
let additionalEmojisLoaded = false;
let combinedEmojiData = [];

// 初始化数据，确保只执行一次
async function initializeEmojiData() {
    if (additionalEmojisLoaded) return combinedEmojiData;
    
    // 显示加载中状态
    const emojiContainer = document.getElementById('emoji-container');
    if (emojiContainer) {
        emojiContainer.innerHTML = '<div class="emoji-loading"></div>';
    }
    
    try {
        console.log('开始获取额外emoji数据...');
        // 获取额外的emoji
        const additionalEmojis = await fetchAdditionalEmojis();
        
        // 检查是否成功获取了额外emoji
        if (additionalEmojis && additionalEmojis.length > 0) {
            console.log(`成功获取了${additionalEmojis.length}个额外emoji`);
            
            // 获取原始的本地emoji数据
            // 注意：我们应该确保使用main.js中的原始变量，而不是创建新的空数组
            let localEmojis = [];
            if (typeof window.allEmojis !== 'undefined' && Array.isArray(window.allEmojis)) {
                localEmojis = window.allEmojis;
                console.log(`找到${localEmojis.length}个本地emoji`);
            } else if (typeof allEmojis !== 'undefined' && Array.isArray(allEmojis)) {
                // 尝试直接访问allEmojis变量（如果它是全局的）
                localEmojis = allEmojis;
                console.log(`找到${localEmojis.length}个本地emoji（通过直接访问）`);
            } else {
                console.warn('找不到本地emoji数据，将只使用网络数据');
            }
            
            // 合并数据，确保没有重复
            const mergedEmojis = [...localEmojis];
            const existingUnicodes = new Set(mergedEmojis.map(e => e.emoji));
            
            // 添加不重复的emoji并标记来源
            let addedCount = 0;
            additionalEmojis.forEach(item => {
                if (!existingUnicodes.has(item.emoji)) {
                    // 确保标记来源以便在UI中区分
                    item.source = "network";
                    mergedEmojis.push(item);
                    existingUnicodes.add(item.emoji);
                    addedCount++;
                }
            });
            
            console.log(`添加了${addedCount}个不重复的网络emoji`);
            combinedEmojiData = mergedEmojis;
            console.log('合并后共有', combinedEmojiData.length, '个emoji');
            
            // 重要：更新全局变量以确保其他函数能使用这些数据
            window.combinedEmojis = combinedEmojiData;
            
            // 也保存到原始变量中以兼容现有代码
            if (typeof window.allEmojis !== 'undefined') {
                window.allEmojis = combinedEmojiData;
            }
        } else {
            console.warn('未获取到额外emoji，仅使用本地数据');
            combinedEmojiData = window.allEmojis || [];
        }
        
        // 标记已加载
        additionalEmojisLoaded = true;
        
        return combinedEmojiData;
    } catch (error) {
        console.error('初始化emoji数据失败:', error);
        // 出错时也使用本地数据
        combinedEmojiData = window.allEmojis || [];
        return combinedEmojiData;
    }
}

// 修改多表情生成功能初始化
async function initTwemojiGeneration() {
    // 获取所有emoji数据源
    const twemojiData = await initEmojiData();
    
    // 将数据保存到全局变量，以供使用
    window.combinedEmojis = [...allEmojis, ...twemojiData];
    
    // 复制按钮事件处理
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            if (lastRandomEmojis.length > 0) {
                copyEmoji(lastRandomEmojis[0].emoji);
            }
        });
    }
    
    // 复制全部按钮
    const copyAllBtn = document.getElementById('copy-all-btn');
    if (copyAllBtn) {
        copyAllBtn.addEventListener('click', copyAllEmojis);
    }
    
    // 生成按钮
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            console.log("点击了生成按钮");
            generateEnhancedEmojis();
        });
    }
    
    // 初始化时生成默认数量的表情
    generateEnhancedEmojis();
}

// 修改显示函数以正确查找容器
function displayEmojis(emojis) {
    // 尝试多种可能的容器选择器
    const container = document.getElementById('emoji-result') || 
                      document.querySelector('.emoji-result') ||
                      document.getElementById('emoji-container') ||
                      document.querySelector('.random-emoji-result');
    
    if (!container) {
        console.error('未找到emoji显示容器，请检查HTML结构');
        
        // 尝试查找原始代码中使用的容器
        const originalContainer = document.getElementById('emoji-display') ||
                                document.querySelector('.emoji-display');
        
        if (originalContainer) {
            console.log('找到原始emoji显示容器，将使用它');
            
            // 使用原始容器显示
            displayEmojisInOriginalContainer(emojis, originalContainer);
            return;
        }
        
        // 创建一个新的容器作为备用
        createFallbackContainer(emojis);
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 添加每个emoji
    emojis.forEach(emoji => {
        const emojiElement = document.createElement('div');
        emojiElement.classList.add('emoji-item-display');
        
        const emojiChar = document.createElement('div');
        emojiChar.classList.add('emoji-char');
        emojiChar.textContent = emoji.emoji;
        
        const emojiName = document.createElement('div');
        emojiName.classList.add('emoji-name');
        emojiName.textContent = emoji.name || "表情";
        
        // 给网络来源的emoji添加特殊样式
        if (emoji.source === "network") {
            emojiName.classList.add('network-source');
            emojiName.textContent += " ⭐"; // 添加标记以区分网络emoji
            console.log(`显示网络emoji: ${emoji.emoji}`);
        }
        
        emojiElement.appendChild(emojiChar);
        emojiElement.appendChild(emojiName);
        
        container.appendChild(emojiElement);
    });
}

// 使用原始容器显示emoji的备用函数
function displayEmojisInOriginalContainer(emojis, container) {
    // 根据原始代码的容器结构来显示emoji
    if (emojis.length === 0) return;
    
    // 假设原始容器期望直接显示emoji字符
    container.innerHTML = '';
    
    // 对于第一个emoji，可能单独显示
    const mainEmojiElement = document.createElement('div');
    mainEmojiElement.classList.add('emoji-result');
    mainEmojiElement.textContent = emojis[0].emoji;
    container.appendChild(mainEmojiElement);
    
    // 如果有名称显示区域
    const nameElement = document.getElementById('emoji-name');
    if (nameElement) {
        nameElement.textContent = emojis[0].name;
        // 标记网络来源
        if (emojis[0].source === "network") {
            nameElement.textContent += " ⭐";
            nameElement.classList.add('network-source');
        }
    }
    
    // 如果有多个emoji，可能需要在别处显示
    if (emojis.length > 1) {
        const additionalContainer = document.getElementById('additional-emojis') ||
                                  document.createElement('div');
        
        if (!document.getElementById('additional-emojis')) {
            additionalContainer.id = 'additional-emojis';
            additionalContainer.style.marginTop = '10px';
            additionalContainer.style.display = 'flex';
            additionalContainer.style.gap = '10px';
            additionalContainer.style.justifyContent = 'center';
            container.parentNode.appendChild(additionalContainer);
        } else {
            additionalContainer.innerHTML = '';
        }
        
        // 显示额外的emoji
        for (let i = 1; i < emojis.length; i++) {
            const extraEmoji = document.createElement('div');
            extraEmoji.textContent = emojis[i].emoji;
            extraEmoji.style.fontSize = '2rem';
            
            // 标记网络来源
            if (emojis[i].source === "network") {
                extraEmoji.classList.add('network-source');
                // 添加闪光效果
                extraEmoji.style.position = 'relative';
                extraEmoji.style.animation = 'pulse 2s infinite';
            }
            
            additionalContainer.appendChild(extraEmoji);
        }
    }
    
    console.log(`在原始容器中显示了${emojis.length}个emoji`);
}

// 创建备用容器
function createFallbackContainer(emojis) {
    // 仅用于调试，不再创建视觉元素
    console.log('调试信息：选择的emoji:', emojis.map(e => e.emoji).join(' '));
    return emojis;
}

// 确保直接干预DOM中的选择器
function updateEmojiCountSelectors() {
    console.log('更新表情数量选择器，默认为1');
    
    // 更新页面中的选择器
    const countOptions = document.querySelectorAll('.count-option input');
    if (countOptions.length > 0) {
        let foundSelected = false;
        
        countOptions.forEach(option => {
            // 如果是数值为1的选项，设为选中
            if (option.value === "1") {
                option.checked = true;
                foundSelected = true;
                console.log('将选择器设置为默认值1');
            } else {
                // 确保其他选项未选中
                option.checked = false;
            }
        });
        
        // 如果没有找到值为1的选项，选中第一个
        if (!foundSelected && countOptions.length > 0) {
            countOptions[0].checked = true;
            console.log('未找到值为1的选项，选中第一个选项');
        }
    } else {
        // 尝试查找数字按钮
        const numberButtons = document.querySelectorAll('[data-count]');
        if (numberButtons.length > 0) {
            numberButtons.forEach(button => {
                if (button.getAttribute('data-count') === "1") {
                    // 添加选中类
                    button.classList.add('active', 'selected');
                    console.log('找到数字按钮并设置1为活动状态');
                } else {
                    // 移除其他按钮的选中状态
                    button.classList.remove('active', 'selected');
                }
            });
        }
    }
    
    // 更新全局变量
    window.selectedEmojiCount = 1;
    
    // 直接查找并设置相关变量
    if (typeof selectedEmojiCount !== 'undefined') {
        console.log('直接设置selectedEmojiCount = 1');
        selectedEmojiCount = 1;
    }
}

// 直接替换生成函数
function directlyReplaceGenerationLogic() {
    console.log('直接替换随机生成逻辑');
    
    // 直接干预页面上的生成按钮
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        console.log('找到生成按钮，替换点击处理函数');
        
        // 保存原始点击处理程序
        const originalOnClick = generateBtn.onclick;
        
        // 设置新的处理程序
        generateBtn.onclick = function(event) {
            console.log('生成按钮被点击');
            
            // 获取选中的表情数量
            let count = 1; // 默认为1
            
            // 查找选中的选项
            const selectedOption = document.querySelector('.count-option input:checked');
            if (selectedOption) {
                count = parseInt(selectedOption.value);
            } 
            // 查找其他可能的选择器
            else {
                const activeButton = document.querySelector('[data-count].active') || 
                                    document.querySelector('[data-count].selected');
                if (activeButton) {
                    count = parseInt(activeButton.getAttribute('data-count'));
                }
            }
            
            console.log(`准备生成${count}个表情`);
            
            // 使用合并后的数据生成emoji
            const emojiData = combinedEmojiData.length > 0 ? combinedEmojiData : 
                            (window.combinedEmojis || window.allEmojis || []);
            
            if (emojiData.length === 0) {
                console.log('未找到emoji数据，尝试使用原始处理程序');
                if (originalOnClick) {
                    return originalOnClick.call(this, event);
                }
                return;
            }
            
            // 随机选择表情
            const selectedEmojis = [];
            const tempEmojiData = [...emojiData];
            
            // 确保至少选择一个网络emoji
            const networkEmojis = tempEmojiData.filter(e => e.source === "network");
            if (networkEmojis.length > 0 && count > 0) {
                const randomNetworkIndex = Math.floor(Math.random() * networkEmojis.length);
                const selectedNetworkEmoji = networkEmojis[randomNetworkIndex];
                
                selectedEmojis.push(selectedNetworkEmoji);
                const indexInTemp = tempEmojiData.findIndex(e => e.emoji === selectedNetworkEmoji.emoji);
                if (indexInTemp !== -1) {
                    tempEmojiData.splice(indexInTemp, 1);
                }
                
                count--;
            }
            
            // 选择剩余的emoji
            for (let i = 0; i < count && tempEmojiData.length > 0; i++) {
                const randomIndex = Math.floor(Math.random() * tempEmojiData.length);
                selectedEmojis.push(tempEmojiData[randomIndex]);
                tempEmojiData.splice(randomIndex, 1);
            }
            
            console.log(`选择了${selectedEmojis.length}个emoji`);
            
            // 使用页面上已有的函数显示结果
            if (typeof displayEmojiResult === 'function') {
                displayEmojiResult(selectedEmojis);
                console.log('使用现有的displayEmojiResult函数显示结果');
                return;
            }
            
            // 尝试查找显示容器并直接更新
            const resultContainer = document.getElementById('emoji-result') || 
                                   document.querySelector('.emoji-result');
            
            if (resultContainer) {
                resultContainer.textContent = selectedEmojis[0].emoji;
                console.log('直接更新emoji结果容器');
                
                // 尝试更新emoji名称
                const nameElement = document.getElementById('emoji-name');
                if (nameElement) {
                    let name = selectedEmojis[0].name || "表情";
                    if (selectedEmojis[0].source === "network") {
                        name += " ⭐";
                    }
                    nameElement.textContent = name;
                }
                
                // 如果有多个emoji，尝试显示它们
                if (selectedEmojis.length > 1) {
                    let additionalContainer = document.getElementById('additional-emojis');
                    if (!additionalContainer) {
                        additionalContainer = document.createElement('div');
                        additionalContainer.id = 'additional-emojis';
                        additionalContainer.style.display = 'flex';
                        additionalContainer.style.justifyContent = 'center';
                        additionalContainer.style.gap = '10px';
                        additionalContainer.style.marginTop = '15px';
                        
                        // 添加到结果附近
                        const parentElement = resultContainer.parentElement;
                        if (parentElement) {
                            parentElement.appendChild(additionalContainer);
                        }
                    } else {
                        additionalContainer.innerHTML = '';
                    }
                    
                    // 添加额外的emoji
                    for (let i = 1; i < selectedEmojis.length; i++) {
                        const emojiSpan = document.createElement('span');
                        emojiSpan.textContent = selectedEmojis[i].emoji;
                        emojiSpan.style.fontSize = '1.5rem';
                        if (selectedEmojis[i].source === "network") {
                            emojiSpan.style.textDecoration = 'underline';
                        }
                        additionalContainer.appendChild(emojiSpan);
                    }
                }
            }
            
            // 更新本地存储的数据，保持一致性
            if (window.lastRandomEmojis !== undefined) {
                window.lastRandomEmojis = selectedEmojis;
            }
            
            // 阻止默认行为和事件冒泡
            event.preventDefault();
            event.stopPropagation();
        };
    }
}

// 修改主页加载完成后的行为
function modifyInitialPageLoad() {
    console.log('修改页面初始加载行为');
    
    // 在页面完全加载后进行检查
    const checkAndModify = function() {
        console.log('检查页面状态并更新初始值');
        
        // 更新选择器
        updateEmojiCountSelectors();
        
        // 如果页面有emoji但还没生成，手动触发生成一个
        const resultContainer = document.getElementById('emoji-result') || 
                               document.querySelector('.emoji-result');
        
        if (resultContainer && (!resultContainer.textContent || resultContainer.textContent.trim() === '')) {
            console.log('页面加载完成但emoji未生成，手动触发生成一个');
            
            // 手动触发生成按钮
            const generateBtn = document.getElementById('generate-btn');
            if (generateBtn) {
                // 创建并触发点击事件
                const clickEvent = new Event('click', {
                    bubbles: true,
                    cancelable: true
                });
                generateBtn.dispatchEvent(clickEvent);
            }
        }
    };
    
    // 等待页面元素完全加载
    if (document.readyState === 'complete') {
        checkAndModify();
    } else {
        window.addEventListener('load', checkAndModify);
    }
}

// 立即执行的初始化函数，在脚本加载时立即运行
(function() {
    // 拦截原始的selectedEmojiCount变量
    Object.defineProperty(window, 'selectedEmojiCount', {
        value: 1,
        writable: true,
        configurable: true
    });
    
    // 早期修改document.readyState事件
    const originalReadyStateChange = document.onreadystatechange;
    document.onreadystatechange = function() {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
            console.log('文档状态变更，立即设置默认emoji数为1');
            
            // 确保selectedEmojiCount为1
            window.selectedEmojiCount = 1;
            
            // 尝试直接访问内部变量
            if (typeof selectedEmojiCount !== 'undefined') {
                selectedEmojiCount = 1;
            }
            
            // 立即更新选择器
            const countOptions = document.querySelectorAll('.count-option input');
            if (countOptions.length > 0) {
                countOptions.forEach(option => {
                    option.checked = option.value === "1";
                });
            }
            
            // 查找并更新数字按钮
            const numberButtons = document.querySelectorAll('[data-count]');
            if (numberButtons.length > 0) {
                numberButtons.forEach(button => {
                    if (button.getAttribute('data-count') === "1") {
                        button.classList.add('active', 'selected');
                    } else {
                        button.classList.remove('active', 'selected');
                    }
                });
            }
        }
        
        // 调用原始的readyStateChange处理函数（如果有）
        if (originalReadyStateChange) {
            originalReadyStateChange.apply(this, arguments);
        }
    };
    
    // 尝试修改main.js中的初始化行为
    // 使用MutationObserver监视DOM变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 检查是否添加了emoji数量选择器
                const countSelectors = document.querySelectorAll('.count-option input, [data-count]');
                if (countSelectors.length > 0) {
                    console.log('检测到emoji数量选择器已添加到DOM，设置默认值为1');
                    
                    // 设置默认选中1
                    countSelectors.forEach(selector => {
                        if (selector.tagName === 'INPUT') {
                            selector.checked = selector.value === "1";
                        } else if (selector.getAttribute('data-count') === "1") {
                            selector.classList.add('active', 'selected');
                        } else {
                            selector.classList.remove('active', 'selected');
                        }
                    });
                    
                    // 修改完成后断开观察器
                    observer.disconnect();
                }
            }
        });
    });
    
    // 开始观察文档变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();

// 增强处理按钮选择的逻辑
window.addEventListener('DOMContentLoaded', function() {
    // 修改所有数字按钮的点击行为
    const numberButtons = document.querySelectorAll('[data-count], .count-option, .number-selector');
    if (numberButtons.length > 0) {
        numberButtons.forEach(button => {
            // 移除原有的点击事件监听器
            const clone = button.cloneNode(true);
            button.parentNode.replaceChild(clone, button);
            
            // 添加新的点击事件监听器
            clone.addEventListener('click', function(e) {
                let count = 1;
                
                // 确定选中的数量
                if (this.hasAttribute('data-count')) {
                    count = parseInt(this.getAttribute('data-count'));
                } else if (this.querySelector('input')) {
                    const input = this.querySelector('input');
                    count = parseInt(input.value);
                    input.checked = true;
                }
                
                // 设置全局变量
                window.selectedEmojiCount = count;
                console.log(`设置表情数量为: ${count}`);
                
                // 更新所有按钮的状态
                document.querySelectorAll('[data-count], .count-option input').forEach(el => {
                    if (el.tagName === 'INPUT') {
                        el.checked = parseInt(el.value) === count;
                    } else {
                        // 移除所有按钮的活动状态
                        el.classList.remove('active', 'selected');
                        
                        // 给当前选中的按钮添加活动状态
                        if (parseInt(el.getAttribute('data-count')) === count) {
                            el.classList.add('active', 'selected');
                        }
                    }
                });
                
                // 阻止事件冒泡
                e.stopPropagation();
            });
        });
    }
    
    // 添加页面加载完成后的检查
    window.addEventListener('load', function() {
        console.log('页面完全加载，确保默认emoji数为1');
        
        // 再次确保选中的是1
        const numberButtons = document.querySelectorAll('[data-count], .count-option input');
        let hasSelection = false;
        
        numberButtons.forEach(el => {
            if ((el.tagName === 'INPUT' && el.checked) || 
                (el.classList.contains('active') || el.classList.contains('selected'))) {
                hasSelection = true;
            }
        });
        
        // 如果没有任何选择，强制选择1
        if (!hasSelection) {
            numberButtons.forEach(el => {
                if (el.tagName === 'INPUT') {
                    el.checked = el.value === "1";
                } else if (el.getAttribute('data-count') === "1") {
                    el.classList.add('active', 'selected');
                }
            });
            
            window.selectedEmojiCount = 1;
        }
    });
});

// 增加兜底方案，确保页面内代码首次加载emoji时使用1个
// 修改main.js中的初始化逻辑
const originalInitEmojiGrid = window.initEmojiGrid;
if (typeof originalInitEmojiGrid === 'function') {
    window.initEmojiGrid = function() {
        console.log('拦截并修改initEmojiGrid函数，确保首次加载生成1个emoji');
        window.selectedEmojiCount = 1;
        return originalInitEmojiGrid.apply(this, arguments);
    };
}

// 添加一个辅助函数来帮助调试
function analyzeEmojiData() {
    const data = combinedEmojiData.length > 0 ? combinedEmojiData : 
                (window.combinedEmojis || window.allEmojis || []);
    
    let networkCount = 0;
    let localCount = 0;
    let categories = {};
    
    data.forEach(emoji => {
        if (emoji.source === "network") networkCount++;
        else localCount++;
        
        if (emoji.category) {
            categories[emoji.category] = (categories[emoji.category] || 0) + 1;
        }
    });
    
    console.log(`===== Emoji数据分析 =====`);
    console.log(`总数: ${data.length}个emoji`);
    console.log(`本地: ${localCount}个emoji`);
    console.log(`网络: ${networkCount}个emoji`);
    console.log(`分类统计:`, categories);
    console.log(`========================`);
}

// 定义缺失的updateTwemojiHandler函数
function updateTwemojiHandler() {
    console.log("更新Twemoji处理程序");
    
    // 检查是否有额外加载的emoji
    if (combinedEmojiData && combinedEmojiData.length > 0) {
        // 更新UI以显示额外的emoji已加载
        const statusElement = document.getElementById('twemoji-status');
        if (statusElement) {
            statusElement.textContent = `✅ 已加载 ${combinedEmojiData.length} 个表情`;
            statusElement.style.color = '#00b894';
        }
        
        // 如果有生成按钮，更新其文本
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn) {
            generateBtn.textContent = '生成随机表情 ✨';
        }
    }
}

// 创建generateRandomEmojis函数来选择随机emoji
function generateRandomEmojis(count) {
    // 如果没有传入count参数，使用默认值1
    if (count === undefined) {
        count = 1; // 默认为1
    }
    
    console.log(`调用generateRandomEmojis函数，选择${count}个emoji`);
    
    // 使用合并后的emoji数据
    const emojiData = combinedEmojiData.length > 0 ? combinedEmojiData : 
                    (window.combinedEmojis || window.allEmojis || []);
    
    if (emojiData.length === 0) {
        console.error('未找到emoji数据');
        return [];
    }
    
    // 打印数据来源分析
    let networkCount = 0;
    emojiData.forEach(emoji => {
        if (emoji.source === "network") networkCount++;
    });
    console.log(`使用${emojiData.length}个emoji（本地${emojiData.length - networkCount}个，网络${networkCount}个）`);
    
    // 准备结果数组
    const selectedEmojis = [];
    
    // 1. 先从网络emoji中选择 - 优先使用网络emoji
    const networkEmojis = emojiData.filter(e => e.source === "network");
    if (networkEmojis.length > 0) {
        // 计算可以从网络emoji选择的数量
        // 尽可能多地使用网络emoji
        const networkSelectCount = Math.min(count, networkEmojis.length);
        console.log(`将从网络emoji中选择${networkSelectCount}个`);
        
        // 临时数组用于选择
        const tempNetworkEmojis = [...networkEmojis];
        
        // 随机选择指定数量的网络emoji
        for (let i = 0; i < networkSelectCount; i++) {
            const randomIndex = Math.floor(Math.random() * tempNetworkEmojis.length);
            const selected = tempNetworkEmojis[randomIndex];
            
            // 确保英文名称
            if (selected.keywords && selected.keywords.length > 0) {
                // 首字母大写处理英文名称
                const englishName = selected.keywords[0].charAt(0).toUpperCase() + selected.keywords[0].slice(1);
                selected.englishName = englishName;
            } else if (selected.name) {
                // 如果没有keywords但有name，用作备用
                selected.englishName = selected.name;
            }
            
            selectedEmojis.push(selected);
            tempNetworkEmojis.splice(randomIndex, 1);
        }
        
        // 如果已经选择足够数量的emoji，直接返回
        if (selectedEmojis.length >= count) {
            console.log(`已从网络资源选择${selectedEmojis.length}个emoji，满足要求数量${count}`);
            return selectedEmojis;
        }
    }
    
    // 2. 如果网络emoji不够，从本地emoji中补充选择
    const remainingCount = count - selectedEmojis.length;
    if (remainingCount > 0) {
        console.log(`需要从本地emoji中补充选择${remainingCount}个`);
        
        // 过滤掉已经选择的emoji
        const selectedUnicodes = new Set(selectedEmojis.map(e => e.emoji));
        const localEmojis = emojiData.filter(e => e.source !== "network" && !selectedUnicodes.has(e.emoji));
        
        // 临时数组用于选择
        const tempLocalEmojis = [...localEmojis];
        
        // 随机选择指定数量的本地emoji
        for (let i = 0; i < remainingCount && tempLocalEmojis.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * tempLocalEmojis.length);
            const selected = tempLocalEmojis[randomIndex];
            
            // 确保英文名称
            if (selected.keywords && selected.keywords.length > 0) {
                // 首字母大写处理英文名称
                const englishName = selected.keywords[0].charAt(0).toUpperCase() + selected.keywords[0].slice(1);
                selected.englishName = englishName;
            } else if (selected.name) {
                // 如果没有keywords但有name，用作备用
                selected.englishName = selected.name;
            }
            
            selectedEmojis.push(selected);
            tempLocalEmojis.splice(randomIndex, 1);
        }
    }
    
    console.log(`最终选择了${selectedEmojis.length}个emoji，包括${selectedEmojis.filter(e => e.source === "network").length}个网络emoji`);
    
    return selectedEmojis;
}

// 替换原始生成函数，优先使用网络表情
function enhanceOriginalGenerateFunction() {
    console.log('完全替换原始生成函数');
    
    // 将我们的函数直接绑定到全局对象
    window.generateRandomEmojis = generateRandomEmojis;
    
    // 修改生成按钮处理
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        console.log('找到生成按钮，修改处理程序');
        console.log('数据源已替换，原始UI将使用合并后的数据');
    }
}

// 修改多表情生成函数，优先使用网络emoji
function generateMultipleEmojis() {
    // 获取当前选择的表情数量
    let count = 1; // 默认值为1
    
    // 尝试从DOM获取
    const selectedOption = document.querySelector('.count-option input:checked');
    if (selectedOption) {
        count = parseInt(selectedOption.value);
    } 
    // 或从全局变量获取
    else if (typeof window.selectedEmojiCount !== 'undefined') {
        count = window.selectedEmojiCount;
    }
    
    console.log(`将生成${count}个emoji（优先使用网络资源）`);
    
    // 使用我们自己的函数生成emoji
    const randomEmojis = generateRandomEmojis(count);
    
    // 显示生成的emoji
    const emojiContainer = document.getElementById('emoji-container');
    if (emojiContainer && randomEmojis && randomEmojis.length > 0) {
        // 清空容器
        emojiContainer.innerHTML = '';
        
        // 保存最后生成的表情
        window.lastRandomEmojis = randomEmojis;
        
        // 显示每个emoji
        randomEmojis.forEach(emoji => {
            // 创建表情显示元素
            const emojiItem = document.createElement('div');
            emojiItem.className = 'emoji-item-display';
            
            // 创建表情元素
            const emojiResult = document.createElement('div');
            emojiResult.className = 'emoji-result';
            emojiResult.textContent = emoji.emoji;
            
            // 创建名称元素
            const emojiName = document.createElement('p');
            emojiName.className = 'emoji-name';
            
            // 根据当前语言显示名称
            if (currentLanguage === 'en') {
                // 使用英文名称 - 优先使用准备好的englishName，因为它已经处理过首字母大写
                emojiName.textContent = emoji.englishName || emoji.keywords?.[0] || emoji.name;
            } else {
                emojiName.textContent = emoji.name;
            }
            
            // 如果是网络资源，添加特殊标记
            if (emoji.source === "network") {
                emojiName.classList.add('network-source');
                // 添加星标以便用户区分
                if (!emojiName.textContent.endsWith(' ⭐')) {
                    emojiName.textContent += ' ⭐';
                }
            }
            
            // 创建复制提示元素
            const copyTooltip = document.createElement('div');
            copyTooltip.className = 'copy-tooltip';
            copyTooltip.textContent = currentLanguage === 'en' ? 'Copied!' : '已复制!';
            
            // 添加点击事件 - 复制单个表情
            emojiItem.addEventListener('click', function() {
                copyEmoji(emoji.emoji, this);
            });
            
            // 添加到DOM
            emojiItem.appendChild(emojiResult);
            emojiItem.appendChild(emojiName);
            emojiItem.appendChild(copyTooltip);
            emojiContainer.appendChild(emojiItem);
            
            // 使用Twemoji解析
            if (typeof twemoji === 'object') {
                twemoji.parse(emojiResult, {
                    folder: 'svg',
                    ext: '.svg',
                    base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/'
                });
            }
        });
        
        console.log(`显示了${randomEmojis.length}个emoji，其中${randomEmojis.filter(e => e.source === "network").length}个来自网络`);
    }
    
    return randomEmojis;
}

// 替换原始生成函数而不是创建并行系统
function generateEnhancedEmojis() {
    // 获取当前选择的表情数量，默认为1（而不是2）
    let count = 1; // 默认值改为1
    
    // 尝试从DOM获取
    const selectedOption = document.querySelector('.count-option input:checked');
    if (selectedOption) {
        count = parseInt(selectedOption.value);
    } 
    // 或从全局变量获取
    else if (typeof window.selectedEmojiCount !== 'undefined') {
        count = window.selectedEmojiCount;
    }
    
    console.log(`将生成${count}个增强版表情（包含网络emoji）`);
    
    // 使用我们的新函数生成emoji
    const selectedEmojis = generateRandomEmojis(count);
    
    // 使用我们的新函数显示emoji
    displayEmojis(selectedEmojis);
    
    // 返回选择的emoji
    return selectedEmojis;
}

// 替换allEmojis全局变量
function replaceGlobalEmojiData() {
    // 确保combinedEmojiData包含所有emoji
    if (combinedEmojiData && combinedEmojiData.length > 0) {
        console.log(`将全局emoji数据替换为合并后的${combinedEmojiData.length}个emoji`);
        
        // 直接替换全局变量
        window.allEmojis = combinedEmojiData;
        
        // 如果有其他引用该数据的变量，也进行替换
        if (window.combinedEmojis) {
            window.combinedEmojis = combinedEmojiData;
        }
        
        // 如果可以找到原始数据数组，也替换它
        if (typeof allEmojis !== 'undefined') {
            allEmojis = combinedEmojiData;
        }
    }
}

// 复制单个表情
function copyEmoji(emoji, item) {
    // 复制表情到剪贴板
    navigator.clipboard.writeText(emoji)
        .then(() => {
            // 显示复制成功动画
            if (item) {
                item.classList.add('copied');
                
                // 3秒后移除复制状态
                setTimeout(() => {
                    item.classList.remove('copied');
                }, 2000);
            }
            
            // 显示通知
            console.log('已复制表情: ' + emoji);
            if (typeof showNotification === 'function') {
                showNotification(
                    currentLanguage === 'en' ? 'Copied!' : '已复制!', 
                    'success'
                );
            }
        })
        .catch(err => {
            console.error('复制失败: ', err);
            if (typeof showNotification === 'function') {
                showNotification(
                    currentLanguage === 'en' ? 'Copy failed' : '复制失败', 
                    'error'
                );
            }
        });
}

// 导出函数供全局使用
window.twemojiExtension = {
    initializeEmojiData,
    generateEnhancedEmojis,
    updateTwemojiHandler
};

// 在页面加载完成后应用所有增强功能
window.addEventListener('DOMContentLoaded', function() {
    // 立即设置默认为1个表情
    window.selectedEmojiCount = 1;
    
    // 处理数量选择器变化
    const countOptions = document.querySelectorAll('.count-option input');
    if (countOptions.length > 0) {
        countOptions.forEach(option => {
            // 设置选中状态
            if (option.value === "1") {
                option.checked = true;
            } else {
                option.checked = false;
            }
            
            // 添加事件监听
            option.addEventListener('change', function() {
                if (this.checked) {
                    window.selectedEmojiCount = parseInt(this.value);
                    console.log(`设置表情数量为: ${window.selectedEmojiCount}`);
                }
            });
        });
    }
    
    // 延迟加载网络emoji
    setTimeout(() => {
        console.log('开始初始化额外emoji数据');
        initializeEmojiData().then(() => {
            console.log('额外emoji数据加载完成');
            analyzeEmojiData();
            
            // 替换全局数据
            if (combinedEmojiData && combinedEmojiData.length > 0) {
                console.log(`将全局emoji数据替换为合并后的${combinedEmojiData.length}个emoji`);
                window.allEmojis = combinedEmojiData;
                window.combinedEmojis = combinedEmojiData;
                if (typeof allEmojis !== 'undefined') {
                    allEmojis = combinedEmojiData;
                }
            }
            
            // 应用函数替换
            enhanceOriginalGenerateFunction();
            
            // 监听主页面的生成按钮
            const generateBtn = document.getElementById('generate-btn');
            if (generateBtn) {
                // 保存原始事件
                const originalClickHandler = generateBtn.onclick;
                
                // 替换点击事件
                generateBtn.onclick = function(event) {
                    console.log("点击了增强版生成按钮");
                    
                    // 获取表情数量
                    let count = selectedEmojiCount || 1;
                    console.log(`准备生成${count}个表情（优先使用网络资源）`);
                    
                    // 调用我们的新函数
                    generateMultipleEmojis();
                    
                    // 阻止事件冒泡
                    event.preventDefault();
                    event.stopPropagation();
                };
            }
            
            // 修改index.html中的内联脚本中的函数
            if (window.multiEmoji) {
                console.log("找到multiEmoji对象，修改其生成函数");
                // 保存原始函数以防需要
                if (window.multiEmoji.generateMultipleEmojis) {
                    window.multiEmoji.originalGenerateMultipleEmojis = window.multiEmoji.generateMultipleEmojis;
                }
                
                // 替换为我们的函数
                window.multiEmoji.generateMultipleEmojis = generateMultipleEmojis;
                
                // 同时更新全局函数(如果存在)
                if (typeof window.generateMultipleEmojis === 'function') {
                    window.originalGenerateMultipleEmojis = window.generateMultipleEmojis;
                    window.generateMultipleEmojis = generateMultipleEmojis;
                }
            } else {
                // 如果multiEmoji对象不存在，直接在全局创建
                window.multiEmoji = {
                    generateMultipleEmojis: generateMultipleEmojis,
                    copyEmoji: copyEmoji
                };
            }
            
            // 初始生成一次表情，确保使用网络emoji
            console.log("初始生成表情，确保使用网络emoji");
            generateMultipleEmojis();
            
            console.log('成功应用所有增强功能');
        });
    }, 1000);
});

// 显示通知的辅助函数
function showNotification(message, type) {
    console.log(`通知: ${message} (类型: ${type})`);
    
    // 检查页面上是否已有通知容器
    let notificationContainer = document.querySelector('.notifications-container');
    
    if (!notificationContainer) {
        // 创建通知容器
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notifications-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '9999';
        document.body.appendChild(notificationContainer);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 设置通知样式
    notification.style.padding = '12px 16px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.fontWeight = '500';
    notification.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // 设置不同类型的颜色
    if (type === 'success') {
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
        notification.style.color = 'white';
    } else {
        notification.style.backgroundColor = '#2196F3';
        notification.style.color = 'white';
    }
    
    // 添加到容器
    notificationContainer.appendChild(notification);
    
    // 触发动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // 定时移除
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        // 完全移除元素
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 