import { useSettingsStore } from '../store/settings'

export type RouteResolver = (store: ReturnType<typeof useSettingsStore>) => string;

export interface FlowNode {
  name: string;
  next?: string | RouteResolver;
  prev?: string | RouteResolver;
}

export const visionFlow: FlowNode[] = [
  { name: 'SectionIntroVision', next: (store) => store.age !== null ? 'VisionDistanceAdvice' : 'UserInfoForm' },
  { name: 'UserInfoForm', next: 'VisionDistanceAdvice', prev: 'SectionIntroVision' },
  { name: 'VisionDistanceAdvice', next: 'VisionTest', prev: (store) => store.age !== null ? 'SectionIntroVision' : 'UserInfoForm' },
  { name: 'VisionTest', next: 'AstigmatismTest', prev: 'VisionDistanceAdvice' },
  { name: 'AstigmatismTest', next: 'ColorVisionTest', prev: 'VisionTest' },
  { name: 'ColorVisionTest', next: 'AmslerGridTest', prev: 'AstigmatismTest' },
  { name: 'AmslerGridTest', next: 'ContrastSensitivityTest', prev: 'ColorVisionTest' },
  { name: 'ContrastSensitivityTest', next: 'VisionAdvice', prev: 'AmslerGridTest' },
  { name: 'VisionAdvice', next: 'Home', prev: 'ContrastSensitivityTest' }
];

export const examFlow: FlowNode[] = [
  { name: 'SectionIntroExam', next: (store) => store.age !== null ? 'LensSelection' : 'UserInfoForm' },
  { name: 'UserInfoForm', next: 'LensSelection', prev: 'SectionIntroExam' },
  { name: 'SectionIntroAlignment', next: 'AlignmentExercise', 
    prev: (store) => {
      if (store.suppressionStatus === 'none' || store.suppressionStatus === 'diplopia') {
        return 'SuppressionTest';
      }
      return 'ContrastTest';
    } 
  },
  { name: 'LensSelection', next: 'LensConfirmation', prev: (store) => store.age !== null ? 'SectionIntroExam' : 'UserInfoForm' },
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
  { name: 'AlignmentExercise', next: 'StereopsisTest', prev: 'SectionIntroAlignment' },
  { name: 'StereopsisTest', next: 'AlignmentAdvice', prev: 'AlignmentExercise' },
  { name: 'AlignmentAdvice', next: 'Home', prev: 'StereopsisTest' }
];

export const amblyopiaFlow: FlowNode[] = [
  { name: 'SectionIntroAmblyopia', next: (store) => store.age !== null ? 'LensSelection' : 'UserInfoForm' },
  { name: 'UserInfoForm', next: 'LensSelection', prev: 'SectionIntroAmblyopia' },
  { name: 'LensSelection', next: 'LensConfirmation', prev: (store) => store.age !== null ? 'SectionIntroAmblyopia' : 'UserInfoForm' },
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
