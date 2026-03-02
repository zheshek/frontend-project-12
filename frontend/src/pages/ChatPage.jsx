import { useEffect, useState } from 'react'
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
import { showInfo, showWarning } from '../utils/toast'
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

const ChatPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const rollbar = useRollbar()
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [isFirstConnection, setIsFirstConnection] = useState(true)
  const [updateKey, setUpdateKey] = useState(0)

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

  // Загружаем каналы и сообщения при монтировании
  useEffect(() => {
    console.log('📥 Fetching channels and messages...')
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  // Настройка сокета - ТОЛЬКО когда есть пользователь
  useEffect(() => {
    // Важно: не подключаем сокет, пока нет пользователя
    if (!user?.username) {
      console.log('⏳ Waiting for user login, socket not connected yet')
      return
    }

    console.log('🟢 Setting up socket connection for user:', user.username)
    socketService.connect()
    // Обновляем статус подключения
    dispatch(
      setConnectionStatus(
        socketService.isConnected() ? 'connected' : 'disconnected'
      )
    )

    // Подписываемся на новые сообщения
    socketService.onNewMessage(message => {
      console.log('📨 New message received via socket:', message)
      dispatch(addMessageFromSocket(message))
      setUpdateKey(prev => prev + 1)
    })

    // Обработчики событий сокета
    const handleConnect = () => {
      console.log('🔌 Socket connected for user:', user.username)
      dispatch(setConnectionStatus('connected'))
      if (!isFirstConnection) {
        showInfo(t('toasts.reconnected'))
      }
      setIsFirstConnection(false)

      // Перезагружаем сообщения при переподключении
      dispatch(fetchMessages())
    }

    const handleDisconnect = () => {
      console.log('🔌 Socket disconnected for user:', user.username)
      dispatch(setConnectionStatus('disconnected'))
      showWarning(t('toasts.disconnected'))
    }

    // Регистрируем обработчики
    socketService.socket?.on('connect', handleConnect)
    socketService.socket?.on('disconnect', handleDisconnect)

    // Очистка при размонтировании
    return () => {
      console.log('🔴 Cleaning up socket for user:', user.username)
      socketService.offNewMessage()
      socketService.socket?.off('connect', handleConnect)
      socketService.socket?.off('disconnect', handleDisconnect)
    }
  }, [dispatch, t, user?.username, isFirstConnection])

  const handleChannelChange = channelId => {
    dispatch(setCurrentChannel(channelId))
  }

  const handleAddChannel = name => {
    dispatch(addChannel(name))
    setShowAddModal(false)
  }

  const handleRenameChannel = ({ id, name }) => {
    dispatch(renameChannel({ id, name }))
    setShowRenameModal(false)
    setSelectedChannel(null)
  }

  const handleRemoveChannel = id => {
    dispatch(removeChannel(id))
    setShowRemoveModal(false)
    setSelectedChannel(null)
  }

  const handleSendMessage = async e => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)
    const messageData = {
      text: newMessage,
      channelId: Number(currentChannelId),
      username: user?.username,
    }

    console.log('📤 Sending message:', messageData)

    try {
      await dispatch(sendMessage(messageData)).unwrap()
      console.log('✅ Message sent successfully')
      setNewMessage('')
    } catch (error) {
      console.error('❌ Ошибка отправки:', error)
      rollbar.error('Ошибка отправки сообщения', error)
    } finally {
      setSending(false)
    }
  }

  const currentMessages = messages.filter(m => Number(m.channelId) === Number(currentChannelId))

  console.log('Current messages for channel:', currentMessages.length)

  const currentChannel = channels.find(c => c.id === currentChannelId)
  const channelNames = channels.map(c => c.name)

  if (channelsLoading || messagesLoading) {
    return (
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>{t('loading')}</p>
        </div>
      </Container>
    )
  }

  return (
    <Container fluid className="p-0 h-100 d-flex flex-column">
      <Row className="flex-grow-1 m-0" style={{ marginTop: '56px' }}>
        <Col md={3} lg={2} className="bg-light p-3 border-end">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-muted mb-0">{t('channels.title')}</h6>
            <Button variant="success" size="sm" onClick={() => setShowAddModal(true)}>+</Button>
          </div>
          <ListGroup variant="flush">
            {channels.map(channel => (
              <ListGroup.Item
                key={channel.id}
                action
                active={channel.id === currentChannelId}
                onClick={() => handleChannelChange(channel.id)}
                className="d-flex justify-content-between align-items-center"
              >
                <span className="text-truncate"># {channel.name}</span>
                <ChannelMenu
                  channel={channel}
                  onRename={ch => {
                    setSelectedChannel(ch)
                    setShowRenameModal(true)
                  }}
                  onRemove={ch => {
                    setSelectedChannel(ch)
                    setShowRemoveModal(true)
                  }}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9} lg={10} className="d-flex flex-column p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0 text-truncate"># {currentChannel?.name}</h4>
          </div>

          {connectionStatus !== 'connected' && (
            <Alert variant="warning" className="mb-3">⚠️ {t('header.connectionError')}</Alert>
          )}

          <div className="flex-grow-1 overflow-auto mb-3" key={updateKey}>
            {currentMessages.length === 0
              ? <p className="text-center text-muted">{t('messages.noMessages')}</p>
              : currentMessages.map(msg => (
                <div key={msg.id} className="mb-3 p-2 bg-white rounded shadow-sm">
                  <div className="d-flex align-items-center mb-1">
                    <strong className="me-2" style={{ color: '#0d6efd' }} data-testid={`message-username-${msg.id}`}>
                      {msg.username || t('messages.user')}
                    </strong>
                    <small className="text-muted">
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : t('messages.justNow')}
                    </small>
                  </div>
                  <p className="mb-0" style={{ wordBreak: 'break-word' }}>{msg.text}</p>
                </div>
              ))}
          </div>

          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={t('messages.typeMessage')}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                disabled={!currentChannelId || sending || connectionStatus !== 'connected'}
                aria-label="Новое сообщение"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={!currentChannelId || !newMessage.trim() || sending || connectionStatus !== 'connected'}
              >
                {sending ? t('messages.sending') : t('send')}
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddChannel={handleAddChannel}
        channelNames={channelNames}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => {
          setShowRenameModal(false)
          setSelectedChannel(null)
        }}
        onRenameChannel={handleRenameChannel}
        channel={selectedChannel}
        channelNames={channelNames}
      />

      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => {
          setShowRenameModal(false)
          setSelectedChannel(null)
        }}
        onRemoveChannel={handleRemoveChannel}
        channel={selectedChannel}
      />
    </Container>
  )
}

export default ChatPage