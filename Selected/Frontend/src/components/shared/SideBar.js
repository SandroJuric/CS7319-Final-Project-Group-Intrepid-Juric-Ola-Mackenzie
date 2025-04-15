import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsToggleOn, BsGear, BsClockHistory } from 'react-icons/bs';
import '../../styles/Dashboard.css';
import api from '../../api';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleArchivedChats = () => {
    navigate('/history');
  };

  const handleStatusChange = async () => {
    try {
      // Removed the second parameter so that no request body is sent, basically sending no data
      await api.patch('/Account/Status');
      console.log("Status changed successfully");
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handleManageAccount = () => {
    navigate('/profile');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-btns">
        <button className="menu-btn" onClick={handleStatusChange}>
          <BsToggleOn />
          <span>Change Status</span>
        </button>
        <button className="menu-btn" onClick={handleManageAccount}>
          <BsGear />
          <span>Manage Account</span>
        </button>
        <button className="menu-btn" onClick={handleArchivedChats}>
          <BsClockHistory />
          <span>Archived Chats</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;


/*
Explanation:
- Sidebar Component now uses react-icons for each button:
  • BsToggleOn for "Change Status"
  • BsGear for "Manage Account"
  • BsClockHistory for "Archived Chats"
- The buttons have a white background (as set in the common CSS) with rounded edges.
- The Archived Chats button navigates to "/history" (which should match your route for archived chats).
*/
