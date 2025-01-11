import { BsRobot } from "react-icons/bs";
import { MdKeyboardArrowDown } from "react-icons/md";
import ChatForm from "./components/chatForm";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./components/chatMessage";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaCommentAlt } from "react-icons/fa";

const App = () =>{

  const [chatHistory,setChatHistory] =useState([]);
  const [showChatBot,setshowChatBot]=useState(false);
  const bodyRef = useRef();
  
  const generateBotResponse= async (history)=>{

   const updateHistory = (text,isError=false)=>{
    setChatHistory(prev => [...prev.filter(msg => msg.text !=="..."),{role :"model",text,isError}])
   }

    //this format is needed to get the response from the api
    history = history.map(({role,text})=> ({role,parts:[{text}]}));

 
    const requestOptions={
      method:"POST",
      headers:{"content-type":"application/json"},
      body : JSON.stringify({contents:history})
    }

    try{
      console.log(import.meta.env.VITE_API_URL);
     const res = await fetch(import.meta.env.VITE_API_URL,requestOptions)
     const data= await res.json();
     console.log(data)
     if(!res.ok) throw new Error(data.error.message || "something is wrong")

      const apiRes = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g , "$1").trim();
      updateHistory(apiRes)

    }catch(err){
      //  updateHistory(err.message , true)
      updateHistory("something is wrong", true)

    }
  }


  useEffect(()=>{
    //scroll to last message
    bodyRef.current.scrollTo({top:bodyRef.current.scrollHeight,behaviour:"smooth"})
  },[chatHistory])

  const clickPopup=()=>{
    setshowChatBot(prev => !prev)
  }
  return (
    <>
      <div className={`container ${showChatBot ? "show-chatbot" : ""}`}>
        <button onClick={clickPopup} className="chatbot-toggle">
          {showChatBot === true ?         
          <span> <IoCloseCircleOutline className="round-popupIcons"/></span> :       
            <span><FaCommentAlt className="round-popupIcons"/></span>

}  

        </button>
        <div className="chatbot-popup">
          {/* chatbot header */}
          <div className="chatbot-header">
            <div className="header-info">
            <BsRobot className="header-icon"/>
              <h2 className="logo-text">
                Chatbot
              </h2>
            </div>
            <button onClick={clickPopup}><MdKeyboardArrowDown /></button>


          </div>

          {/* chatbot body */}
          <div ref={bodyRef}  className="chatbot-body">
            <div className="message bot-message">
              <BsRobot className="body-bot-icon" />
              <p className="message-text">
                 Hi, How can i help you today ??
              </p>
            </div>
          
            {chatHistory.map((chat,idx)=>(
               <ChatMessage key={idx} chat={chat}/>
            ))}
           
          </div>
          {/* chatbot footer */}
          <div className="chat-footer">
               <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
          </div>
        </div>
      </div>
    </>
  )
}

export default App;