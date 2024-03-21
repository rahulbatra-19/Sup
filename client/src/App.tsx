import { Route, Routes } from "react-router-dom";
import AuthPage from "./Pages/AuthPage";
import ChatsPage from "./Pages/ChatsPage";
import { useMemo, createContext } from "react";
import { BASE_URL } from "./config";
import { io } from "socket.io-client";
import RegisterPage from "./Pages/RegisterPage";
import ProfilePage from "./Pages/ProfilePage";
export const SocketContext = createContext<any>(null);
function App() {
  const socket = useMemo(() => {
    return io(BASE_URL);
  }, []);
  return (
    <SocketContext.Provider value={socket}>
      <Routes>
        <Route path="/login" element={<AuthPage />} />
        <Route path="/Register" element={<RegisterPage />} />
        <Route path="/Profile" element={<ProfilePage />} />
        <Route path="/" element={<ChatsPage />} />
      </Routes>
    </SocketContext.Provider>
  );
}

export default App;
