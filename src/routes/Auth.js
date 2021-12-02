import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fbase";
import React from "react";

const Auth = () => {

    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        }
        await authService.signInWithPopup(provider);
    }

    return (
        <div>
            <AuthForm />
            <div>
                <button onClick={onSocialClick} name='google'>Continue with Google</button>
            </div>
        </div>
    )
}
export default Auth;
