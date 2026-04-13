# Tasks

- [x] Task 1: Refactor Router Index: 将所有的导航配置收敛到 `src/router/index.ts`。
  - [x] SubTask 1.1: 遍历 `src/config/flowConfig.ts` 和 `src/config/routeBottomNav.ts` 中的所有配置，在对应的 `route` 对象中增加 `meta: { nav: { show: boolean, back: string | null, next: string | null, home: string, menu: string } }`。
  - [x] SubTask 1.2: 对需要特殊逻辑的路由（如检查阶段未达标、特定页面的自定义文案等），使用 `meta.nav` 里的函数或特殊属性，或者在路由守卫 `beforeEnter` 中进行拦截。
- [x] Task 2: Remove Custom Managers: 彻底删除冗余代码。
  - [x] SubTask 2.1: 删除 `src/config/flowConfig.ts`。
  - [x] SubTask 2.2: 删除 `src/config/routeBottomNav.ts`。
  - [x] SubTask 2.3: 重写 `src/composables/useFlowManager.ts`。只需暴露一个非常简单的包装函数，它读取 `route.meta.nav` 来决定往哪里跳转；如果当前是 `Exercise`，返回固定值。也可以直接将这个逻辑移到 `App.vue`。
- [x] Task 3: Update App.vue: 替换 App.vue 渲染底部导航的逻辑。
  - [x] SubTask 3.1: 将 `App.vue` 中计算属性如 `btnBack`, `btnNext` 等改为直接读取 `route.meta.nav`。
  - [x] SubTask 3.2: 修复编译和类型错误。
- [x] Task 4: Run Playwright Tests & Verify: 运行现有的端到端测试，确保重构后的单一数据源不会引入退化。