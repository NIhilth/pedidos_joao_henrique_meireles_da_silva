const express = require('express');
const router = express.Router();
const ordersHandler = require("./orders.handler");

router.get('/', async (req, res) => {
    res.json(await ordersHandler.search());
});

router.get('/:id', async (req, res) => {
    console.log("id: ", req.params.id);
    res.json(await ordersHandler.searchById(req.params.id));
});

router.post("/", async (req, res) => {
    res.json(await ordersHandler.create(req.body));
})

router.put("/:id", async (req, res) => {
    res.json(await ordersHandler.edit(req.body, req.params.id))
})

module.exports = router;