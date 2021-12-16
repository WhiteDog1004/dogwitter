import { dbService } from "fbase";
import Dweet from "components/Dweet";
import DweetFactory from "components/DweetFactory";
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
                <DweetFactory userObj={userObj} />
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