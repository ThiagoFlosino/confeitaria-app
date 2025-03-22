// app/calendario.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Pedido } from '../src/models/Pedido';
import { Receita } from '../src/models/Receita';
import { storage } from '../src/services/storageService';
import { Calendar, ICalendarEventBase, CalendarMode } from 'react-native-big-calendar';

interface PedidoEvento extends ICalendarEventBase {
  pedidoId: string;
  status: 'pendente' | 'concluido' | 'cancelado';
}

export default function CalendarioScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<PedidoEvento[]>([]);
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [statusFiltro, setStatusFiltro] = useState<'todos' | 'pendente' | 'concluido' | 'cancelado'>('todos');
  const [modoVisualizacao, setModoVisualizacao] = useState<CalendarMode>('week');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const p = await storage.getItem<Pedido[]>('pedidos');
    const r = await storage.getItem<Receita[]>('receitas');
    if (p && r) {
      setReceitas(r);
      const eventos: PedidoEvento[] = p.map((pedido) => {
        const receita = r.find((rec) => rec.id === pedido.receitaId);
        const dataInicio = new Date(pedido.dataEntrega);
        const dataFim = new Date(pedido.dataEntrega);
        dataFim.setHours(dataFim.getHours() + 1);

        return {
          title: `${pedido.nomeCliente} - ${receita?.nome || ''}`,
          start: dataInicio,
          end: dataFim,
          pedidoId: pedido.id,
          status: pedido.status,
        };
      });
      setPedidos(eventos);
    }
  };

  const eventosFiltrados = pedidos.filter((e) => {
    if (statusFiltro === 'todos') return true;
    return e.status === statusFiltro;
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Button title="Voltar" onPress={() => router.back()} />
        <Text style={styles.title}>Calendário de Produção</Text>
      </View>

      <View style={styles.filtrosContainer}>
        <Text style={styles.subTitle}>Filtro de Status:</Text>
        {['todos', 'pendente', 'concluido', 'cancelado'].map((status) => (
          <TouchableOpacity key={status} onPress={() => setStatusFiltro(status as any)}>
            <Text style={[styles.filtroBotao, statusFiltro === status && styles.filtroSelecionado]}>{status}</Text>
          </TouchableOpacity>
        ))}

        <Text style={[styles.subTitle, { marginTop: 10 }]}>Visualização:</Text>
        {(['day', 'week', 'month'] as CalendarMode[]).map((modo) => (
          <TouchableOpacity key={modo} onPress={() => setModoVisualizacao(modo)}>
            <Text style={[styles.filtroBotao, modoVisualizacao === modo && styles.filtroSelecionado]}>{modo}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Calendar
        events={eventosFiltrados}
        height={Dimensions.get('window').height - 250}
        mode={modoVisualizacao}
        scrollOffsetMinutes={480}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  filtrosContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  subTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filtroBotao: {
    marginRight: 10,
    marginBottom: 5,
    fontSize: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    textTransform: 'capitalize',
  },
  filtroSelecionado: {
    backgroundColor: '#ddd',
    fontWeight: 'bold',
  },
});