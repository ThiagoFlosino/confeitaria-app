"use client"

import { useEffect, useState } from "react"
import { View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import type { Produto } from "../../src/models/Produto"
import type { Receita } from "../../src/models/Receita"
import { storage } from "../../src/services/storageService"
import { Input, Button, Text, Card, ListItem, Icon } from "@rneui/themed"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { styles } from "@/src/theme/styles"

export default function AdicionarProdutoScreen() {
    const router = useRouter()
    const navigation = useNavigation()

    const { idProduto } = useLocalSearchParams();

    const [produtos, setProdutos] = useState<Produto[]>([])
    const [receitas, setReceitas] = useState<Receita[]>([])

    const [id, setId] = useState("")
    const [nomeProduto, setNomeProduto] = useState("")
    const [valor, setValor] = useState("")
    const [tipoPreco, setTipoPreco] = useState("unitário")
    const [receitasSelecionadas, setReceitasSelecionadas] = useState<string[]>([])
    const [filtroReceita, setFiltroReceita] = useState("")
    const [showRecipeSelector, setShowRecipeSelector] = useState(false)
    const [quantidadeProduzida, setQuantidadeProduzida] = useState("")
    const [modoVisualizacao, setModoVisualizacao] = useState(false);

    const tiposPreco = ["unitário", "cento", "caixa", "kg", "pacote"]

    useFocusEffect(() => {
        navigation.setOptions({
            title: "Adicionar Produto",
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTitleStyle: { color: "#333333", fontSize: 18, fontWeight: "500" },
            headerTintColor: "#F08080",
        })
    })

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (idProduto && produtos.length > 0) {
            carregarProduto(String(idProduto));
            setModoVisualizacao(true);
        }
    }, [idProduto, produtos])

    const carregarProduto = async (produtoId: string) => {
        const produtoSelecionado = produtos.find(r => r.id === produtoId);
        if (produtoSelecionado) {
            setId(produtoSelecionado.id)
            setTipoPreco(produtoSelecionado.tipoPreco);
            setNomeProduto(produtoSelecionado.nome)
            setValor(String(produtoSelecionado.valor))
            setReceitasSelecionadas(produtoSelecionado.receitaIds || [])
            setQuantidadeProduzida(String(produtoSelecionado.quantidadeProduzida))
        }
    };

    const loadData = async () => {
        const r = await storage.getItem<Receita[]>("receitas")
        const p = await storage.getItem<Produto[]>("produtos")
        if (r) setReceitas(r)
        if (p) setProdutos(p)
    }

    const toggleReceitaSelecionada = (receitaId: string) => {
        setReceitasSelecionadas((prev) => {
            if (prev.includes(receitaId)) {
                return prev.filter((id) => id !== receitaId)
            } else {
                return [...prev, receitaId]
            }
        })
    }

    const salvarProduto = async () => {
        if (!nomeProduto || !valor || !tipoPreco || receitasSelecionadas.length === 0) return

        const novo: Produto = {
            id: id || Date.now().toString(),
            nome: nomeProduto,
            valor: Number.parseFloat(valor),
            tipoPreco,
            receitaIds: receitasSelecionadas,
            quantidadeProduzida: Number(quantidadeProduzida)
        }

        const atualizados = produtos.filter(p => p.id !== novo.id)
        const lista = [...atualizados, novo]
        setProdutos(lista)
        await storage.setItem("produtos", lista)

        setNomeProduto("")
        setValor("")
        setTipoPreco("unitário")
        setReceitasSelecionadas([])
        setShowRecipeSelector(false)

        router.push("/produtos/list")
    }

    const getReceitasNomes = () => {
        if (receitasSelecionadas.length === 0) return "Selecione receitas"
        return receitasSelecionadas.map((id) => {
            const receita = receitas.find((r) => r.id === id)
            return receita ? receita.nome : ""
        }).filter(Boolean).join(", ")
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex1}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.formSection}>
                        <Card containerStyle={styles.formCard}>
                            <Input placeholder="Nome do Produto" value={nomeProduto} onChangeText={setNomeProduto} inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} leftIcon={<Icon name="shopping-bag" type="feather" color="#F08080" size={20} />} />
                            <Input placeholder="Valor (R$)" value={valor} onChangeText={setValor} keyboardType="numeric" inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} leftIcon={<Icon name="attach-money" type="material" color="#F08080" size={20} />} />
                            <Input placeholder="Qtde Produzida" value={quantidadeProduzida} onChangeText={setQuantidadeProduzida} keyboardType="numeric" inputContainerStyle={styles.inputContainer} inputStyle={styles.inputText} leftIcon={<Icon name="shopping-bag" type="material" color="#F08080" size={20} />} />
                            <Text style={styles.labelText}>Tipo de Preço:</Text>
                            <View style={styles.priceTypeContainer}>
                                {tiposPreco.map((tipo) => (
                                    <TouchableOpacity key={tipo} style={[styles.priceTypeButton, tipoPreco === tipo && styles.priceTypeButtonSelected]} onPress={() => setTipoPreco(tipo)}>
                                        <Text style={[styles.priceTypeText, tipoPreco === tipo && styles.priceTypeTextSelected]}>{tipo}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <Text style={styles.labelText}>Receitas ({receitasSelecionadas.length} selecionadas):</Text>
                            <TouchableOpacity style={styles.recipeSelector} onPress={() => setShowRecipeSelector(!showRecipeSelector)}>
                                <Text style={styles.recipeSelectorText} numberOfLines={1} ellipsizeMode="tail">{getReceitasNomes()}</Text>
                                <Icon name={showRecipeSelector ? "chevron-up" : "chevron-down"} type="feather" color="#757575" size={20} />
                            </TouchableOpacity>
                            {showRecipeSelector && (
                                <View style={styles.recipeListContainer}>
                                    <Input placeholder="Buscar Receita" value={filtroReceita} onChangeText={setFiltroReceita} inputContainerStyle={styles.searchInputContainer} inputStyle={styles.inputText} leftIcon={<Icon name="search" type="feather" color="#F08080" size={20} />} />
                                    <View style={styles.recipeList}>
                                        {receitas.filter((r) => r.nome.toLowerCase().includes(filtroReceita.toLowerCase())).map((item) => (
                                            <ListItem key={item.id} containerStyle={[styles.recipeItem, receitasSelecionadas.includes(item.id) && styles.recipeItemSelected]} onPress={() => toggleReceitaSelecionada(item.id)}>
                                                <ListItem.CheckBox checked={receitasSelecionadas.includes(item.id)} onPress={() => toggleReceitaSelecionada(item.id)} checkedColor="#F08080" uncheckedColor="#CCCCCC" />
                                                <ListItem.Content>
                                                    <ListItem.Title style={styles.recipeItemTitle}>{item.nome}</ListItem.Title>
                                                    <ListItem.Subtitle style={styles.recipeItemSubtitle}>Rende: {item.quantidadeProduzida}</ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        ))}
                                    </View>
                                </View>
                            )}
                            <Button title="Salvar Produto" onPress={salvarProduto} buttonStyle={styles.saveButton} titleStyle={styles.saveButtonText} icon={{ name: "check", type: "feather", color: "white", size: 20 }} iconRight />
                        </Card>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}
