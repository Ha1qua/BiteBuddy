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
    console.log("message received from client");

    // Emit the list of questions when the client connects
    const questions = [
      "How do I place an order?",
      "What are the delivery charges?",
      "What payment methods do you accept?",
      "Can I cancel my order after placing it?",
      "How long does delivery take?",
      "Do you offer discounts or promo codes?",
      "How do I track my order?",
      "What is your return or refund policy for incorrect or unsatisfactory orders?",
      "Do you cater to special dietary requirements (e.g., vegetarian, gluten-free)?",
      "How do I contact customer support for help with my order?",
    ];

    // Send questions to client
    socket.emit("receiveQuestions", questions);

    // Listen for request for a specific answer
    socket.on("getAnswer", (question) => {
      const answers = {
        "How do I place an order?":
          "You can place an order by selecting your desired items, adding them to your cart, and proceeding to checkout.",
        "What are the delivery charges?":
          "Delivery charges vary depending on your location and order size. You can view the charges during checkout.",
        "What payment methods do you accept?":
          "We accept credit cards, debit cards, PayPal, and cash on delivery.",
        "Can I cancel my order after placing it?":
          "You can cancel your order within 10 minutes of placing it by visiting your order history.",
        "How long does delivery take?":
          "Delivery typically takes between 30 minutes to 1 hour, depending on your location.",
        "Do you offer discounts or promo codes?":
          "Yes, we frequently offer discounts and promo codes. Check our website or app for the latest offers.",
        "How do I track my order?":
          "You can track your order in real-time through the 'Track Order' section on our website or app.",
        "What is your return or refund policy for incorrect or unsatisfactory orders?":
          "If you receive an incorrect or unsatisfactory order, please contact customer support within 24 hours for a resolution.",
        "Do you cater to special dietary requirements (e.g., vegetarian, gluten-free)?":
          "Yes, we have options for vegetarian, vegan, and gluten-free meals. Use the filters on our menu to find suitable items.",
        "How do I contact customer support for help with my order?":
          "You can contact our customer support team via email, live chat, or phone. Details are available on the 'Contact Us' page.",
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
