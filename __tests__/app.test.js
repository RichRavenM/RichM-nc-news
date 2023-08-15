const { app } = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require(`${__dirname}/../endpoints.json`);

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
});

describe("generic invalid URL error", () => {
  test("returns correct error and message when invalid url path used", () => {
    return request(app)
      .get("/api/sdsdsd")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid url");
      });
  });
});

describe("/api", () => {
  test("GET: 200: responds with object containing all the api endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const { endpoints } = response.body;
        expect(endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("200: responds with a single article and contains all the relevant information for it", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toEqual({
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            article_id: 3,
            votes: 0,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("400: Responds with appropriate error when invalid id is used", () => {
      return request(app)
        .get("/api/articles/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: Responds with appropriate error when non-existent id is used", () => {
      return request(app)
        .get("/api/articles/1231212")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article id does not exist");
        });
    });
  });
  describe("PATCH", () => {
    test("200: updates votes for the given article by article id and responds with the updated article", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toEqual({
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            article_id: 3,
            votes: 1,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    test("400: responds with appropriate error message when article id is invalid", () => {
      return request(app)
        .patch("/api/articles/tree")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when article id does not exist", () => {
      return request(app)
        .patch("/api/articles/1231212")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article id does not exist");
        });
    });
    test("400: responds with appropriate error message when body contains non integer value", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: "tree" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with given article and updates votes if request body has unnecessary info", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: 1, mood: "great" })
        .expect(200)
        .then((response) => {
          const { article } = response.body;
          expect(article).toEqual({
            title: "Eight pug gifs that remind me of mitch",
            topic: "mitch",
            article_id: 3,
            votes: 1,
            author: "icellusedkars",
            body: "some gifs",
            created_at: "2020-11-03T09:12:00.000Z",
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("200: responds with array of articles with comment counts in descending date order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("200: responds with an array of comments matching up to a given article id and in descending date order", () => {
      return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
          expect(comments.length).toBe(2);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("article_id");
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
          });
        });
    });
    test("400: returns appropriate error message when given invalid id", () => {
      return request(app)
        .get("/api/articles/tree/comments")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when id does not exist", () => {
      return request(app)
        .get("/api/articles/1231212/comments")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article id does not exist");
        });
    });
    test("200: responds with empty array when id does exist but no results are returned", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toEqual([]);
        });
    });
  });
  describe("POST", () => {
    test("201: creates new comment and responds with newly created comment from table", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "rogersop", body: "A whacky good read" })
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("body", "A whacky good read");
          expect(comment).toHaveProperty("article_id", 3);
          expect(comment).toHaveProperty("author", "rogersop");
        });
    });
    test("400: responds with appropriate error message when invalid id is sumbimtted", () => {
      return request(app)
        .post("/api/articles/tree/comments")
        .send({ username: "rogersop", body: "A whacky good read" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: responds with appropriate error message when id does not exist", () => {
      return request(app)
        .post("/api/articles/123234325/comments")
        .send({ username: "rogersop", body: "A whacky good read" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: responds with appropriate error message when username does not exist", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "Billy", body: "A whacky good read" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("400: responds with appropriate error message when input body is missing information", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ body: "A whacky good read" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with newly created comment when additional unnecessary info is added to the request body", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({
          username: "rogersop",
          body: "A whacky good read",
          hobby: "running",
        })
        .expect(201)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toHaveProperty("votes", 0);
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("body", "A whacky good read");
          expect(comment).toHaveProperty("article_id", 3);
          expect(comment).toHaveProperty("author", "rogersop");
        });
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("GET", () => {
    test("200: responds with 200 when comment exists", () => {
      return request(app).get("/api/comments/3").expect(200);
    });
    test("400: responds with appropriate error message when comment id is invalid", () => {
      return request(app)
        .get("/api/comments/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when comment id does not exist", () => {
      return request(app)
        .get("/api/comments/1231212")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment id does not exist");
        });
    });
  });
  describe("DELETE", () => {
    test("204: deletes comment by given comment id", () => {
      return request(app)
        .delete("/api/comments/3")
        .expect(204)
        .then(() => {
          return request(app).get("/api/comments/3").expect(404);
        })
        .then((response) => {
          expect(response.body.msg).toBe("Comment id does not exist");
        });
    });
    test("400: responds with appropriate error message when comment id is invalid", () => {
      return request(app)
        .delete("/api/comments/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when comment id does not exist", () => {
      return request(app)
        .delete("/api/comments/1231212")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Comment id does not exist");
        });
    });
  });
});
describe("/api/users", () => {
  describe("GET", () => {
    test("200: responds with an array of users with username, name, and avatar_url properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          const { users } = response.body;
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
