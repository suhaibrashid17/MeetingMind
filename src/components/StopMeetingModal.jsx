const StopMeetingModal = ({ show, onCancel, onConfirm }) => {
    if (!show) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">End Meeting?</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to end this meeting? Once stopped, it cannot be restarted.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
            >
              End Meeting
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default StopMeetingModal;