import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Form, Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage = () => {
  const { t } = useTranslation(); // 👈 ХУК ЗДЕСЬ
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // 👇 validationSchema ВНУТРИ компонента, после хука
  const validationSchema = yup.object().shape({
    username: yup
      .string()
      .required(t('auth.errors.required'))
      .min(3, t('auth.errors.usernameLength'))
      .max(20, t('auth.errors.usernameLength')),
    password: yup
      .string()
      .required(t('auth.errors.required'))
      .min(6, t('auth.errors.passwordLength')),
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    await dispatch(login(values));
    setSubmitting(false);
  };

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">{t('auth.login')}</h2>
              
              {error && (
                <Alert 
                  variant="danger" 
                  onClose={() => dispatch(clearError())} 
                  dismissible
                >
                  {error}
                </Alert>
              )}

              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
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
                  <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="username">
                      <Form.Label>{t('auth.loginUsername')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.username && errors.username}
                        placeholder={t('auth.username')}
                        autoComplete="username"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="password">
                      <Form.Label>{t('auth.password')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.password && errors.password}
                        placeholder={t('auth.password')}
                        autoComplete="current-password"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        disabled={loading || isSubmitting}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            {t('auth.loggingIn')}
                          </>
                        ) : (
                          t('auth.loginButton')
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <span className="text-muted">{t('auth.noAccount')} </span>
                      <Link to="/signup">{t('auth.signup')}</Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;