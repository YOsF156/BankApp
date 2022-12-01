import React, { useEffect, useState } from "react";
import "./App.css";
import { Authenticate } from "./components/Authenticate";

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let Options = {
      method: "POST",
      body: JSON.stringify({
        fullName: "lir haim",
        email: "liro@gmail.com",
        password: "98372jhxz",
      }),
    };

    fetch("http://localhost:5000/api/user")
      .then((response) => response.json())
      .then((result) => setUsers(result))
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <>
      <div>{users.length > 0 && users[0].email}</div>
      <Authenticate users={users} />
    </>
  );
}

export default App;
