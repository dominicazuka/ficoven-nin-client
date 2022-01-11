import React from "react";
import { Card } from "antd";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

function UserDetails({ location }) {
  const state = location.state;

  return (
    <div className="container col-lg-8 mt-5">
      <Helmet>
        <title>User Booking Details</title>
      </Helmet>
      <Card>
        <div className="card-header">
          <Link to={`/bookings`}>
            <button className="btn btn-success">&larr;</button>
          </Link>
        </div>
        <div className="container">
          <div className="row d-flex align-items-center h-100">
            <div className="col-lg-12">
              <div className="p-5">
                <h1>User Booking Details</h1>
                <hr />
                <p>
                  <strong>Service Name:</strong> {state.service}
                </p>
                <p>
                  <strong>Service Category:</strong> {state.category}
                </p>
                <p>
                  <strong>Amount Paid:</strong> ${state.totalAmount} |{" "}
                  <strong>Status:</strong> {state.status}
                </p>
                <p>
                  <strong>Date:</strong> {state.date} | <strong>Time:</strong>{" "}
                  {state.time}
                </p>
                <p>
                  <strong>Full Name:</strong> {state.user.title}. {""}{" "}
                  {state.user.firstName} {""} {state.user.lastName}
                </p>
                <p>
                  <strong>User ID:</strong> {state.user.userId}
                </p>
                <p>
                  <strong>User Center:</strong> {state.userCenter},{" "}
                  {state.country}, {state.state}, {state.city}
                </p>
                <p>
                  <strong>Email Address:</strong> {state.user.email}
                </p>
                <p>
                  <strong>Phone Number:</strong> {state.user.phoneNumber}
                </p>
                <p>
                  <strong>Address:</strong> {state.user.country},{" "}
                  {state.user.state}, {state.user.city},{" "}
                  {state.user.streetAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default UserDetails;
