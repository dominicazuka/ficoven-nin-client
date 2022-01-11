import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { DatePicker } from "antd";
import moment from "moment";
import Axios from "../config";
import swal from "sweetalert";
import { allowedTimes } from "../data";
import { lowerCase } from "../utils";
import { Helmet } from "react-helmet";

function Service({
  services,
  organizations,
  setBookingDetails,
  setIsNext,
}) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [centers, setCenters] = useState([]);
  const [userCenter, setUserCenter] = useState("");
  const [categoryServices, setCategoryServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [category, setCategory] = useState("");
  const [service, setService] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [countryCodeError, setCountryCodeError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");
  const [userCenterError, setUserCenterError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [serviceError, setServiceError] = useState("");
  const [organizationError, setOrganizationError] = useState("");
  const [dateError, setDateError] = useState();
  const [timeError, setTimeError] = useState("");
  const [enrolmentCenters, setEnrolmentCenters] = useState(0);
  const [noCenterFound, setNoCenterFound] = useState(false);
  const [location, setLocation] = useState("");
  const [agentNumber, setAgentNumber] = useState("")


  useEffect(() => {
    fetchCenters();
    return () => {};
  }, []);

  const fetchCenters = async () => {
    try {
      const data = await (
        await Axios.get("/centers/getallcenters?order=true")
      ).data;
      setEnrolmentCenters(data.centers);
    } catch (error) {}
  };

  const filterCountries = Country.getAllCountries();
  const handleCountryInput = (code) => {
    try {
      setNoCenterFound(false);
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
      const filterCenters = enrolmentCenters.filter(
        (c) => c.countryCode === code
      );
      if (filterCenters.length === 0) {
        setNoCenterFound(true);
      }
      setCenters(filterCenters);
      setLocation(filterCenters[0].location);
      setCities([]);
      setCountryCodeError("");
    } catch (error) {
    }
  };

  const handleStateInput = (code) => {
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

  const handleCategoryInput = (e) => {
    const filterCatServices = services.filter(
      (s) => lowerCase(s.category) === lowerCase(e.target.value)
    );
    setCategoryServices(filterCatServices);
    setCategory(e.target.value);
    setCategoryError("");
  };

  const handleServiceInput = (e) => {
    const value = e.target.value;
    setServiceId(value);
    const _service = categoryServices.find((c) => c._id === value);
    setService(_service.name);
    setServiceError("");
  };

  const handleOrganizationInput = (e) => {
    setOrganization(e.target.value);
    setOrganizationError("");
  };

  const handleTimeInput = (e) => {
    setTime(e.target.value);
    setTimeError("");
  };

  const handleCenterInput = (e) => {
    const value = e.target.value;
    const _center = centers.find(c => c.name === value);
    setAgentNumber(_center.phone);
    setUserCenter(e.target.value);
    setUserCenterError("");
  };

  const handleNext = (e) => {
    e.preventDefault();
    try {
      let isError = false;
      if (countryCode.trim() === "none" || countryCode.trim() === "") {
        setCountryCodeError("Please select country");
        isError = true;
      }
      if (state.trim() === "none" || state.trim() === "") {
        setStateError("Please select state");
        isError = true;
      }
      if (city.trim() === "none" || city.trim() === "") {
        setCityError("Please select city");
        isError = true;
      }
      if (userCenter.trim() === "") {
        setUserCenterError("Please select your center");
        isError = true;
      }
      if (category.trim() === "") {
        setCategoryError("Please select service category");
        isError = true;
      }
      if (service.trim() === "") {
        setServiceError("Please select service");
        isError = true;
      }
      if (organization.trim() === "") {
        setOrganizationError("Please select organization");
        isError = true;
      }
      if (date.trim() === "") {
        setDateError("Please select date");
        isError = true;
      }
      if (time.trim() === "") {
        setTimeError("Please select time");
        isError = true;
      }
      if (isError) return false;

      const obj = {
        country,
        state,
        city,
        userCenter,
        category,
        service,
        organization,
        date,
        serviceId,
        time,
        countryCode,
        location,
        agentNumber
      };
      setBookingDetails(obj);
      setIsNext(true);
    } catch (error) {
      
    }
  };

  function filterByDate(dates) {
    setDate(moment(dates).format("DD-MM-YYYY"));
    setDateError("");
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf() ||  moment(current).day() === 0 ||  moment(current).day() === 6;
  }
  if (noCenterFound) {
    swal("Oops", "No available center for this country", "error");
  }
  return (
    <form>
      <Helmet>
        <title>Pre-enrol NIN - Diaspora</title>
      </Helmet>
      <fieldset>
        <legend>Please select a service to proceed:</legend>
        <div className="nin-form">
          <div>
            <div className="col-md-4" className="nin-form-group">
              <label className="nin-label">Enrollment Center</label>
              <div>
                <select
                  className="col-md-12 required"
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
                <p className="text-danger">{countryCodeError}</p>
                <select
                  className="col-md-12 required"
                  onChange={(e) => handleStateInput(e.target.value)}
                >
                  <option selected value="None">
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
                  onChange={(e) => handleCityInput(e)}
                  className="col-md-12 required"
                >
                  <option selected value="None">
                    Select City
                  </option>
                  {cities.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
                <p className="text-danger">{cityError}</p>
                <select
                  onChange={(e) => handleCenterInput(e)}
                  className="col-md-12 required"
                >
                  <option selected value="None">
                    Select Enrollment Center
                  </option>
                  {centers.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
                <p className="text-danger">{userCenterError}</p>
              </div>
            </div>

            <div className="col-md-7" className="nin-form-group">
              <label className="nin-label">Service</label>
              <div className="nin-form-service">
                <select
                  onChange={(e) => handleCategoryInput(e)}
                  className="col-md-12 required"
                >
                  <option selected value="None">
                    Service Category
                  </option>
                  <option>Regular</option>
                  <option>Premium</option>
                </select>
                <p className="text-danger">{categoryError}</p>
                <select
                  onChange={(e) => handleServiceInput(e)}
                  className="col-md-12 required"
                >
                  <option selected value="None">
                    Select Service
                  </option>

                  {categoryServices.map((c) => (
                    <option key={c.name} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-danger">{serviceError}</p>
              </div>
            </div>
            <div className="nin-form-group">
              <label className="nin-label">Organization</label>
              <div>
                <select
                  onChange={(e) => handleOrganizationInput(e)}
                  className="required"
                >
                  <option selected value="None">
                    Select Organization
                  </option>
                  {organizations.map((o) => (
                    <option key={o.name}>{o.name}</option>
                  ))}
                </select>
                <p className="text-danger">{organizationError}</p>
              </div>
            </div>
            <hr></hr>
            <div className="mb-4">
              <b>
                <p>Select Availability Date:</p>
              </b>
              <DatePicker
                className="form-control userScreenInputs"
                format="DD-MM-YYYY"
                onChange={filterByDate}
                disabledDate={disabledDate}
              />
            </div>
            <p className="text-danger">{dateError}</p>

            <div className="nin-form-group">
              <label className="nin-label">Time</label>
              <div>
                <select
                  onChange={(e) => handleTimeInput(e)}
                  className="required"
                >
                  <option selected value="None">
                    Select Time
                  </option>
                  {allowedTimes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <p className="text-danger">{timeError}</p>
              </div>
            </div>

            <div
              className="mb-3"
              style={{ float: "right", width: "100px", borderRadius: "4px" }}
            >
              <button
                onClick={(e) => handleNext(e)}
                className="btn btn-success userScreenInputs"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default Service;
