export const validationRules = (property, displayedTitle, { minValue, maxValue, minLength, range, sameAs }) => {
  const errors = []
  if (property.$dirty) {
    if (property.$params?.required) !property.required && errors.push(`${displayedTitle} is required`)
    if (property.$params?.alpha) !property.alpha && errors.push(`${displayedTitle} must contain only alphabetic characters`)
    if (property.$params?.numeric) !property.numeric && errors.push(`${displayedTitle} must be a numeric`)
    if (property.$params?.minValue) !property.minValue && errors.push(`${displayedTitle} should be equal or greater than ${minValue}`)
    if (property.$params?.maxValue) !property.maxValue && errors.push(`${displayedTitle} should be equal or lower than ${maxValue}`)
    if (property.$params?.minLength) !property.minLength && errors.push(`${displayedTitle} must have at least ${minLength} symbols`)
    if (property.$params?.url) {
      !property.url && errors.push(`${displayedTitle} must be a URL`)
      !isImgUrl(property.$model) && errors.push(`${displayedTitle} must be one of image types (.jpg, .jpeg, .png, .gif, .tiff, .bmp)`)
    }
    if (property.$params?.email) !property.email && errors.push(`${displayedTitle} must be a valid`)
    if (property.$params?.sameAs) !property.sameAs && errors.push(sameAs)
    if (property.$params?.rangeDate === null) !property.rangeDate && errors.push(`${displayedTitle} should be between ${range[0]} and ${range[1]}`)
    if (property.$params?.hasNumerics === null) !property.hasNumerics && errors.push(`${displayedTitle} must contain at least 1 digit`)
  }
  return errors
}

const isImgUrl = url => typeof url !== 'string' ? false : (url.match(/^http[^?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gmi) !== null)

export const rangeDate = value => {
  const maxDate = new Date().toISOString().slice(0, 10)
  const minDate = new Date('1922-02-22').toISOString().slice(0, 10)
  return value > minDate && value < maxDate
}

export const hasUppercase = val => /[A-Z]/.test(val)
export const hasLowercase = val => /[a-z]/.test(val)
export const hasSpecialChars = val => /[!@#$%^&*()\\/<>|"№;:?+-=']/.test(val)
export const hasNumerics = val => /\d/.test(val)
