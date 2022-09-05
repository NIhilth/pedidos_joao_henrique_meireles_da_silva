const crud = require("../../crud");
const users = require("../Users/users.handler")
const ordersProducts = require("../OrderProducts/orderProducts.handler")
const nomeTabela = "Orders";

async function search() {
    return await crud.get(nomeTabela);
}

async function searchById(id) {
    if (!id) {
        return { message: "Id faltando!" }
    }
    try {
        await crud.getById(nomeTabela, id);
    } catch (error) {
        return { message: "Id inválido" }
    }

    return await crud.getById(nomeTabela, id);
}

async function create(dados) {
    if (!dados.userId) {
        return { message: "O id de usuário não foi informado!" }
    }

    const user = await users.searchById(dados.userId)

    if (user.message) {
        return { message: "Id de usuário inválido!" }
    }

    if (await verifyOrdersUser(dados.userId)) {
        return { message: "O usuário já tem um pedido em aberto" }
    }

    if (!dados.orderProducts || dados.orderProducts.length == 0) {
        return { message: "Nenhum produto foi informado!" }
    }

    if (await verifyListProducts(dados.orderProducts)) {
        return { message: "Um dos ids de produto é inválido!" }
    }

    for (let product of dados.orderProducts) {
        if (product.quantity <= 0) {
            return { message: "A quantidade informada de um produto é inválida" }
        }
    }

    const orders = await search()
    let number = 1

    for (const order of orders) {
        if (order.userId == dados.userId) {
            number++
        }
    }

    const orderData = {
        userId: dados.userId,
        number: number,
        status: "Open"
    }

    const newOrder = await crud.save(nomeTabela, null, orderData)

    for (let product of dados.orderProducts) {
        const orderProduct = {
            productId: product.productId,
            quantity: product.quantity,
            orderId: newOrder.id
        }

        ordersProducts.create(orderProduct)
    }

    return newOrder
}

async function edit(dados, id) {
    if (!id) {
        return { message: "Id do pedido não informado!" }
    }

    const searchOrder = await searchById(id)

    if (searchOrder.message) {
        return { message: "Id de pedido inválido!" }
    }

    if (dados.userId) {
        const user = await users.searchById(dados.userId)

        if (user.message) {
            return { message: "Id de usuário inválido!" }
        }
    }

    const order = await crud.getById(nomeTabela, id)

    if (order.status == "Close") {
        return { message: "Esse pedido já foi fechado!" }
    }

    if (dados.status == "Close") {
        const orders = await ordersProducts.search()
        const productsFromThsOrder = orders.filter((e) => e.orderId == id)

        if (productsFromThsOrder == [] || productsFromThsOrder == "") {
            return { message: "Esse pedido não tem itens !" }
        }
    }

    if (dados.orderProducts && dados.orderProducts.length != 0) {
        if (await verifyListProducts(dados.orderProducts)) {
            return { message: "Um dos ids de produto é inválido!" }
        }

        const orderProducts = await ordersProducts.search()
        const productsFromThsOrder = orderProducts.filter((e) => e.orderId == id)
        let adicionado

        for (let product of dados.orderProducts) {
            adicionado = false
            for (let orderProduct of productsFromThsOrder) {
                if (product.productId == orderProduct.productId) {
                    if (orderProduct.quantity + product.quantity <= 0) {
                        adicionado = true
                        ordersProducts.remove(orderProduct.id)
                    } else {
                        const editedOrderProduct = {
                            productId: orderProduct.productId,
                            quantity: orderProduct.quantity + product.quantity,
                            orderId: orderProduct.orderId
                        }
                        ordersProducts.edit(editedOrderProduct,orderProduct.id)

                        adicionado = true
                        break
                    }
                }
            }
            if (!adicionado) {
                if (product.quantity <= 0) {
                    return { message: "A quantidade informada de um produto é inválida" }
                }

                const newOrderProduct = {
                    productId: product.productId,
                    quantity: product.quantity,
                    orderId: id
                }
                
                ordersProducts.create(newOrderProduct)
            }
        }
    }

    const newData = {
        userId: (dados.userId ? dados.userId : order.userId),
        number: order.number,
        status: dados.status
    }

    return await crud.save(nomeTabela, id, newData)
}

async function remove(id) {
    if (!id) {
        return { message: "Id do pedido não informado!" }
    }

    const searchOrder = await searchById(id)

    if (searchOrder.message) {
        return { message: "Id de pedido inválido!" }
    }

    const productsOrders = await ordersProducts.search()
    const productsFromThisOrder = productsOrders.filter((e) => e.orderId == id)

    if (productsFromThisOrder == [] || productsFromThisOrder == "") {
        return { message: "Esse pedido não tem itens !" }
    }

    await crud.remove(nomeTabela, id)

    return search()
}

async function verifyListProducts(list = []) {
    let invalid = false;
    for (const product of list) {
        try {
            await crud.getById("Products", product.productId);
        } catch (erro) {
            invalid = true;
            return invalid;
        }
    }
    return invalid;
}

async function verifyOrdersUser(userId) {
    let invalid = false;
    const orders = await search()
    for (const order of orders) {
        if (order.userId == userId && order.status == "Open") {
            invalid = true
            return invalid
        }
    }
    return invalid;
}

module.exports = {
    search,
    searchById,
    create,
    edit,
    remove
}