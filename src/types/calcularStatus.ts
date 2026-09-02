export type StatusMedicao = "normal" | "alerta" | "critico";

export function calcularStatus(valor: number): StatusMedicao {
  if (valor > 100) return "critico";
  if (valor > 80) return "alerta";
  return "normal";
}

export function getStatusColor(status: StatusMedicao | string): string {
  const s = status.toLowerCase();
  switch (s) {
    case "critico":
    case "urgente":
      return "#EF4444"; // Vermelho
    case "alerta":
    case "atencao":
      return "#F97316"; // Laranja
    case "normal":
      return "#22C55E"; // Verde
    default:
      return "#6B7280"; // Cinza
  }
}

export function getStatusLabel(status: StatusMedicao | string): string {
  const s = status.toLowerCase();
  switch (s) {
    case "critico":
    case "urgente":
      return "CRÍTICO";
    case "alerta":
    case "atencao":
      return "ALERTA";
    case "normal":
      return "NORMAL";
    default:
      return status.toUpperCase();
  }
}