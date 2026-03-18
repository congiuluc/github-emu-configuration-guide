import { useState, useCallback, useMemo, useEffect } from 'react'
import { Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom'
import { getSteps, defaultConfig } from './wizardData'
import type { WizardStep, WizardConfig } from './wizardData'
import { GitHubLogo, ExternalLinkIcon } from './components/Icons'
import { Landing } from './components/Landing'
import { SidebarLeft } from './components/SidebarLeft'
import { SidebarRight } from './components/SidebarRight'
import { StepContent } from './components/StepContent'

export default function App() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [enterpriseName, setEnterpriseName] = useState('')
  const [wizardConfig, setWizardConfig] = useState<WizardConfig>({ ...defaultConfig })

  const toggleCheck = useCallback((key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const clearChecked = useCallback((keys: string[]) => {
    setCheckedItems(prev => {
      const next = { ...prev }
      keys.forEach(k => delete next[k])
      return next
    })
  }, [])

  const updateConfig = useCallback((partial: Partial<WizardConfig>) => {
    setWizardConfig(prev => ({ ...prev, ...partial }))
  }, [])

  return (
    <Routes>
      <Route path="/" element={
        <Landing config={wizardConfig} updateConfig={updateConfig} />
      } />
      <Route
        path="/dr/:stepId"
        element={
          <GuidePage
            config={{ ...wizardConfig, dataResidency: true }}
            updateConfig={updateConfig}
            enterpriseName={enterpriseName}
            setEnterpriseName={setEnterpriseName}
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
            clearChecked={clearChecked}
          />
        }
      />
      <Route
        path="/standard/:stepId"
        element={
          <GuidePage
            config={{ ...wizardConfig, dataResidency: false }}
            updateConfig={updateConfig}
            enterpriseName={enterpriseName}
            setEnterpriseName={setEnterpriseName}
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
            clearChecked={clearChecked}
          />
        }
      />
      <Route path="/dr" element={<Navigate to="/dr/prerequisites" replace />} />
      <Route path="/standard" element={<Navigate to="/standard/prerequisites" replace />} />
    </Routes>
  )
}

interface GuidePageProps {
  config: WizardConfig
  updateConfig: (partial: Partial<WizardConfig>) => void
  enterpriseName: string
  setEnterpriseName: (name: string) => void
  checkedItems: Record<string, boolean>
  toggleCheck: (key: string) => void
  clearChecked: (keys: string[]) => void
}

function GuidePage({
  config,
  updateConfig,
  enterpriseName,
  setEnterpriseName,
  checkedItems,
  toggleCheck,
  clearChecked,
}: GuidePageProps) {
  const { stepId } = useParams<{ stepId: string }>()
  const navigate = useNavigate()

  const withDataResidency = config.dataResidency

  const steps = useMemo(
    () => getSteps(config, enterpriseName),
    [config, enterpriseName]
  )

  const modePrefix = withDataResidency ? 'dr' : 'standard'
  const idPrefix = withDataResidency ? 'dr-' : 'nodr-'

  const currentStep = steps.findIndex(s => s.id === `${idPrefix}${stepId}`)
  const step: WizardStep | undefined = steps[currentStep]

  useEffect(() => {
    document.title = step
      ? `Step ${currentStep}: ${step.shortTitle} — EMU Configuration Guide`
      : 'EMU Configuration Guide'
  }, [step, currentStep])

  if (!step) {
    return <Navigate to={`/${modePrefix}/prerequisites`} replace />
  }

  const stripPrefix = (id: string) => id.replace(idPrefix, '')

  const goTo = (index: number) => {
    if (index >= 0 && index < steps.length) {
      navigate(`/${modePrefix}/${stripPrefix(steps[index].id)}`)
    }
  }

  const handleModeChange = (dr: boolean) => {
    updateConfig({ dataResidency: dr })
    const newPrefix = dr ? 'dr' : 'standard'
    if (stepId) {
      navigate(`/${newPrefix}/${stepId}`, { replace: true })
    } else {
      navigate(`/${newPrefix}/prerequisites`, { replace: true })
    }
  }

  const isStepCompleted = (stepIndex: number) => {
    const s = steps[stepIndex]
    if (!s.substeps || s.substeps.length === 0) return false
    return s.substeps.every((sub, i) =>
      /\(optional|\(Optional/i.test(sub.action) || checkedItems[`${s.id}-${i}`]
    )
  }

  const completedCount = steps.filter((_, i) => isStepCompleted(i)).length

  return (
    <>
      <header className="app-header">
        <GitHubLogo />
        <h1>EMU Configuration Guide</h1>
        <a
          href={withDataResidency
            ? 'https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/getting-started-with-data-residency-for-github-enterprise-cloud'
            : 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/getting-started-with-enterprise-managed-users'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="header-link-btn"
        >
          <ExternalLinkIcon /> How to create EMU
        </a>
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

      <div className="wizard-layout">
        <SidebarLeft
          withDataResidency={withDataResidency}
          steps={steps}
          currentStep={currentStep}
          completedCount={completedCount}
          checkedItems={checkedItems}
          isStepCompleted={isStepCompleted}
          goTo={goTo}
          handleModeChange={handleModeChange}
        />

        <StepContent
          step={step}
          currentStep={currentStep}
          totalSteps={steps.length}
          checkedItems={checkedItems}
          toggleCheck={toggleCheck}
          clearChecked={clearChecked}
          isStepCompleted={isStepCompleted(currentStep)}
          goTo={goTo}
        />

        <SidebarRight
          config={config}
          updateConfig={updateConfig}
          withDataResidency={withDataResidency}
          enterpriseName={enterpriseName}
          setEnterpriseName={setEnterpriseName}
          step={step}
        />
      </div>
    </>
  )
}
