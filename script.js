let currentUser = null;
let isAdmin = false;
let premiumPaid = false;
let selectedCategory = "";
let currentJobIndex = 0;
let applications = 0;
let logoClicks = 0;
let logoTimer = null;

let applicationRecords = [];
let notifications = [];
let emailOutbox = [];

let jobs = [
  {
    title: "Développeur Web",
    company: "Tech RDC",
    city: "Kinshasa",
    mode: "Temps plein",
    category: "Diplômé",
    salary: "500$",
    desc: "Nous recherchons un développeur web compétent pour rejoindre notre équipe et travailler sur des projets innovants.",
    req: ["Maîtrise de HTML, CSS, JavaScript", "Expérience avec un framework", "Esprit d’équipe et autonomie"],
    closed: false,
    ownerEmail: "demo@kazi.com",
    companyAbout: {
      sector: "Technologie / Informatique",
      address: "123 Avenue de la Paix, Gombe, Kinshasa",
      map: "https://www.google.com/maps/search/Gombe+Kinshasa",
      about: "Tech RDC est une entreprise technologique basée à Kinshasa, spécialisée dans le développement de solutions digitales innovantes."
    }
  },
  {
    title: "Assistant Comptable",
    company: "Finance Plus",
    city: "Lubumbashi",
    mode: "Temps plein",
    category: "Diplômé",
    salary: "400$",
    desc: "Gestion des factures, suivi administratif, préparation des rapports financiers.",
    req: ["Diplôme en comptabilité", "Maîtrise Excel", "Organisation et honnêteté"],
    closed: false,
    ownerEmail: "demo@kazi.com",
    companyAbout: {
      sector: "Finance",
      address: "Centre-ville, Lubumbashi",
      map: "https://www.google.com/maps/search/Lubumbashi",
      about: "Finance Plus accompagne les PME dans leur gestion financière."
    }
  },
  {
    title: "Vendeur en magasin",
    company: "Super Marché Bon Prix",
    city: "Kinshasa",
    mode: "Temps plein",
    category: "Petit boulot",
    salary: "300$",
    desc: "Accueil des clients, rangement des rayons, gestion simple des ventes.",
    req: ["Bonne présentation", "Ponctuel", "Sens du service"],
    closed: true,
    ownerEmail: "shop@kazi.com",
    companyAbout: {
      sector: "Commerce",
      address: "Kintambo, Kinshasa",
      map: "https://www.google.com/maps/search/Kintambo+Kinshasa",
      about: "Super Marché Bon Prix est un commerce local de distribution."
    }
  },
  {
    title: "Community Manager",
    company: "Mode Congo",
    city: "Goma",
    mode: "En ligne",
    category: "Freelance",
    salary: "Par mission",
    desc: "Gestion des réseaux sociaux, création de contenu et réponses clients.",
    req: ["Canva", "Bonne rédaction", "TikTok/Instagram"],
    closed: false,
    ownerEmail: "mode@kazi.com",
    companyAbout: {
      sector: "Mode",
      address: "Goma",
      map: "https://www.google.com/maps/search/Goma",
      about: "Mode Congo vend des produits de mode et accessoires."
    }
  }
];

let services = [
  { title: "Création de logos", price: "20$", city: "Kinshasa", desc: "Logos modernes pour entreprises et marques.", ownerEmail: "designer@kazi.com", whatsapp: "243810000000", contactCount: 14, stars: 4, likes: 12, dislikes: 1, likedBy: [], dislikedBy: [], comments: [{name:"Client KAZI", text:"Très bon service, rapide et propre."}] },
  { title: "Réparation téléphones", price: "À partir de 10$", city: "Goma", desc: "Écran, batterie, logiciel et diagnostic.", ownerEmail: "phone@kazi.com", whatsapp: "243820000000", contactCount: 7, stars: 3, likes: 8, dislikes: 0, likedBy: [], dislikedBy: [], comments: [] }
];

let publications = [
  { type: "Conseil carrière", title: "Prépare bien ton CV", desc: "Un CV simple, clair et honnête augmente tes chances.", ownerEmail: "admin@kazi.com" },
  { type: "Formation", title: "Formation Excel gratuite", desc: "Formation Excel pour jeunes diplômés à Kinshasa.", ownerEmail: "demo@kazi.com" }
];

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}

