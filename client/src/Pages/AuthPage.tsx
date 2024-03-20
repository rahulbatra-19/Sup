import axios from "@/utils";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
const AuthPage = () => {
  const navigate = useNavigate();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { data: response } = await axios.post("/authenticate", {
        username: e.target[0].value,
        pin: e.target[1].value,
      });
      console.log("response", response);
      if (response?.error) {
        toast.error(response?.error);
      } else {
        toast(response?.message);
        localStorage.setItem("user", JSON.stringify(response?.user)); //
      }
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="background">
      <form onSubmit={onSubmit} className="form-card">
        <div className="form-title">Welcome 👋</div>

        <div className="form-subtitle">Set a username to get started</div>

        <div className="auth">
          <div className="auth-label ">Username</div>
          <input className="auth-input" name="username" />
          <div className="auth-label">Pin</div>
          <input className="auth-input" name="username" />
          <button className="auth-button" type="submit">
            Enter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;
