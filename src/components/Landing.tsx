import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GitHubLogo, ExternalLinkIcon } from './Icons'
import { LanguageSwitcher } from './LanguageSwitcher'
import type { WizardConfig } from '../wizardData'

interface LandingProps {
  config: WizardConfig
  updateConfig: (partial: Partial<WizardConfig>) => void
}

export function Landing({ config, updateConfig }: LandingProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const startGuide = (dr: boolean) => {
    updateConfig({ dataResidency: dr })
    navigate(dr ? '/dr/prerequisites' : '/standard/prerequisites')
  }

  const idpLabel = config.idpType === 'entra-id' ? 'Microsoft Entra ID' : 'Okta'
  const protoLabel = config.ssoProtocol === 'saml' ? 'SAML' : 'OIDC'
  const oidcDisabled = config.idpType === 'okta'

  return (
    <>
      <header className="app-header">
        <GitHubLogo />
        <h1>{t('header.title')}</h1>
        <LanguageSwitcher />
        <a
          href="https://github.com/account/enterprises/new?users_type=enterprise_managed"
          target="_blank"
          rel="noopener noreferrer"
          className="header-new-enterprise-btn"
        >
          {t('header.newEnterprise')}
        </a>
        <a
          href="https://github.com/congiuluc/github-emu-configuration-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="header-repo-btn"
          title="View source on GitHub"
        >
          <GitHubLogo /> {t('header.repo')}
        </a>
      </header>
      <main className="landing-container">
        <div className="landing-hero">
          <div className="landing-logo">
            <GitHubLogo />
          </div>
          <h2 className="landing-title">{t('landing.title')}</h2>
          <p className="landing-subtitle">
            {t('landing.subtitle')}
          </p>
        </div>

        <div className="landing-config">
          <h3 className="landing-config-title">{t('landing.configTitle')}</h3>

          <div className="landing-config-grid">
            {/* Identity Provider */}
            <div className="landing-config-group">
              <label className="landing-config-label">{t('landing.idpLabel')}</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.idpType === 'entra-id' ? 'active' : ''}`}
                  onClick={() => updateConfig({ idpType: 'entra-id' })}
                >
                  Microsoft Entra ID
                </button>
                <button
                  className={`config-option-btn ${config.idpType === 'okta' ? 'active' : ''}`}
                  onClick={() => updateConfig({ idpType: 'okta', ssoProtocol: 'saml' })}
                >
                  Okta
                </button>
              </div>
              <span className="landing-config-hint">
                {config.idpType === 'entra-id'
                  ? t('landing.idpEntraHint')
                  : t('landing.idpOktaHint')}
              </span>
            </div>

            {/* SSO Protocol */}
            <div className="landing-config-group">
              <label className="landing-config-label">{t('landing.ssoLabel')}</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.ssoProtocol === 'saml' ? 'active' : ''}`}
                  onClick={() => updateConfig({ ssoProtocol: 'saml' })}
                >
                  SAML
                </button>
                <button
                  className={`config-option-btn ${config.ssoProtocol === 'oidc' ? 'active' : ''} ${oidcDisabled ? 'disabled' : ''}`}
                  onClick={() => !oidcDisabled && updateConfig({ ssoProtocol: 'oidc' })}
                  disabled={oidcDisabled}
                  title={oidcDisabled ? 'OIDC is only supported with Entra ID' : ''}
                >
                  OIDC
                  {oidcDisabled && <span className="config-badge-na">N/A</span>}
                </button>
              </div>
              <span className="landing-config-hint">
                {config.ssoProtocol === 'oidc'
                  ? t('landing.ssoOidcHint')
                  : t('landing.ssoSamlHint')}
              </span>
            </div>

            {/* Orgs & Policies */}
            <div className="landing-config-group">
              <label className="landing-config-label">{t('landing.orgsLabel')}</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.manageOrgs ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageOrgs: true })}
                >
                  {t('common.include')}
                </button>
                <button
                  className={`config-option-btn ${!config.manageOrgs ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageOrgs: false })}
                >
                  {t('common.skip')}
                </button>
              </div>
              <span className="landing-config-hint">
                {config.manageOrgs
                  ? t('landing.orgsIncludeHint')
                  : t('landing.orgsSkipHint')}
              </span>
            </div>

            {/* Copilot Management */}
            <div className="landing-config-group">
              <label className="landing-config-label">{t('landing.copilotLabel')}</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.manageCopilot ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageCopilot: true })}
                >
                  {t('common.include')}
                </button>
                <button
                  className={`config-option-btn ${!config.manageCopilot ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageCopilot: false })}
                >
                  {t('common.skip')}
                </button>
              </div>
              <span className="landing-config-hint">
                {config.manageCopilot
                  ? t('landing.copilotIncludeHint')
                  : t('landing.copilotSkipHint')}
              </span>
            </div>

            {/* GitHub Advanced Security */}
            <div className="landing-config-group">
              <label className="landing-config-label">{t('landing.ghasLabel')}</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.manageGHAS ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageGHAS: true })}
                >
                  {t('common.include')}
                </button>
                <button
                  className={`config-option-btn ${!config.manageGHAS ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageGHAS: false })}
                >
                  {t('common.skip')}
                </button>
              </div>
              <span className="landing-config-hint">
                {config.manageGHAS
                  ? t('landing.ghasIncludeHint')
                  : t('landing.ghasSkipHint')}
              </span>
            </div>
          </div>

          <div className="landing-config-summary">
            <span className="config-summary-label">{t('landing.configSummary')}</span>
            <span className="config-summary-badge">{idpLabel}</span>
            <span className="config-summary-badge">{protoLabel}</span>
            {config.manageOrgs && <span className="config-summary-badge">Orgs</span>}
            {config.manageCopilot && <span className="config-summary-badge">Copilot</span>}
            {config.manageGHAS && <span className="config-summary-badge">GHAS</span>}
          </div>
        </div>

        <p className="landing-prompt">{t('landing.choosePrompt')}</p>

        <div className="landing-cards">
          <button className="landing-card" onClick={() => startGuide(true)}>
            <div className="landing-card-icon">🌍</div>
            <h3 className="landing-card-title">{t('landing.withDR')}</h3>
            <p className="landing-card-domain">{t('landing.withDRDomain')}</p>
            <p className="landing-card-desc">
              {t('landing.withDRDesc')}
            </p>
            <ul className="landing-card-features">
              <li>{t('landing.withDRFeature1')}</li>
              <li>{t('landing.withDRFeature2')}</li>
              <li>{t('landing.withDRFeature3')}</li>
            </ul>
            <span className="landing-card-cta">{t('landing.startSetup')}</span>
          </button>

          <button className="landing-card" onClick={() => startGuide(false)}>
            <div className="landing-card-icon">☁️</div>
            <h3 className="landing-card-title">{t('landing.withoutDR')}</h3>
            <p className="landing-card-domain">{t('landing.withoutDRDomain')}</p>
            <p className="landing-card-desc">
              {t('landing.withoutDRDesc')}
            </p>
            <ul className="landing-card-features">
              <li>{t('landing.withoutDRFeature1')}</li>
              <li>{t('landing.withoutDRFeature2')}</li>
              <li>{t('landing.withoutDRFeature3')}</li>
            </ul>
            <span className="landing-card-cta">{t('landing.startSetup')}</span>
          </button>
        </div>

        <div className="landing-footer">
          <a href="https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency"
             target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon /> {t('landing.learnMoreDR')}
          </a>
          <span className="landing-separator">•</span>
          <a href="https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/understanding-iam-for-enterprises/about-enterprise-managed-users"
             target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon /> {t('landing.aboutEMU')}
          </a>
        </div>
      </main>
    </>
  )
}
