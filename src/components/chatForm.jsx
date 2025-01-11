import { FaArrowUp } from "react-icons/fa";
import { useRef } from "react";
const ChatForm = ({chatHistory,setChatHistory,generateBotResponse}) => {
    
  const inputRef  = useRef();
    const handleFormSubmit=(e)=>{
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
    
        inputRef.current.value="";
        setChatHistory((history )=> 
        [...history,{role:"user" , text : userMessage}]
        )

        setTimeout(()=>{
            setChatHistory((history )=> 
                [...history,{role:"model" , text : "..."}]
                )
                
                generateBotResponse([...chatHistory,{role:"user" , text : userMessage}])
            },600)
      }
    
    return (
        <>
            <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
                <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
                <button><FaArrowUp /> </button>
            </form>
        </>
    )
}
export default ChatForm;