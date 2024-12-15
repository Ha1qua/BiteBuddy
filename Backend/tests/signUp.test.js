const { signUp } = require("../controllers/signupController"); // Correct path to your signupController.js
const User = require("../models/User"); // Path to your User model
const pool = require("../services/db"); // Correct path to your db.js connection pool

// Mock the User model and database connection
jest.mock("../models/User");
jest.mock("../services/db");

describe("signUp function", () => {
  let mockRequest, mockResponse;

  beforeEach(() => {
    mockRequest = {
      body: {
        email: "test@example.com",
        password: "password123",
        restaurantName: "Test Restaurant",
        ownerName: "Test Owner",
        address: "Test Address",
        phoneNumber: "1234567890",
      },
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  it("should register a new restaurant", async () => {
    // Mock User methods
    User.prototype.save = jest.fn().mockResolvedValue();
    User.prototype.hashPassword = jest.fn().mockResolvedValue(); // Mock password hashing

    // Mock database pool connection and query
    const mockQuery = jest.fn().mockResolvedValue();
    pool.getConnection = jest.fn().mockResolvedValue({
      query: mockQuery,
      release: jest.fn(),
    });

    // Run the signUp function
    await signUp(mockRequest, mockResponse);

    // Assert that the response status is 201 and correct message is returned
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Restaurant registered successfully!",
    });

    // Ensure database query was called
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["User Signup Test", true]
    );
  });

  it("should return an error if registration fails", async () => {
    // Mock a failure during user save or password hashing
    User.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Database Error"));
    User.prototype.hashPassword = jest.fn().mockResolvedValue(); // Mock password hashing

    // Mock database pool connection for error case
    const mockQuery = jest.fn().mockResolvedValue();
    pool.getConnection = jest.fn().mockResolvedValue({
      query: mockQuery,
      release: jest.fn(),
    });

    // Run the signUp function
    await signUp(mockRequest, mockResponse);

    // Assert that the response status is 500 and correct error message is returned
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Registration failed. Email may already be registered.",
    });

    // Ensure that the database error is logged in the connection_tests table
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO connection_tests (test_name, result) VALUES (?, ?)",
      ["User Signup Test", false]
    );
  });
});
