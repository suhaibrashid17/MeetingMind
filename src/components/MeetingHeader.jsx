import { formatDate } from '../utils/helpers';

const MeetingHeader = ({ meeting }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">{meeting.title}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Organizer:</span> {meeting.organizer?.username || "Unknown"}
          </p>
          {meeting.organization && (
            <p className="text-gray-600">
              <span className="font-semibold">Organization:</span> {meeting.organization}
            </p>
          )}
          <p className="text-gray-600">
            <span className="font-semibold">Location:</span> {meeting.location || "Not specified"}
          </p>
        </div>
        
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Date:</span> {formatDate(meeting.date)}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Duration:</span> {meeting.duration} minutes
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Status:</span> 
            <span className="ml-1 text-gray-600">
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
          </p>
        </div>
      </div>
      
      {meeting.description && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700">Description:</h3>
          <p className="text-gray-600 mt-1">{meeting.description}</p>
        </div>
      )}
    </div>
  );
};

export default MeetingHeader;