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