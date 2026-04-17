import { Link, router } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', sans-serif;
          background: #f8f9fa;
          color: #191c1d;
        }

        .font-headline { font-family: 'Manrope', sans-serif; }

        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          direction: ltr;
          -webkit-font-smoothing: antialiased;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .icon-filled {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }

        .atmospheric-shadow {
          box-shadow: 0px 20px 40px rgba(17, 24, 39, 0.06);
        }

        .ghost-border {
          outline: 1px solid rgba(195, 197, 215, 0.2);
        }

        .btn-gradient {
          background: linear-gradient(135deg, #003fb1 0%, #1a56db 100%);
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 50;
          background: rgba(248, 249, 250, 0.8);
          backdrop-filter: blur(20px);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }

        .navbar-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          max-width: 80rem;
          margin: 0 auto;
        }

        .navbar-logo {
          font-family: 'Manrope', sans-serif;
          font-size: 1.2rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.05em;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .navbar-links a {
          font-family: 'Manrope', sans-serif;
          text-decoration: none;
          color: #475569;
          transition: color 0.2s;
        }

        .navbar-links a:hover { color: #2563eb; }

        .navbar-links a.active {
          color: #1d4ed8;
          font-weight: 700;
          border-bottom: 2px solid #1d4ed8;
          padding-bottom: 2px;
        }

        .btn-primary {
          display: inline-block;
          background: linear-gradient(135deg, #003fb1 0%, #1a56db 100%);
          color: #fff;
          padding: 0.625rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-family: 'Manrope', sans-serif;
          border: none;
          cursor: pointer;
          letter-spacing: -0.02em;
          box-shadow: 0 8px 20px rgba(0, 63, 177, 0.2);
          transition: transform 0.15s, opacity 0.15s;
          text-decoration: none;
        }

        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:active { transform: scale(0.96); }

        .btn-secondary {
          display: inline-block;
          background: #e1e3e4;
          color: #003fb1;
          padding: 0.625rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-family: 'Manrope', sans-serif;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
        }

        .btn-secondary:hover { background: #d9dadb; }

        /* Hero */
        .hero {
          padding: 8rem 2rem 5rem;
          max-width: 80rem;
          margin: 0 auto;
          overflow: hidden;
          position: relative;
        }

        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-badge {
          font-size: 0.75rem;
          color: #003fb1;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 1rem;
        }

        .hero-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #191c1d;
          margin-bottom: 1.5rem;
        }

        .hero-title .highlight { color: #003fb1; }

        .hero-desc {
          font-size: 1.125rem;
          color: #434654;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          max-width: 32rem;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .hero-cta .btn-primary {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          box-shadow: 0 16px 32px rgba(0, 63, 177, 0.2);
        }

        .hero-cta .btn-secondary {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .hero-image-wrap {
          position: relative;
        }

        .hero-image-glow {
          position: absolute;
          inset: -1rem;
          background: rgba(0, 63, 177, 0.05);
          border-radius: 2rem;
          filter: blur(40px);
          transition: background 0.7s;
        }

        .hero-image-wrap:hover .hero-image-glow {
          background: rgba(0, 63, 177, 0.1);
        }

        .hero-image-card {
          position: relative;
          background: #fff;
          border-radius: 0.75rem;
          overflow: hidden;
          padding: 1rem;
          box-shadow: 0px 20px 40px rgba(17, 24, 39, 0.06);
          outline: 1px solid rgba(195, 197, 215, 0.2);
        }

        .hero-image-card img {
          border-radius: 0.5rem;
          width: 100%;
          height: auto;
          display: block;
        }

        /* Features */
        .features {
          background: #f3f4f5;
          padding: 6rem 2rem;
        }

        .features-inner {
          max-width: 80rem;
          margin: 0 auto;
        }

        .section-label {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 700;
          color: #191c1d;
          margin-bottom: 0.75rem;
        }

        .section-sub {
          color: #434654;
          max-width: 36rem;
          margin-bottom: 3rem;
          line-height: 1.6;
        }

        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }

        .bento-card {
          background: #fff;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0px 20px 40px rgba(17, 24, 39, 0.06);
          outline: 1px solid rgba(195, 197, 215, 0.2);
        }

        .bento-card-lg { grid-column: span 8; display: flex; flex-direction: column; justify-content: space-between; }
        .bento-card-sm { grid-column: span 4; }
        .bento-card-blue { grid-column: span 4; background: #003fb1; color: #fff; border-radius: 0.75rem; padding: 2rem; box-shadow: 0px 20px 40px rgba(17, 24, 39, 0.06); }
        .bento-card-wide { grid-column: span 8; display: flex; align-items: center; justify-content: space-between; gap: 2rem; }

        .bento-icon {
          width: 3rem;
          height: 3rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .bento-card-title {
          font-family: 'Manrope', sans-serif;
          font-size: 1.35rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #191c1d;
        }

        .bento-card-blue .bento-card-title { color: #fff; }

        .bento-card-desc { color: #434654; line-height: 1.6; }
        .bento-card-blue .bento-card-desc { color: rgba(255,255,255,0.8); }

        .tags-row {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #d9dadb;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .tag {
          background: #f8f9fa;
          padding: 0.35rem 1rem;
          border-radius: 9999px;
          font-size: 0.85rem;
          font-weight: 500;
          color: #003fb1;
        }

        /* Benefits */
        .benefits {
          padding: 6rem 2rem;
          max-width: 80rem;
          margin: 0 auto;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
        }

        .benefits-img {
          border-radius: 0.75rem;
          width: 100%;
          height: auto;
          box-shadow: 0px 20px 40px rgba(17, 24, 39, 0.06);
        }

        .benefits-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 3vw, 2.5rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 2.5rem;
          color: #191c1d;
        }

        .benefits-title .highlight { color: #003fb1; }

        .benefit-item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .benefit-icon {
          flex-shrink: 0;
          width: 3rem;
          height: 3rem;
          border-radius: 9999px;
          background: rgba(0, 63, 177, 0.05);
          border: 1px solid rgba(0, 63, 177, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .benefit-item h4 {
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          margin-bottom: 0.35rem;
          color: #191c1d;
        }

        .benefit-item p { color: #434654; line-height: 1.6; }

        /* CTA */
        .cta-section {
          padding: 5rem 2rem;
          margin-bottom: 3rem;
        }

        .cta-inner {
          max-width: 80rem;
          margin: 0 auto;
          border-radius: 0.75rem;
          background: #0f172a;
          padding: 5rem 3rem;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .cta-blob-1 {
          position: absolute; top: 0; right: 0;
          width: 16rem; height: 16rem;
          background: rgba(0, 63, 177, 0.2);
          border-radius: 9999px;
          filter: blur(100px);
        }

        .cta-blob-2 {
          position: absolute; bottom: 0; left: 0;
          width: 24rem; height: 24rem;
          background: rgba(0, 63, 177, 0.1);
          border-radius: 9999px;
          filter: blur(100px);
        }

        .cta-content { position: relative; z-index: 1; }

        .cta-title {
          font-family: 'Manrope', sans-serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 1.25rem;
          letter-spacing: -0.03em;
        }

        .cta-desc {
          color: #94a3b8;
          font-size: 1.1rem;
          max-width: 36rem;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
        }

        .cta-btns { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

        .cta-btns .btn-primary {
          padding: 1.2rem 2.5rem;
          font-size: 1.15rem;
          box-shadow: 0 20px 40px rgba(0, 63, 177, 0.4);
        }

        .cta-btn-ghost {
          background: rgba(255,255,255,0.1);
          color: #fff;
          padding: 1.2rem 2.5rem;
          border-radius: 0.5rem;
          font-weight: 700;
          font-size: 1.15rem;
          font-family: 'Manrope', sans-serif;
          border: none;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s;
        }

        .cta-btn-ghost:hover { background: rgba(255,255,255,0.2); }

        /* Footer */
        .footer {
          background: #f8fafc;
          border-top: 1px solid #f1f5f9;
          padding: 3rem 2rem;
        }

        .footer-inner {
          max-width: 80rem;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .footer-brand { font-family: 'Manrope', sans-serif; font-weight: 700; color: #0f172a; font-size: 1.1rem; }
        .footer-copy { font-size: 0.85rem; color: #94a3b8; margin-top: 0.5rem; }

        .footer-links { display: flex; gap: 2rem; }
        .footer-links a { color: #94a3b8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
        .footer-links a:hover { color: #0f172a; }

        .footer-icons { display: flex; gap: 1rem; }

        .footer-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 9999px;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          color: #475569;
        }

        .footer-icon:hover { background: #003fb1; color: #fff; }
        .footer-icon .material-symbols-outlined { font-size: 18px; }

        /* Responsive */
        @media (max-width: 900px) {
          .navbar-links { display: none; }
          .hero-grid { grid-template-columns: 1fr; }
          .bento-grid { grid-template-columns: 1fr; }
          .bento-card-lg, .bento-card-sm, .bento-card-blue, .bento-card-wide { grid-column: span 1; }
          .benefits-grid { grid-template-columns: 1fr; }
          .benefits-img-wrap { order: 2; }
          .benefits-text { order: 1; }
          .footer-inner { flex-direction: column; text-align: center; }
        }
      `}</style>

            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-inner">
                    <div className="navbar-logo font-headline">
                        Estoque Master
                    </div>

                    <div className="navbar-links">
                        <a href="#" className="active">
                            Início
                        </a>
                        <a href="#funcionalidades">Funcionalidades</a>
                        <a href="#beneficios">Sobre</a>
                    </div>
                    <Link href="/login" className="btn-primary">
                        Entrar
                    </Link>
                </div>
            </nav>

            <main>
                {/* Hero */}
                <section className="hero">
                    <div className="hero-grid">
                        <div>
                            <span className="hero-badge">
                                Gestão Inteligente
                            </span>
                            <h1 className="hero-title font-headline">
                                Controle total do seu{' '}
                                <span className="highlight">almoxarifado</span>
                            </h1>
                            <p className="hero-desc">
                                Gerencie EPIs, equipamentos e insumos com
                                precisão cirúrgica. Reduza perdas em até 30% e
                                mantenha sua equipe segura com um inventário
                                sempre atualizado.
                            </p>
                            <div className="hero-cta">
                                <button className="btn-primary">
                                    Acessar sistema
                                </button>
                                <button className="btn-secondary">
                                    Ver demonstração
                                </button>
                            </div>
                        </div>

                        <div className="hero-image-wrap">
                            <div className="hero-image-glow" />
                            <div className="hero-image-card">
                                <img src="/gestao.png" alt="Dashboard view" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Funcionalidades */}
                <section id="funcionalidades" className="features">
                    <div className="features-inner">
                        <h2 className="section-label font-headline">
                            Arquitetura de Controle
                        </h2>
                        <p className="section-sub">
                            Funcionalidades desenhadas para eliminar a incerteza
                            e automatizar o fluxo de materiais da sua empresa.
                        </p>

                        <div className="bento-grid">
                            {/* Card grande */}
                            <div className="bento-card bento-card-lg">
                                <div>
                                    <div
                                        className="bento-icon"
                                        style={{ background: '#dbe1ff' }}
                                    >
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: '#003fb1' }}
                                        >
                                            inventory_2
                                        </span>
                                    </div>
                                    <h3 className="bento-card-title font-headline">
                                        Controle de estoque
                                    </h3>
                                    <p className="bento-card-desc">
                                        Rastreamento em tempo real de entradas e
                                        saídas com notificações inteligentes de
                                        baixo nível de estoque.
                                    </p>
                                </div>
                                <div className="tags-row">
                                    {[
                                        'Entrada manual',
                                        'Leitor QR Code',
                                        'Sincronização Cloud',
                                    ].map((t) => (
                                        <span key={t} className="tag">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Card azul */}
                            <div className="bento-card-blue">
                                <div
                                    className="bento-icon"
                                    style={{
                                        background: 'rgba(255,255,255,0.2)',
                                    }}
                                >
                                    <span
                                        className="material-symbols-outlined icon-filled"
                                        style={{ color: '#fff' }}
                                    >
                                        security
                                    </span>
                                </div>
                                <h3 className="bento-card-title font-headline">
                                    Gestão de EPIs
                                </h3>
                                <p className="bento-card-desc">
                                    Controle rigoroso de entrega de equipamentos
                                    de proteção individual por colaborador.
                                </p>
                            </div>

                            {/* Card pequeno */}
                            <div className="bento-card bento-card-sm">
                                <div
                                    className="bento-icon"
                                    style={{ background: '#86f2e4' }}
                                >
                                    <span
                                        className="material-symbols-outlined"
                                        style={{ color: '#006a61' }}
                                    >
                                        construction
                                    </span>
                                </div>
                                <h3 className="bento-card-title font-headline">
                                    Equipamentos
                                </h3>
                                <p className="bento-card-desc">
                                    Registro detalhado de máquinas e
                                    ferramentas, histórico de uso e manutenção.
                                </p>
                            </div>

                            {/* Card largo */}
                            <div className="bento-card bento-card-wide">
                                <div>
                                    <h3 className="bento-card-title font-headline">
                                        Relatórios e histórico
                                    </h3>
                                    <p className="bento-card-desc">
                                        Visualize tendências de consumo e tome
                                        decisões baseadas em dados reais com
                                        exportação simplificada.
                                    </p>
                                </div>
                                <span
                                    className="material-symbols-outlined"
                                    style={{
                                        color: '#003fb1',
                                        fontSize: '3.5rem',
                                    }}
                                >
                                    analytics
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefícios */}
                <section id="beneficios" className="benefits">
                    <div className="benefits-grid">
                        <div className="benefits-img-wrap">
                            <img
                                alt="Logistics efficiency"
                                className="atmospheric-shadow rounded-xl"
                                data-alt="Top down view of organized logistics warehouse shelves with warm cinematic lighting and professional workers using digital tablets"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYfk16OO9E7MsTefI5J4mirehYcRpSBDvgbMlOXM0q6Ycc85Q0jmpSpOdHDuTnJgGGPEKmDW6lM0-xM9Ud1k6n2Ef6aV2S0FPWIMBTBhIw-lT6kAH-l9HZa1AfMTGpvW507vjFdWBuRt4N9A6Kps--0cnJKh6ccfVto17kG6f0yazOImlSp0V6Vma4Wf7ffJyVuSaer6fe_NMAwMTnV_cWUI7-3TWJibOzZHjUV_X_gxllsC9HNeeoTxvQjfshPWMhY9u8i-7F_g"
                            />
                        </div>

                        <div className="benefits-text">
                            <h2 className="benefits-title font-headline">
                                Por que escolher o{' '}
                                <span className="highlight">
                                    Estoque Master
                                </span>
                                ?
                            </h2>

                            {[
                                {
                                    icon: 'bolt',
                                    title: 'Máxima Eficiência',
                                    desc: 'Elimine formulários em papel e planilhas confusas. Tudo centralizado em um só lugar.',
                                },
                                {
                                    icon: 'trending_down',
                                    title: 'Redução de Perdas',
                                    desc: 'Identifique desvios e desperdícios instantaneamente com o rastreamento individualizado.',
                                },
                                {
                                    icon: 'devices',
                                    title: 'Facilidade de Uso',
                                    desc: 'Interface intuitiva que exige treinamento mínimo para sua equipe de campo.',
                                },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} className="benefit-item">
                                    <div className="benefit-icon">
                                        <span
                                            className="material-symbols-outlined"
                                            style={{ color: '#003fb1' }}
                                        >
                                            {icon}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-headline">
                                            {title}
                                        </h4>
                                        <p>{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="cta-section">
                    <div className="cta-inner">
                        <div className="cta-blob-1" />
                        <div className="cta-blob-2" />
                        <div className="cta-content">
                            <h2 className="cta-title font-headline">
                                Pronto para digitalizar seu estoque?
                            </h2>
                            <p className="cta-desc">
                                Comece hoje mesmo a transformar seu almoxarifado
                                em um centro de excelência logística.
                            </p>
                            <div className="cta-btns">
                                <button className="btn-primary">
                                    Fazer login
                                </button>
                                <button className="cta-btn-ghost">
                                    Agendar demonstração
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-inner">
                    <div>
                        <div className="footer-brand font-headline">
                            Estoque Master
                        </div>
                        <p className="footer-copy">
                            © {new Date().getFullYear()} Estoque Master. Todos
                            os direitos reservados.
                        </p>
                    </div>

                    <div className="footer-links">
                        <a href="#">Termos de Uso</a>
                        <a href="#">Privacidade</a>
                    </div>

                    <div className="footer-icons">
                        {['share', 'mail'].map((icon) => (
                            <div key={icon} className="footer-icon">
                                <span className="material-symbols-outlined">
                                    {icon}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </>
    );
}
