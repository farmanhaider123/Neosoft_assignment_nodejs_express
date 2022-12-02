const express=require('express')
const router = express.Router();
const fs = require('fs');
const { create, read, update, Delete,postData,readdata,updatedata,deletedata}=require('./Controller/appprocess')
router.get('/', (req, res) => {
    res.render('index', { title:"home page"});
})

router.get('/create', create);
router.get('/read', read);
router.get('/update', update);
router.get('/delete', Delete);
router.post('/postdata', postData);
router.post('/readdata', readdata);
router.post('/updatedata', updatedata);
router.post('/deletedata',deletedata)
module.exports = router;
