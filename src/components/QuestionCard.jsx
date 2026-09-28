import React, { useState } from "react";

function QuestionCard({
  questions,
  onSubmit,
  loading,
}) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!answer.trim() || loading) {
      return;
    }

    onSubmit(answer.trim());
    setAnswer("");
  };

  return (
    <div className="question-card">

      <div className="question-header">
        <h2>Additional Information</h2>

        <span>
          {questions.length} question
          {questions.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="questions-list">

        {questions.map((question, index) => (
          <div
            className="question-item"
            key={index}
          >
            <div className="question-number">
              {index + 1}
            </div>

            <p>{question}</p>
          </div>
        ))}

      </div>

      <form onSubmit={handleSubmit}>

        <textarea
          value={answer}
          onChange={(event) =>
            setAnswer(event.target.value)
          }
          placeholder="Type your answer here..."
          rows={6}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={!answer.trim() || loading}
        >
          {loading
            ? "Analyzing..."
            : "Submit Answer"}
        </button>

      </form>

    </div>
  );
}

export default QuestionCard;