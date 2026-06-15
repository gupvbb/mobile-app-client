import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Medicao } from '../types/medicao';
import { calcularStatus, getStatusColor, getStatusLabel } from '../types/calcularStatus';

type Props = {
  medicao: Medicao;
  onPress?: () => void;
};

export const SensorCard: React.FC<Props> = ({ medicao, onPress }) => {
  const valorPrincipal = medicao.alturaVegetacao;
  const status = calcularStatus(valorPrincipal);
  const color = getStatusColor(status);

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sensorNome}>Sensor de Vegetação</Text>
          <Text style={styles.sensorTipo}>Área: {medicao.areaCodigo}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: color + '18', borderColor: color }]}>
          <Text style={[styles.statusText, { color }]}>{getStatusLabel(status)}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Densidade:</Text>
          <Text style={styles.value}>{medicao.densidade.toFixed(1)}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Temperatura:</Text>
          <Text style={styles.value}>{medicao.temperatura}°C</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Umidade:</Text>
          <Text style={styles.value}>{medicao.umidade}%</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Altura</Text>
          <Text style={[styles.metricValue, { color }]}>
            {valorPrincipal.toFixed(2)}m
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {new Date(medicao.dataColeta).toLocaleString('pt-BR')}
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
  sensorNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E0E0E0',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sensorTipo: {
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