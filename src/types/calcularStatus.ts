import { StatusMedicao } from '../types/statusMedicao';

export function calcularStatus(valor: number): StatusMedicao {
  if (valor > 100) return "critico";
  if (valor > 80) return "alerta";
  return "normal";
}