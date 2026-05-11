import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Importe o seu CSS aqui

import logoPreta from './assets/Kaoa Preto.png';
import logoColorida from './assets/Kaoa Colorida.png';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 1. Adicionado estado para o menu mobile

  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const quoteBgRef = useRef(null);

  // Efeito de Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Animação do Cursor Personalizado
  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0;
    let animationFrameId;

    const onMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = mx + 'px';
        cursorRef.current.style.top = my + 'px';
      }
    };

    const animateCursor = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = rx + 'px';
        ringRef.current.style.top = ry + 'px';
      }
      animationFrameId = requestAnimationFrame(animateCursor);
    };

    document.addEventListener('mousemove', onMouseMove);
    animateCursor();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Scroll da Navbar e Efeito Parallax
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      // Parallax
      if (quoteBgRef.current) {
        const section = document.getElementById('quote-section');
        if (section) {
          const rect = section.getBoundingClientRect();
          const vh = window.innerHeight;
          if (rect.top < vh && rect.bottom > 0) {
            const progress = (vh - rect.top) / (vh + rect.height);
            const offset = (progress - 0.5) * 80;
            quoteBgRef.current.style.setProperty('--parallax-y', offset + 'px');
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observers (Revelar elementos e Animar Contadores)
  useEffect(() => {
    // Scroll Reveal
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(el => revealObserver.observe(el));

    // Contador
    const animateCounter = (el, target, suffix) => {
      const duration = 2000;
      const startTime = performance.now();
      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const text = entry.target.textContent;
          if (text.includes('+10')) animateCounter(entry.target, 10, '+');
          else if (text === '11') animateCounter(entry.target, 11, '');
          else if (text === '50') animateCounter(entry.target, 50, '');
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.exp-number').forEach(el => counterObserver.observe(el));

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  // Função para Scroll Suave nos Links Internos e fechar o menu
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // 2. Fecha o menu mobile ao clicar em um link
  };

  return (
    <>
      {/* CURSOR */}
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>

      {/* LOADER */}
      <div id="loader" className={isLoading ? '' : 'hidden'}>
        <div className="loader-logo">Kaoa Viagens</div>
        <div className="loader-line"></div>
      </div>

      {/* NAV */}
      <nav id="navbar" className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-container"> {/* 3. Container adicionado para o flexbox funcionar com o botão */}
          <a href="#hero" className="nav-logo" onClick={(e) => scrollToSection(e, '#hero')}>
            <div className="logo-wrapper">
              <img 
                src={logoPreta} 
                alt="Kaoa Viagens" 
                className={`logo-img logo-black ${isScrolled ? 'fade-out' : 'fade-in'}`} 
              />
              <img 
                src={logoColorida} 
                alt="Kaoa Viagens" 
                className={`logo-img logo-color ${isScrolled ? 'fade-in' : 'fade-out'}`} 
              />
            </div>
          </a>
          
          {/* 4. Texto duplicado "Kaoa Viagens" removido daqui */}

          {/* 5. Botão Menu Mobile (Hambúrguer) */}
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}> {/* 6. Classe para abrir/fechar */}
            <li><a href="#about" onClick={(e) => scrollToSection(e, '#about')}>Sobre</a></li>
            <li><a href="#destinations" onClick={(e) => scrollToSection(e, '#destinations')}>Destinos</a></li>
            <li><a href="#experience" onClick={(e) => scrollToSection(e, '#experience')}>Experiência</a></li>
            <li><a href="#awards" onClick={(e) => scrollToSection(e, '#awards')}>Prêmios</a></li>
            <li><a href="#contact" onClick={(e) => scrollToSection(e, '#contact')}>Contato</a></li>
            
            {/* CTA exclusivo do menu de celular */}
            <li className="mobile-only-cta">
              <a href="https://wa.me/554430562010" className="btn-primary" target="_blank" rel="noreferrer">
                Solicitar Orçamento
              </a>
            </li>
          </ul>
          
          {/* CTA do Desktop */}
          <a href="https://wa.me/554430562010" className="nav-cta desktop-cta" target="_blank" rel="noreferrer">Solicitar Orçamento</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className={`hero-bg ${!isLoading ? 'loaded' : ''}`} id="heroBg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-eyebrow">Agência de Viagens Premium — Umuarama, PR</p>
          <h1 className="hero-title">O Mundo<br />é <em>Imenso.</em><br />Descubra-o.</h1>
          <p className="hero-subtitle">Experiências que transcendem o ordinário. Roteiros criados para quem exige o melhor.</p>
          <div className="hero-actions">
            <a href="#destinations" className="btn-primary" onClick={(e) => scrollToSection(e, '#destinations')}>Explorar Destinos</a>
            <a href="#about" className="btn-ghost" onClick={(e) => scrollToSection(e, '#about')}>Nossa História</a>
          </div>
        </div>
        <div className="hero-scroll">
          <span>Rolar</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* AWARDS STRIP */}
      <div className="awards-strip">
        <div className="award-item">
          <div className="award-text">
            <strong>8× Troféu Hyperion</strong>
            <span>FRT Operadora · 2017–2024</span>
          </div>
        </div>
        <div className="award-divider"></div>
        <div className="award-item">
          <div className="award-text">
            <strong>3× Topseller Orinter</strong>
            <span>Operadora · 2022–2024</span>
          </div>
        </div>
        <div className="award-divider"></div>
        <div className="award-item">
          <div className="award-text">
            <strong>32 mil Seguidores</strong>
            <span>Instagram · Referência Nacional</span>
          </div>
        </div>
        <div className="award-divider"></div>
        <div className="award-item">
          <div className="award-text">
            <strong>Top 50 Emissores</strong>
            <span>Entre 5.469 agências Orinter</span>
          </div>
        </div>
      </div>

      {/* ABOUT */}
      <section id="about">
        <div className="about-visual reveal reveal-left">
          <img className="about-img-main" src="https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&q=80" alt="Viagem de luxo" />
          <img className="about-img-accent" src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=80" alt="Destino premium" />
          <div className="about-stat">
            <strong>+10</strong>
            <span>Anos de<br />excelência</span>
          </div>
        </div>
        <div className="about-text reveal reveal-right">
          <p className="section-label">Nossa História</p>
          <h2 className="section-title">Cada Viagem,<br />uma <em>Obra-Prima</em></h2>
          <p className="lead">Na Kaoa Viagens, acreditamos que viajar é muito mais do que chegar a um destino — é sobre transformar cada jornada em uma memória inesquecível.</p>
          <p>Com mais de duas décadas dedicadas ao turismo de alto padrão, construímos uma reputação que fala por si: 8 Troféus Hyperion, 3 títulos Topseller Orinter e a confiança de milhares de viajantes que escolheram viver experiências extraordinárias.</p>
          <p>Nosso escritório em Umuarama, Paraná, é o ponto de partida para destinos em todos os continentes. Da Grécia ao Japão, de Fernando de Noronha às Ilhas Maurício — montamos cada roteiro com a precisão de quem realmente conhece o destino.</p>
          <br />
          <a href="#contact" className="btn-primary" onClick={(e) => scrollToSection(e, '#contact')}>Fale com um especialista</a>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations">
        <div className="destinations-header">
          <div className="reveal">
            <p className="section-label">Onde o mundo nos chama</p>
            <h2 className="section-title">Destinos<br /><em>Exclusivos</em></h2>
          </div>
          <a href="#contact" className="btn-ghost reveal" style={{ marginBottom: '0.5rem' }} onClick={(e) => scrollToSection(e, '#contact')}>Ver todos os destinos →</a>
        </div>
        <div className="destinations-grid">
          {/* Santorni */}
          <div className="dest-card reveal">
            <img src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80" alt="Grécia - Santorini" />
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <p className="dest-region">Europa · Ilhas Gregas</p>
              <h3 className="dest-name">Santorini<br />& Mykonos</h3>
              <span className="dest-tag">Pacote Exclusivo</span>
            </div>
          </div>
          {/* Outros destinos seguem a mesma lógica (tags fechadas corretamente) */}
          <div className="dest-card reveal reveal-delay-1">
            <img src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800&q=80" alt="Maurício" />
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <p className="dest-region">Oceano Índico</p>
              <h3 className="dest-name">Ilhas Maurício</h3>
              <span className="dest-tag">Lua de Mel</span>
            </div>
          </div>
          <div className="dest-card reveal reveal-delay-2">
            <img src="https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=775&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Maldivas" />
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <p className="dest-region">Ásia · Sul</p>
              <h3 className="dest-name">Maldivas</h3>
              <span className="dest-tag">Ultra Luxo</span>
            </div>
          </div>
          <div className="dest-card reveal reveal-delay-1">
            <img src="https://images.unsplash.com/photo-1544085311-11a028465b03?w=800&q=80" alt="Fernando de Noronha" />
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <p className="dest-region">Brasil · Nordeste</p>
              <h3 className="dest-name">Fernando<br />de Noronha</h3>
              <span className="dest-tag">Natureza Pura</span>
            </div>
          </div>
          <div className="dest-card reveal reveal-delay-2">
            <img src="https://images.unsplash.com/photo-1535560072261-658ffa11da52?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SXJsYW5kYSUyMGUlMjBFc2NvY2lhfGVufDB8fDB8fHww" alt="Irlanda" />
            <div className="dest-overlay"></div>
            <div className="dest-info">
              <p className="dest-region">Europa · Ilhas Britânicas</p>
              <h3 className="dest-name">Irlanda<br />& Escócia</h3>
              <span className="dest-tag">Aventura Cultural</span>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE NUMBERS */}
      <section id="experience">
        <div className="exp-header reveal">
          <p className="section-label">Números que inspiram confiança</p>
          <h2 className="section-title">Nossa <em>Experiência</em></h2>
        </div>
        <div className="exp-grid">
          <div className="exp-item reveal reveal-delay-1">
            <span className="exp-number">+10</span>
            <span className="exp-label">Anos no mercado</span>
            <div className="exp-divider"></div>
            <p className="exp-desc">Mais de duas décadas dedicadas a criar experiências de viagem incomparáveis.</p>
          </div>
          <div className="exp-item reveal reveal-delay-2">
            <span className="exp-number">11</span>
            <span className="exp-label">Troféus conquistados</span>
            <div className="exp-divider"></div>
            <p className="exp-desc">8× Hyperion FRT e 3× Topseller Orinter, reconhecimento da excelência no turismo.</p>
          </div>
          <div className="exp-item reveal reveal-delay-3">
            <span className="exp-number">50</span>
            <span className="exp-label">Top emissores Orinter</span>
            <div className="exp-divider"></div>
            <p className="exp-desc">Entre 5.469 agências parceiras, estamos no seleto grupo das 50 maiores emissoras.</p>
          </div>
          <div className="exp-item reveal reveal-delay-4">
            <span className="exp-number">32k</span>
            <span className="exp-label">Seguidores no Instagram</span>
            <div className="exp-divider"></div>
            <p className="exp-desc">Uma comunidade de viajantes apaixonados que confiam na nossa curadoria de destinos.</p>
          </div>
        </div>
      </section>

      {/* PARALLAX QUOTE */}
      <section id="quote-section">
        <div className="quote-bg" id="quoteBg" ref={quoteBgRef}></div>
        <div className="quote-overlay"></div>
        <div className="quote-content reveal">
          <span className="quote-mark">"</span>
          <blockquote>Viajar é a única coisa que você compra que te faz mais rico</blockquote>
          <p className="quote-author">— A filosofia da Kaoa Viagens</p>
        </div>
      </section>

      {/* AWARDS */}
      <section id="awards">
        <div className="awards-inner">
          <div>
            <div className="reveal">
              <p className="section-label">Reconhecimento nacional</p>
              <h2 className="section-title">Premiada pela<br /><em>Excelência</em></h2>
            </div>
            <div className="awards-list">
              <div className="award-row reveal reveal-delay-1">
                <span className="award-year">2024</span>
                <div className="award-info">
                  <strong>Troféu Hyperion — FRT Operadora</strong>
                  <span>8ª conquista consecutiva</span>
                </div>
              </div>
              <div className="award-row reveal reveal-delay-1">
                <span className="award-year">2024</span>
                <div className="award-info">
                  <strong>Topseller Orinter</strong>
                  <span>3ª conquista · Top 50 de 5.469 agências</span>
                </div>
              </div>
              <div className="award-row reveal reveal-delay-2">
                <span className="award-year">2023</span>
                <div className="award-info">
                  <strong>Troféu Hyperion — FRT Operadora</strong>
                  <span>7ª conquista consecutiva</span>
                </div>
              </div>
              <div className="award-row reveal reveal-delay-2">
                <span className="award-year">2022</span>
                <div className="award-info">
                  <strong>Troféu Hyperion + Topseller Orinter</strong>
                  <span>Duplo reconhecimento de excelência</span>
                </div>
              </div>
              <div className="award-row reveal reveal-delay-3">
                <span className="award-year">2017–</span>
                <div className="award-info">
                  <strong>Hyperion FRT — Série Histórica</strong>
                  <span>2017, 2018, 2019, 2020, 2021</span>
                </div>
              </div>
            </div>
          </div>
          <div className="awards-visual reveal reveal-right">
            <img src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80" alt="Kaoa Viagens - Premiação" />
            <div className="awards-badge">
              <strong>11</strong>
              <span>Troféus conquistados</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <div className="contact-inner">
          <div className="reveal">
            <p className="section-label">Comece sua jornada</p>
            <h2 className="section-title">Vamos Planejar<br />sua <em>Viagem Perfeita</em></h2>
          </div>
          <p className="reveal">Nossa equipe de especialistas está pronta para criar o roteiro ideal para você. Seja uma lua de mel nas Maldivas, uma aventura pela Europa ou um resort de luxo em Noronha — a Kaoa Viagens cuida de cada detalhe.</p>
          <div className="reveal">
            <a href="https://wa.me/554430562010" className="btn-primary" target="_blank" rel="noreferrer">Falar no WhatsApp</a>
          </div>
          <div className="contact-details reveal">
            <div className="contact-item">
              <span>Telefone</span>
              <a href="tel:+554430562010">(44) 3056-2010</a>
            </div>
            <div className="contact-item">
              <span>E-mail</span>
              <a href="mailto:alexandre@kaoaviagens.com.br">alexandre@kaoaviagens.com.br</a>
            </div>
            <div className="contact-item">
              <span>Endereço</span>
              <p>Av. Paraná, 5382 — Umuarama, PR</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">Kaoa Viagens</span>
        <p className="footer-copy">© 2026 Kaoa Viagens — Morais &amp; Souza Viagens e Turismo Ltda<br />Umuarama, Paraná, Brasil</p>
        <div className="footer-social">
          <a href="https://instagram.com/kaoaviagens" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://facebook.com/kaoaviagens" target="_blank" rel="noreferrer">Facebook</a>
          <a href="https://wa.me/554430562010" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </footer>
    </>
  );
}

export default App;