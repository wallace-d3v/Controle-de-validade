import { useState } from 'react'
import { salvarProduto } from '../services/db'

export default function ProductForm({ codigoBarras, onProdutoSalvo }) {
  const [nome, setNome] = useState('')
  const [validade, setValidade] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [setor, setSetor] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!codigoBarras || !nome || !validade) {
      alert('Preencha código, nome e validade.')
      return
    }

    const produto = {
      codigoBarras,
      nome,
      validade,
      descricao,
      quantidade: Number(quantidade),
      setor,
      criadoEm: new Date().toISOString()
    }

    await salvarProduto(produto)

    setNome('')
    setValidade('')
    setDescricao('')
    setQuantidade(1)
    setSetor('')

    onProdutoSalvo()
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Cadastrar produto</h2>

      <label>Código de barras</label>
      <input value={codigoBarras} readOnly />

      <label>Nome do produto</label>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Ex: Leite Integral"
      />

      <label>Validade</label>
      <input
        type="date"
        value={validade}
        onChange={(e) => setValidade(e.target.value)}
      />

      <label>Setor</label>
      <input
        value={setor}
        onChange={(e) => setSetor(e.target.value)}
        placeholder="Ex: Laticínios"
      />

      <label>Quantidade</label>
      <input
        type="number"
        min="1"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />

      <label>Descrição opcional</label>
      <textarea
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Ex: Caixa 1L"
      />

      <button type="submit">Salvar produto</button>
    </form>
  )
}