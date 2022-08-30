const e = require("express");
const crud = require("../../crud");
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

    try {
        await crud.getById("Users", dados.userId);
    } catch (error) {
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

    const orders = await search()
    const orderData = {
        userId: dados.userId,
        number: orders.length + 1,
        status: "Open"
    }

    const newOrder = await crud.save(nomeTabela, null, orderData)

    for (let product of dados.orderProducts) {
        const orderProduct = {
            productId: product.productId,
            quantity: product.quantity,
            orderId: newOrder.id
        }

        await crud.save("OrderProducts", null, orderProduct)
    }

    return newOrder
}

async function edit(dados, id) {
    //TESTARRARARARRARARARARARA
    if (!id) {
        return { message: "Id do pedido não informado!" }
    }

    try {
        await crud.getById("Orders", id);
    } catch (error) {
        return { message: "Id de pedido inválido!" }
    }

    if (!dados.userId) {
        return { message: "O id de usuário não foi informado!" }
    }

    try {
        await crud.getById("Users", dados.userId);
    } catch (error) {
        return { message: "Id de usuário inválido!" }
    }

    const order = await crud.getById(nomeTabela, id)

    if (order.status != "Open") {
        return { message: "Esse pedido já foi fechado!" }
    }
    if (dados.orderProducts && dados.orderProducts.length != 0) {
        if (await verifyListProducts(dados.orderProducts)) {
            return { message: "Um dos ids de produto é inválido!" }
        }

        const orderProducts = await crud.get("OrderProducts")
        const productsfFromThsOrder = orderProducts.filter((e) => e.orderId == id)

        for (let product of dados.orderProducts) {
            let adicionado = false
            for (let orderProduct of productsfFromThsOrder) {
                if (product.productId == orderProduct.productId) {
                    const editedOrderProduct = {
                        productId: orderProduct.id,
                        quantity: orderProduct.quantity + product.quantity,
                        orderId: orderProduct.orderId
                    }
                    await crud.save("OrderProducts", orderProduct.id, editedOrderProduct)

                    adicionado = true
                    break
                }
            }
            if (!adicionado) {
                const orderProduct = {
                    productId: product.productId,
                    quantity: product.quantity,
                    orderId: id
                }

                await crud.save("OrderProducts", null, orderProduct)
            }
        }
    }

    const newData = {
        userId: order.userId,
        number: order.number,
        status: dados.status
    }

    return await crud.save(nomeTabela, id, newData)
}

async function remove(dados, id) {

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
    const orders = await crud.get("Orders")
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