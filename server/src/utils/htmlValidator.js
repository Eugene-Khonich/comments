export function isValidXHTML(input) {
  const allowedTags = ['a', 'code', 'i', 'strong']
  const tagStack = []
  const tagRegex = /<\/?([a-z]+)[^>]*>/gi
  let match

  while ((match = tagRegex.exec(input))) {
    const [, tag] = match
    const lowerTag = tag.toLowerCase()

    if (!allowedTags.includes(lowerTag)) continue

    if (match[0][1] === '/') {
      if (tagStack.pop() !== lowerTag) {
        return false
      }
    } else {
      tagStack.push(lowerTag)
    }
  }

  return tagStack.length === 0
}
