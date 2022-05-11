//import
const express = require("express");

// init express
const app = express();


// serve static build filesf rom teh 'dist' dir
app.use(express.static("./dist/stonk-pit-app"))

// route incoming server requests to the correct files
app.get("/*", (req, res) => res.sendFile("index.html", {root: "dist/stonk-pit-app"}));

// start the app on teh debaule Heroku defalut ports
app.listen(process.env.PORT || 8080);
