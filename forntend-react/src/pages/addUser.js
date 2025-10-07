import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          {id ? "Edit User" : "Add New User"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4"
        >
          {/* Name Field */}
          <div className="mb-6">
            <label
              htmlFor="Name"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Full Name *
            </label>
            <input
              {...register("Name")}
              type="text"
              id="Name"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.Name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Enter your full name"
            />
            {errors.Name && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.Name.message}
              </p>
            )}
            {watchedFields.Name && !errors.Name && (
              <p className="text-green-500 text-xs italic mt-1">✓ Looks good!</p>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-6">
            <label
              htmlFor="Email"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Email Address *
            </label>
            <input
              {...register("Email")}
              type="email"
              id="Email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.Email
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Enter your email address"
            />
            {errors.Email && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.Email.message}
              </p>
            )}
            {watchedFields.Email && !errors.Email && (
              <p className="text-green-500 text-xs italic mt-1">✓ Valid email!</p>
            )}
          </div>

          {/* Contact Field */}
          <div className="mb-6">
            <label
              htmlFor="Contact"
              className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            >
              Contact Number *
            </label>
            <input
              {...register("Contact")}
              type="tel"
              id="Contact"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.Contact
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
              placeholder="Enter your contact number"
            />
            {errors.Contact && (
              <p className="text-red-500 text-xs italic mt-1">
                {errors.Contact.message}
              </p>
            )}
            {watchedFields.Contact && !errors.Contact && (
              <p className="text-green-500 text-xs italic mt-1">✓ Valid contact!</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading || isSubmitting || !isDirty || !isValid}
              className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200 ${
                isLoading || isSubmitting || !isDirty || !isValid
                  ? "bg-gray-400 cursor-not-allowed text-gray-700"
                  : "bg-blue-500 hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading || isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {id ? "Updating..." : "Adding..."}
                </div>
              ) : (
                <>{id ? "Update User" : "Add User"}</>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Form Status */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {!isDirty && (
              <p>Please fill in the form to enable submission.</p>
            )}
            {isDirty && !isValid && (
              <p className="text-red-500">Please fix the errors above.</p>
            )}
            {isDirty && isValid && (
              <p className="text-green-500">Form is ready to submit!</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;
