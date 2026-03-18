import { CopyableUrl } from '../components/CopyableUrl'

export function renderText(text: string) {
  const urlRegex = /(https:\/\/[^\s,)]+)/g
  const parts = text.split(urlRegex)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    urlRegex.test(part)
      ? <CopyableUrl key={i} url={part} />
      : <span key={i}>{part}</span>
  )
}
