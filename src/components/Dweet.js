import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import firebase from "firebase"
import { dbService, storageService } from "fbase";
import React, { useCallback, useEffect, useState } from "react";

import {
    faCommentDots,
    faEdit, faHeart, faTimesCircle, faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import '../css/dweet.scss';
import userProfile from "./userProfile.png";

const Dweet = ({ dweetObj, isOwner, userObj }) => {

    const [imgPopup, setImgPopup] = useState("");
    const [isPopupActive, setIsPopupActive] = useState(false);

    // editing : dweet을 수정하고 있는지 아닌지를 확인함
    const [editing, setEditing] = useState(false);

    // newDweet : input의 값을 수정할 수 있음
    const [newDweet, setNewDweet] = useState(dweetObj.text);
    const [newPhoto] = useState(userObj.photoUrl);
    const [newDisplayName] = useState(userObj.displayName);

    // 프로필 사진 & 닉네임 업데이트
    const profileUpdate = useCallback(async () => {
        if (isOwner) {
            await dbService.doc(`dweets/${dweetObj.id}`).update({
                nickName: newDisplayName,
                photoUrl: newPhoto,
            });
        }
    }, [isOwner, dweetObj.id, newDisplayName, newPhoto]);

    // 댓글
    const [commentCnt] = useState("0");
    const [commentOn, setCommentOn] = useState(false);
    const [newComment, setNewComment] = useState(dweetObj.text);

    useEffect(() => {
        profileUpdate();
    }, [profileUpdate]);
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

    // 글 좋아요
    const onLikeCheck = async () => {
        const likeCheckTrue = dweetObj.likeCheck.filter(uid => uid === userObj.uid);

        if (!likeCheckTrue[0]) {
            dweetObj.like++;
            await dbService.doc(`dweets/${dweetObj.id}`).update({
                like: dweetObj.like,
                likeCheck: firebase.firestore.FieldValue.arrayUnion(userObj.uid),
            });
        } else {
            dweetObj.like--;
            await dbService.doc(`dweets/${dweetObj.id}`).update({
                like: dweetObj.like,
                likeCheck: firebase.firestore.FieldValue.arrayRemove(userObj.uid),
            });
        }
    }

    // 댓글 체크확인
    const onClickComment = () => {
        if (!commentOn) {
            setCommentOn(true);
        } else {
            setCommentOn(false);
        }
    }
    // 댓글 작성
    const onCommentChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewComment(value);
    };

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
                                {dweetObj.photoUrl ? (
                                    <>
                                        <div className="photoUrlBox">
                                            <img src={dweetObj.photoUrl} className="photoUrl" width={96} height={96} alt="img" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="photoUrlBox">
                                            <img src={userProfile} className="photoUrl" width={96} height={96} alt="img" />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <div className="postHead">
                                        <h3>{dweetObj.nickName}</h3>
                                        <div className="likeCheckBox">
                                            <FontAwesomeIcon icon={faHeart} size="1x" onClick={onLikeCheck} /> {dweetObj.like}
                                        </div>
                                    </div>
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
                                <div className="timeCheckBox">
                                    {timeCheck()}
                                    <div className="commentBox" onClick={onClickComment}>
                                        <FontAwesomeIcon icon={faCommentDots} />
                                        <span> {commentCnt}</span>
                                    </div>
                                </div>
                                {commentOn && (
                                    <div className="commentOnClick">
                                        <div className="comments">
                                            <div>
                                                <img src={userObj.photoUrl}></img>
                                                <p>테스트</p>
                                            </div>
                                        </div>
                                        <div className="commentAvatarAndComment">
                                            <img src={userObj.photoUrl}></img>
                                            <div className="myComment">
                                                <form>
                                                    <textarea
                                                        type="text"
                                                        placeholder="댓글 작성하기"
                                                        value={newComment}
                                                        required
                                                        onChange={onCommentChange} />
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )
                }

            </div>
            {/* 클릭 이미지 팝업 */}
            <div className={isPopupActive ? `popupActive` : `notPopupActive`} onClick={cancelClick}>
                <img src={imgPopup} alt="img"></img>
            </div>
        </>
    )
};

export default Dweet;