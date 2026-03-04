import * as yup from 'yup'

const loginSchema = t =>
  yup.object().shape({
    username: yup
      .string()
      .required(t('auth.errors.required'))
      .min(3, t('auth.errors.usernameLength'))
      .max(20, t('auth.errors.usernameLength')),
    password: yup
      .string()
      .required(t('auth.errors.required'))
      .min(3, t('auth.errors.passwordLength')),
  })

export default loginSchema