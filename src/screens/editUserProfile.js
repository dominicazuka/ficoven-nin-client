import React, { useState } from "react";
import { Country } from "country-state-city";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { Card } from "antd";
import { Helmet } from "react-helmet";
import { useAuthContext } from "../contexts/AuthContext";
import swal from "sweetalert";
import PhoneInput from "react-phone-number-input";
import { editUser } from "../libs/auth";
import { validateEmail } from "../utils";

function EditUserProfile({history, location}) {
  const userDetails = location.state;
  const {
    authState: { user },
    authDispatch,
  } = useAuthContext();

  const [email, setEmail] = useState(userDetails.email);
  const [phoneNumber, setPhoneNumber] = useState(userDetails.phone_no);
  const [name, setname] = useState(userDetails.name);
  const [emailError, setEmailError] = useState("");
  const [nameError, setnameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [loading, setloading] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [role, setRole] = useState(userDetails.role);
  const [roleError, setRoleError] = useState("");

  const countries = Country.getAllCountries();


  const handleCountryCode = (e) => {
    try {
      setCountryCode(e.target.value);
      const _country = countries.find((c) => c.isoCode === e.target.value);
      setCountry(_country.name);
      setCountryCodeError("");
    } catch (error) {}
  };

  const handleRoleInput = (e) => {
    setRole(e.target.value);
    setRoleError("");
  };

  const handleNameInput = (e) => {
    setname(e.target.value);
    setnameError("");
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePhoneInput = (e) => {
    setPhoneNumber(e);
    setPhoneNumberError("");
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      let isError = false;
      if (name.trim() === "none" || name.trim() === "") {
        setnameError("Please input full name");
        isError = true;
      }
      if (countryCode.trim() === "none" || countryCode.trim() === "") {
        setCountryCodeError("Please select country");
        isError = true;
      }
      if (email.trim() === "none" || email.trim() === "") {
        setEmailError("Please input email");
        isError = true;
      }
      if (role.trim() === "none" || role.trim() === "") {
        setRoleError("Please select role");
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
      const { error, msg } = await editUser({
        phone_no: phoneNumber,
        email,
        _id: userDetails._id,
        name,
        country,
        countryCode,
        role
      });
      setloading(false);
      swal(error ? "Oops" : "Great", msg, !error ? "success" : "error");
      if (!error) {
        history.push(`/admin`);
      }
    } catch (error) {
      swal("Oops", error, "error");
      setloading(false);
    }
  };

  return (
    <div className="container col-lg-4 mt-5">
      <Helmet>
        <title>Edit User Details</title>
      </Helmet>

      <Card>
        <div className="card-header">
          <Link to={`/users`}>
            <button className="btn btn-success">&larr;</button>
          </Link>
        </div>
        <div className="row mt-3">
          <div className="col-lg-12 text-center">
            <h1 className="text-center">
              Edit Details (Name, Email,Country, Role &amp; Phone Number)
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

            <div class="col-md-12 pb-2">
              <div class="form-outline form-white">
                <select
                  className="col-md-12 required"
                  onChange={handleCountryCode}
                >
                  <option selected value="none">
                    Select Country
                  </option>
                  {countries.map((country) => (
                    <option value={country.isoCode} key={country.isoCode}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <p className="text-danger">{countryCodeError}</p>
              </div>
            </div>

            <div class="col-md-12 pb-2">
              <div class="form-outline form-white">
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
              </div>
            </div>
          </div>

          <div className="col-lg-12 mt-3">
            <div className="form-outline form-white">
              {loading && <Loader />}
              <button
                className="rounded w-100 btn bg-green btn-primary"
                onClick={(e) => handleEditUser(e)}
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

export default EditUserProfile;
