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
  sendMessage,
  addMessageFromSocket,
  setConnectionStatus,
} from '../store/slices/messagesSlice'

import socketService from '../services/socket'
import ChannelMenu from '../components/ChannelMenu'
import AddChannelModal from '../components/modals/AddChannelModal'
import RenameChannelModal from '../components/modals/RenameChannelModal'
import RemoveChannelModal from '../components/modals/RemoveChannelModal'
import { showSuccess, showWarning } from '../utils/toast'

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

  const currentChannel = channels.find(c => Number(c.id) === Number(currentChannelId))

  const channelNames = channels.map(c => c.name)

  const currentMessages = messages.filter(m => Number(m.channelId) === Number(currentChannelId))

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    if (!currentChannelId) return
    inputRef.current?.focus()
  }, [currentChannelId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages.length])

  useEffect(() => {
    if (!user?.username) return

    const socket = socketService.connect()
    if (!socket) return

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'))
      dispatch(fetchMessages())
      showSuccess('Соединение установлено')
    }

    const handleDisconnect = () => {
      dispatch(setConnectionStatus('disconnected'))
      showWarning('Соединение потеряно')
    }

    const handleNewMessage = (message) => {
      dispatch(addMessageFromSocket(message))
    }

    socketService.onConnect(handleConnect)
    socketService.onDisconnect(handleDisconnect)
    socketService.onNewMessage(handleNewMessage)

    return () => {
      socketService.offConnect(handleConnect)
      socketService.offDisconnect(handleDisconnect)
      socketService.offNewMessage(handleNewMessage)
    }
  }, [dispatch, user?.username])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !currentChannelId || sending || connectionStatus !== 'connected') {
      return
    }

    setSending(true)

    try {
      const messageData = {
        text: newMessage,
        channelId: Number(currentChannelId),
        username: user.username,
      }

      await dispatch(sendMessage(messageData)).unwrap()

      setNewMessage('')
      inputRef.current?.focus()
    }
    catch (err) {
      rollbar.error('Ошибка отправки сообщения', err)
    }
    finally {
      setSending(false)
    }
  }

  if (channelsLoading || messagesLoading) {
    return (
      <Container fluid className="h-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    )
  }

  return (
    <Container fluid className="p-0" style={{ height: '100vh', overflow: 'hidden' }}>
      <Row className="g-0 h-100">
        {/* Каналы */}

        <Col md={3} lg={2} className="bg-light border-end d-flex flex-column h-100">
          <div className="p-3 border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="text-muted mb-0">{t('channels.title')}</h6>

              <Button variant="success" size="sm" onClick={() => setShowAddModal(true)}>
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
                  active={Number(channel.id) === Number(currentChannelId)}
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span className="text-truncate">
                    #
                    {channel.name}
                  </span>

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

        {/* Чат */}

        <Col md={9} lg={10} className="d-flex flex-column h-100">
          {/* Заголовок */}

          <div className="p-3 border-bottom flex-shrink-0">
            <h4>
              #
              {currentChannel?.name 
              || t('channels.select')}
            </h4>
          </div>

          {connectionStatus !== 'connected' && (
            <Alert variant="warning" className="m-3">
              ⚠️ 
              {t('header.connectionError')}
            </Alert>
          )}

          {/* Сообщения */}

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              minHeight: 0,
            }}
          >
            {currentMessages.length === 0 ? (
              <p className="text-center text-muted">{t('messages.noMessages')}</p>
            ) 
            : (
              currentMessages.map(msg => (
                <div key={msg.id} className="mb-3 p-2 bg-white rounded shadow-sm">
                  <strong className="me-2 text-primary">{msg.username || 'unknown'}</strong>

                  <p className="mb-0">{msg.text}</p>
                </div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Форма */}

          {currentChannel && (
            <div className="p-3 border-top flex-shrink-0">
              <Form onSubmit={handleSendMessage}>
                <InputGroup>
                  <Form.Control
                    ref={inputRef}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={t('messages.typeMessage')}
                    autoComplete="off"
                    disabled={sending}
                    aria-label="Новое сообщение"
                  />

                  <Button type="submit" variant="primary" disabled={!newMessage.trim() || sending}>
                    {sending ? t('messages.sending') : t('send')}
                  </Button>
                </InputGroup>
              </Form>
            </div>
          )}
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
        onRemoveChannel={id => dispatch(removeChannel(id))}
        channel={selectedChannel}
      />
    </Container>
  )
}

export default ChatPage
