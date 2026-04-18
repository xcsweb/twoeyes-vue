# Tasks

- [x] Task 1: 创建复视流程的基础路由与引导页面
  - [x] SubTask 1.1: 在 `src/config/flowConfig.ts` 和 `useFlowManager.ts` 中新增 `diplopia` 流程配置及智能历史栈回退逻辑。
  - [x] SubTask 1.2: 创建 `src/views/diplopia/SectionIntroDiplopia.vue` 作为复视检查入口引导。
  - [x] SubTask 1.3: 更新 `src/views/HomeMenuLevel.vue`，在“视觉健康检查”区加入“复视检查”卡片（图标：mdi-eye-circle-outline）。
  
- [x] Task 2: 实现单眼复视测试 (Monocular Diplopia)
  - [x] SubTask 2.1: 创建 `src/views/diplopia/MonocularDiplopiaTest.vue`。
  - [x] SubTask 2.2: 逻辑：黑底白点，提示用户遮盖单眼。询问“是否看到鬼影/重影？”
  - [x] SubTask 2.3: 交互：如果选择“有重影”，显示一个操控盘（上下左右），出现第二个暗白色的参考点，让用户将它移到“重影”的位置。完成后测试另一只眼。
  
- [x] Task 3: 实现双眼复视测试 (Binocular Diplopia)
  - [x] SubTask 3.1: 创建 `src/views/diplopia/BinocularDiplopiaTest.vue`。
  - [x] SubTask 3.2: 逻辑：黑底，佩戴3D眼镜。左眼红，右眼青。
  - [x] SubTask 3.3: 交互：若存在斜视引起的双眼复视，用户会看到两点分离。提供操控盘让用户移动红点，直到红青两点主观上融合为一个白点。记录偏移量。

- [x] Task 4: 创建复视诊断结果页
  - [x] SubTask 4.1: 创建 `src/views/diplopia/DiplopiaAdvice.vue`。
  - [x] SubTask 4.2: 根据单双眼的偏移数据，生成分析报告（单眼多为屈光/白内障，双眼多为斜视/神经麻痹）。
  - [x] SubTask 4.3: 更新 `src/router/index.ts` 注册所有复视相关组件。

- [x] Task 5: 补充理论说明
  - [x] SubTask 5.1: 在 `TheoryLevel.vue` 的“四大模块流转地图”中增加第5项“复视专科检查”，并解释其原理和出场顺序。

# Task Dependencies
- [Task 2] and [Task 3] depend on [Task 1]
- [Task 4] depends on [Task 2] and [Task 3]
- [Task 5] can run in parallel with [Task 4]