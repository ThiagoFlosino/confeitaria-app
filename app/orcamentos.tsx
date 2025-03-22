import React, { useEffect, useState } from 'react'
import { View, FlatList, KeyboardAvoidingView, Platform, Alert, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Produto } from '../src/models/Produto'
import { Orcamento, ProdutoOrcamento } from '../src/models/Orcamento'
import { storage } from '../src/services/storageService'
import { Input, Button, Text, Card, Divider, ListItem, Icon } from '@rneui/themed'
import { gerarOrcamentoPDF } from '../src/services/pdfService'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { styles } from '@/src/theme/styles'

export default function OrcamentosScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [nomeEmpresa, setNomeEmpresa] = useState('')
  const [cnpjEmpresa, setCnpjEmpresa] = useState('')
  const [nomeCliente, setNomeCliente] = useState('')
  const [cpfCnpjCliente, setCpfCnpjCliente] = useState('')
  const [formaPagamento, setFormaPagamento] = useState<'dinheiro' | 'avista' | 'parcelado'>('dinheiro')
  const [produtoFiltro, setProdutoFiltro] = useState('')
  const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoOrcamento[]>([])
  const [desconto, setDesconto] = useState('0')
  const [showProductSelector, setShowProductSelector] = useState(false)

  useFocusEffect(() => {
    navigation.setOptions({ 
      title: 'Orçamentos',
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerTitleStyle: {
        color: '#333333',
        fontSize: 18,
        fontWeight: '500',
      },
      headerTintColor: '#F08080',
    });
  });

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const p = await storage.getItem<Produto[]>('produtos')
    const o = await storage.getItem<Orcamento[]>('orcamentos')
    if (p) setProdutos(p)
    if (o) setOrcamentos(o)
  }

  const toggleProduto = (produto: Produto) => {
    const index = produtosSelecionados.findIndex(p => p.produto.id === produto.id)
    if (index >= 0) {
      const updated = produtosSelecionados.filter(p => p.produto.id !== produto.id)
      setProdutosSelecionados(updated)
    } else {
      setProdutosSelecionados([...produtosSelecionados, { produto, quantidade: 1 }])
    }
  }

  const atualizarQuantidade = (produtoId: string, qtd: number) => {
    const novaLista = produtosSelecionados.map(p => {
      if (p.produto.id === produtoId) {
        return { ...p, quantidade: qtd }
      }
      return p
    })
    setProdutosSelecionados(novaLista)
  }

  const calcularTotal = () => {
    const total = produtosSelecionados.reduce((acc, item) => {
      return acc + item.produto.valor * item.quantidade
    }, 0)
    return total - parseFloat(desconto || '0')
  }

  const salvarOrcamento = async () => {
    if (!nomeCliente || produtosSelecionados.length === 0) {
      Alert.alert('Erro', 'Preencha o nome do cliente e selecione pelo menos um produto')
      return
    }

    const novo: Orcamento = {
      id: Date.now().toString(),
      data: new Date().toISOString(),
      nomeCliente,
      cnpjCliente: cpfCnpjCliente,
      descricao: 'Pedido via app',
      formaPagamento,
      produtos: produtosSelecionados,
      desconto: parseFloat(desconto || '0'),
      valorTotal: calcularTotal(),
      total: calcularTotal(),
      dadosEmpresa: {
        nome: nomeEmpresa,
        cnpj: cnpjEmpresa,
      },
    }
    const lista = [...orcamentos, novo]
    setOrcamentos(lista)
    await storage.setItem('orcamentos', lista)
    
    // Reset form
    setNomeEmpresa('')
    setCnpjEmpresa('')
    setNomeCliente('')
    setCpfCnpjCliente('')
    setFormaPagamento('dinheiro')
    setProdutosSelecionados([])
    setDesconto('0')
    
    Alert.alert('Sucesso', 'Orçamento salvo com sucesso!')
  }

  const gerarPDF = async () => {
    if (!nomeCliente || produtosSelecionados.length === 0) {
      Alert.alert('Erro', 'Preencha o nome do cliente e selecione pelo menos um produto')
      return
    }
    
    try {
      await gerarOrcamentoPDF({ 
        nomeEmpresa, 
        cnpjEmpresa, 
        nomeCliente, 
        cpfCnpjCliente, 
        formaPagamento, 
        produtosSelecionados, 
        desconto, 
        total: calcularTotal() 
      })
      Alert.alert('Sucesso', 'PDF gerado com sucesso!')
    } catch (error: any) {
      Alert.alert('Erro ao gerar PDF', error.message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.flex1}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Novo Orçamento</Text>
            
            <Card containerStyle={styles.formCard}>
              <View style={styles.iconContainer}>
                <Icon
                  name="file-text"
                  type="feather"
                  color="#F08080"
                  size={32}
                />
              </View>
              
              {/* Company Information */}
              <Text style={styles.formGroupTitle}>Dados da Empresa</Text>
              <Input
                placeholder="Nome da Empresa"
                value={nomeEmpresa}
                onChangeText={setNomeEmpresa}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                leftIcon={
                  <Icon
                    name="briefcase"
                    type="feather"
                    color="#F08080"
                    size={20}
                  />
                }
              />
              
              <Input
                placeholder="CNPJ (opcional)"
                value={cnpjEmpresa}
                onChangeText={setCnpjEmpresa}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                leftIcon={
                  <Icon
                    name="hash"
                    type="feather"
                    color="#F08080"
                    size={20}
                  />
                }
              />
              
              <Divider style={styles.divider} />
              
              {/* Client Information */}
              <Text style={styles.formGroupTitle}>Dados do Cliente</Text>
              <Input
                placeholder="Nome do Cliente"
                value={nomeCliente}
                onChangeText={setNomeCliente}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                leftIcon={
                  <Icon
                    name="user"
                    type="feather"
                    color="#F08080"
                    size={20}
                  />
                }
              />
              
              <Input
                placeholder="CPF/CNPJ do Cliente"
                value={cpfCnpjCliente}
                onChangeText={setCpfCnpjCliente}
                inputContainerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                leftIcon={
                  <Icon
                    name="hash"
                    type="feather"
                    color="#F08080"
                    size={20}
                  />
                }
              />
              
              <Divider style={styles.divider} />
              
              {/* Payment Method */}
              <Text style={styles.formGroupTitle}>Forma de Pagamento</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    formaPagamento === 'dinheiro' && styles.paymentOptionSelected
                  ]}
                  onPress={() => setFormaPagamento('dinheiro')}
                >
                  <Icon
                    name="dollar-sign"
                    type="feather"
                    color={formaPagamento === 'dinheiro' ? '#F08080' : '#757575'}
                    size={20}
                  />
                  <Text style={[
                    styles.paymentOptionText,
                    formaPagamento === 'dinheiro' && styles.paymentOptionTextSelected
                  ]}>
                    Dinheiro
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    formaPagamento === 'avista' && styles.paymentOptionSelected
                  ]}
                  onPress={() => setFormaPagamento('avista')}
                >
                  <Icon
                    name="credit-card"
                    type="feather"
                    color={formaPagamento === 'avista' ? '#F08080' : '#757575'}
                    size={20}
                  />
                  <Text style={[
                    styles.paymentOptionText,
                    formaPagamento === 'avista' && styles.paymentOptionTextSelected
                  ]}>
                    À Vista
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    formaPagamento === 'parcelado' && styles.paymentOptionSelected
                  ]}
                  onPress={() => setFormaPagamento('parcelado')}
                >
                  <Icon
                    name="calendar"
                    type="feather"
                    color={formaPagamento === 'parcelado' ? '#F08080' : '#757575'}
                    size={20}
                  />
                  <Text style={[
                    styles.paymentOptionText,
                    formaPagamento === 'parcelado' && styles.paymentOptionTextSelected
                  ]}>
                    Parcelado
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Divider style={styles.divider} />
              
              {/* Products */}
              <Text style={styles.formGroupTitle}>Produtos</Text>
              <TouchableOpacity
                style={styles.productSelector}
                onPress={() => setShowProductSelector(!showProductSelector)}
              >
                <Text style={styles.productSelectorText}>
                  {produtosSelecionados.length > 0 
                    ? `${produtosSelecionados.length} produtos selecionados` 
                    : 'Selecione os produtos'}
                </Text>
                <Icon
                  name={showProductSelector ? "chevron-up" : "chevron-down"}
                  type="feather"
                  color="#757575"
                  size={20}
                />
              </TouchableOpacity>
              
              {showProductSelector && (
                <View style={styles.productListContainer}>
                  <Input
                    placeholder="Buscar Produto"
                    value={produtoFiltro}
                    onChangeText={setProdutoFiltro}
                    inputContainerStyle={styles.searchInputContainer}
                    inputStyle={styles.inputText}
                    leftIcon={
                      <Icon
                        name="search"
                        type="feather"
                        color="#F08080"
                        size={20}
                      />
                    }
                  />
                  
                  <View style={styles.productList}>
                    {produtos
                      .filter(p => p.nome.toLowerCase().includes(produtoFiltro.toLowerCase()))
                      .map(produto => {
                        const selecionado = produtosSelecionados.find(p => p.produto.id === produto.id);
                        return (
                          <ListItem
                            key={produto.id}
                            containerStyle={[
                              styles.productItem,
                              selecionado && styles.productItemSelected
                            ]}
                            onPress={() => toggleProduto(produto)}
                          >
                            <ListItem.CheckBox
                              checked={!!selecionado}
                              onPress={() => toggleProduto(produto)}
                              checkedColor="#F08080"
                              uncheckedColor="#CCCCCC"
                            />
                            <ListItem.Content>
                              <ListItem.Title style={styles.productItemTitle}>
                                {produto.nome}
                              </ListItem.Title>
                              <ListItem.Subtitle style={styles.productItemSubtitle}>
                                R$ {produto.valor.toFixed(2)} / {produto.tipoPreco}
                              </ListItem.Subtitle>
                            </ListItem.Content>
                            {selecionado && (
                              <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                  style={styles.quantityButton}
                                  onPress={() => atualizarQuantidade(produto.id, Math.max(1, (selecionado.quantidade - 1)))}
                                >
                                  <Icon name="minus" type="feather" size={16} color="#F08080" />
                                </TouchableOpacity>
                                <Text style={styles.quantityText}>{selecionado.quantidade}</Text>
                                <TouchableOpacity
                                  style={styles.quantityButton}
                                  onPress={() => atualizarQuantidade(produto.id, selecionado.quantidade + 1)}
                                >
                                  <Icon name="plus" type="feather" size={16} color="#F08080" />
                                </TouchableOpacity>
                              </View>
                            )}
                          </ListItem>
                        );
                      })}
                  </View>
                </View>
              )}
              
              {produtosSelecionados.length > 0 && (
                <View style={styles.selectedProductsContainer}>
                  <Text style={styles.selectedProductsTitle}>Produtos Selecionados:</Text>
                  {produtosSelecionados.map((item) => (
                    <View key={item.produto.id} style={styles.selectedProductItem}>
                      <Text style={styles.selectedProductName}>{item.produto.nome}</Text>
                      <Text style={styles.selectedProductDetails}>
                        {item.quantidade} x R$ {item.produto.valor.toFixed(2)} = R$ {(item.quantidade * item.produto.valor).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              <Divider style={styles.divider} />
              
              {/* Discount and Total */}
              <View style={styles.totalSection}>
                <Input
                  placeholder="Desconto (R$)"
                  value={desconto}
                  onChangeText={setDesconto}
                  keyboardType="numeric"
                  inputContainerStyle={styles.inputContainer}
                  inputStyle={styles.inputText}
                  leftIcon={
                    <Icon
                      name="tag"
                      type="feather"
                      color="#F08080"
                      size={20}
                    />
                  }
                />
                
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>R$ {calcularTotal().toFixed(2)}</Text>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Button
                  title="Salvar Orçamento"
                  onPress={salvarOrcamento}
                  buttonStyle={styles.saveButton}
                  titleStyle={styles.buttonText}
                  icon={{
                    name: 'save',
                    type: 'feather',
                    color: 'white',
                    size: 20,
                  }}
                  iconPosition="right"
                />
                
                <Button
                  title="Gerar PDF"
                  onPress={gerarPDF}
                  buttonStyle={styles.pdfButton}
                  titleStyle={styles.buttonText}
                  icon={{
                    name: 'file-text',
                    type: 'feather',
                    color: 'white',
                    size: 20,
                  }}
                  iconPosition="right"
                />
              </View>
            </Card>
          </View>
          
          {/* Saved Quotes Section */}
          <View style={styles.savedQuotesSection}>
            <Text style={styles.sectionTitle}>Orçamentos Salvos</Text>
            
            {orcamentos.length === 0 ? (
              <Card containerStyle={styles.emptyCard}>
                <View style={styles.emptyCardContent}>
                  <Icon
                    name="file-text"
                    type="feather"
                    color="#F08080"
                    size={48}
                  />
                  <Text style={styles.emptyText}>
                    Nenhum orçamento cadastrado.
                  </Text>
                  <Text style={styles.emptySubText}>
                    Preencha o formulário acima para adicionar orçamentos.
                  </Text>
                </View>
              </Card>
            ) : (
              orcamentos.map((orcamento) => (
                <Card key={orcamento.id} containerStyle={styles.quoteCard}>
                  <View style={styles.quoteHeader}>
                    <View>
                      <Text style={styles.quoteTitle}>{orcamento.nomeCliente}</Text>
                      <Text style={styles.quoteDate}>Data: {formatDate(orcamento.data)}</Text>
                    </View>
                    <Text style={styles.quoteTotal}>R$ {orcamento.total.toFixed(2)}</Text>
                  </View>
                  
                  <Divider style={styles.quoteDivider} />
                  
                  <View style={styles.quoteDetails}>
                    <Text style={styles.quoteDetailTitle}>Empresa:</Text>
                    <Text style={styles.quoteDetailText}>{orcamento.dadosEmpresa.nome}</Text>
                  </View>
                  
                  <View style={styles.quoteDetails}>
                    <Text style={styles.quoteDetailTitle}>Pagamento:</Text>
                    <Text style={styles.quoteDetailText}>{orcamento.formaPagamento}</Text>
                  </View>
                  
                  <View style={styles.quoteProducts}>
                    <Text style={styles.quoteDetailTitle}>Produtos:</Text>
                    {orcamento.produtos.map((p, idx) => (
                      <Text key={`${orcamento.id}-${p.produto.id}`} style={styles.quoteProductItem}>
                        • {p.produto.nome} x {p.quantidade}
                      </Text>
                    ))}
                  </View>
                  
                  <View style={styles.quoteFooter}>
                    <View style={styles.quoteFooterItem}>
                      <Text style={styles.quoteDetailTitle}>Desconto:</Text>
                      <Text style={styles.quoteDetailText}>R$ {(orcamento.desconto || 0).toFixed(2)}</Text>
                    </View>
                    <View style={styles.quoteFooterItem}>
                      <Text style={styles.quoteDetailTitle}>Total:</Text>
                      <Text style={styles.quoteTotalValue}>R$ {(orcamento.total || 0).toFixed(2)}</Text>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}