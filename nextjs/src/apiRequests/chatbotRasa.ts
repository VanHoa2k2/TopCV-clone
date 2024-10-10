const chatbotApiRequest = async (message: string) => {
  const response = await fetch("http://localhost:5005/webhooks/rest/webhook", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sender: "user" }),
  });
  const data = await response.json();
  return data;
};

export default chatbotApiRequest;
