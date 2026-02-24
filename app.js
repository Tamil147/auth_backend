import express from 'express'
import route from './Routes/userRoute.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth", route)



export default app
