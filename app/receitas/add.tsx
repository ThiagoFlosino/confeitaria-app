"use client"

import { useEffect, useState } from "react"
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import {
    TextInput,
    Button,
    Text,
    Snackbar,
    Dialog,
    Portal,
    Divider,
    IconButton,
    Card,
    useTheme,
} from "react-native-paper"
import type { ItemEstoque } from "../../src/models/ItemEstoque"
import { styles } from "@/src/theme/styles"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { v4 as uuid } from 'uuid';
import { Receita, IngredienteReceita } from "@/src/models/Receita"
import React from "react"



export default function ReceitaDetalhesScreen() {
    const router = useRouter()

    const { idReceita } = useLocalSearchParams();
    const theme = useTheme()
    const [id, setId] = useState("")
    const [nome, setNome] = useState("")
    const [quantidadeProduzida, setQuantidadeProduzida] = useState("")
    const [descricao, setDescricao] = useState("")
    const [ingredientes, setIngredientes] = useState<IngredienteReceita[]>([])
    const [dialogVisible, setDialogVisible] = useState(false)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [modoVisualizacao, setModoVisualizacao] = useState(false);
    const [estoqueDisponivel, setEstoqueDisponivel] = useState<ItemEstoque[]>([])

    
    useEffect(() => {
        if (idReceita) {
            carregarReceita(String(idReceita));
            setModoVisualizacao(true);
        } else {
            setId(uuid())
        }
        carregarItensEstoque();
    }, [idReceita]);

    const navigation = useNavigation();
    useFocusEffect(() => {
        navigation.setOptions({ title: modoVisualizacao ? 'Visualizar Receita' : 'Nova Receita' });

    });

    useFocusEffect(
        React.useCallback(() => {
            carregarItensEstoque()
        }, []),
    )


    const carregarReceita = async (receitaId: string) => {
        const data = await AsyncStorage.getItem('receitas');
        if (!data) return;
        const receitas: Receita[] = JSON.parse(data);
        const receitaSelecionada = receitas.find(r => r.id === receitaId);
        if (receitaSelecionada) {
            setId(receitaSelecionada.id);
            setNome(receitaSelecionada.nome);
            setQuantidadeProduzida(String(receitaSelecionada.quantidadeProduzida));
            setDescricao(receitaSelecionada.descricao);
            setIngredientes(receitaSelecionada.ingredientes);
        }
    };

    const carregarItensEstoque = async () => {
        const data = await AsyncStorage.getItem("estoque")
        if (data) setEstoqueDisponivel(JSON.parse(data))
    };

    const confirmarAdicionarIngrediente = () => {
        if (!itemSelecionado || !quantidadeSelecionada) return;
        setIngredientes([...ingredientes, {
            nome: itemSelecionado.nome,
            quantidade: Number(quantidadeSelecionada),
            unidade: itemSelecionado.unidade,
            itemId: itemSelecionado.id
        }]);
        setItemSelecionado(null);
        setQuantidadeSelecionada('');
        setDialogVisible(false);
    };

    const [itemSelecionado, setItemSelecionado] = useState<ItemEstoque | null>(null)
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState("")



    const removerIngrediente = (index: number) => {
        const novaLista = ingredientes.filter((_, i) => i !== index)
        setIngredientes(novaLista)
    }

    const salvarReceita = async () => {
        if (!nome || !quantidadeProduzida || ingredientes.length === 0) {
            setSnackbarVisible(true)
            return
        }
        let quantidade_number = Number(quantidadeProduzida)
        const novaReceita: Receita = {
            id: id,
            nome,
            quantidadeProduzida: quantidade_number,
            descricao,
            ingredientes,
        }
        try {
            const receitasSalvas = await AsyncStorage.getItem("receitas")
            const receitas = receitasSalvas ? JSON.parse(receitasSalvas) : []
            receitas.push(novaReceita)
            await AsyncStorage.setItem("receitas", JSON.stringify(receitas))
            setSnackbarVisible(true)
            setTimeout(() => router.push("/"), 1500)
        } catch (error) {
            setSnackbarVisible(true)
        }
    }
    const renderIngredienteReceita = ({ item, index }: { item: IngredienteReceita; index: number }) => (
        <View style={styles.ingredientItem} key={`${item.nome}-${index}`}>
            <View style={styles.ingredienteIconContainer}>
                {!modoVisualizacao && (
                    <IconButton
                        icon="minus"
                        size={18}
                        style={styles.removeButton}
                        iconColor="#fff"
                        onPress={() => removerIngrediente(index)}
                    />
                )}
                <View style={styles.ingredientIconContainer}>
                    <IconButton icon="cake" iconColor={styles.corPrincipal.color} size={30} style={{ margin: 0 }} />
                </View>
            </View>
            <Text style={styles.ingredientQuantity}>{item.nome}</Text>
            <Text style={styles.ingredientQuantity}>{item.quantidade} {item.unidade}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* App Bar */}
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex1}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Recipe Information Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Informações da Receita</Text>
                        <Card style={styles.card}>
                            <Card.Content style={styles.cardContent}>
                                <TextInput
                                    label="Nome da Receita"
                                    value={nome}
                                    onChangeText={setNome}
                                    mode="outlined"
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#F08080"
                                    style={styles.input}
                                    placeholder="Ex: Bolo de Chocolate"
                                    disabled={modoVisualizacao}
                                />

                                <TextInput
                                    label="Quantidade Produzida"
                                    value={quantidadeProduzida}
                                    onChangeText={setQuantidadeProduzida}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#F08080"
                                    style={styles.input}
                                    placeholder="Ex: 10"
                                    disabled={modoVisualizacao}
                                />

                                <TextInput
                                    label="Descrição da Receita"
                                    value={descricao}
                                    onChangeText={setDescricao}
                                    multiline
                                    numberOfLines={4}
                                    mode="outlined"
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#F08080"
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Descreva sua receita..."
                                    disabled={modoVisualizacao}
                                />
                            </Card.Content>
                        </Card>
                    </View>

                    {/* Divider */}
                    <Divider style={styles.divider} />

                    {/* Ingredients Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Ingredientes</Text>
                            <IconButton
                                icon="plus"
                                size={24}
                                onPress={() => setDialogVisible(true)}
                                style={styles.addButton}
                                iconColor="#FFFFFF"
                            />
                        </View>

                        <View style={styles.ingredientsGrid}>
                            {ingredientes.map((item, index) => renderIngredienteReceita({ item, index }))}
                        </View>
                    </View>
                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <Button
                        mode="contained"
                        onPress={modoVisualizacao ? () => setModoVisualizacao(false) : salvarReceita}
                        style={styles.saveButton}
                        labelStyle={styles.saveButtonLabel}
                    >
                        {modoVisualizacao ? 'Editar' : 'Salvar Receita'}
                    </Button>
                </View>
            </KeyboardAvoidingView>

            {/* Dialog for adding ingredients */}
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={styles.dialog}>
                    <Dialog.Title style={styles.dialogTitle}>Selecionar Ingrediente</Dialog.Title>
                    <Dialog.Content>
                        {itemSelecionado ? (
                            <>
                                <Text style={styles.selectedItemText}>
                                    {itemSelecionado.nome} ({itemSelecionado.unidade})
                                </Text>
                                <TextInput
                                    label="Quantidade"
                                    value={quantidadeSelecionada}
                                    onChangeText={setQuantidadeSelecionada}
                                    keyboardType="numeric"
                                    mode="outlined"
                                    outlineColor="#E0E0E0"
                                    activeOutlineColor="#F08080"
                                    style={[styles.input, styles.dialogInput]}
                                />
                                <Button mode="contained" onPress={confirmarAdicionarIngrediente} style={styles.dialogButton}>
                                    Adicionar
                                </Button>
                            </>
                        ) : (
                            estoqueDisponivel.map((item) => (
                                <Button
                                    key={item.id}
                                    mode="outlined"
                                    onPress={() => setItemSelecionado(item)}
                                    style={styles.ingredientButton}
                                    textColor="#F08080"
                                >
                                    {item.nome} ({item.unidade})
                                </Button>
                            ))
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)} textColor="#F08080">
                            Cancelar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            {/* Snackbar */}
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
                style={styles.snackbar}
            >
                {!nome || !quantidadeProduzida || ingredientes.length === 0
                    ? "Preencha todos os campos obrigatórios"
                    : "Receita salva com sucesso!"}
            </Snackbar>
        </View>
    )
}
