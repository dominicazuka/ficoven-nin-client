import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { Redirect } from "react-router-dom";
import { Country } from "country-state-city";
import { getErrorMessage, isSuperAdmin, lowerCase, validateEmail } from "../utils";
import { useAuthContext } from "../contexts/AuthContext";
import "../components/react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Helmet } from "react-helmet";
import swal from "sweetalert";
import { registerUser } from "../libs/auth";

function Registerscreen() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [phone_no, setphone_no] = useState("");
  const [password, setpassword] = useState("");
  const [cpassword, setcpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [role, setRole] = useState("");
  

  const [nameError, setnameError] = useState("");
  const [emailError, setemailError] = useState("");
  const [phone_noError, setphone_noError] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [cpasswordError, setcpasswordError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [roleError, setRoleError] = useState("");

  const {
    authState: { user }, authDispatch
  } = useAuthContext();

  const filterCountries = Country.getAllCountries();

  const handleCountryInput = (code) => {
    try {
      setCountryCode(code);
      const filterCountry = filterCountries.find((c) => c.isoCode === code);
      setCountry(filterCountry.name);
      setCountryError("");
    } catch (error) {
    }
  };

  const handleNameInput = (e) => {
    setname(e.target.value);
    setnameError("");
  };

  const handleEmailInput = (e) => {
    setemail(e.target.value);
    setemailError("");
  };

  const handlePhoneInput = (e) => {
    setphone_no(e);
    setphone_noError("");
  };

  const handlePasswordInput = (e) => {
    setpassword(e.target.value);
    setpasswordError("");
  };

  const handleCPasswordInput = (e) => {
    setcpassword(e.target.value);
    setcpasswordError("");
  };
  const handleRoleInput = (e) => {
    setRole(e.target.value);
    setRoleError("");
  };

  const clearInputs = () => {
    setname("");
    setemail("");
    setphone_no("");
    setpassword("");
    setcpassword("");
    setRole("")
    setCountry("")
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      let isError = false;
      if (country.trim() === "none" || country.trim() === "") {
        setCountryError("Please select country");
        isError = true;
      }
      if (name.trim() === "none" || name.trim() === "") {
        setnameError("Please input full name");
        isError = true;
      }
      if (!validateEmail(email.trim())) {
        setemailError("Please input a valid email address");
        isError = true;
      }
      if (role.trim() === "none" || role.trim() === "") {
        setRoleError("Please select role");
        isError = true;
      }
      if (phone_no === "none" || phone_no === "") {
        setphone_noError("Please input valid phone number");
        isError = true;
      }
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
        const user = {
          name,
          email,
          phone_no,
          password,
          cpassword,
          role,
          country,
          countryCode,
        };
        setloading(true);
        const {msg, error} = await registerUser(user, authDispatch);
        swal(error ? "Oops" : "Great",msg,!error ? "success" : "error");
        setloading(false);
        if(!error){
        clearInputs();
        }
      } else {
        swal("Oops","Passwords do not match","error")
      }
    } catch (error) {
      swal("Oops",getErrorMessage(error),"error")
      setloading(false);
    }
  };

  if (!isSuperAdmin.includes(lowerCase(user.role))) {
    return <Redirect to="/admin" />;
  }
 
  return (
    <div>
      <Helmet>
        <title>Add Admin User</title>
      </Helmet>
      <div className="row justify-content-center mt-3">
        <div className="col-md-4 mt-3 mb-5">
          <div className="bs reg">
            <h2>Add New Admin</h2>
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
            <input
              type="text"
              className="mt-3 rounded form-control mt-2"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                handleEmailInput(e);
              }}
            />
            <p className="text-danger">{emailError}</p>
            <select
              className="mt-3"
              onChange={(e) => {
                handleRoleInput(e);
              }}
              value={role}
            >
              <option>Select Role</option>
              <option>Admin</option>
              <option>Moderator</option>
            </select>
            <p className="text-danger">{roleError}</p>

            <select
              className="col-md-12 mt-3 required"
              onChange={(e) => handleCountryInput(e.target.value)}
            >
              <option selected value="None">
                Select Country
              </option>
              {filterCountries.map((country) => (
                <option value={country.isoCode} key={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            <p className="text-danger">{countryError}</p>

            <PhoneInput
              value={phone_no}
              onChange={(e) => {
                handlePhoneInput(e);
              }}
              className="mt-3 rounded form-control mt-2"
            />
            <p className="text-danger">{phone_noError}</p>
            <input
              type="password"
              className="mt-3 rounded form-control mt-2"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                handlePasswordInput(e);
              }}
            />
            <p className="text-danger">{passwordError}</p>
            <input
              type="password"
              className="mt-3 rounded form-control mt-2"
              placeholder="Confirm password"
              value={cpassword}
              onChange={(e) => {
                handleCPasswordInput(e);
              }}
            />
            <p className="text-danger">{cpasswordError}</p>

            {loading && <Loader />}
            <button
              className="w-100 rounded btn bg-green btn-primary mt-3"
              onClick={(e) => register(e)}
            >
              Register
            </button>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
