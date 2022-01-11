import React, { useState } from "react";
import { Card } from "antd";
import { Helmet } from "react-helmet";
import Axios from "../config";
import Loader from "../components/Loader";

//Add service component

const AddService = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [bookingPerDayError, setBookingPerDayError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [chargeAmount, setChargeAmount] = useState(0)
  const [chargeAmountError, setChargeAmountError] = useState("");


  const handleNameInput = (e) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleCategoryInput = (e) => {
    setCategory(e.target.value);
    setCategoryError("");
  };

  const handleAmountInput = (e) => {
    setAmount(e.target.value);
    setBookingPerDayError("");
  };

  const handleChargeAmountInput = (e) => {
    setChargeAmount(e.target.value);
    setChargeAmountError("");
  };

  const handleDescriptionInput = (e) => {
    setDescription(e.target.value);
    setDescriptionError("");
  };

  const clearInput = () => {
    setName("");
    setCategory("");
    setAmount("");
    setDescription("");
    setChargeAmount("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let isError = false;
      if (name.trim() === "") {
        setNameError("Please enter service name");
        isError = true;
      }

      if (category.trim() === "none") {
        setCategoryError("Please service category");
        isError = true;
      }

      if (parseInt(amount) === 0) {
        setBookingPerDayError("Please service price");
        isError = true;
      }

      if (description.trim() === "") {
        setDescriptionError("Please enter a valid description");
        isError = true;
      }

      if (isError) return false;
      setLoading(true);
      const body = { name, category, amount, description, chargeAmount };
      await Axios.post("/services/createservice", body);
      clearInput();
      setLoading(false);
      setMessage("Service created succesfully!");
    } catch (error) {
      setLoading(false);
      setMessage(error.message);
    }
  };

  return (
    <div className="wrapper wrapper-add-service">
      <Helmet>
        <title>Add Service</title>
      </Helmet>
      <div className="top-header">
        <h1 className="text-center pt-5 text-white adminText">
          <strong>Add Service</strong>
        </h1>
      </div>

      <div className="content-body ml-3 mr-3">
        <div className="col-lg-4 container">
          <Card>
            <div className="col">
              <input
                type="text"
                className="mt-2 form-control"
                placeholder="Service Name"
                value={name}
                onChange={handleNameInput}
              />
              <p className="text-danger">{nameError}</p>
              <select onChange={handleCategoryInput}>
                <option value="none">Select a category</option>
                <option>Regular</option>
                <option>Premium</option>
              </select>
              <p className="text-danger">{categoryError}</p>
              <input
                type="number"
                className="mt-2 form-control"
                placeholder={amount === 0 ? "Amount" : ""}
                value={amount !== 0 ? amount : null}
                onChange={handleAmountInput}
              />
              <p className="text-danger">{bookingPerDayError}</p>

              <input
                type="number"
                className="mt-2 form-control"
                placeholder={chargeAmount === 0 ? "Handling Fee" : ""}
                value={chargeAmount !== 0 ? chargeAmount : null}
                onChange={handleChargeAmountInput}
              />
              <p className="text-danger">{chargeAmountError}</p>

              <input
                type="text"
                className="mt-2 form-control"
                placeholder="Description"
                value={description}
                onChange={handleDescriptionInput}
              />
              <p className="text-danger">{descriptionError}</p>
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

export default AddService;
