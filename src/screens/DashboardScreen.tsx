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
  Modal,
} from 'react-native';
import { AreaCard } from '../components/AreaCard';
import { AreaMonitoramento, StatusVegetacao } from '../types/areaMonitoramento';
import { api } from '../services/api';
import { SensorCard } from '../components/SensorCard';
import { Medicao } from '../types/medicao';

type ModalConfig = {
  visible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
};

export const DashboardScreen: React.FC = () => {
  const [areas, setAreas] = useState<AreaMonitoramento[]>([]);
  const [medicoes, setMedicao] = useState<Medicao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusVegetacao | 'TODOS'>('TODOS');
  const [abaAtual, setAbaAtual] = useState<'areas' | 'sensores'>('areas');
  const [erro, setErro] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalConfig>({
    visible: false,
    title: '',
    message: '',
  });

  const showModal = (config: Omit<ModalConfig, 'visible'>) => {
    setModal({ ...config, visible: true });
  };

  const hideModal = () => {
    setModal((prev) => ({ ...prev, visible: false }));
  };

  const carregarDados = async () => {
    try {
      setErro(null);
      setLoading(true);
      const [dadosAreas, dadosMedicoes] = await Promise.all([
        api.areas.listarTodas(),
        api.medicoes.listarTodas(),
      ]);
      setAreas(dadosAreas);
      setMedicao(dadosMedicoes);
    } catch (error) {
      setErro('Não foi possível conectar à API. Verifique se o servidor está rodando.');
      Alert.alert('Erro', 'Não foi possível carregar as áreas. Verifique se a API está rodando na porta 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarDados();
    setRefreshing(false);
  };

  const handleAreaPress = (area: AreaMonitoramento) => {
    showModal({
      title: `📍 Área #${area.id}`,
      message: `Status: ${area.status}\n\nDetalhes completos em breve.`,
      confirmText: 'OK',
      showCancel: false,
    });
  };

  const simularColeta = () => {
    showModal({
      title: '🔬 Simular Coleta',
      message: 'Deseja simular a coleta de novos dados dos sensores em todas as áreas?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      showCancel: true,
      onConfirm: async () => {
        hideModal();
        try {
          setLoading(true);
          await api.medicoes.simularTodasAreas();
          await carregarDados();
          showModal({
            title: '✅ Sucesso!',
            message: 'Coleta de dados simulada com sucesso!',
            confirmText: 'OK',
            showCancel: false,
          });
        } catch (error) {
          console.error('Erro ao simular coleta:', error);
          showModal({
            title: 'Erro',
            message: 'Não foi possível simular a coleta de dados.',
            confirmText: 'OK',
            showCancel: false,
          });
        } finally {
          setLoading(false);
        }
      },
    });
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
        <ActivityIndicator size="large" color="#00FF94" />
        <Text style={styles.loadingText}>Carregando dados da API...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.erroText}>{erro}</Text>
        <TouchableOpacity style={styles.clearFilterButton} onPress={carregarDados}>
          <Text style={styles.clearFilterText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const areasFiltradas = filtrarAreas();

  return (
    <View style={styles.container}>

      {/* Modal customizado */}
      <Modal visible={modal.visible} transparent animationType="fade" onRequestClose={hideModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{modal.title}</Text>
            <Text style={styles.modalMessage}>{modal.message}</Text>
            <View style={styles.modalButtons}>
              {modal.showCancel && (
                <TouchableOpacity style={styles.modalButtonCancel} onPress={hideModal}>
                  <Text style={styles.modalButtonCancelText}>{modal.cancelText ?? 'Cancelar'}</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={() => {
                  if (modal.onConfirm) {
                    modal.onConfirm();
                  } else {
                    hideModal();
                  }
                }}
              >
                <Text style={styles.modalButtonConfirmText}>{modal.confirmText ?? 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>RoadGreen</Text>
        <Text style={styles.subtitle}>Monitoramento de Vegetação</Text>
      </View>

      {/* Abas */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, abaAtual === 'areas' && styles.tabActive]}
          onPress={() => setAbaAtual('areas')}
        >
          <Text style={[styles.tabText, abaAtual === 'areas' && styles.tabTextActive]}>Áreas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, abaAtual === 'sensores' && styles.tabActive]}
          onPress={() => setAbaAtual('sensores')}
        >
          <Text style={[styles.tabText, abaAtual === 'sensores' && styles.tabTextActive]}>Sensores</Text>
        </TouchableOpacity>
      </View>

      {/* Status Cards (só na aba Áreas) */}
      {abaAtual === 'areas' && (
        <>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[styles.statusCard, { backgroundColor: '#1A0A0A', borderColor: '#FF4444' }, filtroStatus === StatusVegetacao.URGENTE && styles.statusCardActive]}
              onPress={() => setFiltroStatus(StatusVegetacao.URGENTE)}
            >
              <Text style={[styles.statusNumber, { color: '#FF4444' }]}>{contarPorStatus(StatusVegetacao.URGENTE)}</Text>
              <Text style={styles.statusLabel}>Urgente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusCard, { backgroundColor: '#1A1200', borderColor: '#FFB800' }, filtroStatus === StatusVegetacao.ATENCAO && styles.statusCardActive]}
              onPress={() => setFiltroStatus(StatusVegetacao.ATENCAO)}
            >
              <Text style={[styles.statusNumber, { color: '#FFB800' }]}>{contarPorStatus(StatusVegetacao.ATENCAO)}</Text>
              <Text style={styles.statusLabel}>Atenção</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.statusCard, { backgroundColor: '#0A1A0E', borderColor: '#00FF94' }, filtroStatus === StatusVegetacao.NORMAL && styles.statusCardActive]}
              onPress={() => setFiltroStatus(StatusVegetacao.NORMAL)}
            >
              <Text style={[styles.statusNumber, { color: '#00FF94' }]}>{contarPorStatus(StatusVegetacao.NORMAL)}</Text>
              <Text style={styles.statusLabel}>Normal</Text>
            </TouchableOpacity>
          </View>

          {filtroStatus !== 'TODOS' && (
            <TouchableOpacity style={styles.clearFilterButton} onPress={() => setFiltroStatus('TODOS')}>
              <Text style={styles.clearFilterText}>✕ Limpar Filtro</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Lista de Áreas */}
      {abaAtual === 'areas' ? (
        <FlatList
          data={areasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <AreaCard area={item} onPress={() => handleAreaPress(item)} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF94" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={styles.emptyText}>Nenhuma área encontrada</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={medicoes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SensorCard medicao={item} />}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FF94" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📡</Text>
              <Text style={styles.emptyText}>Nenhuma medição encontrada</Text>
            </View>
          }
        />
      )}

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.fab} onPress={simularColeta}>
        <Text style={styles.fabText}>🔬 Simular Coleta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#A0A0A0',
    letterSpacing: 1,
  },
  erroText: {
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  header: {
    backgroundColor: '#0D0D0D',
    padding: 20,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF94',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 11,
    color: '#4A4A4A',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#00FF94',
  },
  tabText: {
    color: '#3A3A3A',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tabTextActive: {
    color: '#00FF94',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#0D0D0D',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  statusCard: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  statusCardActive: {
    borderWidth: 2,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 9,
    color: '#4A4A4A',
    marginTop: 2,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  clearFilterButton: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#00FF94',
    padding: 10,
    margin: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  clearFilterText: {
    color: '#00FF94',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  list: {
    padding: 10,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#2A2A2A',
    letterSpacing: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#00FF94',
    elevation: 8,
  },
  fabText: {
    color: '#00FF94',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#1E1E1E',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FF94',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6A6A6A',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButtonCancel: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  modalButtonCancelText: {
    color: '#4A4A4A',
    fontWeight: 'bold',
    fontSize: 13,
  },
  modalButtonConfirm: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#0A1A0E',
    borderWidth: 1,
    borderColor: '#00FF94',
  },
  modalButtonConfirmText: {
    color: '#00FF94',
    fontWeight: 'bold',
    fontSize: 13,
  },
});