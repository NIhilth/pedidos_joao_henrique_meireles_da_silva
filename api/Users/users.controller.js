const express = require('express');
const router = express.Router();
const usersHandler = require("./users.handler");

router.get('/', async (req, res) => {
    res.json(await usersHandler.search());
});

router.get('/:id', async (req, res) => {
    console.log("id: ", req.params.id);
    res.json(await usersHandler.searchById(req.params.id));
});

router.post("/", async (req, res) => {
    res.json(await usersHandler.create(req.body));
})

module.exports = router;