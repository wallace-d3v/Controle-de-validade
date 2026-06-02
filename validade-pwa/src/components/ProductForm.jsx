import { useState } from 'react'
import { salvarProduto } from '../service/db'

export default function ProductForm({ codigoBarras, onProdutoSalvo, onCancelar }) {
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
