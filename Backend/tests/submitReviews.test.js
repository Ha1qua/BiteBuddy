const request = require("supertest");
const app = require("../index"); // Assuming you have an Express app
const { addReviews } = require("../models/reviewModel");

jest.mock("../models/reviewModel", () => ({
  addReviews: jest.fn(),
}));

describe("POST /api/food-reviews", () => {
  it("should return 400 if reviews data is invalid (empty reviews)", async () => {
    const response = await request(app).post("/api/food-reviews").send({
      reviews: [],
      restaurantId: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid reviews data.");
  });

  it("should return 400 if restaurantId is missing", async () => {
    const response = await request(app)
      .post("/api/food-reviews")
      .send({
        reviews: ["Great food!", "Nice ambiance"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Restaurant ID is required.");
  });

  it("should return 201 and success message if reviews are valid", async () => {
    addReviews.mockResolvedValueOnce({}); // Mock successful insertion

    const response = await request(app)
      .post("/api/food-reviews")
      .send({
        reviews: ["Great food!", "Nice ambiance"],
        restaurantId: "123",
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Reviews added successfully!");
  });

  it("should return 500 if there is an error while adding reviews", async () => {
    addReviews.mockRejectedValueOnce(new Error("Database error"));

    const response = await request(app)
      .post("/api/food-reviews")
      .send({
        reviews: ["Great food!", "Nice ambiance"],
        restaurantId: "123",
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Failed to add reviews.");
  });
});
