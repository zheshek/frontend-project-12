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

  // Загружаем каналы и сообщения
  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  // Автофокус на поле ввода при смене канала
  useEffect(() => {
    if (!currentChannelId) return
    inputRef.current?.focus()
  }, [currentChannelId])

  // Фильтруем сообщения текущего канала
  const currentMessages = messages.filter(
    m => Number(m.channelId) === Number(currentChannelId)
  )

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [currentMessages])

  // Socket подключение
  useEffect(() => {
    if (!user?.username) return
    const socket = socketService.connect()
    if (!socket) return

    const handleNewMessage = (msg) => {
      // Если username нет, используем текущее имя пользователя или 'Unknown'
      const messageWithAuthor = {
        ...msg,
        username: msg.username || msg.user?.username || 'Unknown',
      }
      dispatch(addMessageFromSocket(messageWithAuthor))
    }

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'))
      dispatch(fetchMessages())
    }

    const handleDisconnect = () => dispatch(setConnectionStatus('disconnected'))
    const handleReconnecting = () => dispatch(setConnectionStatus('reconnecting'))

    socketService.onNewMessage(handleNewMessage)
    socketService.onConnect(handleConnect)
    socketService.onDisconnect(handleDisconnect)
    socketService.onReconnecting(handleReconnecting)

    return () => {
      socketService.offNewMessage(handleNewMessage)
      socketService.offConnect(handleConnect)
      socketService.offDisconnect(handleDisconnect)
      socketService.offReconnecting(handleReconnecting)
    }
  }, [dispatch, user?.username])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)
    try {
      const messageData = {
        text: newMessage,
        channelId: Number(currentChannelId),
        username: user.username, // ✅ добавляем автора
      }

      await dispatch(sendMessage(messageData)).unwrap()
      setNewMessage('')
      inputRef.current?.focus()
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
        <p className="mt-3">{t('loading')}</p>
      </Container>
    )
  }

  return (
    <Container fluid className="p-0 d-flex flex-column" style={{ height: '100vh', overflow: 'hidden' }}>
      <Row className="g-0" style={{ flex: 1, minHeight: 0 }}>
        {/* Колонка с каналами */}
        <Col md={3} lg={2} className="bg-light border-end d-flex flex-column" style={{ height: '100vh' }}>
          <div className="p-3 border-bottom flex-shrink-0 d-flex justify-content-between align-items-center">
            <h6 className="text-muted mb-0">{t('channels.title')}</h6>
            <Button variant="success" size="sm" onClick={() => setShowAddModal(true)}>+</Button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <ListGroup variant="flush">
              {channels.map(channel => (
<ListGroup.Item
  key={channel.id}
  action
  active={channel.id === currentChannelId}
  onClick={() => dispatch(setCurrentChannel(channel.id))}
  className="d-flex justify-content-between align-items-center"
  style={{ position: 'relative' }}
>
  {/* Название канала с обрезкой */}
  <span className="text-truncate me-2" style={{ maxWidth: 'calc(100% - 40px)' }}>
    # {channel.name}
  </span>

  {/* Кнопка управления каналом */}
  <ChannelMenu
    channel={channel}
    onRename={ch => { setSelectedChannel(ch); setShowRenameModal(true) }}
    onRemove={ch => { setSelectedChannel(ch); setShowRemoveModal(true) }}
  />
</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Col>

        {/* Колонка с сообщениями */}
        <Col md={9} lg={10} className="d-flex flex-column" style={{ height: '100%' }}>
          <div className="p-3 border-bottom">
            <h4># {currentChannel?.name}</h4>
          </div>

          {connectionStatus !== 'connected' && (
            <Alert variant="warning" className="m-3 mb-0">
              ⚠️ {t('header.connectionError')}
            </Alert>
          )}

          <div className="p-3" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {currentMessages.length === 0 ? (
              <p className="text-center text-muted">{t('messages.noMessages')}</p>
            ) : (
              currentMessages.map(msg => (
                <div key={msg.id} className="mb-3 p-2 bg-white rounded shadow-sm">
                  <strong className="me-2 text-primary">{msg.username}</strong>
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
                />
                <Button
                  type="submit"
                  disabled={!currentChannelId || !newMessage.trim() || sending || connectionStatus !== 'connected'}
                >
                  {sending ? t('messages.sending') : t('send')}
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>

      {/* Модалки */}
      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddChannel={name => dispatch(addChannel(name))}
        channelNames={channelNames}
      />
      <RenameChannelModal
        show={showRenameModal}
        onHide={() => { setShowRenameModal(false); setSelectedChannel(null) }}
        onRenameChannel={async data => { await dispatch(renameChannel(data)).unwrap() }}
        channel={selectedChannel}
        channelNames={channelNames}
      />
      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => { setShowRemoveModal(false); setSelectedChannel(null) }}
        onRemoveChannel={id => dispatch(removeChannel(id))}
        channel={selectedChannel}
      />
    </Container>
  )
}

export default ChatPage