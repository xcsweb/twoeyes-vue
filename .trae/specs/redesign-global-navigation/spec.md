# 全局导航重构与全流程测试 (Redesign Global Navigation & Full Flow Test) Spec

## Why
目前系统依赖底部的 `v-bottom-navigation` 菜单来进行页面跳转，但这导致了严重的逻辑冲突、状态重置以及用户体验问题（如在训练游戏中突然返回导致黑屏）。业界在移动端 Web 应用和游戏中，通常的做法是：**取消全局底部菜单**，在普通页面使用统一的顶部导航栏（包含“返回”和标题），在沉浸式游戏/测试页面提供一个浮动的“退出/返回”按钮。
同时，旧的单元测试无法真实反映用户完整的体验链路，我们需要删除它们，并编写一套全新的端到端全流程测试，确保从“视力检查”到“报告生成”，再到“个人档案数据核对”及“康复训练”，整条链路的数据和跳转都是正确的。

## What Changes
- **BREAKING**: 从 `src/App.vue` 中彻底移除 `<v-bottom-navigation>` 底部菜单组件。
- **BREAKING**: 删除项目中所有的旧测试用例（如 `tests/bottom-nav*.spec.ts`）。
- **FEATURE**: 新增 `docs/navigation-map.md`，盘点系统所有页面及其核心跳转功能，确保梳理出无冗余的统一跳转方案。
- **FEATURE**: 实现统一的返回控制（例如在页面左上角提供统一的返回按钮，或顶部导航栏 `v-app-bar`）。
- **FEATURE**: 编写全新的 Playwright E2E 测试，模拟用户的完整旅程（完成某项视力检查 -> 查看报告 -> 检查个人信息（Profile）数据更新 -> 进入康复训练页面）。

## Impact
- Affected specs: 所有的页面导航交互、端到端测试流程。
- Affected code: 
  - `src/App.vue`
  - `src/router/index.ts`
  - `tests/*.spec.ts`
  - 所有需要显示返回按钮的视图组件（自动通过统一布局注入）。

## ADDED Requirements
### Requirement: Standardized Top/Floating Navigation
The system SHALL provide a standardized way to navigate back to the previous logical screen without relying on a global bottom navigation bar.

#### Scenario: Success case
- **WHEN** user finishes a training game and wants to exit
- **THEN** they click a unified "Back" button at the top of the screen, safely returning to the training menu without losing application state.

### Requirement: Full User Journey E2E Testing
The system SHALL have comprehensive E2E tests covering the core user flows.

#### Scenario: Success case
- **WHEN** the test suite runs
- **THEN** it simulates a user taking an exam, verifies the results on the advice page, checks the Profile page to ensure data matches, and successfully enters and exits a training game.

## REMOVED Requirements
### Requirement: Global Bottom Navigation
**Reason**: Caused severe UI bugs, state loss during history traversal, and screen space waste during immersive training.
**Migration**: Replaced by a unified top app bar or page-specific back buttons.
### Requirement: Old E2E Tests
**Reason**: Outdated, tightly coupled to the deleted bottom navigation, and failed to test end-to-end data consistency.
**Migration**: Replace with `tests/full-journey.spec.ts`.