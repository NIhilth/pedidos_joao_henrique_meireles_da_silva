const express = require('express');
const router = express.Router();
const productsHandler = require("./products.handler");

router.get('/', async (req, res) => {
    res.json(await productsHandler.search());
});

router.get('/:id', async (req, res) => {
    console.log("id: ", req.params.id);
    res.json(await productsHandler.searchById(req.params.id));
});

router.post("/", async (req, res) => {
    res.json(await productsHandler.create(req.body));
})

module.exports = router;