import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { User } from "../Contacts";

const ChattingHead = ({ contact }: { contact?: User }) => {
  return (
    <div className="bg-white rounded-3xl h-[15%] flex justify-between items-center px-7">
      <div className="flex gap-4">
        <Avatar className="w-14 h-14">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex justify-between flex-1">
          <div className="flex flex-col">
            <span className="font-bold text-lg ">{contact?.name}</span>
            <span className="text-gray-400">Online</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button className="rounded-3xl p-5 text-lg">Profile</Button>
        <button className="flex h-8 items-center border-gray-500 border-l pl-4">
          <HiDotsHorizontal className="text-xl text-gray-500 " />
        </button>
      </div>
    </div>
  );
};

export default ChattingHead;