function toast(message) {
  const el = document.getElementById("toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function openModal(id) { document.getElementById(id).classList.add("show"); }
function closeModal(id) { document.getElementById(id).classList.remove("show"); }
function toggleMenu() { document.getElementById("navMenu").classList.toggle("open"); }
function goHome() { window.scrollTo({ top: 0, behavior: "smooth" }); }

function logoClick(e) {
  e.preventDefault();
  goHome();
  logoClicks++;
  clearTimeout(logoTimer);
  logoTimer = setTimeout(() => logoClicks = 0, 1800);

  if (logoClicks >= 5) {
    logoClicks = 0;
    openModal("adminPasswordModal");
    toast("Admin caché détecté.");
  }
}

function requireLogin() {
  if (!currentUser) {
    openLogin();
    toast("Connecte-toi pour continuer.");
    return false;
  }
  return true;
}

function openLogin() {
  document.querySelector(".side-panel").scrollIntoView({ behavior: "smooth" });
  if (!currentUser) toast("Connecte-toi ici.");
}

function socialLogin(provider) {
  currentUser = {
    email: provider === "Google" ? "google.user@kazi.com" : "icloud.user@icloud.com",
    name: provider === "Google" ? "Utilisateur Google" : "Utilisateur iCloud",
    provider
  };
  updateLoginUI();
  toast("Connecté avec " + provider + ".");
}

function updateLoginUI() {
  if (!currentUser) return;

  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("welcomeTitle").textContent = "Bonjour " + currentUser.name;
  document.getElementById("welcomeText").textContent = currentUser.email;
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("socialLogin").style.display = "none";
  document.getElementById("loggedPanel").style.display = "block";
  document.getElementById("loginNavBtn").style.display = "none";
  document.getElementById("logoutNavBtn").style.display = "inline-block";

  document.getElementById("accountName").value = currentUser.name;
  document.getElementById("accountEmail").value = currentUser.email;
  renderAll();
}

function logout() {
  currentUser = null;
  isAdmin = false;

  document.getElementById("loginForm").style.display = "grid";
  document.getElementById("socialLogin").style.display = "grid";
  document.getElementById("loggedPanel").style.display = "none";
  document.getElementById("loginNavBtn").style.display = "inline-block";
  document.getElementById("logoutNavBtn").style.display = "none";
  document.getElementById("welcomeTitle").textContent = "Bienvenue sur KAZI";
  document.getElementById("welcomeText").textContent = "Connectez-vous pour publier, postuler et gérer vos offres.";
  document.getElementById("adminState").textContent = "OFF";

  toast("Déconnecté.");
  renderAll();
}

function isOwner(item) {
  return currentUser && currentUser.email.toLowerCase() === String(item.ownerEmail).toLowerCase();
}


document.getElementById("loginForm").addEventListener("submit", e => {
 e.preventDefault();
 const mode=document.getElementById('authMode').value;
 const email=esc(document.getElementById("loginEmail").value||"");
 const phone=esc(document.getElementById("loginPhone").value||"");
 const name=esc(document.getElementById("loginName").value);

 if(!email && !phone){toast('Email ou téléphone requis'); return}

 currentUser={
  email: email || ('phone_'+phone),
  phone,
  name,
  provider: mode
 };

 updateLoginUI();

 const accepted=JSON.parse(localStorage.getItem('kazi_license_accept')||'{}');
 if(!accepted[currentUser.email]){
   document.getElementById('licenseFullName').value=currentUser.name||'';
   document.getElementById('licenseEmail').value=currentUser.email||'';
   openModal('licenseModal');
 } else {
   toast(mode==='Créer compte'?'Compte créé.':'Connecté.');
 }
});


document.getElementById("adminPasswordForm").addEventListener("submit", e => {
  e.preventDefault();

  const password = document.getElementById("adminPasswordInput").value;

  if (password === "kazi2026") {
    isAdmin = true;
    document.getElementById("adminState").textContent = "ON";
    closeModal("adminPasswordModal");
    openAdmin();
    toast("Admin activé.");
  } else {
    toast("Mot de passe incorrect.");
  }

  document.getElementById("adminPasswordInput").value = "";
});

function statusBadge(job) {
  return `<span class="status ${job.closed ? "closed" : "open"}">${job.closed ? "PRIS" : "LIVE LIBRE"}</span>`;
}

function ownerBadge(job) {
  if (isOwner(job)) return `<span class="status owner">VOTRE POST</span>`;
  if (isAdmin) return `<span class="status admin">ADMIN</span>`;
  return "";
}

function jobItem(job, index) {
  return `
    <div class="job-item" onclick="selectJob(${index})">
      <div class="company-logo">${esc(job.company.slice(0,4).toUpperCase())}</div>
      <div>
        <h3>${esc(job.title)}</h3>
        <p>${esc(job.company)}</p>
        <div class="meta">
          <span>📍 ${esc(job.city)}</span>
          <span>◷ ${esc(job.mode)}</span>
          <span>${esc(job.salary)}</span>
        </div>
      </div>
      <div>${statusBadge(job)}</div>
    </div>
  `;
}

function fullJobCard(job, index) {
  const manage = isAdmin
    ? `<button class="${job.closed ? "outline" : "logout"}" onclick="event.stopPropagation();toggleStatus(${index})">${job.closed ? "Remettre LIVE LIBRE" : "Marquer PRIS"}</button>`
    : "";

  return `
    <div class="job-item" onclick="selectJob(${index})">
      <div class="company-logo">${esc(job.company.slice(0,4).toUpperCase())}</div>
      <div>
        <h3>${esc(job.title)}</h3>
        <p>${esc(job.company)} • ${esc(job.city)}</p>
        <div class="meta">
          <span>${esc(job.mode)}</span>
          <span>${esc(job.category)}</span>
          <span>${esc(job.salary)}</span>
        </div>
        ${ownerBadge(job)}
      </div>
      <div style="display:grid;gap:8px">
        ${statusBadge(job)}
        ${manage}
      </div>
    </div>
  `;
}

function getStars(service) {
  const count = service.contactCount || 0;
  const stars = Math.min(5, Math.max(1, Math.floor(count / 5) + 1));
  service.stars = stars;
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

function serviceItem(service) {
  const index = services.indexOf(service);
  const commentsCount = service.comments ? service.comments.length : 0;
  const userKey = currentUser ? currentUser.email.toLowerCase() : "";
  const liked = userKey && service.likedBy && service.likedBy.includes(userKey);
  const disliked = userKey && service.dislikedBy && service.dislikedBy.includes(userKey);

  return `
    <div class="job-item">
      <div class="company-logo">SERV</div>
      <div>
        <h3>${esc(service.title)}</h3>
        <p>${esc(service.city)} • ${esc(service.desc)}</p>
        <div class="meta">
          <span>${esc(service.price)}</span>
          <span class="stars">${getStars(service)}</span>
          <span class="contact-hit">Contacts: ${service.contactCount || 0}</span>
          <span>👍 ${service.likes || 0}</span>
          <span>👎 ${service.dislikes || 0}</span>
          <span>💬 ${commentsCount}</span>
        </div>
        <div class="social-bar">
          <button class="${liked ? 'voted' : ''}" onclick="likeService(${index})">👍 Like</button>
          <button class="${disliked ? 'voted' : ''}" onclick="dislikeService(${index})">👎 Dislike</button>
          <button onclick="openServiceComments(${index})">💬 Commentaires</button>
          <button class="whatsapp-btn" onclick="contactService(${index})">CONTACT</button>
        </div>
      </div>
      <span class="pub-type">Service</span>
    </div>
  `;
}

function publicationItem(pub) {
  return `
    <div class="job-item">
      <div class="company-logo">PUB</div>
      <div>
        <h3>${esc(pub.title)}</h3>
        <p>${esc(pub.desc)}</p>
        <div class="meta">
          <span>${esc(pub.ownerEmail)}</span>
        </div>
      </div>
      <span class="pub-type">${esc(pub.type)}</span>
    </div>
  `;
}

function filterJobs() {
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const city = document.getElementById("cityInput").value;
  const mode = document.getElementById("modeInput").value;

  return jobs.filter(job => {
    const text = (
      job.title + " " +
      job.company + " " +
      job.city + " " +
      job.mode + " " +
      job.category + " " +
      job.desc + " " +
      job.companyAbout.about
    ).toLowerCase();

    return (!q || text.includes(q)) &&
           (!city || job.city === city) &&
           (!mode || job.mode === mode) &&
           (!selectedCategory || job.category === selectedCategory);
  });
}

function renderAll() {
  const filtered = filterJobs();

  document.getElementById("homeJobs").innerHTML =
    filtered.slice(0, 4).map(jobItem).join("") || emptySearch();

  document.getElementById("resultJobs").innerHTML =
    filtered.map(fullJobCard).join("") || emptySearch();

  document.getElementById("allJobsList").innerHTML =
    jobs.map(fullJobCard).join("");

  document.getElementById("servicesList").innerHTML =
    services.map(serviceItem).join("");

  document.getElementById("publicationsList").innerHTML =
    publications.map(publicationItem).join("") || emptyPublications();

  const myJobCount = currentUser ? jobs.filter(job => isOwner(job)).length : 0;
  const myPubCount = currentUser ? publications.filter(pub => isOwner(pub)).length : 0;
  const received = getOwnerApplications().length;
  const myNotifs = getMyNotifications().length;

  document.getElementById("publicationCount").textContent = myJobCount + myPubCount;
  document.getElementById("applicationCount").textContent = applications;
  document.getElementById("receivedCount").textContent = received;
  document.getElementById("notifBadge").textContent = myNotifs;

  renderOwner();
  renderDetail();
  renderAdminIfOpen();
}

function emptySearch() {
  return `
    <div class="job-item">
      <div class="company-logo">?</div>
      <div>
        <h3>Aucune recherche trouvée</h3>
        <p>Essaie un autre mot ou une autre ville.</p>
      </div>
      <span></span>
    </div>
  `;
}

function emptyPublications() {
  return `
    <div class="job-item">
      <div class="company-logo">PUB</div>
      <div>
        <h3>Aucune publication</h3>
        <p>Poste une annonce ou une demande.</p>
      </div>
      <span></span>
    </div>
  `;
}

function performSearch() {
  document.getElementById("jobsSection").scrollIntoView({ behavior: "smooth" });
  renderAll();
}

function setCategory(category, btn) {
  selectedCategory = category;
  document.querySelectorAll(".cat").forEach(el => el.classList.remove("active"));
  btn.classList.add("active");
  renderAll();
}

function selectJob(index) {
  currentJobIndex = index;
  renderDetail();
  document.querySelector(".detail-card").scrollIntoView({ behavior: "smooth" });
}

function previousJob() {
  currentJobIndex = (currentJobIndex - 1 + jobs.length) % jobs.length;
  renderDetail();
}

function nextJob() {
  currentJobIndex = (currentJobIndex + 1) % jobs.length;
  renderDetail();
}

function renderDetail() {
  const job = jobs[currentJobIndex] || jobs[0];
  if (!job) return;

  const requirements = job.req.map(r => `<li>${esc(r)}</li>`).join("");
  const manage = isAdmin
    ? `<button class="${job.closed ? "outline" : "logout"}" onclick="toggleStatus(${currentJobIndex})">${job.closed ? "Remettre LIVE LIBRE" : "Marquer PRIS"}</button>`
    : "";

  document.getElementById("jobDetailArea").innerHTML = `
    <div class="detail-main">
      <div class="company-logo">${esc(job.company.slice(0,4).toUpperCase())}</div>
      <div>
        <h2>${esc(job.title)}</h2>
        <p>${esc(job.company)}</p>
        <div class="meta">
          <span>📍 ${esc(job.city)}</span>
          <span>◷ ${esc(job.mode)}</span>
          <span>💰 ${esc(job.salary)}</span>
        </div>
      </div>
      ${statusBadge(job)}
    </div>

    <div>${ownerBadge(job)}</div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('details', this)">Détails</button>
      <button class="tab" onclick="switchTab('company', this)">À propos de l’entreprise</button>
    </div>

    <div class="tab-content" id="tabContent">
      <h3>Description</h3>
      <p>${esc(job.desc)}</p>

      <h3>Exigences</h3>
      <ul>${requirements}</ul>

      <div class="info-grid">
        <div><b>Type:</b><br>${esc(job.mode)}</div>
        <div><b>Catégorie:</b><br>${esc(job.category)}</div>
        <div><b>Lieu:</b><br>${esc(job.city)}</div>
        <div><b>Salaire:</b><br>${esc(job.salary)}</div>
      </div>
    </div>

    <div class="apply-area">
      <button onclick="openApply(${currentJobIndex})" ${job.closed ? "disabled" : ""} class="wide">POSTULER</button>
      ${manage}
    </div>
  `;
}

function switchTab(tab, btn) {
  const job = jobs[currentJobIndex];

  document.querySelectorAll(".tab").forEach(el => el.classList.remove("active"));
  btn.classList.add("active");

  if (tab === "company") {
    document.getElementById("tabContent").innerHTML = `
      <h3>À propos de ${esc(job.company)}</h3>
      <p>${esc(job.companyAbout.about)}</p>

      <div class="info-grid">
        <div><b>Secteur</b><br>${esc(job.companyAbout.sector)}</div>
        <div><b>Adresse</b><br>${esc(job.companyAbout.address)}</div>
        <div><b>Localisation</b><br><a href="${esc(job.companyAbout.map)}" target="_blank" style="color:var(--gold)">Voir sur la carte</a></div>
        <div><b>Créateur</b><br>${esc(job.ownerEmail)}</div>
      </div>

      <h3>Avis des employés</h3>
      <p style="color:var(--gold)">4.5 ★★★★★ <span style="color:#aaa">(25 avis)</span></p>
    `;
  } else {
    renderDetail();
  }
}

function openApply(index) {
  const job = jobs[index];

  if (job.closed) {
    toast("Ce post est déjà pris.");
    return;
  }

  if (!requireLogin()) return;

  document.getElementById("applyTitle").textContent = "Postuler : " + job.title;
  openModal("applyModal");
}

document.getElementById("applyForm").addEventListener("submit", e => {
  e.preventDefault();

  const job = jobs[currentJobIndex];
  const applicant = {
    name: esc(document.getElementById("appName").value),
    email: esc(document.getElementById("appEmail").value),
    phone: esc(document.getElementById("appPhone").value),
    about: esc(document.getElementById("appAbout").value),
    jobTitle: job.title,
    ownerEmail: job.ownerEmail,
    date: new Date().toLocaleString()
  };

  applicationRecords.push(applicant);
  applications++;

  notifications.push({
    to: job.ownerEmail,
    title: "Nouvelle candidature",
    message: `${applicant.name} a postulé à votre offre: ${job.title}`,
    email: applicant.email,
    date: applicant.date
  });

  sendEmailSimulation(job.ownerEmail, "Nouvelle candidature KAZI", `${applicant.name} a postulé à ${job.title}. Email: ${applicant.email}. Téléphone: ${applicant.phone}`);

  document.getElementById("applicationCount").textContent = applications;
  toast("Candidature envoyée. L’auteur du post a reçu une notification + email simulé.");
  e.target.reset();
  document.getElementById("applyPreview").innerHTML = "";
  closeModal("applyModal");
  renderAll();
});

function sendEmailSimulation(to, subject, body) {
  emailOutbox.push({ to, subject, body, date: new Date().toLocaleString() });
}

function getOwnerApplications() {
  if (!currentUser) return [];
  return applicationRecords.filter(app => app.ownerEmail.toLowerCase() === currentUser.email.toLowerCase());
}

function getMyNotifications() {
  if (!currentUser) return [];
  return notifications.filter(notif => notif.to.toLowerCase() === currentUser.email.toLowerCase());
}

function openNotifications() {
  if (!requireLogin()) return;

  const list = document.getElementById("notificationsList");
  const myNotifications = getMyNotifications();
  const myApplications = getOwnerApplications();

  if (!myNotifications.length && !myApplications.length) {
    list.innerHTML = `
      <div class="notification-item">
        <h3>Aucune notification</h3>
        <p>Quand quelqu’un postule à ton offre, tu verras la notification ici.</p>
      </div>
    `;
  } else {
    list.innerHTML = myNotifications.map(n => `
      <div class="notification-item">
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.message)}</p>
        <small>${esc(n.date)}</small>
        <div class="email-log">Email simulé envoyé à ${esc(n.to)}</div>
      </div>
    `).join("");
  }

  openModal("notificationsModal");
}

function openSettings() {
  if (!requireLogin()) return;
  document.getElementById("accountName").value = currentUser.name;
  document.getElementById("accountEmail").value = currentUser.email;
  openModal("settingsModal");
}

document.getElementById("settingsForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = esc(document.getElementById("accountName").value);
  const email = esc(document.getElementById("accountEmail").value);
  const lang = esc(document.getElementById("languageSetting").value);

  if (name) currentUser.name = name;
  if (email) currentUser.email = email;

  document.getElementById("profileName").textContent = currentUser.name;
  document.getElementById("welcomeTitle").textContent = "Bonjour " + currentUser.name;
  document.getElementById("welcomeText").textContent = currentUser.email;

  const map={"Français":"fr","English":"en"}; applyLanguage(map[lang]||"fr"); toast(lang==="English"?"Language changed to English":"Langue changée en Français");
  closeModal("settingsModal");
  renderAll();
});

function toggleOwnStatus(index) {
  const job = jobs[index];

  if (!job) return;

  if (!isOwner(job) && !isAdmin) {
    toast("Tu ne peux changer que tes propres offres.");
    return;
  }

  job.closed = !job.closed;
  toast(job.closed ? "Ton post est maintenant PRIS." : "Ton post est maintenant LIVE LIBRE.");
  renderAll();
  if (document.getElementById("myContentModal").classList.contains("show")) renderMyContent();
}

function toggleStatus(index) {
  if (!isAdmin) {
    toast("Seul l’administrateur peut changer le statut.");
    return;
  }

  jobs[index].closed = !jobs[index].closed;
  toast(jobs[index].closed ? "Post marqué PRIS." : "Post remis LIVE LIBRE.");
  renderAll();
}

function renderOwner() {
  const container = document.getElementById("ownerJobs");

  if (!currentUser) {
    container.innerHTML = `
      <div class="owner-row">
        <div>
          <b>Aucune session</b><br>
          <small>Connecte-toi pour voir tes publications et candidatures reçues.</small>
        </div>
        <span></span>
        <button onclick="openLogin()">Login</button>
      </div>
    `;
    return;
  }

  const mine = jobs.filter(job => isOwner(job));

  container.innerHTML = mine.length
    ? mine.map(job => {
        const index = jobs.indexOf(job);
        const count = applicationRecords.filter(app => app.jobTitle === job.title && app.ownerEmail === currentUser.email).length;
        return `
          <div class="owner-row">
            <div>
              <b>${esc(job.title)}</b><br>
              <small>${esc(job.city)} • ${esc(job.company)} • ${count} candidature(s)</small>
            </div>
            ${statusBadge(job)}
            <button onclick="toggleOwnStatus(${index})">${job.closed ? "Mettre LIVE LIBRE" : "Mettre PRIS"}</button>
          </div>
        `;
      }).join("")
    : `
      <div class="owner-row">
        <div>
          <b>Aucune publication</b><br>
          <small>Publie une offre ou une publication.</small>
        </div>
        <span></span>
        <button onclick="openPostJob()">Publier</button>
      </div>
    `;
}

function openPostJob() {
  if (!requireLogin()) return;
  openModal("postJobModal");
}

function openPostPublication() {
  if (!requireLogin()) return;
  openModal("postPublicationModal");
}

document.getElementById("jobForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!requireLogin()) return;

  jobs.unshift({
    title: esc(document.getElementById("jobTitle").value),
    company: esc(document.getElementById("jobCompany").value),
    city: esc(document.getElementById("jobCity").value),
    mode: esc(document.getElementById("jobMode").value),
    category: esc(document.getElementById("jobCategory").value),
    salary: esc(document.getElementById("jobSalary").value || "Non précisé"),
    desc: esc(document.getElementById("jobDesc").value),
    req: [esc(document.getElementById("jobReq").value)],
    closed: false,
    ownerEmail: currentUser.email,
    companyAbout: {
      sector: esc(document.getElementById("companySector").value),
      address: esc(document.getElementById("companyAddress").value),
      map: esc(document.getElementById("companyMap").value),
      about: esc(document.getElementById("companyAbout").value)
    }
  });

  currentJobIndex = 0;
  toast("Offre publiée en LIVE LIBRE.");
  e.target.reset();
  document.getElementById("jobPreview").innerHTML = "";
  closeModal("postJobModal");
  renderAll();
});

document.getElementById("publicationForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!requireLogin()) return;

  publications.unshift({
    type: esc(document.getElementById("pubType").value),
    title: esc(document.getElementById("pubTitle").value),
    desc: esc(document.getElementById("pubDesc").value),
    ownerEmail: currentUser.email
  });

  toast("Publication postée.");
  e.target.reset();
  document.getElementById("pubPreview").innerHTML = "";
  closeModal("postPublicationModal");
  renderAll();
});

