// app/pedidos.tsx
import React, { useEffect, useState } from 'react';
import { View, FlatList, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Pedido } from '../src/models/Pedido';
import { Produto } from '../src/models/Produto';
import { Kit } from '../src/models/Kit';
import { storage } from '../src/services/storageService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, Button, Text, Card, Divider, ListItem } from '@rneui/themed';

export default function PedidosScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);

  const [nomeCliente, setNomeCliente] = useState('');
  const [dataEntrega, setDataEntrega] = useState(new Date());
  const [horaEntrega, setHoraEntrega] = useState(new Date());
  const [mostrarDataPicker, setMostrarDataPicker] = useState(false);
  const [mostrarHoraPicker, setMostrarHoraPicker] = useState(false);
  const [produtoFiltro, setProdutoFiltro] = useState('');
  const [kitFiltro, setKitFiltro] = useState('');
  const [itensPedido, setItensPedido] = useState<{ tipo: 'produto' | 'kit'; id: string; quantidade: number }[]>([]);
  const [status, setStatus] = useState<'pendente' | 'concluido' | 'cancelado'>('pendente');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await storage.getItem<Pedido[]>('pedidos');
    const pr = await storage.getItem<Produto[]>('produtos');
    const k = await storage.getItem<Kit[]>('kits');
    if (p) setPedidos(p);
    if (pr) setProdutos(pr);
    if (k) setKits(k);
  };

  const toggleItemSelecionado = (tipo: 'produto' | 'kit', id: string) => {
    const jaSelecionado = itensPedido.find(i => i.tipo === tipo && i.id === id);
    if (jaSelecionado) {
      setItensPedido(itensPedido.filter(i => !(i.tipo === tipo && i.id === id)));
    } else {
      setItensPedido([...itensPedido, { tipo, id, quantidade: 1 }]);
    }
  };

  const atualizarQuantidade = (tipo: 'produto' | 'kit', id: string, quantidade: number) => {
    setItensPedido(itensPedido.map(i => (i.tipo === tipo && i.id === id ? { ...i, quantidade } : i)));
  };

  const removerItem = (tipo: 'produto' | 'kit', id: string) => {
    setItensPedido(itensPedido.filter(i => !(i.tipo === tipo && i.id === id)));
  };

  const salvarPedido = async () => {
    if (!nomeCliente || !dataEntrega || !horaEntrega || itensPedido.length === 0) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios e adicione ao menos um item.');
      return;
    }
    const data = dataEntrega.toISOString().split('T')[0];
    const hora = horaEntrega.toTimeString().split(' ')[0].substring(0, 5);
    const novo: Pedido = {
      id: Date.now().toString(),
      nomeCliente,
      dataEntrega: `${data} ${hora}`,
      status,
      itens: itensPedido,
    };
    const lista = [...pedidos, novo];
    setPedidos(lista);
    await storage.setItem('pedidos', lista);
    setNomeCliente('');
    setDataEntrega(new Date());
    setHoraEntrega(new Date());
    setItensPedido([]);
    setStatus('pendente');
  };

  const renderItemComCheckbox = (tipo: 'produto' | 'kit', item: Produto | Kit) => {
    const selecionado = itensPedido.find(i => i.tipo === tipo && i.id === item.id);
    return (
      <ListItem bottomDivider>
        <ListItem.CheckBox
          checked={!!selecionado}
          onPress={() => toggleItemSelecionado(tipo, item.id)}
        />
        <ListItem.Content>
          <ListItem.Title>{tipo === 'kit' ? 'KIT - ' : ''}{item.nome}</ListItem.Title>
          {selecionado && (
            <>
              <Input
                placeholder="Qtd"
                keyboardType="numeric"
                value={String(selecionado.quantidade)}
                onChangeText={(val) => atualizarQuantidade(tipo, item.id, parseInt(val || '1'))}
                containerStyle={{ padding: 0, marginTop: -10 }}
              />
              <Button title="Remover" onPress={() => removerItem(tipo, item.id)} color="error" size="sm" />
            </>
          )}
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Voltar" onPress={() => router.back()} />
      <Text h4 style={{ marginVertical: 10 }}>Cadastro de Pedido</Text>

      <Input placeholder="Nome do Cliente" value={nomeCliente} onChangeText={setNomeCliente} />
      <Text>Data de Entrega:</Text>
      <Button title={dataEntrega.toDateString()} onPress={() => setMostrarDataPicker(true)} />
      {mostrarDataPicker && <DateTimePicker value={dataEntrega} mode="date" display="default" onChange={(e, d) => { setMostrarDataPicker(false); if (d) setDataEntrega(d); }} />}

      <Text style={{ marginTop: 10 }}>Hora de Entrega:</Text>
      <Button title={horaEntrega.toTimeString().substring(0, 5)} onPress={() => setMostrarHoraPicker(true)} />
      {mostrarHoraPicker && <DateTimePicker value={horaEntrega} mode="time" is24Hour display="default" onChange={(e, t) => { setMostrarHoraPicker(false); if (t) setHoraEntrega(t); }} />}

      <Text style={{ marginTop: 15, fontWeight: 'bold' }}>Produtos e Kits</Text>
      <FlatList
        data={[...produtos.filter(p => p.nome.toLowerCase().includes(produtoFiltro.toLowerCase())).map(p => ({ ...p, tipo: 'produto' })), ...kits.filter(k => k.nome.toLowerCase().includes(kitFiltro.toLowerCase())).map(k => ({ ...k, tipo: 'kit' }))]}
        keyExtractor={(item) => `${item.tipo}-${item.id}`}
        renderItem={({ item }) => renderItemComCheckbox(item.tipo, item)}
        style={{ maxHeight: 300 }}
      />

      <Text>Status:</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        {['pendente', 'concluido', 'cancelado'].map((s) => (
          <Button key={s} title={s} type={status === s ? 'solid' : 'outline'} onPress={() => setStatus(s as any)} />
        ))}
      </View>

      <Button title="Salvar Pedido" onPress={salvarPedido} />

      <Divider style={{ marginVertical: 20 }} />
      <Text h4>Lista de Pedidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card>
            <Card.Title>{item.nomeCliente}</Card.Title>
            <Text>Data/Hora: {item.dataEntrega}</Text>
            <Text>Status: {item.status}</Text>
            {item.itens?.map((i, idx) => {
              const nome = i.tipo === 'produto' ? produtos.find(p => p.id === i.id)?.nome : kits.find(k => k.id === i.id)?.nome;
              return <Text key={idx}>{i.tipo === 'kit' ? 'KIT - ' : ''}{nome} x {i.quantidade}</Text>;
            })}
          </Card>
        )}
      />
    </View>
  );
}