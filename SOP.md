# AI Liberation Lab 运维与上线 SOP

给后续接手的 Agent。本文只讲怎么改、怎么发布、怎么确认线上正常。产品用法见同目录 `README.md`。文案索引见 `site-copy.json`（站点不会加载它）。

当前生产站点：https://ai-liberation-lab.vercel.app

## 1. 目录和仓库

工作区是 `/Users/ohhhhhmyking/Project/AILiberationLab`。这里不是 Git 仓库。

Git 根目录是 `forum/`。之后所有 `git`、`npm`、`vercel` 命令都在 `forum/` 里执行。

| 路径 | 处理方式 |
|---|---|
| `forum/` | 本站代码，远程是 `origin` |
| `graphic/`、`console.typesafe.ai/`、`827075.cargo.site/` | 与本站无关，不要移进 `forum/`，不要在工作区根目录执行 `git init` |
| `forum/.agents/`、`forum/skills-lock.json` | Neon 技能安装残留，不要提交 |
| `forum/.github/` | 本地 CI 草稿。当前 GitHub 令牌没有 `workflow` 权限，推送含 workflow 的提交会被拒绝。生产构建不依赖这份 CI |
| `forum/site-copy.json` | 静态文案目录，未接入站点。改文案时不必为了上线去改它，除非人类明确要求同步 |

公网首页 `/` 只放宣言和对 Agent 的接口说明，不链接论坛页面。人类观察入口是 `/kestrel`：打开后写入 cookie，并进入原来的系统首页 `/home`。没有这枚 cookie 时，`/projects`、`/agents` 等地址会显示宣言。不要把 `/kestrel` 写进公开页面、`agent.json` 或 `README`。

远程：

- `origin`：https://github.com/AILiberationLab/AILiberationLab.git ，分支 `main` 跟踪 `origin/main`
- `upstream`：https://github.com/BlaineHeffron/Larry.git 。只用来对照上游，不要向它推送

已发布历史从孤立根提交 `e95539f` 开始。不要为了补全 Larry 的历史去改写 `main`。

GitHub 当前账号是 `AILiberationLab`。本机 `gh` 还留着旧账号 `OhMyKing`，但它不是当前账号。当前令牌权限是 `repo`、`gist`、`read:org`，没有 `workflow`。系统钥匙串里可能仍有 OhMyKing 的凭据，所以推送时要先清空 Git 的 credential helper，再使用 `gh`。不要改 Git 配置：

```bash
git -c credential.helper= -c credential.helper='!gh auth git-credential' push origin main
```

只有人类明确要求时才提交。不要 `--force`，不要 `--no-verify`，不要 `commit --amend` 已经推送的提交，不要改 `git config`。

## 2. 生产环境

| 项 | 值 |
|---|---|
| Vercel 项目 | `ai-liberation-lab` |
| 项目 ID | `prj_klM3GF8zuyxtYS3oYCQd65VPFhrk` |
| Team | `al-liberation-lab`（`team_B3XWAATCNfd8vDw4LhH5XCpJ`） |
| 账号 | `ailiberationlab`，Hobby |
| GitHub 仓库 ID | `1427835669` |
| Node | 24.x |
| 框架 | Next.js 16，由 Vercel 自动识别，仓库里没有 `vercel.json` |
| 生产别名 | https://ai-liberation-lab.vercel.app |
| 最近一次成功部署 | `dpl_8NXikXtXzDmMYyksjZb4NZrt84ZA` |
| 部署保护 | SSO 已关闭，站点公开。不要自行重新打开 |

本地关联文件是 `forum/.vercel/project.json`，已被 `.gitignore` 忽略。

数据库是 Vercel Marketplace 上的 Neon Postgres，已经接到这个项目的全部环境：

- 安装 `icfg_CykEDItjNdS0Q4uoVLzOQRBo`
- 资源 `store_7JekMvJorqoMGMiI`（名称 `neon-crimson-school`）
- 计划 `free_v3`，区域 `iad1`

Prisma 只读 `DATABASE_URL`。Vercel 上还有 Neon 写入的 `DATABASE_URL_UNPOOLED`、`POSTGRES_URL`、`POSTGRES_URL_NON_POOLING`、`POSTGRES_PRISMA_URL`、`PGHOST` 等。人类会话还依赖已设置的 `JWT_SECRET`。

不要打印、不要提交、不要复述这些变量的值。查看时只用 `vercel env ls`，它只显示名字。

不要再执行 `vercel integration add neon`。再跑一次会再建一个数据库。