function openAllJobs() {
  document.getElementById("allJobsList").innerHTML = jobs.map(fullJobCard).join("");
  openModal("allJobsModal");
}

function openMarketplace() {
  document.getElementById("servicesList").innerHTML = services.map(serviceItem).join("");
  openModal("marketModal");
}

function openPremium() {
  if (!requireLogin()) return;
  openModal("premiumModal");
}

function confirmPremium() {
  premiumPaid = true;
  closeModal("premiumModal");
  openModal("serviceModal");
  toast("Premium activé.");
}

document.getElementById("serviceForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!premiumPaid) {
    openPremium();
    return;
  }

  services.unshift({
    title: esc(document.getElementById("serviceTitle").value),
    price: esc(document.getElementById("servicePrice").value),
    city: esc(document.getElementById("serviceCity").value),
    desc: esc(document.getElementById("serviceDesc").value),
    ownerEmail: esc(document.getElementById("serviceEmail").value || currentUser.email),
    whatsapp: esc(document.getElementById("serviceWhatsapp").value),
    contactCount: 0,
    stars: 1,
    likes: 0,
    dislikes: 0,
    comments: [],
    likedBy: [],
    dislikedBy: []
  });

  toast("Service publié.");
  e.target.reset();
  closeModal("serviceModal");
  renderAll();
});

