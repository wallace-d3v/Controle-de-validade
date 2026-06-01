export function calcularDiasRestantes(dataValidade) {
  const hoje = new Date()
  const validade = new Date(dataValidade)

  hoje.setHours(0, 0, 0, 0)
  validade.setHours(0, 0, 0, 0)

  const diferenca = validade - hoje

  return Math.ceil(diferenca / (1000 * 60 * 60 * 24))
}

export function obterStatus(dataValidade) {
  const dias = calcularDiasRestantes(dataValidade)

  if (dias < 0) {
    return {
      texto: 'Vencido',
      classe: 'vencido',
      dias
    }
  }

  if (dias === 0) {
    return {
      texto: 'Vence hoje',
      classe: 'hoje',
      dias
    }
  }

  if (dias <= 7) {
    return {
      texto: `Vence em ${dias} dias`,
      classe: 'alerta',
      dias
    }
  }

  return {
    texto: `Vence em ${dias} dias`,
    classe: 'seguro',
    dias
  }
}