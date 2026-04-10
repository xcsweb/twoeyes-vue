import { useSettingsStore } from '../store/settings'

export type RouteResolver = (store: ReturnType<typeof useSettingsStore>) => string;

export interface FlowNode {
  name: string;
  next?: string | RouteResolver;
  prev?: string | RouteResolver;
}

export const visionFlow: FlowNode[] = [
  { name: 'SectionIntroVision', next: 'VisionDistanceAdvice' },
  { name: 'VisionDistanceAdvice', next: 'VisionTest', prev: 'SectionIntroVision' },
  { name: 'VisionTest', next: 'AstigmatismTest', prev: 'VisionDistanceAdvice' },
  { name: 'AstigmatismTest', next: 'ColorVisionTest', prev: 'VisionTest' },
  { name: 'ColorVisionTest', next: 'AmslerGridTest', prev: 'AstigmatismTest' },
  { name: 'AmslerGridTest', next: 'ContrastSensitivityTest', prev: 'ColorVisionTest' },
  { name: 'ContrastSensitivityTest', next: 'VisionAdvice', prev: 'AmslerGridTest' },
  { name: 'VisionAdvice', next: 'Home', prev: 'ContrastSensitivityTest' }
];

export const examFlow: FlowNode[] = [
  { name: 'SectionIntroExam', next: 'LensSelection' },
  { name: 'SectionIntroAlignment', next: 'AlignmentExercise', 
    prev: (store) => {
      if (store.suppressionStatus === 'none' || store.suppressionStatus === 'diplopia') {
        return 'SuppressionTest';
      }
      return 'ContrastTest';
    } 
  },
  { name: 'LensSelection', next: 'LensConfirmation', prev: 'SectionIntroExam' },
  { name: 'LensConfirmation', next: 'DistanceAdvice', prev: 'LensSelection' },
  { name: 'DistanceAdvice', next: 'SuppressionTest', prev: 'LensConfirmation' },
  { name: 'SuppressionTest', 
    next: (store) => {
      if (store.suppressionStatus === 'none' || store.suppressionStatus === 'diplopia') {
        store.setPenalizationFactor(1.0);
        return 'SectionIntroAlignment';
      }
      return 'ContrastTest';
    },
    prev: 'DistanceAdvice' 
  },
  { name: 'ContrastTest', next: 'SectionIntroAlignment', prev: 'SuppressionTest' },
  { name: 'AlignmentExercise', next: 'AlignmentAdvice', prev: 'SectionIntroAlignment' },
  { name: 'AlignmentAdvice', next: 'Home', prev: 'AlignmentExercise' }
];

export const amblyopiaFlow: FlowNode[] = [
  { name: 'SectionIntroAmblyopia', next: 'LensSelection' },
  { name: 'LensSelection', next: 'LensConfirmation', prev: 'SectionIntroAmblyopia' },
  { name: 'LensConfirmation', next: 'DistanceAdvice', prev: 'LensSelection' },
  { name: 'DistanceAdvice', next: 'SuppressionTest', prev: 'LensConfirmation' },
  { name: 'SuppressionTest', 
    next: (store) => {
      if (store.suppressionStatus === 'none' || store.suppressionStatus === 'diplopia') {
        store.setPenalizationFactor(1.0);
        return 'AmblyopiaAdvice';
      }
      return 'ContrastTest';
    },
    prev: 'DistanceAdvice' 
  },
  { name: 'ContrastTest', next: 'AmblyopiaAdvice', prev: 'SuppressionTest' },
  { name: 'AmblyopiaAdvice', next: 'Home', 
    prev: (store) => {
      if (store.suppressionStatus === 'none' || store.suppressionStatus === 'diplopia') {
        return 'SuppressionTest';
      }
      return 'ContrastTest';
    } 
  }
];

export const flows: Record<string, FlowNode[]> = {
  vision: visionFlow,
  exam: examFlow,
  amblyopia: amblyopiaFlow
};
