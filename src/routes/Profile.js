import { authService } from "fbase";
import React from "react";
import { Link } from "react-router-dom";

export default () => {
    const onLogOutClick = () => authService.signOut();
    return (
    <>
        <Link to='/'><button onClick={onLogOutClick} >LogOut</button></Link>
    </>
    )
}