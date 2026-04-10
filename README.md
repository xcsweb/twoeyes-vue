# TwoEyes Vue (双眼视觉康复系统)

🌟 **[在线体验地址 (GitHub Pages)](https://xcsweb.github.io/twoeyes-vue/)** 🌟

TwoEyes Vue 是一个基于 Vue 3 + Vuetify 3 构建的临床级视功能检查与分阶段脱抑制训练平台。本系统旨在通过标准化的视力测试和个性化的双眼视觉康复训练（如红蓝眼镜防抑制、十字准星隐斜视测量等），帮助用户评估和改善双眼视觉功能。

## 核心功能

### 1. 临床级视功能检查
- **普通视力检查**：基于标准 E 字视力表的单眼与双眼视力测定。
- **客观双眼抑制测试**：利用红蓝滤片（3D 眼镜）进行双眼分视强制选择测试，精准测算主导眼和单眼抑制程度。
- **客观暗光惩罚阈值测定**：通过自适应噪声掩蔽阶梯算法，为弱视眼/被抑制眼寻找最佳的亮度惩罚系数。
- **主观隐斜视测量**：通过十字准星的屏幕位移，计算双眼视差和隐斜视偏离度（水平/垂直）。

### 2. 分阶段康复训练
系统根据检查结果动态分配参数，提供多种沉浸式的视觉训练游戏：
- **脱抑制训练**：如动态洗牌（Shuffle Exercise），强化弱眼的视觉感知。
- **融合能力训练**：如螺旋隧道（Spiral Exercise）、动态粒子（Particles Exercise）。
- **集合与散开训练**：如聚散球（Brock String）、双眼扫视（Saccadic Tracking）。
- **立体视建立**：如双眼分视俄罗斯方块（Tetris Exercise），重建深度知觉。

## 交互设计亮点
- 全局沉浸式黑色背景主题。
- 统一的底层路由和全局底部导航栏（Bottom Navigation），彻底消除了繁杂的页面内跳转按钮。
- 高度一致的响应式卡片菜单。
- 完整的 E2E 自动化测试覆盖（使用 Playwright）。

## 技术栈
- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
- [Vuetify 3](https://vuetifyjs.com/) (Material Design UI 组件库)
- [Vite](https://vitejs.dev/) (构建工具)
- [Pinia](https://pinia.vuejs.org/) (状态管理)
- [Vue Router](https://router.vuejs.org/) (路由控制)
- [Three.js](https://threejs.org/) (用于 3D 视觉训练模块)
- [Playwright](https://playwright.dev/) (E2E 自动化测试)

## 本地开发

### 环境要求
- Node.js >= 18

### 安装与运行

```bash
# 1. 克隆仓库
git clone https://github.com/xcsweb/twoeyes-vue.git
cd twoeyes-vue

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

### 构建与测试

```bash
# 执行生产环境构建
npm run build

# 运行 E2E 自动化测试 (需先启动本地服务并安装 playwright 浏览器)
npx playwright install
npm run test:e2e
```

## 自动化部署
本项目已配置 GitHub Actions 工作流。每次将代码推送到 `main` 分支时，都会自动构建并部署到 [GitHub Pages](https://xcsweb.github.io/twoeyes-vue/)。

## 声明与协议 (License & Disclaimer)

### ⚠️ 免责声明 (Medical Disclaimer)
> 本系统的测试结果和训练方案仅供个人康复训练参考，**绝不作为任何临床医疗诊断依据**。如有严重的视力、斜视或立体视受损问题，请及时前往专业眼科医院就医。

### 🚫 许可协议 (License)
> **版权所有 © 2024 TwoEyes-Vue。本项目仅供个人学习、非盈利性学术研究及个人视觉康复使用。**  
> **禁止商用，侵权必究！**  
> 未经作者明确书面授权，任何人不得将本项目源码、UI设计、医疗逻辑及衍生程序用于任何商业目的（包括但不限于：整合进收费软件、用于医院或诊所的收费治疗项目、二次打包出售等）。详细条款请参阅项目根目录下的 [LICENSE](./LICENSE) 文件。

## 致谢 (Acknowledgments)

本项目在医学底层逻辑、双眼分视疗法 (Dichoptic Therapy) 和立体视康复机制的设计上，深受国内外众多眼科学者和前沿研究文献的启发。
目前本项目**尚未取得**以下论文作者的商业授权，因此再次重申本项目仅为非商业的个人开源实践。

在此，向以下文献的作者及研究团队表达最诚挚的敬意与感谢（排名不分先后）：
- **Ganesh S, et al. (2024)** - *Effectiveness of Dichoptic Therapy for Treating Mild to Moderate Amblyopia. J Pediatr Ophthalmol Strabismus.*
- **Piñero DP, et al. (2023)** - *Visual Performance of Children with Amblyopia after 6 Weeks of Home-Based Dichoptic Visual Training.*
- **Li J, et al. (2013)** - *Dichoptic training improves amblyopic stereopsis. Clinical Ophthalmology.*
- **Ruttum M.S. (1989)** - *The Double Maddox Rod Test for Cyclotropia.*
- 以及所有致力于弱视与斜视数字疗法 (Digital Therapeutics) 研究的医学先驱们。