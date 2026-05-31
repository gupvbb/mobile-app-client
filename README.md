# 🌿 RoadGreen Mobile

Aplicativo mobile de monitoramento de vegetação, desenvolvido em **React Native com TypeScript**.  
O sistema simula sensores instalados em rodovias, permitindo visualizar e acompanhar o estado da vegetação em tempo real.

---

##  Objetivo

O objetivo do aplicativo é representar um sistema inteligente de monitoramento ambiental, auxiliando na identificação de riscos como:

- Crescimento excessivo da vegetação  
- Falta de manutenção em áreas críticas  
- Condições que podem impactar a segurança das rodovias  

---

# Integrantes 
* Nicolas Cipriano   RM:562278 
* Nicolas Alves      RM:561692 
* Gustavo Pereira    RM:563280 
* Pedro de Castro    RM:561825 
* Thiago Almeida     RM:565365 
* Gustavo Henrique   RM:563874

---

## Funcionalidades

- 📊 Visualização de áreas monitoradas  
- 🚨 Identificação de status (Normal, Atenção, Urgente)  
- 🔄 Simulação de coleta de dados  
- 📈 Exibição de métricas da vegetação  
- 📍 Informações detalhadas por área  

---

##  Tecnologias utilizadas

- React Native (Expo)  
- TypeScript  
- Axios (consumo de API) 

---

##  Integração com API

O aplicativo consome uma API REST desenvolvida em Spring Boot, responsável por fornecer os dados de monitoramento.

---
 
## Cálculo de Status da Vegetação
 
O status de cada área é calculado automaticamente pela API com base em dois parâmetros coletados pelos sensores: **densidade da vegetação** e **altura da vegetação**.
 
| Status | Densidade | Altura | Significado |
|--------|-----------|--------|-------------|
| 🟢 **Normal** | até 50% | até 1.0m | Vegetação controlada, sem necessidade de intervenção imediata |
| 🟡 **Atenção** | 51% a 70% | 1.01m a 1.5m | Vegetação em crescimento, monitoramento recomendado |
| 🔴 **Urgente** | acima de 70% | acima de 1.5m | Vegetação fora do limite, intervenção necessária |
 
> Basta **uma** das condições ser verdadeira (densidade **OU** altura) para o status ser aplicado.
 
---
 
## Card de Monitoramento
 
Cada card exibido no dashboard representa uma área monitorada e mostra as seguintes informações:
 
| Campo | Descrição |
|-------|-----------|
| **Código** | Identificador único da área (ex: SP-280-KM-50) |
| **Rodovia** | Nome da rodovia monitorada |
| **Status** | Estado atual da vegetação (Normal, Atenção ou Urgente) |
| **Localização** | Pista ou trecho monitorado |
| **Km** | Faixa de quilometragem da área |
| **Terreno** | Tipo de terreno (Plano, Inclinado, Misto) |
| **Sensor** | ID do sensor responsável pela última coleta |
| **Altura Média** | Altura média da vegetação em metros |
| **Densidade** | Percentual de densidade da vegetação |
| **Medições** | Total de medições registradas nessa área |
| **Última medição** | Data e hora da coleta mais recente |

---

##  Feedback Visual

O sistema utiliza cores para indicar o estado da vegetação:

- 🟢 Normal → Situação controlada  
- 🟡 Atenção → Requer monitoramento  
- 🔴 Urgente → Situação crítica  

---

##  Como executar o projeto

```bash
npm install
npx expo start

## Como testar o status
 
1. Abra o app e visualize as áreas no dashboard
2. Use os filtros no topo para visualizar áreas por status (Urgente, Atenção, Normal)
3. Pressione o botão **🔬 Simular Coleta** para registrar novas medições via sensor
4. O status dos cards será atualizado automaticamente com base nos novos valores coletados