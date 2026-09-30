# 🌿 RoadGreen Mobile

Aplicativo mobile desenvolvido para o monitoramento de áreas de vegetação ao longo de rodovias.

O sistema permite visualizar informações das áreas monitoradas, consultar medições realizadas pelos sensores e simular novas coletas de dados por meio da API desenvolvida em Spring Boot.

---

## 👥 Integrantes

- Nicolas Cipriano — RM562278
- Nicolas Alves — RM561692
- Gustavo Pereira — RM563280
- Pedro de Castro — RM561825
- Thiago Almeida Souza — RM565365
- Gustavo Henrique — RM563874

---

## 🎯 Objetivo do sistema

O RoadGreen tem como objetivo auxiliar no monitoramento da vegetação presente em áreas próximas a rodovias.

A aplicação permite acompanhar informações como:

- Altura da vegetação;
- Densidade da vegetação;
- Temperatura;
- Umidade;
- Tipo de vegetação;
- Inclinação do terreno;
- Data da coleta;
- Status da área monitorada.

O aplicativo consome os dados disponibilizados pelo backend Spring Boot.

---

## 🧩 Funcionalidades

- Visualização das áreas monitoradas;
- Visualização do status de cada área;
- Consulta das medições registradas no backend;
- Visualização das métricas de vegetação;
- Detalhamento das áreas monitoradas;
- Simulação de uma nova coleta de dados;
- Atualização das informações após uma nova coleta;
- Tratamento de indisponibilidade do backend;
- Filtros de visualização das áreas por status.

---

## 🛠️ Tecnologias utilizadas

### Frontend

- React Native
- Expo
- TypeScript
- Axios

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- H2 Database

---

## 🔗 Repositórios

### Frontend

**Repositório:**  
https://github.com/gupvbb/mobile-app-client.git

### Backend

**Repositório:**  
https://github.com/gupvbb/roadside-veg-backend.git

---

# 📁 Estrutura principal do projeto

A estrutura principal utilizada no frontend está organizada da seguinte forma:


src/
├── components/
│   ├── AreaCard.tsx
│   └── SensorCard.tsx
│
├── screens/
│   └── DashboardScreen.tsx
│
├── services/
│   └── api.ts
│
└── types/
    ├── areaMonitoramento.ts
    ├── calcularStatus.ts
    ├── medicao.ts
    └── sensor.ts
---
 ## Como testar

### 1. Rodando o projeto

Execute  primeiro o Backend pelo IntelliJ ou via terminal:

```bash
./mvnw spring-boot:run
```

No terminal do VScode execute:
```bash
npm install 
npx expo start
```

## Link do video 

link do youtube: https://youtu.be/J4jHitwWQJ0