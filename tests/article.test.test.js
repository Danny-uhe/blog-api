import request from "supertest";
import app from "../src/app.js";

describe("GET /api/articles", () => {
    it("should return list of articles", async () => {
        const res = await request(app).get("/api/articles");
        expect(res.statusCode).toBe(200);
    });
});