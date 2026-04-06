import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import it from './locales/it.json'
import fr from './locales/fr.json'
import de from './locales/de.json'
import { loadStepTranslations } from './stepTranslations'

const savedLang = localStorage.getItem('emu-guide-lang') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    it: { translation: it },
    fr: { translation: fr },
    de: { translation: de },
  },
  lng: savedLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

// Pre-load step translations for saved language
loadStepTranslations(savedLang)

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('emu-guide-lang', lng)
  loadStepTranslations(lng)
})

export default i18n
