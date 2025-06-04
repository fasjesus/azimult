import React from 'react';
import './BottomNav.css';

const NavItem = ({ icon, label, active }) => (
  <button className={`nav-item ${active ? 'active' : ''}`}>
    <div className="nav-icon">{icon}</div>
    {/* <div className="nav-label">{label}</div>  Ocultado para ficar mais parecido com a imagem */}
  </button>
);

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavItem icon="⭐" label="Descobertas" active />
      <NavItem icon="🔍" label="Busca" />
      <NavItem icon="👤" label="Perfil" />
    </nav>
  );
};

export default BottomNav;