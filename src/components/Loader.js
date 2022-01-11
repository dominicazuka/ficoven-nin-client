import React, {useState} from 'react';
import HashLoader from "react-spinners/HashLoader";
function Loader() {
    let [loading] = useState(true);
    return (
        <div className='loader'>
            <div className="loader sweet-loading text-center">
                <HashLoader color='#000' loading={loading} css='' size={30} />
            </div>
        </div>
    );
}

export default Loader;