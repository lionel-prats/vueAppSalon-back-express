import express from "express"
import { createService, getServices } from "../controllers/servicesController.js"

const router = express.Router()

router.post("/", createService) // POST a http://localhost:4000/api/services
router.get("/", getServices) // GET a http://localhost:4000/api/services

export default router