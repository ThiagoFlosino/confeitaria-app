import React, { useState } from "react"
import { View, FlatList, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FAB, List, Text, Card, Divider } from "react-native-paper"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { Receita } from "@/src/models/Receita"
import { styles } from "@/src/theme/styles"


export default function ListaReceitasScreen() {
  const router = useRouter()
  const [receitas, setReceitas] = useState<Receita[]>([])

  const carregarReceitas = async () => {
    const data = await AsyncStorage.getItem("receitas")
    if (data) setReceitas(JSON.parse(data))
  }

  const navigation = useNavigation()

  useFocusEffect(() => {
    navigation.setOptions({
      title: "Receitas",
      headerStyle: {
        backgroundColor: "#FFFFFF",
      },
      headerTitleStyle: {
        color: "#333333",
        fontSize: 18,
        fontWeight: "500",
      },
      headerTintColor: "#F08080", // Coral color for back arrow
    })
  })

  useFocusEffect(
    React.useCallback(() => {
      carregarReceitas()
    }, []),
  )

  // Get recipe icon based on name or ingredients
  const getRecipeIcon = (receita: Receita) => {
    const nameLower = receita.nome.toLowerCase()

    if (nameLower.includes("bolo")) return "cake"
    if (nameLower.includes("pão") || nameLower.includes("pao")) return "bread-slice"
    if (nameLower.includes("cookie") || nameLower.includes("biscoito")) return "cookie"
    if (nameLower.includes("torta")) return "pie"

    // Check ingredients
    const hasChocolate = receita.ingredientes.some(
      (i) => i.nome.toLowerCase().includes("chocolate") || i.nome.toLowerCase().includes("cacau"),
    )
    if (hasChocolate) return "candy"

    return "food"
  }

  // Get a short description from the recipe
  const getShortDescription = (receita: Receita) => {
    if (receita.descricao && receita.descricao.length > 0) {
      return receita.descricao.length > 60 ? receita.descricao.substring(0, 60) + "..." : receita.descricao
    }
    return `Rende: ${receita.quantidadeProduzida}`
  }

  // Get ingredient count text
  const getIngredientCount = (receita: Receita) => {
    const count = receita.ingredientes.length
    return `${count} ${count === 1 ? "ingrediente" : "ingredientes"}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Suas Receitas</Text>

        {receitas.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyCardContent}>
              <List.Icon icon="food-variant" color="#F08080" />
              <Text style={styles.emptyText}>Nenhuma receita cadastrada.</Text>
              <Text style={styles.emptySubText}>Adicione receitas clicando no botão abaixo.</Text>
            </Card.Content>
          </Card>
        ) : (
          <FlatList
            data={receitas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderItem={({ item }) => (
              <Card style={styles.recipeCard} onPress={() => router.push(`/receitas/add?idReceita=${item.id}`)}>
                <Card.Content style={styles.recipeCardContent}>
                  <View style={styles.recipeHeader}>
                    <View style={styles.iconContainer}>
                      <List.Icon icon={getRecipeIcon(item)} color="#F08080" style={styles.recipeIcon} />
                    </View>
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeTitle}>{item.nome}</Text>
                      <Text style={styles.recipeDescription}>{getShortDescription(item)}</Text>
                    </View>
                  </View>

                  <Divider style={styles.recipeDivider} />

                  <View style={styles.recipeFooter}>
                    <Text style={styles.recipeYield}>Rende: {item.quantidadeProduzida}</Text>
                    <Text style={styles.recipeIngredients}>{getIngredientCount(item)}</Text>
                  </View>
                </Card.Content>
              </Card>
            )}
          />
        )}
      </View>

      <FAB icon="plus" style={styles.fab} color="#FFFFFF" onPress={() => router.push("/receitas/add")} />
    </View>
  )
}