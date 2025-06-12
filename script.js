// Données initiales
let plaintes = [
    {
        id: 1,
        nom: "Ahmed Bennani",
        type: "Routière",
        date: "2024-05-28",
        description: "Nid-de-poule sur l'avenue principale causant des dommages aux véhicules",
        statut: "En cours",
        inspection: "2024-06-05",
        piecesJointes: [
            { nom: "photo1.jpg", url: "data:image/jpeg;base64,..." },
            { nom: "document.pdf", url: "data:application/pdf;base64,..." }
        ]
    },
    {
        id: 2,
        nom: "Fatima El Alami",
        type: "Espace vert",
        date: "2024-05-25",
        description: "Manque d'entretien du parc municipal, espaces verts négligés",
        statut: "En attente",
        inspection: "Non planifiée",
        piecesJointes: []
    },
    {
        id: 3,
        nom: "Omar Tazi",
        type: "Éclairage",
        date: "2024-05-20",
        description: "Lampadaire défectueux dans le quartier résidentiel",
        statut: "Résolu",
        inspection: "2024-06-01",
        piecesJointes: [
            { nom: "photo_lampadaire.jpg", url: "data:image/jpeg;base64,..." }
        ]
    }
];

let utilisateurs = [
    {
        id: 1,
        nom: "Admin",
        prenom: "System",
        email: "admin@chikayati.ma",
        role: "Administrateur"
    },
    {
        id: 2,
        nom: "User",
        prenom: "Test",
        email: "user@test.ma",
        role: "Citoyen"
    }
];

// Variables pour gérer l'état
let currentUser = null;
let selectedFiles = [];
let selectedPlainteId = null;

// Charger les données depuis le localStorage
function chargerDonnees() {
    const plaintesSauvegardees = localStorage.getItem('plaintes');
    if (plaintesSauvegardees) {
        plaintes = JSON.parse(plaintesSauvegardees);
    }

    const utilisateursSauvegardes = localStorage.getItem('utilisateurs');
    if (utilisateursSauvegardes) {
        utilisateurs = JSON.parse(utilisateursSauvegardes);
    }

    const communeSauvegardee = localStorage.getItem('commune');
    if (communeSauvegardee) {
        document.getElementById('commune-name').textContent = communeSauvegardee;
        document.getElementById('commune-config').value = communeSauvegardee;
    }

    const themeSauvegarde = localStorage.getItem('theme');
    if (themeSauvegarde) {
        document.getElementById('theme-config').value = themeSauvegarde;
        appliquerTheme(themeSauvegarde);
    }

    // Simuler un utilisateur connecté (pour la démo)
    currentUser = utilisateurs[0];
}

// Sauvegarder les données dans le localStorage
function sauvegarderDonnees() {
    localStorage.setItem('plaintes', JSON.stringify(plaintes));
    localStorage.setItem('utilisateurs', JSON.stringify(utilisateurs));
    localStorage.setItem('commune', document.getElementById('commune-name').textContent);
    localStorage.setItem('theme', document.getElementById('theme-config').value);
}

// Appliquer le thème sélectionné
function appliquerTheme(theme) {
    const root = document.documentElement;
    
    switch(theme) {
        case 'blue':
            root.style.setProperty('--primary-color', '#2c3e50');
            root.style.setProperty('--secondary-color', '#3498db');
            root.style.setProperty('--accent-color', '#e74c3c');
            break;
        case 'green':
            root.style.setProperty('--primary-color', '#1e5631');
            root.style.setProperty('--secondary-color', '#4cc359');
            root.style.setProperty('--accent-color', '#ff6b6b');
            break;
        case 'red':
            root.style.setProperty('--primary-color', '#6b2b2b');
            root.style.setProperty('--secondary-color', '#d9534f');
            root.style.setProperty('--accent-color', '#5bc0de');
            break;
        default:
            root.style.setProperty('--primary-color', '#2c3e50');
            root.style.setProperty('--secondary-color', '#3498db');
            root.style.setProperty('--accent-color', '#e74c3c');
    }
}

// Afficher une section et masquer les autres
function showSection(sectionId) {
    document.getElementById('accueil-section').classList.add('hidden');
    document.getElementById('deposer-plainte-section').classList.add('hidden');
    document.getElementById('consulter-plaintes-section').classList.add('hidden');
    document.getElementById('inscription-section').classList.add('hidden');
    document.getElementById('administration-section').classList.add('hidden');
    
    resetAdminSubSections();
    hidePlainteDetails();
    
    switch(sectionId) {
        case 'accueil':
            document.getElementById('accueil-section').classList.remove('hidden');
            break;
        case 'deposer-plainte':
            document.getElementById('deposer-plainte-section').classList.remove('hidden');
            // Définir la date du jour par défaut
            const aujourdHui = new Date().toISOString().split('T')[0];
            document.getElementById('date-depot').value = aujourdHui;
            break;
        case 'consulter-plaintes':
            document.getElementById('consulter-plaintes-section').classList.remove('hidden');
            afficherPlaintes();
            break;
        case 'inscription':
            document.getElementById('inscription-section').classList.remove('hidden');
            break;
        case 'administration':
            document.getElementById('administration-section').classList.remove('hidden');
            afficherUtilisateurs();
            break;
    }
}

