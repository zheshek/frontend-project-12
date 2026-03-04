import * as Yup from 'yup'

const signupSchema = Yup.object({
  username: Yup.string()
    .min(3)
    .max(20)
    .required(),
  password: Yup.string()
    .min(6)
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null])
    .required(),
})

export default signupSchema