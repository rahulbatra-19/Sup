import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
interface GroupCardProps {
  group: any;
  setContact: React.Dispatch<any>;
}

const GroupCard = ({ group, setContact }: GroupCardProps) => {
  // const [messages, setMessages] = useState<any>([]);
  // const getTime = (time: Date) => {
  //   return new Date(time)
  //     .toLocaleTimeString([], {
  //       hour: "numeric",
  //       minute: "2-digit",
  //       hour12: true,
  //     })
  //     .replace(/^0(?=:)/, "12");
  // };
  // const lastMessage = useMemo(() => {
  //   return messages[messages.length - 1];
  // }, [messages]);
  return (
    <div
      className="flex gap-3  py-4 px-8 border-b items-center hover:cursor-pointer hover:bg-gray-200"
      onClick={() => {
        setContact(group);
      }}
    >
      <Avatar className="lg:w-14 w-10  h-10 lg:h-14">
        <AvatarImage src={group?.groupImage} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex justify-between flex-1">
        <div className="flex flex-col">
          <span className="font-bold text-md lg:text-lg ">{group?.name}</span>
          {/* <span className="text-gray-400">{lastMessage?.message}</span> */}
        </div>
        <div className="flex flex-col">
          {/* {lastMessage && (
            <span className="text-gray-400 text-sm mb-2">
              {getTime(lastMessage?.createdAt)}
            </span>
          )} */}
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

export default GroupCard;
