const Employee = require("../models/employee");

// Create a new employee
exports.createEmployee = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    // Check if an employee with the same email already exists
    const existingEmployee = await Employee.findOne({ email: email });
    if (existingEmployee) {
      return res.status(400).json({
        status: false,
        message: `Employee with this email ${email} already exists`,
      });
    }
    const employee = await Employee.create({
      name: name,
      email: email,
      role: role || "employee", // Default role is 'employee'
      createdBy: req.user._id, // Associate with the authenticated user
    });
    res.status(201).json({
      status: true,
      message: "Employee created successfully",
      data: employee,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
  }
};

exports.fetchEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json({
      status: true,
      message: "Employees fetched successfully",
      data: employees,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json({
      status: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted successfully", data: employee });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteMultipleEmployees = async (req, res) => {
  console.log("Deleting multiple employees", req.body);
  const { ids } = req.body; // Expecting an array of employee IDs to delete
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const result = await Employee.deleteMany({ _id: { $in: ids } });
    res.json({
      status: true,
      message: `${result.deletedCount} employees deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
