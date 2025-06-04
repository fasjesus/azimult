// src/screens/FeedScreen/FeedScreen.js
import React, { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard/PostCard';
import BottomNav from '../../components/BottomNav/BottomNav'; // Importe o BottomNav aqui
import './FeedScreen.css';
import commonPostImage from '../../assets/images/img_praia.jpg';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ... (lógica de fetchAttractions como antes) ...
    const fetchAttractions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://azimult.henriqueserra.com/api/v1/turism-attractions');
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        const jsonData = await response.json();
        if (jsonData.status === 'success' && jsonData.data && jsonData.data.result) {
          const transformedPosts = jsonData.data.result.map(attraction => ({
            id: attraction._id,
            location: attraction.title,
            imageUrl: commonPostImage,
            likes: Math.floor(Math.random() * 200) + 50,
            comments: Math.floor(Math.random() * 100) + 10,
            rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
            caption: attraction.description,
            totalImages: 1,
            currentImage: 0,
          }));
          setPosts(transformedPosts);
        } else {
          throw new Error(jsonData.message || 'Formato de dados inesperado da API.');
        }
      } catch (err) {
        console.error("Falha ao buscar atrações:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  if (loading) {
    return (
      <> {/* Use Fragment ou um div wrapper se precisar */}
        <div className="feed-screen main-content" style={{ padding: '20px', textAlign: 'center' }}>
          <p>Carregando atrações turísticas...</p>
        </div>
        <BottomNav />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="feed-screen main-content" style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
          <p>Ocorreu um erro ao buscar os dados: {error}</p>
        </div>
        <BottomNav />
      </>
    );
  }

  if (posts.length === 0 && !loading) { // Adicionado !loading para evitar mostrar antes de carregar
    return (
        <>
            <div className="feed-screen main-content" style={{ padding: '20px', textAlign: 'center' }}>
                <p>Nenhuma atração turística encontrada no momento.</p>
            </div>
            <BottomNav />
        </>
    );
  }

  return (
    <> {/* Use Fragment ou um div wrapper */}
      <main className="feed-screen main-content">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </main>
      <BottomNav />
    </>
  );
};

export default FeedScreen;