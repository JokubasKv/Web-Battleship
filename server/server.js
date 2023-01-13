const express = require('express')
const app = express()

app.use(express.json())

app.get("/api",(req,res) =>{
    res.json({"users": ["1","2","3","end"]})
})

app.post("/api/shoot",(req,res) =>{
    console.log(req.body);
    res.send(req.body);
})

var server = app.listen(3600,() => {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server app listening at http://%s:%s", host, port)
})