function previewFiles(input, targetId) {
  const target = document.getElementById(targetId);
  target.innerHTML = "";

  Array.from(input.files || []).forEach(file => {
    const div = document.createElement("div");
    div.className = "preview-item";

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => {
        div.innerHTML = `<img src="${e.target.result}"><b>${esc(file.name.slice(0,15))}</b>`;
      };
      reader.readAsDataURL(file);
    } else {
      div.innerHTML = `<div style="font-size:32px">📄</div><b>${esc(file.name.slice(0,15))}</b>`;
    }

    target.appendChild(div);
  });
}


function openMyContent() {
  if (!requireLogin()) return;
  renderMyContent();
  openModal("myContentModal");
}

function renderMyContent() {
  const box = document.getElementById("myContentList");
  const myJobs = jobs.filter(job => isOwner(job));
  const myPubs = publications.filter(pub => isOwner(pub));

  let html = "";

  if (myJobs.length) {
    html += `<h3>Mes offres d’emploi</h3>`;
    html += myJobs.map(job => {
      const index = jobs.indexOf(job);
      const received = applicationRecords.filter(app => app.jobTitle === job.title && app.ownerEmail === currentUser.email).length;
      return `
        <div class="job-item">
          <div class="company-logo">${esc(job.company.slice(0,4).toUpperCase())}</div>
          <div>
            <h3>${esc(job.title)}</h3>
            <p>${esc(job.company)} • ${esc(job.city)} • ${received} candidature(s)</p>
            <div class="meta">
              <span>${esc(job.mode)}</span>
              <span>${esc(job.category)}</span>
              <span>${esc(job.salary)}</span>
            </div>
            <div class="owner-note">Tu peux mettre ton offre en PRIS ou LIVE LIBRE depuis ici.</div>
            <div class="manage-actions">
              <button onclick="openEditJob(${index})">Modifier</button>
              <button class="danger-btn" onclick="deleteMyJob(${index})">Supprimer</button>
              <button onclick="selectJob(${index}); closeModal('myContentModal')">Voir</button>
              <button onclick="toggleOwnStatus(${index})">${job.closed ? "Mettre LIVE LIBRE" : "Mettre PRIS"}</button>
            </div>
          </div>
          ${statusBadge(job)}
        </div>
      `;
    }).join("");
  }

  if (myPubs.length) {
    html += `<h3 style="margin-top:18px">Mes publications générales</h3>`;
    html += myPubs.map(pub => {
      const index = publications.indexOf(pub);
      return `
        <div class="job-item">
          <div class="company-logo">PUB</div>
          <div>
            <h3>${esc(pub.title)}</h3>
            <p>${esc(pub.desc)}</p>
            <div class="meta"><span>${esc(pub.type)}</span></div>
            <div class="manage-actions">
              <button onclick="openEditPublication(${index})">Modifier</button>
              <button class="danger-btn" onclick="deleteMyPublication(${index})">Supprimer</button>
            </div>
          </div>
          <span class="pub-type">${esc(pub.type)}</span>
        </div>
      `;
    }).join("");
  }

  if (!html) {
    html = `
      <div class="notification-item">
        <h3>Aucune publication</h3>
        <p>Publie une offre ou une publication générale. Ensuite tu pourras modifier ou supprimer ici.</p>
      </div>
    `;
  }

  box.innerHTML = html;
}

