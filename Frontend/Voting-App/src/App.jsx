import { useState } from "react";
import UserForm from "./pages/signup";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="user/login" element={<Login />} />
      <Route path="user/dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;
