import React, { useEffect, useState } from "react";
import ContactCard from "../ContactCard";
import { toast } from "react-toastify";
import ContactSearch from "../ContactSearch";
import axios from "@/utils";
export interface User {
  _id: string;
  name: string;
  username: string;
  description: string;
}
interface ContactProps {
  setContact: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const Contacts = ({ setContact }: ContactProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [chatting, setChatting] = useState<User[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const userData = localStorage?.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const getAllContacts = async () => {
    try {
      const { data } = await axios.get("/User/all?username=" + user?.username);
      // console.log(data);
      setUsers(data?.all);
      setContact(data?.chatting[0]);
      setAllUsers([
        ...(data?.all || []), // Use empty array if data.all is undefined
        ...(data?.chatting || []), // Use empty array if data.chatting is undefined
      ]);
      setChatting(data?.chatting);
    } catch (error) {
      toast.error("Error while fetching");
    }
  };
  // console.log(users);
  useEffect(() => {
    getAllContacts();
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
            <p className="text-gray-400 pl-7 mt-3">ALL</p>
            {searchUsers?.map((user: User, index: number) => (
              <div key={index}>
                <ContactCard user={user} setContact={setContact} />
              </div>
            ))}
          </>
        ) : (
          <>
            {chatting.length > 0 && (
              <>
                <p className="text-gray-400 pl-7 mt-3">ALL</p>
                {chatting?.map((user: User, index: number) => (
                  <div key={index}>
                    <ContactCard user={user} setContact={setContact} />
                  </div>
                ))}
              </>
            )}
            {users.length > 0 && (
              <>
                <p className="text-gray-400 pl-7 mt-3">Start Chatting</p>
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
    </>
  );
};

export default Contacts;
