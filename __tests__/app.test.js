const { app } = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: Responds with an array of topic objects with slugs and descriptions", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;
        expect(topics).toEqual([
          {
            description: "The man, the Mitch, the legend",
            slug: "mitch",
          },
          {
            description: "Not dogs",
            slug: "cats",
          },
          {
            description: "what books are made of",
            slug: "paper",
          },
        ]);
      });
  });
  test("400: responds with correct error code and message when invalid method is used", () => {
    return request(app)
      .post("/api/topics")
      .expect(405)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid method used");
      })
      .then(() => {
        return request(app)
          .patch("/api/topics")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid method used");
          });
      })
      .then(() => {
        return request(app)
          .post("/api/topics")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid method used");
          });
      })
      .then(() => {
        return request(app)
          .put("/api/topics")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid method used");
          });
      })
      .then(() => {
        return request(app)
          .delete("/api/topics")
          .expect(405)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid method used");
          });
      });
  });
});

describe("generic invalid URL error", () => {
  test("returns correct error and message when invalid url path used", () => {
    return request(app)
      .get("/api/sdsdsd")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid url");
      })
      .then(() => {
        return request(app)
          .post("/api/sdsdsd")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid url");
          });
      })
      .then(() => {
        return request(app)
          .patch("/api/sdsdsd")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid url");
          });
      })
      .then(() => {
        return request(app)
          .put("/api/sdsdsd")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid url");
          });
      })
      .then(() => {
        return request(app)
          .delete("/api/sdsdsd")
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe("Invalid url");
          });
      });
  });
});
