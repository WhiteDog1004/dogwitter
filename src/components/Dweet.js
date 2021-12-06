import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

import {
    faEdit, faTimesCircle, faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import '../css/dweet.scss';

const Dweet = ({ dweetObj, isOwner }) => {
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
            text: newDweet
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDweet(value);
    };
    return (
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
                                        <label for="editClick"><FontAwesomeIcon icon={faEdit} size="2x" /></label>
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
                            <h4>{dweetObj.text}</h4>
                            {isOwner && (
                                <>
                                    <button onClick={toggleEditing}><FontAwesomeIcon icon={faEdit} size="2x" /></button>
                                    <button onClick={onDeleteClick}><FontAwesomeIcon icon={faTrashAlt} size="2x" /></button>
                                </>
                            )}
                            {dweetObj.attachmentUrl && (
                                <img src={dweetObj.attachmentUrl} width="100px" height="100px" alt="img" />
                            )}
                        </div>
                    </>
                )
            }
        </div>
    )
};

export default Dweet;