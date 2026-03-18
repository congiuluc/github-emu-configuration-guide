interface SidebarLeftProps {
  withDataResidency: boolean
  steps: Array<{ id: string; shortTitle: string; substeps: unknown[] }>
  currentStep: number
  completedCount: number
  checkedItems: Record<string, boolean>
  isStepCompleted: (index: number) => boolean
  goTo: (index: number) => void
  handleModeChange: (dr: boolean) => void
}

export function SidebarLeft({
  withDataResidency,
  steps,
  currentStep,
  completedCount,
  checkedItems,
  isStepCompleted,
  goTo,
  handleModeChange,
}: SidebarLeftProps) {
  return (
    <aside className="sidebar sidebar-left">
      <div className="sidebar-section">
        <h3 className="sidebar-heading">Deployment Mode</h3>
        <div className="sidebar-mode-toggle">
          <button
            className={`sidebar-mode-btn ${withDataResidency ? 'active' : ''}`}
            onClick={() => handleModeChange(true)}
          >
            <span className="sidebar-mode-icon">🌍</span>
            <span>Data Residency</span>
          </button>
          <button
            className={`sidebar-mode-btn ${!withDataResidency ? 'active' : ''}`}
            onClick={() => handleModeChange(false)}
          >
            <span className="sidebar-mode-icon">☁️</span>
            <span>Standard</span>
          </button>
        </div>
      </div>

      <div className="sidebar-section sidebar-steps-section">
        <h3 className="sidebar-heading">
          Steps
          <span className="sidebar-step-count">{completedCount}/{steps.length}</span>
        </h3>
        <nav className="sidebar-steps">
          {steps.map((s, i) => {
            const done = s.substeps
              ? (s.substeps as unknown[]).filter((_, j) => checkedItems[`${s.id}-${j}`]).length
              : 0
            const total = s.substeps ? s.substeps.length : 0
            return (
              <button
                key={s.id}
                className={`sidebar-step ${
                  i === currentStep ? 'active' : ''
                } ${isStepCompleted(i) ? 'completed' : ''}`}
                onClick={() => goTo(i)}
              >
                <span className="sidebar-step-num">
                  {isStepCompleted(i) ? '✓' : i}
                </span>
                <span className="sidebar-step-title">{s.shortTitle}</span>
                {total > 0 && (
                  <span className={`sidebar-step-progress ${done === total ? 'done' : ''}`}>
                    {done}/{total}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
