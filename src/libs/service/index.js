import Axios from "../../config";
import { getErrorMessage } from "../../utils";

export const updateService = async (obj) => {
  try {
    await Axios.patch("/services/update_service", obj);
    return { error: false, data: {}, msg: "Booking modified successfully" };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};
