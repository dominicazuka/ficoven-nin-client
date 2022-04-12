import Axios from "../../config";
import { getErrorMessage } from "../../utils";

export const verifyVoguePayment = async (payload) => {
  try {
    const result = await Axios.post("/payments/verify-voguepay", payload);
    console.log(result);
    return { error: false, data: [], msg: "Transaction Verified Successfully" };
  } catch (error) {
    return { error: true, data: [], msg: getErrorMessage(error)};
  }
}