import type { LanguageLevel, Maybe, Topic, TrialPackage } from '@/types/types.generated';

export interface SelectedPlan {
  languageLevel: LanguageLevel;
  lessonTopic: Topic;
  packageSubscription: Maybe<TrialPackage> | undefined;
}
