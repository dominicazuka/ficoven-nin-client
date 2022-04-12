import React, { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";
import Axios from "../config";
import { lowerCase } from "../utils";
import { Helmet } from "react-helmet";
import { Country } from "country-state-city";
import { useAuthContext } from "../contexts/AuthContext";

//Services list component
const AllPayments = ({ history }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setloading] = useState(true);
  const [totalPayments, setTotalPayments] = useState(0);
  const [searchPayments, setSearchPayments] = useState([]);
  const [error, seterror] = useState();
  const isModeratorRef = useRef(false);
  const isCountryCodeRef = useRef("");

  const {
    authState: { user },
  } = useAuthContext();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const byCountry = lowerCase(user.role) === "moderator" ? true : false;
      const countries = Country.getAllCountries();
      const country = user.country;
      const _country = countries.find((c) => c.name === country);
      if (byCountry) {
        isModeratorRef.current = true;
        const countryCode = _country.isoCode;
        isCountryCodeRef.current = countryCode;
        const { data } = await Axios.get(
          `/payments/get_all_payments_by_country/${countryCode}`
        );
        setloading(false);
        const _payments = data.payments;
        const _totalPayments = data.totalPayments;
        setPayments(_payments);
        setTotalPayments(_totalPayments);
        return;
      }
      const { data } = await Axios.get(`/payments/get_all_payments`);
      setloading(false);
      const _payments = data.payments;
      const _totalPayments = data.totalPayments;
      setPayments(_payments);
      setTotalPayments(_totalPayments);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleLoadMorePayments = async (e) => {
    e.preventDefault();
    try {
      if (isModeratorRef.current) {
        setloading(true);
        const { data } = await Axios.get(
          `/payments/get_all_payments_by_country?code=${isCountryCodeRef.current}&total=${payments.length}`
        );
        setPayments((prev) => [...prev, ...data.payments]);
        setloading(false);
        return;
      }
      const { data } = await Axios.get(
        `/payments/get_all_payments?total=${payments.length}`
      );
      setPayments((prev) => [...prev, ...data.payments]);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleSearchInput = async (e) => {
    const value = e.target.value.toLowerCase();
    const filterPayments = payments.filter(
      (p) =>
        lowerCase(p.payment.payer.first_name).includes(value) ||
        lowerCase(p.payment.payer.surname).includes(value) ||
        lowerCase(p.payment.payer.email).includes(value) ||
        lowerCase(p.payment.payer.address.country_code).includes(value) ||
        lowerCase(p.payment.status).includes(value)
    );
    setSearchPayments(filterPayments);
  };

  const handlePaymentDetails = (_payment) => {
    return history.push(`/payments/${_payment._id}`, _payment);
  };

  return (
    <div className="wrapper">
      <Helmet>
        <title>All Payments</title>
      </Helmet>
      <div className="top-header">
        <h1 className="text-center pt-5 text-white adminText">
          <strong>All Payments ({totalPayments})</strong>
        </h1>
      </div>
      <div className="content-body row ml-3 mr-3">
        <div className="col-md-12 table-data">
          {loading && <Loader />}
          <input
            type="search"
            className="mb-3 form-control rounded"
            placeholder="Search Here... Full name, User ID, Email Address, Country code or status"
            required
            onChange={handleSearchInput}
          />
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>S/N</th>
                <th>User ID</th>
                <th>Client Name</th>
                <th>Client Email</th>
                <th>Country Code</th>
                <th>Service Charge</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {searchPayments.length === 0
                ? payments &&
                  payments.map((p, i) => {
                    return (
                      <tr key={p._id.toString()}>
                        <td>{i + 1}</td>
                        <td>{p.payment.payer.userId}</td>
                        <td>
                          {p.payment.payer.first_name} {""}
                          {p.payment.payer.surname}
                        </td>
                        <td>{p.payment.payer.email}</td>
                        <td>{p.payment.payer.address.country_code}</td>
                        <td>${p.payment.payment.amount}</td>
                        <td>{p.payment_type}</td>
                        <td>{p.payment.status}</td>
                        <td>
                          <span onClick={() => handlePaymentDetails(p)}>
                            <i
                              className="fa fa-eye"
                              style={{ color: "white" }}
                            ></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                : searchPayments &&
                  searchPayments.map((p, i) => {
                    return (
                      <tr key={p._id.toString()}>
                        <td>{i + 1}</td>
                        <td>{p.payment.payer.userId}</td>
                        <td>
                          {p.payment.payer.first_name} {""}
                          {p.payment.payer.surname}
                        </td>
                        <td>{p.payment.payer.email}</td>
                        <td>{p.payment.payer.address.country_code}</td>
                        <td>${p.payment.payment.amount}</td>
                        <td>{p.payment_type}</td>
                        <td>{p.payment.status}</td>
                        <td>
                          <span onClick={() => handlePaymentDetails(p)}>
                            <i
                              className="fa fa-eye"
                              style={{ color: "white" }}
                            ></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {totalPayments > payments.length && (
            <button onClick={(e) => handleLoadMorePayments(e)}>
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPayments;
