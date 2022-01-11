import React from 'react'
import { Link } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { logout } from '../libs/auth';
import { isSuperAdmin, lowerCase } from '../utils';
import ficovenlogo from '../components/logo/ficovenlogo.png';

function Navbar() {
    const {
        authState: { isAuthenticated, user }
      } = useAuthContext();

    return ( 
        <div>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    {
                       <Link className="navbar-brand" to={isAuthenticated ? "/admin" : "/"}><img src={ficovenlogo} alt="NIN | Ficoven" /></Link>
                    }
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"><i className="fa fa-bars" style={{ color: 'white' }}></i></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mr-5">
                            <li className="nav-item">

                            </li>
                            {isAuthenticated && (
                                <>
                                    <div className="dropdown">
                                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="fa fa-user" style={{ margin: '0px 5px 0px 0px' }}></i>{user.name}
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            {
                                                isAuthenticated && <Link className="dropdown-item" to={isAuthenticated ? "/admin" : "/home"}>Home</Link>
                                            }
                                            <Link className="dropdown-item" to="/profile">Profile</Link>
                                            {
                                                isSuperAdmin.includes(lowerCase(user.role)) && 
                                                <Link className="dropdown-item" to="/register">Add New Admin</Link>
                                            }
                                            <Link className="dropdown-item" to="#" onClick={()=>logout()}>Logout</Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar