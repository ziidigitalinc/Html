/**
 * Sample websites for testing the HTML Section Studio and Visual Designer
 */

export const SAMPLE_SAAS_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexFlow - AI Automation Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;1,600&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.6;
    }
    .header-nav {
      background-color: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 18px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-logo {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      text-decoration: none;
      letter-spacing: -0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-badge {
      background: #4f46e5;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 28px;
      list-style: none;
    }
    .nav-link {
      color: #475569;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-link:hover {
      color: #4f46e5;
    }
    .btn-primary {
      background-color: #4f46e5;
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      display: inline-block;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary:hover {
      background-color: #4338ca;
    }
    .btn-outline {
      background-color: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
      display: inline-block;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-outline:hover {
      background-color: #f8fafc;
      border-color: #94a3b8;
    }
    
    /* Hero Section */
    .hero-section {
      padding: 80px 24px;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
      text-align: center;
    }
    .hero-container {
      max-width: 900px;
      margin: 0 auto;
    }
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: #e0e7ff;
      color: #4338ca;
      padding: 6px 16px;
      border-radius: 9999px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .hero-title {
      font-size: 54px;
      line-height: 1.15;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -1.5px;
      margin-bottom: 20px;
    }
    .hero-subtitle {
      font-size: 20px;
      color: #64748b;
      margin-bottom: 36px;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .hero-cta-group {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 48px;
    }

    /* Sub-Hero / Bottom of Hero / Social Proof */
    .sub-hero-proof {
      background-color: #ffffff;
      border-top: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
      padding: 40px 24px;
      text-align: center;
    }
    .proof-label {
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin-bottom: 24px;
    }
    .logo-cloud {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 48px;
    }
    .logo-item {
      font-size: 18px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: -0.5px;
      opacity: 0.85;
    }

    /* Features / Center */
    .features-section {
      padding: 96px 24px;
      background-color: #ffffff;
      max-width: 1200px;
      margin: 0 auto;
    }
    .section-header {
      text-align: center;
      max-width: 700px;
      margin: 0 auto 64px auto;
    }
    .section-tag {
      color: #4f46e5;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }
    .section-heading {
      font-size: 38px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -1px;
      margin-bottom: 16px;
    }
    .section-desc {
      font-size: 17px;
      color: #64748b;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 32px;
    }
    .feature-card {
      background-color: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 36px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
    }
    .card-icon {
      width: 48px;
      height: 48px;
      background-color: #eef2ff;
      color: #4f46e5;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 20px;
    }
    .card-title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .card-text {
      color: #64748b;
      font-size: 15px;
      line-height: 1.6;
    }

    /* Pre-Footer / Call to Action */
    .prefooter-cta {
      background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
      padding: 80px 24px;
      text-align: center;
      color: #ffffff;
    }
    .cta-container {
      max-width: 800px;
      margin: 0 auto;
    }
    .cta-title {
      font-size: 40px;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 18px;
    }
    .cta-desc {
      font-size: 18px;
      color: #e0e7ff;
      margin-bottom: 36px;
    }
    .cta-btn-white {
      background-color: #ffffff;
      color: #4338ca;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 16px;
      text-decoration: none;
      display: inline-block;
      transition: all 0.2s;
    }
    .cta-btn-white:hover {
      background-color: #f1f5f9;
      transform: scale(1.03);
    }

    /* Footer Section */
    .footer-section {
      background-color: #0f172a;
      color: #94a3b8;
      padding: 60px 24px 32px 24px;
    }
    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 40px;
      padding-bottom: 40px;
      border-bottom: 1px solid #1e293b;
    }
    .footer-brand {
      max-width: 320px;
    }
    .footer-logo {
      color: #ffffff;
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 12px;
    }
    .footer-links-col h4 {
      color: #ffffff;
      font-size: 15px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    .footer-links-col ul {
      list-style: none;
    }
    .footer-links-col li {
      margin-bottom: 10px;
    }
    .footer-links-col a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
    }
    .footer-links-col a:hover {
      color: #ffffff;
    }
    .footer-bottom {
      max-width: 1200px;
      margin: 24px auto 0 auto;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <!-- Section 1: Header & Navigation -->
  <header class="header-nav" id="site-header">
    <a href="#" class="brand-logo">
      <span>⚡ ApexFlow</span>
      <span class="brand-badge">PRO</span>
    </a>
    <nav>
      <ul class="nav-links">
        <li><a href="#features" class="nav-link">Features</a></li>
        <li><a href="#solutions" class="nav-link">Solutions</a></li>
        <li><a href="#pricing" class="nav-link">Pricing</a></li>
        <li><a href="#docs" class="nav-link">Documentation</a></li>
      </ul>
    </nav>
    <div style="display: flex; gap: 12px; align-items: center;">
      <a href="#login" class="nav-link">Log In</a>
      <a href="#get-started" class="btn-primary">Start Free Trial</a>
    </div>
  </header>

  <!-- Section 2: Hero / Main Banner -->
  <section class="hero-section" id="hero-banner">
    <div class="hero-container">
      <div class="pill-badge">
        <span>✨ Version 3.0 Released</span>
        <span>→</span>
      </div>
      <h1 class="hero-title">Automate your modern web workflows with intelligent precision</h1>
      <p class="hero-subtitle">Turn complex data pipelines into elegant automated triggers. Deploy in seconds, scale infinitely, and optimize real-time outputs without friction.</p>
      <div class="hero-cta-group">
        <a href="#signup" class="btn-primary" style="padding: 14px 32px; font-size: 16px;">Get Started Free</a>
        <a href="#demo" class="btn-outline" style="padding: 14px 28px; font-size: 16px;">Book Live Demo</a>
      </div>
    </div>
  </section>

  <!-- Section 3: Sub-Hero / Bottom of Hero (Social Proof & Metrics) -->
  <section class="sub-hero-proof" id="hero-bottom-proof">
    <p class="proof-label">Trusted by high-growth engineering teams worldwide</p>
    <div class="logo-cloud">
      <span class="logo-item">✦ ACME CORP</span>
      <span class="logo-item">✦ STRIPEWAY</span>
      <span class="logo-item">✦ QUANTUM LABS</span>
      <span class="logo-item">✦ SYNAPSE AI</span>
      <span class="logo-item">✦ GLOBAL VENTURES</span>
    </div>
  </section>

  <!-- Section 4: Center / Features Grid -->
  <section class="features-section" id="center-features">
    <div class="section-header">
      <div class="section-tag">Powerful Architecture</div>
      <h2 class="section-heading">Designed for engineers who demand total control</h2>
      <p class="section-desc">Everything you need to orchestrate systems, manage states, and inspect execution nodes in one unified visual cockpit.</p>
    </div>
    <div class="features-grid">
      <div class="feature-card">
        <div class="card-icon">⚡</div>
        <h3 class="card-title">Instant Zero-Cold-Start</h3>
        <p class="card-text">Execute distributed micro-tasks with sub-millisecond dispatch times across 40+ global edge locations.</p>
      </div>
      <div class="feature-card">
        <div class="card-icon">🛡️</div>
        <h3 class="card-title">SOC2 Type II Certified</h3>
        <p class="card-text">End-to-end payload encryption at rest and in flight with enterprise SSO and role-based audit telemetry.</p>
      </div>
      <div class="feature-card">
        <div class="card-icon">📊</div>
        <h3 class="card-title">Real-Time Observability</h3>
        <p class="card-text">Trace step-level bottlenecks visually with full timeline waterfalls, custom alert hooks, and metric exports.</p>
      </div>
    </div>
  </section>

  <!-- Section 5: Pre-Footer / Call to Action -->
  <section class="prefooter-cta" id="pre-footer-cta">
    <div class="cta-container">
      <h2 class="cta-title">Ready to transform your development velocity?</h2>
      <p class="cta-desc">Join over 12,000 teams who ship faster with ApexFlow. Set up your first workflow in less than 3 minutes.</p>
      <a href="#trial" class="cta-btn-white">Claim Your 14-Day Free Trial</a>
    </div>
  </section>

  <!-- Section 6: Footer Section -->
  <footer class="footer-section" id="site-footer">
    <div class="footer-container">
      <div class="footer-brand">
        <div class="footer-logo">⚡ ApexFlow</div>
        <p>The enterprise automation canvas for modern distributed engineering teams.</p>
      </div>
      <div class="footer-links-col">
        <h4>Product</h4>
        <ul>
          <li><a href="#">Visual Canvas</a></li>
          <li><a href="#">Edge Engine</a></li>
          <li><a href="#">Integrations</a></li>
          <li><a href="#">Enterprise SLA</a></li>
        </ul>
      </div>
      <div class="footer-links-col">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Documentation</a></li>
          <li><a href="#">API Reference</a></li>
          <li><a href="#">Status Page</a></li>
          <li><a href="#">Community Discord</a></li>
        </ul>
      </div>
      <div class="footer-links-col">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 ApexFlow Inc. All rights reserved.</span>
      <span>Designed with HTML Section Studio</span>
    </div>
  </footer>

</body>
</html>`;

export const SAMPLE_AGENCY_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kroma Studio - Bespoke Brand & Design Agency</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Outfit', sans-serif;
      color: #18181b;
      background-color: #fafaf9;
      line-height: 1.6;
    }
    .agency-nav {
      padding: 24px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fafaf9;
      border-bottom: 1px solid #e7e5e4;
    }
    .agency-logo {
      font-family: 'Playfair Display', serif;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: #1c1917;
      text-decoration: none;
    }
    .agency-menu {
      display: flex;
      gap: 32px;
      list-style: none;
    }
    .agency-menu a {
      text-decoration: none;
      color: #57534e;
      font-weight: 500;
      font-size: 15px;
    }
    .agency-menu a:hover {
      color: #000;
    }
    
    /* Hero */
    .agency-hero {
      padding: 100px 32px 80px 32px;
      max-width: 1100px;
      margin: 0 auto;
      text-align: center;
    }
    .agency-hero h1 {
      font-family: 'Playfair Display', serif;
      font-size: 64px;
      line-height: 1.1;
      font-weight: 700;
      color: #1c1917;
      margin-bottom: 24px;
      letter-spacing: -1.5px;
    }
    .agency-hero p {
      font-size: 20px;
      color: #78716c;
      max-width: 680px;
      margin: 0 auto 40px auto;
    }
    .agency-cta {
      display: inline-block;
      background-color: #1c1917;
      color: #fafaf9;
      padding: 16px 36px;
      border-radius: 9999px;
      text-decoration: none;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: opacity 0.2s;
    }
    .agency-cta:hover {
      opacity: 0.85;
    }

    /* Sub-hero */
    .agency-stats {
      background-color: #f5f5f4;
      padding: 50px 32px;
      border-top: 1px solid #e7e5e4;
      border-bottom: 1px solid #e7e5e4;
    }
    .stats-container {
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      justify-content: space-around;
      text-align: center;
      flex-wrap: wrap;
      gap: 24px;
    }
    .stat-number {
      font-size: 42px;
      font-weight: 800;
      color: #1c1917;
      line-height: 1;
      margin-bottom: 8px;
    }
    .stat-label {
      font-size: 14px;
      color: #78716c;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Center Portfolio */
    .agency-works {
      padding: 90px 32px;
      max-width: 1100px;
      margin: 0 auto;
    }
    .agency-works h2 {
      font-family: 'Playfair Display', serif;
      font-size: 38px;
      margin-bottom: 48px;
      text-align: center;
    }
    .work-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 32px;
    }
    .work-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e7e5e4;
    }
    .work-placeholder {
      height: 220px;
      background: linear-gradient(135deg, #e7e5e4 0%, #d6d3d1 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #57534e;
      font-weight: 600;
    }
    .work-info {
      padding: 24px;
    }
    .work-info h3 {
      font-size: 20px;
      margin-bottom: 8px;
      color: #1c1917;
    }
    .work-info p {
      color: #78716c;
      font-size: 14px;
    }

    /* Prefooter */
    .agency-inquiry {
      background-color: #1c1917;
      color: #ffffff;
      padding: 80px 32px;
      text-align: center;
    }
    .agency-inquiry h2 {
      font-family: 'Playfair Display', serif;
      font-size: 44px;
      margin-bottom: 16px;
    }
    .agency-inquiry p {
      color: #a8a29e;
      font-size: 18px;
      margin-bottom: 32px;
    }

    /* Footer */
    .agency-footer {
      background-color: #141312;
      color: #78716c;
      padding: 40px 32px;
      text-align: center;
      font-size: 14px;
      border-top: 1px solid #292524;
    }
  </style>
</head>
<body>
  <header class="agency-nav" id="agency-header">
    <a href="#" class="agency-logo">KROMA.</a>
    <nav>
      <ul class="agency-menu">
        <li><a href="#work">Case Studies</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#studio">The Studio</a></li>
        <li><a href="#contact">Inquiries</a></li>
      </ul>
    </nav>
  </header>

  <section class="agency-hero" id="agency-hero">
    <h1>We craft distinct digital identities for forward-thinking leaders</h1>
    <p>Strategy, brand systems, and bespoke digital experiences designed to move industries forward.</p>
    <a href="#contact" class="agency-cta">Start A Project</a>
  </section>

  <section class="agency-stats" id="agency-subhero-stats">
    <div class="stats-container">
      <div>
        <div class="stat-number">14+</div>
        <div class="stat-label">Years Experience</div>
      </div>
      <div>
        <div class="stat-number">180+</div>
        <div class="stat-label">Global Projects</div>
      </div>
      <div>
        <div class="stat-number">28</div>
        <div class="stat-label">Design Awards</div>
      </div>
    </div>
  </section>

  <section class="agency-works" id="agency-center-portfolio">
    <h2>Selected Case Studies</h2>
    <div class="work-grid">
      <div class="work-card">
        <div class="work-placeholder">✦ LUMEN ARCHITECTURE</div>
        <div class="work-info">
          <h3>Lumen Spatial Identity</h3>
          <p>Complete visual branding and minimalist spatial typography.</p>
        </div>
      </div>
      <div class="work-card">
        <div class="work-placeholder">✦ VELOX MOTORS</div>
        <div class="work-info">
          <h3>Velox EV Experience</h3>
          <p>Digital dashboard interface and design system architecture.</p>
        </div>
      </div>
      <div class="work-card">
        <div class="work-placeholder">✦ AURA WELLNESS</div>
        <div class="work-info">
          <h3>Aura Organic Packaging</h3>
          <p>Sustainable product packaging and tactile packaging system.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="agency-inquiry" id="agency-prefooter">
    <h2>Have a project in mind?</h2>
    <p>Let's collaborate on your brand's next monumental chapter.</p>
    <a href="mailto:hello@kroma.studio" class="agency-cta" style="background-color: #ffffff; color: #1c1917;">Get in Touch</a>
  </section>

  <footer class="agency-footer" id="agency-footer">
    <p>© 2026 Kroma Studio. Handcrafted for global brands. All rights reserved.</p>
  </footer>
</body>
</html>`;
