import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetOrganizationById, selectOrganization } from "../organization/organizationSlice";
import { CreateDepartment } from "../department/departmentSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { selectLoggedinUser } from "../auth/authSlice";
import { CreateMeeting } from "../meeting/meetingSlice";

const OrganizationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organization = useSelector(selectOrganization);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [deptName, setDeptName] = useState("");
  const [meetingData, setMeetingData] = useState({
    title: "",
    duration: "",
    description: "",
    date: "",
    venue: "",
    organizerId: "",
    attendees: [] // Stores selected employee IDs
  });
  const user = useSelector(selectLoggedinUser);

  // Fetch organization data
  useEffect(() => {
    dispatch(GetOrganizationById(id));
  }, [dispatch, id]);

  // Log organization for debugging (optional)
  useEffect(() => {
    console.log("Organization:", organization);
  }, [organization]);

  // Get all employees (heads and department employees)
  const allEmployees = organization?.data?.departments?.reduce((acc, dept) => {
    // Add department head
    if (dept.head) {
      acc.push({ _id: dept.head._id, username: dept.head.username });
    }
    // Add department employees
    if (dept.employees && dept.employees.length > 0) {
      dept.employees.forEach(emp => {
        acc.push({ _id: emp._id, username: emp.username });
      });
    }
    return acc;
  }, []) || [];

  const handleCreateDepartment = async () => {
    if (deptName.length <= 2) {
      toast.error("Department name must be at least two characters long");
    } else {
      try {
        setShowDeptModal(false);
        await dispatch(CreateDepartment({ name: deptName, organizationId: id })).unwrap();
        toast.success("Department created successfully");
        // Refetch organization to update departments
        dispatch(GetOrganizationById(id));
        setDeptName("");
      } catch (err) {
        toast.error("Failed to create department");
      }
    }
  };

  const handleCreateMeeting = async () => {
    if (meetingData.title.length < 2) {
      toast.error("Meeting title must be at least 2 characters long");
      return;
    }
    if (!meetingData.duration || isNaN(meetingData.duration) || meetingData.duration <= 0) {
      toast.error("Please enter a valid duration in minutes");
      return;
    }
    if (meetingData.description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }
    if (!meetingData.date) {
      toast.error("Please select a valid date");
      return;
    }
    if (meetingData.venue.length < 2) {
      toast.error("Venue must be at least 2 characters long");
      return;
    }
    if (meetingData.attendees.length === 0) {
      toast.error("Please select at least one attendee");
      return;
    }
    meetingData.organizerId = user.user.id;
    try {
      setShowMeetingModal(false);
      dispatch(CreateMeeting(meetingData))
      
      setMeetingData({
        title: "",
        duration: "",
        description: "",
        date: "",
        venue: "",
        attendees: []
      });
    } catch (err) {
      toast.error("Failed to create meeting");
    }
  };

  const handleMeetingInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingData(prev => ({ ...prev, [name]: value }));
  };

  const handleAttendeeChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId && !meetingData.attendees.includes(selectedId)) {
      setMeetingData(prev => ({
        ...prev,
        attendees: [...prev.attendees, selectedId]
      }));
    }
    e.target.value = "";
  };

  const removeAttendee = (idToRemove) => {
    setMeetingData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(id => id !== idToRemove)
    }));
  };

  const addAllAttendees = () => {
    const allEmployeeIds = allEmployees.map(emp => emp._id);
    setMeetingData(prev => ({
      ...prev,
      attendees: [...new Set([...prev.attendees, ...allEmployeeIds])]
    }));
  };

  const removeAllAttendees = () => {
    setMeetingData(prev => ({
      ...prev,
      attendees: []
    }));
  };

  return (
    <div className="p-10">
      <div className="flex items-center justify-between py-5">
        <h1 className="font-bold text-black text-xl">Departments</h1>
        {organization && organization.data.owner._id === user.user.id && (
          <button
            onClick={() => setShowMeetingModal(true)}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            + Create Meeting
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-4">
        {organization && organization.data.owner._id === user.user.id && (
          <div
            className="w-full sm:w-48 h- RedundantTypeException: Use of undefined constant meetingData - assumed 'meetingData' (line 33, src/OrganizationPage.jsx)32 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
            onClick={() => setShowDeptModal(true)}
          >
            +
          </div>
        )}
        {organization && organization.data.departments.map((dept, index) => (
          <div
            key={index}
            className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
            onClick={() => navigate("/department/" + dept._id)}
          >
            {dept.name}
          </div>
        ))}
      </div>

      {showDeptModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md space-y-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Department</h2>
            <input
              type="text"
              placeholder="Department Name"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDepartment}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {showMeetingModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Meeting</h2>
            <div className="max-h-[70vh] overflow-y-auto space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Meeting Title"
                value={meetingData.title}
                onChange={handleMeetingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                name="duration"
                placeholder="Duration (minutes)"
                value={meetingData.duration}
                onChange={handleMeetingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={meetingData.description}
                onChange={handleMeetingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
              />
              <input
                type="datetime-local"
                name="date"
                value={meetingData.date}
                onChange={handleMeetingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue"
                value={meetingData.venue}
                onChange={handleMeetingInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Invite Attendees</label>
                <select
                  name="attendees"
                  onChange={handleAttendeeChange}
                  className="w-full p-2 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="" disabled selected>Select employees</option>
                  {allEmployees.map(employee => (
                    <option key={employee._id} value={employee._id}>
                      {employee.username}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2 top-10 pointer-events-none text-gray-500">
                  ▼
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <button
                  onClick={addAllAttendees}
                  className="px-3 py-1 bg-black text-white rounded hover:opacity-75 text-sm"
                >
                  Add All
                </button>
                <button
                  onClick={removeAllAttendees}
                  className="px-3 py-1 bg-black text-white rounded hover:opacity-75 text-sm"
                >
                  Remove All
                </button>
              </div>
              <div className="min-h-[40px] border border-gray-300 rounded p-2 flex flex-wrap gap-2">
                {meetingData.attendees.map(id => {
                  const employee = allEmployees.find(emp => emp._id === id);
                  return (
                    <span
                      key={id}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm flex items-center cursor-pointer hover:bg-gray-300"
                      onClick={() => removeAttendee(id)}
                    >
                      {employee?.username}
                      <span className="ml-1 text-red-500 font-bold">×</span>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowMeetingModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMeeting}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;