var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var dbUrl = "mongodb+srv://root:31547207@cluster0.ar3uy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var app = express();
var http = require("http").Server(app);

var io = require("socket.io")(http)

app.use(express.static(__dirname ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var Message = mongoose.model("Message", {
    name: String,
    message: String
})
/** 
var messages = [

    {
        name: "mary",
        message: "i love you"
    },
    {
        name: "biko",
        message: "i love you too"
    }
] */

app.get("/messages", (req, res)=>{
    Message.find({}, (err, messages)=>{
        res.send(messages);
    })

})

app.post("/post_messages", (req, res)=>{
    var message = new Message(req.body);
    message.save().then(
        ()=>{
          //  messages.push(req.body);
            io.emit('message', req.body);
            res.sendStatus(200);
        }
    ).catch((err)=>{
        res.sendStatus(500);
        return console.error(err)
    })

   
    })

    app.post("/trycatch", (req, res)=>{
        try{

        } catch (error){
            res.sendStatus(500);
        return console.error(err)
        } finally {
            // executed regardless
        }
    })

io.on("connection", (socket) => {
    console.log("a user connected")
});

mongoose.connect(dbUrl, (err) => {
    console.log("db connected", err);
})

var server = http.listen(3000, ()=>{
    console.log("server started on port", server.address().port)
});