import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Form, Button } from 'react-bootstrap'
import { Formik } from 'formik'
import profanityFilter from '../../utils/profanityFilter'
import addChannelSchema from '../../schemas/addChannelSchema'

const AddChannelModal = ({ show, onHide, onAddChannel, channelNames }) => {
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  const handleSubmit = async (values, { setSubmitting, resetForm, setErrors }) => {
    try {
      const cleanName = profanityFilter.clean(values.name)

      await onAddChannel(cleanName)
      resetForm()
      onHide()
    }
    catch (err) {
      setErrors({
        name: err?.message || t('modals.addChannel.error'),
      })
    }
    finally {
      setSubmitting(false)
    }
  }
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel.title')}</Modal.Title>
      </Modal.Header>

      <Formik
        initialValues={{ name: '' }}
        validationSchema={addChannelSchema(t, channelNames)}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('channels.newChannelName')}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={Boolean(touched.name && errors.name)}
                  ref={inputRef}
                  disabled={isSubmitting}
                  autoComplete="off"
                  aria-label="Имя канала"
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                {t('cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t('save')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddChannelModal
