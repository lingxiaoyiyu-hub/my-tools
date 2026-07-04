# 工具页统一视觉规范（Tool-Page Visual Standard）

首页已完成 Vercel / Linear 风格改版。本文档把首页「最终视觉规则」固化为一套可复用规范，
并给出子工具页**逐页、按需接入**的做法。**当前处于试点阶段**：只接入了 `/prompts/`
与 `/prompt-builder/` 两页，未全站铺开。

---

## 1. 首页最终视觉规则（设计基准）

| 区域 | 规则 |
|------|------|
| **底色** | 暖白 `--bg:#fdfcfa`；次级面 `--bg-subtle:#f8f6f1` |
| **文本** | 主 `--fg:#0a0a0a`；次 `--muted:#54585c`；再次 `--muted-2:#6b7280` |
| **边框** | 细边 `--border:#f0ede4`；强调 `--border-strong:#e2dcc9` |
| **Header** | 暖白底 + 1px 底边；无阴影、无玻璃拟态、非 sticky；`.header-inner` 居中 max-width 1180、padding 14/24 |
| **Logo** | 28px 深色圆角方块（`#2b2b30→#0a0a0a` 渐变）+ 白色 X glyph + 橙点；**不用**渐变机器人脸 |
| **搜索框** | 浅底 `--bg-subtle` + 细边 8px 圆角；聚焦深边 + 3px 柔光圈；左置 15px 描边放大镜 |
| **小铺按钮** | 实心近黑药丸（`--fg` 底、白字、8px 圆角）；hover 上移 1px + 柔阴影；**不用**绿色发光渐变 |
| **卡片** | 白/暖白底 + 细边 9px 圆角；hover 边框加深 + `translateY(-1px)` + 轻阴影 `0 4px 14px rgba(0,0,0,.06)` |
| **图标容器** | 44px 白底 + 1.5px 彩色描边 + `currentColor` 线性 glyph；**无**实心色块/渐变/重阴影 |
| **工具页标题区** | 主标题深色 700 字重、字距 -.01em；副标题 `--muted` |
| **Footer** | 透明底 + 1px 顶边 + `--muted-2` 文本；无 surface 白底 |
| **Hover 总原则** | 克制：位移 ≤1px、阴影轻、无发光、无放大跳动 |
| **动效缓动** | `--ease:cubic-bezier(.22,1,.36,1)` |

---

## 2. 哪些规则应进入公共层

「外壳 chrome」是跨页一致的部分，应沉淀为公共可复用层：

- ✅ **进入公共层**：设计令牌（颜色/缓动变量）、header、logo、搜索框、小铺按钮、
  页面标题区（`.page-title/.pb-page-title` + `.page-sub/.pb-page-sub`）、footer、
  header 响应式换行。
- ⏳ **暂不进入（phase 2 再议）**：各页**内部组件**配色——提示词卡片、筛选按钮、
  标签、输出面板、弹层等。它们与功能/交互耦合，贸然统一易踩坏行为，留到试点稳定后逐类推进。
- ❌ **不进入**：api-nav 的深色主题、各页数据渲染逻辑。

### 落地方式：`tool-theme.css`（opt-in，不改 shared-white.css）

规范以新增文件 `tool-theme.css` 承载，而非直接改 `shared-white.css`，原因：
1. `shared-white.css` 是全站强制层（大量 `!important`），直接改会**立刻影响所有页面**，
   与「先试点、不全站改」的要求冲突。
2. `tool-theme.css` 靠 `body.tool-page` 命名空间**按页接入**：加了 `class="tool-page"`
   的页面才生效，未接入的页面**零影响**。
3. 全部规则特异性高于页面自有 CSS，且在需要处用 `!important` 压过 shared-white，
   因此**无需改动** shared-white.css 或任何页面的自有 CSS。

> 后续若试点稳定、决定全站统一，可再评估把 `tool-theme.css` 的稳定部分并入
> `shared-white.css`。当前阶段刻意不做。

---

## 3. 存在独立 CSS / 潜在冲突的页面

| 页面 | 自有 CSS | 与规范的冲突点 | 处理 |
|------|----------|----------------|------|
| `/prompts/` | `prompts.css` | 自定义深色 `header{background:#24292f}`、渐变 logo、绿色发光 `.shop-btn` | ✅ 试点：`tool-theme.css` 以更高特异性覆盖，未改 prompts.css |
| `/prompt-builder/` | `prompt-builder.css` | header 未自定义（靠 shared-white），logo/搜索/按钮沿用旧结构 | ✅ 试点：换新 header 结构 + `tool-theme.css` |
| `/api-nav/` | 全内联（深色主题 `--bg:#090d16`） | **整页深色**，设计语言不同 | ⚠️ 特例，**不纳入本次统一**，单独评估 |
| 其余子页 | 引用 shared-white，多为内联/极简 | header 结构不一 | ⏳ 待试点验证后再逐页接入 |
| 根 `styles.css` | — | **无任何页面引用（孤儿文件）** | 🔎 本次不动，后续可清理 |

---

## 4. 试点接入清单（供后续页面复制）

1. `<body>` → `<body class="tool-page">`
2. `<head>` 末尾、**该页自有 CSS 之后**加：`<link rel="stylesheet" href="/tool-theme.css">`
3. header 结构替换为标准壳（logo-mark + `.header-right` 包裹 `.search-wrap` + `.shop-btn`）
4. 保留页面原有 `id`（如 `searchInput`）与脚本引用，**只改视觉不改结构语义**
5. 本地验证功能与数据加载无回归后再推进下一页

---

## 5. 本次未做（边界）

- 不改 `shared-white.css`、`prompts.css`、`prompt-builder.css` 等自有 CSS 文件
- 不改任何 JS / 数据（`tags.json`、`aiart-prompts.json` 等）
- 不改 api-nav 深色主题
- 不全站铺开；仅 `/prompts/`、`/prompt-builder/` 两页试点
- 不 commit、不 push
