import { useState } from 'react';
import './css/sidebar.css';
import { MenuItemProps } from "./types";
import { IconButton } from '@mui/material';
import { Group, Home, LogoutOutlined, Menu, MenuOpen, Person, Star } from '@mui/icons-material';
import { TOP_BAR_HEIGHT } from './config';
import { useDispatch } from 'react-redux';
import { logout } from './features/messages/accountSlice';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch()


  // Toggle sidebar open/collapse
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout())
  };

  const menuIconStyle = { color: 'var(--highlight-color-light)', width: "2rem", height: "2rem" }


  const menuItems: MenuItemProps[] = [
    { name: "Home", icon: Home },
    { name: "Group", icon: Group },
    { name: "Single chat", icon: Person },
    { name: "Favorites", icon: Star }
  ]

  function getMenuItem(isMenuOpen: boolean, item: MenuItemProps, index: number) {
    if (isMenuOpen) {
      return <div className="menu-item" style={{ display: "flex", gap: "1rem" }}>
        <IconButton key={index} >
          <item.icon style={menuIconStyle} />
        </IconButton>
        {item.name}
      </div>
    } else {
      return <IconButton key={index} ><item.icon style={menuIconStyle} /></IconButton>
    }
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
      <IconButton style={{ height: TOP_BAR_HEIGHT }} onClick={toggleSidebar} >
        {isOpen ? <MenuOpen style={menuIconStyle} /> : <Menu style={menuIconStyle} />}
      </IconButton>
      <div style={{ padding: "1rem", height: "100%", background: "var(--chat-message-bg-light)" }}>
        <div className="menu-items">
          {menuItems.map((item, index) => getMenuItem(isOpen, item, index))}
        </div>
      </div>
      <IconButton
        className="logout-button"
        style={{ height: TOP_BAR_HEIGHT }}
        onClick={handleLogout}>
        <LogoutOutlined style={menuIconStyle} />
      </IconButton>
    </div >
  );
}

export default Sidebar;
