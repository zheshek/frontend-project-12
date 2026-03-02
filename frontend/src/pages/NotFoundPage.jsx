import { useTranslation } from 'react-i18next'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  const { t } = useTranslation()

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={6} className="text-center">
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">{t('errors.pageNotFound')}</h2>
          <p className="text-muted mb-4">
            {t('errors.unknownError')}
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            {t('errors.goHome')}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFoundPage
