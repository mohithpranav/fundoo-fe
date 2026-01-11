import React from "react";

const Sidebar = ({
  activeItem,
  setActiveItem,
  isOpen,
  onEditLabels,
  labels = [],
}) => {
  const menuItems = [
    { id: "notes", icon: "bi-lightbulb", label: "Notes" },
    { id: "reminders", icon: "bi-bell", label: "Reminders" },
  ];

  const bottomMenuItems = [
    { id: "archive", icon: "bi-archive", label: "Archive" },
    { id: "trash", icon: "bi-trash3", label: "Trash" },
  ];

  const renderMenuItem = (item, isLabel = false) => {
    const isActive = isLabel
      ? activeItem === `label-${item._id}`
      : activeItem === item.id;

    return (
      <div
        key={isLabel ? item._id : item.id}
        onClick={() => {
          if (isLabel) {
            setActiveItem(`label-${item._id}`);
          } else {
            setActiveItem(item.id);
          }
        }}
        className="d-flex align-items-center"
        style={{
          cursor: "pointer",
          padding: isOpen ? "12px 16px 12px 12px" : "12px 0",
          margin: isOpen ? "0 8px 4px 8px" : "0 12px 4px 12px",
          borderRadius: isOpen ? "0 50px 50px 0" : "50%",
          backgroundColor: isActive ? "#feefc3" : "transparent",
          justifyContent: isOpen ? "flex-start" : "center",
          width: isOpen ? "auto" : "48px",
          height: isOpen ? "auto" : "48px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "rgba(95, 99, 104, 0.04)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
      >
        <i
          className={`bi ${isLabel ? "bi-tag" : item.icon}`}
          style={{
            fontSize: 20,
            color: isActive ? "#202124" : "#5f6368",
            marginLeft: isOpen ? "4px" : "0",
          }}
        ></i>
        {isOpen && (
          <span
            className="ms-3"
            style={{
              fontSize: "14px",
              fontWeight: isActive ? "500" : "400",
              color: isActive ? "#202124" : "#202124",
            }}
          >
            {isLabel ? item.name : item.label}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: isOpen ? 280 : 72,
        minWidth: isOpen ? 280 : 72,
        maxWidth: isOpen ? 280 : 72,
        flexShrink: 0,
        transition: "width 0.2s",
        paddingTop: "8px",
      }}
    >
      {/* Main menu items */}
      {menuItems.map((item) => renderMenuItem(item))}

      {/* Labels */}
      {labels.map((label) => renderMenuItem(label, true))}

      {/* Divider */}
      {/* {isOpen && labels.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #e0e0e0",
            margin: "8px 16px",
          }}
        ></div>
      )} */}

      {/* Edit labels button */}
      <div
        onClick={() => onEditLabels && onEditLabels()}
        className="d-flex align-items-center"
        style={{
          cursor: "pointer",
          padding: isOpen ? "12px 16px 12px 12px" : "12px 0",
          margin: isOpen ? "0 8px 4px 8px" : "0 12px 4px 12px",
          borderRadius: isOpen ? "0 50px 50px 0" : "50%",
          backgroundColor: "transparent",
          justifyContent: isOpen ? "flex-start" : "center",
          width: isOpen ? "auto" : "48px",
          height: isOpen ? "auto" : "48px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(95, 99, 104, 0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <i
          className="bi bi-pencil"
          style={{
            fontSize: 20,
            color: "#5f6368",
            marginLeft: isOpen ? "4px" : "0",
          }}
        ></i>
        {isOpen && (
          <span
            className="ms-3"
            style={{
              fontSize: "14px",
              fontWeight: "400",
              color: "#202124",
            }}
          >
            Edit labels
          </span>
        )}
      </div>

      {/* Bottom menu items */}
      {bottomMenuItems.map((item) => renderMenuItem(item))}
    </div>
  );
};

export default Sidebar;
