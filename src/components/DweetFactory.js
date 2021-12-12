import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

import '../css/dweetFactory.scss';
import userProfile from "./userProfile.png";

import {
    faImage, faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DweetFactory = ({ userObj }) => {
    // dweet은 form을 위한 state
    const [dweet, setDweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const dweetItem = {
            text: dweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
            nickName: userObj.displayName,
            photoUrl: userObj.photoUrl,
        };
        if(dweetItem.text === "") return;
        if(userObj.photoUrl === null) userObj.photoUrl = userProfile;
        await dbService.collection('dweets').add(dweetItem);
        setDweet("");
        setAttachment("");

        // 1) Storage().ref().child() return Reference - storage의 이미지 폴더 생성.
        // 2) Reference.putString() - 이 작업이 폴더에 이미지를 넣는 작업.
        // 3) Reference.putString() return (완료시 UploadTaskSnapshot을 받음)
        // 4) UploadTaskSnapshot.ref.getDownloadURL() - 이 작업에서 ref 속성을 쓰면 그 이미지의 Reference에 접근 가능, 이미지가 저장된 stroage 주소를 받을 수 있다.
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setDweet(value);
    };

    // 파일
    const onFileChange = (event) => {
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
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);
    return (
        <form onSubmit={onSubmit} className="dweetBox">
            <input value={dweet} onChange={onChange} type='text' placeholder="무슨 생각 중이신가요?" maxLength={120} />
            <div>
                <label htmlFor="fileClick"><FontAwesomeIcon icon={faImage} size="2x"/></label>
                <input type="file" accept="image/*" id="fileClick" onChange={onFileChange} style={{display:"none"}}/>
                <input type='submit' value="Dweet" />
            </div>
            {attachment && (
                <div className="dweetImgBox">
                    <img src={attachment} width="150px" height="150px" alt="img" />
                    <button onClick={onClearAttachment}><FontAwesomeIcon icon={faTimesCircle} size="2x"/> </button>
                </div>
            )}
        </form>
    );
};

export default DweetFactory;