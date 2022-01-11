import React, {useState} from "react";
import { Modal} from "antd";
import {DatePicker} from "antd";
import moment from "moment";
import Axios from "../config";
import { allowedTimes } from "../data";
import { isEmpty } from "../utils/";
import Loader from "../components/Loader";
import swal from "sweetalert";
import { useAuthContext } from "../contexts/AuthContext";

const EditBookingModal = ({
  isModalVisible,
  showModal,
  userBookingDetails,
  organizations,
  enrolmentCenters,
  getUpdatedData,
}) => {
  const [date, setDate] = useState(
    !isEmpty(userBookingDetails) && userBookingDetails.date
  );
  const [organization, setOrganization] = useState(
    !isEmpty(userBookingDetails) && userBookingDetails.organization
  );
  const [userCenter, setUserCenter] = useState(
    !isEmpty(userBookingDetails) && userBookingDetails.userCenter
  ); 
  const [time, setTime] = useState(
    !isEmpty(userBookingDetails) && userBookingDetails.time
  );
  const [status, setStatus] = useState(
    !isEmpty(userBookingDetails) && userBookingDetails.status
  );

  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const allowedStatus = ["Pending", "Booked", "Cancelled", "Rejected"];

  const dateFormat = "DD-MM-YYYY";

  const {
    authState: { user },
  } = useAuthContext();

  const filterCenters = enrolmentCenters.filter(
    (c) => c.countryCode === userBookingDetails.countryCode
  );

  const handleOrganizationInput = (e) => {
    setOrganization(e.target.value);
  };

  const handleCenterInput = (e) => {
    setUserCenter(e.target.value);
  };

  function filterByDate(dates) {
    setDate(moment(dates).format("DD-MM-YYYY"));
  }

  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf();
  }

  const handleTimeInput = (e) => {
    setTime(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        organization: !organization
          ? userBookingDetails.organization
          : organization,
        time: !time ? userBookingDetails.time : time,
        userCenter: !userCenter ? userBookingDetails.userCenter : userCenter,
        date: !date ? userBookingDetails.date : date,
        status: !status ? userBookingDetails.status : status,
        message,
        notification,
        _id: userBookingDetails._id,
        admin: {
          name: user.name,
          email: user.email,
          country: user.country,
          role: user.role,
        },
      };
      setIsLoading(true);
      const res = await Axios.patch("/bookings/updatebooking", obj);
      swal("Booking Modified", res.data.message, "success");
      showModal();
      getUpdatedData(res.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleNotification = (e) => {
    setNotification(!notification);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleBookingStatus = (e) => {
    setStatus(e.target.value);
  };

  return (
    <>
      <Modal
        title="Edit Booking"
        visible={isModalVisible}
        onCancel={showModal}
        onOk={showModal}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Organization</label>
                <select
                  onChange={(e) => handleOrganizationInput(e)}
                  className="required"
                >
                  {organizations.map((o) => (
                    <option key={o.name}>{o.name}</option>
                  ))}
                </select>
                <p className="text-danger"></p>
              </div>
            </div>

            {/* <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Service</label>
                <input type="text" className="form-control form-control-lg" />
                <p className="text-danger"></p>
              </div>
            </div> */}

            <div className="col-lg-12">
              <div className="form-outline form-white">
                <label className="form-label">Enrolment Center</label>
                <select
                  onChange={(e) => handleCenterInput(e)}
                  className="required"
                  value={
                    !isEmpty(userBookingDetails) &&
                    userBookingDetails.userCenter
                  }
                >
                  <option value="None">Select Enrollment Center</option>
                  {filterCenters.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-outline form-white">
                <label className="form-label">Date</label>
                <DatePicker
                  className="form-control"
                  format="DD-MM-YYYY"
                  onChange={filterByDate}
                  defaultValue={moment(userBookingDetails.date, dateFormat)}
                  disabledDate={disabledDate}
                />
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-outline form-white">
                <label className="form-label">Time</label>
                <select
                  onChange={(e) => handleTimeInput(e)}
                  className="required"
                  value={
                    time
                      ? time
                      : !isEmpty(userBookingDetails) && userBookingDetails.time
                  }
                >
                  <option>Select Time</option>
                  {allowedTimes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="col-lg-12">
              <div class="form-outline form-white">
                
                <label className="form-label">Booking Status</label>
                <select
                  onChange={(e) => handleBookingStatus(e)}
                  className="required"
                  value={
                    status
                      ? status
                      : !isEmpty(userBookingDetails) &&
                        userBookingDetails.status
                  }
                >
                  <option>Select Status</option>
                  {allowedStatus.map((t) => (
                    <option key={t} value={t.toLowerCase()}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-lg-12 mt-3">
              <div className="form-outline form-white">
                <label className="form-label">Internal Note</label>
                <textarea
                  type="text"
                  className="form-control form-control-lg"
                  value={message}
                  onChange={handleMessage}
                ></textarea>
                <p className="text-danger"></p>
              </div>
            </div>

            <div className="form-check d-flex justify-content-start mb-4 pb-3">
              <input
                className="form-check-input"
                type="checkbox"
                value={notification}
                onChange={handleNotification}
                checked={notification}
              />
              <label className="form-check-label text-dark">
                Send notifications
              </label>
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
      </Modal>
    </>
  );
};

export default EditBookingModal;
