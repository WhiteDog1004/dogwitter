import { dbService } from "fbase";
import Dweet from "components/Dweet";
import '../css/myPost.scss';
import React, { useEffect, useState } from "react";


const MyPost = ({ userObj }) => {
    const [dweets, setDweets] = useState([]);

    useEffect(() => {
        dbService.collection("dweets").orderBy("createdAt", "desc").onSnapshot((snapShot) => {
            const dweetArr = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            // creatorId와 같으면 그것만 추출
            const dweetArr2 = dweetArr.filter(uid => uid.creatorId === userObj.uid);

            // 그 다음 state에 배열을 넣음
            setDweets(dweetArr2);
        });
    }, [userObj.uid]);
    return (
        <>
            <div>
                <div className="topTextBox">
                    <h2>{userObj.displayName}</h2>
                    <p>님이 작성한 글</p>
                </div>
                <div>
                    {dweets.map((dweet) => (
                        <Dweet
                            userObj={userObj}
                            key={dweet.id}
                            dweetObj={dweet}
                            isOwner={dweet.creatorId === userObj.uid} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default MyPost;