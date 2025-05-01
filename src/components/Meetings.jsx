import { useDispatch, useSelector } from "react-redux";
import {
  GetAttendedMeetings,
  GetOrganizedMeetings,
  selectAttendedMeetings,
  selectOrganizedMeetings,
} from "../meeting/meetingSlice";
import { useEffect } from "react";
import { selectLoggedinUser } from "../auth/authSlice";
import { useNavigate } from "react-router-dom";

const Meetings = () => {
  const OrganizedMeetings = useSelector(selectOrganizedMeetings);
  const AttendedMeetings = useSelector(selectAttendedMeetings);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectLoggedinUser);
  useEffect(() => {
    dispatch(GetAttendedMeetings(user.user.id));
    dispatch(GetOrganizedMeetings(user.user.id));
  }, []);
  useEffect(() => {
    console.log(AttendedMeetings);
  }, [AttendedMeetings]);
  useEffect(() => {
    console.log(OrganizedMeetings);
  }, [OrganizedMeetings]);
  return (
    <div className="flex flex-col">
      {OrganizedMeetings.length>0&&<div className="flex flex-col  space-y-4">
        <h1 className="text-xl font-bold">Your Organized Meetings</h1>
        <div className="flex flex-wrap">
          {OrganizedMeetings.map((O, index) => (
          <div
            className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
            key={index}
            onClick={() => navigate("/meeting/" + O._id)}
          >
            {O.title}
          </div>
          ))}
        </div>
      </div>}

      {AttendedMeetings.length>0&&<div className="flex flex-col  space-y-4">
        <h1 className="text-xl font-bold">Meetings You're an Attendee At</h1>
        <div className="flex flex-wrap">
          {AttendedMeetings.map((A, index) => (
          <div
            className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
            key={index}
            onClick={() => navigate("/meeting/" + A._id)}
          >
            {A.title}
          </div>
          ))}
        </div>
      </div>}
    </div>
  );
};
export default Meetings;
