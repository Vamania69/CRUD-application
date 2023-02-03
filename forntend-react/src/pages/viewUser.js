import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import axios from "axios";

function ViewUser() {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    //to get all the user we run the fuction
    getUser();
  }, []);

  //we define the api call getuser to get the user data
  const getUser = async () => {
    const response = await axios.get(`http://localhost:5000/user/${id}`);
    if (response.status === 200) {
      console.log(response);
      setData(response.data[0]);
    } else console.log("There is some issue in fething the data");
  };

  return (
    <div>
      <div className=" m-2 p-6 dark:bg-gray-900 text-gray-400 border-gray-600 border-2 rounded-lg text-center shadow-lg">
        <div className="flex justify-center items-center">
          <div className="text-lg text-center   font-medium">{data.Name}</div>
        </div>
        <div className="mt-4 ">{data.Email}</div>
        <div className="mt-4 ">{data.Contact}</div>
        <div className="mt-4 ">
          A short description of the user goes here. It can be a couple of
          sentences long.
        </div>
      </div>
    </div>
  );
}
export default ViewUser;
