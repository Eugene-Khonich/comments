import xss from 'xss'

export default function sanitizeComment(input) {
  return xss(input, {
    whiteList: {
      a: ['href', 'title'],
      code: [],
      i: [],
      strong: [],
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  })
}
