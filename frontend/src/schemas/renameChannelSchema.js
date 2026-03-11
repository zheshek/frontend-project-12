import * as yup from 'yup'

const renameChannelSchema = (t, channelNames, currentName) =>
  yup.object().shape({
    name: yup
      .string()
      .required(t('channels.errors.required'))
      .min(3, t('channels.errors.nameLength'))
      .max(20, t('channels.errors.nameLength'))
      .notOneOf(
        channelNames.filter(n => n !== currentName),
        t('channels.errors.nameExists'),
      ),
  })

export default renameChannelSchema
