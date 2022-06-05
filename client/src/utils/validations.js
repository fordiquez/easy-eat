export const firstNameErrors = firstName => {
  const errors = []
  if (firstName.$dirty) {
    !firstName.required && errors.push('First Name is required')
    !firstName.alpha && errors.push('First Name must contain only alphabetic characters')
    !firstName.minLength && errors.push('First Name must have at least 2 symbols')
  }
  return errors
}

export const lastNameErrors = lastName => {
  const errors = []
  if (lastName.$dirty) {
    !lastName.required && errors.push('Last Name is required')
    !lastName.alpha && errors.push('Last Name must contain only alphabetic characters')
    !lastName.minLength && errors.push('Last Name must have at least 2 symbols')
  }
  return errors
}

export const emailErrors = email => {
  const errors = []
  if (email.$dirty) {
    !email.email && errors.push('Must be valid e-mail')
    !email.required && errors.push('Email is required')
  }
  return errors
}

export const passwordErrors = password => {
  const errors = []
  if (password.$dirty) {
    !password.required && errors.push('Password is required')
    password.minLength !== undefined ? !password.minLength && errors.push('Password must have at least 6 symbols') : null
    password.hasNumerics !== undefined ? !password.hasNumerics && errors.push('Password must contain at least 1 digit') : null
  }
  return errors
}

export const passwordConfirmErrors = passwordConfirm => {
  const errors = []
  if (passwordConfirm.$dirty) {
    !passwordConfirm.required && errors.push('You must confirm your password')
    !passwordConfirm.sameAs && errors.push('Passwords must be identical')
    !passwordConfirm.minLength && errors.push('Password must have at least 6 symbols')
    !passwordConfirm.hasNumerics && errors.push('Password must contain at least 1 digit')
  }
  return errors
}

export const acceptedTermsErrors = acceptedTerms => {
  const errors = []
  if (acceptedTerms.$dirty) {
    !acceptedTerms.sameAs && errors.push('You don\'t have a choice, you eat it')
  }
  return errors
}

export const roleErrors = role => {
  const errors = []
  if (role.$dirty) {
    !role.required && errors.push('Role is required')
  }
  return errors
}

export const numericErrors = (number, model, range) => {
  const errors = []
  if (number.$dirty) {
    if (number.params?.required) !number.required && errors.push(`${model} field is required`)
    !number.hasNumerics && errors.push(`${model} must be a numeric`)
    !number.minValue && errors.push(`A number must be more or equal ${range[0]}`)
    !number.maxValue && errors.push(`A number must be lower or equal ${range[1]}`)
  }
  return errors
}

export const birthdayDateErrors = (birthdayDate, range) => {
  const errors = []
  if (birthdayDate.$dirty) {
    if (birthdayDate.$params?.required) !birthdayDate.required && errors.push('Birthday date is required')
    if (birthdayDate.$params.rangeDate) !birthdayDate.rangeDate && errors.push(`Please select a birthday date between ${range[0]} and ${range[1]}`)
  }
  return errors
}

export const rangeDate = value => {
  const maxDate = new Date().toISOString().slice(0, 10)
  const minDate = new Date('1922-02-22').toISOString().slice(0, 10)
  return value > minDate && value < maxDate
}

export const sexErrors = sex => {
  const errors = []
  if (!['male', 'female'].includes(sex.$model)) {
    !sex.required && errors.push('Sex field is required')
  }
  return errors
}

export const foodString = (string, displayedTitle) => {
  const errors = []
  if (string.$dirty) {
    !string.required && errors.push(`${displayedTitle} field is required`)
    string.hasNotSpecialChars || string.hasNotNumerics && errors.push(`${displayedTitle} field accepts only alphabet characters`)
  }
  return errors
}

export const foodImage = image => {
  const errors = []
  if (image.$dirty) {
    !image.required && errors.push('Food image field is required')
    !image.url && errors.push('Food image must be a URL')
  }
  return errors
}

export const foodNumerics = (numeric, displayedTitle, minValue) => {
  const errors = []
  if (numeric.$dirty) {
    !numeric.required && errors.push(`${displayedTitle} field is required`)
    !numeric.numeric && errors.push(`${displayedTitle} must be a numeric`)
    if (numeric.params?.minValue) !numeric.minValue && errors.push(`${displayedTitle} should be equal or greater than ${minValue}`)
  }
  return errors
}

export const hasUppercase = val => /[A-Z]/.test(val)
export const hasLowercase = val => /[a-z]/.test(val)
export const hasSpecialChars = val => /[!@#$%^&*()\\/<>|"№;:?+-=']/.test(val)
export const hasNumerics = val => /\d/.test(val)
export const hasNotSpecialChars = val => !/[!@#$%^&*()\\/<>|"№;:?+-=']/.test(val)
export const hasNotNumerics = val => !/\d/.test(val)
