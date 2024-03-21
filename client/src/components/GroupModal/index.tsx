import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { GrSearch } from "react-icons/gr";
import axios from "@/utils";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

interface ModalProps {
  setShowGroupModal: React.Dispatch<boolean>;
}

const GroupModal = ({ setShowGroupModal }: ModalProps) => {
  const [groups, setGroups] = useState<any>([]);
  const [allGroups, setAllGroups] = useState<any>([]);
  const [createGroup, setCreateGroup] = useState<boolean>(false);
  const [groupName, setGroupName] = useState<string>("");
  const userData = localStorage?.getItem("user");
  const [searchGroupName, setSearchGroupName] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<any>({});
  const user = userData ? JSON.parse(userData) : null;

  const addGroup = async () => {
    try {
      const { data } = await axios.post("/group/create", { groupName, user });
      if (data?.message) {
        console.log(data?.message);
        toast.error(data?.message);
      } else {
        console.log(data?.group);
        setGroupName("");
        setCreateGroup(false);
        setShowGroupModal(false);
        toast("created group");
      }
    } catch (error) {
      toast.error("Error while creating group");
    }
  };
  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await axios.get("/group/all");
      console.log("groups ", data?.groups);
      setGroups(data?.groups);
      setAllGroups(data?.groups);
    };
    fetchGroups();
  }, []);
  const joinGroup = async () => {
    const { data } = await axios.post("/group/join", {
      user,
      groupId: selectedGroup?._id,
    });
    console.log(data);
    setShowGroupModal(false);
  };
  console.log(selectedGroup);
  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        zIndex: 100,
      }}
      className="w-full h-screen fixed inset-0 flex justify-center items-center"
    >
      <div
        className={`${"w-[95%] sm:w-[800px]"}  relative bg-white rounded-lg md:rounded-3xl px-4 md:px-8 py-3 md:py-5 overflow-y-auto`}
      >
        <div className="w-full  bg-white rounded-lg relative">
          <button onClick={() => setShowGroupModal(false)}>
            <MdClose className="absolute text-2xl top-4 right-0 md:right-4 text-gray-400 cursor-pointer" />
          </button>

          <div className="pb-2 pt-4 md:px-3">
            <h1 className="text-lg md:text-xl  font-semibold text-gray-700">
              Search Groups
            </h1>
          </div>
          <div
            className=" md:px-3 h-[360px] overflow-y-auto "
            id="mini-pdf-custom-scroll"
          >
            <p className="text-gray-500 mb-6  text-xs md:text-sm">
              Join or Create Group.
            </p>
            <div
              className={`flex w-full border-b-2  
                "`}
            >
              <GrSearch className="text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search a Group by Name"
                className="outline-none w-[95%] text-sm  px-2 bg-white pb-2"
                onChange={(e) => {
                  setSearchGroupName(e.target.value);
                  if (e.target.value.length > 0) {
                    const searchedGroups = allGroups.filter((ele: any) => {
                      const groupMatches = new RegExp(
                        searchGroupName,
                        "i"
                      ).test(ele.name);
                      return groupMatches;
                    });
                    setGroups(searchedGroups);
                  } else {
                    setGroups(allGroups);
                  }
                }}
                value={searchGroupName}
              />
            </div>

            <div className=" flex gap-4 py-2 px-1 md:px-3 cursor-pointer  ">
              {!createGroup ? (
                <>
                  {groups.length == 0 && (
                    <div className="text-gray-400 flex w-full h-[320px] text-xl justify-center items-center">
                      Create Group
                    </div>
                  )}
                  {groups.map((ele: any, index: number) => (
                    <div
                      key={index}
                      className={`w-full p-4 rounded-xl hover:bg-[#df8c8c] ${
                        selectedGroup?.name === ele?.name && "bg-[#df8c8c]"
                      }`}
                      onClick={() => setSelectedGroup(ele)}
                    >
                      <span className="text-base font-medium">{ele?.name}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex w-full justify-between">
                  <input
                    type="text"
                    value={groupName}
                    placeholder="Enter Unique Group Name"
                    className="text-black px-3 bg-white w-[70%] border border-gray-400 rounded-xl"
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <Button onClick={addGroup} className="bg-[#ef4444]">
                    Create
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="py-3 md:p-3 flex justify-end gap-4 mt-4">
            <Button
              onClick={() => setCreateGroup(true)}
              className="w-[100px] h-10 bg-[#ef4444]"
            >
              <span className="font-medium">Create Group</span>
            </Button>
            <Button
              className="w-[100px] h-10 flex justify-center bg-[#ef4444]"
              disabled={
                groups.length === 0 ||
                Object.keys(selectedGroup).length === 0 ||
                selectedGroup?.participants?.includes(user?.id)
              }
              onClick={joinGroup}
            >
              <span className="font-medium">
                {selectedGroup?.participants?.includes(user?.id)
                  ? "Joined"
                  : "Join"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupModal;
