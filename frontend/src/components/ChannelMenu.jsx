import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ChannelMenu = ({ channel, onRename, onRemove }) => {
  if (!channel.removable) return null;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle 
        variant="link" 
        size="sm" 
        className="p-0 text-muted"
        style={{ textDecoration: 'none' }}
        aria-label="Управление каналом"  // ← ДОБАВЛЯЕМ ЭТО!
      >
        ⋮
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
  );
};

export default ChannelMenu;
