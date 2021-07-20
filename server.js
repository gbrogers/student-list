const express = require("express");
const path = require("path");
// require rollbar below
const Rollbar = require("rollbar"); //this is capitalized bc it is a class

// create the Rollbar class below
const rollbar = new Rollbar({
  accessToken: "7ba59ceab6d94e5b9bc383b6b758e120", //this  is found in rollbar
  captureUncaught: true, //anytime server has uncaught error, rollbar will display in log
  captureUnhandledRejections: true,
});

const app = express();
app.use(express.json());
let studentList = [];

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
  // send rollbar some info // happens everytime project is loaded
  rollbar.info("html file served successfully");
});

app.post("/api/student", (req, res) => {
  let { name } = req.body;
  name = name.trim();

  const index = studentList.findIndex((studentName) => {
    return studentName === name;
  });

  if (index === -1 && name !== "") {
    studentList.push(name);
    // add rollbar log here

    res.status(200).send(studentList);
  } else if (name === "") {
    // add a rollbar error here

    res.status(400).send({ error: "no name was provided" });
  } else {
    // add a rollbar error here too

    res.status(400).send({ error: "that student already exists" });
  }
});

const port = process.env.PORT || 4545;

// add rollbar errorHandler middleware here

app.listen(port, () => console.log(`server running on port ${port}`));
