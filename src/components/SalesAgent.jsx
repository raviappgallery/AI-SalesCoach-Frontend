import React, { useState } from "react";

import {
  startInquiry,
  answerInquiry,
} from "../Services/salesApi";

import QuestionCard from "./QuestionCard";
import SalesReport from "./SalesReport";

function SalesAgent() {

  const [inquiry, setInquiry] = useState("");


  const [sessionId, setSessionId] =
    useState(null);

  const [details, setDetails] =
    useState(null);

  const [status, setStatus] =
    useState("idle");

  const [round, setRound] =
    useState(0);

  const [maxRounds, setMaxRounds] =
    useState(3);

  const [questions, setQuestions] =
    useState([]);

  const [facts, setFacts] =
    useState([]);

  const [opinions, setOpinions] =
    useState([]);

  const [unverifiedClaims, setUnverifiedClaims] =
    useState([]);

  const [missingInformation, setMissingInformation] =
    useState([]);

  const [report, setReport] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ---------------------------------------------------------
  // Start inquiry
  // ---------------------------------------------------------

  const handleStartInquiry = async (event) => {

    event.preventDefault();

    if (!inquiry.trim()) {
      setError("Please enter a sales opportunity.");
      return;
    }

    try {

      setLoading(true);
      setError("");
      setReport(null);


      const data =
        await startInquiry(
          inquiry.trim()
        );

    setDetails(data)
      setSessionId(
        data.session_id
      );

      setStatus(
        data.currentstatus
      );

      setRound(
        data.round
      );

      setMaxRounds(
        data.max_rounds
      );

      setQuestions(
        data.questions || []
      );

      setFacts(
        data.facts || []
      );

      setOpinions(
        data.opinions || []
      );

      setUnverifiedClaims(
        data.unverified_claims || []
      );

      setMissingInformation(
        data.missing_information || []
      );

      if (data.round == 3) {
        setReport(data.report);
      }

    } catch (err) {

      setError(
        err.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  // ---------------------------------------------------------
  // Submit answer
  // ---------------------------------------------------------

  const handleAnswer = async (answer) => {

    if (!sessionId) {
      setError("Session not found.");
      return;
    }

    try {

      setLoading(true);
      setError("");

      const data =
        await answerInquiry(
          sessionId,
          answer
        );

    setDetails(data)
      setStatus(
        data.currentstatus
      );

      setRound(
        data.round
      );

      setMaxRounds(
        data.max_rounds
      );

      setQuestions(
        data.questions || []
      );

      setFacts(
        data.facts || []
      );

      setOpinions(
        data.opinions || []
      );

      setUnverifiedClaims(
        data.unverified_claims || []
      );

      setMissingInformation(
        data.missing_information || []
      );

      if (data.currentstatus === "completed") {
        setReport(
          data.report
        );

        setQuestions([]);

      }

    } catch (err) {

      setError(
        err.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  // ---------------------------------------------------------
  // Reset agent
  // ---------------------------------------------------------

  const handleReset = () => {

    setInquiry("");
    setSessionId(null);
    setStatus("idle");
    setRound(0);
    setQuestions([]);
    setFacts([]);
    setOpinions([]);
    setUnverifiedClaims([]);
    setMissingInformation([]);
    setReport(null);
    setError("");

  };

  return (
    <div className="sales-agent">

      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <div className="agent-header">

        <div>
          <h1>AI Sales Coach</h1>

          <p>
            Analyze your sales opportunity
            with an AI sales agent.
          </p>
        </div>

        {sessionId && (
          <button
            className="reset-button"
            onClick={handleReset}
          >
            New Opportunity
          </button>
        )}

      </div>

      {/* -------------------------------------------------- */}
      {/* Error */}
      {/* -------------------------------------------------- */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Initial inquiry */}
      {/* -------------------------------------------------- */}

      {!sessionId && (
        <form
          className="inquiry-form"
          onSubmit={handleStartInquiry}
        >

          <label>
            Sales Opportunity
          </label>

          <textarea
            value={inquiry}
            onChange={(event) =>
              setInquiry(
                event.target.value
              )
            }
            placeholder="Describe the customer's project, requirements, budget, timeline, decision maker, or any other information you know..."
            rows={8}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={
              loading ||
              !inquiry.trim()
            }
          >
            {loading
              ? "Analyzing..."
              : "Start Sales Analysis"}
          </button>

        </form>
      )}

      {/* -------------------------------------------------- */}
      {/* Agent status */}
      {/* -------------------------------------------------- */}

      {sessionId && (
        <div className="agent-status">

          <div>
            <strong>
              Round {round}
            </strong>

            {" "}of{" "}

            <strong>
              {maxRounds}
            </strong>
          </div>

          <div className={`status ${status}`}>
            {status === "questions"
              ? "Gathering Information"
              : "Analysis Completed"}
          </div>

        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Analysis information */}
      {/* -------------------------------------------------- */}

      {sessionId &&
        status === "questions" && (

          <div className="analysis-grid">

            <div className="analysis-card">

              <h3>Facts</h3>

              {facts.length > 0 ? (
                <ul>
                  {facts.map(
                    (fact, index) => (
                      <li key={index}>
                        {fact}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No facts identified yet.</p>
              )}

            </div>

            <div className="analysis-card">

              <h3>Opinions</h3>

              {opinions.length > 0 ? (
                <ul>
                  {opinions.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No opinions identified.</p>
              )}

            </div>

            <div className="analysis-card">

              <h3>Unverified Claims</h3>

              {unverifiedClaims.length > 0 ? (
                <ul>
                  {unverifiedClaims.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No unverified claims.</p>
              )}

            </div>

            <div className="analysis-card">

              <h3>Missing Information</h3>

              {missingInformation.length > 0 ? (
                <ul>
                  {missingInformation.map(
                    (item, index) => (
                      <li key={index}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No missing information.</p>
              )}

            </div>

          </div>
        )}

      {/* -------------------------------------------------- */}
      {/* Questions */}
      {/* -------------------------------------------------- */}

      {sessionId &&
        status === "questions" &&
        questions.length > 0 && (

          <QuestionCard
            questions={questions}
            onSubmit={handleAnswer}
            loading={loading}
          />

        )}

      {/* -------------------------------------------------- */}
      {/* Final report */}
      {/* -------------------------------------------------- */}

      {
        details && (
          <SalesReport
            report={details?.report}
          />

        )}

    </div>
  );
}

export default SalesAgent;