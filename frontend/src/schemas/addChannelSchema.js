import * as yup from 'yup'

const addChannelSchema = (t, channelNames) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t('channels.errors.required'))
      .min(3, t('channels.errors.nameLength'))
      .max(20, t('channels.errors.nameLength'))
      .notOneOf(
        channelNames,
        t('channels.errors.nameExists'),
      ),
  })

export default addChannelSchema