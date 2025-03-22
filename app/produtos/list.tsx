"use client"

import React, { useState } from "react"
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import type { Produto } from "../../src/models/Produto"
import type { Receita } from "../../src/models/Receita"
import { storage } from "../../src/services/storageService"
import { Text, Card, FAB, Icon } from "@rneui/themed"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { styles } from "@/src/theme/styles"

export default function ProdutosListScreen() {
    const router = useRouter()
    const navigation = useNavigation()
    const [produtos, setProdutos] = useState<Produto[]>([])
    const [receitas, setReceitas] = useState<Receita[]>([])

    useFocusEffect(() => {
        navigation.setOptions({
            title: "Produtos",
            headerStyle: {
                backgroundColor: "#FFFFFF",
            },
            headerTitleStyle: {
                color: "#333333",
                fontSize: 18,
                fontWeight: "500",
            },
            headerTintColor: "#F08080",
        })
    })

    useFocusEffect(
        React.useCallback(() => {
            loadData()
        }, []),
    )

    const loadData = async () => {
        const r = await storage.getItem<Receita[]>("receitas")
        const p = await storage.getItem<Produto[]>("produtos")
        if (r) setReceitas(r)
        if (p) setProdutos(p)
    }

    const getReceitasNomes = (receitaIds: string[]) => {
        if (!receitaIds || receitaIds.length === 0) return "Nenhuma receita"

        return receitaIds
            .map((id) => {
                const receita = receitas.find((r) => r.id === id)
                return receita ? receita.nome : ""
            })
            .filter(Boolean)
            .join(", ")
    }

    const renderCardProduto = ({ item }: { item: Produto }) => {
        // Handle both old format (single receitaId) and new format (array of receitaIds)
        const receitaIds = Array.isArray(item.receitaIds) ? item.receitaIds : item.receitaIds ? [item.receitaIds] : []

        return (
            <TouchableOpacity onPress={() => router.push(`/produtos/add?idProduto=${item.id}`)} activeOpacity={0.7}>
                <Card containerStyle={styles.productCard}>
                    <View style={styles.productCardHeader}>
                        <View style={styles.productIconContainer}>
                            <Icon name="cake" type="material" color="#F08080" size={24} />
                        </View>
                        <View style={styles.productTitleContainer}>
                            <Text style={styles.productTitle}>{item.nome}</Text>
                            <Text style={styles.productRecipe} numberOfLines={1} ellipsizeMode="tail">
                                {getReceitasNomes(receitaIds)}
                            </Text>
                        </View>
                        <View style={styles.productPriceContainer}>
                            <Text style={styles.productPrice}>R$ {item.valor.toFixed(2)}</Text>
                            <Text style={styles.productPriceType}>{item.tipoPreco}</Text>
                        </View>
                    </View>
                </Card>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Seus Produtos</Text>

                {produtos.length === 0 ? (
                    <Card containerStyle={styles.emptyCard}>
                        <View style={styles.emptyCardContent}>
                            <Icon name="shopping-bag" type="feather" color="#F08080" size={48} />
                            <Text style={styles.emptyText}>Nenhum produto cadastrado.</Text>
                            <Text style={styles.emptySubText}>Adicione produtos clicando no botão abaixo.</Text>
                        </View>
                    </Card>
                ) : (
                    <FlatList
                        data={produtos}
                        keyExtractor={(item) => item.id}
                        renderItem={renderCardProduto}
                        contentContainerStyle={styles.productsList}
                    />
                )}
            </View>

            <FAB
                icon={{ name: "plus", type: "feather", color: "#FFFFFF" }}
                color="#F08080"
                style={styles.fab}
                onPress={() => router.push("/produtos/add")}
            />
        </View>
    )
}