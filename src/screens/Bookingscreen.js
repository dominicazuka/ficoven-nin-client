import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { getErrorMessage } from "../utils";
import { Card } from "antd";
import swal from "sweetalert";
import Axios from "../config";
import PaypalPaymentButton from "../components/PaypalPaymentButton";
import { Helmet } from "react-helmet";
import VerifyBookingModal from "../components/VerifyPaymentModal";
import VoguePayButton from "../components/VoguePayButton";
import {verifyVoguePayment} from "../libs/payment";

function Bookingscreen({ match, location, history }) {
  const userData = location.state;
  const [service, setservice] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setloading] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  const [allowPayment, setAllowPayment] = useState(false);
  const category = match.params.category;
  const [totalAmount, settotalAmount] = useState();
  const [bookingDetails, setBookingDetails] = useState({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setloading(true);
      const data = (
        await Axios.post("/services/getservicebyid", {
          serviceid: match.params.serviceid,
        })
      ).data;
      settotalAmount(data.amount + data.chargeAmount);
      setservice(data);
      setloading(false);
    } catch (error) {
      // setloading(false);
    }
  };

  //set max booking per day
  const checkBookingNumber = async () => {
    try {
      const { country, state, city, userCenter } = userData;
      const res = await Axios.get(
        `/bookings/checkBookingNumber?country=${country}&userCenter=${userCenter}&state=${state}&city=${city}`
      );
      const data = res.data;

      return { error: false, total: data.total };
    } catch (error) {
      return { error: true, total: 0 };
    }
  };

  async function bookService(e) {
    e.preventDefault();
    try {
      const obj = {
        totalAmount,
        category,
        ...userData,
      };
      setBookingDetails(obj);
      setAllowPayment(false);
      setIsLoading(true);
      const res = await checkBookingNumber();
      if (res.error) {
        setIsLoading(false);
        return swal(
          "Oops",
          "Sorry an error has occured, please try again later",
          "error"
        );
      }
      if (res.total >= 60) {
        setIsLoading(false);
        return swal(
          "Oops",
          "Maximum number of bookings exceeded for this Enrolment Center today, kindly check back tomorrow",
          "error"
        );
      }
      setIsLoading(false);
      setAllowPayment(true);
    } catch (error) {
      setIsLoading(false);
      swal("Oops", getErrorMessage(error), "error");
    }
  }

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const getPaypalResponse = async (payload) => {
    try {
      const obj = {
        id: payload.id,
        created_at: payload.create_time,
        updated_at: payload.update_time,
        payer: {
          address: payload.payer.address,
          email: payload.payer.email_address,
          first_name: payload.payer.name.given_name,
          surname: payload.payer.name.surname,
          payer_id: payload.payer.payer_id
        },
        payee: {
          email: payload.purchase_units[0].payee.email_address,
          merchant_id: payload.purchase_units[0].payee.merchant_id,
        },
        payment: {
          amount: payload.purchase_units[0].amount.value,
          currency: payload.purchase_units[0].amount.currency_code,
        },
        status: payload.status,
      };
      if (payload.status != "COMPLETED") {
        return swal("Please try again", "Transaction failed", "error");
      }
      showModal();
      const result = await Axios.post("/bookings/bookservice", {
        payment: obj,
        booking: bookingDetails,
      });
      setIsModalVisible(false);
      swal("Booking Successful", result.data, "success");
      return history.push("/");
    } catch (error) {
      swal("Please try again", error.message, "error");
    }
  };

  const getVoguepayResponse = async (payload) => {
    try {
      showModal();
      const result = await verifyVoguePayment(payload);
      setIsModalVisible(false);
      swal(result.error ? "Booking Failed" : "Booking Successful", result.msg, result.error ? "error" : "success");
      return history.push("/");
    } catch (error) {
      swal("Please try again", error.msg, "error");
    }
  }

  return (
    <Card>
      <div className="container">
        <Helmet>
          <title>Payment</title>
        </Helmet>
        {loading ? (
          <Loader />
        ) : service ? (
          <div className="container">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col-12">
                <div className=" card-registration card-registration-2">
                  <div className="card-body p-0">
                    <div className="row g-0">
                      <div className="col-lg-6">
                        <div className="p-5">
                          <h1>User Details</h1>
                          <hr />
                          <p>
                            <strong>Full Name:</strong> {userData.user.title}{" "}
                            {userData.user.firstName} {userData.user.lastName}
                          </p>
                          <p>
                            <strong>Email Address:</strong>{" "}
                            {userData.user.email}
                          </p>
                          <p>
                            <strong>Phone Number:</strong>{" "}
                            {userData.user.phoneNumber}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {userData.user.streetAddress}, {userData.user.state}
                            , {userData.user.country}
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="p-5">
                          <h1>Booking Details</h1>
                          <hr />
                          <p>
                            <strong>Service Name:</strong> {service.name}
                          </p>
                          <p>
                            <strong>Service Category:</strong>{" "}
                            {service.category}
                          </p>
                          <p>
                            <strong>Appointment Date:</strong> {userData.date}
                          </p>
                          <p>
                            <strong>Appointment Time:</strong> {userData.time}
                          </p>
                          <p>
                            <strong>Service Charge:</strong> $
                            {service.amount}
                          </p>
                          <p>
                            <strong>Handling Fee:</strong> ${service.chargeAmount}
                          </p>
                          <p>
                            <strong>Total Amount:</strong> ${totalAmount}
                          </p>
                        </div>
                        <div className="col-lg-12 mb-4">
                          {isloading && <Loader />}
                          {allowPayment ? (
                            <div className="row">
                               <div className="col-lg-5">
                               <PaypalPaymentButton
                            getResponse={getPaypalResponse}
                            bookingDetails={bookingDetails}
                          />
                              </div>
                              <div className="col-lg-2">
                                <p className="text-center mb-5">OR</p>
                              </div>
                              <div className="col-lg-5">
                                <VoguePayButton
                                getResponse={getVoguepayResponse}
                                bookingDetails={bookingDetails}/>
                              </div> 
                            </div>
                          ) : (
                            <button
                              className="rounded w-100 btn btn-primary bg-green userScreenInputs"
                              onClick={(e) => bookService(e)}
                              disabled={isloading}
                            >
                              Proceed to payment
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Error />
        )}
      </div>
      <VerifyBookingModal
        {...{
          isModalVisible
        }}
      />
    </Card>
  );
}

export default Bookingscreen;
