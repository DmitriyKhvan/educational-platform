import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/app/providers/auth-provider";
import { Language, Roles, languagesDic, type LanguageDictionary, type LanguageType } from "@/shared/constants/global";
import type { AuthContextType } from "@/app/providers/auth-provider/lib/auth-context";

export const useCurrentLang = (): LanguageDictionary => {
	const { user } = useAuth() as AuthContextType;
	const { i18n } = useTranslation();
  
	const currentLang = useMemo((): LanguageDictionary => {
	  const storedLang = localStorage.getItem("language");
	  let currentLangValue: string;
  
	  if (storedLang) {
		currentLangValue = storedLang;
	  } else if (location.pathname === "/" || user?.role === Roles.MENTOR) {
		currentLangValue = Language.EN;
	  } else {
		currentLangValue = Language.KR;
	  }
  
	  let currentLang = languagesDic.find(
		(lang) => lang.value === currentLangValue,
	  );
  
	  if (!currentLang) {
		currentLang = languagesDic.find((lang) => lang.value === Language.EN) || languagesDic[0];
	  }
  
	  if (!storedLang) {
		i18n.changeLanguage(currentLang.value);
	  }
  
	  return currentLang;
	}, [localStorage.getItem("language")]);
  
	return currentLang;
  };