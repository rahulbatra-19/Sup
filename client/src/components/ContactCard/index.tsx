import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useMemo, useState } from "react";
import { User } from "../Contacts";
import { toast } from "react-toastify";
import axios from "@/utils";
interface ContactCardProps {
  user: User;
  setContact: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const ContactCard = ({ user, setContact }: ContactCardProps) => {
  const [messages, setMessages] = useState<any>([]);
  const userData = localStorage?.getItem("user");
  const currentUser = userData ? JSON.parse(userData) : null;
  useEffect(() => {
    const fetchConvo = async () => {
      try {
        const { data } = await axios.get(
          `/conversation/get?userId=${currentUser?.id}&contactId=${user?._id}`
        );
        if (!data?.message) {
          setMessages(data?.conversation?.messages);
        }
      } catch (error) {
        toast.error("error while fetching conversation");
      }
    };
    if (user) {
      fetchConvo();
    }
  }, [user]);
  const getTime = (time: Date) => {
    return new Date(time)
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/^0(?=:)/, "12");
  };
  const lastMessage = useMemo(() => {
    return messages[messages.length - 1];
  }, [messages]);
  return (
    <div
      className="flex gap-3  py-4 px-8 border-b items-center hover:cursor-pointer hover:bg-gray-200"
      onClick={() => {
        setContact(user);
      }}
    >
      <Avatar className="w-14 h-14">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex justify-between flex-1">
        <div className="flex flex-col">
          <span className="font-bold text-lg ">{user?.username}</span>
          <span className="text-gray-400">
            {lastMessage?.message || user?.description}
          </span>
        </div>
        <div className="flex flex-col">
          {lastMessage && (
            <span className="text-gray-400 text-sm mb-2">
              {getTime(lastMessage?.createdAt)}
            </span>
          )}
          <div className="flex justify-end">
            {/* <span className="rounded-full text-sm text-white w-5 h-5 flex justify-center items-center bg-[#ef4444]">
              1
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
