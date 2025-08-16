const express = require("express");
const router = express.Router();
const {
  createEmployee,
  fetchEmployees,
  updateEmployee,
  deleteEmployee,
  deleteMultipleEmployees,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");
router.use(protect); // Protect all employee routes
router.post("/", createEmployee);
router.get("/", fetchEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.post("/deleteAllEmployees", deleteMultipleEmployees);
module.exports = router;
