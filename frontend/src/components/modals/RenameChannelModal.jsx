import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'

const RenameChannelModal = ({
  show,
  onHide,
  onRenameChannel,
  channel,
  channelNames,
}) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('channels.errors.required'))
      .min(3, t('channels.errors.nameLength'))
      .max(20, t('channels.errors.nameLength'))
      .notOneOf(
        channelNames.filter(n => n !== channel?.name),
        t('channels.errors.nameExists'),
      ),
  })

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors },
  ) => {
    try {
      await onRenameChannel({
        id: channel.id,
        name: values.name,
      }).unwrap()

      resetForm()
      onHide()
    } catch (err) {
      setErrors({
        name: err?.message || 'Failed to rename channel',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modals.renameChannel.title')}
        </Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: channel?.name || '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  {t('channels.newChannelName')}
                </Form.Label>

                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(touched.name && errors.name)}
                  ref={inputRef}
                  disabled={isSubmitting}
                  aria-label="Имя канала"
                />

                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={onHide}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>

              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {t('save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameChannelModal
