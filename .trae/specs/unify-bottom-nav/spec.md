# 统一底部导航栏 (Unify Bottom Nav) Spec

## Why
目前底部的导航菜单是通过在 `routeBottomNavConfig` 中硬编码每个页面的路由名称来配置的。如果新增了页面（例如 `StereopsisExercise` 进阶立体视训练），但忘记在配置表中添加对应的路由名称，该页面就会完全丢失底部导航菜单，导致用户无法返回或退出。需要引入统一的降级匹配机制（Fallback/Wildcard），并补充自动化测试，以确保所有训练和检查页面都能正确显示导航菜单。

## What Changes
- 引入统一的路由匹配函数 `getRouteBottomNavSpec(routeName)`。
- 对未在 `routeBottomNavConfig` 显式配置的 `*Exercise` 路由，默认应用统一的 `back` 和 `home` 底部菜单。
- 移除之前手动硬编码的冗余 `Exercise` 路由配置，以减小维护成本。
- 增加专门测试所有游戏/训练页面底部导航统一渲染情况的自动化 E2E 脚本。

## Impact
- Affected specs: 底部导航栏渲染逻辑、所有训练子游戏页面（包含缺失导航菜单的页面）。
- Affected code: 
  - `src/config/routeBottomNav.ts`
  - `src/App.vue`
  - `tests/bottom-nav-exercises.spec.ts`

## ADDED Requirements
### Requirement: Fallback Navigation Config
The system SHALL provide a default bottom navigation configuration for dynamically added or unregistered exercise pages.

#### Scenario: Success case
- **WHEN** user navigates to a new exercise route like `StereopsisExercise` that is not explicitly defined in `routeBottomNavConfig`
- **THEN** the system applies a default spec showing "Back" and "Home" buttons, and the bottom nav renders correctly.