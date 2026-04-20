# Tasks

- [x] Task 1: 定义“颜色域校准”数据模型与统一颜色输出
  - [x] SubTask 1.1: 在 `settings` store 中新增颜色域校准状态（颜色域 + 强度档位/系数）并持久化
  - [x] SubTask 1.2: 提供统一 getter/函数输出“左眼最终颜色/右眼最终颜色”（融合镜片颜色、颜色域强度、惩罚因子）

- [x] Task 2: 新增颜色域校准页面并接入流程
  - [x] SubTask 2.1: 新增颜色域校准页面（田字格矩阵：红域/青(蓝)域 + 梯度），支持点击选择与确认
  - [x] SubTask 2.2: 注册路由，并将其插入镜片确认后的检查流程（`exam`、`amblyopia`）
  - [x] SubTask 2.3: 处理回退/重复进入：镜片配置变更时需重新校准，否则复用历史校准结果

- [x] Task 3: 优化对齐测试文案与颜色映射
  - [x] SubTask 3.1: 对齐测试第 2 步提示语改为“仅提示平行”，并动态说明“哪条颜色线对应哪条背景参考线”
  - [x] SubTask 3.2: 背景参考线颜色与镜片配置一致，且参考线与操作线采用同色系不同亮度/透明度
  - [x] SubTask 3.3: 对齐测试使用统一颜色输出（包含惩罚因子与颜色域强度）

- [x] Task 4: 全量串联分视类页面到统一颜色输出
  - [x] SubTask 4.1: 将训练模块和检查模块的分视页面（Boxes, Saccadic, Spiral, Particles, Shuffle, BrockString, VergenceCards, Tetris, ContrastTest, Alignment, Stereopsis等）统一改为使用 `settingsStore` 输出的最终颜色。
  - [x] SubTask 4.2: 在 `UserProfileLevel.vue` 中显示用户选定的颜色域结果。

- [x] Task 5: 补充理论页说明
  - [x] SubTask 5.1: 在 `TheoryLevel` 中补充“镜片确认 → 颜色域主观校准 → 抑制/惩罚阈值(客观) → 对齐/训练”的逻辑串联解释。
  - [x] SubTask 5.2: 增加可检索的论文关键词列表（dichoptic, anaglyph, binocular rivalry, subjective color balancing, penalization）。

- [x] Task 6: 编写单元测试与端到端测试
  - [x] SubTask 6.1: 编写单元测试（如 vitest）测试 `settings.ts` 中颜色输出逻辑：基础颜色 * 校准系数 * 惩罚系数。
  - [x] SubTask 6.2: 编写端到端(E2E)测试（Playwright）完整跑通：选择镜片 -> 田字格校准 -> 抑制/对比度测试产生惩罚 -> 最终对齐测试，并断言对齐测试元素使用了正确的最终 RGB 值。

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2]
- [Task 6] depends on [Task 3] and [Task 4]
- [Task 5] can run in parallel with [Task 4]

