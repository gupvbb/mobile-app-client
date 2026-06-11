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
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sensorNome}>Sensor de Vegetação</Text>
          <Text style={styles.sensorTipo}>Área: {medicao.areaCodigo}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: color + '18', borderColor: color }]}>
          <Text style={[styles.statusText, { color }]}>{getStatusLabel(status)}</Text>
        </View>
      </View>

      <View style={styles.valorContainer}>
        <Text style={[styles.valor, { color }]}>{valorPrincipal.toFixed(2)}</Text>
        <Text style={styles.unidade}>m</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Densidade:</Text>
        <Text style={styles.infoValue}>{medicao.densidade.toFixed(1)}%</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Temperatura:</Text>
        <Text style={styles.infoValue}>{medicao.temperatura}°C</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Umidade:</Text>
        <Text style={styles.infoValue}>{medicao.umidade}%</Text>
      </View>

      <Text style={styles.data}>
        {new Date(medicao.dataColeta).toLocaleString('pt-BR')}
      </Text>
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
    borderColor: '#1E1E1E',
    borderLeftWidth: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sensorNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#D0D0D0',
    letterSpacing: 0.3,
  },
  sensorTipo: {
    fontSize: 12,
    color: '#6A6A6A',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  valorContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  valor: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  unidade: {
    fontSize: 16,
    color: '#6A6A6A',
    marginLeft: 6,
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E1E1E',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  infoLabel: {
    color: '#6A6A6A',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  infoValue: {
    color: '#C0C0C0',
    fontSize: 12,
    fontWeight: '500',
  },
  data: {
    fontSize: 11,
    color: '#5A5A5A',
    marginTop: 10,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
});