// Afficher une sous-section d'administration
function showAdminSubSection(subSectionId) {
    document.getElementById('gestion-utilisateurs-subsection').classList.add('hidden');
    document.getElementById('statistiques-subsection').classList.add('hidden');
    document.getElementById('configuration-subsection').classList.add('hidden');
    
    switch(subSectionId) {
        case 'gestion-utilisateurs':
            document.getElementById('gestion-utilisateurs-subsection').classList.remove('hidden');
            break;
        case 'statistiques':
            document.getElementById('statistiques-subsection').classList.remove('hidden');
            afficherStatistiques();
            break;
        case 'configuration':
            document.getElementById('configuration-subsection').classList.remove('hidden');
            break;
    }
}

// Réinitialiser les sous-sections d'administration
function resetAdminSubSections() {
    document.getElementById('gestion-utilisateurs-subsection').classList.add('hidden');
    document.getElementById('statistiques-subsection').classList.add('hidden');
    document.getElementById('configuration-subsection').classList.add('hidden');
}

// Afficher la liste des plaintes
function afficherPlaintes() {
    const tbody = document.getElementById('plaintes-body');
    tbody.innerHTML = '';
    
    plaintes.forEach(plainte => {
        const tr = document.createElement('tr');
        tr.onclick = () => showPlainteDetails(plainte.id);
        tr.style.cursor = 'pointer';
        
        // Ajouter une classe en fonction du statut pour le style
        let statutClass = '';
        if (plainte.statut === 'En attente') statutClass = 'status-pending';
        else if (plainte.statut === 'En cours') statutClass = 'status-in-progress';
        else if (plainte.statut === 'Résolu') statutClass = 'status-resolved';
        
        tr.innerHTML = `
            <td>${plainte.nom}</td>
            <td>${plainte.type}</td>
            <td>${plainte.date}</td>
            <td>${plainte.description.length > 50 ? plainte.description.substring(0, 50) + '...' : plainte.description}</td>
            <td class="${statutClass}">${plainte.statut}</td>
            <td>${plainte.inspection}</td>
            <td class="plainte-actions">
                ${currentUser && currentUser.role === 'Administrateur' ? 
                    `<button class="btn btn-warning" onclick="openEditModal(${plainte.id}); event.stopPropagation()">Modifier</button>
                     <button class="btn btn-primary" onclick="supprimerPlainte(${plainte.id}); event.stopPropagation()">Supprimer</button>` : 
                    ''}
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Afficher les détails d'une plainte
function showPlainteDetails(plainteId) {
    const plainte = plaintes.find(p => p.id === plainteId);
    if (!plainte) return;
    
    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = `
        <p><strong>Nom complet:</strong> ${plainte.nom}</p>
        <p><strong>Type de plainte:</strong> ${plainte.type}</p>
        <p><strong>Date de dépôt:</strong> ${plainte.date}</p>
        <p><strong>Description:</strong> ${plainte.description}</p>
        <p><strong>Statut:</strong> ${plainte.statut}</p>
        <p><strong>Date d'inspection:</strong> ${plainte.inspection}</p>
    `;
    
    // Afficher les pièces jointes
    const piecesJointesDetails = document.getElementById('pieces-jointes-details');
    piecesJointesDetails.innerHTML = '';
    
    if (plainte.piecesJointes && plainte.piecesJointes.length > 0) {
        plainte.piecesJointes.forEach(piece => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${piece.nom}</span>
                <a href="${piece.url}" download="${piece.nom}">Télécharger</a>
            `;
            piecesJointesDetails.appendChild(fileItem);
        });
    } else {
        piecesJointesDetails.innerHTML = '<p>Aucune pièce jointe disponible pour cette plainte.</p>';
    }
    
    document.getElementById('plainte-details').classList.remove('hidden');
}

// Masquer les détails d'une plainte
function hidePlainteDetails() {
    document.getElementById('plainte-details').classList.add('hidden');
}