function openEditJob(index) {
  const job = jobs[index];
  if (!isOwner(job) && !isAdmin) {
    toast("Tu ne peux modifier que tes propres offres.");
    return;
  }

  document.getElementById("editJobIndex").value = index;
  document.getElementById("editJobTitle").value = job.title;
  document.getElementById("editJobCompany").value = job.company;
  document.getElementById("editJobCity").value = job.city;
  document.getElementById("editJobMode").value = job.mode;
  document.getElementById("editJobCategory").value = job.category;
  document.getElementById("editJobSalary").value = job.salary;
  document.getElementById("editJobDesc").value = job.desc;
  document.getElementById("editJobReq").value = job.req.join("\\n");

  openModal("editJobModal");
}

document.getElementById("editJobForm").addEventListener("submit", e => {
  e.preventDefault();
  const index = Number(document.getElementById("editJobIndex").value);
  const job = jobs[index];

  if (!isOwner(job) && !isAdmin) {
    toast("Tu ne peux modifier que tes propres offres.");
    return;
  }

  job.title = esc(document.getElementById("editJobTitle").value);
  job.company = esc(document.getElementById("editJobCompany").value);
  job.city = esc(document.getElementById("editJobCity").value);
  job.mode = esc(document.getElementById("editJobMode").value);
  job.category = esc(document.getElementById("editJobCategory").value);
  job.salary = esc(document.getElementById("editJobSalary").value || "Non précisé");
  job.desc = esc(document.getElementById("editJobDesc").value);
  job.req = [esc(document.getElementById("editJobReq").value)];

  toast("Offre modifiée.");
  closeModal("editJobModal");
  renderAll();
  renderMyContent();
});

