import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { AreaCard } from '../components/AreaCard';
import { AreaMonitoramento, StatusVegetacao } from '../types/areaMonitoramento';

// 1. Dados de teste para ver a interface sem o Backend
const DADOS_MOCK: AreaMonitoramento[] = [
  {
    id: 1,
    codigo: 'AREA-001',
    rodovia: 'BR-116',
    kmInicial: 10.5,
    kmFinal: 12.0,
    localizacao: 'Trecho Norte',
    status: StatusVegetacao.URGENTE,
    statusDescricao: 'Crescimento excessivo detectado',
    tipoTerreno: 'Plano',
    densidade: 85,
    alturaMedia: 1.2,
    complexidade: 3,
    ultimaMedicao: new Date().toISOString(),
    proximaIntervencao: null,
    totalMedicoes: 15
  },
  {
    id: 2,
    codigo: 'AREA-002',
    rodovia: 'SP-310',
    kmInicial: 45.0,
    kmFinal: 46.5,
    localizacao: 'Acostamento Sul',
    status: StatusVegetacao.NORMAL,
    statusDescricao: 'Vegetação sob controle',
    tipoTerreno: 'Aclive',
    densidade: 20,
    alturaMedia: 0.3,
    complexidade: 1,
    ultimaMedicao: new Date().toISOString(),
    proximaIntervencao: null,
    totalMedicoes: 8
  }
];

export const DashboardScreen: React.FC = () => {
  const [areas, setAreas] = useState<AreaMonitoramento[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusVegetacao | 'TODOS'>('TODOS');

  const carregarAreas = async () => {
    setLoading(true);
    // Simula um atraso de rede de 1 segundo
    setTimeout(() => {
      setAreas(DADOS_MOCK);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    carregarAreas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarAreas();
    setRefreshing(false);
  };

  const filtrarAreas = (): AreaMonitoramento[] => {
    if (filtroStatus === 'TODOS') return areas;
    return areas.filter((area) => area.status === filtroStatus);
  };

  const contarPorStatus = (status: StatusVegetacao): number => {
    return areas.filter((area) => area.status === status).length;
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Carregando interface...</Text>
      </View>
    );
  }

  const areasFiltradas = filtrarAreas();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>VerdeSmart</Text>
        <Text style={styles.subtitle}>Monitoramento de Vegetação</Text>
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: '#F44336' }, filtroStatus === StatusVegetacao.URGENTE && styles.statusCardActive]}
          onPress={() => setFiltroStatus(StatusVegetacao.URGENTE)}
        >
          <Text style={styles.statusNumber}>{contarPorStatus(StatusVegetacao.URGENTE)}</Text>
          <Text style={styles.statusLabel}>Urgente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: '#FF9800' }, filtroStatus === StatusVegetacao.ATENCAO && styles.statusCardActive]}
          onPress={() => setFiltroStatus(StatusVegetacao.ATENCAO)}
        >
          <Text style={styles.statusNumber}>{contarPorStatus(StatusVegetacao.ATENCAO)}</Text>
          <Text style={styles.statusLabel}>Atenção</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: '#4CAF50' }, filtroStatus === StatusVegetacao.NORMAL && styles.statusCardActive]}
          onPress={() => setFiltroStatus(StatusVegetacao.NORMAL)}
        >
          <Text style={styles.statusNumber}>{contarPorStatus(StatusVegetacao.NORMAL)}</Text>
          <Text style={styles.statusLabel}>Normal</Text>
        </TouchableOpacity>
      </View>

      {filtroStatus !== 'TODOS' && (
        <TouchableOpacity style={styles.clearFilterButton} onPress={() => setFiltroStatus('TODOS')}>
          <Text style={styles.clearFilterText}>Limpar Filtro</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={areasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AreaCard area={item} onPress={() => Alert.alert('Info', 'Detalhes em breve')} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

// Objeto de estilos (O que estava faltando ou causando erro)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#6200EE',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#FFF',
  },
  statusCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusCardActive: {
    borderWidth: 2,
    borderColor: '#000',
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statusLabel: {
    fontSize: 10,
    color: '#FFF',
  },
  clearFilterButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearFilterText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
});