import React, {useState} from "react";
import {Card} from "antd";
import { Helmet } from "react-helmet";
import Loader from "../components/Loader";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { updateService } from "../libs/service";

function EditService({ history, location }) {
  const servicesDetails = location.state;

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(servicesDetails.name);
  const [amount, setAmount] = useState(servicesDetails.amount);
  const [category, setCategory] = useState(servicesDetails.category);
  const [description, setDescription] = useState(servicesDetails.description);
  const allowedCategory = ["Regular", "Premium"];
  const [chargeAmount, setChargeAmount] = useState(
    servicesDetails.chargeAmount
  );

  const {
    authState: { user },
  } = useAuthContext();

  const handleNameInput = (e) => {
    setName(e.target.value);
  };

  const handleServiceChargeInput = (e) => {
    setAmount(e.target.value);
  };

  const handleChargeAmount = (e) => {
    setChargeAmount(e.target.value);
  };

  const handleServiceCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        name: !name ? servicesDetails.name : name,
        amount: !amount ? servicesDetails.amount : parseFloat(amount),
        category: !category ? servicesDetails.category : category,
        description: !description ? servicesDetails.description : description,
        _id: servicesDetails._id,
        chargeAmount: !chargeAmount
          ? servicesDetails.chargeAmount
          : chargeAmount,
        admin: {
          name: user.name,
          email: user.email,
          country: user.country,
          role: user.role,
        },
      };
      setIsLoading(true);
      const {error, msg} = await updateService(obj);
      setIsLoading(false);
      swal(error ? "Oops" : "Booking Modified", msg, error ? "error" : "success");
      if(!error){
        history.push(`/services`);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="container col-lg-8 mt-5">
      <Helmet>
        <title>Edit Service Details</title>
      </Helmet>
      <Card>
        <div className="card-header">
          <Link to={`/services`}>
            <button className="btn btn-success">&larr;</button>
          </Link>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Service Name</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={(e) => handleNameInput(e)}
                  value={name}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Service Charge</label>
                <input
                  className="form-control form-control-lg"
                  type="number"
                  onChange={handleServiceChargeInput}
                  value={amount}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Handling Fee</label>
                <input
                  className="form-control form-control-lg"
                  type="number"
                  onChange={handleChargeAmount}
                  value={chargeAmount}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12 text-black">
              <div className="form-outline form-white text-black">
                <label className="form-label">Service Category</label>
                <select
                  onChange={(e) => handleServiceCategory(e)}
                  className="text-black required"
                  value={category}
                  style={{ color: "#000000" }}
                >
                  <option>Select Category</option>
                  {allowedCategory.map((c) => (
                    <option
                      className="text-black"
                      style={{ color: "#000000" }}
                      key={c}
                      value={c.toLowerCase()}
                    >
                      {c}
                    </option>
                  ))}
                </select>
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Description</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  onChange={(e) => handleDescription(e)}
                  value={description}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            {isLoading && <Loader />}
            <div className="col-lg-12">
              <div className="form-outline form-white">
                <button
                  className="rounded w-100 btn btn-primary"
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
    </div>
  );
}

export default EditService;
