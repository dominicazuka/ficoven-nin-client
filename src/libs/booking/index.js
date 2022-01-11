import Axios from "../../config";
import { getErrorMessage } from "../../utils";

export const getExportData = async () => {
  try {
    const {
      data: { bookings },
    } = await Axios.get(`/bookings/get_all_export_bookings`);
    return { error: false, data: bookings, msg: "Data Fetched Successfully" };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};

export const getBookingByEmail = async (email) => {
  try {
    const { data } = await Axios.get(`/bookings/get_booking_by_email/${email}`);
    return { error: false, data, msg: "Data Fetched Successfully" };
  } catch (error) {
    return { error: true, data: {}, msg: getErrorMessage(error) };
  }
};
