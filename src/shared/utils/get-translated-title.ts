interface Translation {
  language: string;
  title?: string;
  description?: string;
}

interface Entity {
  title?: string;
  description?: string;
  translations?: Translation[];
}

export function getTranslatedTitle(entity: Entity, language: string): string {
  return entity?.translations?.find((t) => t.language === language)?.title ?? entity?.title ?? '';
}

export function getTranslatedDescription(entity: Entity, language: string): string {
  return (
    entity?.translations?.find((t) => t.language === language)?.description ??
    entity?.description ??
    ''
  );
}
