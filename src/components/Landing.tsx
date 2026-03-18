import { useNavigate } from 'react-router-dom'
import { GitHubLogo, ExternalLinkIcon } from './Icons'
import type { WizardConfig } from '../wizardData'

interface LandingProps {
  config: WizardConfig
  updateConfig: (partial: Partial<WizardConfig>) => void
}

export function Landing({ config, updateConfig }: LandingProps) {
  const navigate = useNavigate()

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
        <h1>EMU Configuration Guide</h1>
        <a
          href="https://github.com/account/enterprises/new?users_type=enterprise_managed"
          target="_blank"
          rel="noopener noreferrer"
          className="header-new-enterprise-btn"
        >
          + New Enterprise
        </a>
        <a
          href="https://github.com/congiuluc/github-emu-configuration-guide"
          target="_blank"
          rel="noopener noreferrer"
          className="header-repo-btn"
          title="View source on GitHub"
        >
          <GitHubLogo /> Repo
        </a>
      </header>
      <main className="landing-container">
        <div className="landing-hero">
          <div className="landing-logo">
            <GitHubLogo />
          </div>
          <h2 className="landing-title">GitHub Enterprise Managed Users</h2>
          <p className="landing-subtitle">
            Step-by-step guide to configure EMU with SSO, SCIM provisioning, and GitHub Copilot.
          </p>
        </div>

        <div className="landing-config">
          <h3 className="landing-config-title">Configure your setup</h3>

          <div className="landing-config-grid">
            {/* Identity Provider */}
            <div className="landing-config-group">
              <label className="landing-config-label">🔐 Identity Provider</label>
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
                  ? 'Recommended — supports SAML and OIDC with Conditional Access'
                  : 'Supports SAML only for GitHub EMU'}
              </span>
            </div>

            {/* SSO Protocol */}
            <div className="landing-config-group">
              <label className="landing-config-label">🔑 SSO Protocol</label>
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
                  ? 'Enables Conditional Access Policy (CAP) enforcement'
                  : 'Standard SSO protocol — widely supported'}
              </span>
            </div>

            {/* Orgs & Policies */}
            <div className="landing-config-group">
              <label className="landing-config-label">🏢 Orgs &amp; Policies</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.manageOrgs ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageOrgs: true })}
                >
                  Include
                </button>
                <button
                  className={`config-option-btn ${!config.manageOrgs ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageOrgs: false })}
                >
                  Skip
                </button>
              </div>
              <span className="landing-config-hint">
                {config.manageOrgs
                  ? 'Includes creating organizations, repos, and enterprise policies'
                  : 'Focus on SSO, SCIM, and Copilot seat assignment'}
              </span>
            </div>

            {/* Copilot Management */}
            <div className="landing-config-group">
              <label className="landing-config-label">🤖 GitHub Copilot</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.manageCopilot ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageCopilot: true })}
                >
                  Include
                </button>
                <button
                  className={`config-option-btn ${!config.manageCopilot ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageCopilot: false })}
                >
                  Skip
                </button>
              </div>
              <span className="landing-config-hint">
                {config.manageCopilot
                  ? 'Includes enabling, policies, seat assignment, and IDE setup'
                  : 'Guide will only cover SSO and SCIM provisioning'}
              </span>
            </div>

            {/* GitHub Advanced Security */}
            <div className="landing-config-group">
              <label className="landing-config-label">🛡️ GitHub Advanced Security</label>
              <div className="landing-config-options">
                <button
                  className={`config-option-btn ${config.manageGHAS ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageGHAS: true })}
                >
                  Include
                </button>
                <button
                  className={`config-option-btn ${!config.manageGHAS ? 'active' : ''}`}
                  onClick={() => updateConfig({ manageGHAS: false })}
                >
                  Skip
                </button>
              </div>
              <span className="landing-config-hint">
                {config.manageGHAS
                  ? 'Includes code scanning, secret scanning, Dependabot, and security overview'
                  : 'Skip advanced security configuration steps'}
              </span>
            </div>
          </div>

          <div className="landing-config-summary">
            <span className="config-summary-label">Your configuration:</span>
            <span className="config-summary-badge">{idpLabel}</span>
            <span className="config-summary-badge">{protoLabel}</span>
            {config.manageOrgs && <span className="config-summary-badge">Orgs</span>}
            {config.manageCopilot && <span className="config-summary-badge">Copilot</span>}
            {config.manageGHAS && <span className="config-summary-badge">GHAS</span>}
          </div>
        </div>

        <p className="landing-prompt">Choose your enterprise type to get started:</p>

        <div className="landing-cards">
          <button className="landing-card" onClick={() => startGuide(true)}>
            <div className="landing-card-icon">🌍</div>
            <h3 className="landing-card-title">With Data Residency</h3>
            <p className="landing-card-domain">YOUR-ENTERPRISE.ghe.com</p>
            <p className="landing-card-desc">
              Your enterprise data is stored in a specific geographic region. Each enterprise gets its
              own GHE.com subdomain with isolated data storage.
            </p>
            <ul className="landing-card-features">
              <li>Dedicated subdomain (ghe.com)</li>
              <li>Region-specific data storage</li>
              <li>IDE requires enterprise URL config</li>
            </ul>
            <span className="landing-card-cta">Start Setup →</span>
          </button>

          <button className="landing-card" onClick={() => startGuide(false)}>
            <div className="landing-card-icon">☁️</div>
            <h3 className="landing-card-title">Without Data Residency</h3>
            <p className="landing-card-domain">github.com/enterprises/YOUR-ENTERPRISE</p>
            <p className="landing-card-desc">
              Standard GitHub Enterprise Cloud on github.com. Your enterprise is managed within the
              global GitHub platform without region-specific data guarantees.
            </p>
            <ul className="landing-card-features">
              <li>Standard github.com platform</li>
              <li>Global data storage</li>
              <li>Standard IDE sign-in flow</li>
            </ul>
            <span className="landing-card-cta">Start Setup →</span>
          </button>
        </div>

        <div className="landing-footer">
          <a href="https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency"
             target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon /> Learn more about Data Residency
          </a>
          <span className="landing-separator">•</span>
          <a href="https://docs.github.com/en/enterprise-cloud@latest/admin/identity-and-access-management/understanding-iam-for-enterprises/about-enterprise-managed-users"
             target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon /> About Enterprise Managed Users
          </a>
        </div>
      </main>
    </>
  )
}
