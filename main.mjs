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

// <認証コード, userID>のマップ
const tokenMap = new Map()

// userIDをもらって、認証コードをNeos内に送る
app.get("/userId", (req, res) => {
    const userId = req.query.userId
    // tokenを作る
    const token = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")

    tokenMap.set(token, userId)

    // Neosに送る
    sendMessage(userId, `認証コード: ${token}`)

    // フロントにリクエストの成功を返す
    res.json({
        success: true,
        message: "認証コードを入力してください"
    })
})


// 認証コードをもらって、Firebase認証用のtokenを作って返す
app.get("/token", async (req, res) => {
    const token = req.query.token
    const userId = tokenMap.get(token)
    if (userId) {
        // login
        const token = await admin.auth().createCustomToken(userId)
        res.json({
            success: true,
            token: token
        })
    } else {
        res.json({
            success: false,
            message: "認証コードが間違っています"
        })
    }
})

// Neos Client
const neos = new Neos({
    username: "twitter",
    password: process.env.NEOS_PASSWORD,
})

const sendMessage = (target, message) => {
    neos.sendTextMessage({ targetUserId: target, message })
}


// Firebase Adminの初期化
const firebaseConfig = JSON.parse((await fs.readFile("admin.json")).toString())

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig)
});