import { useEffect } from 'react';
import { loadComponentI18n } from '../i18n/loadComponentI18n';
import { useTranslation } from 'react-i18next';

export const useCustomTranslation = (ns: string, en: Record<string, string>, ru: Record<string, string>) => {
  useEffect(() => {
    loadComponentI18n(ns, { en, ru });
  }, [en, ru, ns]);

  const { t } = useTranslation(ns);

  return { t };
};
