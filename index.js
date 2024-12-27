import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
import http from "http"
import { v2 as cloudinary } from "cloudinary"

import connectMongoDB from "./src/config/db.js"

import authRoutes from "./src/routes/auth.routes.js"
import userRoutes from "./src/routes/user.routes.js"
import postRoutes from "./src/routes/post.routes.js"
import notificationRoutes from "./src/routes/notification.routes.js"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = process.env.PORT || 5000
const __dirname = path.resolve()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)

const server = http.createServer(app)

connectMongoDB().then(() => {
  console.log("Connected to MongoDB")
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}).catch((error) => {
  console.log(`Error connection to mongoDB: ${error.message}`)
  process.exit(1)
})