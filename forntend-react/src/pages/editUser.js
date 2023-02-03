import React from "react";

function editUser() {
  return (
    <div>
      <h1>about</h1>
      <div className="bg-white p-6 rounded-lg text-center shadow-lg">
        <div className="flex justify-center items-center">
          <div className="text-lg text-center   font-medium">User Name</div>
        </div>

        <div className="mt-4 text-gray-600">user@email.com</div>
        <div className="mt-4 text-gray-600">Contact ID: 123456</div>

        <div className="mt-4 text-gray-600">
          A short description of the user goes here. It can be a couple of
          sentences long.
        </div>
      </div>
    </div>
  );
}

export default editUser;
