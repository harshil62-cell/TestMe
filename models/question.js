const mongoose=require('mongoose');

const questionSchema = new mongoose.Schema({
  question:         { type: String, required: true },
  options:          { type: [String], required: true, validate: v => v.length === 4 },
  correctAnswer:    { type: String, required: true },
  userSelected:     { type: String }, // Optional: filled after submission
  isCorrect:        { type: Boolean } // Computed after answering
},{
    timestamps:true,
});

module.exports=mongoose.model("Question",questionSchema);