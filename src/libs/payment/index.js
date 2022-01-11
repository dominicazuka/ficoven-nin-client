import {redirectUrl} from "../../utils"

let closedFunction = function() {
    alert('window closed by Sakarious');
}

let successFunction=function(transaction_id) {
    alert('Transaction was successfully carried out, Ref: '+transaction_id)
}

let failedFunction = function(transaction_id) {
    alert('Transaction was not successful, Ref: '+transaction_id)
}

function payNow(item){
  //Initiate voguepay inline payment
  const date = new Date()
  const ref = date.getTime()
  // eslint-disable-next-line no-undef
  Voguepay.init({
    v_merchant_id: 'sandbox_760e43f202878f651659820234cad9',
    total: item.price,
    notify_url: redirectUrl,
    cur: 'USD',
    merchant_ref: 'ref' +ref,
    memo:'Payment for NIN',
    developer_code: '5a61be72ab323',
    items: [
      {
        name: item.title,
        description: item.description,
        price: item.price
      }
    ],
    customer: {
      name: item.name,
      email: item.email,
      phone: item.phone_no
    },
    closed:closedFunction,
    success:successFunction,
    failed:failedFunction
  });
}
