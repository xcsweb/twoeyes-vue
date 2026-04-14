# Tasks

- [x] Task 1: 文档整理与架构梳理: 分析所有页面的功能与跳转。
  - [x] SubTask 1.1: 搜索 `src/views` 目录下所有的页面，分析页面上原本的“上一步”、“下一步”、“返回主页”等功能按钮。
  - [x] SubTask 1.2: 整理出 `docs/navigation-map.md`，记录所有页面的当前跳转逻辑，以及它们对应的菜单是否冗余。
- [x] Task 2: 彻底移除底部导航栏与冗余逻辑: 剥离旧系统。
  - [x] SubTask 2.1: 在 `src/App.vue` 中删除 `<v-bottom-navigation>` 组件及其对应的相关变量。
  - [x] SubTask 2.2: 在 `src/router/index.ts` 中删除所有与 `nav`、`bottomNav` 相关的无用 meta 字段。
  - [x] SubTask 2.3: 清理所有的旧测试用例 `rm -f tests/bottom-nav*.spec.ts`。
- [x] Task 3: 引入统一的顶部/悬浮导航方案: 参考成熟应用的移动端方案。
  - [x] SubTask 3.1: 在 `src/App.vue` 中引入一个统一的顶部返回栏（如 `<v-app-bar>` 带有后退图标），如果是在游戏内（`*Exercise.vue`），可以使用悬浮的后退按钮（`position: fixed`）。
  - [x] SubTask 3.2: 创建一个全局的 `goBack` 公共函数处理所有的返回逻辑，可以放在 `src/App.vue` 或对应的 Composable 中。
- [x] Task 4: 编写全流程自动化测试: 确保数据一致性和导航连贯性。
  - [x] SubTask 4.1: 创建 `tests/full-journey.spec.ts`。
  - [x] SubTask 4.2: 编写测试 1：用户从首页进入“隐斜检查”，完成测试后，断言（Assert）结果报告页面展示正常。
  - [x] SubTask 4.3: 编写测试 2：测试用户点击“个人信息档案”，断言刚刚的检查结果已经正确同步到了档案面板。
  - [x] SubTask 4.4: 编写测试 3：进入某个康复训练游戏，断言游戏正常加载，并能通过新设计的统一“返回”按钮安全退出。
- [x] Task 5: 运行并验证: 确保所有新写的测试都能 100% 通过。