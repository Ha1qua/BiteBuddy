import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./Faqs.css";

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
      console.log("Answer received from server"); // Log the received answer
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
    return <div className="faqs-loading">Loading FAQs...</div>;
  }

  return (
    <div className="faqs-container">
      <h2 className="faqs-heading">Frequently Asked Questions</h2>
      <ul className="faqs-list">
        {questions.map((question, index) => (
          <li
            key={index}
            onClick={() => handleQuestionClick(question)}
            className="faqs-question"
          >
            <div className="faqs-question-text">{question}</div>
            {/* Display the selected question and its answer together */}
            {selectedQuestion === question && (
              <div className="faqs-answer">
                {answer ? (
                  <div>
                    <p className="faqs-answer-text">{answer}</p>
                  </div>
                ) : (
                  <div className="faqs-answer-loading">Loading answer...</div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Faqs;
