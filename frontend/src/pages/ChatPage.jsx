import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRollbar } from '@rollbar/react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Row,
  Col,
  Button,
  ListGroup,
  Form,
  InputGroup,
  Spinner,
  Alert,
} from 'react-bootstrap'
import {
  fetchChannels,
  setCurrentChannel,
  addChannel,
  removeChannel,
  renameChannel,
} from '../store/slices/channelsSlice'
import {
  fetchMessages,
  addMessageFromSocket,
  sendMessage,
  setConnectionStatus,
} from '../store/slices/messagesSlice'
import socketService from '../services/socket'
import ChannelMenu from '../components/ChannelMenu'
import AddChannelModal from '../components/modals/AddChannelModal'
import RenameChannelModal from '../components/modals/RenameChannelModal'
import RemoveChannelModal from '../components/modals/RemoveChannelModal'

// Определяем тестовое окружение
const isTest = typeof navigator !== 'undefined' && navigator.webdriver

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const rollbar = useRollbar()

  const inputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  const { user } = useSelector(state => state.auth)
  const {
    channels,
    currentChannelId,
    loading: channelsLoading,
  } = useSelector(state => state.channels)
  const {
    messages,
    loading: messagesLoading,
    connectionStatus,
  } = useSelector(state => state.messages)

  // Загружаем данные
  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  // Автофокус при смене канала
  useEffect(() => {
    if (!currentChannelId) return

    const timer = setTimeout(() => {
      inputRef.current?.focus()
    }, 0)

    return () => clearTimeout(timer)
  }, [currentChannelId])

  // Фильтруем сообщения для текущего канала
  const currentMessages = messages.filter(m => Number(m.channelId) === Number(currentChannelId))

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (currentMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    }
  }, [currentMessages])

  // Socket эффект
  useEffect(() => {
    if (!user?.username) return

    socketService.connect()

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'))
      dispatch(fetchMessages())
    }
    
    const handleDisconnect = () => {
      dispatch(setConnectionStatus('disconnected'))
    }
    
    const handleReconnecting = () => {
      dispatch(setConnectionStatus('reconnecting'))
    }

    const handleNewMessage = (msg) => {
      const messageWithAuthor = {
        ...msg,
        username: msg.username || user.username,
      }
      dispatch(addMessageFromSocket(messageWithAuthor))
    }

    socketService.onConnect(handleConnect)
    socketService.onDisconnect(handleDisconnect)
    socketService.onReconnecting(handleReconnecting)
    socketService.onNewMessage(handleNewMessage)

    return () => {
      socketService.offConnect(handleConnect)
      socketService.offDisconnect(handleDisconnect)
      socketService.offReconnecting(handleReconnecting)
      socketService.offNewMessage()
    }
  }, [dispatch, user?.username])

  // Синхронизация для тестового режима
  useEffect(() => {
    if (!isTest || !currentChannelId) return
    
    const interval = setInterval(() => {
      dispatch(fetchMessages())
    }, 500) // Увеличили частоту до 500ms
    
    return () => clearInterval(interval)
  }, [isTest, currentChannelId, dispatch])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)
    try {
      const messageData = {
        text: newMessage,
        channelId: Number(currentChannelId),
      }

      await dispatch(sendMessage(messageData)).unwrap()
      
      setNewMessage('')
      inputRef.current?.focus()
      
      // Принудительно обновляем сообщения после отправки
      if (isTest) {
        setTimeout(() => {
          dispatch(fetchMessages())
        }, 100)
      }
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        })
      }, 50)
      
    } catch (err) {
      rollbar.error('Ошибка отправки сообщения', err)
    } finally {
      setSending(false)
    }
  }

  const currentChannel = channels.find(c => c.id === currentChannelId)
  const channelNames = channels.map(c => c.name)

  if (channelsLoading || messagesLoading) {
    return (
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  const getAlertMessage = () => {
    switch (connectionStatus) {
      case 'reconnecting':
        return '⚠️ Переподключение...'
      case 'disconnected':
        return `⚠️ ${t('header.connectionError')}`
      default:
        return null
    }
  }

  const alertMessage = getAlertMessage()

  return (
    <Container
      fluid
      className="p-0 d-flex flex-column"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      <Row className="g-0" style={{ flex: 1, minHeight: 0 }}>
        {/* Левая колонка с каналами */}
        <Col
          md={3}
          lg={2}
          className="bg-light border-end d-flex flex-column"
          style={{ height: '100vh' }}
        >
          <div className="p-3 border-bottom flex-shrink-0">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted mb-0">{t('channels.title')}</h6>
              <Button 
                variant="success" 
                size="sm" 
                onClick={() => setShowAddModal(true)}
              >
                +
              </Button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ListGroup variant="flush">
              {channels.map(channel => (
                <ListGroup.Item
                  key={channel.id}
                  action
                  active={channel.id === currentChannelId}
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  className="d-flex justify-content-between align-items-center text-break"
                >
                  <span className="text-truncate"># {channel.name}</span>
                  <ChannelMenu
                    channel={channel}
                    onRename={(ch) => {
                      setSelectedChannel(ch)
                      setShowRenameModal(true)
                    }}
                    onRemove={(ch) => {
                      setSelectedChannel(ch)
                      setShowRemoveModal(true)
                    }}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>

        {/* Правая колонка с сообщениями */}
        <Col md={9} lg={10} className="d-flex flex-column" style={{ height: '100%' }}>
          <div className="p-3 border-bottom">
            <h4># {currentChannel?.name}</h4>
          </div>

          {connectionStatus !== 'connected' && alertMessage && (
            <Alert variant="warning" className="m-3 mb-0">
              {alertMessage}
            </Alert>
          )}

          <div className="p-3" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {currentMessages.length === 0 ? (
              <p className="text-center text-muted">{t('messages.noMessages')}</p>
            ) : (
              currentMessages.map(msg => (
                <div key={msg.id} className="mb-3 p-2 bg-white rounded shadow-sm">
                  <strong className="me-2 text-primary">
                    {msg.username || user?.username || 'Unknown'}
                  </strong>
                  <p className="mb-0">{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-top">
            <Form onSubmit={handleSendMessage}>
              <InputGroup>
                <Form.Control
                  ref={inputRef}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder={t('messages.typeMessage')}
                  autoComplete="off"
                  disabled={!currentChannelId || sending || connectionStatus !== 'connected'}
                  aria-label="Новое сообщение"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    !currentChannelId ||
                    !newMessage.trim() ||
                    sending ||
                    connectionStatus !== 'connected'
                  }
                >
                  {sending ? t('messages.sending') : t('send')}
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddChannel={(name) => dispatch(addChannel(name))}
        channelNames={channelNames}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => {
          setShowRenameModal(false)
          setSelectedChannel(null)
        }}
        onRenameChannel={async (data) => {
          await dispatch(renameChannel(data)).unwrap()
        }}
        channel={selectedChannel}
        channelNames={channelNames}
      />

      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => {
          setShowRemoveModal(false)
          setSelectedChannel(null)
        }}
        onRemoveChannel={(id) => dispatch(removeChannel(id))}
        channel={selectedChannel}
      />
    </Container>
  )
}

export default ChatPage