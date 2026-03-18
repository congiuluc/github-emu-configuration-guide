import { CopyableUrl } from '../components/CopyableUrl'

export function renderText(text: string) {
  // Split on URLs first
  const urlRegex = /(https:\/\/[^\s,)]+)/g
  const parts = text.split(urlRegex)

  const elements = parts.map((part, i) => {
    if (urlRegex.test(part)) {
      return <CopyableUrl key={i} url={part} />
    }
    // Handle **bold** within text fragments
    const boldRegex = /\*\*(.+?)\*\*/g
    const boldParts = part.split(boldRegex)
    if (boldParts.length === 1) return <span key={i}>{part}</span>
    return (
      <span key={i}>
        {boldParts.map((bp, j) =>
          j % 2 === 1 ? <strong key={j}>{bp}</strong> : <span key={j}>{bp}</span>
        )}
      </span>
    )
  })

  return elements.length === 1 ? elements[0] : elements
}
