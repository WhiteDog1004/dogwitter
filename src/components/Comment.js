import React, { useState } from "react";
import { dbService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faEdit, faTrashAlt, faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const Comment = ({ postObj, dweetObj, isCommentOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newCommentDweet, setNewCommentDweet] = useState(dweetObj.text);

    const timeCommentCheck = () => {
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

    const onCommentSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`dweets/${postObj}/comment/${dweetObj.id}`).update({
            text: newCommentDweet,
        });
        setEditing(false);
    };

    // 삭제
    const onDeleteComment = async () => {
        const ok = window.confirm("정말 댓글을 삭제 하시겠습니까?");
        if (ok) {
            // dweet 삭제
            await dbService.doc(`dweets/${postObj}/comment/${dweetObj.id}`).delete();
        }
    };

    // 수정
    const commentEditing = () => setEditing((prev) => !prev);

    const onCommentChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewCommentDweet(value);
    };


    return (
        <div>
            {
                editing ? (
                    <>
                        {isCommentOwner && (
                            <>
                                <form onSubmit={onCommentSubmit}>
                                    <textarea
                                        type="text"
                                        placeholder="드윗 수정하기"
                                        value={newCommentDweet}
                                        required
                                        onChange={onCommentChange} />
                                    <div className="dweetEditBox">
                                        <label htmlFor="editClick"><FontAwesomeIcon icon={faEdit} size="2x" /></label>
                                        <input type="submit" id="editClick" value="수정" />
                                        <button onClick={commentEditing}><FontAwesomeIcon icon={faTimesCircle} size="2x" /></button>
                                    </div>
                                </form>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <img src={dweetObj.photoUrl} alt="img"/>
                        <div className="commentTextBox">
                            <h4>{dweetObj.nickName}</h4>
                            <span>{dweetObj.text}</span>
                        </div>
                        {timeCommentCheck()}
                        {isCommentOwner && (
                            <>
                                <div className="commentBtn">
                                    <button onClick={commentEditing}><FontAwesomeIcon icon={faEdit} size="2x" /></button>
                                    <button onClick={onDeleteComment}><FontAwesomeIcon icon={faTrashAlt} size="2x" /></button>
                                </div>
                            </>
                        )}
                    </>
                )
            }
        </div>
    );
};
export default Comment;