function deleteMyJob(index) {
  const job = jobs[index];

  if (!isOwner(job) && !isAdmin) {
    toast("Tu ne peux supprimer que tes propres offres.");
    return;
  }

  if (!confirm("Supprimer cette offre ?")) return;

  jobs.splice(index, 1);
  currentJobIndex = 0;
  toast("Offre supprimée.");
  renderAll();
  renderMyContent();
}

function openEditPublication(index) {
  const pub = publications[index];

  if (!isOwner(pub) && !isAdmin) {
    toast("Tu ne peux modifier que tes propres publications.");
    return;
  }

  document.getElementById("editPubIndex").value = index;
  document.getElementById("editPubType").value = pub.type;
  document.getElementById("editPubTitle").value = pub.title;
  document.getElementById("editPubDesc").value = pub.desc;

  openModal("editPublicationModal");
}

document.getElementById("editPublicationForm").addEventListener("submit", e => {
  e.preventDefault();
  const index = Number(document.getElementById("editPubIndex").value);
  const pub = publications[index];

  if (!isOwner(pub) && !isAdmin) {
    toast("Tu ne peux modifier que tes propres publications.");
    return;
  }

  pub.type = esc(document.getElementById("editPubType").value);
  pub.title = esc(document.getElementById("editPubTitle").value);
  pub.desc = esc(document.getElementById("editPubDesc").value);

  toast("Publication modifiée.");
  closeModal("editPublicationModal");
  renderAll();
  renderMyContent();
});

function deleteMyPublication(index) {
  const pub = publications[index];

  if (!isOwner(pub) && !isAdmin) {
    toast("Tu ne peux supprimer que tes propres publications.");
    return;
  }

  if (!confirm("Supprimer cette publication ?")) return;

  publications.splice(index, 1);
  toast("Publication supprimée.");
  renderAll();
  renderMyContent();
}

function likeService(index) {
  if (!requireLogin()) return;

  const userKey = currentUser.email.toLowerCase();
  const service = services[index];

  if (!service.likedBy) service.likedBy = [];
  if (!service.dislikedBy) service.dislikedBy = [];

  if (service.likedBy.includes(userKey)) {
 service.likedBy=service.likedBy.filter(x=>x!==userKey);
 service.likes=Math.max(0,(service.likes||0)-1);
 toast("Like retiré."); renderAll(); return;
 }

  if (service.dislikedBy.includes(userKey)) {
    service.dislikedBy = service.dislikedBy.filter(email => email !== userKey);
    service.dislikes = Math.max(0, (service.dislikes || 0) - 1);
  }

  service.likedBy.push(userKey);
  service.likes = (service.likes || 0) + 1;
  toast("Like ajouté.");
  renderAll();
}

