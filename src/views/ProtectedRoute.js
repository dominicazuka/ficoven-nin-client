import { Redirect, Route } from "react-router-dom";
import Loader from "../components/Loader";
import { useAuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ ...rest }) => {
  const {
    authState: { isAuthenticated, isAuthenticating },
  } = useAuthContext();
  if (isAuthenticating) {
    return <Loader />;
  }
  if (isAuthenticated) {
    return <Route {...rest} />;
  }
  return <Redirect to={{ pathname: "/", state: { from: rest.location } }} />;
};

export default ProtectedRoute;
