import type { Course, LanguageLevel, StudentReviewTag, Topic } from '@/types/types.generated';

export function getTranslatedTitle(
  entity?: Course | LanguageLevel | Topic | null | StudentReviewTag,
  language?: string,
): string {
  return entity?.translations?.find((t) => t?.language === language)?.title ?? entity?.title ?? '';
}

export function getTranslatedDescription(
  entity: Course | LanguageLevel | Topic,
  language: string,
): string {
  return (
    entity?.translations?.find((t) => t?.language === language)?.description ??
    entity?.description ??
    ''
  );
}
