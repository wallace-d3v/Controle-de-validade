import { openDB } from 'idb'
import { salvarFotoProduto } from './fotoStorage'
import { supabase, supabaseConfigurado } from './supabaseClient'

const DB_NAME = 'validade-db'
const DB_VERSION = 1
const STORE_NAME = 'produtos'

function mapearProdutoDoBanco(produto) {
  return {
    id: produto.id,
    codigoBarras: produto.codigo_barras,
    nome: produto.nome,
    validade: produto.validade,
    descricao: produto.descricao || '',
    quantidade: produto.quantidade,
    setor: produto.setor || '',
    foto: produto.foto_url || '',
    criadoEm: produto.criado_em,
    atualizadoEm: produto.atualizado_em
  }
}

function mapearProdutoParaBanco(produto) {
  return {
    codigo_barras: produto.codigoBarras,
    nome: produto.nome,
    validade: produto.validade,
    descricao: produto.descricao || null,
    quantidade: produto.quantidade,
    setor: produto.setor || null,
    foto_url: produto.foto || null,
    atualizado_em: produto.atualizadoEm || new Date().toISOString()
  }
}

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

async function salvarProdutoLocal(produto) {
  const db = await getDB()
  return db.add(STORE_NAME, produto)
}

async function atualizarProdutoLocal(produto) {
  const db = await getDB()
  return db.put(STORE_NAME, produto)
}

async function listarProdutosLocal() {
  const db = await getDB()
  return db.getAll(STORE_NAME)
}

async function removerProdutoLocal(id) {
  const db = await getDB()
  return db.delete(STORE_NAME, id)
}

export async function salvarProduto(produto) {
  if (!supabaseConfigurado) {
    return salvarProdutoLocal(produto)
  }

  const fotoUrl = await salvarFotoProduto(produto.foto, crypto.randomUUID())
  const produtoBanco = mapearProdutoParaBanco({
    ...produto,
    foto: fotoUrl
  })

  const { data, error } = await supabase
    .from('produtos')
    .insert(produtoBanco)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao salvar produto: ${error.message}`)
  }

  return data.id
}

export async function atualizarProduto(produto) {
  if (!supabaseConfigurado) {
    return atualizarProdutoLocal(produto)
  }

  const fotoUrl = await salvarFotoProduto(produto.foto, produto.id)
  const produtoBanco = mapearProdutoParaBanco({
    ...produto,
    foto: fotoUrl
  })

  const { error } = await supabase
    .from('produtos')
    .update(produtoBanco)
    .eq('id', produto.id)

  if (error) {
    throw new Error(`Erro ao atualizar produto: ${error.message}`)
  }
}

export async function listarProdutos() {
  if (!supabaseConfigurado) {
    return listarProdutosLocal()
  }

  const { data, error } = await supabase
    .from('produtos')
    .select('*')
    .order('validade', { ascending: true })

  if (error) {
    throw new Error(`Erro ao listar produtos: ${error.message}`)
  }

  return data.map(mapearProdutoDoBanco)
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
  if (!supabaseConfigurado) {
    return removerProdutoLocal(id)
  }

  const { error } = await supabase
    .from('produtos')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao remover produto: ${error.message}`)
  }
}
