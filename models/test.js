const mongoose=require('mongoose');
const QuestionSchema=require('./question');

const TestSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic:      { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  questions:  { type: [QuestionSchema], validate: v => v.length === 5 },
  score:      { type: Number, min: 0, max: 5 },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Test', TestSchema);