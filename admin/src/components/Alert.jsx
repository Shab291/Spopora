export const CustomAlert = ({ message, onConfirm, onCancel, show }) => {
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: show ? 1 : 0,
    transition: "opacity 300ms ease-out",
    pointerEvents: show ? "auto" : "none",
    zIndex: 50,
  };

  return (
    <div style={overlayStyle}>
      <div
        className={`bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 ${
          show ? "animate-fade-in" : "animate-fade-out"
        }`}
      >
        <p className="text-gray-800 mb-6 text-center">{message}</p>

        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
