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
      case StatusVegetacao.NORMAL:
        return '#1cb321'; // verde tech
      case StatusVegetacao.ATENCAO:
        return '#ffc800'; // azul (menos agressivo que laranja)
      case StatusVegetacao.URGENTE:
        return '#c50d00'; // vermelho moderno
      default:
        return '#69727f'; // cinza elegante
    }
  };

  const getStatusLabel = (status: StatusVegetacao): string => {
    switch (status) {
      case StatusVegetacao.NORMAL:
        return 'Normal';
      case StatusVegetacao.ATENCAO:
        return 'Atenção';
      case StatusVegetacao.URGENTE:
        return 'Urgente';
      default:
        return 'Desconhecido';
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.codigo}>{area.codigo}</Text>
          <Text style={styles.rodovia}>{area.rodovia}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(area.status) }]}>
          <Text style={styles.statusText}>{getStatusLabel(area.status)}</Text>
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
        <Text style={styles.value}> {area.ultimaMedicao ? `SENSOR-${area.codigo}` : 'Sem sensor'}
        </Text>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Altura Média</Text>
          <Text style={styles.metricValue}>
            {area.alturaMedia ? `${area.alturaMedia.toFixed(2)}m` : '-'}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Densidade</Text>
          <Text style={styles.metricValue}>
            {area.densidade ? `${area.densidade.toFixed(1)}%` : '-'}
          </Text>
        </View>

        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Medições</Text>
          <Text style={styles.metricValue}>{area.totalMedicoes}</Text>
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
    backgroundColor: '#1c1c1c', // fundo tech
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: '#62b156',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#E2E8F0',
    marginBottom: 2,
  },

  rodovia: {
    fontSize: 13,
    color: '#a3b0c2',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: '#0F172A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  info: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 10,
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  label: {
    fontSize: 13,
    color: '#94A3B8',
  },

  value: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '500',
  },

  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },

  metricBox: {
    flex: 1,
    alignItems: 'center',
  },

  metricLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 4,
  },

  metricValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3c7549', // destaque tech
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 8,
  },

  footerText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
  },
});