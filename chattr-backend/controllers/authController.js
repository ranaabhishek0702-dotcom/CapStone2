const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';


async function signup(req, res){
	const { username, email, password } = req.body;
	if(!username || !password || !email) return res.status(400).json({ error: 'username, email and password required' });

	try{
		const existing = await User.findOne({ $or: [{ username }, { email: email.toLowerCase() }] });
		if(existing) return res.status(409).json({ error: 'username or email already taken' });

		const user = await User.create({ username, email: email.toLowerCase(), password, emailVerified: false });

		const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		return res.json({ username: user.username, email: user.email, token });
	}catch(err){
		console.error(err);
		return res.status(500).json({ error: 'internal error' });
	}
}


async function signin(req, res){
	const { identifier, password } = req.body;
	if(!identifier || !password) return res.status(400).json({ error: 'identifier and password required' });

	try{
		const query = identifier.includes('@') ? { email: identifier.toLowerCase() } : { username: identifier };
		const user = await User.findOne(query);
		if(!user) return res.status(401).json({ error: 'invalid credentials' });

		const ok = await user.matchPassword(password);
		if(!ok) return res.status(401).json({ error: 'invalid credentials' });

		const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

		return res.json({ username: user.username, email: user.email, emailVerified: user.emailVerified, token });
	}catch(err){
		console.error(err);
		return res.status(500).json({ error: 'internal error' });
	}
}


module.exports = { signup, signin };