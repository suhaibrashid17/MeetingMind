import { useDispatch, useSelector } from "react-redux";
import {
  GetAttendedMeetings,
  GetOrganizedMeetings,
  selectAttendedMeetings,
  selectOrganizedMeetings,
} from "../meeting/meetingSlice";
import { useEffect, useState } from "react";
import { selectLoggedinUser } from "../auth/authSlice";
import { Calendar, Clock, Search, Filter, X } from "lucide-react";

const Meetings = () => {
  const organizedMeetings = useSelector(selectOrganizedMeetings) || [];
  const attendedMeetings = useSelector(selectAttendedMeetings) || [];
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedinUser);

  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user?.user?.id) {
      dispatch(GetAttendedMeetings(user.user.id));
      dispatch(GetOrganizedMeetings(user.user.id));
    }
  }, [dispatch, user]);

  const filterMeetings = (meetings) => {
    return meetings
      .filter((meeting) => {
        const matchesSearch = meeting.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        if (dateFilter) {
          const meetingDate = new Date(meeting.date).setHours(0, 0, 0, 0);
          const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
          if (meetingDate !== filterDate) return false;
        }

        return matchesSearch;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const groupByStatus = (meetings) => {
    return {
      scheduled: filterMeetings(meetings.filter((m) => m.status === "scheduled")),
      inProgress: filterMeetings(meetings.filter((m) => m.status === "in progress")),
      done: filterMeetings(meetings.filter((m) => m.status === "done")),
    };
  };

  const organizedGrouped = groupByStatus(organizedMeetings);
  const attendedGrouped = groupByStatus(attendedMeetings);

  const clearFilters = () => {
    setSearchQuery("");
    setDateFilter("");
  };

  const handleMeetingClick = (meetingId) => {
    window.location.href = `/meeting/${meetingId}`;
  };

  const renderMeetingCard = (meeting) => (
    <div
      key={meeting._id}
      className="w-full bg-white text-black p-4 flex flex-col justify-between rounded border border-black hover:bg-gray-50 cursor-pointer transition-all duration-300 shadow-sm"
      onClick={() => handleMeetingClick(meeting._id)}
    >
      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{meeting.title}</h3>
      <div className="mt-auto">
        <div className="flex items-center mt-3">
          <Calendar size={14} className="mr-2" />
          <p className="text-sm">
            {new Date(meeting.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center mt-1">
          <Clock size={14} className="mr-2" />
          <p className="text-xs uppercase tracking-wider font-medium">
            {meeting.status}
          </p>
        </div>
      </div>
    </div>
  );

  const renderMeetingSection = (title, meetings) => {
    if (meetings.length === 0) return null;

    return (
      <div className="mb-10">
        <h2 className="text-xl font-medium text-black mb-4 pb-1 border-b border-gray-200">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {meetings.map((meeting) => renderMeetingCard(meeting))}
        </div>
      </div>
    );
  };

  const renderCategorySection = (title, groupedMeetings) => {
    const hasAnyMeetings =
      groupedMeetings.scheduled.length > 0 ||
      groupedMeetings.inProgress.length > 0 ||
      groupedMeetings.done.length > 0;

    if (!hasAnyMeetings) return null;

    return (
      <div className="mb-16">
        <h1 className="text-2xl font-bold text-black mb-6 pb-2 border-b border-gray-300">
          {title}
        </h1>
        {renderMeetingSection("Scheduled", groupedMeetings.scheduled)}
        {renderMeetingSection("In Progress", groupedMeetings.inProgress)}
        {renderMeetingSection("Completed", groupedMeetings.done)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Search Bar and Filter Toggle */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-600" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search meetings..."
              className="bg-white w-full py-2 pl-10 pr-4 rounded-lg border border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-white border border-black rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} className="mr-2" />
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
            {(searchQuery || dateFilter) && (
              <button
                onClick={clearFilters}
                className="ml-2 flex items-center px-4 py-2 bg-black text-white border border-black rounded-lg hover:bg-gray-900 transition-colors"
              >
                <X size={16} className="mr-2" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Date Filter */}
        {showFilters && (
          <div className="mb-8 p-6 bg-white rounded-lg border border-black">
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Filter by Meeting Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full p-3 bg-white border border-black rounded-lg focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>
        </div>
        )}

        {/* Meeting sections */}
        {renderCategorySection("Meetings Organized by You", organizedGrouped)}
        {renderCategorySection("Meetings You're Attending", attendedGrouped)}

        {/* No meetings message */}
        {!organizedMeetings.length && !attendedMeetings.length && (
          <div className="py-16 text-center">
            <h2 className="text-xl font-medium text-black mb-2">No meetings found</h2>
            <p className="text-gray-600">
              You don't have any meetings scheduled or you may need to adjust your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meetings;