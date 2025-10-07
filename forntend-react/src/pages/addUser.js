import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlusIcon, 
  PencilIcon, 
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckCircleIcon,
  ExclamationCircleIcon 
} from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";

// Validation schema
const userSchema = yup.object().shape({
  Name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  Email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters"),
  Contact: yup
    .string()
    .required("Contact number is required")
    .matches(
      /^[+]?[\d\-()s]{10,20}$/,
      "Please enter a valid contact number (10-20 digits)"
    ),
});

function AddUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(!!id);
  const { isDarkMode } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: "onChange", // Validate on change for real-time feedback
    defaultValues: {
      Name: "",
      Email: "",
      Contact: "",
    },
  });

  // Watch for real-time validation feedback
  const watchedFields = watch();

  // Fetch user data for editing
  const getSingleUser = useCallback(async () => {
    if (id) {
      setIsLoadingUser(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${id}`);
        if (response.status === 200 && response.data.success) {
          const userData = response.data.data;
          setValue("Name", userData.Name);
          setValue("Email", userData.Email);
          setValue("Contact", userData.Contact);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user details");
        navigate("/"); // Redirect to home if user not found
      } finally {
        setIsLoadingUser(false);
      }
    }
  }, [id, setValue, navigate]);

  useEffect(() => {
    getSingleUser();
  }, [getSingleUser]);

  // Submit handler
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (!id) {
        await addUser(data);
      } else {
        await updateUser(data, id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add user
  const addUser = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/api/user", data);
      if (response.status === 201 && response.data.success) {
        toast.success(response.data.message || "User Added Successfully");
        reset(); // Reset form after successful submission
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      console.error("Error adding user:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        error.response.data.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add user");
      }
    }
  };

  // Update user
  const updateUser = async (data, id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/user/${id}`,
        data
      );
      if (response.status === 200 && response.data.success) {
        toast.success(response.data.message || "User Updated Successfully");
        navigate("/"); // Redirect to home page
      }
    } catch (error) {
      console.error("Error updating user:", error);
      if (error.response?.data?.errors) {
        // Handle validation errors from backend
        error.response.data.errors.forEach((err) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update user");
      }
    }
  };

  // Loading state for fetching user data
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`inline-block w-8 h-8 border-4 border-t-transparent rounded-full ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}
          />
          <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Loading user data...</p>
        </div>
      </div>
    );
  }

  const InputField = ({ label, name, type = "text", placeholder, icon: Icon }) => {
    const hasError = errors[name];
    const hasValue = watchedFields[name];
    const isValid = hasValue && !hasError;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
        >
          {label} *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : isValid ? 'text-green-400' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            {...register(name)}
            type={type}
            id={name}
            placeholder={placeholder}
            className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200 ${
              hasError
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                : isValid
                ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                : isDarkMode
                ? 'border-gray-600 focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white placeholder-gray-400'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500'
            } focus:ring-2 focus:ring-opacity-50`}
          />
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
          )}
        </div>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 text-sm text-red-600 flex items-center"
          >
            <ExclamationCircleIcon className="h-4 w-4 mr-1" />
            {errors[name].message}
          </motion.p>
        )}
        {isValid && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 text-sm text-green-600 flex items-center"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Looks good!
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
            {id ? (
              <PencilIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            ) : (
              <UserPlusIcon className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            )}
          </div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {id ? "Edit User" : "Add New User"}
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {id ? "Update the user information below" : "Fill in the details to create a new user"}
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm rounded-xl p-8 border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <InputField
              label="Full Name"
              name="Name"
              placeholder="Enter your full name"
              icon={UserIcon}
            />

            <InputField
              label="Email Address"
              name="Email"
              type="email"
              placeholder="Enter your email address"
              icon={EnvelopeIcon}
            />

            <InputField
              label="Contact Number"
              name="Contact"
              type="tel"
              placeholder="Enter your contact number"
              icon={PhoneIcon}
            />

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className={`inline-flex items-center px-6 py-3 border rounded-lg font-medium transition-all duration-200 ${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Users
              </button>

              <button
                type="submit"
                disabled={isLoading || isSubmitting || !isDirty || !isValid}
                className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isLoading || isSubmitting || !isDirty || !isValid
                    ? "bg-gray-400 cursor-not-allowed text-gray-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                }`}
              >
                {isLoading || isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    {id ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {id ? (
                      <PencilIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <UserPlusIcon className="h-5 w-5 mr-2" />
                    )}
                    {id ? "Update User" : "Add User"}
                  </>
                )}
              </button>
            </motion.div>

            {/* Form Status */}
            <AnimatePresence>
              {!isDirty && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Please fill in the form to enable submission.
                </motion.div>
              )}
              {isDirty && !isValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-center text-red-500 flex items-center justify-center"
                >
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  Please fix the errors above.
                </motion.div>
              )}
              {isDirty && isValid && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-center text-green-500 flex items-center justify-center"
                >
                  <CheckCircleIcon className="h-4 w-4 mr-1" />
                  Form is ready to submit!
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default AddUser;
