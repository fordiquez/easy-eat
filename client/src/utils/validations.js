export const firstNameErrors = (firstName) => {
  const errors = []
  if (firstName.$dirty) {
    !firstName.required && errors.push('First Name is required')
    !firstName.alpha && errors.push('First Name must contain only alphabetic characters')
    !firstName.minLength && errors.push('First Name must have at least 2 symbols')
  }
  return errors
}

export const lastNameErrors = (lastName) => {
  const errors = []
  if (lastName.$dirty) {
    !lastName.required && errors.push('Last Name is required')
    !lastName.alpha && errors.push('Last Name must contain only alphabetic characters')
    !lastName.minLength && errors.push('Last Name must have at least 2 symbols')
  }
  return errors
}

export const emailErrors = (email) => {
  const errors = []
  if (email.$dirty) {
    !email.email && errors.push('Must be valid e-mail')
    !email.required && errors.push('Email is required')
  }
  return errors
}

export const passwordErrors = (password) => {
  const errors = []
  if (password.$dirty) {
    !password.required && errors.push('Password is required')
    password.minLength !== undefined ? !password.minLength && errors.push('Password must have at least 6 symbols') : null
    password.hasNumerics !== undefined ? !password.hasNumerics && errors.push('Password must contain at least 1 digit') : null
  }
  return errors
}

export const passwordConfirmErrors = (passwordConfirm) => {
  const errors = []
  if (passwordConfirm.$dirty) {
    !passwordConfirm.required && errors.push('You must confirm your password')
    !passwordConfirm.sameAs && errors.push('Passwords must be identical')
    !passwordConfirm.minLength && errors.push('Password must have at least 6 symbols')
    !passwordConfirm.hasNumerics && errors.push('Password must contain at least 1 digit')
  }
  return errors
}

export const acceptedTermsErrors = (acceptedTerms) => {
  const errors = []
  if (acceptedTerms.$dirty) {
    !acceptedTerms.sameAs && errors.push('You don\'t have a choice, you eat it')
  }
  return errors
}

export const roleErrors = (role) => {
  const errors = []
  if (role.$dirty) {
    !role.required && errors.push('Role is required')
  }
  return errors
}

export const hasUppercase = val => /[A-Z]/.test(val)
export const hasLowercase = val => /[a-z]/.test(val)
export const hasSpecialChars = val => /[$%#]/.test(val)
export const hasNumerics = val => /[\d]/.test(val)
