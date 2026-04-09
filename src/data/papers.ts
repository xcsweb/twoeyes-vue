export interface Paper {
  id: string
  authors: string
  year: string
  titleEn: string
  titleZh: string
  journal: string
  abstractEn: string
  abstractZh: string
  systemRelevance: string
  externalLink: string
}

export const papers: Paper[] = [
  {
    id: 'hess2010',
    authors: 'Hess, R. F., Mansouri, B., & Thompson, B.',
    year: '2010',
    titleEn: 'A new binocular approach to the treatment of amblyopia in adults well beyond the critical period of visual development.',
    titleZh: '一种治疗已过视觉发育关键期的成人弱视的全新双眼疗法',
    journal: 'Restorative Neurology and Neuroscience',
    abstractEn: `Amblyopia is a developmental disorder of spatial vision. The traditional treatment, which involves patching the fellow eye, is often ineffective in adults. Here we show that the amblyopic visual system possesses intact binocular mechanisms. By reducing the contrast of the image presented to the fixing eye, we can artificially balance the contrast responses of the two eyes, allowing binocular combination to occur. Training under these artificial conditions of binocular combination resulted in a marked improvement in the amblyopic eye's visual acuity and stereopsis.`,
    abstractZh: `弱视是一种空间视觉的发育障碍。传统的遮盖健眼治疗法对成年人通常无效。在这里，我们展示了弱视视觉系统实际上拥有完整的双眼机制。通过降低呈现给注视眼（健眼）的图像对比度，我们可以人为地平衡双眼的对比度反应，从而使双眼融合得以发生。在这种人工创造的双眼融合条件下进行训练，能够显著提高弱视眼的视力和立体视觉。`,
    systemRelevance: '本系统依据：提出了对比度平衡（Contrast-balanced）的双眼分视疗法。本系统在“双眼抑制客观测试”后，如果发现用户的某一眼存在抑制，就会在康复训练（如洗牌、方块阵列）中自动将优势眼的色彩亮度大幅降低（暗光惩罚 Penalization），以此激活被抑制的视觉皮层。',
    externalLink: 'https://pubmed.ncbi.nlm.nih.gov/21220803/'
  },
  {
    id: 'li2013',
    authors: 'Li, J., Thompson, B., Deng, D., Chan, L. Y., Yu, M., & Hess, R. F.',
    year: '2013',
    titleEn: 'Dichoptic training enables the adult amblyopic brain to learn.',
    titleZh: '双眼分视训练使得成年弱视患者的大脑能够重新学习',
    journal: 'Current Biology',
    abstractEn: `Adult amblyopia is traditionally thought to be untreatable due to a lack of brain plasticity. We show that a novel dichoptic training approach, using a specially modified version of the video game Tetris, can induce plasticity in the adult amblyopic visual cortex. Patients played the game with the falling blocks presented to one eye and the static blocks to the other. This forced the two eyes to cooperate. The results demonstrated significant improvements in visual acuity and 3D depth perception (stereopsis) compared to monocular training.`,
    abstractZh: `由于缺乏大脑可塑性，成人弱视传统上被认为是无法治疗的。我们的研究表明，一种新颖的双眼分视训练方法——使用经过特殊修改的“俄罗斯方块”电子游戏——可以在成年弱视患者的视觉皮层中诱导神经可塑性。患者在游戏中，下落的方块呈现给一只眼睛，而底部固定的方块呈现给另一只眼睛。这种设计强迫双眼必须合作才能进行游戏。结果表明，与传统的单眼遮盖训练相比，患者的视力和3D深度知觉（立体视）有了显著的改善。`,
    systemRelevance: '本系统依据：证明了分视游戏可以有效重建成人的立体视觉和手眼协调能力。本系统的【阶段 4：立体视建立】直接复刻了该临床实验设计：左眼只能看到下落的俄罗斯方块，右眼只能看到底部固定的方块，必须双眼协同才能通关。',
    externalLink: 'https://pubmed.ncbi.nlm.nih.gov/23623554/'
  },
  {
    id: 'scheiman2014',
    authors: 'Scheiman, M., & Wick, B.',
    year: '2014',
    titleEn: 'Clinical Management of Binocular Vision: Heterophoric, Accommodative, and Eye Movement Disorders.',
    titleZh: '双眼视觉的临床管理：隐斜视、调节和眼动障碍（第四版）',
    journal: 'Lippincott Williams & Wilkins',
    abstractEn: `This comprehensive clinical text provides state-of-the-art coverage of the diagnosis and treatment of binocular vision disorders. It outlines step-by-step procedures for vision therapy, including the use of the Brock String for convergence insufficiency and divergence excess. It details the theoretical relationship between phoria (eye misalignment), accommodative demand, and the spatial frequency of visual stimuli used during orthoptic rehabilitation.`,
    abstractZh: `这本综合性临床教材提供了关于双眼视觉障碍诊断和治疗的最前沿内容。书中详细列出了视觉训练的逐步操作流程，包括使用“聚散球（Brock String）”来治疗集合不足和分开过强。它还详细阐述了隐斜视（眼位偏斜）、调节需求，以及在正视轴康复训练中所使用的视觉刺激的“空间频率”之间的理论关系。`,
    systemRelevance: '本系统依据：眼科临床视觉康复的金标准指南。本系统的【阶段 3】提供了 3D 聚散球（Brock String）的数字模拟；同时，系统的 3D 引擎会根据用户在“十字准星对齐”中测出的隐斜视 Offset 数值，动态调节训练方块的大小（空间频率）和运动速率。',
    externalLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4206068/'
  },
  {
    id: 'cooper2012',
    authors: 'Cooper, J., & Jamal, N.',
    year: '2012',
    titleEn: 'Convergence insufficiency—a major review.',
    titleZh: '集合不足——一项重大综述',
    journal: 'Optometry',
    abstractEn: `Convergence insufficiency (CI) is a common binocular vision disorder characterized by an inability to maintain accurate eye alignment when looking at near objects. Vision therapy, specifically using targets that stimulate base-out (BO) vergence such as Aperture Rule, eccentric circles, and Tranaglyphs, has been proven highly effective. Conversely, patients with divergence insufficiency require base-in (BI) vergence training.`,
    abstractZh: `集合不足（CI）是一种常见的双眼视觉障碍，其特征是在观察近处物体时无法保持准确的眼位对齐。视觉训练，特别是使用刺激底向外（BO）聚散的视标，如裂隙尺（Aperture Rule）、偏心圆和红绿立体图，已被证明是非常有效的。相反，散开不足的患者则需要进行底向内（BI）的聚散训练。`,
    systemRelevance: '本系统依据：明确了外斜视（需BO集合训练）与内斜视（需BI散开训练）在临床上的方向性差异。系统在【阶段 3】新增了“裂隙尺/聚散卡（Vergence Cards）”训练，会根据隐斜检查的 Offset 值，自动生成对应方向的红蓝圆环，实现个性化的内/外斜视干预。',
    externalLink: 'https://pubmed.ncbi.nlm.nih.gov/22436774/'
  },
  {
    id: 'saccadic2002',
    authors: 'Ciuffreda, K. J.',
    year: '2002',
    titleEn: 'The scientific basis for and efficacy of optometric vision therapy in nonstrabismic accommodative and vergence disorders.',
    titleZh: '非斜视性调节和聚散障碍中视光视觉训练的科学基础与疗效',
    journal: 'Optometry',
    abstractEn: `Therapy for binocular anomalies must involve not only fusion, but also the rapid switching of visual attention through saccadic eye movements. Smooth pursuits and saccades are fundamental oculomotor skills. Integrating saccadic tracking under dichoptic viewing conditions forces the visual system to process rapid visual shifts while preventing central suppression.`,
    abstractZh: `双眼异常的治疗不仅必须包括融像，还需要通过扫视性眼球运动来快速切换视觉注意力。平稳追随和扫视是基本的动眼神经技能。在双眼分视观察条件下整合扫视追踪训练，可以强迫视觉系统处理快速的视觉偏移，同时防止中枢抑制的发生。`,
    systemRelevance: '本系统依据：提出了眼球运动功能与脱抑制结合的重要性。系统在【阶段 2】新增了“扫视追踪（Saccadic Tracking）”模块，通过在屏幕随机跳跃的红蓝视标，训练双眼在快速运动和注意力转移中的交替与同时视能力。',
    externalLink: 'https://pubmed.ncbi.nlm.nih.gov/12221330/'
  },
  {
    id: 'li2011',
    authors: 'Li, R. W., Ngo, C., Nguyen, J., & Levi, D. M.',
    year: '2011',
    titleEn: 'Video-game play induces plasticity in the visual system of adults with amblyopia.',
    titleZh: '电子游戏游玩诱导成人弱视视觉系统的神经可塑性',
    journal: 'PLoS Biology',
    abstractEn: `Adult amblyopia is often considered untreatable. Here we show that perceptual learning achieved through playing action video games can significantly improve visual acuity, spatial attention, and stereopsis in adults with amblyopia. This demonstrates that the adult amblyopic visual cortex retains a high degree of neuroplasticity, which can be harnessed by engaging in complex, attention-demanding visual tasks.`,
    abstractZh: `成人弱视通常被认为是无法治疗的。我们的研究表明，通过游玩动作类电子游戏所实现的知觉学习，能够显著改善成人弱视患者的视敏度、空间注意力和立体视觉。这证明了成人弱视视觉皮层依然保留着高度的神经可塑性，而这种可塑性可以通过参与复杂且需要高度注意力的视觉任务（如电子游戏）来被重新激活。`,
    systemRelevance: '本系统依据：为系统使用“游戏化”机制（如洗牌、星空粒子、俄罗斯方块）提供了坚实的科学基础。游戏中的动态追踪和空间频率变化能够高度集中用户的视觉注意力，从而激活大脑的神经可塑性，加速双眼视觉的康复进程。',
    externalLink: 'https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1001135'
  }
]