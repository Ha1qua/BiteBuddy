const socketIo = require("socket.io");

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true, // Allow credentials if needed
    },
  });

  // Listen for client connection
  io.on("connection", (socket) => {
    console.log("New client connected");

    // Emit the list of questions when the client connects
    const questions = [
      "What is the return policy?",
      "How can I track my order?",
      "What payment methods are accepted?",
      "How do I cancel my order?",
      "How do I contact customer support?",
    ];

    // Send questions to client
    socket.emit("receiveQuestions", questions);

    // Listen for request for a specific answer
    socket.on("getAnswer", (question) => {
      const answers = {
        "What is the return policy?": "Our return policy lasts 30 days...",
        "How can I track my order?":
          "You can track your order through our website...",
        "What payment methods are accepted?":
          "We accept credit cards, PayPal, and more.",
        "How do I cancel my order?":
          "You can cancel your order from your account settings.",
        "How do I contact customer support?":
          "You can contact customer support via email or chat.",
      };

      const answer =
        answers[question] || "Sorry, we don't have an answer for that.";
      // Send the answer back to the client
      socket.emit("receiveAnswer", answer);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

module.exports = initSocket;
