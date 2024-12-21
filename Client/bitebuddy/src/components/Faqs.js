import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Faqs = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null); // To store the selected question
  const [answer, setAnswer] = useState(""); // To store the answer for the selected question
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:5000");
    setSocket(socketInstance);

    // Listen for the list of questions from the server
    socketInstance.on("receiveQuestions", (data) => {
      setQuestions(data);
      setLoading(false);
    });

    // Listen for the answer to a question from the server
    socketInstance.on("receiveAnswer", (data) => {
      setAnswer(data);
    });

    // Cleanup the socket connection when the component unmounts
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Emit question to the server when it's clicked
  const handleQuestionClick = (question) => {
    setSelectedQuestion(question); // Set the selected question
    setAnswer(""); // Reset the previous answer
    if (socket) {
      socket.emit("getAnswer", question); // Emit the question to the server
    }
  };

  if (loading) {
    return <div>Loading FAQs...</div>;
  }

  return (
    <div>
      <h2>FAQs</h2>
      <ul>
        {questions.map((question, index) => (
          <li
            key={index}
            onClick={() => handleQuestionClick(question)}
            style={{ cursor: "pointer", marginBottom: "10px" }}
          >
            {question}
          </li>
        ))}
      </ul>

      {/* Display the selected question and its answer */}
      {selectedQuestion && (
        <div>
          <h3>Question: {selectedQuestion}</h3>
          {answer ? (
            <div>
              <h4>Answer:</h4>
              <p>{answer}</p>
            </div>
          ) : (
            <div>Loading answer...</div> // Show loading while the answer is being fetched
          )}
        </div>
      )}
    </div>
  );
};

export default Faqs;
