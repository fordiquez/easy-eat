const hasUppercase = val => /[A-Z]/.test(val)
const hasLowercase = val => /[a-z]/.test(val)
const hasSpecialChars = val => /[$%#]/.test(val)
const hasNumerics = val => /[\d]/.test(val)

export { hasUppercase, hasLowercase, hasSpecialChars, hasNumerics }
