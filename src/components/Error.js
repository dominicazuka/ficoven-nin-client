import React from 'react'
import swal from 'sweetalert'

function Error({message}) {
    return (
        <div>
            <div className="alert alert-danger" role="alert">
                {swal("Error", message, "error")}
            </div>
        </div>
    )
}
 
export default Error
