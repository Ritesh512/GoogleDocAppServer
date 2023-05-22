// const { Socket } = require('socket.io');
const mongoose = require('mongoose');
const Document = require("./document");
require("dotenv").config();

const username = process.env.USER;
const password = process.env.PASSWORD;
const baseurl = process.env.URL;

console.log(username, password);

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.40tfumc.mongodb.net/googleDoc`);

const io = require('socket.io')(3001,{
    cors:{
        origin:`${baseurl}`,
        method:["GET","POST"]
    }
});


io.on("connection", socket => {
    socket.on("get-document", async documentId => {
      const document = await findOrCreateDocument(documentId)
      socket.join(documentId)
      socket.emit("load-document", document.data)
  
      socket.on("send-changes", delta => {
        socket.broadcast.to(documentId).emit("receive-changes", delta)
      })
  
      socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
      })
    })
});


const defaultValue="";

async function findOrCreateDocument(id) {
    if (id == null) return
  
    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
  }