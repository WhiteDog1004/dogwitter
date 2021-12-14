import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

import '../css/authForm.scss';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons"

const AuthForm = () => {
    const [newAccount, setNewAccount] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const toggleAccount = () => setNewAccount((prev) => !prev);

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // login
                data = await authService.signInWithEmailAndPassword(email, password);
            }
            console.log(data);
        } catch (error) {
            if(error.message.includes("There")){
                setError("계정이 없습니다.");
            } else if(error.message.includes("password")){
                setError("비밀번호가 틀렸습니다.");
            } else if(error.message.includes("Password")){
                setError("비밀번호는 최소 6자 이상 입력해주세요.");
            } else if(error.message.includes("another")){
                setError("이미 존재하는 계정입니다.");
            } else {
                console.log(error.message);
            }
        }
    };

    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }
        await authService.signInWithPopup(provider)
        .then((result)=>{
            var user = result.user;
            console.log(user);
        }, (error)=> {
            // console.log(error);
        });
    };

    return (
        <>
            <div className="formBox">
                <FontAwesomeIcon icon={faTwitter} size="6x"/>
                <form onSubmit={onSubmit} className="inputForm">
                    <input
                        className="emailInput"
                        name="email"
                        type="email"
                        placeholder="Email"
                        required
                        value={email}
                        onChange={onChange}
                    />
                    <input
                        className="passwordInput"
                        name="password"
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={onChange}
                    />
                    <input type="submit" value={newAccount ? "회원가입 완료" : "로그인"} />
                    {error}
                </form>
                <div className="outBtn">
                    <span onClick={toggleAccount}>{newAccount ? "계정이 있으신가요?" : "계정을 만들고 싶으신가요?"} </span>
                    <button onClick={onSocialClick} name='google'>Continue with Google</button>
                </div>
            </div>
        </>
    )
};

export default AuthForm;