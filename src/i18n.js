// import { createI18n } from 'vue-i18n'
// import VueI18n from 'vue-i18n'
import messages from './lang'

const i18n = new VueI18n({
  legacy: false,
  globalInjection: true,
  locale: process.env.VUE_APP_I18N_LOCALE || "en",
  allowComposition: true,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: messages
})

export default i18n;