import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { dbService, storageService } from "fbase";

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
        };
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
        <form onSubmit={onSubmit}>
            <input value={dweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
            <input type="file" accept="image/*" onChange={onFileChange} />
            <input type='submit' value="Dweet" />
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt="img" />
                    <button onClick={onClearAttachment}>삭제</button>
                </div>
            )}
        </form>
    );
};

export default DweetFactory;