// src/services/pdfService.ts
import * as Print from 'expo-print'
import * as Sharing from 'expo-sharing'
import { Alert } from 'react-native'
import { ProdutoOrcamento } from '../models/Orcamento'

interface OrcamentoPDFParams {
  nomeEmpresa: string
  cnpjEmpresa: string
  nomeCliente: string
  cpfCnpjCliente: string
  formaPagamento: string
  produtosSelecionados: ProdutoOrcamento[]
  desconto: string
  total: number
}

export async function gerarOrcamentoPDF({
  nomeEmpresa,
  cnpjEmpresa,
  nomeCliente,
  cpfCnpjCliente,
  formaPagamento,
  produtosSelecionados,
  desconto,
  total,
}: OrcamentoPDFParams) {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; color: #333; }
          h1 { color: #F08080; text-align: center; }
          p, li { font-size: 14px; margin-bottom: 6px; }
          ul { padding-left: 20px; }
          .section { margin-top: 20px; }
          .total { font-weight: bold; font-size: 16px; margin-top: 20px; color: #000; }
        </style>
      </head>
      <body>
        <h1>Orçamento</h1>
        <div class="section">
          <p><strong>Empresa:</strong> ${nomeEmpresa}</p>
          <p><strong>CNPJ:</strong> ${cnpjEmpresa}</p>
        </div>
        <div class="section">
          <p><strong>Cliente:</strong> ${nomeCliente}</p>
          <p><strong>CPF/CNPJ:</strong> ${cpfCnpjCliente}</p>
        </div>
        <div class="section">
          <p><strong>Forma de Pagamento:</strong> ${formaPagamento}</p>
        </div>
        <div class="section">
          <p><strong>Produtos:</strong></p>
          <ul>
            ${produtosSelecionados
              .map((p) => `<li>${p.produto.nome} x ${p.quantidade} - R$ ${(p.produto.valor * p.quantidade).toFixed(2)}</li>`)
              .join('')}
          </ul>
        </div>
        <div class="section">
          <p><strong>Desconto:</strong> R$ ${parseFloat(desconto || '0').toFixed(2)}</p>
          <p class="total">Total: R$ ${total.toFixed(2)}</p>
        </div>
      </body>
    </html>
  `

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent })
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri)
    } else {
      Alert.alert('PDF gerado em:', uri)
    }
  } catch (error: any) {
    Alert.alert('Erro ao gerar PDF', error.message)
  }
}
