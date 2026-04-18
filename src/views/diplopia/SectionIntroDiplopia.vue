<template>
  <SectionIntroLevel
    title="复视专科检查"
    subtitle="本测试将评估您的复视情况，包括单眼复视与双眼复视"
    :notes="notes"
  />
</template>

<script setup lang="ts">
import SectionIntroLevel from '../SectionIntroLevel.vue'

const notes = [
  '请在舒适的环境下进行测试',
  '第一阶段将进行单眼复视检查，请准备遮眼板',
  '第二阶段将进行双眼复视检查，请准备并佩戴好红青（或红蓝）3D眼镜',
  '我们将通过您对图像主观重影的位置，测量并记录您的复视偏移量'
]
</script>
