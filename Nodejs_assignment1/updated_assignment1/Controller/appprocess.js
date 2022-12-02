const fs =require('fs');
function create(req, res) {

    res.render('create', { title:"Create file page", errmsg: "", succmsg: "" });
}
function read(req, res) {
   
     res.render('read',{title:"read page",content:"",errmsg:''})
}

function readdata(req, res) {
    let filename = req.body.filename;
    if (fs.existsSync(`./users/${filename}.txt`)) {
        let data = fs.readFileSync(`./users/${filename}.txt`);
        res.render('read', { title: "read page", content: data,errmsg:"" })
    }
    else {
        res.render('read', { title: "read page", content:'', errmsg: "file is not exist" });
    }
}
function update(req, res) {
    res.render('update', { title: "updatepage", message: '', FILE: "" ,errmsg:'',succmsg:''})
}
function updatedata(req, res) {
    let key = 1;
    let filename = req.body.filename;
    if (fs.existsSync(`./users/${filename}.txt`)) {
        let data = fs.readFileSync(`./users/${filename}.txt`);
        let editdata = req.body.message;
        res.render('update', { title: "update page", message: data, FILE: filename ,errmsg:'',succmsg:""});

        fs.appendFileSync(`./users/${filename}.txt`, editdata);
       
   
       res.render('update', { title: "update page", message: '', FILE: '' ,errmsg:'',succmsg:"file is updated"}); 
        
    }
   
    else {
         res.render('update', { title: "update page", message:'', FILE: '',succmsg:'',errmsg:"file is not exist in our record"});
    }
}


function Delete(req, res) {
    res.render('delete', { title: "Delete page", errmsg: '', succmsg: '' });
}
function deletedata(req, res) {
    let filename = req.body.filename;
    if (fs.existsSync(`./users/${filename}.txt`)) {
        fs.unlink(`./users/${filename}.txt`, (err) => {
            if (err) throw err;
            else {
                res.render('delete', { title: "Delete page", succmsg: "File is deleted", errmsg: "" });
            }
        })
    }
    else {
        res.render('delete', { title: "Delete page", errmsg: "File is not exist", succmsg: "" });
    }
}


function postData(req, res) {
    let filename = req.body.filename;
    let message = req.body.message;
    if (fs.existsSync(`./users/${filename}.txt`)) {
        res.render('create', { title:"Create file page" , errmsg: 'file is Already registred', succmsg:"" })
    }
    else {
        fs.writeFile(`./users/${filename}.txt`, `${message}`, (err) => {
            if (err) {
                res.render('create', { title:"Create file page",errmsg: 'Something went wrong',succmsg:"" })
            }
            else {
                //res.redirect(`/user/welcome ${email}`) ;   
                res.render('create', {title:"Create file page", succmsg:'File created' ,errmsg:"" });
            }
        })
    }
}

module.exports = { create, read, update, Delete,postData,readdata ,updatedata,deletedata};