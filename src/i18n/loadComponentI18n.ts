import i18n from './i18n';

type Translations = {
  [lang: string]: Record<string, any>;
};

export const loadComponentI18n = (ns: string, translations: Translations) => {
  Object.entries(translations).forEach(([lang, resource]) => {
    if (!i18n.hasResourceBundle(lang, ns)) {
      i18n.addResourceBundle(lang, ns, resource, true, true);
    }
  });
};
