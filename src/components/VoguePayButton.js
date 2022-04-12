import React from 'react';
import vouguePayPng from "../assets/images/voguePay.png";
import { v4 as uuidv4 } from 'uuid';
import {verifyVoguePayUrl, APP_URL} from "../config"; 

const VoguePayButton = ({getResponse, bookingDetails}) => {

const userData = bookingDetails;

// const payNow = async (e) => {
//     e.preventDefault();
//     const body = `https://voguepay.com/?p=linkToken&v_merchant_id=2817-0116360&
//     memo=Payment for NIN Capture&total=${user.totalAmount}&merchant_ref=${uuidv4()}&
//     notify_url=${verifyVoguePayUrl}&
//     success_url=${APP_URL}/verify-payment?status=success&
//     fail_url=${APP_URL}/verify-payment?status=fail&developer_code=5a61be72ab323&cur=USD`
//     const result = await axios.post(body, {}, {
//         withCredentials: true
//     });
//     console.log(result);
// }

const closedFunction = function() {
        alert('window closed by you');
    }

const successFunction = function(transaction_id) {
        getResponse({
          booking: userData, 
          payment: {
            transaction_id, v_merchant_id:process.env.REACT_APP_VOGUE_PAY_MERCHANT_ID}
        });

    }

const failedFunction = function(transaction_id) {
        alert('Transaction was not successful, Ref: '+transaction_id);
    }

function pay(e){
    console.log(process.env.REACT_APP_VOGUE_PAY_MERCHANT_ID);
    console.log(userData);
      //disable-eslint-next-line
      const Voguepay = window.Voguepay;
      Voguepay.init({
        v_merchant_id: process.env.REACT_APP_VOGUE_PAY_MERCHANT_ID, //6538-0116499
        total: userData.totalAmount,
        notify_url: verifyVoguePayUrl,
        cur: 'NGN',
        merchant_ref: uuidv4(),
        memo:'Payment for NIN Capture',
        developer_code: '5a61be72ab323', //62540b4ccac20
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
        <button className="btn btn-dark btn-sm w-100 rounded" onClick={e=>pay(e)}>Pay with <img src={vouguePayPng} alt="VoguePay button" className="text-white" /></button>
    </div>
  )
}

export default VoguePayButton