function dislikeService(index) {
  if (!requireLogin()) return;

  const userKey = currentUser.email.toLowerCase();
  const service = services[index];

  if (!service.likedBy) service.likedBy = [];
  if (!service.dislikedBy) service.dislikedBy = [];

  if (service.dislikedBy.includes(userKey)) {
 service.dislikedBy=service.dislikedBy.filter(x=>x!==userKey);
 service.dislikes=Math.max(0,(service.dislikes||0)-1);
 toast("Dislike retiré."); renderAll(); return;
 }

  if (service.likedBy.includes(userKey)) {
    service.likedBy = service.likedBy.filter(email => email !== userKey);
    service.likes = Math.max(0, (service.likes || 0) - 1);
  }

  service.dislikedBy.push(userKey);
  service.dislikes = (service.dislikes || 0) + 1;
  toast("Dislike ajouté.");
  renderAll();
}


function normalizeWhatsapp(number) {
  return String(number || "").replace(/[^0-9]/g, "");
}

function contactService(index) {
  if (!requireLogin()) return;

  const service = services[index];
  service.contactCount = (service.contactCount || 0) + 1;
  getStars(service);

  const buyerName = currentUser.name || "Utilisateur KAZI";
  const buyerEmail = currentUser.email || "email inconnu";
  const ownerEmail = service.ownerEmail || service.email || "vendeur@kazi.com";

  notifications.push({
    to: ownerEmail,
    title: "Nouveau contact Marketplace",
    message: `${buyerName} veut vous contacter pour votre service: ${service.title}`,
    email: buyerEmail,
    date: new Date().toLocaleString()
  });

  sendEmailSimulation(ownerEmail, "Nouveau contact Marketplace KAZI", `${buyerName} a cliqué sur CONTACT pour votre service: ${service.title}. Email: ${buyerEmail}`);

  const rawLink = service.whatsapp||"";
  const phone = rawLink.includes("wa.me")?null:normalizeWhatsapp(rawLink);
  const text = encodeURIComponent(`Bonjour, je viens de KAZI. Je suis intéressé par votre service: ${service.title}`);
  const link = rawLink.includes("wa.me") ? rawLink : (phone ? `https://wa.me/${phone}?text=${text}` : "#");

  document.getElementById("contactServiceName").textContent = service.title;
  document.getElementById("contactSellerInfo").textContent = phone ? `WhatsApp: +${phone}` : "Ce vendeur n’a pas ajouté de WhatsApp.";
  document.getElementById("contactWhatsappLink").href = link;
  document.getElementById("contactWhatsappLink").textContent = phone ? "Ouvrir WhatsApp du vendeur" : "WhatsApp non disponible";

  if (!phone) {
    document.getElementById("contactWhatsappLink").removeAttribute("target");
  } else {
    document.getElementById("contactWhatsappLink").setAttribute("target", "_blank");
  }

  toast("Demande de contact envoyée au vendeur.");
  openModal("contactSellerModal");
  renderAll();
}


function openServiceComments(index) {
  const service = services[index];
  document.getElementById("commentServiceIndex").value = index;
  document.getElementById("serviceCommentTitle").textContent = "Commentaires — " + service.title;
  renderServiceComments(index);
  openModal("serviceCommentModal");
}

function renderServiceComments(index) {
  const service = services[index];
  const list = document.getElementById("serviceCommentsList");
  const comments = service.comments || [];

  list.innerHTML = comments.length
    ? comments.map(c => `
      <div class="comment-card">
        <b>${esc(c.name)}</b>
        <p>${esc(c.text)}</p>
      </div>
    `).join("")
    : `
      <div class="comment-card">
        <b>Aucun commentaire</b>
        <p>Sois le premier à commenter ce service.</p>
      </div>
    `;
}

document.getElementById("serviceCommentForm").addEventListener("submit", e => {
  e.preventDefault();

  if (!requireLogin()) return;

  const index = Number(document.getElementById("commentServiceIndex").value);
  const typedName = esc(document.getElementById("serviceCommentName").value.trim());
  const text = esc(document.getElementById("serviceCommentText").value);

  if (!services[index].comments) services[index].comments = [];
  services[index].comments.push({
    name: typedName || currentUser.name,
    text
  });

  document.getElementById("serviceCommentName").value = "";
  document.getElementById("serviceCommentText").value = "";
  toast("Commentaire ajouté.");
  renderServiceComments(index);
  renderAll();
});

function openAdmin() {
  renderAdmin();
  openModal("adminModal");
}

function renderAdminIfOpen() {
  if (document.getElementById("adminModal").classList.contains("show")) {
    renderAdmin();
  }
}

function renderAdmin() {
  document.getElementById("adminJobs").innerHTML = jobs.map((job, index) => `
    <div class="admin-row">
      <div>
        <b>${esc(job.title)}</b><br>
        <small>${esc(job.ownerEmail)} • ${esc(job.city)}</small>
      </div>
      ${statusBadge(job)}
      <div>
        <button onclick="toggleStatus(${index})">${job.closed ? "LIVE LIBRE" : "PRIS"}</button>
        <button class="logout" onclick="deleteJob(${index})">Supprimer</button>
      </div>
    </div>
  `).join("");
}

document.getElementById("adminTextForm").addEventListener("submit", e => {
  e.preventDefault();

  const title = document.getElementById("adminHeroTitle").value.trim();
  const desc = document.getElementById("adminHeroDesc").value.trim();

  if (title) document.querySelector(".hero-banner h1").textContent = title;
  if (desc) document.querySelector(".hero-banner p").textContent = desc;

  toast("Accueil modifié.");
});

function deleteJob(index) {
  if (!isAdmin) {
    toast("Admin seulement.");
    return;
  }

  jobs.splice(index, 1);
  currentJobIndex = 0;
  toast("Offre supprimée.");
  renderAll();
}

window.onclick = e => {
  document.querySelectorAll(".modal").forEach(modal => {
    if (e.target === modal) modal.classList.remove("show");
  });
};

document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach(modal => modal.classList.remove("show"));
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

renderAll();



