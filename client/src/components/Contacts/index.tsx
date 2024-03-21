import React, { useEffect, useState } from "react";
import ContactCard from "../ContactCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContactSearch from "../ContactSearch";
import axios from "@/utils";
import GroupCard from "../GroupCard";
export interface User {
  _id: string;
  name: string;
  username: string;
  description: string;
  avatar: string;
}
interface ContactProps {
  setContact: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const Contacts = ({ setContact }: ContactProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [chatting, setChatting] = useState<User[]>([]);
  const [groups, setGroups] = useState<any>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const userData = localStorage?.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const getAllContacts = async () => {
    try {
      const { data } = await axios.get("/User/all?username=" + user?.username);
      // console.log(data);
      console.log("data", data);
      setUsers(data?.all);
      if (innerWidth > 1024) {
        setContact(data?.chatting[0]);
      }
      setAllUsers([
        ...(data?.all || []), // Use empty array if data.all is undefined
        ...(data?.chatting || []), // Use empty array if data.chatting is undefined
      ]);
      setChatting(data?.chatting);
    } catch (error) {
      toast.error("Error while fetching");
    }
  };
  const getGroups = async () => {
    try {
      const { data } = await axios.get("/group/getbyuser?userId=" + user?.id);
      console.log(data);
      setGroups(data?.groups);
    } catch (error) {
      toast.error("Error while fetching");
    }
  };
  // console.log(users);
  useEffect(() => {
    getAllContacts();
    getGroups();
  }, []);
  return (
    <>
      <ContactSearch
        helpers={{
          users: allUsers,
          setUsers: setSearchUsers,
        }}
      />
      <div className="bg-white rounded-3xl flex-1 pt-6 no-scrollbar overflow-y-auto drop-shadow-xl ">
        {searchUsers.length > 0 ? (
          <>
            <p className="text-gray-400 pl-7 text-sm lg:text-base mt-3">ALL</p>
            {searchUsers?.map((user: User, index: number) => (
              <div key={index}>
                <ContactCard user={user} setContact={setContact} />
              </div>
            ))}
          </>
        ) : (
          <>
            {groups.length > 0 && (
              <>
                <p className="text-gray-400 pl-7 mt-3 text-sm lg:text-base">
                  GROUPS
                </p>
                {groups?.map((group: any, index: number) => (
                  <div key={index}>
                    <GroupCard group={group} setContact={setContact} />
                  </div>
                ))}
              </>
            )}
            {chatting.length > 0 && (
              <>
                <p className="text-gray-400 pl-7 mt-3 text-sm lg:text-base">
                  ALL
                </p>
                {chatting?.map((user: User, index: number) => (
                  <div key={index}>
                    <ContactCard user={user} setContact={setContact} />
                  </div>
                ))}
              </>
            )}
            {users.length > 0 && (
              <>
                <p className="text-gray-400 pl-7 mt-3 text-sm lg:text-base">
                  Start Chatting
                </p>
                {users?.map((user: User, index: number) => (
                  <div key={index}>
                    <ContactCard user={user} setContact={setContact} />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Contacts;
