import { useState } from 'react'
import { CopyIcon } from './Icons'

export function CopyableUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <span className="copyable-url">
      <code>{url}</code>
      <button onClick={handleCopy} className="copy-btn" title="Copy to clipboard">
        {copied ? '✓' : <CopyIcon />}
      </button>
    </span>
  )
}
