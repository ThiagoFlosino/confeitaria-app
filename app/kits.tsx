// app/kits.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Produto } from '../src/models/Produto';
import { storage } from '../src/services/storageService';
import { Input, Button, Text, Card, Divider, ListItem } from '@rneui/themed';

interface KitProduto {
    produtoId: string;
    quantidade: number;
}

interface Kit {
    id: string;
    nome: string;
    produtos: KitProduto[];
}

export default function KitsScreen() {
    const router = useRouter();
    const [kits, setKits] = useState<Kit[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [nomeKit, setNomeKit] = useState('');
    const [produtoFiltro, setProdutoFiltro] = useState('');
    const [produtosSelecionados, setProdutosSelecionados] = useState<KitProduto[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const p = await storage.getItem<Produto[]>('produtos');
        const k = await storage.getItem<Kit[]>('kits');
        if (p) setProdutos(p);
        if (k) setKits(k);
    };

    const toggleProduto = (produtoId: string) => {
        const jaSelecionado = produtosSelecionados.find(p => p.produtoId === produtoId);
        if (jaSelecionado) {
            setProdutosSelecionados(produtosSelecionados.filter(p => p.produtoId !== produtoId));
        } else {
            setProdutosSelecionados([...produtosSelecionados, { produtoId, quantidade: 1 }]);
        }
    };

    const atualizarQuantidade = (produtoId: string, quantidade: number) => {
        setProdutosSelecionados(produtosSelecionados.map(p => p.produtoId === produtoId ? { ...p, quantidade } : p));
    };

    const removerProduto = (produtoId: string) => {
        setProdutosSelecionados(produtosSelecionados.filter(p => p.produtoId !== produtoId));
    };

    const salvarKit = async () => {
        if (!nomeKit || produtosSelecionados.length === 0) return;
        const novo: Kit = {
            id: Date.now().toString(),
            nome: nomeKit,
            produtos: produtosSelecionados,
        };
        const lista = [...kits, novo];
        setKits(lista);
        await storage.setItem('kits', lista);
        setNomeKit('');
        setProdutosSelecionados([]);
    };

    const renderProdutoItem = (item: Produto) => {
        const selecionado = produtosSelecionados.find(p => p.produtoId === item.id);
        return (
            <ListItem bottomDivider>
                <ListItem.CheckBox
                    checked={!!selecionado}
                    onPress={() => toggleProduto(item.id)}
                />
                <ListItem.Content>
                    <ListItem.Title>{item.nome}</ListItem.Title>
                    {selecionado && (
                        <>
                            <Input
                                placeholder="Qtd"
                                keyboardType="numeric"
                                value={String(selecionado.quantidade)}
                                onChangeText={(val) => atualizarQuantidade(item.id, parseInt(val || '1'))}
                                containerStyle={{ padding: 0, marginTop: -10 }}
                            />
                            <Button title="Remover" onPress={() => removerProduto(item.id)} color="error" size="sm" />
                        </>
                    )}
                </ListItem.Content>
            </ListItem>
        );
    };

    return (
        <View style={{ padding: 20 }}>
            <Button title="Voltar" onPress={() => router.back()} />
            <Text h4 style={{ marginVertical: 10 }}>Cadastro de Kit</Text>

            <Input placeholder="Nome do Kit" value={nomeKit} onChangeText={setNomeKit} />

            <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Produtos</Text>
            <Input placeholder="Buscar Produto" value={produtoFiltro} onChangeText={setProdutoFiltro} />

            <FlatList
                data={produtos.filter(p => p.nome.toLowerCase().includes(produtoFiltro.toLowerCase()))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderProdutoItem(item)}
                style={{ maxHeight: 300 }}
            />

            <Button title="Salvar Kit" onPress={salvarKit} />

            <Divider style={{ marginVertical: 20 }} />

            <Text h4>Kits Cadastrados</Text>
            <FlatList
                data={kits}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Card>
                        <Card.Title>{item.nome}</Card.Title>
                        {item.produtos.map((p, idx) => {
                            const prod = produtos.find(prod => prod.id === p.produtoId);
                            return <Text key={idx}>{prod?.nome} x {p.quantidade}</Text>;
                        })}
                    </Card>
                )}
            />
        </View>
    );
}