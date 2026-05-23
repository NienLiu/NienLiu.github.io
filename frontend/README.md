# Frontend (Vue3 + Vite)

## 启动

```bash
npm i
npm run dev
```

默认 `VITE_API_MODE=mock`，可在无后端/无 MySQL 情况下演示登录、人设卡 CRUD、聊天流程。

## API 模式切换

- `VITE_API_MODE=mock`：使用 localStorage Mock API（默认）
- `VITE_API_MODE=real`：请求 `VITE_API_BASE_URL` 指定的后端地址（默认 `http://localhost:8080`）

## 重置 Mock 数据

Mock 数据保存在浏览器 localStorage。若需恢复初始演示数据，可在浏览器开发者工具执行：

```js
localStorage.clear()
```
