import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ExternalLinkIcon } from './Icons'
import { CopyableUrl } from './CopyableUrl'
import type { WizardConfig, WizardStep } from '../wizardData'

interface SidebarRightProps {
  config: WizardConfig
  updateConfig: (partial: Partial<WizardConfig>) => void
  withDataResidency: boolean
  enterpriseName: string
  setEnterpriseName: (name: string) => void
  step: WizardStep
}

export function SidebarRight({
  config,
  updateConfig,
  withDataResidency,
  enterpriseName,
  setEnterpriseName,
  step,
}: SidebarRightProps) {
  const { t } = useTranslation()
  const idpLabel = config.idpType === 'entra-id' ? 'Entra ID' : 'Okta'
  const protoLabel = config.ssoProtocol === 'saml' ? 'SAML' : 'OIDC'

  const stepDocLinks = useMemo(() => {
    const seen = new Set<string>()
    const links: Array<{ title: string; url: string; description?: string }> = []
    step.substeps.forEach(sub => {
      sub.docLinks?.forEach(link => {
        if (!seen.has(link.url)) {
          seen.add(link.url)
          links.push(link)
        }
      })
    })
    step.links.forEach(link => {
      if (!seen.has(link.url)) {
        seen.add(link.url)
        links.push(link)
      }
    })
    return links
  }, [step])

  return (
    <aside className="sidebar sidebar-right">
      {/* IdP & SSO Config */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">{t('sidebar.identitySso')}</h3>
        <div className="sidebar-config-badges">
          <span className="sidebar-badge idp">{idpLabel}</span>
          <span className="sidebar-badge protocol">{protoLabel}</span>
          {config.manageOrgs && <span className="sidebar-badge orgs">Orgs</span>}
          {config.manageCopilot && <span className="sidebar-badge copilot">Copilot</span>}
          {config.manageGHAS && <span className="sidebar-badge ghas">GHAS</span>}
        </div>
        <div className="sidebar-idp-toggle">
          <button
            className={`sidebar-idp-btn ${config.idpType === 'entra-id' ? 'active' : ''}`}
            onClick={() => updateConfig({ idpType: 'entra-id' })}
            title="Microsoft Entra ID"
          >Entra ID</button>
          <button
            className={`sidebar-idp-btn ${config.idpType === 'okta' ? 'active' : ''}`}
            onClick={() => updateConfig({ idpType: 'okta', ssoProtocol: 'saml' })}
            title="Okta"
          >Okta</button>
        </div>
        <div className="sidebar-idp-toggle">
          <button
            className={`sidebar-idp-btn ${config.ssoProtocol === 'saml' ? 'active' : ''}`}
            onClick={() => updateConfig({ ssoProtocol: 'saml' })}
          >SAML</button>
          <button
            className={`sidebar-idp-btn ${config.ssoProtocol === 'oidc' ? 'active' : ''} ${config.idpType === 'okta' ? 'disabled' : ''}`}
            onClick={() => config.idpType !== 'okta' && updateConfig({ ssoProtocol: 'oidc' })}
            disabled={config.idpType === 'okta'}
            title={config.idpType === 'okta' ? 'OIDC not supported with Okta' : 'OpenID Connect'}
          >OIDC</button>
        </div>
      </div>

      {/* Scope: Copilot, Orgs & GHAS */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">{t('sidebar.scope')}</h3>
        <div className="sidebar-idp-toggle">
          <span className="sidebar-toggle-label">{t('sidebar.orgs')}</span>
          <button
            className={`sidebar-idp-btn ${config.manageOrgs ? 'active' : ''}`}
            onClick={() => updateConfig({ manageOrgs: true })}
            title="Include organization creation and enterprise policies steps"
          >{t('sidebar.include')}</button>
          <button
            className={`sidebar-idp-btn ${!config.manageOrgs ? 'active' : ''}`}
            onClick={() => updateConfig({ manageOrgs: false })}
            title="Skip organization and policy steps"
          >{t('sidebar.skip')}</button>
        </div>
        <div className="sidebar-idp-toggle">
          <span className="sidebar-toggle-label">{t('sidebar.copilot')}</span>
          <button
            className={`sidebar-idp-btn ${config.manageCopilot ? 'active' : ''}`}
            onClick={() => updateConfig({ manageCopilot: true })}
            title="Include Copilot enablement, policies, seats, and IDE setup steps"
          >{t('sidebar.include')}</button>
          <button
            className={`sidebar-idp-btn ${!config.manageCopilot ? 'active' : ''}`}
            onClick={() => updateConfig({ manageCopilot: false })}
            title="Skip all Copilot configuration steps"
          >{t('sidebar.skip')}</button>
        </div>
        <div className="sidebar-idp-toggle">
          <span className="sidebar-toggle-label">{t('sidebar.ghas')}</span>
          <button
            className={`sidebar-idp-btn ${config.manageGHAS ? 'active' : ''}`}
            onClick={() => updateConfig({ manageGHAS: true })}
            title="Include GitHub Advanced Security configuration steps"
          >{t('sidebar.include')}</button>
          <button
            className={`sidebar-idp-btn ${!config.manageGHAS ? 'active' : ''}`}
            onClick={() => updateConfig({ manageGHAS: false })}
            title="Skip Advanced Security steps"
          >{t('sidebar.skip')}</button>
        </div>
      </div>

      {/* Enterprise Name Input */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">
          {t('sidebar.enterprise')}
          {!enterpriseName && <span className="sidebar-heading-required">{t('sidebar.required')}</span>}
        </h3>
        {!enterpriseName && (
          <div className="sidebar-enterprise-hint">
            <span className="sidebar-enterprise-hint-icon">👇</span>
            <span dangerouslySetInnerHTML={{ __html: t('sidebar.enterpriseHint') }} />
          </div>
        )}
        <div className={`sidebar-enterprise-input${!enterpriseName ? ' sidebar-enterprise-input--empty' : ''}`}>
          <span className="sidebar-input-prefix">
            {withDataResidency ? 'https://' : 'github.com/enterprises/'}
          </span>
          <input
            type="text"
            className="sidebar-input"
            placeholder="your-enterprise"
            value={enterpriseName}
            onChange={e => setEnterpriseName(
              e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase()
            )}
            spellCheck={false}
            autoComplete="off"
          />
          {withDataResidency && (
            <span className="sidebar-input-suffix">.ghe.com</span>
          )}
        </div>
      </div>

      {/* Enterprise URLs */}
      <div className="sidebar-section">
        <h3 className="sidebar-heading">{t('sidebar.enterpriseUrls')}</h3>
        {enterpriseName ? (
          <div className="sidebar-urls">
            <div className="sidebar-url-item">
              <span className="sidebar-url-label">Enterprise</span>
              <CopyableUrl url={
                withDataResidency
                  ? `https://${enterpriseName}.ghe.com`
                  : `https://github.com/enterprises/${enterpriseName}`
              } />
            </div>
            <div className="sidebar-url-item">
              <span className="sidebar-url-label">SSO</span>
              <CopyableUrl url={
                withDataResidency
                  ? `https://${enterpriseName}.ghe.com/enterprises/${enterpriseName}/sso`
                  : `https://github.com/enterprises/${enterpriseName}/sso`
              } />
            </div>
            <div className="sidebar-url-item">
              <span className="sidebar-url-label">SCIM</span>
              <CopyableUrl url={
                withDataResidency
                  ? `https://api.${enterpriseName}.ghe.com/scim/v2/enterprises/${enterpriseName}/`
                  : `https://api.github.com/scim/v2/enterprises/${enterpriseName}/`
              } />
            </div>
            <div className="sidebar-url-item">
              <span className="sidebar-url-label">ACS URL</span>
              <CopyableUrl url={
                withDataResidency
                  ? `https://${enterpriseName}.ghe.com/enterprises/${enterpriseName}/saml/consume`
                  : `https://github.com/enterprises/${enterpriseName}/saml/consume`
              } />
            </div>
            <div className="sidebar-url-item">
              <span className="sidebar-url-label">Entity ID</span>
              <CopyableUrl url={
                withDataResidency
                  ? `https://${enterpriseName}.ghe.com/enterprises/${enterpriseName}`
                  : `https://github.com/enterprises/${enterpriseName}`
              } />
            </div>
            <div className="sidebar-url-item">
              <span className="sidebar-url-label">{t('sidebar.setupUser')}</span>
              <code className="enterprise-setup-user">{enterpriseName}_admin</code>
            </div>
          </div>
        ) : (
          <div className="sidebar-empty-hint sidebar-empty-hint--enterprise">
            <span className="sidebar-empty-hint-arrow">👆</span>
            <span dangerouslySetInnerHTML={{ __html: t('sidebar.enterpriseUrlHint') }} />
          </div>
        )}
      </div>

      {/* Documentation for current step */}
      <div className="sidebar-section sidebar-docs-section">
        <h3 className="sidebar-heading">
          {t('sidebar.documentation')}
          <span className="sidebar-doc-count">{stepDocLinks.length}</span>
        </h3>
        {stepDocLinks.length > 0 ? (
          <div className="sidebar-doc-list">
            {stepDocLinks.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="sidebar-doc-item"
              >
                <ExternalLinkIcon />
                <div className="sidebar-doc-text">
                  <span className="sidebar-doc-title">{link.title}</span>
                  {link.description && (
                    <span className="sidebar-doc-desc">{link.description}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="sidebar-empty-hint">
            {t('sidebar.noDocsHint')}
          </div>
        )}
      </div>
    </aside>
  )
}
