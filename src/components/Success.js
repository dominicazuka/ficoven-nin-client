import swal from 'sweetalert';
import React from 'react'
 
function Success({message}) {
    return (
        <div>
            <div className="alert alert-success" role="alert">
                {swal("Great", message, "success")}
            </div>
        </div>
    ) 
}

export default Success
