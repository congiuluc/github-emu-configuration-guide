import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface TourStep {
  target: string          // CSS selector for the element to highlight
  titleKey: string
  contentKey: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const tourStepDefs: TourStep[] = [
  {
    target: '.sidebar-mode-toggle',
    titleKey: 'tour.deploymentMode',
    contentKey: 'tour.deploymentModeContent',
    placement: 'right',
  },
  {
    target: '.sidebar-steps-section',
    titleKey: 'tour.stepNavigation',
    contentKey: 'tour.stepNavigationContent',
    placement: 'right',
  },
  {
    target: '.sidebar-right .sidebar-section:has(.sidebar-idp-toggle)',
    titleKey: 'tour.configPanel',
    contentKey: 'tour.configPanelContent',
    placement: 'left',
  },
  {
    target: '.sidebar-enterprise-input',
    titleKey: 'tour.enterpriseName',
    contentKey: 'tour.enterpriseNameContent',
    placement: 'left',
  },
  {
    target: '.sidebar-urls',
    titleKey: 'tour.enterpriseUrls',
    contentKey: 'tour.enterpriseUrlsContent',
    placement: 'left',
  },
  {
    target: '.substeps-list',
    titleKey: 'tour.stepInstructions',
    contentKey: 'tour.stepInstructionsContent',
    placement: 'top',
  },
]

// Fallback selector if :has() isn't supported or element not found
const fallbackSelectors: Record<string, string> = {
  '.sidebar-right .sidebar-section:has(.sidebar-idp-toggle)': '.sidebar-right .sidebar-section',
}

interface TourProps {
  active: boolean
  onEnd: () => void
}

export function Tour({ active, onEnd }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const [arrowClass, setArrowClass] = useState('')
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const findElement = useCallback((selector: string): Element | null => {
    let el = document.querySelector(selector)
    if (!el && fallbackSelectors[selector]) {
      el = document.querySelector(fallbackSelectors[selector])
    }
    return el
  }, [])

  const positionTooltip = useCallback(() => {
    const step = tourStepDefs[currentStep]
    if (!step) return

    const el = findElement(step.target)
    if (!el) return

    const rect = el.getBoundingClientRect()
    const tooltip = tooltipRef.current
    if (!tooltip) return

    const tooltipRect = tooltip.getBoundingClientRect()
    const gap = 14
    const placement = step.placement || 'bottom'

    let top = 0
    let left = 0

    switch (placement) {
      case 'right':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2
        left = rect.right + gap
        break
      case 'left':
        top = rect.top + rect.height / 2 - tooltipRect.height / 2
        left = rect.left - tooltipRect.width - gap
        break
      case 'top':
        top = rect.top - tooltipRect.height - gap
        left = rect.left + rect.width / 2 - tooltipRect.width / 2
        break
      case 'bottom':
        top = rect.bottom + gap
        left = rect.left + rect.width / 2 - tooltipRect.width / 2
        break
    }

    // Clamp within viewport
    top = Math.max(8, Math.min(top, window.innerHeight - tooltipRect.height - 8))
    left = Math.max(8, Math.min(left, window.innerWidth - tooltipRect.width - 8))

    setTooltipStyle({ top, left })
    setArrowClass(`tour-arrow-${placement}`)
  }, [currentStep, findElement])

  useEffect(() => {
    if (!active) return

    // Highlight element
    const step = tourStepDefs[currentStep]
    if (!step) return

    const el = findElement(step.target)
    if (el) {
      (el as HTMLElement).classList.add('tour-highlight')
      // Promote the sticky parent so the highlight escapes its stacking context
      const stickyParent = (el as HTMLElement).closest('.sidebar-left, .sidebar-right, .app-header')
      if (stickyParent) {
        (stickyParent as HTMLElement).classList.add('tour-highlight-container')
      }
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }

    // Small delay for DOM to settle before positioning
    const timer = setTimeout(positionTooltip, 100)

    return () => {
      clearTimeout(timer)
      if (el) {
        (el as HTMLElement).classList.remove('tour-highlight')
        const stickyParent = (el as HTMLElement).closest('.sidebar-left, .sidebar-right, .app-header')
        if (stickyParent) {
          (stickyParent as HTMLElement).classList.remove('tour-highlight-container')
        }
      }
    }
  }, [active, currentStep, findElement, positionTooltip])

  // Reposition on resize
  useEffect(() => {
    if (!active) return
    const handleResize = () => positionTooltip()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [active, positionTooltip])

  // Skip steps whose target doesn't exist
  const getNextValidStep = (from: number, direction: 1 | -1): number => {
    let next = from + direction
    while (next >= 0 && next < tourStepDefs.length) {
      if (findElement(tourStepDefs[next].target)) return next
      next += direction
    }
    return -1
  }

  const handleNext = () => {
    const next = getNextValidStep(currentStep, 1)
    if (next === -1) {
      endTour()
    } else {
      setCurrentStep(next)
    }
  }

  const handlePrev = () => {
    const prev = getNextValidStep(currentStep, -1)
    if (prev !== -1) setCurrentStep(prev)
  }

  const endTour = () => {
    setCurrentStep(0)
    onEnd()
  }

  // ESC to close
  useEffect(() => {
    if (!active) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') endTour()
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, currentStep])

  if (!active) return null

  const step = tourStepDefs[currentStep]
  const stepNum = currentStep + 1
  const total = tourStepDefs.length

  return (
    <>
      <div className="tour-overlay" onClick={endTour} />
      <div
        ref={tooltipRef}
        className={`tour-tooltip ${arrowClass}`}
        style={tooltipStyle}
      >
        <div className="tour-tooltip-header">
          <span className="tour-tooltip-step-badge">{stepNum}/{total}</span>
          <h4 className="tour-tooltip-title">{t(step.titleKey)}</h4>
          <button className="tour-tooltip-close" onClick={endTour} title={t('tour.closeTour')}>&times;</button>
        </div>
        <p className="tour-tooltip-content">{t(step.contentKey)}</p>
        <div className="tour-tooltip-actions">
          <button
            className="tour-btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            {t('tour.back')}
          </button>
          <div className="tour-dots">
            {tourStepDefs.map((_, i) => (
              <span key={i} className={`tour-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`} />
            ))}
          </div>
          <button className="tour-btn-primary" onClick={handleNext}>
            {stepNum === total ? t('tour.finish') : t('tour.next')}
          </button>
        </div>
      </div>
    </>
  )
}
