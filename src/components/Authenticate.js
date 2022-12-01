import React, { useState } from "react";
import DATA from "../data";
import { Dashboard } from "./Dashboard";
import { LoginPage } from "./LoginPage";
import { ClientDashboard } from "./ClientDashboard";
import axios from "axios";

export const Authenticate = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notif, setNotif] = useState({ message: "", style: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [client, setClient] = useState(null);
  const localUsers = localStorage.getItem("users");
  const clients = JSON.parse(localStorage.getItem("users"));

  if (!localUsers) {
    localStorage.setItem("users", JSON.stringify(DATA));
  }

  const isLoginSuccess = async (email, password) => {
    try {
      let isFound;
      const res = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      if (res.name === "AxiosError") throw res;

      const userDetails = await axios.get(
        `http://localhost:5000/api/user/details/${res.data.userId}`
      );
      console.log(userDetails.data);

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
      return isFound;
    } catch (error) {
      console.log({ error });
      setNotif({ message: error.response.data.error.message, style: "danger" });
      return false;
    }
  };

  const login = (username, password) => {
    isLoginSuccess(username, password);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("client");
    setNotif({ message: "You have logged out.", style: "success" });
  };

  if (isLoggedIn) {
    console.log(client);
    localStorage.setItem("currentUser", JSON.stringify(client));
    if (isAdmin) {
      return <Dashboard users={clients} logoutHandler={logout} />;
    } else {
      return (
        <ClientDashboard
          client={client}
          users={clients}
          setClient={setClient}
          logout={logout}
        />
      );
    }
  } else {
    return (
      <LoginPage
        users={props.users}
        loginHandler={login}
        notif={notif}
        isLoggedIn={isLoggedIn}
      />
    );
  }
};
