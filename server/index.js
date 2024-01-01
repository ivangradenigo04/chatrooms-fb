"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var db_1 = require("./db");
var nanoId = require("nano-id");
var port = process.env.PORT || 3000;
var app = express();
console.log(process.env.NODE_ENV);
app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
var usersColl = db_1.fs.collection("users");
var chatroomsColl = db_1.fs.collection("chatrooms");
app.post("/messages/:chatroomId", function (req, res) {
    var chatroomId = req.params.chatroomId;
    var messagesRef = db_1.rtdb.ref("chatrooms/" + chatroomId + "/messages");
    messagesRef.push(req.body, function () {
        res.json("Se ha publicado un mensaje");
    });
});
app.post("/signup", function (req, res) {
    var fullName = req.body.fullName;
    var email = req.body.email;
    usersColl
        .where("email", "==", email)
        .get()
        .then(function (result) {
        if (result.empty) {
            usersColl
                .add({
                fullName: fullName,
                email: email,
            })
                .then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    new: true,
                });
            });
        }
        else {
            res.status(400).json({
                message: "User has already been created",
            });
        }
    });
});
app.post("/signin", function (req, res) {
    var email = req.body.email;
    usersColl
        .where("email", "==", email)
        .get()
        .then(function (result) {
        if (result.empty) {
            res.status(404).json({
                message: "User was not found",
            });
        }
        else {
            res.json({
                userId: result.docs[0].id,
            });
        }
    });
});
app.post("/chatrooms", function (req, res) {
    var userId = req.body.userId;
    usersColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            var chatroomRef_1 = db_1.rtdb.ref("chatrooms/" + nanoId(15));
            chatroomRef_1
                .set({
                messages: [],
                owner: userId,
            })
                .then(function () {
                var nanoId = chatroomRef_1.key;
                var mathRandom = 1000 + Math.floor(Math.random() * 999);
                var chatroomId = mathRandom.toString();
                chatroomsColl
                    .doc(chatroomId)
                    .set({
                    rtdbChatroomId: nanoId,
                })
                    .then(function () {
                    res.json({
                        chatroomId: chatroomId,
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: "User does not exist",
            });
        }
    });
});
app.get("/chatrooms/:chatroomId", function (req, res) {
    var userId = req.query.userId;
    var chatroomId = req.params.chatroomId;
    usersColl
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        if (doc.exists) {
            chatroomsColl
                .doc(chatroomId.toString())
                .get()
                .then(function (doc) {
                var data = doc.data();
                res.json(data);
            });
        }
        else {
            res.status(401).json({
                message: "User does not exist",
            });
        }
    });
});
app.get("*", function (req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
