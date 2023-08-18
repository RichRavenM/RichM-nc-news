const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const articles = require("../db/data/test-data/articles");
const endpoints = require(`${__dirname}/../endpoints.json`);

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  describe("GET", () => {
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
  describe("POST", () => {
    test("201: posts a new topic and responds with the newly posted topic", () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "Jeffs",
          description: "The Jeff school of thought",
        })
        .expect(201)
        .then((response) => {
          const { topic } = response.body;
          expect(topic).toEqual({
            slug: "Jeffs",
            description: "The Jeff school of thought",
          });
        });
    });
    test("400: responds with appropriate error message when input body is missing information", () => {
      return request(app)
        .post("/api/topics")
        .send({ description: "This has no slug" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("201: responds with newly created topic even if extra unnecessary information is added", () => {
      return request(app)
        .post("/api/topics")
        .send({
          slug: "Jeffs",
          description: "The Jeff school of thought",
          theme: "Happiness",
        })
        .expect(201)
        .then((response) => {
          const { topic } = response.body;
          expect(topic).toEqual({
            slug: "Jeffs",
            description: "The Jeff school of thought",
          });
        });
    });
    test("400: responds with appropriate error message when slug already exists in topics", () => {
      return request(app)
        .post("/api/topics")
        .send({ slug: "mitch", description: "This slug already exists" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Slug already exists");
        });
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
            comment_count: 2,
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
  describe("DELETE", () => {
    test("204: deletes article and comments based on given article_id", () => {
      return request(app)
        .delete("/api/articles/3")
        .expect(204)
        .then(() => {
          return request(app).get("/api/articles/3").expect(404);
        })
        .then(() => {
          return request(app).get("/api/articles/3/comments").expect(404);
        });
    });
    test("400: Responds with appropriate error when invalid id is used", () => {
      return request(app)
        .delete("/api/articles/tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: Responds with appropriate error when non-existent id is used", () => {
      return request(app)
        .delete("/api/articles/1231212")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article id does not exist");
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
    test("200: responds with articles sorted by ascending or descending when order query is used", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at");
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
        })
        .then(() => {
          return request(app).get("/api/articles?order=desc").expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("400: responds with appropriate error message if order query has invalid input", () => {
      return request(app)
        .get("/api/articles?order=banana")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with array of articles sorted by valid query", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("author", { descending: true });
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
        })
        .then(() => {
          return request(app).get("/api/articles?sort_by=title").expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("title", { descending: true });
          expect(articles.length).toBe(13);
        })
        .then(() => {
          return request(app).get("/api/articles?sort_by=topic").expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("topic", { descending: true });
          expect(articles.length).toBe(13);
        })
        .then(() => {
          return request(app)
            .get("/api/articles?sort_by=article_id")
            .expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("article_id", { descending: true });
          expect(articles.length).toBe(13);
        })
        .then(() => {
          return request(app)
            .get("/api/articles?sort_by=created_at")
            .expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(13);
        })
        .then(() => {
          return request(app)
            .get("/api/articles?sort_by=article_img_url")
            .expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("article_img_url", {
            descending: true,
          });
          expect(articles.length).toBe(13);
        })
        .then(() => {
          return request(app).get("/api/articles?sort_by=votes").expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("votes", {
            descending: true,
          });
          expect(articles.length).toBe(13);
        })
        .then(() => {
          return request(app)
            .get("/api/articles?sort_by=comment_count")
            .expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("comment_count", {
            descending: true,
            coerce: true,
          });
          expect(articles.length).toBe(13);
        });
    });
    test("400: responds with appropriate error message when invalid sort_by query is used", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with filtered articles when valid topic is inputted", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic", "mitch");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        })
        .then(() => {
          return request(app).get("/api/articles?topic=cats").expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles.length).toBe(1);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic", "cats");
          });
        })
        .then(() => {
          return request(app).get("/api/articles?topic=paper").expect(200);
        })
        .then((response) => {
          const { articles } = response.body;
          expect(articles.length).toBe(0);
        });
    });
    test("400: responds with an appropriate error message when topic query is invalid", () => {
      return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Topic does not exist");
        });
    });
    test("200: responds with a limited number of articles when a limit query is applied", () => {
      return request(app)
        .get("/api/articles?limit=5")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(5);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test("200: responds with all the articles when the limit is greater than the total number of articles", () => {
      return request(app)
        .get("/api/articles?limit=45")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test("400: responds with appropriate error message when invalid query input is used", () => {
      return request(app)
        .get("/api/articles?limit=tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with correct page of rows when page query input is given", () => {
      return request(app)
        .get("/api/articles?p=3&limit=5")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(3);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });
    test("200:responds with an empty array if the page number is greater than pages available", () => {
      return request(app)
        .get("/api/articles?p=4")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles.length).toBe(0);
        });
    });
    test("400: responds with the appropraite error message when an invalid page number is used in the query", () => {
      return request(app)
        .get("/api/articles?p=tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: response body includes a total count of all rows when total_count is included", () => {
      return request(app)
        .get("/api/articles?total_count=1&limit=5")
        .expect(200)
        .then((response) => {
          const { articles } = response.body;
          expect(articles).toBeSortedBy("created_at", { descending: true });
          expect(articles.length).toBe(5);
          articles.forEach((article) => {
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
            expect(article).toHaveProperty("comment_count");
            expect(article).toHaveProperty("total_count", '13');
          });
        });
    });
    test("400: responds with appropriate error message when invalid query input is used", () => {
      return request(app)
        .get("/api/articles?total_count=2")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
  });
  describe("POST", () => {
    test("201: posts a new article and responds with the newly posted article", () => {
      const testArticle = {
        author: "icellusedkars",
        title: "A History of Jeffs",
        body: "On the first day, there was only one Jeff. On the second...",
        topic: "cats",
        article_img_url:
          "https://th-thumbnailer.cdn-si-edu.com/bZAar59Bdm95b057iESytYmmAjI=/1400x1050/filters:focal(594x274:595x275)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/95/db/95db799b-fddf-4fde-91f3-77024442b92d/egypt_kitty_social.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(201)
        .then((response) => {
          const { article } = response.body;
          expect(article).toHaveProperty("author", "icellusedkars");
          expect(article).toHaveProperty("title", "A History of Jeffs");
          expect(article).toHaveProperty(
            "body",
            "On the first day, there was only one Jeff. On the second..."
          );
          expect(article).toHaveProperty("topic", "cats");
          expect(article).toHaveProperty(
            "article_img_url",
            "https://th-thumbnailer.cdn-si-edu.com/bZAar59Bdm95b057iESytYmmAjI=/1400x1050/filters:focal(594x274:595x275)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/95/db/95db799b-fddf-4fde-91f3-77024442b92d/egypt_kitty_social.jpg"
          );
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_id");
        });
    });
    test("400: responds with appropriate error message when input body is missing information", () => {
      return request(app)
        .post("/api/articles")
        .send({ author: "icellusedkars" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when username that does not exist is used", () => {
      const testArticle = {
        author: "Jeff",
        title: "A History of Jeffs",
        body: "On the first day, there was only one Jeff. On the second...",
        topic: "cats",
        article_img_url:
          "https://th-thumbnailer.cdn-si-edu.com/bZAar59Bdm95b057iESytYmmAjI=/1400x1050/filters:focal(594x274:595x275)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/95/db/95db799b-fddf-4fde-91f3-77024442b92d/egypt_kitty_social.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Input value not found");
        });
    });
    test("404: responds with appropriate error message when topic that does not exist is used", () => {
      const testArticle = {
        author: "icellusedkars",
        title: "A History of Jeffs",
        body: "On the first day, there was only one Jeff. On the second...",
        topic: "beans",
        article_img_url:
          "https://th-thumbnailer.cdn-si-edu.com/bZAar59Bdm95b057iESytYmmAjI=/1400x1050/filters:focal(594x274:595x275)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/95/db/95db799b-fddf-4fde-91f3-77024442b92d/egypt_kitty_social.jpg",
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Input value not found");
        });
    });
    test("201: responds with created article when extra unnecessary information is included in the request body", () => {
      const testArticle = {
        author: "icellusedkars",
        title: "A History of Jeffs",
        body: "On the first day, there was only one Jeff. On the second...",
        topic: "cats",
        article_img_url:
          "https://th-thumbnailer.cdn-si-edu.com/bZAar59Bdm95b057iESytYmmAjI=/1400x1050/filters:focal(594x274:595x275)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/95/db/95db799b-fddf-4fde-91f3-77024442b92d/egypt_kitty_social.jpg",
        age: 7,
      };
      return request(app)
        .post("/api/articles")
        .send(testArticle)
        .expect(201)
        .then((response) => {
          const { article } = response.body;
          expect(article).toHaveProperty("author", "icellusedkars");
          expect(article).toHaveProperty("title", "A History of Jeffs");
          expect(article).toHaveProperty(
            "body",
            "On the first day, there was only one Jeff. On the second..."
          );
          expect(article).toHaveProperty("topic", "cats");
          expect(article).toHaveProperty(
            "article_img_url",
            "https://th-thumbnailer.cdn-si-edu.com/bZAar59Bdm95b057iESytYmmAjI=/1400x1050/filters:focal(594x274:595x275)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/95/db/95db799b-fddf-4fde-91f3-77024442b92d/egypt_kitty_social.jpg"
          );
          expect(article).toHaveProperty("comment_count");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_id");
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
            expect(comment).toHaveProperty("article_id", 3);
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
    test("200: responds with a limited number of comments when a limit query is applied", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=5")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
          expect(comments.length).toBe(5);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("article_id", 1);
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
          });
        });
    });
    test("200: responds with all the comments when the limit is greater than the total number of comments", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=45")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("article_id", 1);
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
          });
        });
    });
    test("400: responds with appropriate error message when invalid query input is used", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with correct page of rows when page query input is given", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=10&p=2")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments).toBeSortedBy("created_at", { descending: true });
          expect(comments.length).toBe(1);
          comments.forEach((comment) => {
            expect(comment).toHaveProperty("comment_id");
            expect(comment).toHaveProperty("article_id", 1);
            expect(comment).toHaveProperty("votes");
            expect(comment).toHaveProperty("created_at");
            expect(comment).toHaveProperty("author");
            expect(comment).toHaveProperty("body");
          });
        });
    });
    test("200:responds with an empty array if the page number is greater than pages available", () => {
      return request(app)
        .get("/api/articles/1/comments?p=4")
        .expect(200)
        .then((response) => {
          const { comments } = response.body;
          expect(comments.length).toBe(0);
        });
    });
    test("400: responds with the appropraite error message when an invalid page number is used in the query", () => {
      return request(app)
        .get("/api/articles/1/comments?p=tree")
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
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
    test("404: responds with appropriate error message when id does not exist", () => {
      return request(app)
        .post("/api/articles/123234325/comments")
        .send({ username: "rogersop", body: "A whacky good read" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Input value not found");
        });
    });
    test("404: responds with appropriate error message when username does not exist", () => {
      return request(app)
        .post("/api/articles/3/comments")
        .send({ username: "Billy", body: "A whacky good read" })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Input value not found");
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
  describe("PATCH", () => {
    test("200: updates a vote count and responds with the updated comment", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toEqual({
            comment_id: 3,
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            votes: 101,
            author: "icellusedkars",
            article_id: 1,
            created_at: "2020-03-01T01:13:00.000Z",
          });
        });
    });
    test("400: responds with appropriate error message when article id is invalid", () => {
      return request(app)
        .patch("/api/comments/tree")
        .send({ inc_votes: 1 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("404: responds with appropriate error message when article id does not exist", () => {
      return request(app)
        .patch("/api/comments/1231212")
        .send({ inc_votes: 1 })
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Article id does not exist");
        });
    });
    test("400: responds with appropriate error message when body contains non integer value", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: "tree" })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe("Bad request");
        });
    });
    test("200: responds with given article and updates votes if request body has unnecessary info", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({ inc_votes: 1, mood: "great" })
        .expect(200)
        .then((response) => {
          const { comment } = response.body;
          expect(comment).toEqual({
            comment_id: 3,
            body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
            votes: 101,
            author: "icellusedkars",
            article_id: 1,
            created_at: "2020-03-01T01:13:00.000Z",
          });
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
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
describe("checkTopicExists", () => {
  describe("GET", () => {
    test("200: responds with 200 when topic exists", () => {
      return request(app).get("/api/articles?topic=mitch").expect(200);
    });
    test("404: responds with appropriate error message when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=egg")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("Topic does not exist");
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("200: returns a user with all the necessary details", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .expect(200)
        .then((response) => {
          const { user } = response.body;
          expect(user).toEqual({
            username: "icellusedkars",
            name: "sam",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          });
        });
    });
    test("404: returns appropriate error message when user does not exist", () => {
      return request(app)
        .get("/api/users/memememe")
        .expect(404)
        .then((response) => {
          expect(response.body.msg).toBe("User does not exist");
        });
    });
  });
});
