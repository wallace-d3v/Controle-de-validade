import { useEffect, useState } from 'react'

import './styles/base.css'
import './styles/layout.css'
import './styles/buttons.css'
import './styles/dashboard.css'
import './styles/form.css'
import './styles/scanner.css'
import './styles/product-list.css'

import Scanner from './components/Scanner'
import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import Dashboard from './components/Dashboard'

import { listarProdutos } from './service/db'

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [codigoBarras, setCodigoBarras] = useState('')
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null)
  const [mostrarScanner, setMostrarScanner] = useState(false)
  const [telaAtual, setTelaAtual] = useState('inicio')

  async function carregarProdutos() {
    const dados = await listarProdutos()
    setProdutos(dados)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  function abrirScanner() {
    setProdutoEmEdicao(null)
    setMostrarScanner(true)
    setTelaAtual('cadastro')
  }

  function abrirCadastroManual() {
    setProdutoEmEdicao(null)
    setCodigoBarras('MANUAL')
    setMostrarScanner(false)
    setTelaAtual('cadastro')
  }

  function abrirEdicaoProduto(produto) {
    setProdutoEmEdicao(produto)
    setCodigoBarras(produto.codigoBarras)
    setMostrarScanner(false)
    setTelaAtual('cadastro')
  }

  function handleScan(codigo) {
    setCodigoBarras(codigo)
    setMostrarScanner(false)
  }

  function handleProdutoSalvo(editando = false) {
    setCodigoBarras('')
    setProdutoEmEdicao(null)
    setMostrarScanner(false)
    setTelaAtual(editando ? 'produtos' : 'inicio')
    carregarProdutos()
    alert(editando ? 'Produto atualizado com sucesso.' : 'Produto salvo com sucesso.')
  }

  function cancelarCadastro() {
    setCodigoBarras('')
    setProdutoEmEdicao(null)
    setMostrarScanner(false)
    setTelaAtual('inicio')
  }

  return (
    <div className="app-shell">
      <main className="app-screen">
        {telaAtual === 'inicio' && (
          <Dashboard
            produtos={produtos}
            onEscanear={abrirScanner}
            onCadastrarManual={abrirCadastroManual}
            onVerProdutos={() => setTelaAtual('produtos')}
          />
        )}

        {telaAtual === 'cadastro' && (
          <section className="page page-form">
            <div className="topbar">
              <button className="icon-button" onClick={cancelarCadastro} aria-label="Voltar">
                ←
              </button>
              <h1>{produtoEmEdicao ? 'Editar produto' : 'Cadastro de produto'}</h1>
              <span className="topbar-space" />
            </div>

            {mostrarScanner && (
              <Scanner onScan={handleScan} />
            )}

            {!mostrarScanner && !codigoBarras && !produtoEmEdicao && (
              <div className="empty-state compact">
                <strong>Nenhum código informado</strong>
                <p>Escaneie o produto ou cadastre manualmente.</p>
                <div className="empty-actions">
                  <button onClick={abrirScanner}>Escanear produto</button>
                  <button className="button-secondary" onClick={abrirCadastroManual}>Cadastrar manualmente</button>
                </div>
              </div>
            )}

            {(codigoBarras || produtoEmEdicao) && (
              <ProductForm
                codigoBarras={codigoBarras}
                produtoEmEdicao={produtoEmEdicao}
                onProdutoSalvo={handleProdutoSalvo}
                onCancelar={cancelarCadastro}
              />
            )}
          </section>
        )}

        {telaAtual === 'produtos' && (
          <section className="page">
            <div className="topbar">
              <span className="topbar-space" />
              <h1>Produtos</h1>
              <button className="icon-button" aria-label="Filtrar produtos">⌕</button>
            </div>

            <ProductList
              produtos={produtos}
              onAtualizar={carregarProdutos}
              onEditarProduto={abrirEdicaoProduto}
            />
          </section>
        )}
      </main>

      <nav className="bottom-nav" aria-label="Navegação principal">
        <button
          className={telaAtual === 'inicio' ? 'active' : ''}
          onClick={() => setTelaAtual('inicio')}
        >
          <span>⌂</span>
          Início
        </button>

        <button
          className={telaAtual === 'produtos' ? 'active' : ''}
          onClick={() => setTelaAtual('produtos')}
        >
          <span>☷</span>
          Produtos
        </button>

        <button
          className={telaAtual === 'cadastro' ? 'active' : ''}
          onClick={abrirCadastroManual}
        >
          <span>＋</span>
          Cadastro
        </button>
      </nav>
    </div>
  )
}
