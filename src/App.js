// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FeedScreen from './screens/FeedScreen/FeedScreen';
import AttractionDetailScreen from './screens/AttractionDetailScreen/AttractionDetailScreen';
import ScheduleScreen from './screens/ScheduleScreen/ScheduleScreen'; // Importa a nova tela

import './index.css'; // Estilos globais

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Rota para a tela de Feed (página inicial) */}
          <Route path="/" element={<FeedScreen />} />
          
          {/* Rota para a tela de Detalhes da Atração */}
          <Route path="/attraction/:id" element={<AttractionDetailScreen />} />
          
          {/* NOVA ROTA: Rota para a tela de Agendamento */}
          {/* O :attractionId é o ID da atração turística para a qual o agendamento está sendo feito */}
          <Route path="/attraction/:attractionId/schedule" element={<ScheduleScreen />} />
          
          {/* Você pode adicionar outras rotas aqui no futuro */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;