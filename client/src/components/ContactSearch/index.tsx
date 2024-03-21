import { useEffect, useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { User } from "../Contacts";
import GroupModal from "../GroupModal";
interface ContactSearchHelperProps {
  users: User[];
  setUsers: React.Dispatch<any>;
}

const ContactSearch = ({
  helpers: { users, setUsers },
}: {
  helpers: ContactSearchHelperProps;
}) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [showAddGroupModal, setShowAddGroupModal] = useState<boolean>(false);
  useEffect(() => {
    if (searchInput.length === 0) {
      setUsers([]);
    }
  }, [searchInput]);
  return (
    <div className="bg-white rounded-3xl h-[10%] lg:h-[15%] flex gap-3 lg:gap-6 items-center justify-center ">
      <span className="text-xl lg:text-3xl font-bold">Chat</span>
      <div className="border border-gray-400 border-1 w-[50%] p-1 px-2 lg:p-3 flex justify-center rounded-3xl">
        <input
          type="text"
          className="outline-none bg-white text-sm lg:text-base flex-1 font-medium w-full"
          placeholder="Search"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <button
          onClick={() => {
            if (searchInput.length > 0) {
              const searchedUsers = users.filter((user: User) => {
                const nameMatches =
                  user?.name && new RegExp(searchInput, "i").test(user.name);
                const usernameMatches =
                  user?.username &&
                  new RegExp(searchInput, "i").test(user.username);
                return nameMatches || usernameMatches;
              });
              console.log("searched", searchedUsers);
              setUsers(searchedUsers);
            }
          }}
        >
          <IoIosSearch className="text-xl text-gray-400" />
        </button>
      </div>
      <button
        className="w-8 lg:w-16 cursor-pointer"
        onClick={() => setShowAddGroupModal(true)}
      >
        <FaCirclePlus className="text-3xl lg:text-5xl text-[#ef4444]" />
      </button>
      {showAddGroupModal && (
        <GroupModal setShowGroupModal={setShowAddGroupModal} />
      )}
    </div>
  );
};

export default ContactSearch;
