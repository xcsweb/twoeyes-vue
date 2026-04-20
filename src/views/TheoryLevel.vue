<template>
  <v-container fluid class="level-container fill-height bg-black">
    <div class="content-wrapper">
      <div class="header text-center mb-8">
        <h1 class="title text-white">系统的临床逻辑与理论基础</h1>
        <p class="text-grey mt-2">双眼分视训练（Dichoptic Training）的临床逻辑与数据关联</p>
      </div>

      <!-- System Rules Timeline -->
      <v-card class="glass-card mb-8">
        <v-card-title class="text-h5 text-primary pb-4">
          <v-icon icon="mdi-source-branch" class="mr-2"></v-icon>临床闭环系统设计逻辑
        </v-card-title>
        <v-card-text>
          <p class="text-body-1 mb-6 text-grey-lighten-1">
            本系统的所有测试与康复训练并非随意安排，而是严格遵循现代双眼视觉（Dichoptic Vision）的临床评估标准。我们构建了从“客观检测”到“定制参数”，再到“数据驱动训练”的完整闭环：
          </p>
          <v-timeline density="compact" align="start" class="ml-2">
            <v-timeline-item
              v-for="(rule, index) in systemRules"
              :key="index"
              dot-color="primary"
              size="small"
            >
              <div class="mb-4">
                <div class="text-subtitle-1 font-weight-bold text-white">{{ rule.step }}</div>
                <div class="text-body-2 text-grey mt-1">{{ rule.desc }}</div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
      </v-card>

      <v-card class="theory-card mb-6" variant="outlined">
        <v-card-text>
          <h2 class="text-h5 text-white mb-4 d-flex align-center">
            <v-icon color="warning" class="mr-2">mdi-map-marker-path</v-icon>
            系统四大模块的流转地图与出现逻辑
          </h2>
          <div class="text-body-1 text-grey-lighten-1">
            <p class="mb-4">
              为了确保各项数据能被精准采集并顺利继承到后续的康复训练中，本系统设计了严格的页面流转逻辑。根据您选择的模块和自身的视觉情况，系统会动态展现不同的测试页面：
            </p>

            <div class="mb-6">
              <strong class="text-white text-h6">1. 普通视力检查 (Vision)</strong><br />
              <span class="text-caption text-grey">无需佩戴 3D 眼镜，在自然光下评估基础视功能。</span>
              <v-timeline density="compact" align="start" class="mt-2 ml-2" truncate-line="both">
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">模块引导页</strong> (介绍流程与注意事项)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">距离提示页</strong> (确认保持 40cm 测试距离)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">E字视力表测试</strong> (核心视力筛查，测量左右眼视力)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">散光客观筛查</strong> (光栅条纹方向辨认)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">色觉测试</strong> (数字辨认测试色弱/色盲)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">阿姆斯勒方格表</strong> (筛查黄斑病变等眼底问题)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">对比敏感度测试</strong> (Pelli-Robson 原理检测)</v-timeline-item>
                <v-timeline-item dot-color="info" size="x-small"><strong class="text-white">诊断结果分析页</strong> (输出综合结果与临床建议)</v-timeline-item>
              </v-timeline>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">2. 斜视检查 (Exam)</strong><br />
              <span class="text-caption text-grey">佩戴红蓝 3D 眼镜，专注测量隐斜视偏离度及立体视。</span>
              <v-timeline density="compact" align="start" class="mt-2 ml-2" truncate-line="both">
                <v-timeline-item dot-color="warning" size="x-small"><strong class="text-white">模块引导与用户信息</strong> (收集视力基础信息)</v-timeline-item>
                <v-timeline-item dot-color="warning" size="x-small">
                  <strong class="text-white">滤光片校准与确认</strong>
                  <div class="text-caption text-info mt-1">
                    <v-icon icon="mdi-lightbulb-on-outline" size="small" class="mr-1"></v-icon>
                    <strong>动态逻辑：</strong>如果您在选择颜色时点击了“我不确定颜色？使用客观视标测试”，系统会额外弹出一个闭眼看形状的“客观硬件校准”小测试，否则此步会跳过。
                  </div>
                </v-timeline-item>
                <v-timeline-item dot-color="warning" size="x-small"><strong class="text-white">十字准星对齐说明与距离确认</strong></v-timeline-item>
                <v-timeline-item dot-color="error" size="small"><strong class="text-white">十字准星对齐测试</strong> (核心马氏杆原理，移动红蓝线拼成十字，测出水平/垂直偏移距离及旋转偏角)</v-timeline-item>
                <v-timeline-item dot-color="warning" size="x-small"><strong class="text-white">立体视敏度筛查</strong> (寻找浮起的目标，测试双眼融合深度感知)</v-timeline-item>
                <v-timeline-item dot-color="warning" size="x-small">
                  <strong class="text-white">诊断结果与康复方案生成</strong>
                  <div class="text-caption text-info mt-1">
                    <v-icon icon="mdi-lightbulb-on-outline" size="small" class="mr-1"></v-icon>
                    <strong>为什么没有抑制测试？</strong>斜视检查主要评估眼位偏斜和立体视，因此不会出现找 E 字的“双眼抑制测试”和“对比度测试”。
                  </div>
                </v-timeline-item>
              </v-timeline>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">3. 弱视/抑制检查 (Amblyopia)</strong><br />
              <span class="text-caption text-grey">佩戴红蓝 3D 眼镜，专注于检测单眼抑制并测定暗光惩罚阈值。</span>
              <v-timeline density="compact" align="start" class="mt-2 ml-2" truncate-line="both">
                <v-timeline-item dot-color="purple" size="x-small"><strong class="text-white">模块引导与用户信息</strong></v-timeline-item>
                <v-timeline-item dot-color="purple" size="x-small"><strong class="text-white">滤光片校准与确认</strong></v-timeline-item>
                <v-timeline-item dot-color="error" size="small">
                  <strong class="text-white">双眼抑制测试</strong> (客观找 E 字方向，精准判断强弱眼)
                  <div class="text-caption text-info mt-1">
                    <v-icon icon="mdi-lightbulb-on-outline" size="small" class="mr-1"></v-icon>
                    <strong>为什么这里有这个测试？</strong>因为弱视的核心问题是大脑对差眼的信号抑制。此测试专用于测量双眼的信号接收不平衡度。
                  </div>
                </v-timeline-item>
                <v-timeline-item dot-color="error" size="small"><strong class="text-white">分视对比度测试</strong> (分别测试双眼在分视下的敏感度)</v-timeline-item>
                <v-timeline-item dot-color="purple" size="x-small"><strong class="text-white">弱视诊断结果页</strong> (输出抑制眼的“惩罚阈值”建议供训练使用)</v-timeline-item>
              </v-timeline>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">4. 康复训练 (Training)</strong><br />
              <span class="text-caption text-grey">读取您的检查数据，动态生成的 4 个阶段进阶视觉康复游戏。</span>
              <v-timeline density="compact" align="start" class="mt-2 ml-2" truncate-line="both">
                <v-timeline-item dot-color="success" size="x-small">
                  <strong class="text-white">康复训练主菜单</strong>
                  <div class="text-caption text-info mt-1">
                    <v-icon icon="mdi-lightbulb-on-outline" size="small" class="mr-1"></v-icon>
                    <strong>解锁逻辑：</strong>只有当您的检查数据未过期（在个人信息中设置）且完成了上一阶段的训练时长目标时，下一阶段的游戏才会解锁。否则点击训练入口会被系统拦截。
                  </div>
                </v-timeline-item>
                <v-timeline-item dot-color="success" size="x-small"><strong class="text-white">阶段1：基础脱抑制</strong> (洗牌训练、方块阵列)</v-timeline-item>
                <v-timeline-item dot-color="success" size="x-small"><strong class="text-white">阶段2：动态融合与扫视</strong> (扫视追踪、旋转螺旋、星空粒子)</v-timeline-item>
                <v-timeline-item dot-color="success" size="x-small"><strong class="text-white">阶段3：集合与分开</strong> (裂隙尺聚散卡、3D聚散球)</v-timeline-item>
                <v-timeline-item dot-color="success" size="x-small"><strong class="text-white">阶段4：立体视建立</strong> (进阶立体视测试、双眼协同俄罗斯方块)</v-timeline-item>
              </v-timeline>
            </div>

          </div>
        </v-card-text>
      </v-card>

      <v-card class="theory-card mb-6" variant="outlined">
        <v-card-text>
          <h2 class="text-h5 text-white mb-4 d-flex align-center">
            <v-icon color="info" class="mr-2">mdi-eye-check-outline</v-icon>
            基础视功能筛查原理
          </h2>
          <div class="text-body-1 text-grey-lighten-1">
            <div class="mb-6">
              <strong class="text-white text-h6">1. 普通视力 (Visual Acuity) 与 MAR 视角</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>视力是衡量人眼分辨二维物体形状和位置能力的指标。临床上通常使用最小分辨角 (Minimum Angle of Resolution, MAR) 来定义。视标（如 E 字）的每一笔画和间隙在视网膜上所张的角度即为视角。正常视力 (1.0 或 20/20) 对应于 1 分角 (1 MAR) 的分辨能力。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Bailey & Lovie (1976), New design principles for visual acuity letter charts.</span></li>
              </ul>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">2. 客观散光 (Astigmatism)：子午线各向异性与光栅辨识</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>散光是由于角膜或晶状体在不同子午线上的屈光力不同所致。本系统利用光栅（正弦波条纹）在不同方向（如水平、垂直、斜向）的对比度敏感度差异，客观评估散光轴位和程度。这种方法利用了视觉系统的子午线各向异性 (Meridional Anisotropy)。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Mitchell et al. (1973), Meridional amblyopia: evidence for modification of the human visual system by early visual experience.</span></li>
              </ul>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">3. 客观色觉 (Color Vision)：CCT 亮度噪声与伪等色图</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>传统的伪等色图（如石原氏表）容易受屏幕亮度和色差影响。本系统引入类似剑桥色觉测试 (Cambridge Colour Test, CCT) 的动态亮度噪声 (Luminance Noise) 掩蔽技术，随机改变背景和目标的亮度，迫使视觉系统仅依赖色度信息进行辨识，从而在普通显示器上实现更精准、客观的色觉缺陷（如红绿色盲）筛查。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Regan et al. (1994), A color television based computer vision test.</span></li>
              </ul>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">4. 黄斑功能筛查：阿姆斯勒方格表 (Amsler Grid)</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>阿姆斯勒方格表主要用于检测黄斑区（视网膜中心）的病变。在标准距离下，10x10cm 的高对比度网格覆盖了中心视野的 10° 到 20° 范围。如果黄斑区存在水肿、出血或新生血管（如黄斑变性 AMD），患者会观察到原本笔直的线条出现扭曲 (Metamorphopsia)、变形或中心暗点。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Amsler (1953), Earliest symptoms of diseases of the macula.</span></li>
              </ul>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">5. 对比敏感度 (Contrast Sensitivity)：Pelli-Robson 原理</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>视力表只测试了高对比度下的空间分辨率。对比敏感度则衡量人眼在不同对比度下分辨目标的能力。系统参考 Pelli-Robson 图表原理，在固定空间频率（字母大小不变）下，采用阶梯法逐渐降低字母的对比度，直到用户无法辨识。该指标对早期白内障、青光眼及视神经病变比普通视力更为敏感。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Pelli et al. (1988), The design of a new letter chart for measuring contrast sensitivity.</span></li>
              </ul>
            </div>

            <div class="mb-6">
              <strong class="text-white text-h6">6. 立体视敏度重建与视差训练</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>立体视敏度是衡量双眼深度知觉能力的重要指标。本系统通过提供具有微小水平视差（Disparity）的立体图，促使大脑视觉中枢进行双眼融合，从而恢复和提升立体视觉功能。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Li et al. (2013), Dichoptic training improves amblyopic stereopsis.</span></li>
              </ul>
            </div>

            <div class="mb-2">
              <strong class="text-white text-h6">7. 单眼旋转斜视 (Monocular Cyclotropia) 与双眼参考网格测试</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-info">👁️ 原理：</span>旋转斜视是指眼球绕前后轴发生旋转偏斜。本系统创新性地采用“双眼参考网格”方法：在屏幕上呈现双眼均可见的静态正交网格作为全局空间参考系，同时分别向左眼或右眼呈现一条可旋转的测试线段。用户通过调整该单眼线段使其在主观视觉上与背景网格平行，系统借此分别独立量化左眼和右眼的客观旋转偏移角度。由于视觉康复训练对旋转斜视改善效果极为有限，系统会在检测到单眼或双眼存在明显旋转偏斜（&gt; 2度）时，及时阻断训练建议并发出严肃的就医预警。</li>
                <li><span class="text-info">📚 依据：</span><span class="text-grey-lighten-2 text-body-2">Ruttum (1989), The Double Maddox Rod Test for Cyclotropia. (基于此原理的数字化改进)</span></li>
              </ul>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="theory-card mb-6" variant="outlined">
        <v-card-text>
          <h2 class="text-h5 text-white mb-4 d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-database-link</v-icon>
            检查数据如何关联康复训练？
          </h2>
          <div class="text-body-1 text-grey-lighten-1">
            <p class="mb-4">
              <strong class="text-white">1. 核心参数的四步流转逻辑（镜片确认 → 颜色域主观校准 → 抑制/惩罚阈值(客观) → 对齐/训练）：</strong><br />
              为了实现精准的双眼分视（Dichoptic Presentation），系统设计了严密的参数流转闭环。首先进行<strong>镜片确认</strong>，设定基础分视颜色；随后进入<strong>颜色域主观校准</strong>，用户通过田字格矩阵微调出肉眼最能消除串扰的极致颜色；紧接着，系统通过寻找 E 字等<strong>客观抑制测试</strong>，精确测量大脑对差眼的抑制程度，并自动计算出降低优势眼亮度的“惩罚阈值”；最终，在<strong>十字对齐</strong>和所有的<strong>康复训练</strong>中，系统会统一输出叠加了“主观校准颜色”与“客观惩罚因子”的最终渲染画面。
            </p>
            <p class="mb-4">
              <strong class="text-white">2. 颜色的绝对匹配（消除串扰）：</strong><br />
              在校准阶段确定的 RGB 颜色值，会被 100% 沿用到后续所有的 3D 训练游戏中。只有保证训练刺激的颜色与您的眼镜滤片完全一致，才能达到“右眼看不见红色，左眼看不见蓝色”的彻底分视效果（Dichoptic Presentation），防止图像串扰（Crosstalk）。
            </p>
            <p class="mb-4">
              <strong class="text-white">3. 抑制测试与暗光惩罚（Penalization）<sup class="text-primary">[1]</sup>：</strong><br />
              在“四点客观测试”中，如果系统测出您的大脑正在抑制某一只眼睛（如弱视眼），系统会在后台记录该状态。在进入康复训练时，系统会自动将您“优势眼”的颜色亮度降低至 30%（或根据测试结果动态调整），通过“惩罚”好眼，强迫大脑去重新建立对“差眼”的神经连接。
            </p>
            <p class="mb-4">
              <strong class="text-white">4. 隐斜偏移量与空间频率动态调节<sup class="text-primary">[3]</sup>：</strong><br />
              在“十字准星对齐”中测出的 Offset 值代表了您的隐斜视程度。Offset 越大，说明融合能力越差。系统会将该数值代入 3D 引擎：Offset 越大，生成的训练方块就越大（降低空间频率），且运动速度越慢，给眼球肌肉更充裕的时间进行融合；随着您能力的提升（Offset 减小），方块会变得更小、更快，逐步挑战更高阶的动态立体视。
            </p>
            <p class="mb-0">
              <strong class="text-white">5. 外斜视与内斜视的差异化聚散训练<sup class="text-primary">[4]</sup>：</strong><br />
              依据临床指南，外斜视（Exotropia）与内斜视（Esotropia）的训练方向截然相反。系统会根据 Offset 值的正负号自动判断：如果您是外斜视，系统会在【阶段 3】生成交叉视差（底向外 BO）的训练，强制您进行“斗鸡眼”集合训练；如果您是内斜视，则生成非交叉视差（底向内 BI），强制您放松眼部肌肉进行散开训练。
            </p>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="theory-card mb-6" variant="outlined">
        <v-card-text>
          <h2 class="text-h5 text-white mb-4 d-flex align-center">
            <v-icon color="secondary" class="mr-2">mdi-gamepad-variant-outline</v-icon>
            康复训练各阶段的实现原理
          </h2>
          <div class="text-body-1 text-grey-lighten-1">
            <div class="mb-6">
              <strong class="text-white text-h6">阶段 1：基础脱抑制（洗牌训练、方块阵列）</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-secondary">🎯 核心目标：</span>打破大脑对单眼的神经抑制，建立双眼同时接收视觉信号的能力。</li>
                <li class="mb-1"><span class="text-secondary">🎮 游戏原理：</span>利用“暗光惩罚疗法 (Penalization Therapy)”<sup class="text-primary">[1]</sup>。如果系统在检查中发现用户存在单眼抑制，会自动将优势眼的渲染亮度降低至 30%，强迫大脑调用“差眼”去寻找正确的方块，从而打破长期的抑制状态。同时，系统利用电子游戏的知觉学习机制<sup class="text-primary">[6]</sup>，通过高度注意力的任务重新激活视觉皮层的神经可塑性。</li>
                <li><span class="text-secondary">📚 临床依据：</span><span class="text-grey-lighten-2 text-body-2">Hess et al. (2010)<sup class="text-primary">[1]</sup>；Li et al. (2011) 动作游戏与神经可塑性<sup class="text-primary">[6]</sup>。</span></li>
              </ul>
            </div>
            
            <div class="mb-6">
              <strong class="text-white text-h6">阶段 2：动态融合与扫视（扫视追踪、星空粒子、旋转螺旋）</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-secondary">🎯 核心目标：</span>在动态干扰下维持双眼融合，强化周边视野（Peripheral Vision）与快速扫视（Saccadic）眼动。</li>
                <li class="mb-1"><span class="text-secondary">🎮 游戏原理：</span>
                  <ul class="ml-4 mt-1 mb-1">
                    <li><strong>扫视追踪：</strong>系统在屏幕随机生成红蓝交替闪烁的视标，训练双眼在快速扫视运动中的注意力切换，防止单眼抑制<sup class="text-primary">[5]</sup>。</li>
                    <li><strong>粒子/螺旋：</strong>利用全屏动态画面刺激周边视野。系统会读取用户的隐斜视（Offset）数据，自动调整粒子运动速率与密度（动态空间频率调节），以匹配您的融合极限<sup class="text-primary">[3]</sup>，并通过游戏化互动提升康复依从性<sup class="text-primary">[6]</sup>。</li>
                  </ul>
                </li>
                <li><span class="text-secondary">📚 临床依据：</span><span class="text-grey-lighten-2 text-body-2">Ciuffreda (2002) 扫视眼动在视觉训练中的基础<sup class="text-primary">[5]</sup>。</span></li>
              </ul>
            </div>
            
            <div class="mb-6">
              <strong class="text-white text-h6">阶段 3：集合与分开（裂隙尺聚散卡、聚散球 Brock String）</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-secondary">🎯 核心目标：</span>扩大双眼聚散（Vergence）范围，针对性改善外斜视（需集合）或内斜视（需散开）。</li>
                <li class="mb-1"><span class="text-secondary">🎮 游戏原理：</span>
                  <ul class="ml-4 mt-1 mb-1">
                    <li><strong>裂隙尺聚散卡：</strong>系统根据检查结果判断。外斜视生成交叉视差（底向外 BO）的红蓝圆环，强制用户做“斗鸡眼”；内斜视生成非交叉视差（底向内 BI），强制放松视线<sup class="text-primary">[4]</sup>。</li>
                    <li><strong>聚散球：</strong>系统计算瞳距系数（IOD Factor），在 3D 空间生成分离的红蓝双球。当球在Z轴运动时，用户必须控制眼球肌肉强行在大脑中将它们捏合成一颗“白球”<sup class="text-primary">[3]</sup>。</li>
                  </ul>
                </li>
                <li><span class="text-secondary">📚 临床依据：</span><span class="text-grey-lighten-2 text-body-2">Scheiman & Wick (2014) 视觉训练临床指南 <sup class="text-primary">[3]</sup>；Cooper & Jamal (2012) 集合不足干预综述 <sup class="text-primary">[4]</sup>。</span></li>
              </ul>
            </div>
            
            <div class="mb-2">
              <strong class="text-white text-h6">阶段 4：立体视建立（双眼协同俄罗斯方块）</strong><br />
              <ul class="mt-2 ml-4">
                <li class="mb-1"><span class="text-secondary">🎯 核心目标：</span>重建高级的三维立体视觉与精准的分视手眼协同（Dichoptic Hand-Eye Coordination）能力。</li>
                <li class="mb-1"><span class="text-secondary">🎮 游戏原理：</span>复刻自 McGill 大学的经典临床实验<sup class="text-primary">[2]</sup>。游戏中下落的方块仅对一只眼可见（如红色），底部堆积的方块仅对另一只眼可见（如蓝色）。用户的大脑必须完美拼合这两路独立的视觉信号，才能正确判断方块位置进行游戏。</li>
                <li><span class="text-secondary">📚 临床依据：</span><span class="text-grey-lighten-2 text-body-2">Li, Thompson, Hess et al. (2013), Dichoptic training enables the adult amblyopic brain to learn. <sup class="text-primary">[2]</sup></span></li>
              </ul>
            </div>

            <p class="mt-6 mb-0">
              <strong class="text-white">4. 最新的临床有效性验证 (2023-2024)：</strong><br />
              近年来的国际多中心试验进一步验证了双眼分视疗法（Dichoptic Therapy）的卓越疗效。研究表明，基于数字设备的家庭分视训练能显著提升儿童及成人弱视患者的最佳矫正视力（BCVA）和立体视。<br />
              <span class="text-grey-lighten-2 text-body-2">[1] Ganesh S, et al. (2024). Effectiveness of Dichoptic Therapy for Treating Mild to Moderate Amblyopia. J Pediatr Ophthalmol Strabismus.</span><br />
              <span class="text-grey-lighten-2 text-body-2">[2] Piñero DP, et al. (2023). Visual Performance of Children with Amblyopia after 6 Weeks of Home-Based Dichoptic Visual Training.</span>
            </p>
          </div>
        </v-card-text>
      </v-card>

      <v-card class="theory-card" variant="outlined">
        <v-card-text>
          <h2 class="text-h5 text-white mb-4 d-flex align-center">
            <v-icon color="success" class="mr-2">mdi-school</v-icon>
            核心参考论文与临床指南
          </h2>
          
          <div class="mb-4 px-4 py-3 bg-grey-darken-4 rounded-lg">
            <div class="text-subtitle-1 text-white font-weight-bold mb-2">
              <v-icon icon="mdi-tag-multiple" size="small" class="mr-2" color="info"></v-icon>
              核心检索关键词 (Keywords)
            </div>
            <div class="d-flex flex-wrap gap-2">
              <v-chip size="small" color="info" variant="flat" class="mr-2 mb-2">dichoptic</v-chip>
              <v-chip size="small" color="info" variant="flat" class="mr-2 mb-2">anaglyph</v-chip>
              <v-chip size="small" color="info" variant="flat" class="mr-2 mb-2">binocular rivalry</v-chip>
              <v-chip size="small" color="info" variant="flat" class="mr-2 mb-2">subjective color balancing</v-chip>
              <v-chip size="small" color="info" variant="flat" class="mr-2 mb-2">penalization</v-chip>
            </div>
            <div class="text-caption text-grey mt-1">
              您可以使用上述关键词在 PubMed、Google Scholar 等学术库中检索更多关于双眼分视疗法的前沿研究。
            </div>
          </div>

          <v-list bg-color="transparent" class="reference-list">
            <v-list-item 
              v-for="(paper, index) in papers"
              :key="paper.id"
              class="px-4 py-3 mb-3 clickable-item"
              @click="goToPaperDetail(paper.id)"
            >
              <template v-slot:prepend>
                <div class="mr-4 text-h6 text-info font-weight-bold">[{{ index + 1 }}]</div>
              </template>
              <v-list-item-title class="text-white font-weight-bold text-wrap mb-1">
                {{ paper.authors }} ({{ paper.year }}).
              </v-list-item-title>
              <div class="text-grey text-wrap text-body-2 mb-2">
                "{{ paper.titleEn }}" <br/>
                <span class="text-white">【中文翻译】：{{ paper.titleZh }}</span>
              </div>
              <v-list-item-subtitle class="text-wrap mt-1">
                <span class="text-caption text-primary">本系统依据：点击查看详情与文献原文链接 >></span>
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { papers, systemRules } from '../data/papers'

const router = useRouter()

const goToPaperDetail = (id: string) => {
  router.push({ name: 'PaperDetail', params: { id } })
}
</script>

<style scoped>
.level-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  padding-top: 40px;
  padding-bottom: 80px;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 800px;
  width: 100%;
  animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.title {
  font-size: 2.2rem;
  letter-spacing: 2px;
}

.theory-card {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 10px;
}

.reference-list .v-list-item {
  border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
  padding-bottom: 16px !important;
}

.clickable-item {
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.clickable-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
