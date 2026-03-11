import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Container, Button } from 'react-bootstrap'
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

  const handleBrandClick = (e) => {
    e.preventDefault()
    if (isAuthenticated) {
      navigate('/')
    }
    else {
      navigate('/login')
    }
  }

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <span className="badge bg-success me-2">● Online</span>
      case 'reconnecting':
        return <span className="badge bg-warning text-dark me-2">⟳ Reconnecting</span>
      case 'disconnected':
        return <span className="badge bg-danger me-2">○ Offline</span>
      default:
        return null
    }
  }

  return (
    <Navbar bg="primary" variant="dark" className="flex-shrink-0">
      <Container fluid>
        <Navbar.Brand
          onClick={handleBrandClick}
          style={{ cursor: 'pointer' }}
        >
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
                <>
                  <Link to="/login" className="text-white text-decoration-none me-3">
                    {t('header.login')}
                  </Link>
                      <Link to="/signup" className="text-white text-decoration-none">
                Регистрация
                      </Link>
                </>
              )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
