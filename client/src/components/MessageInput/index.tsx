import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { BsEmojiSmile, BsFillSendFill } from "react-icons/bs";
interface MessageInputProps {
  contact?: any;
  socket: any;
  setMessages: React.Dispatch<any>;
  isGroup: boolean;
}

const MessageInput = ({
  contact,
  socket,
  setMessages,
  isGroup,
}: MessageInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [emojiObject, setEmojiObject] = useState<any>({});
  const [messageText, setMessageText] = useState<string>("");
  const userData = localStorage?.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const emojiRef = useRef<any>();
  const sendMessage = async () => {
    if (!isGroup) {
      socket.emit("message", { messageText, contact, user });
    } else {
      socket.emit("messageGroup", {
        messageText,
        user,
        conversationId: contact?.conversation?._id,
      });
    }
    // try {
    // await axios.post("/conversation/OneTOne", {
    //     messageText,
    //     contact,
    //     user,
    //   });
    setMessages((prev: any) => [
      ...prev,
      { sender: user?.id, message: messageText },
    ]);
    setMessageText("");
    // } catch (error) {
    //   toast.error("Error while sending text ");
    // }
  };
  React.useMemo(() => {
    if (emojiObject?.emoji) setMessageText((prev) => prev + emojiObject?.emoji);
  }, [emojiObject]);

  const handleOutsideClickShareOptions = () => {
    if (emojiRef.current !== null) {
      // if (emojiRef.current.contains(e.target)) return;
    }
    setShowEmojiPicker(false);
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClickShareOptions);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClickShareOptions);
    };
  }, []);
  return (
    <div className=" flex h-[10%] justify-between gap-2">
      <div className="bg-white rounded-3xl flex px-6 items-center justify-between flex-1 relative">
        <textarea
          placeholder="Write Message!"
          className="outline-none text-lg bg-white flex-1 mr-4 "
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
          }}
        />

        <button
          onClick={() => {
            setShowEmojiPicker((prev) => !prev);
          }}
          className="cursor-pointer"
        >
          <BsEmojiSmile className="text-xl" />
        </button>
        {showEmojiPicker && (
          <div className="absolute right-8 bottom-10" ref={emojiRef}>
            <EmojiPicker
              onEmojiClick={setEmojiObject}
              height={400}
              width={300}
            />
          </div>
        )}
      </div>
      <button
        onClick={sendMessage}
        className="rounded-3xl aspect-square flex justify-center items-center h-full bg-[#ef4444] "
      >
        <BsFillSendFill className="text-xl text-white" />
      </button>
    </div>
  );
};

export default MessageInput;
