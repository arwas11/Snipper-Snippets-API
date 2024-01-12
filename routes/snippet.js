const snippetRouter = require("express").Router();
const snippets = require("../db/seedData.json");

let ids = snippets.length;

snippetRouter.get("/", (req, res) => {
  const { lang } = req.query;
  if (lang) {
    if (!snippets.find((snippet) => snippet.language === lang)) {
      res.status(400).send("Please enter a valid language");
    } else {
      console.log(req.query[0]);
      const found = snippets.filter((snippet) => snippet.language === lang);
      console.log(found);
      res.status(200).json(found);
    }
  }
  res.json(snippets);
});

snippetRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  res.json(snippets[id]);
});

snippetRouter.post("/", (req, res) => {
  const { language, code } = req.body;
  if (!language || !code) {
    return res
      .status(400)
      .json({ error: "Please enter a language and a code" });
  }

  const newSnippet = {
    id: ++ids,
    language,
    code,
  };

  snippets.push(newSnippet);
  res.status(201).json(newSnippet);
});

module.exports = snippetRouter;
