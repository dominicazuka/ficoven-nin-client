import React, { useState, useEffect } from "react";
import Service from "../components/Service";
import Loader from "../components/Loader";
import { Card } from "antd";
import Axios from "../config";
import UserScreen from "./UserScreen";

function Homescreen({ history }) {
  const [services, setservices] = useState([]);
  const [loading, setloading] = useState();
  const [error, seterror] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({});
  const [isNext, setIsNext] = useState(false);

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      setloading(true);
      const data = (await Axios.get("/services/getallservices")).data;
      setservices(data.services);
      setOrganizations(data.staff);
      setloading(false);
    } catch (error) {
      seterror(true);
      setloading(false);
    }
  };

  return (
    <div className="card1 col-lg-12">
      <Card className="card" title="Pre-enrol for NIN">
        <div className="container-fluid">
          <div className="row mt-1">
            {loading ? (
              <Loader />
            ) : !isNext ? (
              <div className="col-md-12 col-lg-12 mt-1">
                <Service
                  history={history}
                  services={services}
                  organizations={organizations}
                  setBookingDetails={setBookingDetails}
                  setIsNext={setIsNext}
                />
              </div>
            ) : (
              <UserScreen
                setIsNext={setIsNext}
                bookingDetails={bookingDetails}
                history={history}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Homescreen;
