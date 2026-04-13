# 路由元数据导航重构 (Refactor Navigation to Router Meta) Spec

## Why
目前系统中的页面跳转逻辑极度混乱且存在大量 Bug，核心原因是项目中存在多套互相冲突的导航管理逻辑：`src/router/index.ts`（原生路由）、`src/config/flowConfig.ts`（自定义检查流）、`src/config/routeBottomNav.ts`（自定义底部菜单）以及 `useFlowManager.ts`（自定义控制中心）。这种“重复造轮子”的写法违背了 Vue 的最佳实践。
业界标准的做法是直接使用 Vue Router 官方提供的 `route.meta`（路由元信息）功能，将每个页面的“上一步”、“下一步”、“是否显示底部菜单”等配置全部收束到路由定义中，实现**单一数据源 (Single Source of Truth)**，从而彻底消灭逻辑冲突和跳转死胡同。

## What Changes
- **BREAKING**: 删除冗余且充满 Bug 的自定义文件 `src/config/flowConfig.ts` 和 `src/config/routeBottomNav.ts`。
- **BREAKING**: 废弃并重写 `useFlowManager.ts`，将其简化为纯粹读取 `route.meta` 并执行 `router.push()` 的极简包装器，甚至可以直接在 `App.vue` 中处理。
- 在 `src/router/index.ts` 中，为所有需要底部导航和流程跳转的路由添加 `meta: { nav: { show: true, back: 'RouteName', next: 'RouteName', home: 'Home' } }`。
- 动态路由（如游戏页面 `*Exercise`）可以在全局守卫（`beforeEach`）或 `App.vue` 中通过简单的通配符逻辑注入默认的 `meta.nav` 配置。

## Impact
- Affected specs: 所有的底部导航渲染、检查流程跳转、训练游戏返回逻辑。
- Affected code: 
  - `src/router/index.ts`
  - `src/App.vue`
  - `src/composables/useFlowManager.ts`
  - `src/config/flowConfig.ts` (删除)
  - `src/config/routeBottomNav.ts` (删除)

## ADDED Requirements
### Requirement: Router Meta Navigation
The system SHALL determine all bottom navigation rendering and "Next/Back" target routes exclusively from the Vue Router's `route.meta.nav` object.

#### Scenario: Success case
- **WHEN** user clicks "上一步" or "下一步" on any page
- **THEN** the system reads `route.meta.nav.back` or `route.meta.nav.next` to determine the target route name, and immediately pushes to it, bypassing any complex custom state machines.

## REMOVED Requirements
### Requirement: Custom Flow Manager & Nav Config
**Reason**: Multiple sources of truth caused state desync, unresolvable routing bugs, and unmaintainable code.
**Migration**: Move all configuration directly into `vue-router` route definitions under the `meta` key, matching the Vue ecosystem's standard best practices.