import React, { useState } from "react";
import Loader from "../components/Loader";
import { useAuthContext } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import { loginUser } from "../libs/auth";
import { Helmet } from "react-helmet";
import swal from "sweetalert";
import { getErrorMessage, validateEmail } from "../utils";

function Loginscreen() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  // const [error, seterror] = useState();
  const [message, setMessage] = useState("")

  const [emailError, setemailError] = useState("");
  const [passwordError, setpasswordError] = useState("");

  const {
    authState: { isAuthenticated, isAuthenticating },
    authDispatch,
  } = useAuthContext();

  const handleEmailInput = (e) => {
    setemail(e.target.value);
    setemailError("");
    setMessage("")
  };

  const handlePasswordInput = (e) => {
    setpassword(e.target.value);
    setpasswordError("");
    setMessage("")
  };

  async function Login(e) {
    e.preventDefault();
    
    try {
      setMessage("")
      let isError = false;
      if (!validateEmail(email.trim())) {
        setemailError("Please input valid email");
        isError = true;
      }
      if (password.trim() === "none" || password.trim() === "") {
        setpasswordError("Please input password");
        isError = true;
      }

      if (isError) return false;

      const user = {
        email,
        password,
      };
      setloading(true);
      const res = await loginUser(user, authDispatch);
      setMessage(res.msg)
      setloading(false);
      if (!res.error) {
        return localStorage.setItem("_f_user", JSON.stringify(res.data));
      }
      swal("Oops",res.msg,"error")
    } catch (error) {
      swal("Oops",getErrorMessage(error),"error")
      setloading(false);
    }
  }
  if (isAuthenticated) {
    swal("Great", "Login successful", "success");
    return <Redirect to="/admin" />;
  }

  return (
    <div>
      <Helmet>
        <title>Admin Login</title>
      </Helmet>
      <div className="row justify-content-center mt-5">
        <div className="col-md-4 mt-5">
          {/* {error && <Error message="Invalid Credentials" />} */}
          <div className="bs">
            <h2>Login</h2>
            <input
              type="text"
              className="form-control rounded"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => {
                handleEmailInput(e);
              }}
            />
            <p className="text-danger">{emailError}</p>
            <input
              type="password"
              className="form-control mt-4 rounded"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => {
                handlePasswordInput(e);
              }}
            />
            <p className="text-danger">{passwordError}</p>
            {loading && <Loader />}
            <button
              className="rounded w-100 btn bg-green btn-primary mt-3"
              onClick={(e) => Login(e)}
            >
              Login
            </button>
            <br />
            {/* <p className="mt-2">Don't have an account?</p>
                        <Link style={{color:'black'}} to="/register" className="mt-2">Click here to register</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginscreen;