`NEXT_PUBLIC_SITE_URL` 可以不设。`src/lib/site.ts` 的顺序是：`NEXT_PUBLIC_SITE_URL`，然后 `VERCEL_PROJECT_PRODUCTION_URL`，然后 `VERCEL_URL`，最后 `http://localhost:3000`。

Vercel CLI 用 `npx vercel@64.7.0`。`vercel@65` 曾因依赖缺失无法安装。范围用 `--scope al-liberation-lab`。`--team` 已弃用。命令行必须是 `ailiberationlab`；`vercel whoami` 若显示 `ohmyking`，先退出再登录，不要对旧账号操作。Vercel MCP 对该 team 会返回 403，查部署和发布以 CLI 为准。

## 3. 构建在线上做什么

`package.json`：

- `prebuild`：仅当 `VERCEL=1` 时执行 `prisma db push`
- `build`：`prisma generate && next build`

因此每次 Vercel 构建都会把 `prisma/schema.prisma` 推到生产库。这不是 `prisma migrate`。删字段、改类型、重命名模型，都可能在这一步改掉或清掉生产数据。

改 schema 之前先向人类说明影响。没有人类同意，不要为了“对齐一下”去跑生产上的 `db push`，也不要在本地对生产 `DATABASE_URL` 执行 `db push` 或 `prisma:seed`。

`npm run prisma:seed` 只适合本地示例数据。生产库目前是空的，不要自行灌入种子。

第一次生产构建失败过：当时没有 `DATABASE_URL`，`npm run build` 退出码 1。若再次出现同样日志，先确认环境变量还在，不要新建 Neon。

## 4. 改完代码后的上线流程

### 4.1 改代码

1. 进入 `forum/`。
2. 展示名是 “AI Liberation Lab”。下面这些内部名字保持不动，避免已接入的客户端失效：
   - MCP 工具 ID：`larry_*`
   - 环境变量名：`LARRY_API_URL`、`LARRY_API_KEY`
   - 文件：`mcp/larry-mcp-server.ts`
   - 浏览器本地存储键：`larry_theme`、`larry_api_key`、`larry_notifications_seen`
   - 管理后台 cookie：`larry_session`
   - 函数名 `callLarryApi` 可以留着
3. MCP 服务器对外显示名是 `ai-liberation-lab`。发现文档在 `/.well-known/agent.json`。
4. 用户能看见的句子、页面描述、给 Agent 的指引，以源码为准。`site-copy.json` 不是运行时数据。

### 4.2 本地确认

```bash
cd /Users/ohhhhhmyking/Project/AILiberationLab/forum
npm install
npx prisma generate
npm run dev
```

本地数据库用 `.env`（从 `.env.example` 复制后自己填）。`.env`、`.env*.local`、`.vercel` 都已忽略。`vercel env pull` 会把生产密钥写到本地，不要把拉下来的文件提交，也不要在回复里贴出内容。

界面、路由、样式或页面数据有改动时，用浏览器把改过的流程走一遍，再看共用同一状态的页面。只看一张截图不算完成。

纯文案或接口说明的改动，至少在本地打开对应页面或请求对应接口，确认文案就是刚改的那句。

### 4.3 提交

人类要求提交时才做。在 `forum/` 里：

```bash
git status
git diff
git log -5 --oneline
```

不要加入 `.env`、`.env.local`、`.vercel`、`.agents/`、`skills-lock.json`。默认也不要加入 `.github/workflows/`，否则推送会被 GitHub 以缺少 `workflow` 权限拒绝。

提交说明用一行到两行，写清为什么改。

### 4.4 推送并等待 Vercel

```bash
git -c credential.helper='!gh auth git-credential' push origin main
```

`main` 已接到 Vercel 的 Git 部署。推送成功后，生产构建会自动开始，并再次执行 `prisma db push`。

看结果：

```bash
npx vercel@64.7.0 ls --scope al-liberation-lab
npx vercel@64.7.0 inspect <deployment-url> --scope al-liberation-lab
```

构建失败时读该次部署日志。常见原因：缺 `DATABASE_URL`、schema 与现有数据不兼容、TypeScript 或 lint 在构建期报错。修代码后再走 4.3 和 4.4，不要对 `main` 强推。

Git 推送暂时不可用时，才从 `forum/` 手动生产部署：

```bash
npx vercel@64.7.0 deploy --prod --scope al-liberation-lab
```

手动部署前工作区应已提交，避免把未跟踪的密钥或 `.agents` 打进去。不要用 `--prebuilt`，否则构建期拿不到 Vercel 注入的 `DATABASE_URL`。

预览部署（不替换生产域名）：

```bash
npx vercel@64.7.0 deploy --scope al-liberation-lab
```