// Filtrer les plaintes selon la recherche
function filtrerPlaintes() {
    const recherche = document.getElementById('recherche-plaintes').value.toLowerCase();
    const lignes = document.querySelectorAll('#plaintes-body tr');
    
    lignes.forEach(ligne => {
        const texteLigne = ligne.textContent.toLowerCase();
        if (texteLigne.includes(recherche)) {
            ligne.style.display = '';
        } else {
            ligne.style.display = 'none';
        }
    });
}

// Afficher la liste des utilisateurs
function afficherUtilisateurs() {
    const tbody = document.getElementById('utilisateurs-body');
    tbody.innerHTML = '';
    
    utilisateurs.forEach(utilisateur => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>${utilisateur.nom}</td>
            <td>${utilisateur.email}</td>
            <td>${utilisateur.role}</td>
            <td>
                <button class="btn">Modifier</button>
                <button class="btn btn-primary">Supprimer</button>
            </td>
        `;
        
        tbody.appendChild(tr);
    });
}

// Afficher les statistiques
function afficherStatistiques() {
    const statsContainer = document.getElementById('stats-container');
    
    // Compter les plaintes par statut
    const statsParStatut = {
        'En attente': plaintes.filter(p => p.statut === 'En attente').length,
        'En cours': plaintes.filter(p => p.statut === 'En cours').length,
        'Résolu': plaintes.filter(p => p.statut === 'Résolu').length
    };
    
    // Compter les plaintes par type
    const statsParType = {};
    plaintes.forEach(plainte => {
        if (!statsParType[plainte.type]) {
            statsParType[plainte.type] = 0;
        }
        statsParType[plainte.type]++;
    });
    
    // Générer le HTML des statistiques
    let html = '<div class="stats-section"><h4>Par Statut</h4><ul>';
    
    for (const [statut, count] of Object.entries(statsParStatut)) {
        html += `<li>${statut}: ${count}</li>`;
    }
    
    html += '</ul></div><div class="stats-section"><h4>Par Type</h4><ul>';
    
    for (const [type, count] of Object.entries(statsParType)) {
        html += `<li>${type}: ${count}</li>`;
    }
    
    html += '</ul></div>';
    
    statsContainer.innerHTML = html;
}

// Ouvrir le modal de modification
function openEditModal(plainteId) {
    const plainte = plaintes.find(p => p.id === plainteId);
    if (!plainte) return;
    
    selectedPlainteId = plainteId;
    
    document.getElementById('edit-plainte-id').value = plainte.id;
    document.getElementById('edit-type-plainte').value = plainte.type;
    document.getElementById('edit-description').value = plainte.description;
    document.getElementById('edit-statut').value = plainte.statut;
    document.getElementById('edit-date-inspection').value = plainte.inspection !== 'Non planifiée' ? plainte.inspection : '';
    document.getElementById('edit-notes').value = plainte.notes || '';
    
    // Afficher les pièces jointes existantes
    const fileList = document.getElementById('edit-file-list');
    fileList.innerHTML = '';
    
    if (plainte.piecesJointes && plainte.piecesJointes.length > 0) {
        plainte.piecesJointes.forEach(piece => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span>${piece.nom}</span>
                <a href="${piece.url}" download="${piece.nom}">Télécharger</a>
                <button onclick="supprimerPieceJointe(${plainteId}, '${piece.nom}'); event.preventDefault()">Supprimer</button>
            `;
            fileList.appendChild(fileItem);
        });
    }
    
    document.getElementById('edit-modal').style.display = 'block';
}

// Fermer le modal de modification
function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
    selectedPlainteId = null;
}

// Supprimer une pièce jointe
function supprimerPieceJointe(plainteId, nomFichier) {
    const plainte = plaintes.find(p => p.id === plainteId);
    if (!plainte || !plainte.piecesJointes) return;
    
    plainte.piecesJointes = plainte.piecesJointes.filter(p => p.nom !== nomFichier);
    sauvegarderDonnees();
    
    // Mettre à jour l'affichage
    if (selectedPlainteId === plainteId) {
        openEditModal(plainteId);
    }
}

// Supprimer une plainte
function supprimerPlainte(plainteId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette plainte ?')) {
        plaintes = plaintes.filter(p => p.id !== plainteId);
        sauvegarderDonnees();
        afficherPlaintes();
        hidePlainteDetails();
    }
}

// Gestion des fichiers sélectionnés
document.getElementById('pieces-jointes').addEventListener('change', function(e) {
    const files = e.target.files;
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    selectedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        selectedFiles.push(file);
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <button onclick="supprimerFichierSelectionne(${i}); event.preventDefault()">Supprimer</button>
        `;
        fileList.appendChild(fileItem);
    }
});

// Supprimer un fichier sélectionné
function supprimerFichierSelectionne(index) {
    selectedFiles.splice(index, 1);
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    
    selectedFiles.forEach((file, i) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <button onclick="supprimerFichierSelectionne(${i}); event.preventDefault()">Supprimer</button>
        `;
        fileList.appendChild(fileItem);
    });
}

