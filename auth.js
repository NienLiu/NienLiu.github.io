// 显示手账本选择弹窗
function showNotebookSelectionDialog(content) {
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.username) return;
    
    // 从localStorage获取用户手账本列表
    const userNotebooks = JSON.parse(localStorage.getItem('userNotebooks') || '{}');
    const notebooks = userNotebooks[currentUser.username] || {};
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
    // 获取当前用户
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.username) return;
    
    // 从localStorage获取用户手账本列表
    const userNotebooks = JSON.parse(localStorage.getItem('userNotebooks') || '{}');
    
    // 检查手账本是否存在
    if (!userNotebooks[currentUser.username] || !userNotebooks[currentUser.username][notebookId]) {
        alert('手账本不存在');
        return;
    }
    
    // 追加内容到手账本
    userNotebooks[currentUser.username][notebookId].text += `

${content}`;
    localStorage.setItem('userNotebooks', JSON.stringify(userNotebooks));
    alert('成功保存到手账本！');
}

// 检查用户登录状态并更新导航链接
document.addEventListener('DOMContentLoaded', function() {
  const user = localStorage.getItem('currentUser');
  const loginLink = document.getElementById('login-link');
  
  if (loginLink) {
    if (user) {
      loginLink.textContent = '个人主页';
      loginLink.href = 'profile.html';
    } else {
      loginLink.textContent = '登录/注册';
      loginLink.href = 'login.html';
    }
  }
});