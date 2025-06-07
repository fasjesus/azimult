import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ScheduleScreen.css';
import BottomNav from '../../components/BottomNav/BottomNav';
import commonPostImage from '../../assets/images/img_praia.jpg'; 

const ScheduleScreen = () => {
  const { attractionId } = useParams(); 
  const navigate = useNavigate();

  const [attractionTitle, setAttractionTitle] = useState('Carregando atração...');
  const [quantity, setQuantity] = useState(''); 
  const [dateTime, setDateTime] = useState(''); 
  const [observation, setObservation] = useState(''); 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (attractionId) {
        setAttractionTitle("Vila de Pescadores - Itacaré"); 
    }
  }, [attractionId]);

  const handleGoBack = () => { navigate(-1); };

  const parseAndFormatDateTime = (dateTimeStr) => {
    const parts = dateTimeStr.match(/^(\d{2})\/(\d{2})\/(\d{4})\s(\d{2}):(\d{2})$/);
    if (!parts) return null; 
    return `${parts[3]}-${parts[2]}-${parts[1]} ${parts[4]}:${parts[5]}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); 
    setIsLoading(true);

    if (!quantity || parseInt(quantity, 10) <= 0) {
      setError("Por favor, informe uma quantidade de pessoas válida.");
      setIsLoading(false); return;
    }
    const formattedDate = parseAndFormatDateTime(dateTime);
    if (!formattedDate) {
      setError("Formato de data/hora inválido. Use DD/MM/YYYY HH:MM (ex: 30/04/2025 15:00).");
      setIsLoading(false); return;
    }

    const scheduleData = {
      date: formattedDate,
      observation: observation || "Nenhuma observação.", 
      quantity: parseInt(quantity, 10),
      attractionId: attractionId,
    };

    try {
      const response = await fetch('https://azimult.henriqueserra.com/api/v1/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify(scheduleData),
      });
      const responseData = await response.json();
      if (response.ok && responseData.status === 'success') {
        setSuccessMessage(responseData.message || "Agendamento realizado com sucesso!");
        setQuantity(''); setDateTime(''); setObservation('');
        setTimeout(() => { navigate('/'); }, 3000); 
      } else {
        setError(responseData.message || "Ocorreu um erro ao realizar o agendamento.");
      }
    } catch (err) {
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="schedule-screen-container">
      {}
      <main className="schedule-content">
        {}
        <div className="schedule-content-header">
          <button onClick={handleGoBack} className="content-back-button">
            &lt; 
          </button>
          <h1 className="content-main-title">{attractionTitle}</h1>
        </div>

        <img src={commonPostImage} alt={attractionTitle} className="schedule-attraction-image" />
        <div className="carousel-dots schedule-dots">
          <span className="dot"></span><span className="dot active"></span><span className="dot"></span>
        </div>
        <form onSubmit={handleSubmit} className="schedule-form">
          <div className="form-group">
            <label htmlFor="quantity">Quantidade de pessoas</label>
            <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Ex: 5" min="1"/>
          </div>
          <div className="form-group">
            <label htmlFor="datetime">Agendamento (Data e Hora)</label>
            <input type="text" id="datetime" value={dateTime} onChange={(e) => setDateTime(e.target.value)} placeholder="DD/MM/YYYY HH:MM (ex: 30/04/2025 15:00)"/>
          </div>
          <div className="form-group">
            <label htmlFor="observation">Observação (opcional)</label>
            <textarea id="observation" value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Alguma preferência ou informação adicional?" rows="3"/>
          </div>
          <p className="info-text">Após o agendamento o guia irá entrar em contato</p>
          {successMessage && !isLoading && <p className="success-message-form">{successMessage}</p>}
          {error && !isLoading && <p className="error-message-form">{error}</p>}
          <button type="submit" className="btn-schedule" disabled={isLoading || !!successMessage}>
            {isLoading ? 'Agendando...' : (successMessage ? 'Agendado!' : 'Agendar!')}
          </button>
        </form>
      </main>
      <BottomNav />
    </div>
  );
};
export default ScheduleScreen;
