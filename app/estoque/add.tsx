import { useState } from "react"
import { View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { TextInput, Button, Text, Snackbar, Card, IconButton } from "react-native-paper"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { styles } from "@/src/theme/styles"
import { ItemEstoque } from "@/src/models/ItemEstoque"

export default function AdicionarEstoqueScreen() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState("")
  const [unidade, setUnidade] = useState("")
  const [snackbarVisible, setSnackbarVisible] = useState(false)

  const salvarItem = async () => {
    if (!nome || !quantidade || !unidade) {
      setSnackbarVisible(true)
      return
    }

    const novoItem: ItemEstoque ={
      id: Date.now().toString(),
      nome: nome,
      quantidade: Number(quantidade),
      unidade: unidade,
    }
    try {
      const data = await AsyncStorage.getItem("estoque")
      const itens = data ? JSON.parse(data) : []
      itens.push(novoItem)
      await AsyncStorage.setItem("estoque", JSON.stringify(itens))
      router.back()
    } catch (err) {
      setSnackbarVisible(true)
    }
  }

  const navigation = useNavigation()

  useFocusEffect(() => {
    navigation.setOptions({
      title: "Adicionar Item no estoque",
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

  const commonUnits = ["kg", "g", "L", "ml", "unidade", "pacote", "caixa"]

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex1}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              {/* <View style={styles.iconContainer}>
                <IconButton icon="package-variant" size={32} iconColor="#F08080" />
              </View> */}

              <TextInput
                label="Nome do Produto"
                value={nome}
                onChangeText={setNome}
                mode="outlined"
                outlineColor="#E0E0E0"
                activeOutlineColor="#F08080"
                style={styles.input}
                placeholder="Ex: Farinha de Trigo"
              />

              <View style={styles.quantityRow}>
                <TextInput
                  label="Quantidade"
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
                  mode="outlined"
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#F08080"
                  style={[styles.input, styles.quantityInput]}
                  placeholder="Ex: 5"
                />

                <TextInput
                  label="Unidade"
                  value={unidade}
                  onChangeText={setUnidade}
                  mode="outlined"
                  outlineColor="#E0E0E0"
                  activeOutlineColor="#F08080"
                  style={[styles.input, styles.unitInput]}
                  placeholder="Ex: kg"
                />
              </View>

              <Text style={styles.unitsLabel}>Unidades comuns:</Text>
              <View style={styles.unitsContainer}>
                {commonUnits.map((unit) => (
                  <Button
                    key={unit}
                    mode="outlined"
                    onPress={() => setUnidade(unit)}
                    style={[styles.unitButton, unidade === unit && styles.selectedUnitButton]}
                    labelStyle={[styles.unitButtonLabel, unidade === unit && styles.selectedUnitButtonLabel]}
                  >
                    {unit}
                  </Button>
                ))}
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button mode="contained" onPress={salvarItem} style={styles.saveButton} labelStyle={styles.saveButtonLabel}>
          Salvar Item
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        Preencha todos os campos corretamente.
      </Snackbar>
    </View>
  )
}
