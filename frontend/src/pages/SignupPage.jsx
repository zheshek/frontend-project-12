import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from 'react-bootstrap'
import { Formik } from 'formik'
import { signup, clearError } from '../store/slices/authSlice'
import { getSignupSchema } from '../schemas/signupSchema'

const SignupPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, isAuthenticated } = useSelector(state => state.auth)

  const [localError, setLocalError] = useState(null) // ✅ локальная ошибка

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    return () => {
      dispatch(clearError())
      setLocalError(null)
    }
  }, [isAuthenticated, navigate, dispatch])

  const handleSubmit = async (values, { setSubmitting }) => {
    setLocalError(null)
    const { username, password } = values
    const result = await dispatch(signup({ username, password }))
    if (signup.rejected.match(result)) {
      setLocalError(
        result.payload === 'Conflict'
          ? t('auth.errors.userExists')
          : result.payload || t('auth.errors.unknown')
      )
    }
    setSubmitting(false)
  }

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">{t('auth.signup')}</h2>

              {/* ✅ Показываем локальную ошибку */}
              {localError && (
                <Alert variant="danger" onClose={() => setLocalError(null)} dismissible>
                  {localError}
                </Alert>
              )}

              <Formik
                initialValues={{
                  username: '',
                  password: '',
                  confirmPassword: '',
                }}
                validationSchema={getSignupSchema(t)}
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
                      <Form.Label>{t('auth.signupUsername')}</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={Boolean(touched.username && errors.username)}
                        autoComplete="off"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>{t('auth.password')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={Boolean(touched.password && errors.password)}
                        autoComplete="off"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="confirmPassword">
                      <Form.Label>{t('auth.confirmPassword')}</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                        autoComplete="off"
                        disabled={loading}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        size="lg"
                        disabled={loading || isSubmitting}
                      >
                        {loading && (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                        )}
                        {loading ? t('auth.signingUp') : t('auth.signupButton')}
                      </Button>
                    </div>

                    <div className="text-center mt-3">
                      <span className="text-muted">{t('auth.hasAccount')}{' '}</span>
                      <Link to="/login">{t('auth.login')}</Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default SignupPage
