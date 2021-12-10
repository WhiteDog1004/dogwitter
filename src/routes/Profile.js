import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";

import '../css/profile.scss';
const Profiles = ({ refreshUser, userObj }) => {
    const onLogOutClick = () => {
        const logoutCheck = window.confirm("로그아웃 하시겠습니까?");
        if (logoutCheck) {
            window.location.href = "/";
            authService.signOut();
        }
    };
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const getMyDweets = async () => {
        await dbService
            .collection("dweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt", "desc")
            .get();
        // console.log(dweets.docs.map((doc) => doc.data()));
    }
    useEffect(() => {
        getMyDweets();
    });
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };
    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        } else {
            alert(`변경할 닉네임을 작성해주세요`);
        };
    };
    return (
        <>
            <div className="profileFormBox">
                <form onSubmit={onSubmit}>
                    <input
                        onChange={onChange}
                        type="text"
                        placeholder="프로필 닉네임"
                        value={newDisplayName}
                    />
                    <input type="submit" value="프로필 변경" />
                </form>
                <button onClick={onLogOutClick} >LogOut</button>
            </div>
        </>
    )
}

export default Profiles;