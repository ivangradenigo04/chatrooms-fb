import { initializeApp } from "firebase/app";
import * as db from "firebase/database";

initializeApp({
  apiKey: "AIzaSyBzo_W03MosXyw_rzLGuBi3O18bbuq_OFw",
  authDomain: "apx-level-2.firebaseapp.com",
  databaseURL: "https://apx-level-2-default-rtdb.firebaseio.com",
  projectId: "apx-level-2",
  storageBucket: "apx-level-2.appspot.com",
  messagingSenderId: "645471210072",
  appId: "1:645471210072:web:82f8bfb5753e350e3ad82d",
});

const rtdb = db.getDatabase();

export { rtdb, db };
