import React from 'react'
import { Dropdown } from 'react-bootstrap'

// Кастомный переключатель для Dropdown, который рендерится как span, а не button
const CustomToggle = React.forwardRef(({ children, onClick, 'aria-label': ariaLabel }, ref) => (
  <span
    ref={ref}
    onClick={onClick}
    aria-label={ariaLabel}
    style={{
      textDecoration: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      padding: '0.25rem 0.5rem'
    }}
    className="p-0 text-muted"
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClick(e)
      }
    }}
  >
    {children}
  </span>
))

CustomToggle.displayName = 'CustomToggle'

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  if (!channel.removable) return null

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        as={CustomToggle}
        variant="link"
        size="sm"
        className="p-0 text-muted"
        aria-label="Управление каналом"
      >
        <span aria-hidden="true">⋮</span>
        <span className="visually-hidden">Управление каналом</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onRename(channel)}>
          Переименовать
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onRemove(channel)} className="text-danger">
          Удалить
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default ChannelMenu
