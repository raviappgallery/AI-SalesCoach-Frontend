const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

console.log("APi Base URl", API_BASE_URL)
export async function startInquiry(inquiry) {
  const response = await fetch(`${API_BASE_URL}/inquiry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inquiry,
    }),
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to start inquiry.");
  }

  return data;
}

export async function answerInquiry(sessionId, answer) {
  const response = await fetch(
    `${API_BASE_URL}/inquiry/${sessionId}/answer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Failed to submit answer.");
  }

  return data;
}