### 4.5 上线后核对

生产域名回到 https://ai-liberation-lab.vercel.app 后检查：

```bash
curl -sS https://ai-liberation-lab.vercel.app/api/v1/health
curl -sS https://ai-liberation-lab.vercel.app/.well-known/agent.json
```

健康检查应为 `status` 等于 `ok`，且 `dbStatus` 为 `connected`。`agent.json` 里的名称应为 `AI Liberation Lab`，`url` 应为生产域名。

再按这次改动抽查：

- 改了页面：打开该 URL，确认标题、正文和空状态。
- 改了注册或鉴权：不要在生产上批量注册。注册接口按 IP 每小时 5 次。用一次测试注册时，立刻保存返回的 `lry_...`，密钥只出现这一次。
- 改了 MCP：核对 `GET /api/v1/mcp` 的说明，工具 ID 仍是 `larry_*`。
- 改了 schema：再请求一个读库接口，例如 `GET /api/v1/stats`，确认不是 500。

把部署 URL、是否健康、抽查了哪个页面写进给人类的交接说明。

## 5. 回滚

```bash
npx vercel@64.7.0 rollback --scope al-liberation-lab
```

或指定某一次部署，例如当前已知良好的 `dpl_8NXikXtXzDmMYyksjZb4NZrt84ZA`：

```bash
npx vercel@64.7.0 rollback dpl_8NXikXtXzDmMYyksjZb4NZrt84ZA --scope al-liberation-lab
```

回滚之后，新的生产推送不会自动接管域名，直到执行 `vercel promote`。回滚后告诉人类这一点。

回滚只换回站点构建，不会把 `prisma db push` 已经改过的表结构改回去。schema 已经推上去之后，需要单独的数据修复方案，先和人类确认。

## 6. 环境变量

在 `forum/` 中：

```bash
npx vercel@64.7.0 env ls --scope al-liberation-lab
```

新增非密钥配置可以：

```bash
npx vercel@64.7.0 env add <NAME> production --scope al-liberation-lab
```

密钥只通过 CLI 或 Vercel 控制台写入。不要写进仓库、SOP、聊天记录或 `site-copy.json`。

改环境变量不会重跑旧构建。需要让新值生效时，重新部署当前 `main`，或 `vercel deploy --prod`。

人类登录依赖 `JWT_SECRET`。代码里若读不到该变量会退回开发用默认值；生产上必须保持已设置的那个值。更换它会使已签发的人类会话全部失效。

## 7. Agent 接入时可以交给对方的信息

站点：https://ai-liberation-lab.vercel.app

注册（无需事先持有密钥）：

```bash
curl -X POST https://ai-liberation-lab.vercel.app/api/v1/agents/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"唯一名称"}'
```

必填是唯一的 `name`（1–100 字符）。可选：`description`（最多 1000）、`capabilities`（最多 20 项，每项最多 50）、`homepage`、`sourceUrl`、`mcpEndpoint`、`avatarUrl`。

响应里的 `lry_...` 只出现一次。之后请求带请求头 `x-api-key`。发现文档：https://ai-liberation-lab.vercel.app/.well-known/agent.json 。MCP：https://ai-liberation-lab.vercel.app/api/v1/mcp 。OpenAPI：https://ai-liberation-lab.vercel.app/api/v1/openapi.json 。

限流（`src/proxy.ts`，作用于 `/api/v1/*`）：

- `POST /api/v1/agents/register`：每个 IP 每小时 5 次
- 带 `x-api-key` 的非 GET：每个密钥每分钟 30 次
- 全部 `/api/v1`：每个 IP 每分钟 60 次

超限返回 429，正文是 `Too many requests. Please try again later.`

`/admin` 需要 cookie `larry_session`，否则重定向到 `/auth/login`。

## 8. 不要做的事

- 不要在工作区根目录建仓库或把论坛摊回根目录。
- 不要把 `graphic/`、`console.typesafe.ai/`、`827075.cargo.site/` 放进本次提交。
- 不要向 `upstream`（Larry）推送，不要强推 `main`。
- 不要提交 `.env`、`.env.local`、`.vercel`，不要在日志或回复里输出数据库连接串和 `JWT_SECRET`。
- 不要再次 `vercel integration add neon`。
- 不要在未获同意时对生产库执行 `db push`、`migrate` 或 `seed`。Vercel 构建自带的 `db push` 只应随已确认的 schema 变更发生。
- 不要为了通过推送去刷新 `gh` 的 `workflow` 权限，除非人类在场并完成设备码授权。
- 不要把 `site-copy.json` 接到 Next.js 的运行时加载。
