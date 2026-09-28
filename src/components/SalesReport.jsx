import React from "react";

function SalesReport({ report }) {
  if (!report) {
    return null;
  }

  console.log("Report detais", report)
  return (
    <div className="sales-report">

      <div className="report-header">
        <h1>Sales Opportunity Report</h1>

        <div className="confidence">
          Confidence:{" "}
          <strong>
            {report.confidence || "N/A"}
          </strong>
        </div>
      </div>

      <section className="report-section decision">
        <h2>Final Decision</h2>

        <p>
          {report.final_decision}
        </p>
      </section>

      <section className="report-section">
        <h2>Reasoning</h2>

        <p>
          {report.final_reasoning}
        </p>
      </section>

      <section className="report-section">

        <h2>Strengths</h2>

        {report.strengths?.length > 0 ? (
          <ul>
            {report.strengths.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No strengths identified.</p>
        )}

      </section>

      <section className="report-section">

        <h2>Risks</h2>

        {report.risks?.length > 0 ? (
          <ul>
            {report.risks.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No risks identified.</p>
        )}

      </section>

      <section className="report-section">

        <h2>Evidence</h2>

        {report.evidence?.length > 0 ? (
          <ul>
            {report.evidence.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ul>
        ) : (
          <p>No evidence available.</p>
        )}

      </section>

      <section className="report-section">

        <h2>Recommended Next Steps</h2>

        {report.recommended_next_steps?.length > 0 ? (
          <ol>
            {report.recommended_next_steps.map(
              (item, index) => (
                <li key={index}>
                  {item}
                </li>
              )
            )}
          </ol>
        ) : (
          <p>No next steps available.</p>
        )}

      </section>

    </div>
  );
}

export default SalesReport;