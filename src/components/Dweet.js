import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

import {
    faEdit, faTimesCircle, faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import '../css/dweet.scss';

const Dweet = ({ dweetObj, isOwner }) => {

    const [imgPopup, setImgPopup] = useState("");
    const [isPopupActive, setIsPopupActive] = useState(false);

    // editing : dweet을 수정하고 있는지 아닌지를 확인함
    const [editing, setEditing] = useState(false);

    // newDweet : input의 값을 수정할 수 있음
    const [newDweet, setNewDweet] = useState(dweetObj.text);

    // 삭제
    const onDeleteClick = async () => {
        const ok = window.confirm("정말 dweet을 삭제 하시겠습니까?");
        if (ok) {
            // dweet 삭제
            await dbService.doc(`dweets/${dweetObj.id}`).delete();
            if (dweetObj.attachmentUrl) {
                await storageService.refFromURL(dweetObj.attachmentUrl).delete();
            }
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`dweets/${dweetObj.id}`).update({
            text: newDweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDweet(value);
    };

    const timeCheck = () => {
        // 드윗 작성후 시간 얼마나 지났는지
        const testTime = Date.now();
        const timeNow = (testTime - dweetObj.createdAt) / 1000;
        const timeResult = Math.floor(timeNow);
        if (timeResult < 60) {
            let time = 0;
            return (<>
                <p>{time}분 전</p>
            </>)
        } else {
            let time = timeResult / 60;
            time = Math.floor(time);
            if (time > 59) {
                let hour = time / 60;
                hour = Math.floor(hour);
                if (hour > 23) {
                    let day = hour / 24;
                    day = Math.floor(day);
                    return (<>
                        <p>{day}일 전</p>
                    </>)
                }
                return (<>
                    <p>{hour}시간 전</p>
                </>)
            }

            return (<>
                <p>{time}분 전</p>
            </>)
        }
    }

    // 이미지 클릭시 크게
    const imgClick = () => {
        const img = dweetObj.attachmentUrl;

        setIsPopupActive(true);
        setImgPopup(img);
    }
    const cancelClick = () => {
        setIsPopupActive(false);
        setImgPopup("");
    }

    return (
        <>
            <div className="dweetBox">
                {
                    editing ? (
                        <>
                            {isOwner && (
                                <>
                                    <form onSubmit={onSubmit}>
                                        <textarea
                                            type="text"
                                            placeholder="드윗 수정하기"
                                            value={newDweet}
                                            required
                                            onChange={onChange} />
                                        <div className="dweetEditBox">
                                            <label htmlFor="editClick"><FontAwesomeIcon icon={faEdit} size="2x" /></label>
                                            <input type="submit" id="editClick" value="수정" />
                                            <button onClick={toggleEditing}><FontAwesomeIcon icon={faTimesCircle} size="2x" /></button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="dweetMsgBox">
                                {dweetObj.photoUrl && (
                                    <img src={dweetObj.photoUrl} className="photoUrl" />
                                )}
                                <div>
                                    <h3>{dweetObj.nickName}</h3>
                                    <h4>{dweetObj.text}</h4>
                                    {dweetObj.attachmentUrl && (
                                        <img onClick={imgClick} src={dweetObj.attachmentUrl} width="100px" height="100px" alt="img" />
                                    )}
                                </div>
                                {isOwner && (
                                    <>
                                        <div className="dweetBtn">
                                            <button onClick={toggleEditing}><FontAwesomeIcon icon={faEdit} size="2x" /></button>
                                            <button onClick={onDeleteClick}><FontAwesomeIcon icon={faTrashAlt} size="2x" /></button>
                                        </div>
                                    </>
                                )}
                                <div className="timeCheckBox">{timeCheck()}</div>
                            </div>
                        </>
                    )
                }

            </div>
            {/* 클릭 이미지 팝업 */}
            <div className={isPopupActive ? `popupActive` : `notPopupActive`} onClick={cancelClick}>
                <img src={imgPopup}></img>
            </div>
        </>
    )
};

export default Dweet;