import React, { useEffect, useState } from "react";
import DATA from "../data";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { ClientDashboard } from "./ClientDashboard";
import axios from "axios";
import { URL } from "./try";

export const Authenticate = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: "", style: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [client, setClient] = useState(null);
  const [users, setUsers] = useState("")
  // const localUsers = localStorage.getItem("users");
  // const clients = JSON.parse(localStorage.getItem("users"));


  const getAllUsersData = async () => {
    localStorage.clear();
    try {

      const res = await axios.get(URL + "user")

      localStorage.setItem("users", JSON.stringify(res.data));

      setUsers(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const isLoginSuccess = async (email, password) => {
    try {
      let isFound;
      const res = await axios.post(URL + "user/login", {
        email,
        password,
      });

      if (res.name === "AxiosError") throw res;

      const userDetails = await axios.get(
        URL + `user/details/${res.data.userId}`
      );

      if (userDetails.isAdmin) {
        setIsAdmin(true);
        setClient(userDetails.data);
        isFound = true;
      } else {
        setIsAdmin(false);
        setClient(userDetails.data);
        isFound = true;
      }
      setNotif("");
      setIsLoggedIn(true);
      getAllUsersData()
      return isFound;
    } catch (error) {
      console.log({ error });
      setNotif({ message: error.response.data?.error?.message, style: "danger" });
      return false;
    }
  };



  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("client");
    localStorage.removeItem("users");
    setNotif({ message: "You have logged out.", style: "success" });
  };

  if (isLoggedIn) {
    localStorage.setItem("currentUser", JSON.stringify(client));
    if (isAdmin) {
      return <Dashboard users={users} logoutHandler={logout} />;
    } else {
      return (
        <ClientDashboard
          client={client}
          users={users}
          setClient={setClient}
          logout={logout}
        />
      );
    }
  } else {
    return (
      <LoginPage
        users={props.users}
        loginHandler={isLoginSuccess}
        notif={notif}
        isLoggedIn={isLoggedIn}
      />
    );
  }
};
