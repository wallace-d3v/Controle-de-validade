import { obterStatus } from '../utils/validade'
import { removerProduto } from '../services/db'

export default function ProductList({ produtos, onAtualizar }) {
  async function handleRemover(id) {
    const confirmar = confirm('Deseja remover este produto?')

    if (!confirmar) return

    await removerProduto(id)
    onAtualizar()
  }

  if (produtos.length === 0) {
    return <p>Nenhum produto cadastrado.</p>
  }

  return (
    <div className="lista">
      <h2>Produtos cadastrados</h2>

      {produtos.map((produto) => {
        const status = obterStatus(produto.validade)

        return (
          <div key={produto.id} className={`card ${status.classe}`}>
            <h3>{produto.nome}</h3>

            <p><strong>Código:</strong> {produto.codigoBarras}</p>
            <p><strong>Validade:</strong> {produto.validade}</p>
            <p><strong>Status:</strong> {status.texto}</p>
            <p><strong>Setor:</strong> {produto.setor || 'Não informado'}</p>
            <p><strong>Quantidade:</strong> {produto.quantidade}</p>

            {produto.descricao && (
              <p><strong>Descrição:</strong> {produto.descricao}</p>
            )}

            <button onClick={() => handleRemover(produto.id)}>
              Remover
            </button>
          </div>
        )
      })}
    </div>
  )
}