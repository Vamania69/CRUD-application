import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import userRoutes from "./userRoutes/users.js";
const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => res.send("message in response"));

app.listen(port, () =>
  console.log(`server is listeninng on port : https://localhost:${port}`)
);

//to use the routes set in router file we use/import it and the can goo to that route

app.get("/users", userRoutes);

app.post("/user", userRoutes);

app.get("/user/:id", userRoutes);

app.delete("/user/:id", userRoutes);

app.put("/user/:id", userRoutes);

// export express
export default express;
