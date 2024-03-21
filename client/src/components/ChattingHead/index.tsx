/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import { MdLogout } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const ChattingHead = ({
  contact,
  isOnline = false,
  isGroup = false,
  setContact,
}: {
  contact?: any;
  isOnline: boolean;
  isGroup: boolean;
  setContact: React.Dispatch<any>;
}) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropdownActionsFormsRef = useRef(null);
  const navigate = useNavigate();
  const userData = localStorage?.getItem("user");
  const userDetails = userData ? JSON.parse(userData) : null;
  const handleOutsideClickShareOptions = (e: any) => {
    if (dropdownActionsFormsRef.current !== null) {
      // @ts-ignore
      if (dropdownActionsFormsRef?.current?.contains(e.target)) return;
    }
    setShowDropDown(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClickShareOptions);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClickShareOptions);
    };
  }, []);
  return (
    <div className="bg-white rounded-3xl h-[10%] lg:h-[15%] flex justify-between items-center px-7">
      <div className="flex gap-4">
        <Avatar className="lg:w-14 lg:h-14 h-10 w-10">
          <AvatarImage src={contact?.avatar || contact?.groupImage} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex justify-between flex-1">
          <div className="flex flex-col">
            <span className="font-bold text-base lg:text-lg ">
              {contact?.name}
            </span>
            {!isGroup && (
              <span
                className={
                  isOnline
                    ? "text-green-500 text-sm lg:text-lg"
                    : "text-gray-400 text-sm lg:text-lg"
                }
              >
                {isOnline ? "Online" : "Offline"}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 relative">
        <Button
          className="rounded-3xl p-3 lg:p-5 text-xs lg:text-lg"
          onClick={() => {
            if (isGroup) {
              navigate(`/profile?groupId=${contact?._id}`);
            } else {
              navigate(`/profile?username=${contact?.username}`);
            }
          }}
        >
          Profile
        </Button>
        <button
          className="hidden lg:flex h-8 items-center border-gray-500 border-l pl-4"
          onClick={() => setShowDropDown((prev) => !prev)}
        >
          <HiDotsHorizontal className="text-xl text-gray-500 " />
        </button>
        <button
          className="flex lg:hidden h-8 items-center border-gray-500 border-l pl-4"
          onClick={() => setContact(null)}
        >
          <IoMdArrowBack className="text-xl text-gray-500 " />
        </button>
        {showDropDown && (
          <div
            ref={dropdownActionsFormsRef}
            className={`translate-x-[calc(-100%_+_1.5rem)] md:translate-x-0 z-[10] absolute border border-gray-300 rounded-lg shadow-lg w-[200px] cursor-pointer top-10 right-2 bg-white $ `}
          >
            <div className="flex flex-col items-start justify-start ">
              <button
                className={`flex flex-row items-center text-center text-xs capitalize p-3 text-gray-800 w-full font-medium hover:bg-[#e2a0a0] disabled:opacity-50`}
                onClick={() =>
                  navigate(`/profile?username=${userDetails?.username}&isOwner`)
                }
              >
                <FaUserEdit className="mr-2 text-xl" />
                Edit Profile
              </button>
              <button
                className={`flex flex-row items-center text-center text-xs capitalize p-3 text-gray-800 w-full font-medium hover:bg-[#e2a0a0] disabled:opacity-50`}
                onClick={(e) => {
                  e.stopPropagation();
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                <MdLogout className="mr-2 text-xl" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChattingHead;
