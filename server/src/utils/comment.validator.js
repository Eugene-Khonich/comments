export function validateCommentInput({ userName, email, homePage, text }) {
  const errors = []

  if (!userName || !/^[a-zA-Z0-9]{3,20}$/.test(userName)) {
    errors.push('Invalid user name')
  }

  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    errors.push('Invalid email')
  }

  if (homePage && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(homePage)) {
    errors.push('Invalid home page URL')
  }

  if (!text || typeof text !== 'string' || text.length < 1) {
    errors.push('Text is required')
  }

  return errors
}
