import { rtdb, db } from "./rtdb";
import { map } from "lodash";

const API_BASE_URL = "http://localhost:3000";

const state = {
  data: {
    fullName: "",
    email: "",
    userId: "",
    chatroomId: "",
    rtdbChatroomId: "",
    messages: [],
  },
  listeners: [],

  init() {},
  listenMessages() {
    const cs = this.getState();
    const { rtdbChatroomId } = cs;
    const chatroomsRef = db.ref(rtdb, "/chatrooms/" + rtdbChatroomId);

    db.onValue(chatroomsRef, (snapshot) => {
      const generalFromServer = snapshot.val();
      if (generalFromServer.messages) {
        const messagesList = map(generalFromServer.messages);
        cs.messages = messagesList;
        this.setState(cs);
      }
    });
  },

  getState() {
    return this.data;
  },

  subscribe(callback: (state: any) => any) {
    this.listeners.push(callback);
  },

  setState(newState) {
    this.data = newState;
    for (const callback of this.listeners) {
      callback();
    }
    console.log("El estado cambió", this.data);
  },

  setNameAndEmail(fullName: string, email: string) {
    const currentState = this.getState();
    currentState.fullName = fullName;
    currentState.email = email;
    this.setState(currentState);
  },

  setChatroomId(id: string) {
    const cs = this.getState();
    cs.chatroomId = id;
    this.setState(cs);
  },

  signUp(fullName: string, email: string) {
    fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
      });
  },

  signIn(cb) {
    const cs = this.getState();
    fetch(API_BASE_URL + "/signin", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: cs.email,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.userId = data.userId;
        this.setState(cs);
        cb();
      });
  },

  askNewRoom(cb) {
    const cs = this.getState();
    const { userId } = cs;
    if (userId) {
      fetch(API_BASE_URL + "/chatrooms", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          cs.chatroomId = data.chatroomId;
          this.setState(cs);
          cb();
        });
    } else {
      console.error("There is not userId");
    }
  },

  accessToRoom() {
    const cs = this.getState();
    const { userId } = cs;
    const { chatroomId } = cs;
    fetch(API_BASE_URL + "/chatrooms/" + chatroomId + "?userId=" + userId, {
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        cs.rtdbChatroomId = data.rtdbChatroomId;
        this.setState(cs);
        this.listenMessages();
      });
  },

  pushMessage(message: string) {
    const cs = this.getState();
    const { rtdbChatroomId } = cs;
    fetch(API_BASE_URL + "/messages/" + rtdbChatroomId, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: this.data.fullName,
        message,
      }),
    });
  },
};

export { state };
