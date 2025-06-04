// src/screens/AttractionDetailScreen/AttractionDetailScreen.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // <<< ADICIONADO Link
import './AttractionDetailScreen.css';
import BottomNav from '../../components/BottomNav/BottomNav';

import commonPostImage from '../../assets/images/img_praia.jpg'; 
import avatarAvaliador from '../../assets/images/avatar_avaliador.jpeg';

const Icon = ({ children, className }) => <span className={`icon ${className || ''}`}>{children}</span>;

const ReviewCard = ({ review }) => (
  <div className="review-card">
    <img src={review.avatarUrl} alt={`Avatar de ${review.name}`} className="review-avatar" />
    <div className="review-content">
      <div className="review-rating">{'⭐'.repeat(Math.round(review.rating))}</div>
      <p className="review-text">{review.text}</p>
    </div>
  </div>
);

const AttractionDetailScreen = () => {
  const { id } = useParams(); 
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const staticDetails = {
    likes: 200,
    comments: 200,
    overallRating: 5.0,
    images: [commonPostImage, commonPostImage, commonPostImage], 
    currentImageIndex: 0,
    reviews: [
      {
        id: 'rev1',
        avatarUrl: avatarAvaliador, 
        name: 'Usuário Satisfeito', 
        rating: 5,
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat lobortis ipsum nec auctor.'
      },
    ]
  };

  useEffect(() => {
    const fetchAttractionDetail = async () => {
      if (!id) { 
        setLoading(false);
        setError("ID da atração não fornecido.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://azimult.henriqueserra.com/api/v1/turism-attractions/${id}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Erro HTTP: ${response.status}` }));
          throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }
        const jsonData = await response.json();
        if (jsonData.status === 'success' && jsonData.data) {
          setAttraction(jsonData.data);
        } else {
          throw new Error(jsonData.message || 'Formato de dados inesperado da API.');
        }
      } catch (err) {
        console.error("Falha ao buscar detalhes da atração:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractionDetail();
  }, [id]); 

  if (loading) {
    return (
        <div className="detail-screen-container">
            <p className="loading-message">Carregando detalhes...</p>
            <BottomNav />
        </div>
    );
  }

  if (error) {
    return (
        <div className="detail-screen-container">
            <p className="error-message">Erro: {error}</p>
            <BottomNav />
        </div>
    );
  }

  if (!attraction) {
    return (
        <div className="detail-screen-container">
            <p className="info-message">Atração não encontrada.</p>
            <BottomNav />
        </div>
    );
  }

  return (
    <div className="detail-screen-container">
      <main className="attraction-detail-content">
        <div className="attraction-header">
            <h1>{attraction.title || 'Detalhes da Atração'}</h1>
        </div>

        <section className="attraction-gallery">
          <img 
            src={staticDetails.images[staticDetails.currentImageIndex]} 
            alt={attraction.title || 'Imagem da atração'} 
            className="attraction-main-image" 
          />
          <div className="carousel-dots detail-dots">
            {staticDetails.images.map((_, index) => (
              <span 
                key={index} 
                className={`dot ${index === staticDetails.currentImageIndex ? 'active' : ''}`}
              ></span>
            ))}
          </div>
          <div className="attraction-actions">
            <span><Icon>❤️</Icon> {staticDetails.likes}</span>
            <span><Icon>💬</Icon> {staticDetails.comments}</span>
            <span><Icon>➢</Icon></span>
          </div>
        </section>

        <section className="attraction-booking">
          {/* BOTÃO MODIFICADO PARA Link */}
          <Link 
            to={`/attraction/${attraction._id}/schedule`} 
            className="btn-book-now" // Reutiliza a classe do botão para estilo
          >
            Agendar agora!
          </Link>
        </section>
        
        <section className="attraction-info-block">
            <h2><Icon className="icon-blue">📍</Icon> Localização</h2>
            <p>{attraction.location}</p>
        </section>

        <section className="attraction-info-block description-main">
            <h2><Icon className="icon-blue">📄</Icon> Descrição</h2>
            <p>{attraction.description}</p>
        </section>

        <section className="attraction-info-block">
            <h2>Avaliação geral</h2>
            <div className="overall-rating">
                <span className="rating-value">{staticDetails.overallRating.toFixed(1)}</span>
                {'⭐'.repeat(Math.round(staticDetails.overallRating))}
            </div>
        </section>

        <section className="attraction-info-block">
            <h2>Avaliações</h2>
            <div className="reviews-list">
                {staticDetails.reviews.length > 0 ? (
                    staticDetails.reviews.map(review => <ReviewCard key={review.id} review={review} />)
                ) : (
                    <p>Nenhuma avaliação ainda.</p>
                )}
            </div>
            {staticDetails.reviews.length > 1 && (
                <div className="review-carousel-controls">
                    <button className="arrow-btn">&lt;</button>
                    <div className="carousel-dots review-dots">
                        {staticDetails.reviews.map((_, index) => (
                        <span key={index} className={`dot ${index === 0 ? 'active' : ''}`}></span>
                        ))}
                    </div>
                    <button className="arrow-btn">&gt;</button>
                </div>
            )}
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default AttractionDetailScreen;