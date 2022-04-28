import React from 'react';
import vouguePayPng from "../assets/images/voguePay.png";
import { v4 as uuidv4 } from 'uuid';
import {verifyVoguePayUrl, APP_URL} from "../config"; 
import swal from "sweetalert";

const VoguePayButton = ({getResponse, bookingDetails}) => {

const userData = bookingDetails;

const closedFunction = function() {
      swal("Transaction aborted", "Transaction not completed", "error"); 
    }

const successFunction = function(transaction_id) {
        getResponse({
          booking: userData, 
          payment: {
            transaction_id, v_merchant_id:process.env.REACT_APP_VOGUE_PAY_MERCHANT_ID}
        });

    }

const failedFunction = function(transaction_id) {
        swal("Transaction error", "Transaction failed, kindly copy the transaction id for reference: " + transaction_id, "error"); 
    }

function pay(){
      console.log(process.env.REACT_APP_VOGUE_PAY_CUR);
      //disable-eslint-next-line
      const Voguepay = window.Voguepay;
      Voguepay.init({
        v_merchant_id: process.env.REACT_APP_VOGUE_PAY_MERCHANT_ID,
        total: userData.totalAmount,
        notify_url: verifyVoguePayUrl,
        cur: process.env.REACT_APP_VOGUE_PAY_CUR,
        merchant_ref: uuidv4(),
        memo:'Payment for NIN Capture',
        developer_code: process.env.REACT_APP_VOGUE_PAY_DEVELOPER_CODE,
        items: [
          {
            name: "NIMC | FICOVEN | PANDUS POWELLS",
            description: "Payment for NIN Capture",
            price: userData.totalAmount
          }
        ],
        customer: {
          name: userData.user.firstName + " " + userData.user.lastName,
          address: userData.user.streetAddress,
          city: userData.user.city,
          state: userData.user.state,
          zipcode: 'Nil',
          email: userData.user.email,
          phone: userData.user.phoneNumber
        },
        closed:closedFunction,
        success:successFunction,
        failed:failedFunction
      });
    }
    
    //Demo Link: https://codepen.io/sakarious/pen/OJmYVxM

  return (
    <div>
        <button className="btn btn-dark btn-sm w-100 rounded" onClick={()=>pay()}>Pay with <img src={vouguePayPng} alt="VoguePay button" className="text-white" /></button>
    </div>
  )
}

export default VoguePayButton