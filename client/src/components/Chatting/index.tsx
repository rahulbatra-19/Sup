import { useContext, useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChattingHead from "../ChattingHead";
import MessageInput from "../MessageInput";
import { toast } from "react-toastify";
import axios from "@/utils";
import { SocketContext } from "../../App.tsx";
interface ChattingProps {
  contact?: any;
  setContact: React.Dispatch<any>;
}

const Chatting = ({ contact, setContact }: ChattingProps) => {
  const [messages, setMessages] = useState<any>([]);
  const userData = localStorage?.getItem("user");
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const user = userData ? JSON.parse(userData) : null;
  const chatDivRef = useRef<HTMLDivElement>(null);
  const socket = useContext<any>(SocketContext);
  const [isGroup, setIsGroup] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any>([]);
  const fetchGroupConvo = async () => {
    try {
      const { data } = await axios.get(
        `/conversation/getById?conversationId=${contact?.conversation?._id}`
      );
      if (data?.message) {
        console.log(data?.message);
      } else {
        socket.emit("join-room", { room: data?.conversation?._id, user });
        console.log("conversation", data?.conversation);
        setMessages(data?.conversation?.messages);
        setParticipants(data?.conversation?.participants);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchConvo = async () => {
      try {
        const { data } = await axios.get(
          `/conversation/get?userId=${user?.id}&contactId=${contact?._id}`
        );
        if (!data?.message) {
          socket.emit("join-room", { room: data?.conversation._id, user });
          setMessages(data?.conversation?.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        toast.error("error while fetching conversation");
      }
    };
    if (contact) {
      setMessages([]);
      if (contact?.conversation?.isGroup) {
        setIsGroup(true);
        fetchGroupConvo();
      } else {
        setIsGroup(false);
        fetchConvo();
      }
    }
    socket.emit("check-online", contact?.username);
    socket.on(
      "user-online",
      ({ userId, isOnline }: { userId: any; isOnline: any }) => {
        if (userId === contact?.username) {
          setIsOnline(isOnline);
        } else {
          setIsOnline(isOnline);
        }
      }
    );
  }, [contact]);
  const disconnecting = async () => {
    await socket.emit("disconnecting", { username: user?.username });
    await new Promise<void>((res) =>
      setTimeout(() => {
        res();
      }, 1000)
    );
  };
  useEffect(() => {
    socket.emit("getOnline", user);
    socket.on("recieve-message", (messages: any) => {
      toast(`Message`);
      setMessages(messages);
    });
    return () => {
      disconnecting();
    };
  }, [socket]);
  useEffect(() => {
    // Scroll to the bottom of the chat div when messages change
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages]);
  // console.log("messages", messages);

  return (
    <>
      <ChattingHead
        contact={contact}
        isOnline={isOnline}
        isGroup={contact?.conversation?.isGroup ?? false}
        setContact={setContact}
      />
      <div
        className="bg-white rounded-3xl h-[80%] flex-1 p-4 overflow-y-auto no-scrollbar "
        ref={chatDivRef}
      >
        {isGroup ? (
          <>
            {messages?.map((message: any, index: number) => {
              if (message?.sender === user?.id) {
                console.log("isGroup");
                return (
                  <div className="chat chat-end mb-2 ml-40" key={index}>
                    <div className="chat-bubble text-white bg-[#ef4444]">
                      {message?.message}
                    </div>
                  </div>
                );
              } else {
                const user = participants.find(
                  (ele: any) => ele?._id === message?.sender
                );
                return (
                  <div
                    className="flex gap-1 w-[60%] chat chat-start mb-2"
                    key={index}
                  >
                    <div className="chat-image avatar">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="chat-bubble bg-slate-200 text-gray-800">
                      {message?.message}
                    </div>
                  </div>
                );
              }
            })}
          </>
        ) : (
          <>
            {messages?.map((message: any, index: number) => {
              if (message?.sender === user?.id) {
                return (
                  <div className="chat chat-end mb-2 ml-40" key={index}>
                    <div className="chat-bubble text-white bg-[#ef4444]">
                      {message?.message}
                    </div>
                  </div>
                );
              } else if (message?.sender === contact?._id) {
                return (
                  <div
                    className="flex gap-1 w-[60%] chat chat-start mb-2"
                    key={index}
                  >
                    <div className="chat-image avatar">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contact?.avatar} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="chat-bubble bg-slate-200 text-gray-800">
                      {message?.message}
                    </div>
                  </div>
                );
              }
            })}
          </>
        )}

        {messages.length === 0 && (
          <div className="text-gray-500 flex h-full items-center justify-center">
            Start Messaging
          </div>
        )}
      </div>
      <MessageInput
        contact={contact}
        socket={socket}
        setMessages={setMessages}
        isGroup={contact?.conversation?.isGroup ?? false}
      />
    </>
  );
};

export default Chatting;
