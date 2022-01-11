import React, { useState } from "react";
import { Country } from "country-state-city";
import { Card, TimePicker } from "antd";
import Loader from "../components/Loader";
import Axios from "../config";
import { Helmet } from "react-helmet";
import PhoneInput from "react-phone-number-input";
import moment from "moment";

const AddCenter = () => {
  const [countryCode, setCountryCode] = useState("");
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [location, setLocation] = useState("");

  const [countryCodeError, setCountryCodeError] = useState("");
  const [nameError, setNameError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [timeError, setTimeError] = useState("");
  const [locationError, setLocationError] = useState("");

  const countries = Country.getAllCountries();

  const handleCountryCode = (e) => {
    try {
      setCountryCode(e.target.value);
      const _country = countries.find((c) => c.isoCode === e.target.value);
      setCountry(_country.name);
      setCountryCodeError("");
    } catch (error) {
    }
  };

  const handleNameInput = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleAddressInput = (e) => {
    setAddress(e.target.value);
    setAddressError("");
  };

  const handlePhoneInput = (e) => {
    setPhone(e);
    setPhoneError("");
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleTimeInput = (timeRange) => {
    setTime(timeRange);
    setFromTime(moment(timeRange[0]).format("h:mm:ss A"));
    setToTime(moment(timeRange[1]).format("h:mm:ss A"));
    setTimeError("");
  };

  const handleLocation = (e) => {
    setLocation(e.target.value);
    setLocationError("");
  };

  const clearInput = () => {
    setCountryCode("none");
    setName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setTime("");
    setLocation("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let isError = false;

      if (countryCode.trim() === "none" || countryCode.trim() === "") {
        setCountryCodeError("Please select country");
        isError = true;
      }
      if (name.trim() === "") {
        setNameError("Please enter enrolment center name");
        isError = true;
      }

      if (address.trim() === "") {
        setAddressError("Please enter enrolment center address");
        isError = true;
      }

      if (phone.trim() === "") {
        setPhoneError("Please enter center agent mobile number");
        isError = true;
      }

      if (email.trim() === "") {
        setEmailError("Please enter an email");
        isError = true;
      }

      if (time.length === 0) {
        setTimeError("Please enter working hours");
        isError = true;
      }

      if (location.trim() === "") {
        setLocationError("Please enter a google location link");
        isError = true;
      }

      if (isError) return false;
      setLoading(true);
      const body = {
        country,
        countryCode,
        name,
        address,
        phone,
        location,
        email,
        time: fromTime + "-" + toTime,
        days: "Mon, Tues, Wed, Thur, Fri",
      };
      await Axios.post("/centers/createcenter", body);
      clearInput();
      setLoading(false);
      setMessage("Center added succesfully!");
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <div className="wrapper wrapper-add-service">
      <Helmet>
        <title>Add Center</title>
      </Helmet>
      <div className="top-header">
        <h1 className="text-center pt-5 text-white adminText">
          <strong>Add Enrolment Center</strong>
        </h1>
      </div>

      <div className="content-body ml-3 mr-3">
        <div className="col-lg-4 container">
          <Card>
            <div className="col">
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
              <input
                className="mt-2 form-control"
                type="text"
                placeholder="Name"
                value={name}
                onChange={handleNameInput}
              />
              <p className="text-danger">{nameError}</p>

              <input
                className="mt-2 form-control"
                type="text"
                placeholder="Address"
                value={address}
                onChange={handleAddressInput}
              />
              <p className="text-danger">{addressError}</p>

              <PhoneInput
                placeholder="Enter phone number"
                className=" rounded form-control mt-2"
                value={phone}
                onChange={(e) => handlePhoneInput (e)}
              />
              <p className="text-danger">{phoneError}</p>

              <input
                className="mt-2 form-control"
                type="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailInput}
              />
              <p className="text-danger">{emailError}</p>

              <input
                className="mt-2 form-control"
                type="text"
                placeholder="Enter Google Location Link"
                value={location}
                onChange={handleLocation}
              />
              <p className="text-danger">{locationError}</p>

              <p>Select working hours:</p>
              <TimePicker.RangePicker
                use12Hours
                format="h:mm:ss A"
                onChange={handleTimeInput}
                value={time}
              />
              <p className="text-danger">{timeError}</p>
            </div>
            {loading ? <Loader /> : <p className="text-info">{message}</p>}
            <div style={{ float: "right" }}>
              <button
                disabled={loading}
                className="btn btn-success mt-3"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddCenter;
