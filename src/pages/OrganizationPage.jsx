import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GetOrganizationById, selectOrganization } from "../organization/organizationSlice";
import { CreateDepartment } from "../department/departmentSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const OrganizationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const organization = useSelector(selectOrganization);
  const [showModal, setShowModal] = useState(false);
  const [deptName, setDeptName] = useState("");

  // Fetch organization data
  useEffect(() => {
    dispatch(GetOrganizationById(id));
  }, [dispatch, id]);

  // Log organization for debugging (optional)
  useEffect(() => {
    console.log("Organization:", organization);
  }, [organization]);

  const handleCreateDepartment = async () => {
    if (deptName.length <= 2) {
      toast.error("Department name must be at least two characters long");
    } else {
      try {
        setShowModal(false);
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

  return (
    <div className="p-10">
      <h1 className="font-bold text-black text-xl py-5">Departments</h1>
      
        <div className="flex flex-wrap gap-4">
          <div
            className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
            onClick={() => setShowModal(true)}
          >
            +
          </div>
          {organization && organization.data.departments.map((dept, index) => (
            <div
              key={index}
              className="w-full sm:w-48 h-32 bg-black text-white flex items-center justify-center text-4xl rounded-md hover:scale-105 hover:opacity-75 hover:cursor-pointer transition-transform"
              onClick={()=>navigate("/department/"+dept._id)}
            >
              {dept.name}
            </div>
          ))}
        </div>
      
    
      {showModal && (
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
                onClick={() => setShowModal(false)}
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
    </div>
  );
};

export default OrganizationPage;