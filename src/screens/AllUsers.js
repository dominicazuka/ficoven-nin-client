import React, { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Axios from "../config";
import { Button } from "antd";
import { useAuthContext } from "../contexts/AuthContext";
import swal from "sweetalert";
import { Helmet } from "react-helmet";
import { getErrorMessage, lowerCase } from "../utils";

//Users list component
const AllUsers = ({ history }) => {
    const [users, setusers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchUsers, setSearchUsers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    const {
        authState: { user: userAdmin },
    } = useAuthContext();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async() => {
        try {
            const { data } = await Axios.get("/users/getallusers");
            setusers(data.users);
            setTotalUsers(data.totalUsers);
            setloading(false);
        } catch (error) {
            setloading(false);
            seterror(error);
        }
    };

    const handleLoadMoreUsers = async(e) => {
        e.preventDefault();
        try {
            const { data } = await Axios.get(
                `/users/getallusers?total=${users.length}`
            );
            setusers((prev) => [...prev, ...data.users]);
            setloading(false);
        } catch (error) {
            setloading(false);
            seterror(error);
        }
    };
    const handleSearchInput = async(e) => {
        const value = e.target.value.toLowerCase();
        const filterUsers = users.filter(
            (u) =>
            lowerCase(u.name).includes(value) ||
            lowerCase(u.email).includes(value) ||
            lowerCase(u.phone_no).includes(value) ||
            lowerCase(u.role).includes(value) ||
            lowerCase(u.country).includes(value)
        );
        setSearchUsers(filterUsers);
    };

    const handleBlockUnblockedUser = async(e, _id, isBlocked) => {
        e.preventDefault();
        try {
            const res = await Axios.patch(`/users/block_unblock_user`, {
                _id,
                isBlocked,
            });
            setusers((pre) =>
                pre.map((p) => (p._id === _id ? {...p, isBlocked } : p))
            );
            setSearchUsers((pre) =>
                pre.map((p) => (p._id === _id ? {...p, isBlocked } : p))
            );
            swal("Great", res.data, isBlocked ? "success" : "info");
        } catch (error) {
            swal("Oops", getErrorMessage(error), "error");
        }
    };

    const handleDeleteUser = async(id) => {
        try {
            swal("Are you sure you want to delete this user?", {
                dangerMode: true,
                buttons: true,
            }).then(async(isConfirmed) => {
                try {
                    if (isConfirmed) {
                        const res = await Axios.delete(`/users/delete_user/${id}`, {
                            data: {
                                name: userAdmin.name,
                                email: userAdmin.email,
                                country: userAdmin.country,
                                role: userAdmin.role,
                            },
                        });
                        setusers((prev) => prev.filter((p) => p._id !== id));
                        swal("Deleted", res.data.message, "info");
                    }
                } catch (error) {
                    swal("Oops", getErrorMessage(error), "error");
                }
            });
        } catch (error) {}
    };

    const handleRedirect = (e, payload) => {
        e.preventDefault();
        return history.push(`/edit_user/${payload._id}`, payload);
    };

    const showAction = (user, actionHandler) => {
        const userAdminRole = lowerCase(userAdmin.role);
        if (userAdminRole === "super") {
            if (lowerCase(user.role) === "super") {
                return null;
            }

            const showButton = !user.isBlocked ? ( <
                div className = "row justify-content-evenly" >
                <
                div className = "col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                <
                div className = "d-flex justify-content-around" >
                <
                Button type = "info"
                info onClick = {
                    (e) => handleRedirect(e, user) } >
                Edit { " " } <
                /Button>{" "} <
                Button type = "danger"
                danger onClick = {
                    (e) => actionHandler(e, user._id, true) } >
                Disable { " " } <
                /Button>{" "} <
                /div>{" "} <
                /div>{" "} <
                div className = "col-lg-6 col-md-6 col-sm-6 col-xs-6" >
                <
                i className = "fa fa-trash ml-3"
                style = {
                    { color: "red" } }
                onClick = {
                    (e) => handleDeleteUser(user._id) } >
                < /i>{" "} <
                /div>{" "} <
                /div>
            ) : ( <
                div className = "row justify-content-evenly " >
                <
                div className = "col-lg-6 d-flex justify-content-around" >
                <
                Button type = "info"
                info onClick = {
                    (e) => handleRedirect(e, user) } >
                Edit { " " } <
                /Button>{" "} <
                Button type = "primary"
                onClick = {
                    (e) => actionHandler(e, user._id, false) } >
                Enable { " " } <
                /Button>{" "} <
                /div>{" "} <
                div className = "col-lg-6" >
                <
                i className = "fa fa-trash ml-3"
                style = {
                    { color: "red" } }
                onClick = {
                    (e) => handleDeleteUser(user._id) } >
                < /i>{" "} <
                /div>{" "} <
                /div>
            );
            return showButton;
        }

        if (userAdminRole === "admin") {
            if (
                lowerCase(user.role) === "super" ||
                lowerCase(user.role) === "admin"
            ) {
                return null;
            }

            const showButton = !user.isBlocked ? ( <
                div >
                <
                div className = "d-flex justify-content-around" >
                <
                Button type = "info"
                info onClick = {
                    (e) => handleRedirect(e, user) } >
                Edit { " " } <
                /Button>{" "} <
                Button type = "danger"
                danger onClick = {
                    (e) => actionHandler(e, user._id, true) } >
                Disable { " " } <
                /Button>{" "} <
                /div>{" "} <
                /div>
            ) : ( <
                div class = "d-flex justify-content-around" >
                <
                Button type = "info"
                info onClick = {
                    (e) => handleRedirect(e, user) } >
                Edit { " " } <
                /Button>{" "} <
                Button type = "primary"
                onClick = {
                    (e) => actionHandler(e, user._id, false) } >
                Enable { " " } <
                /Button>{" "} <
                /div>
            );
            return showButton;
        }
    };
    return ( <
        div className = "wrapper" >
        <
        Helmet >
        <
        title > All Users < /title>{" "} <
        /Helmet>{" "} <
        div className = "top-header" >
        <
        h1 className = "text-center pt-5 text-white adminText" >
        <
        strong > All Admins({ totalUsers }) < /strong>{" "} <
        /h1>{" "} <
        /div>{" "} <
        div className = "content-body ml-3 mr-3" >
        <
        div className = "row" >
        <
        div className = "col-lg-12" > { " " } { loading && < Loader / > } { " " } <
        input type = "search"
        className = "mb-3 form-control rounded"
        placeholder = "Search Here... User Country, Phone Number, Email or Country"
        required onChange = { handleSearchInput }
        />{" "} <
        /div>{" "} <
        /div>{" "} <
        div className = "row" >
        <
        div className = "col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive" >
        <
        table className = "table table-dark table-bordered table-hover table-fixed"
        width = "100%" >
        <
        thead className = "bs" >
        <
        tr >
        <
        th > S / N < /th> <th> Full name </th > < th > Email < /th>{" "} <
        th > Phone Number < /th> <th> Country </th > < th > Role < /th>{" "} <
        th class = "th-lg" > Action < /th>{" "} <
        /tr>{" "} <
        /thead>{" "} <
        tbody > { " " } {
            searchUsers.length === 0 ?
                users &&
                users.map((user, i) => {
                    return ( <
                        tr key = { user._id.toString() }
                        className = {
                            lowerCase(user._id) === lowerCase(userAdmin._id) ?
                            "active-user" :
                                ""
                        } >
                        <
                        td > { i + 1 } < /td> <td> {user.name} </td > { " " } <
                        td > { user.email } < /td> <td> {user.phone_no} </td > { " " } <
                        td > { user.country } < /td> <td> {user.role} </td > { " " } <
                        td align = "center" > { " " } { showAction(user, handleBlockUnblockedUser) } { " " } <
                        /td>{" "} <
                        /tr>
                    );
                }) :
                searchUsers &&
                searchUsers.map((user, i) => {
                    return ( <
                        tr key = { user._id.toString() }
                        className = {
                            lowerCase(user._id) === lowerCase(userAdmin._id) ?
                            "active-user" :
                                ""
                        } >
                        <
                        td > { i + 1 } < /td> <td> {user.name} </td > { " " } <
                        td > { user.email } < /td> <td> {user.phone_no} </td > { " " } <
                        td > { user.country } < /td> <td> {user.role} </td > { " " } <
                        td align = "center" > { " " } { showAction(user, handleBlockUnblockedUser) } { " " } <
                        /td>{" "} <
                        /tr>
                    );
                })
        } { " " } <
        /tbody>{" "} <
        /table>{" "} {
            totalUsers > users.length && ( <
                button onClick = {
                    (e) => handleLoadMoreUsers(e) } > { " " }
                Load More { " " } <
                /button>
            )
        } { " " } <
        /div>{" "} <
        /div>{" "} <
        /div>{" "} <
        /div>
    );
};
export default AllUsers;