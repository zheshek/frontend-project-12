import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from 'react-bootstrap'

const RemoveChannelModal = ({ show, onHide, onRemoveChannel, channel }) => {
  const { t } = useTranslation()
  const cancelRef = useRef(null)

  useEffect(() => {
    if (show && cancelRef.current) {
      cancelRef.current.focus()
    }
  }, [show])

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('channels.confirmRemove')} <strong>#{channel?.name}</strong>?</p>
        <p className="text-danger">{t('channels.messagesWillBeDeleted')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} ref={cancelRef}>
          {t('cancel')}
        </Button>
        <Button variant="danger" onClick={() => onRemoveChannel(channel.id)}>
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RemoveChannelModal
