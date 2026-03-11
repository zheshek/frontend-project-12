import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Container, Button, Badge } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../store/slices/authSlice'

const Header = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const { connectionStatus } = useSelector(state => state.messages)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <Badge bg="success" className="me-2">
            ● Online
          </Badge>
        )
      case 'reconnecting':
        return (
          <Badge bg="warning" text="dark" className="me-2">
            ⟳ Reconnecting
          </Badge>
        )
      case 'disconnected':
        return (
          <Badge bg="danger" className="me-2">
            ○ Offline
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <Navbar bg="primary" variant="dark" className="flex-shrink-0">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Hexlet Chat
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated
            ? (
                <>
                  {getStatusBadge()}
                  <span className="text-white me-3">
                    <strong>{user?.username}</strong>
                  </span>
                  <Button variant="outline-light" size="sm" onClick={handleLogout}>
                    {t('header.logout')}
                  </Button>
                </>
              )
            : (
                <div>
                  <Link to="/login" className="text-white text-decoration-none me-3">
                    {t('header.login')}
                  </Link>
                  <Link to="/signup" className="text-white text-decoration-none">
                    {t('header.signup')}
                  </Link>
                </div>
              )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
