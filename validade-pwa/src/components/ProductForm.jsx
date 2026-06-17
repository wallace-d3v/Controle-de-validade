import { useEffect, useState } from 'react'
import {
  atualizarProduto,
  buscarProdutoPorCodigoBarras,
  produtoJaCadastradoComValidade,
  salvarProduto
} from '../service/db'

function formatarValidadeDigitada(valor) {
  const numeros = valor.replace(/\D/g, '').slice(0, 8)

  if (numeros.length <= 2) {
    return numeros
  }

  if (numeros.length <= 4) {
    return `${numeros.slice(0, 2)}/${numeros.slice(2)}`
  }

  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`
}

function formatarValidadeISO(valor) {
  if (!valor) return ''

  const [ano, mes, dia] = valor.split('-')

  if (!ano || !mes || !dia) return ''

  return `${dia}/${mes}/${ano}`
}

function converterValidadeParaISO(valor) {
  const numeros = valor.replace(/\D/g, '')

  if (numeros.length !== 8) {
    return null
  }

  const dia = numeros.slice(0, 2)
  const mes = numeros.slice(2, 4)
  const ano = numeros.slice(4, 8)
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia))

  const dataValida =
    data.getFullYear() === Number(ano) &&
    data.getMonth() === Number(mes) - 1 &&
    data.getDate() === Number(dia)

  if (!dataValida) {
    return null
  }

  return `${ano}-${mes}-${dia}`
}

export default function ProductForm({ codigoBarras, produtoEmEdicao, onProdutoSalvo, onCancelar }) {
  const editando = Boolean(produtoEmEdicao)
  const [nome, setNome] = useState('')
  const [validade, setValidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [setor, setSetor] = useState('')
  const [foto, setFoto] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  useEffect(() => {
    if (!produtoEmEdicao) return

    setNome(produtoEmEdicao.nome || '')
    setValidade(formatarValidadeISO(produtoEmEdicao.validade))
    setDescricao(produtoEmEdicao.descricao || '')
    setQuantidade(produtoEmEdicao.quantidade || 1)
    setSetor(produtoEmEdicao.setor || '')
    setFoto(produtoEmEdicao.foto || '')
  }, [produtoEmEdicao])

  useEffect(() => {
    async function preencherProdutoSalvo() {
      if (editando || !codigoBarras) return

      const produtoSalvo = await buscarProdutoPorCodigoBarras(codigoBarras)

      if (!produtoSalvo) return

      setNome(produtoSalvo.nome || '')
      setSetor(produtoSalvo.setor || '')
      setDescricao(produtoSalvo.descricao || '')
      setFoto(produtoSalvo.foto || '')
    }

    preencherProdutoSalvo()
  }, [codigoBarras, editando])

  function handleFotoChange(event) {
    const arquivo = event.target.files?.[0]
    setMensagemErro('')

    if (!arquivo) {
      setFoto('')
      return
    }

    if (!arquivo.type.startsWith('image/')) {
      setMensagemErro('Selecione um arquivo de imagem válido.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setFoto(String(reader.result))
    }

    reader.onerror = () => {
      setMensagemErro('Não foi possível carregar a foto do produto.')
      event.target.value = ''
    }

    reader.readAsDataURL(arquivo)
  }

  function handleValidadeChange(event) {
    setValidade(formatarValidadeDigitada(event.target.value))
  }

  function removerFoto() {
    setFoto('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagemErro('')

    const validadeISO = converterValidadeParaISO(validade)
    const codigoAtual = produtoEmEdicao?.codigoBarras || codigoBarras

    if (!codigoAtual || !nome || !validadeISO) {
      setMensagemErro('Preencha código, nome e uma validade válida no formato DD/MM/AAAA.')
      return
    }

    const jaExiste = await produtoJaCadastradoComValidade(
      codigoAtual,
      validadeISO,
      produtoEmEdicao?.id || null
    )

    if (jaExiste) {
      setMensagemErro('Esse produto já foi cadastrado com essa data de validade.')
      return
    }

    const produto = {
      ...produtoEmEdicao,
      codigoBarras: codigoAtual,
      nome,
      validade: validadeISO,
      descricao,
      quantidade: Number(quantidade),
      setor,
      foto,
      atualizadoEm: new Date().toISOString(),
      criadoEm: produtoEmEdicao?.criadoEm || new Date().toISOString()
    }

    if (editando) {
      await atualizarProduto(produto)
    } else {
      await salvarProduto(produto)
    }

    setNome('')
    setValidade('')
    setDescricao('')
    setQuantidade(1)
    setSetor('')
    setFoto('')
    setMensagemErro('')

    onProdutoSalvo(editando)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {mensagemErro && (
        <div className="form-alert" role="alert">
          {mensagemErro}
        </div>
      )}

      <div className="form-group">
        <label>Foto do produto</label>

        <label className="photo-field">
          {foto ? (
            <img src={foto} alt="Prévia do produto" />
          ) : (
            <span>Adicionar foto</span>
          )}

          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFotoChange}
          />
        </label>

        {foto && (
          <button className="button-text photo-remove" type="button" onClick={removerFoto}>
            Remover foto
          </button>
        )}
      </div>

      <div className="form-group">
        <label>Código de barras</label>
        <div className="input-with-action">
          <input value={produtoEmEdicao?.codigoBarras || codigoBarras} readOnly />
          <span>⌗</span>
        </div>
      </div>

      <div className="form-group">
        <label>Nome do produto</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome do produto"
        />
      </div>

      <div className="form-group">
        <label>Validade</label>
        <input
          type="text"
          inputMode="numeric"
          value={validade}
          onChange={handleValidadeChange}
          placeholder="DD/MM/AAAA"
          maxLength="10"
        />
      </div>

      <div className="form-group">
        <label>Setor</label>
        <select value={setor} onChange={(e) => setSetor(e.target.value)}>
          <option value="">Selecione o setor</option>
          <option value="Laticínios">Laticínios</option>
          <option value="Frios">Frios</option>
          <option value="Padaria">Padaria</option>
          <option value="Mercearia">Mercearia</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Hortifruti">Hortifruti</option>
          <option value="Outros">Outros</option>
        </select>
      </div>

      <div className="form-group">
        <label>Quantidade</label>
        <div className="quantity-field">
          <input
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            placeholder="Informe a quantidade"
          />
          <span>un.</span>
        </div>
      </div>

      <div className="form-group">
        <label>Descrição opcional</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Adicione informações adicionais"
        />
      </div>

      <button className="button-primary" type="submit">
        {editando ? 'Salvar alterações' : 'Salvar produto'}
      </button>

      {onCancelar && (
        <button className="button-text" type="button" onClick={onCancelar}>
          {editando ? 'Cancelar edição' : 'Cancelar cadastro'}
        </button>
      )}
    </form>
  )
}
