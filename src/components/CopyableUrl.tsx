import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CopyIcon } from './Icons'

export function CopyableUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useTranslation()
  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <span className="copyable-url">
      <code>{url}</code>
      <button onClick={handleCopy} className="copy-btn" title={t('common.copyToClipboard')}>
        {copied ? '✓' : <CopyIcon />}
      </button>
    </span>
  )
}
