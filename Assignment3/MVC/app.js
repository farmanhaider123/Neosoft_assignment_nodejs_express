const express=require('express');
const port=9889;
const exp=require('express-handlebars');
const app=express();
app.engine('handlebars',exp.engine());
app.set('view engine','handlebars');
app.set('views','./views');

const mainroute=require('./routes/mainroutes');
const userroute=require('./routes/userroutes');

app.use('/',mainroute);
app.use('/user',userroute);
app.use('*',(req,res)=>{
    res.render('notfound');
});

app.listen(port,(err)=>{
    if(err) throw err
    else 
    console.log("server works on "+port);
})