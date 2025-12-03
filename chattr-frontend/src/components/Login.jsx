import React, { useState } from "react";


export default function Login({ onLogin }){
const [username, setUsername] = useState("");


function handleSubmit(e){
e.preventDefault();
if(!username.trim()) return;
onLogin(username.trim());
}


return (
<div className="login-center">
<div className="card login-card">
<h2 className="brand">Chattr</h2>
<p style={{color:'var(--muted)'}}>Enter a username to join the global chat</p>


<form onSubmit={handleSubmit}>
<input placeholder="Your username" value={username} onChange={(e)=>setUsername(e.target.value)} />
<div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
<button className="btn" type="submit">Join</button>
</div>
</form>
</div>
</div>
);
}