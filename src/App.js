import "./App.css";
import Navbar from "./components/Navbar";
import {Route,Redirect,Switch} from "react-router-dom";
import Homescreen from "./screens/Homescreen";
import Bookingscreen from "./screens/Bookingscreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import Profilescreen from "./screens/Profilescreen";
import Adminscreen from "./screens/Adminscreen";
import "antd/dist/antd.css";
import AllBookings from "./screens/AllBookings";
import AllServices from "./screens/AllServices";
import AllUsers from "./screens/AllUsers";
import AllCenters from "./screens/AllCenters";
import AddCenter from "./screens/AddCenter";
import AddService from "./screens/AddService";
import ProtectedRoute from "./views/ProtectedRoute";
import UserDetails from "./screens/UserDetails";
import EditService from "./components/EditService";
import EditCenter from "./components/EditCenter";
import AllPayments from "./screens/AllPayments";
import PaymentDetails from "./screens/PaymentDetails";
import EditUserProfile from "./screens/editUserProfile";
import TestScreen from "./screens/TestScreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Switch>
        <Route path="/" exact component={Homescreen} />
        <Route path="/login" exact component={Loginscreen} />
        <Route path="/book/:serviceid/:date" exact component={Bookingscreen}/>
        <Route path="/test-link" exact component={TestScreen}/>
        <ProtectedRoute path="/edit_service/:details" exact component={EditService} />
        <ProtectedRoute path="/edit_user/:details" exact component={EditUserProfile} />
        <ProtectedRoute path="/edit_center/:details" exact component={EditCenter} />
        <ProtectedRoute path="/payments/:details" exact component={PaymentDetails} />
        <ProtectedRoute path="/users/:user" exact component={UserDetails} />
        <ProtectedRoute path="/register" exact component={Registerscreen} />
        <ProtectedRoute path="/bookings" exact component={AllBookings} />
        <ProtectedRoute path="/profile" exact component={Profilescreen} />
        <ProtectedRoute path="/admin" exact component={Adminscreen} />
        <ProtectedRoute path="/services" exact component={AllServices} />
        <ProtectedRoute path="/users" exact component={AllUsers} />
        <ProtectedRoute path="/enrolment-centers" exact component={AllCenters}/>
        <ProtectedRoute path="/payments" exact component={AllPayments} />
        <ProtectedRoute path="/add-service" exact component={AddService} />
        <ProtectedRoute path="/add-center" exact component={AddCenter} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
