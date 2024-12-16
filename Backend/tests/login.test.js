const { login } = require("../controllers/loginController");
const db = require("../services/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../services/db", () => ({ query: jest.fn() }));
jest.mock("bcrypt", () => ({ compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));

describe("login", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 404 if user is not found", async () => {
    db.query.mockResolvedValue([[]]);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should return 401 if password does not match", async () => {
    db.query.mockResolvedValue([
      [{ id: 1, email: "test@example.com", password: "hashedPassword" }],
    ]);
    bcrypt.compare.mockResolvedValue(false);
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
  });

  it("should return a token and restaurant ID on successful login", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword",
    };
    db.query.mockResolvedValue([[mockUser]]);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");

    await login(req, res);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful!",
      token: "mockToken",
      restaurantId: mockUser.id,
    });
  });

  it("should return 500 if there is a server error", async () => {
    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    db.query.mockRejectedValue(new Error("Database error"));
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Login failed. Please try again.",
    });

    // Restore console.error after the test
    consoleErrorSpy.mockRestore();
  });
});
