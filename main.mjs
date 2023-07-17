// firebase auth
import admin from 'firebase-admin';
import fs from "fs/promises"

import express from "express"
import { Neos } from 'neos-client';

const app = express()
app.use(express.static("static"))
app.listen(3030, () => {
    console.log("start")
})

const tokenMap = new Map()

app.get("/userId", (req, res) => {
    // generate OTP and save tokenMap
    const userId = req.query.userId
    // token 6 digit number
    const token = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
    tokenMap.set(token, userId)
    sendMessage(userId, `認証コード: ${token}`)
    res.json({
        success:true,
        message:"認証コードを入力してください"
    })
})

app.get("/token", (req, res) => {
    const token = req.query.token
    const userId = tokenMap.get(token)
    if (userId) {
        // login
        admin.auth().createCustomToken(userId).then((customToken) => {
            res.json({
                success:true,
                token:customToken
            })
        })
    } else {
        res.json({
            success:false,
            message:"認証コードが間違っています"
        })
    }
})

const neos = new Neos({
    username: "twitter",
    password: process.env.NEOS_PASSWORD || ".44Ump-45",
})

const sendMessage = (target, message) => {
    neos.sendTextMessage({targetUserId: target, message})
}


const firebaseConfig = JSON.parse((await fs.readFile("admin.json")).toString())


admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});

const token = await admin.auth().createCustomToken("U-kokoa0429")

console.log(token)