import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AddEmployee, AssignHead, GetDepartmentById, selectDepartment } from "../department/departmentSlice";

const DepartmentPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const department = useSelector(selectDepartment);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAssignHeadModal, setShowAssignHeadModal] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(GetDepartmentById(params.id));
  }, [dispatch, params.id]);

  const handleDeleteEmployee = (employeeId) => {
    // In a real app, you would dispatch an action to delete the employee
    console.log("Delete employee with ID:", employeeId);
    // dispatch(deleteEmployee(employeeId));
  };

  const handleAddEmployee = () => {
    dispatch(AddEmployee({"id":params.id, "object":{"email":email}}))
    console.log("Adding employee with email:", email);
    setEmail("");
    setShowAddModal(false);
  };

  const handleAssignHead = () => {
    dispatch(AssignHead({"id":params.id, "object":{"email":email}}))
    console.log("Assigning head with email:", email);
    setEmail("");
    setShowAssignHeadModal(false);
  };

  if (!department) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Department Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">{department.department.name}</h1>
          <p className="text-gray-600">{department.department.organization.name}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Employees List */}
          <div className="md:w-1/2 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">Employees</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Add Employee
              </button>
            </div>
            
            {department.department.employees && department.department.employees.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {department.department.employees.map((employee) => (
                  <li key={employee.id} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-black font-medium">
                        {employee.name.charAt(0)}
                      </div>
                      <span className="ml-3 text-black">{employee.name}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No employees found.</p>
              </div>
            )}
          </div>

          {/* Right Side - Department Info */}
          <div className="md:w-1/2 bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-black mb-6">Department Details</h2>
            
            {/* Department Head */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-black">Department Head</h3>
                {!department.department.head && (
                  <button 
                    onClick={() => setShowAssignHeadModal(true)}
                    className="px-3 py-1 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm"
                  >
                    Assign Head
                  </button>
                )}
              </div>
              {department.department.head ? (
                <div className="mt-3 flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-black font-medium">
                    {department.department.head.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-black">{department.department.head.name}</p>
                    <p className="text-gray-600 text-sm">Department Head</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-gray-600">No head assigned</p>
              )}
            </div>

            {/* Organization Info */}
            <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium text-black mb-2">Organization</h3>
              <p className="text-black">{department.department.organization.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Employee</h2>
            <div className="mb-4">
              <label className="block text-black mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter email address"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setEmail("");
                  setShowAddModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddEmployee}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Head Modal */}
      {showAssignHeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Assign Department Head</h2>
            <div className="mb-4">
              <label className="block text-black mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter email address"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => {
                  setEmail("");
                  setShowAssignHeadModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleAssignHead}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPage;