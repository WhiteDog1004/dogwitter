import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const onLogOutClick = () => authService.signOut();
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
    }, [])
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
        };
    };
    return (
        <>
            <div>
                <form onSubmit={onSubmit}>
                    <input
                        onChange={onChange}
                        type="text"
                        placeholder="프로필 닉네임"
                        value={newDisplayName}
                    />
                    <input type="submit" value="프로필 업데이트" />
                </form>
                <Link to='/'><button onClick={onLogOutClick} >LogOut</button></Link>
            </div>
        </>
    )
}