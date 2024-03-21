import { SocketContext } from "@/App";
import Chatting from "@/components/Chatting";
import Contacts, { User } from "@/components/Contacts";
import Sidebar from "@/components/Sidebar";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatsPage = () => {
  const [contact, setContact] = useState<User>();
  const navigate = useNavigate();
  const userData = localStorage?.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const socket = useContext<any>(SocketContext);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empt
  console.log("contact", contact);
  useEffect(() => {
    if (user === null) {
      console.log("login ");
      navigate("/login");
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    });

    socket.on("welcome", (s: any) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);
  console.log("width ", windowWidth);
  return (
    <>
      {windowWidth > 1024 ? (
        <div className="h-[100vh] w-full bg-slate-200 flex  gap-4 p-6 2xl:p-10">
          <Sidebar user={user} />
          <div className="w-[35%] flex flex-col gap-2">
            <Contacts setContact={setContact} />
          </div>
          <div className="w-[55%] flex flex-col gap-2 ">
            <Chatting contact={contact} setContact={setContact} />
          </div>
        </div>
      ) : (
        <div className="h-[100vh] w-full flex-col bg-slate-200 flex gap-4 p-6 2xl:p-10">
          {!contact?.username ? (
            <>
              <div className="lg:w-[35%] flex h-[90%] flex-col gap-2">
                <Contacts setContact={setContact} />
              </div>
              <div className="fixed bottom-10 w-[90%]">
                <Sidebar user={user} />
              </div>
            </>
          ) : (
            <>
              <div className="lg:w-[35%] flex h-[90%] flex-col justify-center  gap-3">
                <Chatting contact={contact} setContact={setContact} />
              </div>
              <div className="fixed bottom-10 w-[90%]">
                <Sidebar user={user} />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
export default ChatsPage;
