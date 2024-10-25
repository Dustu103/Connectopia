const express = require('express')
const protect = require('../../Middleware/authmiddleware')
const router = express.Router()
const {accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require('../../controlers/chat')

router.route('/').post(protect,accessChat)
.get(protect,fetchChat)

// router.route('/group').post(protect,createGroupChat)
// // .get(protect,fetchGroupChat)
// router.route('/group/rename').put(protect,renameGroup)
// router.route('/group/remove').put(protect,removeFromGroup)
// router.route('/group/add').put(protect,addToGroup)

module.exports = router