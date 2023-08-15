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
        expect(endpoints).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all articles",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: "2018-05-30T15:59:13.341Z",
                  votes: 0,
                  comment_count: 6,
                },
              ],
            },
          },
          "GET /api/articles/:articles_id": {
            description:
              "returns an object containing information relevant to the article which matches the article id",
            queries: [],
            exampleResponse: {
              article: {
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                article_id: 3,
                votes: 0,
                author: "icellusedkars",
                body: "some gifs",
                created_at: "2020-11-03T09:12:00.000Z",
                article_img_url:
                  "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
              },
            },
          },
          "GET /api/articles/:articles_id/comments": {
            description:
              "returns an array contatining comments relevant to the article_id",
            queries: [],
            exampleResponse: {
              comment_id: 11,
              votes: 0,
              created_at: "2020-09-19T23:10:00.000Z",
              author: "icellusedkars",
              body: "Ambidextrous marsupial",
              article_id: 3,
            },
          },
        });
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
    test("400:responds with an appropriate error when votes are modified to become a negative number", () => {
      return request(app)
        .patch("/api/articles/3")
        .send({ inc_votes: -100 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe(
            "Cannot set votes to be a negative number"
          );
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
});
