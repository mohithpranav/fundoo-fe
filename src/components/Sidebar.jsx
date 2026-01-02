import React from "react";

const Sidebar = ({ activeItem, setActiveItem, isOpen }) => {
  const menuItems = [
    { id: "notes", icon: "💡", label: "Notes" },
    { id: "reminders", icon: "🔔", label: "Reminders" },
    { id: "labels", icon: "🏷️", label: "Labels" },
    { id: "archive", icon: "📦", label: "Archive" },
    { id: "trash", icon: "🗑️", label: "Trash" },
  ];

  return (
    <div style={{ width: isOpen ? 280 : 80, transition: "width 0.2s" }}>
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveItem(item.id)}
          className={`d-flex align-items-center px-3 py-3 ${
            activeItem === item.id ? "bg-warning bg-opacity-25" : ""
          }`}
          style={{ cursor: "pointer" }}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          {isOpen && <span className="ms-3">{item.label}</span>}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
