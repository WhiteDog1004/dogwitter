import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/" element={<Home userObj={userObj} refreshUser={refreshUser} />}></Route>
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