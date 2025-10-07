import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  //we define the api call getuser to get the user data
  const getUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:5000/api/users");
      if (response.status === 200 && response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again.");
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setDeletingId(id);
        const response = await axios.delete(`http://localhost:5000/api/user/${id}`);
        if (response.status === 200 && response.data.success) {
          toast.success(response.data.message || "User Deleted Successfully");
          await getUser(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Failed to delete user");
        }
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading users...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={getUser}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <Link
          to="/addUser"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
        >
          + Add User
        </Link>
      </div>

      {/* Users count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Total users: <span className="font-semibold">{data.length}</span>
        </p>
      </div>

      {/* Empty state */}
      {data.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No users found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Get started by adding your first user.
          </p>
          <Link
            to="/addUser"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add First User
          </Link>
        </div>
      ) : (
        /* Users table */
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 font-medium">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-center font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((user) => (
                  <tr
                    key={user._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {user.Name}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {user.Email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {user.Contact}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/ViewUser/${user._id}`}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-200"
                          title="View User"
                        >
                          View
                        </Link>
                        <Link
                          to={`/editUser/${user._id}`}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs transition-colors duration-200"
                          title="Edit User"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteUser(user._id)}
                          disabled={deletingId === user._id}
                          className={`font-bold py-1 px-3 rounded text-xs transition-colors duration-200 ${
                            deletingId === user._id
                              ? "bg-gray-400 cursor-not-allowed text-gray-700"
                              : "bg-red-500 hover:bg-red-700 text-white"
                          }`}
                          title="Delete User"
                        >
                          {deletingId === user._id ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              Del...
                            </div>
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
