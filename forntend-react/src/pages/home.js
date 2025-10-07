import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  UsersIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

const SORT_OPTIONS = [
  { value: "Name", label: "Name" },
  { value: "Email", label: "Email" },
  { value: "createdAt", label: "Date Added" },
  { value: "Contact", label: "Contact" }
];

const FILTER_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "recent", label: "Added This Week" }
];

const Home = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Name");
  const [filterBy, setFilterBy] = useState("all");
  const [stats, setStats] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { isDarkMode } = useTheme();

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/users");
      
      if (response.status === 200 && response.data.success) {
        const userData = response.data.data || [];
        setUsers(userData);
        
        // Calculate stats
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const recentUsers = userData.filter(user => 
          new Date(user.createdAt) > weekAgo
        );
        
        setStats({
          total: userData.length,
          recent: recentUsers.length
        });
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      setDeletingId(id);
      const response = await axios.delete(`http://localhost:5000/api/user/${id}`);
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "User deleted successfully!");
        loadUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete user. Please try again.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.Contact?.includes(searchTerm);
      
      if (!matchesSearch) return false;
      
      switch (filterBy) {
        case "recent":
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return new Date(user.createdAt) > weekAgo;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Name":
          return a.Name?.localeCompare(b.Name) || 0;
        case "Email":
          return a.Email?.localeCompare(b.Email) || 0;
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "Contact":
          return a.Contact?.localeCompare(b.Contact) || 0;
        default:
          return 0;
      }
    });

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{label}</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const UserCard = ({ user, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg hover:shadow-xl transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            <UserIcon className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {user.Name}
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Added {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Link
            to={`/ViewUser/${user._id}`}
            className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200`}
          >
            <EyeIcon className="h-4 w-4" />
          </Link>
          <Link
            to={`/editUser/${user._id}`}
            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors duration-200"
          >
            <PencilIcon className="h-4 w-4" />
          </Link>
          <button
            onClick={() => deleteUser(user._id)}
            disabled={deletingId === user._id}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              deletingId === user._id
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-100 hover:bg-red-200 text-red-600"
            }`}
          >
            {deletingId === user._id ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"
              />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <EnvelopeIcon className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.Email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <PhoneIcon className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{user.Contact}</span>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`inline-block w-8 h-8 border-4 border-t-transparent rounded-full ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}
          />
          <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              User Management
            </h1>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your users with ease
            </p>
          </div>
          <Link
            to="/addUser"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New User
          </Link>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              icon={UsersIcon}
              label="Total Users"
              value={stats.total}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
            />
            <StatCard
              icon={ClockIcon}
              label="Added This Week"
              value={stats.recent}
              color="bg-gradient-to-r from-green-500 to-green-600"
            />
          </div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-6 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-lg`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md relative">
              <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors duration-200`}
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Sort by
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      {SORT_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Filter by
                    </label>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      {FILTER_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Users Grid */}
        {filteredAndSortedUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map((user, index) => (
              <UserCard key={user._id} user={user} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <UserIcon className={`mx-auto h-12 w-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`mt-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              {searchTerm || filterBy !== "all" ? "No users found" : "No users yet"}
            </h3>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchTerm || filterBy !== "all" 
                ? "Try adjusting your search or filters" 
                : "Get started by adding your first user"
              }
            </p>
            {!searchTerm && filterBy === "all" && (
              <Link
                to="/addUser"
                className="mt-4 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Your First User
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
