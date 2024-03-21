import { User } from "@/components/Contacts";
import Sidebar from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "@/utils";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { CiEdit } from "react-icons/ci";

const ProfilePage = () => {
  const [user, setUser] = useState<User>();
  const [searchParams] = useSearchParams(); // Destructure the first element of the tuple
  const userData = localStorage?.getItem("user");
  const userDetails = userData ? JSON.parse(userData) : null;
  const username = searchParams.get("username");
  const groupId = searchParams.get("groupId");
  const isOwnerAccount = !!searchParams.get("isOnwer") || false;
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [isOwner, setIsOwner] = useState<boolean>(isOwnerAccount);
  const [name, setName] = useState<string>(user?.name || "");
  const [newUsername, setNewUsername] = useState<string>(user?.username || "");
  const [description, setDescription] = useState<string>(
    user?.description || ""
  );
  const [group, setGroup] = useState<any>({});

  // const [description, setDescription] = useState<string>(user?.description);

  // console.log(user);
  console.log(groupId);
  // Access the 'username' parameter from the URL search params
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(
        `/User/getByUsername?username=${username}`
      );
      if (data?.user) {
        setUser(data?.user);
        if (data?.user?.username === userDetails?.username) {
          setIsOwner(true);
        }
      } else {
        // toast.error(data?.message);
        setUser(data?.message);
      }
    } catch (error) {
      toast.error("Error while fetching user");
      console.error(error);
    }
  };
  const fetchGroup = async () => {
    try {
      const { data } = await axios.get(`/group/getById?groupId=${groupId}`);
      if (data?.group) {
        setGroup(data?.group);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Error while fetching Group");
      console.error(error);
    }
  };
  const uploadPhoto = async (e: any) => {
    const file = e.target.files[0];
    // Get the first selected file
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("userId", userDetails?.id);
    const { data } = await axios.post("User/avatar/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (data?.user) {
      setUser(data?.user);
    }
    console.log(data);
  };
  const updateProfile = async () => {
    let pinInclude = false;
    if (pin.length > 0) {
      if (pin.length === 4) {
        if (pin !== confirmPin) {
          toast.error("Pins don't match");
          return;
        }
        pinInclude = true;
      } else {
        toast.error("Pin must of 4 letters/digits");
        return;
      }
    }
    let details: any = {
      username: newUsername,
      name,
      description,
      id: userDetails?.id,
    };

    if (pinInclude) {
      details = { ...details, pin };
    }
    try {
      const { data } = await axios.post(`/User/updateInfo`, details);
      if (data?.user) {
        toast("Updated info successfully");
        console.log(data);
        setUser(data?.user);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data?.user?._id,
            username: data?.user?.username,
          })
        );
      }
    } catch (error) {
      toast.error("Username already exists");
      console.error(error);
    }
  };
  useEffect(() => {
    if (groupId) {
      fetchGroup();
    }
    fetchUser();
  }, []);
  useEffect(() => {
    setName(user?.name || "");
    setNewUsername(user?.username || "");
    setDescription(user?.description || "");
  }, [user]);
  useEffect(() => {
    if (group?.name) {
      setName(group?.name);
      setNewUsername(group?.name);
      setDescription(group?.description);
    }
  }, [group]);
  return (
    <div className=" min-h-[100vh] h-[100%] w-full bg-slate-200 flex flex-col gap-4 p-6 2xl:p-10 justify-center items-center">
      {Object.keys(user || {}).length > 0 && (
        <div className=" h-[85vh] lg:h-[100%] mb-20 lg:mb-0 w-[98%] md:w-[65%] bg-white rounded-3xl p-4 xl:p-10 overflow-y-auto  no-scrollbar">
          <div className="md:flex justify-between md:px-6 md:gap-20">
            <div className="ml-4 md:ml-10 mt-4  flex-1">
              <div className="flex justify-between gap-6">
                <div>
                  <h1 className="font-medium text-xl">Profile</h1>
                  {isOwner ? (
                    <span className="text-sm text-gray-400 ">
                      This is how others will see you on the site.
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">
                      These are the user details.
                    </span>
                  )}
                </div>
                <div className="md:hidden relative">
                  <Avatar className="w-20  h-20 md:w-28 md:h-28 ">
                    <AvatarImage src={user?.avatar || group?.groupImage} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  {isOwner && (
                    <label
                      htmlFor="image"
                      className="cursor-pointer text-black  absolute top-10 "
                      style={{
                        top: "50px",
                        right: "23px",
                      }}
                    >
                      <span className="">
                        <CiEdit className="text-3xl text-black bg-gray-200 opacity-80 rounded-full p-2" />
                      </span>
                    </label>
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    // disabled={!isOwner}
                    onChange={uploadPhoto}
                  />
                </div>
              </div>
              <hr className="mt-4 border-gray-300" />
              <div className="py-8 flex flex-col gap-4">
                <label htmlFor="username" className="font-medium text-base">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Username"
                  value={newUsername}
                  className="bg-white border p-2 rounded-xl text-sm"
                  disabled={!isOwner}
                  id="username"
                  onChange={(e) => setNewUsername(e.target.value)}
                />
                {isOwner && (
                  <span className="text-gray-400 text-sm">
                    This is your public display name. It can be your real name
                    or a pseudonym.{" "}
                  </span>
                )}
                <label htmlFor="name" className="font-medium text-base">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  className="bg-white border p-2 rounded-xl text-sm"
                  disabled={!isOwner}
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                />
                <label htmlFor="bio" className="font-medium text-base">
                  Bio
                </label>
                {!isOwner ? (
                  <span className="border p-2 min-h-[36px] rounded-xl text-sm">
                    {user?.description}
                  </span>
                ) : (
                  <textarea
                    rows={3}
                    placeholder="Bio"
                    value={description}
                    className="bg-white border p-2 rounded-xl text-sm"
                    disabled={!isOwner}
                    id="bio"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                )}

                {isOwner && (
                  <>
                    <label htmlFor="pin" className="font-medium text-base">
                      Change Pin
                    </label>
                    <input
                      type="text"
                      placeholder="pin"
                      value={pin}
                      maxLength={4}
                      className="bg-white border p-2 rounded-xl text-sm"
                      disabled={!isOwner}
                      id="pin"
                      onChange={(e) => {
                        setPin(e.target.value);
                      }}
                    />
                    <span className="text-gray-400 text-sm">
                      The length of the pin should be 4.
                    </span>
                    <label htmlFor="pin" className="font-medium text-base">
                      Confirm Pin
                    </label>
                    <input
                      type="text"
                      placeholder="pin"
                      value={confirmPin}
                      maxLength={4}
                      className="bg-white border p-2 rounded-xl text-sm"
                      disabled={!isOwner}
                      id="pin"
                      onChange={(e) => {
                        setConfirmPin(e.target.value);
                      }}
                    />
                    <Button
                      className="w-32 mt-4  bg-[#ef4444] hover:bg-[#ef4444] hover:opacity-60"
                      onClick={updateProfile}
                    >
                      Update Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:block relative">
              <Avatar className="w-20  h-20 md:w-28 md:h-28 ">
                <AvatarImage src={user?.avatar || group?.groupImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              {isOwner && (
                <label
                  htmlFor="image"
                  className="cursor-pointer text-black  absolute top-10 "
                  style={{
                    top: "73px",
                    right: "32px",
                  }}
                >
                  <span className="">
                    <CiEdit
                      size={40}
                      className=" text-black bg-gray-300 opacity-80 rounded-full p-2"
                    />
                  </span>
                </label>
              )}
              <input
                type="file"
                id="image"
                accept="image/*"
                className="hidden"
                // disabled={!isOwner}
                onChange={uploadPhoto}
              />
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-3 w-[90%]  lg:hidden">
        <Sidebar user={userDetails} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfilePage;
