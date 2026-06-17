import { openDB } from 'idb'

const DB_NAME = 'validade-db'
const DB_VERSION = 1
const STORE_NAME = 'produtos'

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        })
      }
    }
  })
}

export async function salvarProduto(produto) {
  const db = await getDB()
  return db.add(STORE_NAME, produto)
}

export async function atualizarProduto(produto) {
  const db = await getDB()
  return db.put(STORE_NAME, produto)
}

export async function listarProdutos() {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

export async function buscarProdutoPorCodigoBarras(codigoBarras) {
  const produtos = await listarProdutos()
  const codigoNormalizado = String(codigoBarras).trim()

  const produtosComMesmoCodigo = produtos.filter((produto) => {
    return String(produto.codigoBarras).trim() === codigoNormalizado
  })

  return produtosComMesmoCodigo.at(-1) || null
}

export async function produtoJaCadastradoComValidade(codigoBarras, validade, idIgnorado = null) {
  const produtos = await listarProdutos()

  return produtos.some((produto) => {
    return (
      produto.id !== idIgnorado &&
      String(produto.codigoBarras).trim() === String(codigoBarras).trim() &&
      produto.validade === validade
    )
  })
}

export async function removerProduto(id) {
  const db = await getDB()
  return db.delete(STORE_NAME, id)
}
