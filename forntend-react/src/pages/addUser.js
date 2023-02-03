import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
// import useHistory from "react-router-dom";

// const history = useHistory();
const initalstate = {
  Name: "",
  Email: "",
  Contact: "",
};

function AddUser() {
  //   const history = useHistory();
  const [user, setUser] = useState(initalstate);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id) {
      addUser();
    } else {
      updateUser(user, id);
    }
  };

  const handleValue = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  //add user with details
  const addUser = async (data) => {
    const response = await axios.post("http://localhost:5000/user", user);
    if (response.status === 200) {
      console.log(response.data);
      toast.success(response.data);
    }
  };

  //updating user

  const updateUser = async (updatedData, id) => {
    const response = await axios.put(
      `http://localhost:5000/user/${id}`,
      updatedData
    );
    if (response.status === 200) {
      toast.success("User Updated sucessfullY");
    }
  };

  const { id } = useParams();
  useEffect(() => {
    getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    if (id) {
      const response = await axios.get(`http://localhost:5000/user/${id}`);
      if (response.status === 200) {
        setUser({ ...response.data[0] });
      }
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="my-5 text-center text-2xl ">Add users </h2>

      <form
        className="dark:bg-gray-900 my-5 w-1/2 text-lg p-8 rounded-md"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <label
            for="username"
            className="block mb-2  font-medium text-gray-800 dark:text-white"
          >
            User Name
          </label>
          <input
            onChange={handleValue}
            type="name"
            value={user.Name}
            id="username"
            name="Name"
            className="bg-gray-50 border border-gray-300 text-gray-900  rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="username"
            required
          />

          <label
            for="email"
            className="block mb-2  font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            value={user.Email}
            type="email"
            name="Email"
            id="email"
            onChange={handleValue}
            placeholder="email"
            className="bg-gray-50 border
            border-gray-300 text-gray-900  rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full
                p-2.5 dark:bg-gray-700 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          <label
            for="contact"
            className="block mb-2  font-medium text-gray-900 dark:text-white"
          >
            Your contact
          </label>
          <input
            type="contact"
            value={user.Contact}
            name="Contact"
            placeholder="contact"
            id="contact"
            onChange={handleValue}
            className="bg-gray-50 border
            border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 focus:border-blue-500 block w-full
                p-2.5 dark:bg-gray-700 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white
                dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="remember"
              type="checkbox"
              value=""
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
              required
            />
          </div>
          <label
            for="remember"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Remember me
          </label>
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {id ? "Update" : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddUser;
