import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "../Contacts";
import { TiGroupOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GroupModal from "../GroupModal";
import { MdHome, MdLogout } from "react-icons/md";

const Sidebar = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  return (
    <div className="bg-[#010019]   h-[50px] py-8 lg:h-full   lg:w-[6%]  rounded-2xl flex lg:flex-col lg:pt-40 2xl:pt-80 justify-center lg:justify-between lg:py-10 items-center">
      <div className="flex lg:flex-col justify-between gap-20 ">
        <button
          onClick={(e) => {
            e.stopPropagation();
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          <MdLogout className="text-white text-2xl" />
        </button>
        <button onClick={() => setShowGroupModal(true)}>
          <TiGroupOutline className="text-white  text-2xl" />
        </button>
        {innerHeight > 1024 ? (
          <></>
        ) : (
          <button onClick={() => navigate("/")}>
            <MdHome className="text-white lg:hidden text-2xl" />
          </button>
        )}

        <button
          className="lg:hidden"
          onClick={() =>
            navigate(`/profile?username=${user?.username}&isOwner`)
          }
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </button>
      </div>
      <button
        className="hidden  p-3 lg:flex justify-end"
        onClick={() => navigate(`/profile?username=${user?.username}&isOwner`)}
      >
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </button>
      {showGroupModal && <GroupModal setShowGroupModal={setShowGroupModal} />}
    </div>
  );
};

export default Sidebar;
