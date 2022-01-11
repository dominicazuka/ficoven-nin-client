import React, { useState } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { Helmet } from "react-helmet";
import { useAuthContext } from "../contexts/AuthContext";
import swal from "sweetalert";
import PhoneInput from "react-phone-number-input";
import { changePassword, checkAuthUser, updateDetails } from "../libs/auth";
import { validateEmail } from "../utils";

function Profilescreen() {
  const {
    authState: { user },
    authDispatch,
  } = useAuthContext();

  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_no);
  const [name, setname] = useState(user.name);
  const [passwordError, setpasswordError] = useState("");
  const [cpasswordError, setcpasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setnameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);

  const handleNameInput = (e) => {
    setname(e.target.value);
    setnameError("");
  };

  const handlePasswordInput = (e) => {
    setpassword(e.target.value);
    setpasswordError("");
  };

  const handleCPasswordInput = (e) => {
    setcpassword(e.target.value);
    setcpasswordError("");
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePhoneInput = (e) => {
    setPhoneNumber(e);
    setPhoneNumberError("");
  };

  const clearInput = () => {
    setpassword("");
    setcpassword("");
  };

  const handlePasswordUpdate = async (e, _id) => {
    e.preventDefault();
    try {
      let isError = false;
      if (password.trim() === "none" || password.trim() === "") {
        setpasswordError("Please input password");
        isError = true;
      }
      if (cpassword.trim() === "none" || cpassword.trim() === "") {
        setcpasswordError("Please confirm password");
        isError = true;
      }
      if (isError) return false;

      if (password === cpassword) {
        setloading2(true);
        const { error, msg } = await changePassword({ password });
        setloading2(false);
        swal(error ? "Oops" : "Great", msg, !error ? "success" : "error");
        clearInput();
      } else {
        swal("Oops", "Passwords do not match", "error");
      }
    } catch (error) {
      swal("Oops", error, "error");
      setloading2(false);
    }
  };

  const handleEmailPhoneNumberUpdate = async (e) => {
    e.preventDefault();
    try {
      let isError = false;
      if (email.trim() === "none" || email.trim() === "") {
        setEmailError("Please input email");
        isError = true;
      }
      if (name.trim() === "none" || name.trim() === "") {
        setnameError("Please input full name");
        isError = true;
      }
      if (!validateEmail(email.trim())) {
        setEmailError("Please input a valid email address");
        isError = true;
      }
      if (phoneNumber.trim() === "none" || phoneNumber.trim() === "") {
        setPhoneNumberError("Please input phone number");
        isError = true;
      }
      if (isError) return false;
      setloading(true);
      const { error, msg } = await updateDetails(authDispatch, {
        phone_no: phoneNumber,
        email,
        _id: user._id,
        name,
      });
      setloading(false);
      swal(error ? "Oops" : "Great", msg, !error ? "success" : "error");
      if (!error) {
        const _user = checkAuthUser();
        if (_user) {
          const updateUser = { ..._user, phone_no: phoneNumber, email, name };
          return localStorage.setItem("_f_user", JSON.stringify(updateUser));
        }
      }
    } catch (error) {
      swal("Oops", error, "error");
      setloading(false);
    }
  };

  return (
    <div className="container col-lg-4 mt-5">
      <Helmet>
        <title>My Profile</title>
      </Helmet>
      <Card>
        <div className="card-header">
          <Link to={`/admin`}>
            <button className="btn btn-success">&larr;</button>
          </Link>
        </div>
        <div className="row mt-3">
          <div className="col-lg-12 text-center">
            <h1 className="text-center">My Profile</h1>
            <br />
            <h1>Name: {user.name}</h1>
            <h1>Role: {user.role}</h1>
            <h1>Country: {user.country}</h1>
            <h1>Email: {user.email}</h1>
            <h1>Phone Number: {user.phone_no}</h1>
          </div>
        </div>
      </Card>

      <Card>
        <div className="row mt-3">
          <div className="col-lg-12 text-center">
            <h1 className="text-center">
              Update Details (Name, Email &amp; Phone Number)
            </h1>
          </div>

          <div class="row mt-3 mr-3 ml-3">
            <div class="col-md-12 pb-2">
              <div class="form-outline form-white">
                <input
                  type="text"
                  className="rounded form-control"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => {
                    handleNameInput(e);
                  }}
                />
                <p className="text-danger">{nameError}</p>
              </div>
            </div>

            <div class="col-md-12">
              <div class="form-outline">
                <input
                  type="text"
                  class="form-control form-control-lg userScreenInputs"
                  onChange={handleEmailInput}
                  value={email}
                  placeholder="Change your email"
                />
                <p className="text-danger">{emailError}</p>
              </div>
            </div>

            <div class="col-md-12 pb-2">
              <div class="form-outline form-white">
                <PhoneInput
                  type="text"
                  className="rounded form-control mt-2"
                  onChange={handlePhoneInput}
                  value={phoneNumber}
                  placeholder="Change your phone number"
                />
                <p className="text-danger">{phoneNumberError}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mt-3">
            <div className="form-outline form-white">
              {loading && <Loader />}
              <button
                className="rounded w-100 btn btn-primary"
                onClick={(e) => handleEmailPhoneNumberUpdate(e)}
              >
                Update
              </button>
              <p className="text-danger"></p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="row mt-3">
          <div className="col-lg-12 text-center">
            <h1 className="text-center">Update Password</h1>
          </div>
          <div class="row mt-3 mr-3 ml-3">
            <div class="col-md-6">
              <div class="form-outline form-white">
                <input
                  type="password"
                  class="form-control form-control-lg userScreenInputs"
                  onChange={handlePasswordInput}
                  value={password}
                  placeholder="Enter your password"
                />
                <p className="text-danger">{passwordError}</p>
              </div>
            </div>

            <div class="col-md-6">
              <div class="form-outline">
                <input
                  type="password"
                  class="form-control form-control-lg userScreenInputs"
                  onChange={handleCPasswordInput}
                  value={cpassword}
                  placeholder="Confirm your password"
                />
                <p className="text-danger">{cpasswordError}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mt-3">
            <div className="form-outline form-white">
              {loading2 && <Loader />}
              <button
                className="rounded w-100 btn btn-primary"
                onClick={(e) => handlePasswordUpdate(e)}
              >
                Update
              </button>
              <p className="text-danger"></p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Profilescreen;
