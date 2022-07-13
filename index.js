const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const dotenv = require("dotenv");
dotenv.config();
const db = require("./queries");
const cors = require("cors");
const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://paddington.eu.auth0.com/.well-known/jwks.json",
  }),
  audience: "https://paddington.eu.auth0.com/api/v2/",
  issuer: "https://paddington.eu.auth0.com/",
  algorithms: ["RS256"],
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Hello World" });
});

app.get("/todos", checkJwt, db.getTodos);

app.post("/todos", db.createTodos);

app.listen(port, () => {
  console.log(`Todo List API started ${port}.`);
});
