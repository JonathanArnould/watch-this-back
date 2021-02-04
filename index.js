const express = require("express");
const app = express();
const routes = require("./routes");
const dotenv = require("dotenv");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = 3000;

app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
