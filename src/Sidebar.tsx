import { useState } from 'react';
import './css/sidebar.css';
import { MenuItemProps } from "./types";
import { IconButton } from '@mui/material';
import { Group, Home, LogoutOutlined, Menu, MenuOpen, Person, Star } from '@mui/icons-material';
import { PATH_GROUP_CHAT, TOP_BAR_HEIGHT } from './config';
import { useDispatch } from 'react-redux';
import { logout } from './features/messages/accountSlice';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Toggle sidebar open/collapse
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout())
  };

  const menuIconStyle = { color: 'var(--highlight-color-light)', width: "2rem", height: "2rem" }

  const menuItems: MenuItemProps[] = [
    { name: "Home", icon: Home, path: "" },
    { name: "Group", icon: Group, path: PATH_GROUP_CHAT },
    { name: "Single chat", icon: Person, path: "" },
    { name: "Favorites", icon: Star, path: "" }
  ]

  async function handleNavigation(path: string) {
    console.log("Ciao")
    navigate(path)
  }

  function getMenuItem(isMenuOpen: boolean, item: MenuItemProps, index: number) {
    if (isMenuOpen) {
      return <div className="menu-item" style={{ display: "flex", gap: "1rem" }}>
        <IconButton key={index} onClick={() => handleNavigation(item.path)} >
          <item.icon style={menuIconStyle} />
        </IconButton>
        {item.name}
      </div>
    } else {
      return <IconButton key={index} onClick={() => handleNavigation(item.path)} ><item.icon style={menuIconStyle} /></IconButton>
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
