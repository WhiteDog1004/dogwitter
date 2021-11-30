import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(()=> {
    // 로그인하거나 로그아웃 또는 어플리케이션이 초기화 될 때 발생
    // 어플리케이션이 시작하고 준비가 되면 setInit을 true로 반환
    authService.onAuthStateChanged((user)=> {

      // 어떠한 user도 받지 못하면 비로그인 상태
      // user를 받았다면 userObj를 업데이트
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, [])
  return (
    <>
     {init ? <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />: "Initializing.."}
      <footer>copy Dogwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
