import { useTranslation } from 'react-i18next'

function FlagGB() {
  return (
    <svg viewBox="0 0 60 30" width="24" height="12">
      <clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
      <clipPath id="t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
      <g clipPath="url(#s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
      </g>
    </svg>
  )
}

function FlagIT() {
  return (
    <svg viewBox="0 0 3 2" width="24" height="16">
      <rect width="1" height="2" fill="#008C45"/>
      <rect width="1" height="2" x="1" fill="#F4F5F0"/>
      <rect width="1" height="2" x="2" fill="#CD212A"/>
    </svg>
  )
}

function FlagFR() {
  return (
    <svg viewBox="0 0 3 2" width="24" height="16">
      <rect width="1" height="2" fill="#002395"/>
      <rect width="1" height="2" x="1" fill="#FFFFFF"/>
      <rect width="1" height="2" x="2" fill="#ED2939"/>
    </svg>
  )
}

function FlagDE() {
  return (
    <svg viewBox="0 0 5 3" width="24" height="14">
      <rect width="5" height="1" y="0" fill="#000"/>
      <rect width="5" height="1" y="1" fill="#DD0000"/>
      <rect width="5" height="1" y="2" fill="#FFCC00"/>
    </svg>
  )
}

const languages = [
  { code: 'en', Flag: FlagGB, label: 'EN' },
  { code: 'it', Flag: FlagIT, label: 'IT' },
  { code: 'fr', Flag: FlagFR, label: 'FR' },
  { code: 'de', Flag: FlagDE, label: 'DE' },
]

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <div className="language-switcher">
      {languages.map(({ code, Flag, label }) => (
        <button
          key={code}
          className={`lang-btn ${i18n.language === code ? 'active' : ''}`}
          onClick={() => i18n.changeLanguage(code)}
          title={t(`languages.${code}`)}
        >
          <Flag />
          <span className="lang-label">{label}</span>
        </button>
      ))}
    </div>
  )
}
