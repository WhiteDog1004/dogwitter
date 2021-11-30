import { dbService } from "fbase";
import React, { useState } from "react";

const Dweet = ({ dweetObj, isOwner }) => {
    // editing : dweet을 수정하고 있는지 아닌지를 확인함
    const [editing, setEditing] = useState(false);

    // newDweet : input의 값을 수정할 수 있음
    const [newDweet, setNewDweet] = useState(dweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("정말 dweet을 삭제 하시겠습니까?");
        if (ok) {
            // dweet 삭제
            await dbService.doc(`dweets/${dweetObj.id}`).delete();
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
        <div>
            {
                editing ? (
                    <>
                        {isOwner && (
                            <>
                                <form onSubmit={onSubmit}>
                                    <input
                                        type="text"
                                        placeholder="edit your dweet"
                                        value={newDweet}
                                        required
                                        onChange={onChange} />
                                    <input type="submit" value="수정" />
                                </form>
                                <button onClick={toggleEditing}>취소</button>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <h4>{dweetObj.text}</h4>
                        {isOwner && (
                            <>
                                <button onClick={onDeleteClick}>Delete</button>
                                <button onClick={toggleEditing}>Edit</button>
                            </>
                        )}
                    </>
                )
            }
        </div>
    )
};

export default Dweet;