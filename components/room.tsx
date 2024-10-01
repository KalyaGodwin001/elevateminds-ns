import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JSX, SVGProps } from "react";
import {  ArrowLeft, ArrowUp, Copy, CopyIcon, Loader2, LogOut, MenuIcon, MessageSquareDashedIcon, Pencil, Share, Trash } from "lucide-react"
import toast from "react-hot-toast";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
import { useRouter } from "next/navigation";
interface IMsgDataTypes {
  roomId: string | number;
  user: string;
  msg: string;
  time: string;

}
interface RoomProps {
  onMessageSent: () => void;
  socket: any;
  username: string;
  roomId: string;
}
const ChatPage = ({ socket, username, roomId , onMessageSent}: RoomProps) => {
  const router = useRouter();
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const sendData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time: `${new Date(Date.now()).getHours()}:${new Date(
          Date.now()
        ).getMinutes()}`,
      };
      await socket.emit("send_msg", msgData);
      setTimeout(() => {
        setSending(false);
      }
      , 1000);
      onMessageSent();
      setCurrentMsg("");
    }
  };
  const logout = () => {
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('roomId');
    localStorage.removeItem('id');
    window.location.href = '/';
    toast.success('logged out', {
      style: {
        border: '1px solid #713200',
        padding: '16px',
        color: '#713200',
      },
      iconTheme: {
        primary: '#713200',
        secondary: '#FFFAEE',
      },
    });
    
  };
  useEffect(() => {
    // Scroll to the bottom of the chat when messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chat,
    currentMsg,
    isOpen,
    roomId,
    router,
    messagesRef.current?.scrollHeight]);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      console.log("connected");
    });
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  // delete message
  const deleteFromSocket = (key: any) => {
    socket.emit("delete_msg", key);
  };

  // edit message
  const editMessage = (key: any) => {
    socket.emit("edit_msg", key);
  };

  return (
    <>
    {
      !isConnected && (
        <div className="flex items-center justify-center min-h-screen bg-white">
          <Loader2 className=" h-6 w-6 animate-spin" />
        </div>
      )
    }
    {
  isConnected && (
    <div className="w-full h-full flex flex-col lg:flex-row relative">
      {/* Aside Section */}
      <aside className="w-full lg:w-[28%] h-full border-r lg:border-r-0 lg:border-b overflow-auto sm:sticky sm:z-20 sm:bg-white  sm:left-0  mt-8">
      <ul className="divide-y sm:flex flex-col hidden">
          {/* message send list */}
           {
              username
               && (<li className="flex items-center p-4">
              <img
                src={`https://ui-avatars.com/api/?background=random&name=${username}`}
                alt={username}
                className="w-10 h-10 mr-4 rounded-full"
              />
              <div>
                <h3 className="font-bold">{username}</h3>
                <p className="text-sm text-gray-400 font-bold">
                  {username} joined
                </p>
              </div>
            </li> )}
            
               <li className="flex items-center p-4 hover:transition-all hover:bg-gray-200 cursor-pointer rounded">
              <a onClick={logout} className="cursor-pointer flex items-center justify-center gap-x-3 mx-3 ">
                <LogOut className="h-6 w-6 mr-4" />
                <span className="font-bold">Logout</span>
              </a>
            </li>
            {/* clear all chats */}
            <li className="flex items-center p-4 hover:transition-all hover:bg-gray-200 cursor-pointer rounded">
              <a onClick={() => setChat([])} className="cursor-pointer flex items-center justify-center gap-x-3 mx-3 ">
                <Trash className="h-6 w-6 mr-4" />
                <span className="font-bold">Clear all chats</span>
              </a>
            </li>

           
        </ul>
        
      {
        isOpen && (<>
          <ul className="divide-y flex sm:hidden flex-col">
          {/* message send list */}
           {
              username
               && (<li className="flex items-center p-4">
              <img
                src={`https://ui-avatars.com/api/?background=random&name=${username}`}
                alt={username}
                className="w-10 h-10 mr-4 rounded-full"
              />
              <div>
                <h3 className="font-bold">{username}</h3>
                <p className="text-sm text-gray-400 font-bold">
                  {username} joined
                </p>
              </div>
            </li> )}
            
               <li className="flex items-center p-4 hover:transition-all hover:bg-gray-200 cursor-pointer rounded">
              <a onClick={logout} className="cursor-pointer flex items-center justify-center gap-x-3 mx-3 ">
                <LogOut className="h-6 w-6 mr-4" />
                <span className="font-bold">Logout</span>
              </a>
            </li>
            {/* clear all chats */}
            <li className="flex items-center p-4 hover:transition-all hover:bg-gray-200 cursor-pointer rounded">
              <a onClick={() => setChat([])} className="cursor-pointer flex items-center justify-center gap-x-3 mx-3 ">
                <Trash className="h-6 w-6 mr-4" />
                <span className="font-bold">Clear all chats</span>
              </a>
            </li>

           
        </ul>
        </>)
      }
      </aside>

      {/* Section Section */}
      <section 
       className="w-full sm:left-[28%] lg:w-2/3 sm:h-full flex flex-col divide-x-2 sm:min-h-screen h-auto divide-gray-200  sm:absolute ">
        {/* Header desktop */}
        <header className="flex  items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">
            {roomId ? (<div className="flex items-center">
              <span className="mx-2">Room: {roomId}</span>
              {/* share  */}
              <button
                className="flex items-center gap-x-2"
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                  toast.success("Room ID copied", {
                    style: {
                      border: "1px solid #713200",
                      padding: "16px",
                      color: "#713200",
                    },
                    iconTheme: {
                      primary: "#713200",
                      secondary: "#FFFAEE",
                    },
                  });
                }}
              >
                <Share className="h-6 w-6" />
              </button>
            </div>): 'Join a room'}
          </h2>
          <Button size="icon" variant="outline">
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close chat</span>
          </Button>
        </header>
        {/* Header mobile */}
        <Button
        onClick={() => setIsOpen(!isOpen)}
         size="icon" variant="outline" className="sm:hidden m-2">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Open chat</span>
        </Button>
      
        

        {/* Chat Messages */}
        <div 
        ref={(ref) => {
          messagesRef.current = ref as HTMLDivElement;
        }}
        className="flex-1 sm:overflow-auto overflow-hidden p-4 space-y-4 sm:my-3 my-10  h-40 sm:h-auto">
         <>
         {
              chat.length === 0 && (
                 <div className="flex items-center justify-center h-72 sm:pt-16 overflow-hidden font-extrabold text-4xl flex-col">
                    <MessageSquareDashedIcon className="h-20 w-20" />
                <p className="text-gray-800 text-center">
                  Welcome  {username}
                </p>
                 </div>
              )
         }
                  {chat.map(({ user, msg }, key) => (
            <>
            
             <div key={Date.now() + key
              } className={`flex items-center mb-4 ${
            user === username ? "justify-start" : "justify-end"
          }`}
          >
            
            <img 
            src={`https://ui-avatars.com/api/?background=random&name=${user}`}
            alt={user}
            className="w-7 h-7 rounded-full mr-1"
            /> 
            
<div
  className={`max-w-xs mx-2 my-2 p-4 rounded-lg ${user === `${username}`
   ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
>
  <p className="text-sm flex  flex-col
   min-w-[100px] 
   "  ref={(ref) => { messagesRef.current = ref as HTMLDivElement; }}>
    <span>{msg} - <span className={
      user === `${username}` ? 'text-blue-800' : 'text-gray-800'
    }>{' '
    }
      {
      user === `${username}` ? 'You' : user
    }</span></span>
    <span className={
      user === `${username}` ? 'text-pink-800 my-1' : 'text-gray-800 my-1'
    }
    >{new Date().toLocaleTimeString()}</span>

    {/* end delete icon */}
    
  
      {/* <button 
      className="  gap-x-4 float-end flex justify-end "
      >
        <Trash onClick={() => deleteFromSocket(key)} className="h-5 w-5 " />
        <Pencil onClick={() => editMessage(key)} className="h-5 w-5" />
      </button> */}
  </p>
</div>
</div>

            </>



))}
         </>

  


{/* 
{
sending ? (
  <div className="flex items-center justify-start mb-4">
<div
  className={`max-w-xs mx-2 my-2 p-4 rounded-lg bg-gray-200 text-black`}  
>
  <p className="text-sm flex  flex-col
   min-w-[100px] 
   ">
    <span className="text-xs text-gray-200 font-bold">{new Date().toLocaleTimeString()}</span>
    <span className="text-xs text-gray-200 font-bold">
     sending...
    </span>
  </p>
</div>
</div>
) : ''
}

*/}



        </div>

        {/* Message Input */}
        <div 
        className="p-4 border-t  sm:sticky bg-white fixed bottom-0 inset-x-0 z-20">
         
          {/* sending  message*/}
          <div className="flex justify-center items-center">
          {
            sending && (
             
              <p className="text-xs text-gray-800 text-center py-2  rounded w-full min-w-[400px] mb-2  justify-center items-center flex mx-auto ">
                 <Loader2 className="h-6 w-6 animate-spin" />
                  
                  
                  
              </p>
            )
          }
          </div>

          <form className="flex space-x-2" onSubmit={(e) => sendData(e)}>
            <Input
             disabled={sending}
               value={currentMsg}
               onChange={(e) => setCurrentMsg(e.target.value)}
               // enter to send message
              //  onKeyPress={handleKeyPress}
             className="flex-1" id="message" placeholder={sending ? 'Sending...' : `${username} type a message`}
              />
            <Button 
            disabled={currentMsg === '' || sending}
            
            >
              <ArrowUp className="h-6 w-6" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </section>
      {/* go home */}
  <button
      onClick={() => {
        window.location.href = "/";
      }}
      className="sm:fixed hidden left-4  sm:bottom-2  z-50  text-gray-50 "
    >
        
        <TooltipProvider>
  <Tooltip >
    <TooltipTrigger className=' rounded-full flex-col justify-center items-center m-auto bg-transparent shadow-md sm:text-white text-black sm:bg-gray-900 p-2'>
      <ArrowLeft className="w-5 h-5" />
    </TooltipTrigger>
    <TooltipContent>
      <p>
        Go Home
      </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

    </button>
    </div>
  )
    }
    
  

  
</>
  
  );
};

export default ChatPage;


function ArrowRightIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6 5 6 21 6" />
      <path d="m5 6 0 15 14 0 0-15" />
      <path d="m10 11 0 6" />
      <path d="m14 11 0 6" />
    </svg>
  )
}

function EditIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6 5 6 21 6" />
      <path d="m5 6 0 15 14 0 0-15" />
      <path d="m10 11 0 6" />
      <path d="m14 11 0 6" />
    </svg>
  )
}

function PenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6 5 6 21 6" />
      <path d="m5 6 0 15 14 0 0-15" />
      <path d="m10 11 0 6" />
      <path d="m14 11 0 6" />
    </svg>
  )
}