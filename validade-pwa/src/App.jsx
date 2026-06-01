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
  const [mostrarScanner, setMostrarScanner] = useState(false)

  async function carregarProdutos() {
    const dados = await listarProdutos()
    setProdutos(dados)
  }

  useEffect(() => {
    carregarProdutos()
  }, [])

  function handleScan(codigo) {
    setCodigoBarras(codigo)
    setMostrarScanner(false)
  }

  function handleProdutoSalvo() {
    setCodigoBarras('')
    carregarProdutos()
    alert('Produto salvo com sucesso.')
  }

  return (
    <div className="app">
      <header>
        <h1>Controle de Validade</h1>
        <p>PWA para controle de vencimento de produtos</p>
      </header>

      <Dashboard produtos={produtos} />

      <section className="actions">
        <button onClick={() => setMostrarScanner(true)}>
          Escanear produto
        </button>

        <button onClick={() => setCodigoBarras('MANUAL')}>
          Cadastrar manualmente
        </button>
      </section>

      {mostrarScanner && (
        <Scanner onScan={handleScan} />
      )}

      {codigoBarras && (
        <ProductForm
          codigoBarras={codigoBarras}
          onProdutoSalvo={handleProdutoSalvo}
        />
      )}

      <ProductList
        produtos={produtos}
        onAtualizar={carregarProdutos}
      />
    </div>
  )
}
