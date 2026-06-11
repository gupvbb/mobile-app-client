import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AreaMonitoramento, StatusVegetacao } from '../types/areaMonitoramento';

type Props = {
  area: AreaMonitoramento;
  onPress: () => void;
};

export const AreaCard: React.FC<Props> = ({ area, onPress }) => {

  const getStatusColor = (status: StatusVegetacao): string => {
    switch (status) {
      case StatusVegetacao.NORMAL:   return '#00FF94';
      case StatusVegetacao.ATENCAO:  return '#FFB800';
      case StatusVegetacao.URGENTE:  return '#FF4444';
      default:                       return '#3A3A3A';
    }
  };

  const getStatusLabel = (status: StatusVegetacao): string => {
    switch (status) {
      case StatusVegetacao.NORMAL:   return 'Normal';
      case StatusVegetacao.ATENCAO:  return 'Atenção';
      case StatusVegetacao.URGENTE:  return 'Urgente';
      default:                       return 'Desconhecido';
    }
  };

  const formatarData = (dataStr: string | null): string => {
    if (!dataStr) return 'Sem dados';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColor = getStatusColor(area.status);

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: statusColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.codigo}>{area.codigo}</Text>
          <Text style={styles.rodovia}>{area.rodovia}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusColor + '18', borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{getStatusLabel(area.status)}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Localização:</Text>
          <Text style={styles.value}>{area.localizacao}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Km:</Text>
          <Text style={styles.value}>
            {area.kmInicial.toFixed(1)} - {area.kmFinal.toFixed(1)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Terreno:</Text>
          <Text style={styles.value}>{area.tipoTerreno}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Sensor:</Text>
        <Text style={styles.value}>
          {area.ultimaMedicao ? `SENSOR-${area.codigo}` : 'Sem sensor'}
        </Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Altura Média</Text>
          <Text style={[styles.metricValue, { color: statusColor }]}>
            {area.alturaMedia ? `${area.alturaMedia.toFixed(2)}m` : '-'}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Densidade</Text>
          <Text style={[styles.metricValue, { color: statusColor }]}>
            {area.densidade ? `${area.densidade.toFixed(1)}%` : '-'}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Medições</Text>
          <Text style={[styles.metricValue, { color: statusColor }]}>
            {area.totalMedicoes}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Última medição: {formatarData(area.ultimaMedicao)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#111111',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  headerLeft: {
    flex: 1,
  },
  codigo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rodovia: {
    fontSize: 12,
    color: '#7A7A7A',
    letterSpacing: 0.3,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  info: {
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    paddingTop: 10,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    color: '#6A6A6A',
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 12,
    color: '#C0C0C0',
    fontWeight: '500',
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6A6A6A',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1E1E1E',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 11,
    color: '#5A5A5A',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});