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
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<StatusVegetacao | 'TODOS'>('TODOS');
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

  const carregarAreas = async () => {
    try {
      setErro(null);
      setLoading(true);
      const dados = await api.areas.listarTodas();
      setAreas(dados);
    } catch (error) {
      setErro('Não foi possível conectar à API. Verifique se o servidor está rodando.');
      Alert.alert('Erro', 'Não foi possível carregar as áreas. Verifique se a API está rodando na porta 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAreas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await carregarAreas();
    setRefreshing(false);
  };

  const simularColeta = () => {
    showModal({
      title: '🔬 Simular Coleta',
      message: 'Deseja simular a coleta de dados de todas as áreas?',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      showCancel: true,
      onConfirm: async () => {
        hideModal();
        try {
          setLoading(true);
          await api.medicoes.simularTodasAreas();
          await carregarAreas();
          showModal({
            title: '✅ Sucesso',
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
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Carregando dados da API...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.erroText}>{erro}</Text>
        <TouchableOpacity style={styles.clearFilterButton} onPress={carregarAreas}>
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

      <View style={styles.header}>
        <Text style={styles.title}>RoadGreen</Text>
        <Text style={styles.subtitle}>Monitoramento de Vegetação</Text>
      </View>

      <View style={styles.statusContainer}>
        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: '#c50d00' }, filtroStatus === StatusVegetacao.URGENTE && styles.statusCardActive]}
          onPress={() => setFiltroStatus(StatusVegetacao.URGENTE)}
        >
          <Text style={styles.statusNumber}>{contarPorStatus(StatusVegetacao.URGENTE)}</Text>
          <Text style={styles.statusLabel}>Urgente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: '#ffc800' }, filtroStatus === StatusVegetacao.ATENCAO && styles.statusCardActive]}
          onPress={() => setFiltroStatus(StatusVegetacao.ATENCAO)}
        >
          <Text style={styles.statusNumber}>{contarPorStatus(StatusVegetacao.ATENCAO)}</Text>
          <Text style={styles.statusLabel}>Atenção</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusCard, { backgroundColor: '#1cb321' }, filtroStatus === StatusVegetacao.NORMAL && styles.statusCardActive]}
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
    backgroundColor: '#1c1c1c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#dae5dd',
  },
  erroText: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  header: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#48a231',
  },
  subtitle: {
    fontSize: 14,
    color: '#dae5dd',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#1c1c1c',
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
    color: '#ffffff',
  },
  statusLabel: {
    fontSize: 10,
    color: '#ffffff',
  },
  clearFilterButton: {
    backgroundColor: '#173629',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  clearFilterText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#173629',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#48a231',
    elevation: 8,
  },
  fabText: {
    color: '#48a231',
    fontSize: 15,
    fontWeight: 'bold',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1c1c1c',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48a231',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 15,
    color: '#dae5dd',
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalButtonCancelText: {
    color: '#dae5dd',
    fontWeight: 'bold',
  },
  modalButtonConfirm: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#173629',
    borderWidth: 1,
    borderColor: '#48a231',
  },
  modalButtonConfirmText: {
    color: '#48a231',
    fontWeight: 'bold',
  },
});