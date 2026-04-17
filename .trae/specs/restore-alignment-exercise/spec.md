# 恢复对齐测试 (Alignment Exercise) 丢失修改 Spec

## Why
在上一轮的“全局流程与导航重构”任务中，由于操作前检查了 `main` 分支状态并在 `main` 分支进行了部分提交，随后切换回工作分支并直接推送，导致紧邻重构前的最后 3 次界面和文案更新提交未被正确带入当前分支，出现了“代码回退”的现象。我们需要立即恢复这些非常重要的专业性修正。

## What Changes
重新在 `src/views/exercises/AlignmentExercise.vue` 中应用以下丢失的更改：
- **恢复专业测试文案**：将页面说明拆分为“第 1 步 (测水平/垂直偏移距离)”和“第 2 步 (测旋转偏角)”，更正了容易引起误解的“偏角”表述。
- **恢复红蓝参考线**：将原本的白色十字参考网格，改回垂直红色半透明（`rgba(255, 60, 60, 0.45)`）、水平蓝色半透明（`rgba(60, 200, 255, 0.45)`）的参考线。
- **去除多余发光圈**：移除 `.right-box:focus` 状态下的白色光圈，防止在点击测试区时出现干扰。

## Impact
- Affected specs: 无新增功能，仅恢复正确的视觉和文案状态。
- Affected code: `src/views/exercises/AlignmentExercise.vue`

## ADDED Requirements
无新增需求，纯恢复丢失的 UI 状态。

## MODIFIED Requirements
### Requirement: 对齐测试提示与参考线
系统 SHALL 准确提示患者先对齐十字（测偏移距离），再调平行（测旋转偏角），并提供红竖蓝横的参考线以防两眼视觉干扰。
