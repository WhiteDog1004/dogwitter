import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import MyPost from "../routes/MyPost";
import Profile from "../routes/Profile";
import Navigation from "components/Navigation";
import { useEffect } from "react";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    const [profileNickName, setProfileNickName] = useState("");
    useEffect(() => {
        if (isLoggedIn) {
            setProfileNickName(userObj ? userObj.uid : undefined);
        }
    }, [isLoggedIn, userObj]);
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/" element={<Home userObj={userObj} refreshUser={refreshUser} />}></Route>
                        <Route exact path={`/${profileNickName}`} element={<MyPost userObj={userObj} />}></Route>
                        <Route exact path="/profile" element={<Profile refreshUser={refreshUser} userObj={userObj} />}></Route>
                    </>
                ) : (
                    <>
                        <Route exact path="/" element={<Auth />}> </Route>
                    </>
                )}
            </Routes>
        </Router>
    )
};
export default AppRouter;