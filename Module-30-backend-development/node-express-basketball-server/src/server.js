/* Main purpose of this file is to: Run the server */

const { PORT = 5000 } = process.env; //destructuring Port from process.env. Default the port to === 5000
const app = require("./app"); //import express app object from app.js 

const listener = () => console.log(`Listening on Port ${PORT}!`);

app.listen(PORT, listener); //app.listen(Portnumber, a callback function to run when the app is running )-> lets the app listen for requests to a specified port number
