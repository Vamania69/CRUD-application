import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
function Navbar() {
    const [activateTab, setActivateTab] = useState("Home");

    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/") {
            setActivateTab("Home");
        } else if (location.pathname === "/AddUser") {
            setActivateTab("AddUser");
        } else if (location.pathname === "/viewUser") {
            setActivateTab("ViewUser");
        }
    });

    return (
        <div>
            <div className="flex text-lg py-2 border-b-2 border-gray-700 justify-end px-10 space-x-10">
                <div
                    className={`${activateTab === "Home"
                        ? "text-blue-600 rounded-lg p-2 dark:bg-gray-900"
                        : "p-2"
                        }`}
                    onClick={() => setActivateTab("Home")}
                >
                    <Link to={"/"}>Home</Link>
                </div>
                <div
                    className={`${activateTab === "AddUser"
                        ? "text-blue-600 rounded-lg p-2 dark:bg-gray-900"
                        : "p-2"
                        }`}
                    onClick={() => setActivateTab("AddUser")}
                >
                    <Link to={"/AddUser"}>Add User</Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
