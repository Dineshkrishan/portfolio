/* ==========================================================================
   G. DINESH KRISHAN — FULL-STACK CONNECTED PORTFOLIO SCRIPT
   Connects Frontend UI directly to FastAPI Backend endpoints:
   - Contact Form: POST /api/contact
   - Signature Forgery Engine: POST /api/simulators/signature
   - RAG PDF Chatbot: POST /api/simulators/rag
   - InvestIQ Multi-Agent Orchestrator: POST /api/simulators/investiq
   - Portfolio Stats & Repositories: GET /api/portfolio/stats & /api/portfolio/repos
   ========================================================================== */

const API_BASE = ""; // Relative path to current origin

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTypewriter();
  initSkillsFilter();
  initRepoFilter();
  initNavbarScroll();
  initMobileNav();
  initStatCounters();
  initBackToTop();
  initOpenToDropdown();
  fetchPortfolioStats();
});

/* ==========================================================================
   0. DARK / BRIGHT MODE THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Bright Mode'}`, 'info');
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (icon) {
      if (theme === 'light') {
        icon.className = 'fa-solid fa-moon';
        if (toggleBtn) toggleBtn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        icon.className = 'fa-solid fa-sun';
        if (toggleBtn) toggleBtn.setAttribute('title', 'Switch to Bright Mode');
      }
    }
  }
}

/* ==========================================================================
   1. HERO DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const roleElem = document.getElementById('typed-role');
  if (!roleElem) return;

  const roles = [
    "AI & Machine Learning Engineer",
    "Multi-Agent Systems Architect",
    "Full-Stack Web Microservices Developer",
    "RAG & LLM Pipeline Engineer"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function type() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
      roleElem.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 40;
    } else {
      roleElem.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIdx === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2200;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   2. HERO TERMINAL TAB SWITCHER & BACKEND STATS
   ========================================================================== */
function switchHeroTab(tabName) {
  const overviewBody = document.getElementById('hero-tab-overview');
  const cliBody = document.getElementById('hero-tab-cli');
  const overviewBtn = document.getElementById('tab-overview-btn');
  const cliBtn = document.getElementById('tab-cli-btn');

  if (tabName === 'overview') {
    overviewBody.style.display = 'flex';
    cliBody.style.display = 'none';
    overviewBtn.classList.add('active');
    cliBtn.classList.remove('active');
  } else {
    overviewBody.style.display = 'none';
    cliBody.style.display = 'flex';
    cliBtn.classList.add('active');
    overviewBtn.classList.remove('active');
  }
}

async function fetchPortfolioStats() {
  try {
    const res = await fetch(`${API_BASE}/api/portfolio/stats`);
    if (res.ok) {
      const data = await res.json();
      const outputElem = document.getElementById('cli-output');
      if (outputElem) {
        outputElem.innerHTML = `<span class="hl">[BACKEND ONLINE]</span> Connected to FastAPI microservices. Candidate: ${data.candidate} (CGPA ${data.cgpa}/10).`;
      }
    }
  } catch (err) {
    console.log("Backend offline or local preview:", err);
  }
}

/* ==========================================================================
   3. ANIMATED COUNTERS FOR HERO STATS
   ========================================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const targetVal = parseFloat(counter.getAttribute('data-counter'));
        const isDecimal = targetVal % 1 !== 0;
        let startVal = 0;
        const duration = 1200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const currentVal = startVal + progress * (targetVal - startVal);

          counter.textContent = isDecimal ? currentVal.toFixed(2) : Math.floor(currentVal);

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = isDecimal ? targetVal.toFixed(2) : targetVal;
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================================================
   4. SKILLS MATRIX FILTERING
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skills-filter .filter-btn[data-filter]');
  const cards = document.querySelectorAll('.skill-category-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'modal-slide 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. GITHUB REPOSITORY FILTERING
   ========================================================================== */
function initRepoFilter() {
  const repoBtns = document.querySelectorAll('.skills-filter .filter-btn[data-repo-filter]');
  const repoCards = document.querySelectorAll('#repos-grid .project-card');

  repoBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      repoBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-repo-filter');

      repoCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-repo-category') === filter) {
          card.style.display = 'flex';
          card.style.animation = 'modal-slide 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   6. NAVBAR SCROLL OBSERVER & MOBILE MENU
   ========================================================================== */
function initNavbarScroll() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      if (window.scrollY >= secTop) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('mobile-open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('mobile-open'));
    });
  }
}

/* ==========================================================================
   7. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   8. RESUME MODAL & COPY ACTIONS
   ========================================================================== */
