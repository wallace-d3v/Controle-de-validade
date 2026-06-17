import { useEffect, useState } from 'react'
import {
  buscarProdutoPorCodigoBarras,
  produtoJaCadastradoComValidade,
  salvarProduto
} from '../service/db'

export default function ProductForm({ codigoBarras, onProdutoSalvo, onCancelar }) {
  const [nome, setNome] = useState('')
  const [validade, setValidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [setor, setSetor] = useState('')
  const [foto, setFoto] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')

  useEffect(() => {
    async function preencherProdutoSalvo() {
      if (!codigoBarras) return

      const produtoSalvo = await buscarProdutoPorCodigoBarras(codigoBarras)

      if (!produtoSalvo) return

      setNome(produtoSalvo.nome || '')
      setSetor(produtoSalvo.setor || '')
      setDescricao(produtoSalvo.descricao || '')
      setFoto(produtoSalvo.foto || '')
    }

    preencherProdutoSalvo()
  }, [codigoBarras])

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

  function removerFoto() {
    setFoto('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagemErro('')

    if (!codigoBarras || !nome || !validade) {
      setMensagemErro('Preencha código, nome e validade.')
      return
    }

    const jaExiste = await produtoJaCadastradoComValidade(codigoBarras, validade)

    if (jaExiste) {
      setMensagemErro('Esse produto já foi cadastrado com essa data de validade.')
      return
    }

    const produto = {
      codigoBarras,
      nome,
      validade,
      descricao,
      quantidade: Number(quantidade),
      setor,
      foto,
      criadoEm: new Date().toISOString()
    }

    await salvarProduto(produto)

    setNome('')
    setValidade('')
    setDescricao('')
    setQuantidade(1)
    setSetor('')
    setFoto('')
    setMensagemErro('')

    onProdutoSalvo()
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
          <input value={codigoBarras} readOnly />
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
          type="date"
          value={validade}
          onChange={(e) => setValidade(e.target.value)}
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

      <button className="button-primary" type="submit">Salvar produto</button>

      {onCancelar && (
        <button className="button-text" type="button" onClick={onCancelar}>
          Cancelar cadastro
        </button>
      )}
    </form>
  )
}
