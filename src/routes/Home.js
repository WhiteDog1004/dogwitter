import Dweet from "components/Dweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [dweet, setDweet] = useState("");
    const [dweets, setDweets] = useState([]);
    
    useEffect(() => {
        dbService.collection("dweets").onSnapshot((snapShot) => {
            const dweetArr = snapShot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
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

    // console.log(dweets);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={dweet} onChange={onChange} type='text' placeholder="What's on your mind?" maxLength={120} />
                <input type='submit' value="Dweet" />
            </form>
            <div>
                {dweets.map((dweet) => (
                    <Dweet key={dweet.id} dweetObj={dweet} isOwner={dweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    );
};
export default Home;