import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon, 
  PencilIcon, 
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:5000/api/user/${id}`);
        if (response.status === 200 && response.data.success) {
          setData(response.data.data);
        } else {
          throw new Error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("Failed to fetch user details");
        toast.error("Failed to fetch user details");
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id, navigate]);

  const deleteUser = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setDeleting(true);
      const response = await axios.delete(`http://localhost:5000/api/user/${id}`);
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "User deleted successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete user");
      }
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`inline-block w-8 h-8 border-4 border-t-transparent rounded-full ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}
          />
          <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading user details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
            <ExclamationTriangleIcon className={`h-8 w-8 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            User Not Found
          </h2>
          <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error || "The user you're looking for doesn't exist."}
          </p>
          <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {error && "Redirecting to home page..."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const InfoCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Link
            to="/"
            className={`inline-flex items-center px-4 py-2 rounded-lg border transition-colors duration-200 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Users
          </Link>
          
          <div className="flex space-x-3">
            <Link
              to={`/editUser/${id}`}
              className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit User
            </Link>
            <button
              onClick={deleteUser}
              disabled={deleting}
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                deleting 
                  ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              {deleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full mr-2"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete User
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl overflow-hidden`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-4 text-3xl font-bold">
              {data.Name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h1 className="text-3xl font-bold mb-2">{data.Name}</h1>
            <p className="text-blue-100">User Profile</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={EnvelopeIcon}
                label="Email Address"
                value={data.Email}
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
              <InfoCard
                icon={PhoneIcon}
                label="Contact Number"
                value={data.Contact}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
              <InfoCard
                icon={CalendarIcon}
                label="Date Added"
                value={new Date(data.createdAt).toLocaleDateString()}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
              <InfoCard
                icon={ClockIcon}
                label="Last Updated"
                value={new Date(data.updatedAt).toLocaleDateString()}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`mt-8 p-6 rounded-lg border ${isDarkMode ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'}`}
            >
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>User ID:</span>
                  <span className={`ml-2 font-mono ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{data._id}</span>
                </div>
                <div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Account Status:</span>
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ViewUser;
