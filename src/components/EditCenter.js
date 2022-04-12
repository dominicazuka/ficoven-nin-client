import React, { useState } from "react";
import Axios from "../config";
import Loader from "../components/Loader";
import swal from "sweetalert";
import { useAuthContext } from "../contexts/AuthContext";
import { Card } from "antd";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-number-input";

function EditCenter({ history, location }) {
  const centerdetails = location.state;
  const [address, setAddress] = useState(centerdetails.address);
  const [email, setEmail] = useState(centerdetails.email);
  const [_location, setLocation] = useState(centerdetails.location);
  const [name, setName] = useState(centerdetails.name);
  const [phone, setPhone] = useState(centerdetails.phone);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    authState: { user },
  } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        address: !address ? centerdetails.address : address,
        email: !email ? centerdetails.email : email,
        _location: !_location ? centerdetails._location : _location,
        phone: !phone ? centerdetails.phone : phone,
        name: !name ? centerdetails.name : name,
        _id: centerdetails._id,
        admin: {
          name: user.name,
          email: user.email,
          country: user.country,
          role: user.role,
        },
      };
      setIsLoading(true);
      const res = await Axios.patch("/centers/updatecenter", obj);
      setIsLoading(false);
      swal("Center Modified", res.data.message, "success");
      history.push(`/enrolment-centers`);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAddressInput = (e) => {
    setAddress(e.target.value);
  };

  const handleEmailInput = (e) => {
    setEmail(e.target.value);
  };

  const handleNameInput = (e) => {
    setName(e.target.value);
  };

  const handlePhoneInput = (e) => {
    setPhone(e);
  };

  const handleLocationInput = (e) => {
    setLocation(e.target.value);
  };
  return (
    <>
      <Card>
        <div className="container">
          <Helmet>
            <title>Edit Center Details</title>
          </Helmet>
          <div className="card-header">
            <Link to={`/enrolment-centers`}>
              <button className="btn btn-success">&larr;</button>
            </Link>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Center Name</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  value={name}
                  onChange={handleNameInput}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Address</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={(e) => handleAddressInput(e)}
                  value={address}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Email</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={(e) => handleEmailInput(e)}
                  value={email}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Google Location Code</label>
                
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={(e) => handleLocationInput(e)}
                  value={_location}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Agent Phone</label>
                <PhoneInput
                  placeholder="Enter phone number"
                  className=" rounded form-control mt-2"
                  value={phone}
                  onChange={(e) => handlePhoneInput(e)}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            {isLoading && <Loader />}
            <div className="col-lg-12">
              <div className="form-outline form-white">
                <button
                  className="rounded w-100 btn bg-green btn-primary"
                  onClick={(e) => handleSubmit(e)}
                >
                  Update
                </button>
                <p className="text-danger"></p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}

export default EditCenter;
