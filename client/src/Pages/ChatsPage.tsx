import Chatting from "@/components/Chatting";
import Contacts, { User } from "@/components/Contacts";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

const ChatsPage = () => {
  const [contact, setContact] = useState<User>();
  return (
    <div className="h-[100vh] w-full bg-slate-200 flex gap-4 p-6 2xl:p-10">
      <Sidebar />
      <div className="w-[35%] flex flex-col gap-2">
        <Contacts setContact={setContact} />
      </div>
      <div className="w-[55%] flex flex-col gap-2 ">
        <Chatting contact={contact} />
      </div>
    </div>
  );
};
export default ChatsPage;
