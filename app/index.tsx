"use client"

import { useEffect, useState } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import type { Produto } from "../src/models/Produto"
import type { Receita } from "../src/models/Receita"
import type { Orcamento } from "../src/models/Orcamento"
import type { ItemEstoque } from "../src/models/ItemEstoque"
import { storage } from "../src/services/storageService"
import { Text, Card, Icon, Button } from "@rneui/themed"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { styles } from "@/src/theme/styles"

export default function HomeScreen() {
  const router = useRouter()
  const navigation = useNavigation()
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [estoque, setEstoque] = useState<ItemEstoque[]>([])
  const [produtosFaltantes, setProdutosFaltantes] = useState<{ nome: string; quantidade: number; unidade: string }[]>(
    [],
  )

  useFocusEffect(() => {
    navigation.setOptions({
      title: "Dashboard",
      headerStyle: {
        backgroundColor: "#FFFFFF",
      },
      headerTitleStyle: {
        color: "#333333",
        fontSize: 18,
        fontWeight: "500",
      },
    })
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const o = await storage.getItem<Orcamento[]>("orcamentos")
    const p = await storage.getItem<Produto[]>("produtos")
    const r = await storage.getItem<Receita[]>("receitas")
    const e = await storage.getItem<ItemEstoque[]>("estoque")

    if (o) setOrcamentos(o)
    if (p) setProdutos(p)
    if (r) setReceitas(r)
    if (e) setEstoque(e)

    // Calculate missing stock items
    if (r && e) {
      calcularProdutosFaltantes(r, e)
    }
  }

  const calcularProdutosFaltantes = (receitas: Receita[], estoque: ItemEstoque[]) => {
    const ingredientesNecessarios: Record<string, { quantidade: number; unidade: string }> = {}

    // Collect all ingredients needed from recipes
    receitas.forEach((receita) => {
      receita.ingredientes.forEach((ingrediente) => {
        const nome = ingrediente.nome.toLowerCase()
        const quantidade = Number.parseFloat(ingrediente.quantidade)
        const unidade = ingrediente.unidade

        if (!ingredientesNecessarios[nome]) {
          ingredientesNecessarios[nome] = { quantidade, unidade }
        } else {
          ingredientesNecessarios[nome].quantidade += quantidade
        }
      })
    })

    // Compare with current stock
    const faltantes: { nome: string; quantidade: number; unidade: string }[] = []

    Object.entries(ingredientesNecessarios).forEach(([nome, { quantidade, unidade }]) => {
      const itemEstoque = estoque.find((item) => item.nome.toLowerCase() === nome)

      if (!itemEstoque || itemEstoque.quantidade < quantidade) {
        const quantidadeFaltante = itemEstoque ? quantidade - itemEstoque.quantidade : quantidade
        faltantes.push({
          nome: nome.charAt(0).toUpperCase() + nome.slice(1),
          quantidade: quantidadeFaltante,
          unidade,
        })
      }
    })

    setProdutosFaltantes(faltantes)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR")
  }

  // Get upcoming quotes (last 3)
  const proximosOrcamentos = orcamentos
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Bem-vindo(a)!</Text>
            <Text style={styles.dateText}>{new Date().toLocaleDateString("pt-BR")}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>

          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/receitas/list")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#FFE4E1" }]}>
                <Icon name="cake" type="material" color="#F08080" size={24} />
              </View>
              <Text style={styles.quickActionText}>Receitas</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/estoque/list")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#E6F7FF" }]}>
                <Icon name="package" type="feather" color="#4DA6FF" size={24} />
              </View>
              <Text style={styles.quickActionText}>Estoque</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/produtos/list")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#F0FFF0" }]}>
                <Icon name="shopping-bag" type="feather" color="#66BB6A" size={24} />
              </View>
              <Text style={styles.quickActionText}>Produtos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionItem} onPress={() => router.push("/orcamentos")}>
              <View style={[styles.quickActionIcon, { backgroundColor: "#FFF8E1" }]}>
                <Icon name="file-text" type="feather" color="#FFA726" size={24} />
              </View>
              <Text style={styles.quickActionText}>Orçamentos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Quotes Section */}
        <View style={styles.quotesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Orçamentos Recentes</Text>
            <TouchableOpacity onPress={() => router.push("/orcamentos")}>
              <Text style={styles.viewAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {proximosOrcamentos.length === 0 ? (
            <Card containerStyle={styles.emptyCard}>
              <View style={styles.emptyCardContent}>
                <Icon name="file-text" type="feather" color="#F08080" size={32} />
                <Text style={styles.emptyText}>Nenhum orçamento cadastrado</Text>
              </View>
            </Card>
          ) : (
            proximosOrcamentos.map((orcamento) => (
              <Card key={orcamento.id} containerStyle={styles.quoteCard}>
                <View style={styles.quoteHeader}>
                  <View>
                    <Text style={styles.quoteTitle}>{orcamento.nomeCliente}</Text>
                    <Text style={styles.quoteDate}>Data: {formatDate(orcamento.data)}</Text>
                  </View>
                  <Text style={styles.quoteTotal}>R$ {orcamento.total.toFixed(2)}</Text>
                </View>

                <View style={styles.quoteFooter}>
                  <Text style={styles.quoteProductCount}>
                    {orcamento.produtos.length} {orcamento.produtos.length === 1 ? "produto" : "produtos"}
                  </Text>
                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={() => router.push(`/orcamentos/${orcamento.id}`)}
                  >
                    <Text style={styles.viewDetailsText}>Ver detalhes</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Missing Stock Items Section */}
        <View style={styles.missingStockSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Itens em Falta no Estoque</Text>
            <TouchableOpacity onPress={() => router.push("/estoque/list")}>
              <Text style={styles.viewAllText}>Ver estoque</Text>
            </TouchableOpacity>
          </View>

          {produtosFaltantes.length === 0 ? (
            <Card containerStyle={styles.emptyCard}>
              <View style={styles.emptyCardContent}>
                <Icon name="check-circle" type="feather" color="#4CAF50" size={32} />
                <Text style={styles.emptyText}>Estoque completo!</Text>
              </View>
            </Card>
          ) : (
            <Card containerStyle={styles.missingStockCard}>
              {produtosFaltantes.map((item, index) => (
                <View key={index}>
                  {index > 0 && <View style={styles.itemDivider} />}
                  <View style={styles.missingStockItem}>
                    <View style={styles.missingStockIconContainer}>
                      <Icon name="alert-circle" type="feather" color="#FF6B6B" size={20} />
                    </View>
                    <View style={styles.missingStockInfo}>
                      <Text style={styles.missingStockName}>{item.nome}</Text>
                      <Text style={styles.missingStockQuantity}>
                        Faltando: {item.quantidade} {item.unidade}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              <Button
                title="Adicionar ao Estoque"
                onPress={() => router.push("/estoque/add")}
                buttonStyle={styles.addToStockButton}
                titleStyle={styles.addToStockButtonText}
                icon={{
                  name: "plus",
                  type: "feather",
                  color: "white",
                  size: 16,
                }}
                iconPosition="left"
              />
            </Card>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Resumo</Text>

          <View style={styles.statsGrid}>
            <Card containerStyle={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: "#FFE4E1" }]}>
                  <Icon name="cake" type="material" color="#F08080" size={24} />
                </View>
                <Text style={styles.statValue}>{receitas.length}</Text>
                <Text style={styles.statLabel}>Receitas</Text>
              </View>
            </Card>

            <Card containerStyle={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: "#E6F7FF" }]}>
                  <Icon name="package" type="feather" color="#4DA6FF" size={24} />
                </View>
                <Text style={styles.statValue}>{estoque.length}</Text>
                <Text style={styles.statLabel}>Itens em Estoque</Text>
              </View>
            </Card>

            <Card containerStyle={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: "#F0FFF0" }]}>
                  <Icon name="shopping-bag" type="feather" color="#66BB6A" size={24} />
                </View>
                <Text style={styles.statValue}>{produtos.length}</Text>
                <Text style={styles.statLabel}>Produtos</Text>
              </View>
            </Card>

            <Card containerStyle={styles.statCard}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: "#FFF8E1" }]}>
                  <Icon name="file-text" type="feather" color="#FFA726" size={24} />
                </View>
                <Text style={styles.statValue}>{orcamentos.length}</Text>
                <Text style={styles.statLabel}>Orçamentos</Text>
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
