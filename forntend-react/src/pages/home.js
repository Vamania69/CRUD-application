import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    //to get all the user we run the fuction
    getUser();
  }, []);

  //we define the api call getuser to get the user data
  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users");
      if (response.status === 200 && response.data.success) {
        setData(response.data.data);
      } else {
        console.log("There is some issue in fetching the data");
        toast.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/user/${id}`);
        if (response.status === 200 && response.data.success) {
          toast.success(response.data.message || "User Deleted Successfully");
          getUser();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-center text-3xl my-3 ">All the users</h2>
      <div className="relative overflow-x-auto mt-5 shadow-md sm:rounded-lg max-w-min ">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Contact
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => {
              return (
                <tr key={user._id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {user.Name}
                  </th>
                  <td className="px-6 py-4">{user.Email}</td>
                  <td className="px-6 py-4">{user.Contact}</td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/editUser/${user._id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>

                    <Link
                      to="/"
                      onClick={() => deleteUser(user._id)}
                      className=" px-6 py-4 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Delete
                    </Link>
                    <Link
                      to={`/ViewUser/${user._id}`}
                      className=" px-6 py-4 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      ViewUser
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
