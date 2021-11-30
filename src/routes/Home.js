import Dweet from "components/Dweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    // dweet은 form을 위한 state
    const [dweet, setDweet] = useState("");

    //
    const [dweets, setDweets] = useState([]);
    const [attachment, setAttachment] = useState();

    useEffect(() => {
        // onSnapshot은 데이터베이스에 무슨 일이 있을 때, 알림을 받음
        // 새로운 스냅샷을 받을 때 새로운 배열을 만듬
        dbService.collection("dweets").onSnapshot((snapShot) => {
            const dweetArr = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            // 그 다음 state에 배열을 넣음
            setDweets(dweetArr);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection('dweets').add({
            text: dweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        setDweet("");
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
        <div>
            <form onSubmit={onSubmit}>
                <input value={dweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type='submit' value="Dweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>삭제</button>
                    </div>
                )}
            </form>
            <div>
                {/* Dweet 컴포넌트 생성 */}
                {/* dweetObj : dweet의 모든 데이터 */}
                {/* isOwner  : true || false, dweet을 만든 사람과 userObj.uid가 같으면 true를 반환( userObj는 Home의 props에서 옴 그 이후로 ... Home(props) < router(props) < App.js ) */}
                {dweets.map((dweet) => (
                    <Dweet
                        key={dweet.id}
                        dweetObj={dweet}
                        isOwner={dweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
export default Home;