import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Axios from "../config";
import swal from "sweetalert";
import { getErrorMessage, lowerCase } from "../utils";
import { Helmet } from "react-helmet";
import { useAuthContext } from "../contexts/AuthContext";

//Services list component
const AllServices = ({history}) => {
  const [services, setservices] = useState([]);
  const [loading, setloading] = useState(true);
  const [totalServices, setTotalServices] = useState(0);
  const [searchServices, setSearchServices] = useState([]);
  const [error, seterror] = useState();

  const {
    authState: { user },
  } = useAuthContext();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await (await Axios.get("/services/getallservices")).data;
      setservices(data.services);
      setTotalServices(data.totalServices);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleLoadMoreServices = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.get(
        `/services/getallservices?total=${services.length}`
      );
      setservices((prev) => [...prev, ...data.services]);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleSearchInput = async (e) => {
    const value = e.target.value.toLowerCase();
    const filterServices = services.filter(
      (s) =>
        lowerCase(s.name).includes(value) ||
        lowerCase(s.category).includes(value)
    );
    setSearchServices(filterServices);
  };


  const handleEditServiceButton = (payload) => {
    
    return history.push(`/edit_service/${payload._id}`, payload);
  };

  function handleDeleteService(id) {
    try {
      swal("Are you sure you want to delete this service?", {
        dangerMode: true,
        buttons: true,
      }).then(async (isConfirmed) => {
        try {
          if (isConfirmed) {
            const res = await Axios.delete(`/services/delete_service/${id}`,{data:{
              name: user.name,
              email: user.email,
              country: user.country,
              role: user.role,
            }});
            setservices((prev) => prev.filter((p) => p._id !== id));
            setTotalServices((prev) => prev - 1);
            swal("Deleted", res.data.message, "info");
          }
        } catch (error) {
          swal("Oops", getErrorMessage(error), "error");
        }
      });
    } catch (error) {
    }
  }

  return (
    <div className="wrapper">
      <Helmet>
        <title>All Services</title>
      </Helmet>
      <div className="top-header">
        <h1 className="text-center pt-5 text-white adminText">
          <strong>All Services ({totalServices})</strong>
        </h1>
      </div>
      <div className="content-body row ml-3 mr-3">
        <div className="col-md-12 table-data">
          {loading && <Loader />}
          <input
            type="search"
            className="mb-3 form-control rounded"
            placeholder="Search Here... Service ID, Service Name, or Service Type/Categroy"
            required
            onChange={handleSearchInput}
          />
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>S/N</th>
                <th>Service Name</th>
                <th>Service Type</th>
                <th>Amount</th>
                <th>Handling Fee</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {searchServices.length === 0
                ? services &&
                  services.map((service, i) => {
                    return (
                      <tr key={service._id.toString()}>
                        <td>{i + 1}</td>
                        <td>{service.name}</td>
                        <td>{service.category}</td>
                        <td>${service.amount}</td>
                        <td>${service.chargeAmount}</td>
                        <td>
                          <span
                            onClick={() => handleDeleteService(service._id)}
                            className="mr-4"
                          >
                            <i
                              className="fa fa-trash"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                          <span onClick={() => handleEditServiceButton(service)}>
                            <i
                              className="fa fa-pencil"
                              style={{ color: "green" }}
                            ></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                : searchServices &&
                  searchServices.map((service, i) => {
                    return (
                      <tr key={service._id.toString()}>
                        <td>{i + 1}</td>
                        <td>{service.name}</td>
                        <td>{service.category}</td>
                        <td>${service.amount}</td>
                        <td>${service.chargeAmount}</td>
                        <td>
                          <span
                            onClick={() => handleDeleteService(service._id)}
                            className="mr-4"
                          >
                            <i
                              className="fa fa-trash"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                          <span onClick={() => handleEditServiceButton(service)}>
                            <i
                              className="fa fa-pencil"
                              style={{ color: "green" }}
                            ></i>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {totalServices > services.length && (
            <button onClick={(e) => handleLoadMoreServices(e)}>
              Load More
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllServices;
