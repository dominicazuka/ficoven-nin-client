import React, { useState } from "react";
import { Card } from "antd";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import moment from "moment";

function PaymentDetails({ location }) {
  const state = location.state;

  const [date, setDate] = useState(moment(state.payment.created_at).format("DD-MM-YYYY"));
  
  return (
    <div className="container col-lg-8 mt-5">
      <Helmet>
        <title>User Payment Details</title>
      </Helmet>
      <Card>
        <div className="card-header">
          <Link to={`/payments`}>
            <button className="btn btn-success">&larr;</button>
          </Link>
        </div>
        <div className="container">
          <div className="row d-flex align-items-center h-100">
            <div className="col-lg-12">
              <div className="p-5">
                <h1>User Payment Details</h1>
                <hr />
                <p>
                  <strong>Full Name:</strong> {state.payment.payer.first_name}{" "}
                  {""} {state.payment.payer.surname}
                </p>
                <p>
                  <strong>User Id:</strong> {state.payment.payer.userId}
                </p>
                <p>
                  <strong>Amount Paid:</strong> ${state.payment.payment.amount}{" "}
                  | <strong>Status:</strong> {state.payment.status}
                </p>
                <p>
                  <strong>Payment date:</strong> {date}
                </p>
                <p>
                  <strong>Payer ID:</strong> {state.payment.payer.payer_id}
                </p>
                <p>
                  <strong>Email Address:</strong> {state.payment.payer.email}
                </p>
                <p>
                  <strong>Country Code:</strong>{" "}
                  {state.payment.payer.address.country_code}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PaymentDetails;