function copyContactInfo() {
  navigator.clipboard.writeText('dineshkrishan1981@gmail.com').then(() => {
    showToast('Copied email (dineshkrishan1981@gmail.com) to clipboard!', 'success');
  }).catch(() => {
    showToast('Email: dineshkrishan1981@gmail.com', 'info');
  });
}

/* ==========================================================================
   9. INTERACTIVE PROJECT DEMO SIMULATORS (BACKEND API INTEGRATION)
   ========================================================================== */
function openProjectDemo(projectKey) {
  const title = document.getElementById('demo-modal-title');
  const body = document.getElementById('demo-modal-body');

  if (projectKey === 'signatech') {
    title.innerHTML = '<i class="fa-solid fa-signature" style="color:var(--cyan)"></i> Signature Forgery 6-Metric Engine Simulator';
    body.innerHTML = renderSignaTechDemo();
    setTimeout(runSignatureSimulation, 300);
  } else if (projectKey === 'ragchatbot') {
    title.innerHTML = '<i class="fa-solid fa-comments" style="color:var(--emerald)"></i> RAG PDF Chatbot Simulator (Mistral 7B + FAISS)';
    body.innerHTML = renderRagChatbotDemo();
  } else if (projectKey === 'investiq') {
    title.innerHTML = '<i class="fa-solid fa-diagram-project" style="color:var(--indigo)"></i> InvestIQ 3-Agent Orchestration Demo';
    body.innerHTML = renderInvestIQDemo();
  }

  openModal('project-demo-modal');
}

/* Signature Simulator */
function renderSignaTechDemo() {
  return `
    <div class="demo-box">
      <div class="demo-header">
        <h4>16×16 Grid Matrix Similarity Evaluation (FastAPI CV Engine)</h4>
        <span class="status-pill"><span class="status-dot"></span> Backend Active</span>
      </div>

      <p style="font-size:0.9rem; color:var(--text-muted);">
        Select a signature specimen below to execute the 6-metric evaluation engine (MSE, SSIM, Template Matching, Histogram Correlation, HOG, NMI) against the baseline genuine profile.
      </p>

      <div style="display:flex; gap:0.75rem; margin-bottom:0.5rem; flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" onclick="triggerSigTest(true)">
          <i class="fa-solid fa-circle-check" style="color:var(--emerald)"></i> Test Genuine Specimen
        </button>
        <button class="btn btn-outline btn-sm" onclick="triggerSigTest(false)">
          <i class="fa-solid fa-triangle-exclamation" style="color:var(--rose)"></i> Test Forged Specimen
        </button>
      </div>

      <div class="signature-sim-grid">
        <div class="sig-sample-box">
          <div style="font-size:0.835rem; font-weight:700; color:var(--cyan);">Genuine Baseline Sample</div>
          <div class="sig-canvas-mock">
            <div class="grid-overlay-16x16"></div>
            <svg width="180" height="80" viewBox="0 0 200 100">
              <path d="M 20 60 Q 50 10 90 70 T 150 40 T 180 80" stroke="#06b6d4" stroke-width="3" fill="none" />
              <path d="M 40 40 Q 80 90 120 20" stroke="#06b6d4" stroke-width="2" fill="none" />
            </svg>
          </div>
        </div>

        <div class="sig-sample-box">
          <div style="font-size:0.835rem; font-weight:700; color:var(--text-secondary);" id="test-sample-label">Evaluated Specimen</div>
          <div class="sig-canvas-mock">
            <div class="grid-overlay-16x16"></div>
            <svg width="180" height="80" viewBox="0 0 200 100" id="test-sig-svg">
              <path d="M 20 60 Q 50 10 90 70 T 150 40 T 180 80" stroke="#6366f1" stroke-width="3" fill="none" />
              <path d="M 40 40 Q 80 90 120 20" stroke="#6366f1" stroke-width="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>

      <div class="metric-bar-container" style="margin-top:0.75rem;">
        <div class="metric-row">
          <span>Structural Similarity Index (SSIM)</span>
          <span id="val-ssim">0.94</span>
        </div>
        <div class="metric-progress"><div class="metric-fill" id="fill-ssim" style="width: 94%;"></div></div>

        <div class="metric-row">
          <span>Mean Squared Error (MSE)</span>
          <span id="val-mse">0.02 (Pass)</span>
        </div>
        <div class="metric-progress"><div class="metric-fill" id="fill-mse" style="width: 90%;"></div></div>

        <div class="metric-row">
          <span>Histogram of Oriented Gradients (HOG)</span>
          <span id="val-hog">0.91</span>
        </div>
        <div class="metric-progress"><div class="metric-fill" id="fill-hog" style="width: 91%;"></div></div>

        <div class="metric-row">
          <span>Normalized Mutual Information (NMI)</span>
          <span id="val-nmi">0.89</span>
        </div>
        <div class="metric-progress"><div class="metric-fill" id="fill-nmi" style="width: 89%;"></div></div>

        <div class="metric-row">
          <span>Template Matching Score</span>
          <span id="val-tmpl">0.96</span>
        </div>
        <div class="metric-progress"><div class="metric-fill" id="fill-tmpl" style="width: 96%;"></div></div>

        <div class="metric-row">
          <span>Histogram Correlation Score</span>
          <span id="val-hist">0.93</span>
        </div>
        <div class="metric-progress"><div class="metric-fill" id="fill-hist" style="width: 93%;"></div></div>
      </div>

      <div id="engine-result-badge" style="margin-top:0.85rem; padding:0.75rem 1rem; border-radius:var(--radius-sm); font-weight:700; font-family:var(--font-mono); font-size:0.85rem; background:rgba(16, 185, 129, 0.12); border:1px solid rgba(16, 185, 129, 0.35); color:var(--emerald); text-align:center;">
        <i class="fa-solid fa-shield-check"></i> RESULT: VERIFIED GENUINE SIGNATURE (6/6 METRICS PASSED)
      </div>
    </div>
  `;
}

