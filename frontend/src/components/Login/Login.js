import React from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { loginstore } from "../../store/LoginStore/LoginStore";
import { observer } from "mobx-react-lite";
import "./Login.css";
// import img from "../../assests/character.png";
import img from "../../assests/logo1.png";
import { toJS } from "mobx";
import { handleLogin, handleForgotPassword } from "./LoginModules";
 import { Navigate, useNavigate } from "react-router-dom";
import { validateForm } from "./ValidateForm";

const Login = observer(() => {
  const navigate = useNavigate();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    loginstore.setFormField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const loginResult = await handleLogin();
      if (loginResult) {
        if (localStorage) {
          navigate("/sidebar/dashboard");
        }
      } else {
        loginstore.showAlert("Invalid Credentials..");
        return;
      }
    } else {
      console.log(
        "Your Validate Form is not Working, Please fill all the fields"
      );
      return;
    }
    loginstore.clearFormFields();
  };
  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Welcome Back!</h2>
        <p>Unlock the World of Knowledge</p>
        <div className="login-input-group">
          <label>UserName</label>
          <div className="login-input-icon">
            <FaUser className="login-profile-icon" />{" "}
            <input
              type="text"
              name="username"
              autoComplete="none"
              value={loginstore.formFields.username}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Enter Your UserName"
            />
          </div>
          {loginstore.errors.username && (
            <p className="login-error-design">
              {toJS(loginstore.errors).username}
            </p>
          )}
        </div>

        <div className="login-input-group">
          <label>Password</label>
          <div className="login-input-icon">
            <FaLock className="login-lock-icon" />
            <input
              name="password"
              type="password"
              value={loginstore.formFields.password}
              onChange={handleInputChange}
              className="login-input"
              placeholder="Enter Your Password"
            />
          </div>
          {loginstore.errors.password && (
            <p className="login-error-design">
              {toJS(loginstore.errors).password}
            </p>
          )}
          <p className="login-forgot-password">Forgotten Password?</p>
        </div>

        <button className="login-button" type="submit">
          Login
        </button>
      </form>

      <div className="login-background-image">
        <img src={img} alt="image"></img>
      </div>
    </div>
  );
});

export default Login;
