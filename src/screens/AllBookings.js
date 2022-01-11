import React, { useState, useEffect, useRef } from "react";
import Loader from "../components/Loader";
import Axios from "../config";
import EditBookingModal from "../components/EditBookingModal";
import { Helmet } from "react-helmet";
import swal from "sweetalert";
import { DatePicker, Button } from "antd";
import { checkSuperAdmin, getErrorMessage, lowerCase } from "../utils";
import { useAuthContext } from "../contexts/AuthContext";
import moment from "moment";
import exportFromJSON from "export-from-json";
import { getExportData } from "../libs/booking";

const AllBookings = ({ history }) => {
  const { RangePicker } = DatePicker;

  const [bookings, setbookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchBookings, setSearchBookings] = useState([]);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userBookingDetails, setUserBookingDetails] = useState({});
  const [enrolmentCenters, setEnrolmentCenters] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const detailsRef = useRef(userBookingDetails);
  const [fromDate, setFromDate] = useState(
    moment(new Date()).format("DD-MM-YYYY")
  );
  const [toDate, setToDate] = useState(moment(new Date()).format("DD-MM-YYYY"));
  const [dateError, setDateError] = useState();
  const [country, setCountry] = useState("All");
  const [countries, setCountries] = useState([]);
  const [centers, setCenters] = useState([]);
  const [center, setCenter] = useState("All");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const allowedStatus = ["Pending", "Booked", "Cancelled", "Rejected"];
  const centerRef = useRef(null);
  const bookingsRef = useRef(null);
  const [isFilter, setIsFilter] = useState(false);

  const {
    authState: { user },
  } = useAuthContext();

  useEffect(() => {
    getAllBookings();
    fetchCenters();
    fetchOrganization();
    fetchBookingDistinctStats();
  }, []);

  const getAllBookings = async () => {
    try {
      const byCountry = lowerCase(user.role) === "moderator" ? true : false;

      const country = user.country;
      if (byCountry) {
        const { data } = await Axios.get(
          `/bookings/get_all_bookings_by_country?country=${country}`
        );
        bookingsRef.current = {
          data: data.bookings,
          count: data.totalBookings,
        };
        setbookings(data.bookings);
        setTotalBookings(data.totalBookings);
        setloading(false);
        return;
      }
      const { data } = await Axios.get(`/bookings/getallbookings`);
      bookingsRef.current = {
        data: data.bookings,
        count: data.totalBookings,
      };
      setbookings(data.bookings);
      setTotalBookings(data.totalBookings);
      // setDuplicateBooking(data);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const fetchOrganization = async () => {
    try {
      const data = (await Axios.get("/services/getallservices")).data;
      setOrganizations(data.staff);
    } catch (error) {}
  };

  const fetchCenters = async () => {
    try {
      const data = await (
        await Axios.get("/centers/getallcenters?order=true")
      ).data;
      setEnrolmentCenters(data.centers);
    } catch (error) {}
  };

  const fetchBookingDistinctStats = async () => {
    try {
      const { data } = await Axios.get("/bookings/get_bookings_distinct_stats");
      setCountries(data._countries);
      setCenters(data._centers);
      centerRef.current = data._centers;
    } catch (error) {}
  };

  const handleLoadMoreBookings = async (e) => {
    e.preventDefault();
    try {
      if (isFilter) {
        const query = `country=${country}&center=${center}&category=${category}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&total=${bookings.length}`;
        const {
          data: { data },
        } = await Axios.get(`/bookings/get_bookings_by_filter?${query}`);
        setbookings((prev) => [...prev, ...data]);
        return;
      }
      const { data } = await Axios.get(
        `/bookings/getallbookings?total=${bookings.length}`
      );
      setbookings((prev) => [...prev, ...data.bookings]);
      setloading(false);
    } catch (error) {
      setloading(false);
      seterror(error);
    }
  };

  const handleSearchInput = async (e) => {
    const value = e.target.value.toLowerCase();
    const filterBookings = bookings.filter(
      (b) =>
        lowerCase(b.user.userId).toString().includes(value) ||
        lowerCase(b.service).includes(value) ||
        lowerCase(b.category).includes(value) ||
        lowerCase(b.date).includes(value) ||
        lowerCase(b.status).includes(value) ||
        lowerCase(b.country).includes(value) ||
        lowerCase(b.userCenter).includes(value)
    );
    setSearchBookings(filterBookings);
  };

  const showModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const openEditModal = (payload) => {
    showModal();
    setUserBookingDetails(payload);
  };

  const filterByDate = (dates) => {
    setFromDate(moment(dates[0]).format("YYYY-MM-DD"));
    setToDate(moment(dates[1]).format("YYYY-MM-DD"));
    setDateError("");
  };


  const getUpdatedData = (payload) => {
    setbookings((prev) => {
      const _data = prev.map((p) => (p._id === payload._id ? payload : p));
      return _data;
    });
  };

  function handleDelete(id) {
    try {
      swal("Are you sure you want to delete this booking?", {
        dangerMode: true,
        buttons: true,
      }).then(async (isConfirmed) => {
        try {
          if (isConfirmed) {
            const res = await Axios.delete(`/bookings/deletebooking/${id}`, {
              data: {
                name: user.name,
                email: user.email,
                country: user.country,
                role: user.role,
              },
            });
            setbookings((prev) => prev.filter((p) => p._id !== id));
            setTotalBookings((prev) => prev - 1);
            swal("Deleted", res.data.message, "info");
          }
        } catch (error) {
          swal("Oops", getErrorMessage(error), "error");
        }
      });
    } catch (error) {}
  }

  const handleUserDetails = (_booking) => {
    return history.push(`/users/${_booking._id}`, _booking);
  };

  const handleCountryChange = async (e) => {
    try {
      const value = e.target.value;
      setCountry(value);
      if (value === "All") {
        setCenters(centerRef.current);
      } else {
        const { data } = await Axios.get(
          `/bookings/get_bookings_distinct_stats/${value}`
        );
        setCenters(data.centers);
      }
    } catch (error) {}
  };

  const handleCenterInput = (e) => {
    setCenter(e.target.value);
  };

  const handleCategoryInput = (e) => {
    setCategory(e.target.value);
  };

  const handleStatusInput = (e) => {
    setStatus(e.target.value);
  };

  const handleFilterButton = async (e) => {
    e.preventDefault();
    try {
      const query = `country=${country}&center=${center}&category=${category}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`;
      setIsFilter(true);
      const {
        data: { data, count },
      } = await Axios.get(`/bookings/get_bookings_by_filter?${query}`);
      setbookings(data);
      setTotalBookings(count);
    } catch (error) {}
  };

  const handleExport = async (e) => {
    try {
      const fileName = "All_Bookings";
      const exportType = e.target.value;
      if (exportType === "none") return;
      const { error, data, msg } = await getExportData();
      if (error) {
        return swal("Oops", msg, "error");
      }
      exportFromJSON({data,fileName,exportType});
      swal("Please wait", "Your export would start soon", "info")
    } catch (error) {

    }
  };

  return (
    <div className="wrapper">
      <Helmet>
        <title>All Bookings</title>
      </Helmet>
      <div className="top-header">
        {loading && <Loader />}
        <h1 className="text-center pt-5 text-white adminText">
          <strong>All Bookings ({totalBookings})</strong>
        </h1>
      </div>

      <div className="content-body">
        <div className="wrapper ml-4 mr-4">
          <div className="row">
            <div className="col-lg-8">
              <input
                type="search"
                className="mb-3 form-control rounded"
                placeholder="Search Here... Booking ID, User ID, Service Name, Service Type, Availability Date, Country, Enrolment Center or Status"
                required
                onChange={handleSearchInput}
              />
            </div>

            <div className="col-lg-4 mb-3">
              <select onChange={(e) => handleExport(e)}>
                <option value="none">Choose Export Format</option>
                <option value="json">Export as JSON</option>
                <option value="txt">Export as text</option>
                <option value="csv">Export as CSV</option>
                <option value="xlx">Export as XLX</option>
              </select>
            </div>

            <div className="col-lg-2 col-sm-12 mb-3">
              <RangePicker
                className="form-control userScreenInputs"
                format="YYYY-MM-DD"
                onChange={filterByDate}
                // disabledDate={disabledDate}
                picker="week"
              />
            </div>

            <div className="col-lg-2 col-sm-12 mb-3">
              <select onChange={(e) => handleCountryChange(e)}>
                <option>Select Country</option>
                <option>All</option>
                {countries.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-sm-12 mb-3">
              <select onChange={(e) => handleCenterInput(e)}>
                <option>Select enrolment Center</option>
                <option>All</option>
                {centers.map((c) => (
                  <option value={c} key={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2 col-sm-12 mb-3">
              <select onChange={(e) => handleCategoryInput(e)}>
                <option>Select Category</option>
                <option>All</option>
                <option>Regular</option>
                <option>Premium</option>
              </select>
            </div>

            <div className="col-lg-2 col-sm-12 mb-3 mb-3">
              <select onChange={(e) => handleStatusInput(e)}>
                <option>Select Status</option>
                <option>All</option>
                {allowedStatus.map((t) => (
                  <option key={t} value={t.toLowerCase()}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="col mb-3">
              <Button
                type="dashed"
                onClick={(e) => handleFilterButton(e)}
                danger
              >
                Filter
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="row ml-3 mr-3">
        <div className="col-md-12 table-data">
          <table className="table table-bordered table-dark">
            <thead className="bs">
              <tr>
                <th>S/N</th>
                <th>User ID</th>
                <th>Service Name</th>
                <th>Service Type</th>
                <th>Country</th>
                <th>Center</th>
                <th>Date</th>
                <th>Status</th>
                {checkSuperAdmin(user.role) && <th>Action</th> }
              </tr>
            </thead>

            <tbody>
              {searchBookings.length === 0
                ? bookings &&
                  bookings.map((booking, i) => {
                    return (
                      <tr key={booking._id.toString()}>
                        <td>{i + 1}</td>
                        <td>{booking.user.userId}</td>
                        <td>{booking.service}</td>
                        <td>{booking.category}</td>
                        <td>{booking.country}</td>
                        <td>{booking.userCenter}</td>
                        <td>{booking.date}</td>
                        <td>{booking.status}</td>
                        {checkSuperAdmin(user.role) && <td>
                          <span
                            onClick={() => handleUserDetails(booking)}
                            className="mr-3"
                          >
                            <i
                              className="fa fa-eye"
                              style={{ color: "white" }}
                            ></i>
                          </span>

                          <span
                            onClick={() => handleDelete(booking._id)}
                            className="mr-3"
                          >
                            <i
                              className="fa fa-trash"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                          <span onClick={() => openEditModal(booking)}>
                            <i
                              className="fa fa-pencil"
                              style={{ color: "green" }}
                            ></i>
                          </span>
                        </td> }
                      </tr>
                    );
                  })
                : searchBookings &&
                  searchBookings.map((booking, i) => {
                    return (
                      <tr key={booking._id.toString()}>
                        <td>{i + 1}</td>
                        <td>{booking.user.userId}</td>
                        <td>{booking.service}</td>
                        <td>{booking.category}</td>
                        <td>{booking.country}</td>
                        <td>{booking.userCenter}</td>
                        <td>{booking.date}</td>
                        <td>{booking.status}</td>
                        {checkSuperAdmin(user.role) && <td>
                          <span
                            onClick={() => handleUserDetails(booking)}
                            className="mr-3"
                          >
                            <i
                              className="fa fa-eye"
                              style={{ color: "white" }}
                            ></i>
                          </span>
                          <span
                            onClick={() => handleDelete(booking._id)}
                            className="mr-3"
                          >
                            <i
                              className="fa fa-trash"
                              style={{ color: "red" }}
                            ></i>
                          </span>
                          <span onClick={() => openEditModal(booking)}>
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
          {totalBookings > bookings.length && (
            <button onClick={(e) => handleLoadMoreBookings(e)}>
              Load More
            </button>
          )}
        </div>
      </div>
      <EditBookingModal
        {...{
          isModalVisible,
          showModal,
          userBookingDetails,
          organizations,
          enrolmentCenters,
          getUpdatedData,
        }}
      />
    </div>
  );
};

export default AllBookings;
