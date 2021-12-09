import Dweet from "components/Dweet";
import DweetFactory from "components/DweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    //
    const [dweets, setDweets] = useState([]);

    useEffect(() => {
        // onSnapshot은 데이터베이스에 무슨 일이 있을 때, 알림을 받음
        // 새로운 스냅샷을 받을 때 새로운 배열을 만듬
        // .orderBy("createdAt","desc") << 내림차순으로
        dbService.collection("dweets").orderBy("createdAt","desc").onSnapshot((snapShot) => {
            const dweetArr = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            // 그 다음 state에 배열을 넣음
            setDweets(dweetArr);
        });
    }, []);
    return (
        <div>
            <DweetFactory userObj={userObj} />
            <div>
                {/* Dweet 컴포넌트 생성 */}
                {/* dweetObj : dweet의 모든 데이터 */}
                {/* isOwner  : true || false, dweet을 만든 사람과 userObj.uid가 같으면 true를 반환( userObj는 Home의 props에서 옴 그 이후로 ... Home(props) < router(props) < App.js ) */}
                {dweets.map((dweet) => (
                    <Dweet
                        userObj={userObj}
                        key={dweet.id}
                        dweetObj={dweet}
                        isOwner={dweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
export default Home;