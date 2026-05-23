# NienLiu.github.io

本仓库在保留原有 GitHub Pages 静态页面的基础上，新增了一个前后端分离的 Java 全栈课程项目：

- `backend/`：Spring Boot 3 + Java 17 + MySQL + JPA + Flyway + Spring Security
- `frontend/`：Vue3 + Vite 单页应用

> 原根目录下的静态网页文件（如 `ARTmain.html` 等）未被改动，可继续用于 GitHub Pages。

## 一、环境依赖

- JDK 17
- Maven 3.9+
- Node.js 18+
- MySQL 8.x（仅后端 real 模式需要）

## 二、MySQL 建库命令

```sql
CREATE DATABASE silly_chat DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

默认配置（可在 `backend/src/main/resources/application.yml` 中修改）：

- 数据库：`silly_chat`
- 用户名：`root`
- 密码：`root`

## 三、后端启动

```bash
cd /home/runner/work/NienLiu.github.io/NienLiu.github.io/backend
mvn spring-boot:run
```

后端默认地址：`http://localhost:8080`

### 配置示例

- 复制 `backend/src/main/resources/application-example.yml` 作为本地配置参考。

### LLM 模式

默认可离线运行：

```yaml
llm:
  mode: mock
```

可选 OpenAI Compatible：

```yaml
llm:
  mode: openai
  base-url: https://api.openai.com/v1
  api-key: sk-xxx
  model: gpt-4o-mini
```

当 `mode=openai` 但 `base-url/api-key` 缺失时，会自动回退到 `mock` 并输出日志提示。

## 四、前端启动

```bash
cd /home/runner/work/NienLiu.github.io/NienLiu.github.io/frontend
npm i
npm run dev
```

前端默认地址：`http://localhost:5173`

### 无 MySQL / 无后端演示（默认）

前端默认使用 `VITE_API_MODE=mock`（见 `frontend/.env`），可独立演示：

- 登录页：`/login`
- 角色卡列表/新建/编辑：`/characters`（内置 localStorage Mock CRUD）
- 聊天页：`/chat`（模板回复 Mock）

默认账号（Mock）：`user001 / 123456`

### 切换真实后端

在 `frontend/.env` 或 shell 中设置：

```bash
VITE_API_MODE=real
VITE_API_BASE_URL=http://localhost:8080
```

然后先启动后端，再运行前端。

## 五、默认账号

- 用户名：`user001`
- 密码：`123456`

Flyway 在启动时自动执行：

- `V1__create_tables.sql`：建表（users / character_cards / chat_sessions / chat_messages）
- `V2__seed_users.sql`：插入 `user001 ~ user050`（50 条）+ 示例人设卡

## 六、演示流程（课程验收）

### A. 仅演示前端（无 MySQL）

1. 启动前端 `npm i && npm run dev`
2. 打开 `http://localhost:5173/login`
3. 使用 `user001 / 123456` 登录
4. 进入人设卡页面，创建/编辑/删除角色卡
5. 进入聊天页，创建会话并发送消息，查看模板回复

### B. 联调后端（有 MySQL）

1. 启动 MySQL，并建库 `silly_chat`
2. 启动后端 `mvn spring-boot:run`
3. 设置前端 `VITE_API_MODE=real` 后启动 `npm i && npm run dev`
4. 打开 `http://localhost:5173/login`
5. 使用 `user001 / 123456` 登录
6. 进入人设卡页面，创建或编辑角色卡
7. 点击“去聊天”，选择角色并创建会话
8. 输入消息并发送，获得助手回复（mock 模式无需外部服务）

## 七、可选：GitHub Pages 构建说明（不覆盖根目录静态页面）

仓库根目录已有历史静态页面，请勿覆盖。前端构建产物默认输出到：

```bash
cd frontend
npm run build
```

产物目录为 `frontend/dist/`。如需用于 Pages，可单独发布 `frontend/dist`（或改为 `frontend/docs`）到独立分支/目录，不要替换仓库根目录已有页面文件。
## 八、常见问题

1. **后端启动报数据库连接失败**
   - 检查 MySQL 是否启动；确认 `application.yml` 用户名/密码/端口。

2. **前端请求 401 / 未登录**
   - mock 模式下请先在 `/login` 登录；real 模式下确认后端会话可用、并允许跨域凭证。

3. **跨域问题**
   - 后端已在 `SecurityConfig` 放行 `http://localhost:5173` 的 CORS。

4. **想切换前端 API 模式**
   - `VITE_API_MODE=mock|real`，默认 `mock`。

5. **想切换 OpenAI Compatible 模式**
   - 配置 `llm.mode=openai` 且补全 `llm.base-url` 与 `llm.api-key`。
