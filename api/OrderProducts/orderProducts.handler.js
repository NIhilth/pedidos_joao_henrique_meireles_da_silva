const crud = require("../../crud");
const nomeTabela = "OrderProducts";

async function search(){
    return await crud.get(nomeTabela);
}

async function searchById(id){
    if(!id){
        return {message:"Id faltando!"}
    }
    try {
        await crud.getById(nomeTabela, id);
    } catch(error){
        return {message: "Id inválido"}
    }

    return await crud.getById(nomeTabela, id);
}

async function create(dados){
    return await crud.save(nomeTabela, null, dados)
}

async function edit(dados, id){
    return await crud.save(nomeTabela, id, dados)
}

async function remove(id){
    await crud.remove(nomeTabela, id)
}

module.exports = {
    search,
    searchById,
    create,
    edit,
    remove
}