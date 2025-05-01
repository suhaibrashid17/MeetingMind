import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoggedinUser } from "../auth/authSlice";
import {
  CreateOrganization,
  GetEmployed,
  GetHeaded,
  GetOwned,
  selectEmployed,
  selectHeaded,
  selectOwned,
} from "../organization/organizationSlice";
import { toast } from "react-toastify";
import { Navigate, redirect, useNavigate } from "react-router-dom";

const Organizations = () => {
  const [showModal, setShowModal] = useState(false);
  const [orgName, setOrgName] = useState("");
  const user = useSelector(selectLoggedinUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = user?.user?.id;
  const O = useSelector(selectOwned);
  const H = useSelector(selectHeaded);
  const E = useSelector(selectEmployed);
  useEffect(() => {
    dispatch(GetOwned(userId));
    dispatch(GetEmployed(userId));
    dispatch(GetHeaded(userId));
  }, []);
  const handleCreateOrganization = async () => {
    if (orgName.length <= 2) {
      toast.error("Organization name must be atleast two characters long");
    } else {
      setShowModal(false);
      await dispatch(CreateOrganization({ ownerId: userId, name: orgName }));
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full">

<div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold">Owned Organizations</h1>
        <div className="flex flex-wrap gap-4">
          <div
            className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
            onClick={() => setShowModal(true)}
          >
            +
          </div>
          {O.length > 0 &&
            O.map((o, index) => (
              <div
                className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
                key={index}
                onClick={()=>navigate("/organization/"+o._id)}
              >
                {o.name}
              </div>
            ))}
        </div>
      </div>

      {H.length>0&&<div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold">Organizations you are a Head at</h1>
        <div className="flex flex-wrap gap-4">
        {
            H.map((h, index) => (
              <div
                className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
                key={index}
                onClick={()=>navigate("/organization/"+h._id)}
              >
                {h.name}
              </div>
            ))}
        </div>
      </div>}

      {E.length>0&&<div className="flex flex-col space-y-4">
        <h1 className="text-xl font-bold">
          Organizations you are an Employee of
        </h1>
        <div className="flex flex-wrap gap-4">
        {
            E.map((e, index) => (
              <div
                className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
                key={index}
                onClick={()=>navigate("/organization/"+e._id)}
              >
                {e.name}
              </div>
            ))}
        </div>
      </div>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md space-y-4 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Create New Organization</h2>
            <input
              type="text"
              placeholder="Organization Name"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrganization}
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

export default Organizations;
