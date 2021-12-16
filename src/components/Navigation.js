import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons"
import {
    faHome,
    faUserAlt,
} from "@fortawesome/free-solid-svg-icons";

import '../css/navigation.scss';
import { useEffect } from "react/cjs/react.development";

const Navigation = ({ userObj }) => {
    const [profileNickName, setProfileNickName] = useState("");

    useEffect(()=> {
        if (userObj) {
            setProfileNickName(userObj.uid);
        }
    }, [userObj]);
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">
                        <FontAwesomeIcon icon={faTwitter} className="twitter" />
                    </Link>
                </li>
                <li>
                    <Link to="/">
                        <FontAwesomeIcon icon={faHome} /> <p>Home</p>
                    </Link>
                </li>
                <li>
                    <Link to={`/${profileNickName}`}>
                        <FontAwesomeIcon icon={faHome} /> <p>My Post</p>
                    </Link>
                </li>
                <li>
                    <Link to="/profile"><FontAwesomeIcon icon={faUserAlt} /> <p>{userObj?.displayName ? `${userObj.displayName}의 프로필` : `유저의 프로필`}</p></Link>
                </li>
            </ul>
        </nav>
    )
};
export default Navigation;