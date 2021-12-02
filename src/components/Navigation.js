import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => (
    <nav>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            <li>
                <Link to="/profile">{userObj?.displayName ? `${userObj.displayName}의 프로필` : `유저의 프로필`}</Link>
            </li>
        </ul>
    </nav>
)
export default Navigation;