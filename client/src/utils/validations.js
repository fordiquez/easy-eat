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

export const numericErrors = (number, model, between) => {
  const errors = []
  if (number.$dirty) {
    !number.required && errors.push(`${model} field is required`)
    !number.hasNumerics && errors.push(`${model} must be a numeric`)
    !number.between && errors.push(`Please enter a number between ${between[0]} and ${between[1]}`)
  }
  return errors
}

export const birthdayDateErrors = (birthdayDate, range) => {
  const errors = []
  if (birthdayDate.$dirty) {
    !birthdayDate.required && errors.push('Birthday date field is required')
    !birthdayDate.rangeDate && errors.push(`Please select a birthday date between ${range[0]} and ${range[1]}`)
  }
  return errors
}

export const rangeDate = value => {
  const maxDate = new Date().toISOString().slice(0, 10)
  const minDate = new Date('1922-02-22').toISOString().slice(0, 10)
  return value > minDate && value < maxDate
}

export const sexErrors = (sex) => {
  const errors = []
  if (!['male', 'female'].includes(sex.$model)) {
    !sex.required && errors.push('Sex field is required')
  }
  return errors
}

export const hasUppercase = val => /[A-Z]/.test(val)
export const hasLowercase = val => /[a-z]/.test(val)
export const hasSpecialChars = val => /[$%#]/.test(val)
export const hasNumerics = val => /\d/.test(val)
