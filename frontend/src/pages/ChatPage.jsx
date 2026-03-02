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

  const [showAddModal, setShowAddModal] = useState(false)
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(null)

  const { user } = useSelector((state) => state.auth)
  const { channels, currentChannelId, loading: channelsLoading } =
    useSelector((state) => state.channels)
  const { messages, loading: messagesLoading, connectionStatus } =
    useSelector((state) => state.messages)

  useEffect(() => {
    dispatch(fetchChannels())
    dispatch(fetchMessages())
  }, [dispatch])

  useEffect(() => {
    if (!user?.username) return

    socketService.connect()

    dispatch(
      setConnectionStatus(
        socketService.isConnected() ? 'connected' : 'disconnected',
      ),
    )

    socketService.onNewMessage((message) => {
      dispatch(addMessageFromSocket(message))
    })

    const handleConnect = () => {
      dispatch(setConnectionStatus('connected'))
      showInfo(t('toasts.reconnected'))
      dispatch(fetchMessages())
    }

    const handleDisconnect = () => {
      dispatch(setConnectionStatus('disconnected'))
      showWarning(t('toasts.disconnected'))
    }

    socketService.socket?.on('connect', handleConnect)
    socketService.socket?.on('disconnect', handleDisconnect)

    return () => {
      socketService.offNewMessage()
      socketService.socket?.off('connect', handleConnect)
      socketService.socket?.off('disconnect', handleDisconnect)
    }
  }, [dispatch, t, user?.username])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !currentChannelId || sending) return

    setSending(true)

    try {
      await dispatch(
        sendMessage({
          text: newMessage,
          channelId: Number(currentChannelId),
          username: user?.username,
        }),
      ).unwrap()

      setNewMessage('')
    } catch (err) {
      rollbar.error('Ошибка отправки сообщения', err)
    } finally {
      setSending(false)
    }
  }

  const currentMessages = messages.filter(
    (m) => Number(m.channelId) === Number(currentChannelId),
  )

  const currentChannel = channels.find(
    (c) => c.id === currentChannelId,
  )

  const channelNames = channels.map((c) => c.name)

  if (channelsLoading || messagesLoading) {
    return (
      <Container
        fluid
        className="h-100 d-flex justify-content-center align-items-center"
      >
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
            <h6 className="text-muted mb-0">
              {t('channels.title')}
            </h6>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              +
            </Button>
          </div>

          <ListGroup variant="flush">
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                action
                active={channel.id === currentChannelId}
                onClick={() =>
                  dispatch(setCurrentChannel(channel.id))
                }
                className="d-flex justify-content-between align-items-center"
              >
                <span className="text-truncate">
                  # {channel.name}
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
        </Col>

        <Col md={9} lg={10} className="d-flex flex-column p-3">
          <h4 className="mb-3 text-truncate">
            # {currentChannel?.name}
          </h4>

          {connectionStatus !== 'connected' && (
            <Alert variant="warning" className="mb-3">
              ⚠️ {t('header.connectionError')}
            </Alert>
          )}

          <div className="flex-grow-1 overflow-auto mb-3">
            {currentMessages.length === 0 ? (
              <p className="text-center text-muted">
                {t('messages.noMessages')}
              </p>
            ) : (
              currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="mb-3 p-2 bg-white rounded shadow-sm"
                >
                  <strong className="me-2 text-primary">
                    {msg.username || t('messages.user')}
                  </strong>

                  <small className="text-muted">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : t('messages.justNow')}
                  </small>

                  <p className="mb-0">
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <Form onSubmit={handleSendMessage}>
            <InputGroup>
              <Form.Control
                value={newMessage}
                onChange={(e) =>
                  setNewMessage(e.target.value)
                }
                placeholder={t('messages.typeMessage')}
                aria-label="Новое сообщение"
                disabled={
                  !currentChannelId ||
                  sending ||
                  connectionStatus !== 'connected'
                }
              />
              <Button
                type="submit"
                disabled={
                  !currentChannelId ||
                  !newMessage.trim() ||
                  sending ||
                  connectionStatus !== 'connected'
                }
              >
                {sending
                  ? t('messages.sending')
                  : t('send')}
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <AddChannelModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddChannel={(name) =>
          dispatch(addChannel(name))
        }
        channelNames={channelNames}
      />

      <RenameChannelModal
        show={showRenameModal}
        onHide={() => {
          setShowRenameModal(false)
          setSelectedChannel(null)
        }}
        onRenameChannel={(data) =>
          dispatch(renameChannel(data))
        }
        channel={selectedChannel}
        channelNames={channelNames}
      />

      <RemoveChannelModal
        show={showRemoveModal}
        onHide={() => {
          setShowRemoveModal(false)
          setSelectedChannel(null)
        }}
        onRemoveChannel={(id) =>
          dispatch(removeChannel(id))
        }
        channel={selectedChannel}
      />
    </Container>
  )
}

export default ChatPage