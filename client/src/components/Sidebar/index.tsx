import { MdOutlineEmail } from "react-icons/md";
import { PiChatsFill } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Sidebar = () => {
  return (
    <div className="bg-[#010019] h-full hidden  w-[6%]  rounded-2xl sm:flex flex-col pt-40 2xl:pt-80 justify-between py-10 items-center">
      <div className="flex flex-col justify-around gap-20">
        <button>
          <MdOutlineEmail className="text-white text-2xl" />
        </button>
        <button>
          <PiChatsFill className="text-white text-2xl" />
        </button>
        <button>
          <RiDeleteBin6Line className="text-white text-2xl" />
        </button>
      </div>
      <button className=" p-3 flex justify-end">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>
    </div>
  );
};

export default Sidebar;
