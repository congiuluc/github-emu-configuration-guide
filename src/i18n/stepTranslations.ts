import { useState, useEffect } from 'react'
import type { WizardStep, SubStep, EmailTemplate } from '../wizardData'
import i18n from '../i18n'

export interface StepTranslation {
  title: string
  shortTitle: string
  description: string
  prerequisites?: string[]
  warnings?: string[]
  tips?: string[]
  notes?: string[]
  substeps: SubStepTranslation[]
}

export interface SubStepTranslation {
  action: string
  verification: string
  details?: string[]
  emailTemplate?: EmailTemplateTranslation
}

export interface EmailTemplateTranslation {
  subject: string
  greeting: string
  intro: string
  sections: { heading: string; lines: string[] }[]
  closing: string[]
}

type StepTranslations = Record<string, StepTranslation>

const translationModules: Record<string, () => Promise<{ default: StepTranslations }>> = {
  it: () => import('./steps/it.json'),
  fr: () => import('./steps/fr.json'),
  de: () => import('./steps/de.json'),
}

const cache: Record<string, StepTranslations> = {}
const listeners: Set<() => void> = new Set()

export function onStepTranslationsLoaded(cb: () => void): () => void {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

export async function loadStepTranslations(lang: string): Promise<void> {
  if (lang === 'en' || cache[lang]) return
  const loader = translationModules[lang]
  if (!loader) return
  const mod = await loader()
  cache[lang] = mod.default
  listeners.forEach(cb => cb())
}

export function translateSteps(steps: WizardStep[], enterpriseName?: string): WizardStep[] {
  const lang = i18n.language
  if (lang === 'en') return steps

  const translations = cache[lang]
  if (!translations) return steps

  const r = enterpriseName
    ? (s: string) => s.replaceAll('YOUR-ENTERPRISE', enterpriseName)
    : (s: string) => s

  return steps.map(step => translateStep(step, translations, r))
}

function translateStep(step: WizardStep, translations: StepTranslations, r: (s: string) => string): WizardStep {
  const tr = translations[step.id]
  if (!tr) return step

  const substeps: SubStep[] = step.substeps.map((sub, i) => {
    const subTr = tr.substeps?.[i]
    if (!subTr) return sub

    const translated: SubStep = {
      ...sub,
      action: r(subTr.action || sub.action),
      verification: r(subTr.verification || sub.verification),
    }

    if (subTr.details && subTr.details.length > 0) {
      translated.details = subTr.details.map(r)
    }

    if (subTr.emailTemplate && sub.emailTemplate) {
      translated.emailTemplate = {
        ...sub.emailTemplate,
        subject: r(subTr.emailTemplate.subject || sub.emailTemplate.subject),
        greeting: r(subTr.emailTemplate.greeting || sub.emailTemplate.greeting),
        intro: r(subTr.emailTemplate.intro || sub.emailTemplate.intro),
        sections: (subTr.emailTemplate.sections || sub.emailTemplate.sections).map(
          (sec: { heading: string; lines: string[] }) => ({ ...sec, heading: r(sec.heading), lines: sec.lines.map(r) })
        ),
        closing: (subTr.emailTemplate.closing || sub.emailTemplate.closing).map(r),
      } as EmailTemplate
    }

    return translated
  })

  return {
    ...step,
    title: r(tr.title || step.title),
    shortTitle: r(tr.shortTitle || step.shortTitle),
    description: r(tr.description || step.description),
    substeps,
    prerequisites: (tr.prerequisites || step.prerequisites)?.map(r),
    warnings: (tr.warnings || step.warnings)?.map(r),
    tips: (tr.tips || step.tips)?.map(r),
    notes: (tr.notes || step.notes)?.map(r),
  }
}

/** Hook to force re-render when async step translations finish loading */
export function useStepTranslationsReady(): number {
  const [rev, setRev] = useState(0)
  useEffect(() => {
    return onStepTranslationsLoaded(() => setRev(r => r + 1))
  }, [])
  return rev
}
