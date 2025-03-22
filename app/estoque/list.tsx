import React, { useState } from "react"
import { View, FlatList } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ItemEstoque } from "@/src/models/ItemEstoque"
import { FAB, List, Text, Card } from "react-native-paper"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { styles } from "@/src/theme/styles"

export default function EstoqueScreen() {
    const router = useRouter()
    const [estoque, setEstoque] = useState<ItemEstoque[]>([])

    const carregarEstoque = async () => {
        const data = await AsyncStorage.getItem("estoque")
        if (data) setEstoque(JSON.parse(data))
    }

    const navigation = useNavigation()

    useFocusEffect(() => {
        navigation.setOptions({
            title: "Listar Estoque",
            headerStyle: {
                backgroundColor: "#FFFFFF",
            },
            headerTitleStyle: {
                color: "#333333",
                fontSize: 18,
                fontWeight: "500",
            },
            headerTintColor: "#333333",
        })
    })

    useFocusEffect(
        React.useCallback(() => {
            carregarEstoque()
        }, []),
    )

    // Get icon based on item name
    const getItemIcon = (nome: string) => {
        const nameLower = nome.toLowerCase()
        if (nameLower.includes("farinha")) return "wheat"
        if (nameLower.includes("açúcar")) return "sugar"
        if (nameLower.includes("ovo")) return "egg"
        if (nameLower.includes("leite")) return "cup"
        if (nameLower.includes("manteiga")) return "food"
        return "warehouse"
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Itens em Estoque</Text>

                {estoque.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={styles.emptyCardContent}>
                            <List.Icon icon="package-variant" color="#F08080" />
                            <Text style={styles.emptyText}>Nenhum item cadastrado no estoque.</Text>
                            <Text style={styles.emptySubText}>Adicione itens clicando no botão abaixo.</Text>
                        </Card.Content>
                    </Card>
                ) : (
                    <FlatList
                        data={estoque}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                        renderItem={({ item }) => (
                            <Card style={styles.itemCard}>
                                <Card.Content style={styles.itemCardContent}>
                                    <List.Item
                                        title={item.nome}
                                        titleStyle={styles.itemTitle}
                                        description={`${item.quantidade} ${item.unidade}`}
                                        descriptionStyle={styles.itemDescription}
                                        left={() => (
                                            <View style={styles.iconContainer}>
                                                <List.Icon icon={getItemIcon(item.nome)} color="#F08080" style={styles.itemIcon} />
                                            </View>
                                        )}
                                        right={() => (
                                            <View style={styles.quantityContainer}>
                                                <Text style={styles.quantityText}>{item.quantidade}</Text>
                                                <Text style={styles.unitText}>{item.unidade}</Text>
                                            </View>
                                        )}
                                    />
                                </Card.Content>
                            </Card>
                        )}
                    />
                )}
            </View>

            <FAB icon="plus" style={styles.fab} color="#FFFFFF" onPress={() => router.push("/estoque/add")} />
        </View>
    )
}
