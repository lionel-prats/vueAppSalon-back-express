import express from "express"
import { createService, getServices, getServiceById, updateService, deleteService } from "../controllers/servicesController.js"

const router = express.Router()

router.post("/", createService) // POST a http://localhost:4000/api/services
router.get("/", getServices) // GET a http://localhost:4000/api/services
router.get("/:id", getServiceById) // GET a http://localhost:4000/api/services/:id
router.put("/:id", updateService) // PUT a http://localhost:4000/api/services/:id
router.delete("/:id", deleteService) // DELETE a http://localhost:4000/api/services/:id

export default router