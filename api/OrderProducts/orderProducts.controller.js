const express = require('express');
const router = express.Router();
const orderProductsHandler = require("./orderProducts.handler");

router.get('/', async (req, res) => {
    res.json(await orderProductsHandler.search());
});

router.get('/:id', async (req, res) => {
    console.log("id: ", req.params.id);
    res.json(await orderProductsHandler.searchById(req.params.id));
});

router.post("/", async (req, res) => {
    res.json(await orderProductsHandler.create(req.body));
})

router.put("/:id", async (req, res) => {
    res.json(await orderProductsHandler.edit(req.body, req.params.id))
})

router.delete("/:id", async (req, res) => {
    res.json(await orderProductsHandler.remove(req.params.id))
})

module.exports = router;