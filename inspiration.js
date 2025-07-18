// 艺术风格AI查询系统

// 添加消息到聊天界面
function addMessage(content, isUser = false) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.innerHTML = content; // 支持HTML格式
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 显示加载状态
function showLoading() {
    const chatMessages = document.getElementById('chat-messages');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading-indicator';
    loadingDiv.innerHTML = `
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <span>正在分析艺术风格...</span>
    `;
    loadingDiv.id = 'loading-indicator';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// 移除加载状态
function removeLoading() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) loadingDiv.remove();
}

// 格式化AI响应为艺术风格信息卡片
function formatArtStyleResponse(response) {
    return `<div class="art-style-info">${response}</div>`;
}

// 查询艺术风格AI
async function queryArtStyleAI(userQuery) {
    if (!AI_CONFIG.API_KEY || AI_CONFIG.API_KEY === 'your_api_key_here') {
        return '错误：API密钥未配置，请在AI_CONFIG中设置有效的API密钥。';
    }

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
        };
        console.log('API请求URL:', `${AI_CONFIG.MODEL_URL}/v1/chat/completions`);
        console.log('请求头:', JSON.stringify(headers, null, 2));
        console.log('请求体:', JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: AI_CONFIG.SYSTEM_PROMPT }, { role: 'user', content: userQuery }], max_tokens: 1500, temperature: 0.7 }, null, 2));
        const response = await fetch(`${AI_CONFIG.MODEL_URL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AI_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: AI_CONFIG.SYSTEM_PROMPT },
                    { role: 'user', content: userQuery }
                ],
                max_tokens: 1500,
                temperature: 0.7,
                top_p: 1,
                n: 1,
                stop: null
            })
        });

        // 检查响应状态
        if (!response.ok) {
            const errorDetails = await response.text();
            console.error('API错误详情:', errorDetails);
            throw new Error(`API请求失败 (${response.status}): ${errorDetails}`);
        }

        // 检查内容类型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const errorText = await response.text();
            throw new Error(`API返回无效格式: 预期JSON，实际收到${contentType || '未知类型'}`);
        }

        const data = await response.json();
        console.log('API响应数据:', JSON.stringify(data, null, 2));
        const aiResponse = data.choices?.[0]?.message?.content?.trim() || '未获取到有效回答';
        return formatArtStyleResponse(aiResponse);
    } catch (error) {
        console.error('AI查询错误:', error);
        return `查询失败: ${error.message}`;
    }
}

// 处理用户输入
function handleUserInput() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (!message) return;

    // 添加用户消息
    addMessage(message, true);
    userInput.value = '';

    // 显示加载状态
    showLoading();

    // 调用AI并显示结果
    queryArtStyleAI(message)
        .then(response => {
            removeLoading();
            addMessage(response);
        })
        .catch(error => {
            removeLoading();
            addMessage(`发生错误: ${error.message}`);
        });
}

// 初始化事件监听
function initChat() {
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');

    // 发送按钮点击事件
    sendButton.addEventListener('click', handleUserInput);

    // 回车键发送消息
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });

    // 初始欢迎消息
    addMessage('您好！我是艺术风格查询助手。请输入您想了解的艺术风格名称，我将为您提供详细信息（特征、历史背景、代表作者、作品及当代应用）。');
}

// 页面加载完成后初始化
window.onload = initChat;

// GPT API配置 - 用户需填写以下信息
const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions'; // API地址
const API_KEY = 'sk-PbhNKc6SUwS5iURcwDMsAKhX7CAyWLhmfbulumL3rx63QMao'; // 用户需替换为自己的API密钥

// 显示手账本选择弹窗
function showNotebookSelectionDialog(content) {
    // 从localStorage获取手账本列表
    const notebooks = JSON.parse(localStorage.getItem('notebooks') || '{}');
    const notebookList = Object.entries(notebooks);

    // 创建弹窗HTML
    const dialogHTML = `
        <div class="notebook-dialog-overlay">
            <div class="notebook-dialog">
                <h3>选择手账本</h3>
                <div class="notebook-list">
                    ${notebookList.length > 0 ? notebookList.map(([id, notebook]) => `
                        <div class="notebook-item" data-id="${id}">
                            ${notebook.title}
                        </div>
                    `).join('') : '<p>暂无手账本，请先创建</p>'}
                </div>
                <div class="dialog-buttons">
                    <button class="cancel-btn">取消</button>
                    ${notebookList.length > 0 ? '<button class="confirm-btn">确认</button>' : ''}
                </div>
            </div>
        </div>
    `;

    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', dialogHTML);

    // 事件监听
    const overlay = document.querySelector('.notebook-dialog-overlay');
    const cancelBtn = document.querySelector('.cancel-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    let selectedNotebookId = null;

    // 选择手账本
    document.querySelectorAll('.notebook-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.notebook-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            selectedNotebookId = item.dataset.id;
        });
    });

    // 确认按钮
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (selectedNotebookId) {
                saveToNotebook(selectedNotebookId, content);
                overlay.remove();
            } else {
                alert('请选择一个手账本');
            }
        });
    }

    // 取消按钮
    cancelBtn.addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => e.target === overlay && overlay.remove());
}

// 保存内容到手账本
function saveToNotebook(notebookId, content) {
    const notebooks = JSON.parse(localStorage.getItem('notebooks') || '{}');
    if (notebooks[notebookId]) {
        // 追加内容到手账本
        notebooks[notebookId].text += `\n\n${content}`;
        localStorage.setItem('notebooks', JSON.stringify(notebooks));
        alert('成功保存到手账本！');
    }
}

// DOM元素加载完成后执行
window.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // 添加消息到聊天窗口
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.innerHTML = `${content}<button class="add-to-notebook">添加到手账本</button>`;
        messageDiv.querySelector('.add-to-notebook').addEventListener('click', () => showNotebookSelectionDialog(content));
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // 滚动到底部
    }

    // 发送消息到GPT API
    async function sendMessageToGPT(message) {
        addMessage(message, true);
        userInput.value = '';
        sendBtn.disabled = true;
        sendBtn.textContent = '发送中...';

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'user',
                        content: `请介绍以下艺术风格的背景、代表作者和代表作品: ${message}`
                    }]
                })
            });

            if (!response.ok) throw new Error('API请求失败');

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;
            addMessage(aiResponse, false);

        } catch (error) {
            addMessage('抱歉，无法获取AI响应: ' + error.message, false);
        } finally {
            sendBtn.disabled = false;
            sendBtn.textContent = '发送';
        }
    }

    // 事件监听
    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) sendMessageToGPT(message);
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && userInput.value.trim()) {
            sendMessageToGPT(userInput.value.trim());
        }
    });

    // 页面加载时添加欢迎消息
    addMessage('你好！我可以帮你介绍各种艺术风格的背景、代表作者和代表作品。请输入你想了解的艺术风格名称。', false);
});