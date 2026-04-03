import { useState, useEffect, useCallback, useRef } from 'react'

interface TourStep {
  target: string          // CSS selector for the element to highlight
  title: string
  content: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

const tourSteps: TourStep[] = [
  {
    target: '.sidebar-mode-toggle',
    title: 'Deployment Mode',
    content: 'Switch between Data Residency (GHE.com) and Standard (github.com) Enterprise configurations. This changes all steps and URLs accordingly.',
    placement: 'right',
  },
  {
    target: '.sidebar-steps-section',
    title: 'Step Navigation',
    content: 'Track your progress through the guide. Each step has sub-tasks — the progress counter shows how many you\'ve verified. Click any step to jump to it.',
    placement: 'right',
  },
  {
    target: '.sidebar-right .sidebar-section:has(.sidebar-idp-toggle)',
    title: 'Configuration Panel',
    content: 'Change your Identity Provider (Entra ID / Okta), SSO protocol, and toggle optional sections like Copilot, Organizations, and GHAS at any time.',
    placement: 'left',
  },
  {
    target: '.sidebar-enterprise-input',
    title: 'Enterprise Name',
    content: 'Enter your enterprise name here — all URLs and links throughout the guide will update automatically with your actual enterprise values.',
    placement: 'left',
  },
  {
    target: '.sidebar-urls',
    title: 'Enterprise URLs',
    content: 'Your generated enterprise URLs (SSO, SCIM, ACS, etc.) appear here. Click the copy icon on any URL to copy it to your clipboard.',
    placement: 'left',
  },
  {
    target: '.substeps-list',
    title: 'Step-by-Step Instructions',
    content: 'Each step has detailed sub-tasks. Click to expand, follow the instructions, then check the verification box to mark it complete.',
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

  const findElement = useCallback((selector: string): Element | null => {
    let el = document.querySelector(selector)
    if (!el && fallbackSelectors[selector]) {
      el = document.querySelector(fallbackSelectors[selector])
    }
    return el
  }, [])

  const positionTooltip = useCallback(() => {
    const step = tourSteps[currentStep]
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
    const step = tourSteps[currentStep]
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
    while (next >= 0 && next < tourSteps.length) {
      if (findElement(tourSteps[next].target)) return next
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

  const step = tourSteps[currentStep]
  const stepNum = currentStep + 1
  const total = tourSteps.length

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
          <h4 className="tour-tooltip-title">{step.title}</h4>
          <button className="tour-tooltip-close" onClick={endTour} title="Close tour">&times;</button>
        </div>
        <p className="tour-tooltip-content">{step.content}</p>
        <div className="tour-tooltip-actions">
          <button
            className="tour-btn-secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            ← Back
          </button>
          <div className="tour-dots">
            {tourSteps.map((_, i) => (
              <span key={i} className={`tour-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`} />
            ))}
          </div>
          <button className="tour-btn-primary" onClick={handleNext}>
            {stepNum === total ? 'Finish' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  )
}