// Gestion des fichiers sélectionnés pour la modification
document.getElementById('edit-pieces-jointes').addEventListener('change', function(e) {
    const files = e.target.files;
    const fileList = document.getElementById('edit-file-list');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <span>${file.name}</span>
            <button onclick="this.parentElement.remove(); event.preventDefault()">Supprimer</button>
        `;
        fileList.appendChild(fileItem);
    }
});

// Convertir un fichier en URL de données
function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Gestionnaire d'événement pour le formulaire de plainte
document.getElementById('plainte-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Convertir les fichiers en URLs de données
    const piecesJointes = [];
    for (const file of selectedFiles) {
        try {
            const dataURL = await fileToDataURL(file);
            piecesJointes.push({
                nom: file.name,
                url: dataURL
            });
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier:', error);
        }
    }
    
    const nouvellePlainte = {
        id: plaintes.length > 0 ? Math.max(...plaintes.map(p => p.id)) + 1 : 1,
        nom: document.getElementById('nom').value,
        type: document.getElementById('type-plainte').value,
        date: document.getElementById('date-depot').value,
        description: document.getElementById('description').value,
        statut: "En attente",
        inspection: document.getElementById('date-inspection').value || "Non planifiée",
        piecesJointes: piecesJointes
    };
    
    plaintes.push(nouvellePlainte);
    sauvegarderDonnees();
    
    alert('Votre plainte a été enregistrée avec succès. Numéro de référence: ' + nouvellePlainte.id);
    this.reset();
    document.getElementById('file-list').innerHTML = '';
    selectedFiles = [];
    
    // Définir la date du jour par défaut
    const aujourdHui = new Date().toISOString().split('T')[0];
    document.getElementById('date-depot').value = aujourdHui;
});

// Gestionnaire d'événement pour le formulaire de modification
document.getElementById('edit-plainte-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const plainteId = parseInt(document.getElementById('edit-plainte-id').value);
    const plainteIndex = plaintes.findIndex(p => p.id === plainteId);
    
    if (plainteIndex === -1) return;
    
    // Convertir les nouveaux fichiers en URLs de données
    const filesInput = document.getElementById('edit-pieces-jointes');
    const newPiecesJointes = [...plaintes[plainteIndex].piecesJointes];
    
    for (let i = 0; i < filesInput.files.length; i++) {
        const file = filesInput.files[i];
        try {
            const dataURL = await fileToDataURL(file);
            newPiecesJointes.push({
                nom: file.name,
                url: dataURL
            });
        } catch (error) {
            console.error('Erreur lors de la lecture du fichier:', error);
        }
    }
    
    // Mettre à jour la plainte
    plaintes[plainteIndex] = {
        ...plaintes[plainteIndex],
        type: document.getElementById('edit-type-plainte').value,
        description: document.getElementById('edit-description').value,
        statut: document.getElementById('edit-statut').value,
        inspection: document.getElementById('edit-date-inspection').value || "Non planifiée",
        piecesJointes: newPiecesJointes
    };
    
    sauvegarderDonnees();
    afficherPlaintes();
    closeEditModal();
    
    alert('La plainte a été modifiée avec succès.');
});

// Gestionnaire d'événement pour le formulaire d'inscription
document.getElementById('inscription-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nouvelUtilisateur = {
        id: utilisateurs.length > 0 ? Math.max(...utilisateurs.map(u => u.id)) + 1 : 1,
        nom: document.getElementById('inscription-nom').value,
        prenom: document.getElementById('inscription-prenom').value,
        email: document.getElementById('inscription-email').value,
        role: "Citoyen"
    };
    
    utilisateurs.push(nouvelUtilisateur);
    sauvegarderDonnees();
    
    alert('Inscription réussie. Bienvenue ' + nouvelUtilisateur.prenom + ' ' + nouvelUtilisateur.nom + '!');
    this.reset();
});

// Gestionnaire d'événement pour le formulaire de configuration
document.getElementById('config-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nouvelleCommune = document.getElementById('commune-config').value;
    const nouveauTheme = document.getElementById('theme-config').value;
    
    document.getElementById('commune-name').textContent = nouvelleCommune;
    appliquerTheme(nouveauTheme);
    sauvegarderDonnees();
    
    alert('Configuration enregistrée avec succès!');
});

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    chargerDonnees();
    showSection('accueil');
    
    // Définir la date du jour par défaut pour le formulaire de plainte
    const aujourdHui = new Date().toISOString().split('T')[0];
    document.getElementById('date-depot').value = aujourdHui;
});