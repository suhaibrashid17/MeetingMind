const Attendees = ({ attendees }) => {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendees</h2>
        {attendees && attendees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attendees.map((attendee) => (
              <div key={attendee._id} className="bg-gray-50 rounded-md p-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-white font-semibold mr-3">
                  {attendee.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700">{attendee.username}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No attendees yet.</p>
        )}
      </div>
    );
  };
  
  export default Attendees;