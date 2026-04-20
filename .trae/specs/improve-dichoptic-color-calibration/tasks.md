# Tasks

- [ ] Task 1: 定义“颜色域校准”数据模型与统一颜色输出
  - [ ] SubTask 1.1: 在 `settings` store 中新增颜色域校准状态（颜色域 + 强度档位/系数）并持久化
  - [ ] SubTask 1.2: 提供统一 getter/函数输出“左眼最终颜色/右眼最终颜色”（融合镜片颜色、颜色域强度、惩罚因子）

- [ ] Task 2: 新增颜色域校准页面并接入流程
  - [ ] SubTask 2.1: 新增颜色域校准页面（田字格矩阵：红域/青(蓝)域 + 梯度），支持点击选择与确认
  - [ ] SubTask 2.2: 注册路由，并将其插入镜片确认后的检查流程（`exam`、`amblyopia`）
  - [ ] SubTask 2.3: 处理回退/重复进入：镜片配置变更时需重新校准，否则复用历史校准结果

- [ ] Task 3: 优化对齐测试文案与颜色映射
  - [ ] SubTask 3.1: 对齐测试第 2 步提示语改为“仅提示平行”，并动态说明“哪条颜色线对应哪条背景参考线”
  - [ ] SubTask 3.2: 背景参考线颜色与镜片配置一致，且参考线与操作线采用同色系不同亮度/透明度
  - [ ] SubTask 3.3: 对齐测试使用统一颜色输出（包含惩罚因子与颜色域强度）

- [ ] Task 4: 全量串联分视类页面到统一颜色输出
  - [ ] SubTask 4.1: 分视对比度测试、抑制测试、训练相关分视页面统一使用“最终颜色”来源
  - [ ] SubTask 4.2: 确认所有分视页面在不同镜片配置下颜色映射一致（左红右青 / 左青右红）

- [ ] Task 5: 补充理论页的系统串联说明与论文关键词
  - [ ] SubTask 5.1: 在 `TheoryLevel` 中补充“镜片确认 → 颜色域校准 → 抑制/惩罚阈值 → 对齐/训练”的解释
  - [ ] SubTask 5.2: 增加可检索的论文关键词列表（不要求内置引用链接）：dichoptic、anaglyph、binocular rivalry、luminance balancing、contrast balancing

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] can run in parallel with [Task 4]