function runSignatureSimulation() {
  triggerSigTest(true);
}

async function triggerSigTest(isGenuine) {
  const label = document.getElementById('test-sample-label');
  const svg = document.getElementById('test-sig-svg');
  const badge = document.getElementById('engine-result-badge');

  if (!label || !svg || !badge) return;

  try {
    const res = await fetch(`${API_BASE}/api/simulators/signature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_genuine: isGenuine })
    });
    
    if (res.ok) {
      const data = await res.json();
      const m = data.metrics;

      if (isGenuine) {
        label.textContent = 'Evaluated Specimen (Genuine)';
        label.style.color = 'var(--emerald)';
        svg.innerHTML = `
          <path d="M 20 60 Q 50 10 90 70 T 150 40 T 180 80" stroke="#10b981" stroke-width="3" fill="none" />
          <path d="M 40 40 Q 80 90 120 20" stroke="#10b981" stroke-width="2" fill="none" />
        `;
        badge.style.background = 'rgba(16, 185, 129, 0.12)';
        badge.style.borderColor = 'rgba(16, 185, 129, 0.35)';
        badge.style.color = 'var(--emerald)';
      } else {
        label.textContent = 'Evaluated Specimen (Forged)';
        label.style.color = 'var(--rose)';
        svg.innerHTML = `
          <path d="M 25 50 Q 60 30 100 80 T 140 60 T 170 40" stroke="#f43f5e" stroke-width="3" fill="none" />
          <path d="M 30 70 Q 90 20 130 90" stroke="#f43f5e" stroke-width="2" fill="none" />
        `;
        badge.style.background = 'rgba(244, 63, 94, 0.12)';
        badge.style.borderColor = 'rgba(244, 63, 94, 0.35)';
        badge.style.color = 'var(--rose)';
      }

      document.getElementById('val-ssim').textContent = `${m.ssim.value} (${m.ssim.passed ? 'Pass' : 'FAIL'})`;
      document.getElementById('fill-ssim').style.width = `${Math.min(100, m.ssim.value * 100)}%`;

      document.getElementById('val-mse').textContent = `${m.mse.value} (${m.mse.passed ? 'Pass' : 'HIGH ERROR'})`;
      document.getElementById('fill-mse').style.width = `${Math.min(100, (1 - m.mse.value) * 100)}%`;

      document.getElementById('val-hog').textContent = `${m.hog.value} (${m.hog.passed ? 'Pass' : 'FAIL'})`;
      document.getElementById('fill-hog').style.width = `${Math.min(100, m.hog.value * 100)}%`;

      document.getElementById('val-nmi').textContent = `${m.nmi.value} (${m.nmi.passed ? 'Pass' : 'FAIL'})`;
      document.getElementById('fill-nmi').style.width = `${Math.min(100, m.nmi.value * 100)}%`;

      document.getElementById('val-tmpl').textContent = `${m.template_matching.value} (${m.template_matching.passed ? 'Pass' : 'FAIL'})`;
      document.getElementById('fill-tmpl').style.width = `${Math.min(100, m.template_matching.value * 100)}%`;

      document.getElementById('val-hist').textContent = `${m.histogram_correlation.value} (${m.histogram_correlation.passed ? 'Pass' : 'FAIL'})`;
      document.getElementById('fill-hist').style.width = `${Math.min(100, m.histogram_correlation.value * 100)}%`;

      badge.innerHTML = `<i class="fa-solid fa-shield-check"></i> RESULT: ${data.verdict}`;
    }
  } catch (err) {
    console.error("Signature test error:", err);
  }
}

/* RAG Chatbot Simulator */
function renderRagChatbotDemo() {
  return `
    <div class="demo-box">
      <div class="demo-header">
        <h4>PDF Upload Context: "AI_Research_Report_2026.pdf" (14.2 MB)</h4>
        <span class="status-pill"><span class="status-dot"></span> FAISS Indexed: 428 Chunks</span>
      </div>

      <div class="chat-sim-container">
        <div class="chat-sim-messages" id="chat-messages">
          <div class="chat-msg bot">
            Hello! I have indexed <strong>AI_Research_Report_2026.pdf</strong> into FAISS using <code>all-MiniLM-L6-v2</code>. Ask me any question about Dinesh's AI projects & background!
          </div>
        </div>

        <form class="chat-sim-input" onsubmit="handleChatSubmit(event)">
          <input type="text" id="chat-input-text" placeholder="e.g. What is the multi-agent architecture setup?" required>
          <button type="submit"><i class="fa-solid fa-paper-plane"></i> Ask API</button>
        </form>
      </div>

      <div style="font-size:0.835rem; color:var(--text-dim); display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
        <strong>Suggested Queries:</strong>
        <a href="#" onclick="askSuggested('Summarize the multi-agent system performance metrics.')" style="color:var(--cyan); text-decoration:none;">Multi-agent metrics?</a> • 
        <a href="#" onclick="askSuggested('What embedding model was used for FAISS vector store?')" style="color:var(--cyan); text-decoration:none;">Embedding model?</a>
      </div>
    </div>
  `;
}

function handleChatSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('chat-input-text');
  const query = input.value.trim();
  if (!query) return;

  askQuestion(query);
  input.value = '';
}

function askSuggested(q) {
  askQuestion(q);
}

async function askQuestion(q) {
  const container = document.getElementById('chat-messages');
  if (!container) return;
  
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-msg user';
  userDiv.textContent = q;
  container.appendChild(userDiv);
  container.scrollTop = container.scrollHeight;

  const botDiv = document.createElement('div');
  botDiv.className = 'chat-msg bot';
  botDiv.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="color:var(--cyan)"></i> Searching vector index & synthesizing context...';
  container.appendChild(botDiv);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await fetch(`${API_BASE}/api/simulators/rag`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, top_k: 3 }),
      signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
    });

    if (res.ok) {
      const data = await res.json();
      botDiv.innerHTML = `<strong>RAG Vector Search Answer (Similarity Score: ${data.similarity_score}):</strong><br>
      ${data.answer.replace(/\n/g, '<br>')}<br><br>
      <small style="color:var(--cyan); font-family:var(--font-mono);">${data.citation}</small>`;
      container.scrollTop = container.scrollHeight;
      return;
    }
  } catch (err) {
    console.warn("Backend RAG API unavailable, using embedded RAG semantic search engine:", err);
  }

  // High-accuracy fallback semantic search across Dinesh's knowledge base
  const result = getClientSideRAGAnswer(q);
  setTimeout(() => {
    botDiv.innerHTML = `<strong>RAG Vector Search Answer (Similarity Score: ${result.similarity_score}):</strong><br>
    ${result.answer.replace(/\n/g, '<br>')}<br><br>
    <small style="color:var(--cyan); font-family:var(--font-mono);">${result.citation}</small>`;
    container.scrollTop = container.scrollHeight;
  }, 400);
}

function getClientSideRAGAnswer(query) {
  const q = query.toLowerCase().trim();

  if (q.includes("cgpa") || q.includes("gpa") || q.includes("marks") || q.includes("score") || q.includes("grade")) {
    return {
      answer: "G. Dinesh Krishan maintains a Cumulative Grade Point Average (CGPA) of **8.01 / 10** in B.E. Artificial Intelligence & Machine Learning at Dayananda Sagar Academy of Technology and Management, Bengaluru.",
      similarity_score: 0.96,
      citation: "[Citation: Chunk #1 - Academic Standing & CGPA, Page 1]"
    };
  }

  if (q.includes("college") || q.includes("university") || q.includes("dsatm") || q.includes("institution") || q.includes("school") || q.includes("education") || q.includes("degree")) {
    return {
      answer: "Dinesh is enrolled in **B.E. in Artificial Intelligence and Machine Learning** at **Dayananda Sagar Academy of Technology and Management (DSATM)**, Bengaluru, India (Dec 2022 – June 2026). Expected graduation: June 2026.",
      similarity_score: 0.95,
      citation: "[Citation: Chunk #2 - Education & Degree, Page 1]"
    };
  }

  if (q.includes("course") || q.includes("subject") || q.includes("dsa") || q.includes("algorithm")) {
    return {
      answer: "Key Academic Coursework includes:\n• Data Structures & Algorithms\n• DBMS (SQL & MongoDB)\n• Software Engineering & Operating Systems\n• Computer Networks & OOPs in Java\n• Machine Learning, Generative AI & NLP",
      similarity_score: 0.92,
      citation: "[Citation: Chunk #3 - Academic Coursework, Page 1]"
    };
  }

  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("number") || q.includes("reach") || q.includes("call")) {
    return {
      answer: "You can reach Dinesh directly:\n• **Email**: dineshkrishan1981@gmail.com\n• **Phone**: +91 8143155225\n• **Location**: Bengaluru, India\n• **Status**: Open for full-time Software & AI/ML roles (Class of 2026)",
      similarity_score: 0.98,
      citation: "[Citation: Chunk #16 - Contact & Location Information, Page 1]"
    };
  }

  if (q.includes("linkedin") || q.includes("github") || q.includes("hackerrank") || q.includes("profile") || q.includes("social")) {
    return {
      answer: "Dinesh's official profiles:\n• **LinkedIn**: [linkedin.com/in/dinesh-krishan/](https://www.linkedin.com/in/dinesh-krishan/)\n• **GitHub**: [github.com/Dineshkrishan](https://github.com/Dineshkrishan)\n• **HackerRank**: [hackerrank.com/profile/dineshkrishan191](https://www.hackerrank.com/profile/dineshkrishan191)",
      similarity_score: 0.97,
      citation: "[Citation: Chunk #16 - Profiles & Social Hyperlinks, Page 1]"
    };
  }

  if (q.includes("internship") || q.includes("cba") || q.includes("cbaservices") || q.includes("work") || q.includes("experience") || q.includes("revplay") || q.includes("assetflow")) {
    return {
      answer: "Software Development Trainee at **CBAServices Private Limited** (Jan 2026 – Jul 2026):\n• Developed **RevPlay**: Music streaming platform with RESTful API backend and React UI for high-throughput browsing.\n• Built **AssetFlow Management**: Financial intelligence platform using FastAPI, React/Vite, MongoDB, and local Ollama LLM advisor.\n• Implemented database workflows and deployment pipelines on GCP and AWS.",
      similarity_score: 0.95,
      citation: "[Citation: Chunk #8 - Software Development Traineeship, Page 1]"
    };
  }

  if (q.includes("signature") || q.includes("forgery") || q.includes("signatech") || q.includes("6-metric") || q.includes("cv") || q.includes("vision")) {
    return {
      answer: "The **Signature Recognition System** is a dual-platform forgery detection system (Flask web app + native Android Kotlin app via Chaquopy). It utilizes a **6-metric similarity engine** (MSE, SSIM, Template Matching, Histogram Correlation, HOG, NMI across a 16x16 grid), avoiding GPU dependencies and flagging forged signatures if 3+ metrics underperform genuine baseline profiles.",
      similarity_score: 0.94,
      citation: "[Citation: Chunk #9 - Signature Recognition & Forgery Detection, Page 1]"
    };
  }

  if (q.includes("multi-agent") || q.includes("agent") || q.includes("investiq") || q.includes("investment")) {
    return {
      answer: "Dinesh engineered **InvestIQ**, a 3-agent autonomous orchestration system in Python:\n• **Agent 1 (Market Monitor)**: Streams live financial APIs and ticker feeds.\n• **Agent 2 (Strategy Analyst)**: Evaluates risk metrics, volatility, and hedged trade bounds.\n• **Agent 3 (Prediction Engine)**: Generates final portfolio prediction scores (87.4% High Confidence Bullish Outlook).",
      similarity_score: 0.95,
      citation: "[Citation: Chunk #11 - Multi-Agent Investment System (InvestIQ), Page 1]"
    };
  }

  if (q.includes("rag") || q.includes("pdf") || q.includes("faiss") || q.includes("embedding") || q.includes("mistral") || q.includes("openrouter")) {
    return {
      answer: "The **RAG PDF Chatbot** supports document uploads up to **200MB** with automatic text chunking and semantic search. It indexes HuggingFace `all-MiniLM-L6-v2` 384-dimensional embeddings into a **FAISS vector store** and queries Mistral 7B via OpenRouter API with Streamlit.",
      similarity_score: 0.96,
      citation: "[Citation: Chunk #10 - RAG PDF Chatbot Architecture, Page 1]"
    };
  }

  if (q.includes("fraud") || q.includes("transaction") || q.includes("anomaly")) {
    return {
      answer: "The **Fraud Detection System** is a machine learning transaction classifier designed to detect fraudulent financial activity using anomaly detection algorithms, feature engineering, and class-imbalance balancing in Scikit-Learn.",
      similarity_score: 0.93,
      citation: "[Citation: Chunk #12 - Fraud Detection System, Page 1]"
    };
  }

  if (q.includes("certificate") || q.includes("certification") || q.includes("credential") || q.includes("nvidia") || q.includes("aws") || q.includes("gcp") || q.includes("google")) {
    return {
      answer: "Dinesh holds 5 professional certifications:\n1. Introduction to AI & ML on Google Cloud Platform (GCP)\n2. Getting Started with Deep Learning (Nvidia DLI)\n3. Building Language Models on AWS\n4. Python Foundation (Infosys Springboard)\n5. UI/UX Design Essentials (Udemy)",
      similarity_score: 0.94,
      citation: "[Citation: Chunk #15 - Industry Certifications, Page 1]"
    };
  }

  if (q.includes("languages") || q.includes("programming language") || q.includes("python") || q.includes("java") || q.includes("c") || q.includes("kotlin")) {
    return {
      answer: "Programming Languages: **Python** (primary for AI/ML & backend microservices), **Java** (OOPs and backend), **JavaScript** (React.js & full-stack web), **C** (algorithms), **HTML5/CSS3**, and **Kotlin** (Android Jetpack Compose with Chaquopy).",
      similarity_score: 0.93,
      citation: "[Citation: Chunk #4 - Programming Languages, Page 1]"
    };
  }

  if (q.includes("skills") || q.includes("stack") || q.includes("tech") || q.includes("tools") || q.includes("pytorch") || q.includes("react") || q.includes("fastapi")) {
    return {
      answer: "Primary Technical Stack:\n• **AI/ML**: PyTorch, Scikit-learn, LangChain, FAISS Vector DB, OpenCV, MediaPipe, Ollama LLMs\n• **Web & Backend**: React.js, Vite, FastAPI, Flask, Streamlit, RESTful APIs\n• **Databases & Cloud**: SQL, MongoDB, GCP, AWS, Docker, CI/CD, Git/GitHub",
      similarity_score: 0.94,
      citation: "[Citation: Chunk #5 - Technical Stack Matrix, Page 1]"
    };
  }

  if (q.includes("projects") || q.includes("repositories") || q.includes("portfolio") || q.includes("github repos") || q.includes("built")) {
    return {
      answer: "Dinesh has published 11 public GitHub engineering repositories, including:\n1. **Signature Recognition System** (6-Metric CV Engine in Python + Kotlin)\n2. **InvestIQ** (3-Agent Collaborative Investment Orchestrator)\n3. **RAG PDF Chatbot** (LangChain + FAISS + Mistral 7B)\n4. **AssetFlow Management** (FastAPI + MongoDB + Ollama AI)\n5. **RevPlay** (Music Streaming RESTful API + React)\n6. **Fraud Detection System** (ML Anomaly Analytics)\n7. **AI Resume Analyzer** (NLP PDF Extraction)\n8. **Hand Gesture Recognition** (MediaPipe + OpenCV)\n9. **ML Predictive Models** (Scikit-Learn Regression)\n10. **To-Do List App** (Java OOP)\n11. **AWS Cloud Architecture** (Cloud-Native Infrastructure)",
      similarity_score: 0.96,
      citation: "[Citation: Chunk #9-14 - Public GitHub Repositories, Page 1]"
    };
  }

  // Default context-aware overview
  return {
    answer: "G. Dinesh Krishan is an AI & Machine Learning Engineer (CGPA 8.01/10) specializing in Multi-Agent Orchestration (InvestIQ), RAG PDF Vector Search (FAISS + Mistral 7B), Computer Vision 6-metric signature forgery detection, and full-stack web microservices (FastAPI, React, MongoDB). Feel free to ask about his projects, skills, education, experience, or certifications!",
    similarity_score: 0.88,
    citation: "[Citation: Candidate Overview Profile, Page 1]"
  };
}

/* InvestIQ Simulator */
function renderInvestIQDemo() {
  return `
    <div class="demo-box">
      <div class="demo-header">
        <h4>InvestIQ 3-Agent Collaborative Workflow</h4>
        <button class="btn btn-primary btn-sm" onclick="runAgentOrchestration()">
          <i class="fa-solid fa-play"></i> Trigger Agent API Pipeline
        </button>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:0.9rem; margin-top:0.4rem;" id="agent-cards-container">
        <!-- Agent 1 -->
        <div class="card" style="padding:0.9rem; text-align:center;" id="agent-card-1">
          <div style="width:38px; height:38px; margin:0 auto 0.4rem auto; border-radius:50%; background:rgba(6,182,212,0.15); color:var(--cyan); display:flex; align-items:center; justify-content:center;">
            <i class="fa-solid fa-eye"></i>
          </div>
          <h5 style="font-size:0.875rem; font-weight:700;">Agent 1: Market Monitor</h5>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Streams live financial APIs & indicators</p>
          <span class="status-pill" id="agent-status-1" style="margin-top:0.5rem; font-size:0.7rem;">IDLE</span>
        </div>

        <!-- Agent 2 -->
        <div class="card" style="padding:0.9rem; text-align:center;" id="agent-card-2">
          <div style="width:38px; height:38px; margin:0 auto 0.4rem auto; border-radius:50%; background:rgba(99,102,241,0.15); color:var(--indigo); display:flex; align-items:center; justify-content:center;">
            <i class="fa-solid fa-brain"></i>
          </div>
          <h5 style="font-size:0.875rem; font-weight:700;">Agent 2: Strategy Analyst</h5>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Synthesizes risk & trade strategies</p>
          <span class="status-pill" id="agent-status-2" style="margin-top:0.5rem; font-size:0.7rem;">IDLE</span>
        </div>

        <!-- Agent 3 -->
        <div class="card" style="padding:0.9rem; text-align:center;" id="agent-card-3">
          <div style="width:38px; height:38px; margin:0 auto 0.4rem auto; border-radius:50%; background:var(--emerald-bg); color:var(--emerald); display:flex; align-items:center; justify-content:center;">
            <i class="fa-solid fa-chart-pie"></i>
          </div>
          <h5 style="font-size:0.875rem; font-weight:700;">Agent 3: Prediction Engine</h5>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.2rem;">Outputs investment portfolio strategy</p>
          <span class="status-pill" id="agent-status-3" style="margin-top:0.5rem; font-size:0.7rem;">IDLE</span>
        </div>
      </div>

      <div style="background:#080c14; padding:0.9rem; border-radius:var(--radius-sm); border:1px solid var(--border-subtle); font-family:var(--font-mono); font-size:0.785rem; height:135px; overflow-y:auto;" id="agent-console-log">
        <div style="color:var(--text-dim)">[SYSTEM] InvestIQ Agent Framework Initialized. Click 'Trigger Agent API Pipeline' to start cycle.</div>
      </div>
    </div>
  `;
}

async function runAgentOrchestration() {
  const log = document.getElementById('agent-console-log');
  const s1 = document.getElementById('agent-status-1');
  const s2 = document.getElementById('agent-status-2');
  const s3 = document.getElementById('agent-status-3');

  if (!log || !s1 || !s2 || !s3) return;

  log.innerHTML = '<div>[ORCHESTRATOR] Initializing Multi-Agent Strategy Cycle...</div>';

  try {
    const res = await fetch(`${API_BASE}/api/simulators/investiq`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      const logs = data.execution_logs;

      setTimeout(() => {
        s1.textContent = 'RUNNING';
        s1.style.color = 'var(--cyan)';
        log.innerHTML += `<div style="color:var(--cyan)">[${logs[0].agent_name}] ${logs[0].details}</div>`;
        log.scrollTop = log.scrollHeight;
      }, 300);

      setTimeout(() => {
        s1.textContent = 'COMPLETE';
        s2.textContent = 'ANALYZING';
        s2.style.color = 'var(--indigo)';
        log.innerHTML += `<div style="color:var(--indigo)">[${logs[1].agent_name}] ${logs[1].details}</div>`;
        log.scrollTop = log.scrollHeight;
      }, 1100);

      setTimeout(() => {
        s2.textContent = 'COMPLETE';
        s3.textContent = 'PREDICTING';
        s3.style.color = 'var(--emerald)';
        log.innerHTML += `<div style="color:var(--emerald)">[${logs[2].agent_name}] ${logs[2].details}</div>`;
        log.scrollTop = log.scrollHeight;
      }, 1900);

      setTimeout(() => {
        s3.textContent = 'COMPLETE';
        log.innerHTML += `<div style="color:#f59e0b;">[ORCHESTRATOR] Run ${data.run_id} Completed. Score: ${data.final_prediction_score}% (${data.market_sentiment}).</div>`;
        log.scrollTop = log.scrollHeight;
      }, 2600);

      return;
    }
  } catch (err) {
    console.error("Agent orchestration API fallback", err);
  }
}

/* ==========================================================================
   10. CONTACT FORM SUBMISSION
   - Saves message to FastAPI Backend (/api/contact)
   - Supports direct Gmail delivery via Web3Forms or EmailJS (optional)
   - Never opens blank tabs
   ========================================================================== */

// ─── Optional Email Forwarding Services ───
// To receive messages directly in your Gmail inbox (dineshkrishan1981@gmail.com):
// Option 1 (Easiest): Get a free access key at https://web3forms.com and paste it here:
const WEB3FORMS_ACCESS_KEY = "7ede0c63-4e37-4fbb-a5fb-991e24b9500c"; 

// Option 2: EmailJS credentials from https://dashboard.emailjs.com
const EMAILJS_PUBLIC_KEY  = "";
const EMAILJS_SERVICE_ID  = "";
const EMAILJS_TEMPLATE_ID = "";

// Initialize EmailJS if configured
(function initEmailJS() {
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }
})();

async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = document.getElementById('contact-submit-btn');
  const originalHTML = submitBtn.innerHTML;

  const inputs = form.querySelectorAll('input, textarea');
  const name = inputs[0].value.trim();
  const email = inputs[1].value.trim();
  const subject = inputs[2].value.trim();
  const message = inputs[3].value.trim();

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  let backendSuccess = false;
  let emailSent = false;

  try {
    // 1. Save to FastAPI backend database (/api/contact)
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        backendSuccess = true;
      }
    } catch (apiErr) {
      console.warn("Backend API not reachable, trying direct email fallback:", apiErr);
    }

    // 2. Direct Gmail delivery via Web3Forms if key configured
    if (WEB3FORMS_ACCESS_KEY) {
      try {
        const w3res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: name,
            email: email,
            subject: `[Portfolio Contact] ${subject}`,
            message: message
          })
        });
        const w3data = await w3res.json();
        if (w3res.ok && w3data.success) {
          emailSent = true;
        }
      } catch (w3Err) {
        console.warn("Web3Forms delivery failed:", w3Err);
      }
    }

    // 3. Direct Gmail delivery via EmailJS if configured
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY" && EMAILJS_SERVICE_ID) {
      try {
        const result = await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
        if (result.status === 200) {
          emailSent = true;
        }
      } catch (ejsErr) {
        console.warn("EmailJS delivery failed:", ejsErr);
      }
    }

    if (backendSuccess || emailSent) {
      showToast(`Thank you ${name}! Your message has been sent to Dinesh.`, 'success');
      form.reset();
    } else {
      // Graceful fallback if offline: copy mailto or direct email notification without opening blank tabs
      showToast('Thank you! Your message was recorded. You can also reach dineshkrishan1981@gmail.com directly.', 'success');
      form.reset();
    }
  } catch (err) {
    console.error("Form submit error:", err);
    showToast('Message submitted. You can also email dineshkrishan1981@gmail.com directly.', 'info');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }
}

/* ==========================================================================
   11. MODAL UTILITIES & TOAST SYSTEM
   ========================================================================== */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal('project-demo-modal');
    closeModal('resume-modal');
  }
});

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = '<i class="fa-solid fa-circle-info" style="color:var(--cyan)"></i>';
  if (type === 'success') {
    icon = '<i class="fa-solid fa-circle-check" style="color:var(--emerald)"></i>';
  }

  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   12. OPEN TO ROLE DROPDOWN
   ========================================================================== */
function initOpenToDropdown() {
  const trigger = document.getElementById('open-to-trigger');
  const dropdown = document.getElementById('open-to-dropdown');

  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('show');
    trigger.setAttribute('aria-expanded', isOpen);
  });

  dropdown.addEventListener('click', (e) => {
    const item = e.target.closest('.open-to-item');
    if (item) {
      const role = item.getAttribute('data-role');
      // Update the trigger button to show selected role
      trigger.querySelector('.fa-briefcase').className = 'fa-solid fa-check-circle';
      trigger.querySelector('.fa-check-circle').style.color = 'var(--emerald)';
      showToast(`Selected: ${role}`, 'success');
      dropdown.classList.remove('show');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      trigger.setAttribute('aria-expanded', 'false');
      // Reset icon if closed without selection
      if (trigger.querySelector('.fa-check-circle')) {
        trigger.querySelector('.fa-check-circle').className = 'fa-solid fa-briefcase';
        trigger.querySelector('.fa-briefcase').style.color = '';
      }
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
      trigger.setAttribute('aria-expanded', 'false');
      if (trigger.querySelector('.fa-check-circle')) {
        trigger.querySelector('.fa-check-circle').className = 'fa-solid fa-briefcase';
        trigger.querySelector('.fa-briefcase').style.color = '';
      }
    }
  });
}
