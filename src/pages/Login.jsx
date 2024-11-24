import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const server = process.env.REACT_APP_API_SERVER || "localhost";

async function loginUser(credentials) {
  try {
    const response = await fetch(`http://${server}:3002/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed!");
    }

    return await response.json();
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Username and password are required!");
      return;
    }

    setIsLoading(true);
    try {
      const token = await loginUser({ userName: username, userPassword: password });
      localStorage.setItem("authToken", token);
      setToken(token);
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to log in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-title">Inicio de Sesion</div>
        <form onSubmit={handleSubmit} className="login-frame">
          <div className="form-frame">
            <label htmlFor="user-name" className="label-field">Usuario:</label>
            <input
              type="text"
              id="user-name"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="text-field"
              required
            />
          </div>
          <div className="form-frame">
            <label htmlFor="user-password" className="label-field">Password:</label>
            <input
              type="password"
              id="user-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-field"
              required
            />
          </div>
          <div className="button-frame">
            <button type="submit" className="btn-login" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Iniciar Sesion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
