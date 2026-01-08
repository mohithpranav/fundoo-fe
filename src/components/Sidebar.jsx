import React from "react";

const Sidebar = ({ activeItem, setActiveItem, isOpen, onEditLabels }) => {
  const menuItems = [
    { id: "notes", icon: "bi-lightbulb", label: "Notes" },
    { id: "reminders", icon: "bi-bell", label: "Reminders" },
    { id: "labels", icon: "bi-tag", label: "Edit labels", isEdit: true },
    { id: "archive", icon: "bi-archive", label: "Archive" },
    { id: "trash", icon: "bi-trash3", label: "Trash" },
  ];

  return (
    <div
      style={{
        width: isOpen ? 280 : 72,
        transition: "width 0.2s",
        paddingTop: "8px",
      }}
    >
      {menuItems.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            if (item.isEdit && item.id === "labels") {
              onEditLabels && onEditLabels();
            } else if (!item.isEdit) {
              setActiveItem(item.id);
            }
          }}
          className="d-flex align-items-center"
          style={{
            cursor: "pointer",
            padding: isOpen ? "12px 16px 12px 12px" : "12px 0",
            margin: isOpen ? "0 8px 4px 8px" : "0 12px 4px 12px",
            borderRadius: isOpen ? "0 50px 50px 0" : "50%",
            backgroundColor: activeItem === item.id ? "#feefc3" : "transparent",
            justifyContent: isOpen ? "flex-start" : "center",
            width: isOpen ? "auto" : "48px",
            height: isOpen ? "auto" : "48px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (activeItem !== item.id) {
              e.currentTarget.style.backgroundColor = "rgba(95, 99, 104, 0.04)";
            }
          }}
          onMouseLeave={(e) => {
            if (activeItem !== item.id) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          {item.isEdit && item.id === "labels" ? (
            <i
              className="bi bi-pencil"
              style={{
                fontSize: 20,
                color: "#5f6368",
                marginLeft: isOpen ? "4px" : "0",
              }}
            ></i>
          ) : (
            <i
              className={`bi ${item.icon}`}
              style={{
                fontSize: 20,
                color: activeItem === item.id ? "#202124" : "#5f6368",
                marginLeft: isOpen ? "4px" : "0",
              }}
            ></i>
          )}
          {isOpen && (
            <span
              className="ms-3"
              style={{
                fontSize: "14px",
                fontWeight: activeItem === item.id ? "500" : "400",
                color: activeItem === item.id ? "#202124" : "#202124",
              }}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
