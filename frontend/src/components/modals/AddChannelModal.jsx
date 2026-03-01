import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';

const AddChannelModal = ({ show, onHide, onAddChannel, channelNames }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('channels.errors.required'))
      .min(3, t('channels.errors.nameLength'))
      .max(20, t('channels.errors.nameLength'))
      .notOneOf(channelNames, t('channels.errors.nameExists')),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    try {
      await onAddChannel(values.name);
      resetForm();
      onHide();
    } catch (error) {
      if (error === 'Название канала содержит недопустимые слова') {
        setErrors({ name: t('profanity.channelNameError') });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel.title')}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>{t('channels.channelName')}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  id="channel-name-input" 
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={touched.name && errors.name}
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
              <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
                {t('cancel')}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('add') : t('add')}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default AddChannelModal;
