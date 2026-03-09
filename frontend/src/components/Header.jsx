import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Container, Button, Badge } from 'react-bootstrap';
import { logout } from '../store/slices/authSlice';
import socketService from '../services/socket';
import { setConnectionStatus } from '../store/slices/messagesSlice';

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [status, setStatus] = useState('reconnecting'); // ⚡ при загрузке

  const handleLogout = () => {
    socketService.disconnect(); // сразу разрываем все подписки
    dispatch(logout());
    navigate('/login');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleConnect = () => { setStatus('connected'); dispatch(setConnectionStatus('connected')); };
    const handleDisconnect = () => { setStatus('disconnected'); dispatch(setConnectionStatus('disconnected')); };
    const handleReconnecting = () => { setStatus('reconnecting'); dispatch(setConnectionStatus('reconnecting')); };

    socketService.onConnect(handleConnect);
    socketService.onDisconnect(handleDisconnect);
    socketService.onReconnecting(handleReconnecting);

    socketService.connect();

    return () => {
      socketService.offConnect(handleConnect);
      socketService.offDisconnect(handleDisconnect);
      socketService.offReconnecting(handleReconnecting);
    };
  }, [dispatch, isAuthenticated]);

  const getBadgeProps = () => {
    switch (status) {
      case 'connected':
        return { bg: 'success', text: undefined, label: '● ' + t('header.online') };
      case 'reconnecting':
        return { bg: 'warning', text: 'dark', label: '… Reconnecting' };
      case 'disconnected':
      default:
        return { bg: 'danger', text: undefined, label: '○ ' + t('header.offline') };
    }
  };

  const badgeProps = getBadgeProps();

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="px-3">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">{t('appName')}</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated ? (
            <div className="d-flex align-items-center">
              <Badge bg={badgeProps.bg} text={badgeProps.text} className="me-3">
                {badgeProps.label}
              </Badge>
              <span className="text-white me-3">{user?.username}</span>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                {t('header.logout')}
              </Button>
            </div>
          ) : (
            <Navbar.Text>
              <Link to="/login" className="text-white text-decoration-none">{t('header.login')}</Link>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;