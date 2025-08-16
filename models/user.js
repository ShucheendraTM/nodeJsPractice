const Mongose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema, model } = Mongose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "UserName is required"],
      unique: [true, "Username must be unique"],
      trim: true,
      minlength: [3, "minimum 3 characters required"],
      lowercase: [true, " Username must be lowercase"],
      // match: [/^[a-z0-9]+$/, "Username must be alphanumeric"],
    },
    password: {
      type: String,
      required: true,
      select: false, // Do not return password by default
      trim: true,
      minlength: [6, "minimum 6 characters required"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// Compare password method
// userSchema.methods.matchPassword = function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

module.exports = model("User", userSchema);
