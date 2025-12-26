import React, { useState } from "react";
import { Container } from "@mui/material";
import TodoApp from "./Components/TodoApp";
import LoginPage from "./Components/LoginPage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  function handleLogin() {
    setIsLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <Container>
      {isLoggedIn ? (
        <TodoApp onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </Container>
  );
}
