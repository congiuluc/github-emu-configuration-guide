import { useState } from 'react'
import { ExternalLinkIcon } from './Icons'
import { renderText } from '../utils/renderText'
import type { WizardStep, EmailTemplate } from '../wizardData'

function buildMailtoLink(tpl: EmailTemplate): string {
  const NL = '\r\n'
  const strip = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1')
  const bodyParts: string[] = [
    strip(tpl.greeting),
    '',
    strip(tpl.intro),
    '',
  ]
  for (const section of tpl.sections) {
    bodyParts.push('---')
    bodyParts.push(strip(section.heading))
    bodyParts.push('')
    for (const line of section.lines) {
      bodyParts.push(strip(line))
      bodyParts.push('')
    }
  }
  bodyParts.push('---')
  bodyParts.push('')
  bodyParts.push(...tpl.closing.map(strip))

  const subject = encodeURIComponent(tpl.subject)
  const body = encodeURIComponent(bodyParts.join(NL))
  return `mailto:?subject=${subject}&body=${body}`
}

interface StepContentProps {
  step: WizardStep
  currentStep: number
  totalSteps: number
  checkedItems: Record<string, boolean>
  toggleCheck: (key: string) => void
  clearChecked: (keys: string[]) => void
  isStepCompleted: boolean
  goTo: (index: number) => void
}

export function StepContent({
  step,
  currentStep,
  totalSteps,
  checkedItems,
  toggleCheck,
  clearChecked,
  isStepCompleted,
  goTo,
}: StepContentProps) {
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({})

  const toggleSub = (key: string) =>
    setExpandedSubs(prev => ({ ...prev, [key]: !prev[key] }))

  const expandAll = () => {
    const all: Record<string, boolean> = {}
    step.substeps.forEach((_, i) => { all[`${step.id}-sub-${i}`] = true })
    setExpandedSubs(prev => ({ ...prev, ...all }))
  }

  const collapseAll = () => {
    const all: Record<string, boolean> = {}
    step.substeps.forEach((_, i) => { all[`${step.id}-sub-${i}`] = false })
    setExpandedSubs(prev => ({ ...prev, ...all }))
  }

  const verifiedCount = step.substeps.filter((_, i) => checkedItems[`${step.id}-${i}`]).length

  return (
    <main className="wizard-content">
      <div className="step-card">
        <h2>
          Step {currentStep}: {step.title}
        </h2>
        <p className="step-description">{renderText(step.description)}</p>

        {step.warnings?.map((w, i) => (
          <div key={i} className="info-box warning">
            <div className="box-title">⚠️ Warning</div>
            {renderText(w)}
          </div>
        ))}

        {step.prerequisites && step.prerequisites.length > 0 && (
          <div className="info-box prerequisites">
            <div className="box-title">📋 Prerequisites for this step</div>
            <ul className="prerequisites-list">
              {step.prerequisites.map((p, i) => (
                <li key={i}>{renderText(p)}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="substeps-toolbar">
          <h3>Step-by-step Instructions</h3>
          <div className="substeps-toolbar-btns">
            <button className="substeps-toggle-btn" onClick={expandAll}>Expand All</button>
            <button className="substeps-toggle-btn" onClick={collapseAll}>Collapse All</button>
          </div>
        </div>

        <div className="substeps-list">
          {step.substeps.map((sub, i) => {
            const checkKey = `${step.id}-${i}`
            const subKey = `${step.id}-sub-${i}`
            const verified = !!checkedItems[checkKey]
            const expanded = expandedSubs[subKey] !== false
            return (
              <div key={i} className={`substep-card ${verified ? 'substep-verified' : ''}`}>
                <div
                  className="substep-header"
                  onClick={() => toggleSub(subKey)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleSub(subKey) }}
                >
                  <span className="substep-number">{currentStep}.{i + 1}</span>
                  <div className="substep-action">{renderText(sub.action)}</div>
                  <span className={`substep-chevron ${expanded ? 'open' : ''}`}>▸</span>
                </div>

                {expanded && (
                  <div className="substep-body">
                    {sub.emailTemplate && (
                      <div className="email-template-block">
                        <div className="email-template-header">
                          <span className="email-template-label">📧 Email Template</span>
                          <a
                            className="btn btn-mail"
                            href={buildMailtoLink(sub.emailTemplate)}
                            title="Open in your email client"
                          >
                            ✉️ Compose Email
                          </a>
                        </div>
                        <div className="email-template-content">
                          <div className="email-template-subject">
                            <strong>Subject:</strong> {renderText(sub.emailTemplate.subject)}
                          </div>
                          <div className="email-template-body">
                            <p>{renderText(sub.emailTemplate.greeting)}</p>
                            <p>{renderText(sub.emailTemplate.intro)}</p>
                            {sub.emailTemplate.sections.map((section, si) => (
                              <div key={si} className="email-template-section">
                                <h4>{renderText(section.heading)}</h4>
                                {section.lines.map((line, li) => (
                                  <p key={li}>{renderText(line)}</p>
                                ))}
                              </div>
                            ))}
                            <div className="email-template-closing">
                              {sub.emailTemplate.closing.map((line, ci) => (
                                <span key={ci}>
                                  {line ? renderText(line) : '\u00A0'}
                                  <br />
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {sub.details && sub.details.length > 0 && (
                      <ul className="substep-details">
                        {sub.details.map((d, j) => (
                          <li key={j}>{renderText(d)}</li>
                        ))}
                      </ul>
                    )}

                    {sub.docLinks && sub.docLinks.length > 0 && (
                      <div className="substep-docs">
                        {sub.docLinks.map((link, j) => (
                          <a
                            key={j}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="substep-doc-link"
                          >
                            <ExternalLinkIcon />
                            <span>{link.title}</span>
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="substep-verification">
                      <input
                        type="checkbox"
                        checked={verified}
                        onChange={() => {
                          toggleCheck(checkKey)
                          if (!verified) setExpandedSubs(prev => ({ ...prev, [subKey]: false }))
                        }}
                        id={checkKey}
                      />
                      <label htmlFor={checkKey}>
                        <span className="verification-label">Verify:</span> {renderText(sub.verification)}
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {step.notes && step.notes.length > 0 && (
          <>
            <h3>IdP-Specific Notes</h3>
            {step.notes.map((n, i) => (
              <div key={i} className="info-box info">
                <div className="box-title">ℹ️ Note</div>
                {renderText(n)}
              </div>
            ))}
          </>
        )}

        {step.tips?.map((t, i) => (
          <div key={i} className="info-box tip">
            <div className="box-title">💡 Tip</div>
            {renderText(t)}
          </div>
        ))}

        <div className="step-progress-summary">
          <span>
            {verifiedCount} of {step.substeps.length} verifications completed
          </span>
          {verifiedCount > 0 && (
            <button
              className="btn btn-clear-verified"
              onClick={() =>
                clearChecked(
                  step.substeps
                    .map((_, i) => `${step.id}-${i}`)
                    .filter(k => checkedItems[k])
                )
              }
            >
              Clear Verified
            </button>
          )}
          {isStepCompleted && (
            <span className="step-complete-badge">✓ All verified</span>
          )}
        </div>

        <div className="step-navigation">
          <button
            className="btn btn-secondary"
            disabled={currentStep === 0}
            onClick={() => goTo(currentStep - 1)}
          >
            ← Previous
          </button>
          {currentStep < totalSteps - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => goTo(currentStep + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={!isStepCompleted}
              onClick={() =>
                alert(
                  '🎉 Congratulations! Your EMU enterprise is fully configured.'
                )
              }
            >
              Complete Setup ✓
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
