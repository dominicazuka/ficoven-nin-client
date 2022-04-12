import React, { useState } from "react";
import { Country, State, City } from "country-state-city";
import swal from "sweetalert";
import { validateEmail } from "../utils";
import "../components/react-phone-number-input/style.css";
import { Helmet } from "react-helmet";
import PhoneInput from "react-phone-number-input";
import { getBookingByEmail } from "../libs/booking";

function UserScreen({ setIsNext, bookingDetails, history }) {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checkbox, setCheckbox] = useState("");

  const [emailError, setEmailError] = useState("");
  const [cEmailError, setCEmailError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [streetAddressError, setStreetAddressError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  // const countries = Country.getAllCountries();
  const filterCountries = Country.getAllCountries();
  const handleCountryInput = (e) => {
    try {
      const code = e.target.value;
      setCountryCode(code);
      const filterCountry = filterCountries.find((c) => c.isoCode === code);
      setCountry(filterCountry.name);
      const _states = State.getAllStates();
      let filterStates = _states.filter((s) => s.countryCode === code);
      if (code === "GB") {
        const _allowedStates = [
          "England",
          "Wales",
          "Scotland",
          "Northern Ireland",
        ];
        filterStates = filterStates.filter((s) =>
          _allowedStates.includes(s.name)
        );
      }
      filterStates = filterStates.sort(
        (a, b) => a.name.toLowerCase() - b.name.toLowerCase()
      );
      setStates(filterStates);

      setCities([]);
      setCountryCodeError("");
    } catch (error) {}
  };

  const handleStateInput = (e) => {
    const code = e.target.value;
    const _states = State.getAllStates();
    let filterState = _states.find(
      (s) => s.isoCode === code && s.countryCode === countryCode
    );
    setState(filterState.name);
    const _cities = City.getCitiesOfState(countryCode, code);
    setCities(_cities);
    setStateError("");
  };

  const handleCityInput = (e) => {
    setCity(e.target.value);
    setCityError("");
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handleCEmailInput = (e) => {
    setCEmail(e.target.value);
    setCEmailError("");
  };

  const handleTitleInput = (e) => {
    setTitle(e.target.value);
    setTitleError("");
  };

  const handleFirstNameInput = (e) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };

  const handleLastNameInput = (e) => {
    setLastName(e.target.value);
    setLastNameError("");
  };

  const handleStreetAddressInput = (e) => {
    setStreetAddress(e.target.value);
    setStreetAddressError("");
  };

  const handlePhoneNumberInput = (e) => {
    setPhoneNumber(e);
    setPhoneNumberError("");
  };

  const handleCheckBoxInput = (e) => {
    setCheckbox(e);
  };

  const handlePrevious = (e) => {
    setIsNext(false);
  };

  const handleNext = async (e) => {
    e.preventDefault();
    try {
      let isError = false;
      if (title.trim() === "") {
        setTitleError("Please Select Title");
        isError = true;
      }
      if (firstName.trim() === "") {
        setFirstNameError("Please input your first name");
        isError = true;
      }
      if (lastName.trim() === "") {
        setLastNameError("Please input your last name");
        isError = true;
      }
      if (lastName.trim() === "") {
        setLastNameError("Please input your last name");
        isError = true;
      }
      if (countryCode.trim() === "none" || countryCode.trim() === "") {
        setCountryCodeError("Please select country");
        isError = true;
      }
      if (state.trim() === "none" || state.trim() === "") {
        setStateError("Please select state");
        isError = true;
      }
      if (city.trim() === "none" || city.trim() === "") {
        setCityError("Please select country");
        isError = true;
      }
      if (streetAddress.trim() === "") {
        setStreetAddressError("Please input street address");
        isError = true;
      }
      if (phoneNumber === "none" || phoneNumber === "") {
        setPhoneNumberError("Please input valid phone number");
        isError = true;
      }
      if (email.trim() === "") {
        setEmailError("Please input email address");
        isError = true;
      }
      if (!validateEmail(email.trim())) {
        setEmailError("Please input a valid email address");
        isError = true;
      }
      if (cEmail.trim() === "") {
        setCEmailError("Please confirm email address");
        isError = true;
      }
      if (email.trim() !== cEmail.trim()) {
        setCEmailError("Email does not match");
      }

      if (isError) return false;
      const { serviceId, ...rest } = bookingDetails;
      const user = {
        country,
        state,
        city,
        title,
        streetAddress,
        phoneNumber,
        email,
        firstName,
        lastName,
      };
      const { error } = await getBookingByEmail(email);
      if (!error) {
        return swal(
          "Oops",
          "Email already used, try a different email address",
          "error"
        );
      }
      const userBookingDetails = { ...rest, user };
      return history.push(
        `/book/${serviceId}/${rest.date}`,
        userBookingDetails
      );
    } catch (error) {}
  };

  return (
    // <section class="h-100 h-custom gradient-custom-2">
    <div class="container">
      <Helmet>
        <title>Contact Details</title>
      </Helmet>
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div
          class=" card-registration card-registration-2"
          style={{ borderRadius: "15px" }}
        >
          <div class="card-body p-0">
            <div className="row g-0">
              <div className="col-lg-12  text-black">
                <div class="p-5 text-black">
                  <h3
                    class="userScreenTitle fw-normal text-black"
                    style={{ color: "#000000" }}
                  >
                    Contact Details
                  </h3>

                  <div class="pb-2" style={{ color: "#000000" }}>
                    <select
                      class="select"
                      onChange={handleTitleInput}
                      value={title}
                    >
                      <option>Title</option>
                      <option>Mr</option>
                      <option>Mrs</option>
                      <option>Ms</option>
                      <option>Miss</option>
                    </select>
                    <p className="text-danger">{titleError}</p>
                  </div>

                  <div class="row mt-3">
                    <div class="col-md-6">
                      <div class="form-outline form-white">
                        <input
                          placeholder="Enter your first name"
                          type="text"
                          class="form-control form-control-lg userScreenInputs"
                          onChange={handleFirstNameInput}
                          value={firstName}
                        />
                        <p className="text-danger">{firstNameError}</p>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="form-outline">
                        <input
                          type="text"
                          placeholder="Enter your last name"
                          class="form-control form-control-lg userScreenInputs"
                          onChange={handleLastNameInput}
                          value={lastName}
                        />
                        <p className="text-danger">{lastNameError}</p>
                      </div>
                    </div>
                  </div>

                  <div className="nin-form-group">
                    <div className="row" style={{ color: "#000000" }}>
                      <div className="col-lg-12  text-black">
                        <select
                          className="col-md-12 required"
                          onChange={handleCountryInput}
                        >
                          <option selected value="none">
                            Select Country
                          </option>
                          {filterCountries.map((country) => (
                            <option
                              value={country.isoCode}
                              key={country.isoCode}
                            >
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">{countryCodeError}</p>
                        <select
                          className="col-md-12 required"
                          onChange={handleStateInput}
                        >
                          <option selected value="none">
                            Select State
                          </option>
                          {states.map((s) => (
                            <option value={s.isoCode} key={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-danger">{stateError}</p>
                        <select
                          onChange={handleCityInput}
                          className="col-md-12 required"
                        >
                          <option selected value="none">
                            Select City
                          </option>
                          {cities.map((c) => (
                            <option key={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <p className="text-danger">{cityError}</p>
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-md-12 ">
                      <div class="form-outline form-white">
                        <input
                          type="text"
                          placeholder="Enter your street address name"
                          id="form3Examplea8"
                          class="form-control form-control-lg userScreenInputs"
                          onChange={handleStreetAddressInput}
                          value={streetAddress}
                        />
                        <p className="text-danger">{streetAddressError}</p>
                      </div>
                    </div>

                    <div class="col-md-12 pb-2">
                      <div class="form-outline form-white">
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => {
                            handlePhoneNumberInput(e);
                          }}
                          className=" rounded form-control mt-2"
                        />
                        <p className="text-danger">{phoneNumberError}</p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 pb-2">
                      <div class="">
                        <div class="form-outline form-white">
                          <input
                            type="text"
                            placeholder="Enter your email address"
                            class="form-control form-control-lg userScreenInputs"
                            onChange={handleEmailInput}
                            value={email}
                          />
                          <p className="text-danger">{emailError}</p>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6 pb-2">
                      <div class="">
                        <div class="form-outline">
                          <input
                            type="text"
                            placeholder="Confirm your email address"
                            class="form-control form-control-lg userScreenInputs"
                            onChange={handleCEmailInput}
                            value={cEmail}
                          />
                          <p className="text-danger">{cEmailError}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-check d-flex justify-content-start mb-4 pb-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value={checkbox}
                      onChange={(e) => {
                        handleCheckBoxInput(e);
                      }}
                      required
                    />

                    <label
                      class="form-check-label text-black"
                      for="form2Example3"
                    >
                      I do accept the{" "}
                      <a
                        href="https://ninenrollment-panduspowells.ficoven.com/terms-and-conditions/"
                        class="text-black"
                      >
                        <u>Terms and Conditions</u>
                      </a>
                    </label>
                  </div>

                  <div className="container d-flex justify-content-center align-items-center h-100">
                    <div className="row">
                      <div className="d-grid gap-2 d-md-block">
                        <button
                          type="button"
                          className="next-button btn btn-light btn-lg bg-green userScreenInputs"
                          data-mdb-ripple-color="dark"
                          onClick={handlePrevious}
                        >
                          Prev
                        </button>

                        <button
                          type="button"
                          className="next-button1 btn btn-light btn-lg bg-green userScreenInputs"
                          data-mdb-ripple-color="dark"
                          onClick={(e) => handleNext(e)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </section>
  );
}

export default UserScreen;
