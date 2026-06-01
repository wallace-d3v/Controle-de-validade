import { obterStatus } from '../utils/validade'

export default function Dashboard({ produtos }) {
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

                                  return (
                                      <div className="dashboard">
                                            <div className="box vencido">
                                                    <span>{vencidos}</span>
                                                            <p>Vencidos</p>
                                                                  </div>

                                                                        <div className="box hoje">
                                                                                <span>{hoje}</span>
                                                                                        <p>Vencem hoje</p>
                                                                                              </div>

                                                                                                    <div className="box alerta">
                                                                                                            <span>{alerta}</span>
                                                                                                                    <p>Até 7 dias</p>
                                                                                                                          </div>

                                                                                                                                <div className="box seguro">
                                                                                                                                        <span>{seguros}</span>
                                                                                                                                                <p>Seguros</p>
                                                                                                                                                      </div>
                                                                                                                                                          </div>
                                                                                                                                                            )
                                                                                                                                                            }