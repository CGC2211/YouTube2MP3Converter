//require packages
const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config()

//Create the express server
const app = express();

//server port number
const PORT = process.env.port || 3001;

//set template engine
app.set("view engine", "ejs");
app.use(express.static("public"));

//needed to parse html to http request
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index")
})

app.post("/convert-mp3", async (req, res) => {
  const videoId = req.body.videoID;
  if(videoId === undefined || videoId === null || videoId === "") {
    return res.render("index", { success : false, message : "Please enter a valid video ID" })
  } else {
    const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, 
    {"method": "GET",
     "headers": {
        "X-RapidAPI-Key" : process.env.API_KEY,
        "X-RapidAPI-Host" : process.env.API_HOST
     }});

     const fetchResponse = await fetchAPI.json();

     if( fetchResponse.status === "ok") {
        return res.render("index", {success: true, song_title: fetchResponse.title, song_link: fetchResponse.link})
     }else {
        console.log('first vv', fetchResponse.msg)
        return res.render("index", {success: false, message: fetchResponse.msg})
    }
  }
})

//start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

