const express = require("express")
const vhost = require("vhost")
const fs = require("fs")
const bodyParser = require("body-parser")
const sqlite3 = require("sqlite3")
const cookie = require("cookie-parser")
const app = express()
const db = new sqlite3.Database("./information.db")
var index;

function clear_data()
{
    var command = `var parent = document.getElementsByClassName("messages");
    var client = document.getElementsByClassName("bot");
`

    fs.writeFile("public/messages.js",command,(err) => {
        if (err)
        console.error(err);
    })

}

function indexer()
{
    if(!index)
        index = 1

    else if (index == 4)
        index = 1
    
    else 
        index +=1
}


function chatbot(message)
{
    var greeting = { "hi":"Hi","hello":"Hello","how are you?":"I am fine.What about you?","are you okay?":"Yeah!! Fine.","what are you doing":"Just mind my works","bye":"Bye 😇. Take care","i love you":"I Love you but as a friend","sir":"yes madam","madam":"Solluga sir","fine":"Mm","Mm":"Mm"}
    for(var key in greeting) {
        
        if (key == message) 
            return greeting[key]
    }


}

function createdatabase() {
    var query = "CREATE TABLE IF NOT EXISTS details (name TEXT,message TEXT,time INTEGER)"
    db.run(query)
    console.info("\n[+] Database created successfully [+]\n")
}

// Change the domain to subdomain (message.domain.com)
// var message = express.Router()
// app.use(vhost("message.*",message))

function save_data(name,messager,timer) {
    var query = "INSERT INTO details(name,message,time) VALUES(?,?,?)"
    db.run(query,[name,messager,timer])
    console.log("\n [-] New information is inserted [-]\n")
}

function messager(msg) {

        var bot_message;
        bot_message = chatbot(msg)
        if(bot_message == undefined)
            bot_message = "I can not understand";
        var user_command = "\nparent["+(index-1)+"].innerHTML = '"+msg+"'";
        var bot_command = "client["+(index-1)+"].innerHTML = '"+bot_message+"'";
        var full_command = user_command + ";\n" + bot_command +";\n"
        fs.appendFile("public/messages.js",(full_command),(err) => {
            if (err)
                console.error(err);
        })


}

// Middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookie())
app.use(express.static("public"))

app.post("/msg", (req,res) => {
    var userid = req.cookies.username;
    var msg = req.body.msg
    msg = msg.toLowerCase()
    var timer = Date.now()
    save_data(userid,msg,timer)
    indexer()
    messager(msg)
    res.redirect("/")

})


app.post("/logout", (req,res) => {
    res.cookie("username","")
    fs.readFile("public/name.html", (err,data) => {
        res.status(200)
        clear_data()
        index = 0;
        res.header({"Content-Type":"text/html"})
        res.write(data)
        res.end()
    })
})

app.post("/name", (req,res) => {
    var userid = req.body.username
    res.cookie("username",userid)
    res.cookie("__v_iNt__",1);
    fs.readFile("public/message.html", (err,data) => {
        res.status(200)
        res.header({"Content-Type":"text/html"})
        res.write(data)
        res.end()
    })
    
})

app.get("/", (req,res) => {
    var ucookie = req.cookies.username
    if(ucookie == null || ucookie == '')
    {
        fs.readFile("public/name.html", (err,data) => {
            res.status(200)
            res.header({"Content-Type":"text/html"})
            res.write(data)
            res.end()
        })
    }
    else {
        fs.readFile("public/message.html", (err,data) => {
            res.status(200)
            res.header({"Content-Type":"text/html"})
            res.write(data)
            res.end()
        })
    }
})

app.listen(80,() => {
    createdatabase()
    console.log("[*] Messaging Server is live now [*] \n")
})