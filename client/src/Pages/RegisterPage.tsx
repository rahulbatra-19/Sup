import axios from "@/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CgRename } from "react-icons/cg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
const RegisterPage = () => {
  const [name, setName] = useState<string>("");
  const [pin, setPin] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const navigate = useNavigate();
  // const socket = useContext<any>(SocketContext);
  const onSubmit = async (e: any) => {
    if (pin.length !== 4) {
      toast.error("Pin too short!!");
      return;
    }
    e.preventDefault();
    try {
      const { data: response } = await axios.post("User/register", {
        username,
        pin,
        name,
      });
      console.log("response", response);
      if (response?.error) {
        toast.error(response?.error);
      } else {
        if (!response?.user) {
          toast(response?.message);
        } else {
          localStorage.setItem("user", JSON.stringify(response?.user)); //
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex ">
      <div className="hidden lg:block lg:w-[50%]">
        <img src="https://i.imgur.com/yjC5ckM.png" alt="" />
      </div>
      <div className="h-[100vh] w-full  bg-[#e7c8c8] flex justify-center items-center gap-2 flex-1 flex-col relative">
        <Button
          onClick={() => navigate("/login")}
          className="absolute right-10 top-10 bg-[#ef4444] hover:bg-[#ef4444] hover:opacity-60"
        >
          Login
        </Button>
        <div className=" flex flex-col gap-3 bg-white p-6 rounded-3xl">
          <div className="flex flex-col justify-center items-center mb-4">
            <h1 className="font-bold text-2xl mb-3 text-[#ef4444]">
              Create An Account
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your email below to create your account
            </p>
          </div>
          <label className="input input-bordered flex items-center gap-2 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2 bg-white">
            <CgRename className="w-4 h-4 opacity-70" />
            <input
              type="text"
              className="grow"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="input input-bordered flex items-center gap-2 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              placeholder="Pin"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </label>
          <Button
            className="bg-[#ef4444] hover:bg-[#ef4444] hover:opacity-60"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
