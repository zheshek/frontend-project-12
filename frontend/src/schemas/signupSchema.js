import * as Yup from 'yup'

export const getSignupSchema = t =>
  Yup.object({
    username: Yup.string()
      .min(3, t('auth.errors.usernameLength'))
      .max(20, t('auth.errors.usernameLength'))
      .required(t('auth.errors.required')),
    password: Yup.string()
      .min(5, t('auth.errors.passwordLength'))
      .required(t('auth.errors.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('auth.errors.passwordsMustMatch'))
      .required(t('auth.errors.required')),
  })
