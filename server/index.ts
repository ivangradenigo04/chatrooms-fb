import * as express from "express";
import * as cors from "cors";
import { fs, rtdb } from "./db";
import * as nanoId from "nano-id";

const port = process.env.PORT || 3000;
const app = express();

console.log(process.env.NODE_ENV);

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

const usersColl = fs.collection("users");
const chatroomsColl = fs.collection("chatrooms");

app.post("/messages/:chatroomId", (req, res) => {
  const { chatroomId } = req.params;
  const messagesRef = rtdb.ref("chatrooms/" + chatroomId + "/messages");

  messagesRef.push(req.body, () => {
    res.json("Se ha publicado un mensaje");
  });
});

app.post("/signup", (req, res) => {
  const { fullName } = req.body;
  const { email } = req.body;

  usersColl
    .where("email", "==", email)
    .get()
    .then((result) => {
      if (result.empty) {
        usersColl
          .add({
            fullName,
            email,
          })
          .then((newUserRef) => {
            res.json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        res.status(400).json({
          message: "User has already been created",
        });
      }
    });
});

app.post("/signin", (req, res) => {
  const { email } = req.body;

  usersColl
    .where("email", "==", email)
    .get()
    .then((result) => {
      if (result.empty) {
        res.status(404).json({
          message: "User was not found",
        });
      } else {
        res.json({
          userId: result.docs[0].id,
        });
      }
    });
});

app.post("/chatrooms", (req, res) => {
  const { userId } = req.body;

  usersColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        const chatroomRef = rtdb.ref("chatrooms/" + nanoId(15));
        chatroomRef
          .set({
            messages: [],
            owner: userId,
          })
          .then(() => {
            const nanoId = chatroomRef.key;
            const mathRandom = 1000 + Math.floor(Math.random() * 999);
            const chatroomId = mathRandom.toString();
            chatroomsColl
              .doc(chatroomId)
              .set({
                rtdbChatroomId: nanoId,
              })
              .then(() => {
                res.json({
                  chatroomId,
                });
              });
          });
      } else {
        res.status(401).json({
          message: "User does not exist",
        });
      }
    });
});

app.get("/chatrooms/:chatroomId", (req, res) => {
  const { userId } = req.query as any;
  const { chatroomId } = req.params;

  usersColl
    .doc(userId.toString())
    .get()
    .then((doc) => {
      if (doc.exists) {
        chatroomsColl
          .doc(chatroomId.toString())
          .get()
          .then((doc) => {
            const data = doc.data();
            res.json(data);
          });
      } else {
        res.status(401).json({
          message: "User does not exist",
        });
      }
    });
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
