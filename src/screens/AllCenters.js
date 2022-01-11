import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { Helmet } from "react-helmet";
import Axios from "../config";
import { checkSuperAdmin, getErrorMessage, lowerCase } from "../utils";
import swal from "sweetalert";
import { useAuthContext } from "../contexts/AuthContext";


const AllCenters = ({ history }) => {
  const [centers, setCenters] = useState([]);
  const [totalCenters, setTotalCenters] = useState(0);
  const [searchCenters, setSearchCenters] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [isModalVisibleCenter, setIsModalVisibleCenter] = useState(false);

  const {
    authState: { user },
  } = useAuthContext();

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const data = await (await Axios.get("/centers/getallcenters")).data;
      setCenters(data.centers);
      setTotalCenters(data.totalCenters);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleLoadMoreCenters = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.get(
        `/centers/getallcenters?total=${centers.length}`
      );
      setCenters((prev) => [...prev, ...data.centers]);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleSearchInput = async (e) => {
    const value = e.target.value.toLowerCase();
    const filterCenters = centers.filter(
      (c) =>
        lowerCase(c.countryCode).includes(value) ||
        lowerCase(c.name).includes(value) ||
        lowerCase(c.address).includes(value) ||
        lowerCase(c.phone).includes(value) ||
        lowerCase(c.email).includes(value)
    );
    setSearchCenters(filterCenters);
  };

  const handleEditCenterButton = (payload) => {
    return history.push(`/edit_center/${payload._id}`, payload);
  };

  function handleDeleteCenter(id) {
    try {
      swal("Are you sure you want to delete this center?", {
        dangerMode: true,
        buttons: true,
      }).then(async (isConfirmed) => {
        try {
          if (isConfirmed) {
            const res = await Axios.delete(`/centers/deletecenter/${id}`, {
              data: {
                name: user.name,
                email: user.email,
                country: user.country,
                role: user.role,
              }
            });
            setCenters((prev) => prev.filter((p) => p._id !== id));
            setTotalCenters((prev) => prev - 1);
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
        <title>All Centers</title>
      </Helmet>
      <div className="top-header">
        <h1 className="text-center pt-5 text-white adminText">
          <strong>All Enrolment Centers ({totalCenters})</strong>
        </h1>
      </div>
      <div className="content-body row ml-3 mr-3">
        <div className="col-md-12 table-data">
          {loading && <Loader />}
          <input
            type="search"
            className="mb-3 form-control rounded"
            placeholder="Search Here... Country code, center name, address, phone, and email"
            required
            onChange={handleSearchInput}
          />
          <table width="400" className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>Country Name</th>
                <th>Center Name</th>
                <th>Address</th>
                <th>Agent Number</th>
                <th>Contact Email</th>
                <th>Working Hours</th>
                <th>Working Days</th>
                <th>Google Location</th>
                {checkSuperAdmin(user.role) && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {searchCenters.length === 0
                ? centers &&
                centers.map((center) => {
                  return (
                    <tr key={center._id.toString()}>
                      <td>{center.country}</td>
                      <td>{center.name}</td>
                      <td>{center.address}</td>
                      <td>{center.phone}</td>
                      <td>{center.email}</td>
                      <td>{center.time}</td>
                      <td>{center.days}</td>
                      <td>{center.location}</td>
                      {checkSuperAdmin(user.role) && <td> 
                        <span
                          onClick={() => handleDeleteCenter(center._id)}
                          className="mr-4"
                        >
                          <i
                            className="fa fa-trash"
                            style={{ color: "red" }}
                          ></i>
                        </span>
                        <span onClick={() => handleEditCenterButton(center)}>
                          <i
                            className="fa fa-pencil"
                            style={{ color: "green" }}
                          ></i>
                        </span>
                      </td> }
                    </tr>
                  );
                })
                : searchCenters &&
                searchCenters.map((center) => {
                  return (
                    <tr key={center._id.toString()}>
                      <td>{center.country}</td>
                      <td>{center.name}</td>
                      <td>{center.address}</td>
                      <td>{center.phone}</td>
                      <td>{center.email}</td>
                      <td>{center.time}</td>
                      <td>{center.days}</td>
                      <td>{center.location}</td>
                      {checkSuperAdmin(user.role) && <td>
                        <span
                          onClick={() => handleDeleteCenter(center._id)}
                          className="mr-4"
                        >
                          <i
                            className="fa fa-trash"
                            style={{ color: "red" }}
                          ></i>
                        </span>
                        <span onClick={() => handleEditCenterButton(center)}>
                          <i
                            className="fa fa-pencil"
                            style={{ color: "green" }}
                          ></i>
                        </span>
                      </td> }
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {totalCenters > centers.length && (
            <button onClick={(e) => handleLoadMoreCenters(e)}>Load More</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCenters;
