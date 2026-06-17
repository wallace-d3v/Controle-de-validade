import { useMemo, useState } from 'react'
import { obterStatus } from '../utils/validade'
import { removerProduto } from '../service/db'

export default function ProductList({ produtos, onAtualizar, onEditarProduto }) {
  const [busca, setBusca] = useState('')
  const [imagemAberta, setImagemAberta] = useState(null)

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

  async function handleRemover(event, id) {
    event.stopPropagation()

    const confirmar = confirm('Deseja remover este produto?')

    if (!confirmar) return

    await removerProduto(id)
    onAtualizar()
  }

  function abrirImagem(event, produto) {
    event.stopPropagation()

    if (!produto.foto) return

    setImagemAberta({
      src: produto.foto,
      alt: produto.nome
    })
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
              <article
                key={produto.id}
                className="product-card"
                onClick={() => onEditarProduto(produto)}
                role="button"
                tabIndex="0"
              >
                <div
                  className={produto.foto ? 'product-thumb product-thumb-clickable' : 'product-thumb'}
                  onClick={(event) => abrirImagem(event, produto)}
                  title={produto.foto ? 'Visualizar imagem' : undefined}
                >
                  {produto.foto ? (
                    <img src={produto.foto} alt={produto.nome} />
                  ) : (
                    produto.nome.charAt(0).toUpperCase()
                  )}
                </div>

                <div className="product-info">
                  <h3>{produto.nome}</h3>
                  <small>{produto.codigoBarras}</small>
                  <small>{produto.setor || 'Sem setor'} • {produto.quantidade} un.</small>
                </div>

                <div className="product-side">
                  <span className={`status-badge ${status.classe}`}>{status.texto}</span>
                  <small>{produto.validade}</small>
                  <button onClick={(event) => handleRemover(event, produto.id)} aria-label="Remover produto">
                    Remover
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {imagemAberta && (
        <div className="image-viewer" onClick={() => setImagemAberta(null)}>
          <div className="image-viewer-content" onClick={(event) => event.stopPropagation()}>
            <button
              className="image-viewer-close"
              onClick={() => setImagemAberta(null)}
              aria-label="Fechar imagem"
            >
              ×
            </button>
            <img src={imagemAberta.src} alt={imagemAberta.alt} />
          </div>
        </div>
      )}
    </div>
  )
}
