import { useMemo, useState } from 'react'
import { obterStatus } from '../utils/validade'
import { removerProduto } from '../service/db'

export default function ProductList({ produtos, onAtualizar }) {
  const [busca, setBusca] = useState('')

  const produtosFiltrados = useMemo(() => {
    return produtos
      .filter((produto) => {
        const termo = busca.toLowerCase().trim()
        if (!termo) return true

        return (
          produto.nome.toLowerCase().includes(termo) ||
          String(produto.codigoBarras).toLowerCase().includes(termo) ||
          String(produto.setor || '').toLowerCase().includes(termo)
        )
      })
      .sort((a, b) => new Date(a.validade) - new Date(b.validade))
  }, [produtos, busca])

  async function handleRemover(id) {
    const confirmar = confirm('Deseja remover este produto?')

    if (!confirmar) return

    await removerProduto(id)
    onAtualizar()
  }

  return (
    <div className="lista">
      <div className="search-box">
        <span>⌕</span>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produto ou código"
        />
      </div>

      <div className="list-meta">
        <span>{produtosFiltrados.length} produtos</span>
        <span>Ordenar: Validade</span>
      </div>

      {produtosFiltrados.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum produto encontrado</strong>
          <p>Cadastre um produto ou ajuste sua busca.</p>
        </div>
      ) : (
        <div className="product-list">
          {produtosFiltrados.map((produto) => {
            const status = obterStatus(produto.validade)

            return (
              <article key={produto.id} className="product-card">
                <div className="product-thumb">{produto.nome.charAt(0).toUpperCase()}</div>

                <div className="product-info">
                  <h3>{produto.nome}</h3>
                  <small>{produto.codigoBarras}</small>
                  <small>{produto.setor || 'Sem setor'} • {produto.quantidade} un.</small>
                </div>

                <div className="product-side">
                  <span className={`status-badge ${status.classe}`}>{status.texto}</span>
                  <small>{produto.validade}</small>
                  <button onClick={() => handleRemover(produto.id)} aria-label="Remover produto">
                    Remover
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
