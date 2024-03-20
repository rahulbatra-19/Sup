import { Route, Routes, useNavigate } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import ChatsPage from "./Pages/ChatsPage";
import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";
import { BASE_URL } from "./config";
function App() {
  const navigate = useNavigate();
  const userData = localStorage?.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const socket = useMemo(() => {
    return io(BASE_URL);
  }, []);
  useEffect(() => {
    if (user === null) {
      console.log("login ");
      navigate("/login");
    } else {
      navigate("/");
    }
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });
    socket.on("welcome", (s) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/" element={<ChatsPage />} />
      </Routes>
    </>
  );
}

export default App;
