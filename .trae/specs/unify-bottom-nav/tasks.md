# Tasks

- [x] Task 1: Refactor Navigation Config: 引入统一配置获取函数。
  - [x] SubTask 1.1: 在 `src/config/routeBottomNav.ts` 中新增 `getRouteBottomNavSpec(routeName: string)` 辅助函数。
  - [x] SubTask 1.2: 移除原有在配置表里硬编码的诸如 `ShuffleExercise`, `TetrisExercise` 等路由（可选，保留特殊的，移除冗余相同的配置），如果名称以 `Exercise` 结尾，函数返回默认的 { back: history -1, home: Home } 菜单项。
- [x] Task 2: Update App.vue: 替换现有的路由匹配方式。
  - [x] SubTask 2.1: 在 `src/App.vue` 中调用 `getRouteBottomNavSpec(route.name)` 来替代直接通过对象索引获取 `routeSpec`。
- [x] Task 3: Write E2E Tests: 编写统一的自动化测试。
  - [x] SubTask 3.1: 新增 `tests/bottom-nav-exercises.spec.ts` 测试文件。
  - [x] SubTask 3.2: 遍历主要的训练路由（如 `StereopsisExercise` 和 `TetrisExercise` 等），断言 `.bottom-nav` 以及相关的返回和主页按钮可见。
- [x] Task 4: Run Tests & Verify: 运行所有的 Playwright 测试，确保原有逻辑无损，新页面能够成功显示底部导航菜单。