# 全局导航映射与页面分析

本文档汇总了 `src/views` 目录下所有页面的核心功能及其当前在系统中的导航路径。该分析基于当前的 Vue Router (`src/router/index.ts`) 和底部导航栏 (`src/App.vue` 中的 `<v-bottom-navigation>`) 的配置。

当前系统中，大部分导航功能依赖于 Vue Router 中的 `meta.nav` 属性，通过全局的底部导航栏呈现。根据重构计划，底部导航栏将被移除，替换为统一的顶部返回栏和悬浮返回按钮。

## 核心页面分析

### 1. 基础入口与主菜单
| 页面组件 | 路由名称 | 核心功能 | 当前导航配置 (meta.nav) | 预期导航调整 |
| :--- | :--- | :--- | :--- | :--- |
| `IntroLevel.vue` | `Intro` | 首次使用的系统介绍。 | 无 (默认隐藏) | 无需导航栏，内部包含进入主页的按钮。 |
| `HomeMenuLevel.vue` | `Home` | 主菜单，包含各大模块的入口（视觉检查、训练、理论等）。 | 无 (默认隐藏) | 无需导航栏，点击内部卡片直接跳转。 |
| `UserProfileLevel.vue` | `UserProfile` | 用户个人信息档案和数据展示。 | `Back: Home`, `Home` | 顶部导航栏，带“返回主页”按钮。 |
| `TheoryLevel.vue` | `Theory` | 视觉理论与科普文章列表。 | `Back: Home` | 顶部导航栏，带“返回主页”按钮。 |
| `PaperDetailLevel.vue`| `PaperDetail` | 单篇科普文章详情页。 | `Back: Theory`, `Home` | 顶部导航栏，带“返回列表”按钮。 |
| `TrainingMenuLevel.vue`| `TrainingMenu`| 训练菜单，选择不同阶段的康复训练。 | `Back: Home` | 顶部导航栏，带“返回主页”按钮。 |

### 2. 检查流程 (Exam / Vision / Amblyopia)
此部分包含了临床级视功能检查、弱视检查和普通视力检查。流程是线性的，通常包含介绍、信息收集、测试和结果。

| 页面组件 | 路由名称 | 核心功能 | 当前导航配置 (meta.nav) | 预期导航调整 |
| :--- | :--- | :--- | :--- | :--- |
| `SectionIntroLevel.vue` | `SectionIntro...` | 检查模块的介绍页面。 | `Back: 上一页`, `Next: 下一步`, `Home` | 顶部导航栏带“返回”，页面底部提供主要的“开始”/“下一步”按钮。 |
| `UserInfoFormLevel.vue` | `UserInfoForm` | 收集用户年龄等基础信息。 | `Back: Intro`, `Next: 下一步`, `Home` | 顶部导航栏带“返回”，表单内提供“确认/下一步”按钮。 |
| `LensSelectionLevel.vue`| `LensSelection` | 3D眼镜颜色选择。 | `Back: 上一页`, `Next: 确认`, `Home` | 顶部导航栏带“返回”，页面内提供选择和下一步按钮。 |
| `LensConfirmationLevel.vue`| `LensConfirmation`| 3D眼镜效果确认。 | `Back: 选择`, `Next: 建议`, `Home` | 顶部导航栏带“返回”，页面内提供下一步按钮。 |
| `DistanceAdviceLevel.vue`| `DistanceAdvice` | 屏幕距离提示与校准。 | `Back: 确认`, `Next: 测试`, `Home` | 顶部导航栏带“返回”，页面内提供下一步按钮。 |
| `ObjectiveTestLevel.vue`| `SuppressionTest` | 抑制程度测试（找 E 字方向）。 | `Back: 距离`, `Next: 动态计算`, `Home` | 测试中隐藏底部，结束后提供下一步。预期：测试中提供悬浮退出，结果页提供下一步。 |
| `ContrastTestLevel.vue` | `ContrastTest` | 弱视对比度测试。 | `Back: Suppression`, `Next: 动态`, `Home`| 测试中悬浮退出，结果页提供下一步按钮。 |
| `AlignmentExercise.vue` | `AlignmentExercise`| 十字准星对齐测试。 | `Back: Intro`, `Next: 视差`, `Home` | 游戏内悬浮退出/完成按钮。 |
| `StereopsisTestLevel.vue`| `StereopsisTest` | 静态视差测试。 | `Back: 对齐`, `Next: 建议`, `Home` | 测试中悬浮退出，完成提供下一步。 |
| `...AdviceLevel.vue` | `...Advice` | 给出针对某项测试的结论和建议。 | `Back: 测试`, `Next: Home`, `Home` | 顶部导航栏带“返回”，页面内提供“完成/返回主页”大按钮。 |

