const listeningSchema = new mongoose.Schema({
  audioUrl: String,
  tasks: [
    {
      type: { type: String, required: true }, // multiple-choice, fill-gaps, short-answer

      question: String,
      options: [String],
      correctAnswer: String,
      content: mongoose.Schema.Types.Mixed
    }
  ]
});

const ListeningModel = mongoose.model("Listening", listeningSchema);

export default ListeningModel;