import { authService, dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";

import {
    faFileImage,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import '../css/profile.scss';

const Profiles = ({ refreshUser, userObj }) => {
    const [attachment, setAttachment] = useState("");

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
            window.location.replace("/");
        } else {
            alert(`변경할 닉네임을 작성해주세요`);
        };
    };

    // 프로필 사진
    const onProfileSubmit = async (event) => {
        event.preventDefault();
        const changeCheck = window.confirm("변경하시겠습니까?");
        if (changeCheck) {
            let attachmentUrl = "";
            if (attachment !== "") {
                const attachmentRef = storageService.ref().child(`${userObj.uid}/avatar`);
                const response = await attachmentRef.putString(attachment, "data_url");
                attachmentUrl = await response.ref.getDownloadURL();

                await userObj.updateProfile({ photoURL: attachmentUrl });
            }
            refreshUser();
            window.location.replace("/");
        }
        setAttachment("");
    };

    const onProfileFileChange = (event) => {
        const { target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        theFile && reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);

    return (
        <>
            <div className="profileFormBox">
                <form onSubmit={onSubmit}>
                    <h3>닉네임 변경</h3>
                    <input
                        onChange={onChange}
                        type="text"
                        placeholder="프로필 닉네임"
                        value={newDisplayName || ""}
                        maxLength={6}
                    />
                    <input type="submit" value="닉네임 변경" />
                </form>

                <form onSubmit={onProfileSubmit} className="profileChangeBox">
                    <h3>프로필 사진 변경</h3>
                    {attachment ? (
                        <div className="profileChangePreview">
                            <img src={attachment} width="150px" height="150px" alt="img" />
                            <button onClick={onClearAttachment}><FontAwesomeIcon icon={faTimesCircle} size="2x" /> </button>
                        </div>
                    ) : (
                        <div className="profileChangePreview">
                            <img src={userObj.photoUrl} width="150px" height="150px" alt="img" />
                        </div>
                    )}
                    <div className="fileInputBox">
                        <label className="inputFileButton" htmlFor="inputFile">
                            <p>파일 선택</p>
                            <FontAwesomeIcon icon={faFileImage} />
                        </label>
                        <input type="file" id="inputFile" accept="image/*" onChange={onProfileFileChange} style={{ display: "none" }} />
                        <input className="changePhotoBtn" type='submit' value="변경하기" />
                    </div>
                </form>
                <button onClick={onLogOutClick} >LogOut</button>
            </div>

        </>
    )
}

export default Profiles;