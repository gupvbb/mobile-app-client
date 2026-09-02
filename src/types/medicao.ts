import { Sensor } from './sensor';

export type MedicaoSimples = {
  id: number;
  sensor: Sensor;
  valor: number;
  data: Date;
};

export type Medicao = {
  id: number;
  areaId: number;
  areaCodigo?: string;
  alturaVegetacao: number;
  densidade: number;
  temperatura: number;
  umidade: number;
  tipoVegetacao?: string | null;
  inclinacaoTerreno?: number | null;
  dataColeta: string;
  sensorId?: string | null;
  sensor?: Sensor;
  observacoes?: string | null;
  status?: string;
};