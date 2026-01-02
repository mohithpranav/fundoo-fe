const EmptyState = ({ activeItem }) => {
  const emptyStates = {
    notes: { icon: "💡", text: "Notes you add appear here" },
    reminders: {
      icon: "🔔",
      text: "Notes with upcoming reminders appear here",
    },
    archive: { icon: "📦", text: "Your archived notes appear here" },
    trash: {
      icon: "🗑️",
      text: "Notes in Trash are deleted forever after 7 days",
    },
  };

  const state = emptyStates[activeItem] || emptyStates.notes;

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "400px" }}
    >
      <div style={{ fontSize: "120px", opacity: 0.2 }}>{state.icon}</div>
      <p className="mt-3" style={{ color: "#5f6368", fontSize: "15px" }}>
        {state.text}
      </p>
    </div>
  );
};
export default EmptyState;
