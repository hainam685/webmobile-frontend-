import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/nav-sideBar/sideBar.css';

const Sidebar = ({ menuItems, onLogout }) => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                <span className="material-icons">{isOpen ? 'chevron_left' : 'menu'}</span>
            </button>
            <ul>
                {menuItems.map((item, index) => (
                    <li key={index} onClick={() => navigate(item.path)}>
                        <span className="material-icons">{item.icon}</span>
                        {isOpen && <span className="menu-text">{item.label}</span>}
                    </li>
                ))}
                <li className="logout" onClick={onLogout}>
                    <span className="material-icons">logout</span>
                    {isOpen && <span className="menu-text">Đăng xuất</span>}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
