import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChattingHead from "../ChattingHead";
import { User } from "../Contacts";
import MessageInput from "../MessageInput";
import { toast } from "react-toastify";
import axios from "@/utils";
interface ChattingProps {
  contact?: User;
}

const Chatting = ({ contact }: ChattingProps) => {
  const [messages, setMessages] = useState<any>([]);
  const userData = localStorage?.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  useEffect(() => {
    const fetchConvo = async () => {
      try {
        const { data } = await axios.get(
          `/conversation/get?userId=${user?.id}&contactId=${contact?._id}`
        );
        if (!data?.message) {
          setMessages(data?.conversation?.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        toast.error("error while fetching conversation");
      }
    };
    if (contact) {
      fetchConvo();
    }
  }, [contact]);
  console.log("messages", messages);

  return (
    <>
      <ChattingHead contact={contact} />
      <div className="bg-white rounded-3xl flex-1 p-4 overflow-y-auto no-scrollbar ">
        {messages?.map((message: any, index: number) => {
          if (message?.sender === user?.id) {
            return (
              <div className="chat chat-end mb-2 ml-40">
                <div className="chat-bubble text-white bg-[#ef4444]">
                  {message?.message}
                </div>
              </div>
            );
          } else if (message?.sender === contact?._id) {
            return (
              <div className="flex gap-1 w-[60%] chat chat-start mb-2">
                <div className="chat-image avatar">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
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
        {messages.length === 0 && (
          <div className="text-gray-500 flex h-full items-center justify-center">
            Start Messaging
          </div>
        )}

        {/* <div className="chat chat-end mb-2 ml-40">
          <div className="chat-bubble text-white bg-[#ef4444]">
            You underestimate my power! Hello how are you are you alright? Hello
            how are you are you alright? Hello how are you are you alright?
            Hello how are you are you alright? Hello how are you are you
            alright?
          </div>
        </div>
        <div className="flex gap-1 w-[60%] chat chat-start mb-2 ml-10">
          <div className="chat-bubble bg-slate-200 text-gray-800">
            Hello how are you are you alright? Hello how are you are you
            alright? Hello how are you are you alright? Hello how are you are
            you alright? Hello how are you are you alright?
          </div>
        </div>
        <div className="flex gap-1 w-[60%] chat chat-start mb-2">
          <div className="chat-image avatar">
            <Avatar className="w-10 h-10">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="chat-bubble bg-slate-200 text-gray-800">
            Hello how are you are you alright? Hello how are you are you
            alright? Hello how are you are you alright? Hello how are you are
            you alright? Hello how are you are you alright?
          </div>
        </div> */}
      </div>
      <MessageInput contact={contact} />
    </>
  );
};

export default Chatting;
