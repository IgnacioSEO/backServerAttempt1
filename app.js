require("dotenv").config();

const http = require("http");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { DataSource } = require("typeorm");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const appDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/ping", (req, res) => {
  return res.status(200).json({ message: "pong" });
});
app.post("/users", async (req, res) => {
  const { name, email, profileImage, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await appDataSource.query(
    `INSERT INTO users(
      name,
      email,
      profileImage,
      password
    ) VALUES (?, ?, ?, ?);
    `,
    [name, email, profileImage, hashedPassword]
  );
  return res.status(201).json({ message: "userCreated" });
});

app.post("/posts", async (req, res) => {
  const { title, content, userId } = req.body;
  await appDataSource.query(
    `INSERT INTO posts(
      title,
      content,
      userId
    ) VALUES (?, ?, ?);
    `,
    [title, content, userId]
  );
  return res.status(201).json({ message: "postCreated" });
});

app.get("/posts", async (req, res) => {
  const posts = await appDataSource.query(
    `SELECT(
    users.id AS userId,
    users.profileImage AS userProfileImage,
    posts.id AS postingId,
    posts.contentImage AS postingImageUrl,
    posts.content AS postingContent
    FROM users
    INNER JOIN posts ON users.id = posts.userId
  )`
  );
  return res.status(200).json({ data: posts });
});

app.get("/posts/:userId", async (req, res) => {
  const { userId } = req.params;
  const [result] = await appDateSource.query(
    `SELECT(
    users.id AS userId,
    users.profileImage AS userProfileImage,
    post.postings
    FROM users 
    LEFT JOIN(
      SELECT
    userId,
    JSON_ARRAYAGG(
      JSON_OBJECT(
        "postingId",id,
        "postingImageUrl", image_url,
        "postingContent", content 
        )
      ) as postings
    FROM posts
    GROUP BY userId
    ) post ON post.userId = users.id
    WHERE users.id = ${userId}
    )`
  );
  return res.status(200).json({ data: result });
});

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  await appDateSource.query(
    `DELETE FROM posts
    WHERE posts.id = ${postId}`
  );
  return res.status(200).json({ message: "postingDeleted" });
});

app.post("/likes", async (req, res) => {
  const { userId, postId } = req.body;
  await appDataSource.query(
    `INSERT INTO likes(
      userId
      postId
    ) VALUES (?, ?);
    `,
    [userId, postId]
  );
  return res.status(201).json({ message: "likeCreated" });
});

const server = http.createServer(app);
const PORT = process.env.PORT;

const start = async () => {
  server.listen(PORT, () => console.log(`server is listening on ${PORT}`));
};

start();
