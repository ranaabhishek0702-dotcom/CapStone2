const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Message = require('../models/Message');


// Get recent messages for a room (requires JWT)
router.get('/:room', auth, async (req, res) =>{
const room = req.params.room;
const limit = parseInt(req.query.limit) || 100;
try{
const msgs = await Message.find({ room }).sort({ time: 1 }).limit(limit).lean();
return res.json(msgs);
}catch(err){
console.error(err);
return res.status(500).json({ error: 'internal' });
}
});


module.exports = router;