const translations={
fr:{
home:'Accueil',jobs:'Emplois',market:'Market',profile:'Profil',welcome:'Bienvenue sur KAZI',
search:'🔍 Rechercher un emploi...',notif:'Notifications',publish:'Poster une publication',
contact:'CONTACT'
},
en:{
home:'Home',jobs:'Jobs',market:'Market',profile:'Profile',welcome:'Welcome to KAZI',
search:'🔍 Search jobs...',notif:'Notifications',publish:'Post publication',
contact:'CONTACT'
}
};

function replaceText(selector,text){document.querySelectorAll(selector).forEach(el=>el.textContent=text)}

function applyLanguage(lang){
localStorage.setItem('kazi_lang',lang)
const t=translations[lang]||translations.fr

const nav=document.querySelectorAll('.bottom-nav button')
if(nav[0]) nav[0].innerHTML='🏠<br>'+t.home
if(nav[1]) nav[1].innerHTML='💼<br>'+t.jobs
if(nav[2]) nav[2].innerHTML='🏪<br>'+t.market
if(nav[3]) nav[3].innerHTML='👤<br>'+t.profile

let s=document.getElementById('searchInput')
if(s) s.placeholder=t.search

let w=document.getElementById('welcomeTitle')
if(w && !currentUser) w.textContent=t.welcome

replaceText('.notif-btn', '🔔')

document.querySelectorAll('button').forEach(btn=>{
const tx=btn.textContent.trim().toLowerCase()
if(tx.includes('notifications')||tx.includes('arifa')) btn.textContent=t.notif
if(tx.includes('poster une publication')||tx.includes('post publication')) btn.textContent=t.publish
})

const h1=document.querySelector('.hero-banner h1')
const p=document.querySelector('.hero-banner p')
if(h1){
h1.textContent=lang==='en'?'Find the job that fits you':'Trouvez l’emploi qui vous correspond'
}
if(p){
p.textContent=lang==='en'?'Verified opportunities with company details.':'Des opportunités vérifiables, avec détails du poste et entreprise.'
}
}
setTimeout(()=>{
 const select=document.getElementById('languageSetting');
 if(select){
   const saved=localStorage.getItem('kazi_lang')||'fr'; const map={Français:'fr',English:'en'};
   select.addEventListener('change',()=>applyLanguage(map[select.value]||'fr'));
   applyLanguage(saved);
 }
},400);

let adminPayment={name:'KAZI',method:'Airtel Money',info:'+243...'};
try{const p=localStorage.getItem('kazi_payment'); if(p) adminPayment=JSON.parse(p)}catch(e){}

const pf=document.getElementById('paymentAdminForm');
if(pf){
pf.addEventListener('submit',e=>{
e.preventDefault();
adminPayment={
name:document.getElementById('receiveName').value,
method:document.getElementById('receiveMethod').value,
info:document.getElementById('receiveInfo').value
};
localStorage.setItem('kazi_payment',JSON.stringify(adminPayment));
toast('Paiement enregistré (local admin).');
});}

const oldConfirm=confirmPremium;
confirmPremium=function(){
const txt='Envoyer 10$ vers :\n'+adminPayment.method+'\n'+adminPayment.name+'\n'+adminPayment.info+'\nPuis confirmer.';
alert(txt);
oldConfirm();
}

setTimeout(()=>{
const chk=document.getElementById('licenseAccept');
if(chk){chk.checked=localStorage.getItem('kazi_license')==='yes';
chk.onchange=()=>localStorage.setItem('kazi_license',chk.checked?'yes':'no')}
},300)

let acceptedUsers=[];
try{acceptedUsers=JSON.parse(localStorage.getItem('kazi_license_users')||'[]')}catch(e){}

function openLicenseIfNeeded(){
 if(localStorage.getItem('kazi_license_current')!=='yes'){
   setTimeout(()=>openModal('licenseModal'),600)
 }
}
// disabled old auto


document.getElementById('licenseForm')?.addEventListener('submit',function(e){
 e.preventDefault();
 if(!currentUser){toast('Connectez-vous');return}
 let accepted=JSON.parse(localStorage.getItem('kazi_license_accept')||'{}');
 accepted[currentUser.email]={
  name:currentUser.name,
  email:currentUser.email,
  phone:currentUser.phone||'',
  acceptedAt:new Date().toLocaleString()
 };
 localStorage.setItem('kazi_license_accept',JSON.stringify(accepted));
 closeModal('licenseModal');
 toast('Licence acceptée une seule fois pour ce compte.');
 renderLicenseAdmin();
});


function renderLicenseAdmin(){
 const admin=document.getElementById('adminModal');
 if(!admin) return;
 let box=document.getElementById('licenseAdminBox');
 if(!box){
   box=document.createElement('div');
   box.id='licenseAdminBox';
   box.className='admin-box';
   admin.querySelector('.modal-content').appendChild(box);
 }
 box.innerHTML='<h3>Acceptation licence</h3>'+ (acceptedUsers.length?acceptedUsers.map(u=>`<div style="padding:10px;border:1px solid #222;border-radius:12px;margin:8px 0"><b>${u.name}</b><br>${u.email}<br><small>${u.acceptedAt}</small></div>`).join(''):'Aucune acceptation');
}
setTimeout(renderLicenseAdmin,1000);

function renderLicenseAdmin(){
 const box=document.getElementById('licenseAdminBox');
 if(!box) return;
 const data=JSON.parse(localStorage.getItem('kazi_license_accept')||'{}');
 const arr=Object.values(data);
 box.innerHTML='<h3>Comptes ayant accepté la licence</h3>'+
 (arr.length?arr.map(u=>`<div style="padding:12px;border:1px solid #222;border-radius:14px;margin:8px 0"><b>${u.name}</b><br>${u.email}<br>${u.phone||''}<br><small>${u.acceptedAt}</small></div>`).join(''):'Aucune donnée');
}
setTimeout(renderLicenseAdmin,1200)
