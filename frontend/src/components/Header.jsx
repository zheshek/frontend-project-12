import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar, Container, Button, Badge } from 'react-bootstrap'
import { logout } from '../store/slices/authSlice'

const Header = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { connectionStatus } = useSelector((state) => state.messages)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          {t('appName')}
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated ? (
            <div className="d-flex align-items-center">
              {connectionStatus === 'connected' && (
                <Badge bg="success" className="me-3">
                  ● {t('header.online')}
                </Badge>
              )}
              {connectionStatus === 'disconnected' && (
                <Badge bg="warning" text="dark" className="me-3">
                  ○ {t('header.offline')}
                </Badge>
              )}
              <span className="text-white me-3">{user?.username}</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                {t('header.logout')}
              </Button>
            </div>
          ) : (
            <Navbar.Text>
              <Link to="/login" className="text-white text-decoration-none">
                {t('header.login')}
              </Link>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
