const Mongose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { Schema, model } = Mongose;

const todoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      trim: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
      // validate: {
      //   validator: (v) => /^[a-zA-Z0-9 ]+$/.test(v),
      //   message: "Title can only contain alphanumeric characters and spaces",
      // },

      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [7, "Title must be less than 7 characters"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
todoSchema.plugin(uniqueValidator, {
  message: 'Name "{VALUE}" already exists.',
});
module.exports = model("Todo", todoSchema);
