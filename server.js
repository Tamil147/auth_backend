import app from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './Config/db.js'

dotenv.config()
connectDB()


app.listen(process.env.PORT || 5000, () => {
    console.log("server is connencted!..");
})




