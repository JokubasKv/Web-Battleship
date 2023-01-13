const express = require('express')
const app = express()

app.get("/api",(req,res) =>{
    res.json({"users": ["1","2","3","end"]})
})

app.listen(3600,() => {console.log("Server listening on port 3600")})