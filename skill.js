document.addEventListener('DOMContentLoaded', () => {
  // 配置API信息 - 用户需填写
  const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions'; // 预留API URL
  const API_KEY = 'sk-PbhNKc6SUwS5iURcwDMsAKhX7CAyWLhmfbulumL3rx63QMao'; // 预留API密钥位置

  // 获取DOM元素
  const queryInput = document.getElementById('ps-query');
  const submitBtn = document.getElementById('submit-query');
  const responseArea = document.getElementById('ai-response');

  // 预置提示词模板
  const systemPrompt = `①角色：你现在是一个PS技巧小专家，②任务详情：请根据用户给出的效果实现要求，给出在PS中对应的操作工具、操作手段和最后的操作结果，给出一段完整的话。`;

  // 处理API请求
  const getPS技巧 = async () => {
    const userQuery = queryInput.value.trim();
    if (!userQuery) {
      alert('请输入您想要实现的PS效果');
      return;
    }

    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.textContent = '获取中...';
    responseArea.innerHTML = '<div class="loading">正在思考最佳PS技巧方案...</div>';

    try {
      // 构建请求数据
      const requestData = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ]
      };

      // 发送API请求
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error(`API请求失败: ${response.status}`);

      const result = await response.json();
      const skillSuggestion = result.choices[0]?.message?.content || '未获取到有效建议';

      // 显示格式化结果
      responseArea.innerHTML = `
                <div class="response-header">PS技巧建议：</div>
                <div class="response-content">${skillSuggestion}<button class="add-to-notebook">添加到手账本</button></div>
            `;
      responseArea.querySelector('.add-to-notebook').addEventListener('click', () => showNotebookSelectionDialog(skillSuggestion));

    } catch (error) {
      responseArea.innerHTML = `
                <div class="error-message">
                    <strong>错误提示：</strong>${error.message}
                    <br>请检查API配置是否正确或稍后重试
                </div>
            `;
    } finally {
      // 恢复按钮状态
      submitBtn.disabled = false;
      submitBtn.textContent = '获取技巧';
    }
  };

  // 添加事件监听
  submitBtn.addEventListener('click', getPS技巧);
  queryInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') getPS技巧();
  });
});