**普通视力检查子流程：**
包含 `VisionDistanceAdviceLevel.vue`, `VisionTestLevel.vue`, `AstigmatismTestLevel.vue`, `ColorVisionTestLevel.vue`, `AmslerGridTestLevel.vue`, `ContrastSensitivityTestLevel.vue`。
* **当前导航：** 均依赖 `meta.nav` 提供的 `Back` (上一个测试), `Next` (下一个测试), `Home`。
* **预期导航调整：** 将“下一步”按钮实现在各个测试的结果页面内，或提供统一的流程管理器。“返回”操作由统一的顶部导航栏处理。测试进行中可使用悬浮返回按钮防误触。

### 3. 康复训练游戏 (Exercises)
所有康复训练游戏当前都配置了 `Back: true` 和 `Home: Home`。

| 页面组件 | 路由名称 | 核心功能 | 当前导航配置 (meta.nav) | 预期导航调整 |
| :--- | :--- | :--- | :--- | :--- |
| `ShuffleExercise.vue` | `ShuffleExercise` | 追踪移动方块 (洗牌)。 | `Back: true`, `Home` | 沉浸式全屏，使用统一的悬浮“返回”按钮 (`position: fixed`) 退出游戏。 |
| `BoxesExercise.vue` | `BoxesExercise` | 寻找阵列目标。 | `Back: true`, `Home` | 同上。 |
| `SaccadicTracking...` | `SaccadicTracking...`| 扫视追踪。 | `Back: true`, `Home` | 同上。 |
| `SpiralExercise.vue` | `SpiralExercise` | 旋转螺旋。 | `Back: true`, `Home` | 同上。 |
| `ParticlesExercise.vue` | `ParticlesExercise` | 星空粒子。 | `Back: true`, `Home` | 同上。 |
| `VergenceCards...` | `VergenceCards...` | 聚散卡。 | `Back: true`, `Home` | 同上。 |
| `BrockStringExercise.vue`| `BrockStringExercise`| 聚散球。 | `Back: true`, `Home` | 同上。 |
| `TetrisExercise.vue` | `TetrisExercise` | 俄罗斯方块。 | `Back: true`, `Home` | 同上。 |
| `StereopsisExercise.vue`| `StereopsisExercise`| 进阶立体视。 | `Back: true`, `Home` | 同上。 |

## 导航冗余与改造建议

1. **冗余的底部导航栏：** 
   目前的 `<v-bottom-navigation>` 强制所有页面底部留出空间，破坏了游戏和测试的沉浸感。`meta.nav` 中定义了大量复杂的动态 `Next` 和 `Back` 逻辑，这些逻辑应转移到各自页面的视图组件内部，或者一个统一的 flow manager 中。
2. **“下一步”按钮页面化：** 
   在信息流和测试流中，“下一步”应该是用户操作（如填完表单、完成测试）后的自然结果，不应作为一个全局常驻按钮存在。每个页面应有自己的 Primary Action Button。
3. **“返回”与“主页”收敛：**
   使用一个全局的 `<v-app-bar>`（顶部栏）处理非沉浸式页面的后退和标题展示。对于游戏内 (`*Exercise.vue` 和 `*TestLevel.vue` 的测试阶段)，提供一个统一的左上角悬浮后退按钮。
4. **统一返回逻辑：**
   需要提取 `goBack` 到全局，处理历史记录的 `router.back()`，或根据业务逻辑返回到特定的上级页面（如游戏内返回到 `TrainingMenu`）。
