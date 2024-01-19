const snippetRouter = require("express").Router();
const snippets = require("../db/seedData.json");
// const {Snippet} = require("../models")
const { encrypt, decrypt } = require("../utils/encrypt");
const userAuth = require("../middleware/userAuth");
const JWT_SECRET = process.env.JWT_SECRET;
// let ids = snippets.length;

//GET all snippets
// As a user, I want the snippet to be decrypted before it is returned from the API, so that I can actually read it
snippetRouter.get("/", userAuth, async (req, res, next) => {
  try {
    const { lang } = req.query;

    const decodedSnippets = snippets.map((snippet) => ({
      ...snippet,
      code: decrypt(snippet.code),
    }));

    if (lang) {
      if (!snippets.find((snippet) => snippet.language === lang)) {
        res.status(400).send("Please enter a valid language");
      } else {
        // console.log(req.query[0]);
        const foundSnippets = decodedSnippets.filter(
          (snippet) => snippet.language.toLowerCase() === lang.toLowerCase()
        );
        console.log(foundSnippets);
        res.status(200).json(foundSnippets);
      }
    }
    //this will show decrypted data
    res.json(decodedSnippets);

    //this will show encrypted data
    // res.json(snippets);
  } catch (error) {
    next(error);
  }
});

//GET a snippet by id
// As a user, I want the snippet to be decrypted before it is returned from the API, so that I can actually read it
snippetRouter.get("/:id", userAuth, async (req, res, next) => {
  try {
    const snippetId = parseInt(req.params.id);
    const snippet = snippets.find((snippet) => snippet.id === snippetId);

    if (!snippet) {
      return res.status(404).json({ error: "Snippet not found" });
    }
    //uncomment to show snippet.code in plaintext
    snippet.code = decrypt(snippet.code);
    res.json(snippet);
  } catch (error) {
    next(error);
  }
});

//POST create new snippet
// As a user, I want all snippets to be encrypted before being saved into the database, so that I feel confident my code can’t be stolen if the database is compromised
snippetRouter.post("/", userAuth, async (req, res, next) => {
  try {
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

    snippets.push({ ...newSnippet, code: encrypt(code) });

    //to show entire newSnippt that was added to db
    // res.status(201).json(newSnippet);

    res
      .status(201)
      .send(
        `You added a new ${newSnippet.language} snippet with id#${newSnippet.id}!`
      );
  } catch (error) {
    next(error);
  }
});

module.exports = snippetRouter;
