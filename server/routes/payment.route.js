import express from "express"
import { protect } from "../middleware/userAUTH.js"
import { createOrder, verifyPayment } from "../controllers/payment.controller.js"

const paymentRouter = express.Router()

paymentRouter.post("/order" , protect , createOrder )
paymentRouter.post("/verify" , protect , verifyPayment )


export default paymentRouter