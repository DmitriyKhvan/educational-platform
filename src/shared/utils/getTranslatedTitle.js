export function getTranslatedTitle(entity, language) {
  return (
    entity?.translations?.find((t) => t.language === language)?.title ??
    entity?.title ??
    ''
  );
}

export function getTranslatedDescription(entity, language) {
  return (
    entity?.translations?.find((t) => t.language === language)?.description ??
    entity?.description ??
    ''
  );
}
