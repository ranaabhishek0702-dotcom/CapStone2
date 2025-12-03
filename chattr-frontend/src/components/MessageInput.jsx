import React, { useState } from "react";


export default function MessageInput({ onSend }){
const [text, setText] = useState("");


const submit = (e) =>{
e.preventDefault();
if(!text.trim()) return;
onSend(text.trim());
setText('');
}


return (
<form className="message-input-container" onSubmit={submit}>
<input 
  className="input-field"
  value={text} 
  onChange={(e)=>setText(e.target.value)} 
  placeholder="Type a message..." 
/>
<button className="send-button" type="submit">Send</button>
</form>
);
}