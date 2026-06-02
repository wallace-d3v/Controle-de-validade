import { obterStatus } from '../utils/validade'

export default function Dashboard({ produtos, onEscanear, onCadastrarManual, onVerProdutos }) {
  const vencidos = produtos.filter(
    (produto) => obterStatus(produto.validade).classe === 'vencido'
  ).length

  const hoje = produtos.filter(
    (produto) => obterStatus(produto.validade).classe === 'hoje'
  ).length

  const alerta = produtos.filter(
    (produto) => obterStatus(produto.validade).classe === 'alerta'
  ).length

  const seguros = produtos.filter(
    (produto) => obterStatus(produto.validade).classe === 'seguro'
  ).length

  const recentes = [...produtos].reverse().slice(0, 3)

  return (
    <section className="page dashboard-page">
      <header className="hero-header">
        <div className="app-icon">▣</div>
        <div>
          <h1>Controle de Validade</h1>
          <p>Acompanhe produtos e vencimentos</p>
        </div>
      </header>

      <div className="dashboard">
        <div className="box vencido">
          <small>Vencidos</small>
          <span>{vencidos}</span>
        </div>

        <div className="box hoje">
          <small>Vence hoje</small>
          <span>{hoje}</span>
        </div>

        <div className="box alerta">
          <small>Próximos 7 dias</small>
          <span>{alerta}</span>
        </div>

        <div className="box seguro">
          <small>Seguros</small>
          <span>{seguros}</span>
        </div>
      </div>

      <section className="actions-stack">
        <button className="button-primary" onClick={onEscanear}>
          <span>⌗</span>
          Escanear produto
        </button>

        <button className="button-secondary" onClick={onCadastrarManual}>
          <span>＋</span>
          Cadastrar manualmente
        </button>
      </section>

      <section className="recent-section">
        <div className="section-title">
          <h2>Produtos recentes</h2>
          <button onClick={onVerProdutos}>Ver todos</button>
        </div>

        {recentes.length === 0 ? (
          <div className="empty-state">
            <strong>Nenhum produto cadastrado</strong>
            <p>Cadastre o primeiro produto para começar o controle.</p>
          </div>
        ) : (
          <div className="mini-list">
            {recentes.map((produto) => {
              const status = obterStatus(produto.validade)

              return (
                <article key={produto.id} className="mini-card">
                  <div className="product-thumb">
                    {produto.foto ? (
                      <img src={produto.foto} alt={produto.nome} />
                    ) : (
                      produto.nome.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="mini-card-info">
                    <strong>{produto.nome}</strong>
                    <small>{produto.codigoBarras}</small>
                    <small>{produto.setor || 'Sem setor'} • {produto.quantidade} un.</small>
                  </div>
                  <div className="mini-card-status">
                    <span className={`status-badge ${status.classe}`}>{status.texto}</span>
                    <small>{produto.validade}</small>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}
