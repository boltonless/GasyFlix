// Options de paris disponibles
const betOptions = [
    // Options de résultat
    { id: "1", category: "result", label: "1 (Victoire équipe A)", value: "1" },
    { id: "2", category: "result", label: "X (Match nul)", value: "X" },
    { id: "3", category: "result", label: "2 (Victoire équipe B)", value: "2" },
    
    // Options de double chance
    { id: "4", category: "doubleChance", label: "1X (Équipe A ou Nul)", value: "1X" },
    { id: "5", category: "doubleChance", label: "X2 (Nul ou Équipe B)", value: "X2" },
    { id: "6", category: "doubleChance", label: "12 (Équipe A ou Équipe B)", value: "12" },
    
    // Options de buts
    { id: "7", category: "goals", label: "> 0.5 buts", value: ">0.5" },
    { id: "8", category: "goals", label: "> 1.5 buts", value: ">1.5" },
    { id: "9", category: "goals", label: "> 2.5 buts", value: ">2.5" },
    { id: "10", category: "goals", label: "< 2.5 buts", value: "<2.5" },
    { id: "11", category: "goals", label: "< 3.5 buts", value: "<3.5" },
  ];
  
  // Variables globales
  let selectedBets = [];
  
  // Fonctions utilitaires
  function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  function formatDate(date) {
    // Format de date: dd/mm/yyyy HH:MM
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  // Gestion des onglets principaux
  function setupMainTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Activer le bouton
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Activer le contenu
        tabPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
        
        // Si on active l'onglet "list", recharger la liste
        if (tabId === 'list') {
          loadPredictions();
        }
      });
    });
  }
  
  // Gestion des onglets de paris
  function setupBetTabs() {
    const betTabBtns = document.querySelectorAll('.bet-tab-btn');
    const betTabPanes = document.querySelectorAll('.bet-tab-pane');
    
    betTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-bet-tab');
        
        // Activer le bouton
        betTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Activer le contenu
        betTabPanes.forEach(pane => pane.classList.remove('active'));
        document.getElementById(tabId).classList.add('active');
      });
    });
  }
  
  // Génération des options de paris
  function setupBetOptions() {
    // Filtrer les options par catégorie
    const resultOptions = betOptions.filter(option => option.category === 'result');
    const doubleChanceOptions = betOptions.filter(option => option.category === 'doubleChance');
    const goalsOptions = betOptions.filter(option => option.category === 'goals');
    
    // Générer les options pour chaque catégorie
    generateBetOptionsForCategory('result', resultOptions);
    generateBetOptionsForCategory('doubleChance', doubleChanceOptions);
    generateBetOptionsForCategory('goals', goalsOptions);
  }
  
  function generateBetOptionsForCategory(categoryId, options) {
    const container = document.querySelector(`#${categoryId} .bet-options-grid`);
    container.innerHTML = '';
    
    options.forEach(option => {
      const isSelected = selectedBets.some(bet => bet.option.id === option.id);
      const odd = isSelected 
        ? selectedBets.find(bet => bet.option.id === option.id).odd 
        : (1.5 + Math.random()).toFixed(2);
      
      const betOptionElement = document.createElement('div');
      betOptionElement.className = `bet-option ${isSelected ? 'selected' : ''}`;
      betOptionElement.setAttribute('data-option-id', option.id);
      
      betOptionElement.innerHTML = `
        <div class="bet-option-value">${option.value}</div>
        <div class="bet-option-label">${option.label}</div>
        ${isSelected ? `
          <div class="bet-option-odd">
            <input type="number" class="odd-input" value="${odd}" min="1" step="0.01">
          </div>
        ` : ''}
      `;
      
      betOptionElement.addEventListener('click', () => handleBetOptionClick(option, betOptionElement));
      container.appendChild(betOptionElement);
    });
  }
  
  // Gestion des clics sur les options de paris
  function handleBetOptionClick(option, element) {
    const isSelected = selectedBets.some(bet => bet.option.id === option.id);
    
    if (isSelected) {
      // Désélectionner l'option
      selectedBets = selectedBets.filter(bet => bet.option.id !== option.id);
      element.classList.remove('selected');
      
      // Supprimer l'input de cote
      const oddInput = element.querySelector('.bet-option-odd');
      if (oddInput) {
        element.removeChild(oddInput);
      }
    } else {
      // Sélectionner l'option
      const odd = (1.5 + Math.random()).toFixed(2);
      selectedBets.push({ option, odd: parseFloat(odd) });
      element.classList.add('selected');
      
      // Ajouter l'input de cote
      const oddDiv = document.createElement('div');
      oddDiv.className = 'bet-option-odd';
      oddDiv.innerHTML = `
        <input type="number" class="odd-input" value="${odd}" min="1" step="0.01">
      `;
      element.appendChild(oddDiv);
      
      // Empêcher la propagation du clic sur l'input
      const input = oddDiv.querySelector('input');
      input.addEventListener('click', e => e.stopPropagation());
      
      // Mettre à jour la cote quand elle change
      input.addEventListener('input', e => {
        const newOdd = parseFloat(e.target.value);
        const betIndex = selectedBets.findIndex(bet => bet.option.id === option.id);
        if (betIndex !== -1) {
          selectedBets[betIndex].odd = newOdd;
        }
      });
    }
  }
  
  // Gestion du formulaire de pronostic
  function setupPredictionForm() {
    const form = document.getElementById('prediction-form');
    
    form.addEventListener('submit', e => {
      e.preventDefault();
      
      const teamA = document.getElementById('teamA').value.trim();
      const teamB = document.getElementById('teamB').value.trim();
      
      if (!teamA || !teamB) {
        showToast('Erreur', 'Veuillez saisir les noms des deux équipes', 'error');
        return;
      }
      
      if (selectedBets.length === 0) {
        showToast('Erreur', 'Veuillez sélectionner au moins un pronostic', 'error');
        return;
      }
      
      // Créer un nouveau pronostic
      const newPrediction = {
        id: generateId(),
        teamA: { id: generateId(), name: teamA },
        teamB: { id: generateId(), name: teamB },
        date: new Date(),
        selectedBets: [...selectedBets]
      };
      
      // Sauvegarder le pronostic
      savePrediction(newPrediction);
      
      // Afficher un message de succès
      showToast('Succès', 'Votre pronostic a été enregistré avec succès', 'success');
      
      // Réinitialiser le formulaire
      form.reset();
      selectedBets = [];
      setupBetOptions(); // Régénérer les options
    });
  }
  
  // Gestion des pronostics sauvegardés
  function savePrediction(prediction) {
    try {
      const savedPredictions = getSavedPredictions();
      const updatedPredictions = [...savedPredictions, prediction];
      
      localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du pronostic:', error);
    }
  }
  
  function getSavedPredictions() {
    try {
      const predictions = localStorage.getItem('predictions');
      if (!predictions) return [];
      
      return JSON.parse(predictions);
    } catch (error) {
      console.error('Erreur lors de la récupération des pronostics:', error);
      return [];
    }
  }
  
  function deletePrediction(id) {
    try {
      const savedPredictions = getSavedPredictions();
      const updatedPredictions = savedPredictions.filter(pred => pred.id !== id);
      
      localStorage.setItem('predictions', JSON.stringify(updatedPredictions));
    } catch (error) {
      console.error('Erreur lors de la suppression du pronostic:', error);
    }
  }
  
  function loadPredictions() {
    const container = document.getElementById('predictions-list');
    const predictions = getSavedPredictions();
    const listDescription = document.getElementById('list-description');
    
    if (predictions.length === 0) {
      container.innerHTML = `<div class="empty-list">Vous n'avez pas encore sauvegardé de pronostics.</div>`;
      listDescription.textContent = "Vous n'avez pas encore sauvegardé de pronostics.";
      return;
    }
    
    listDescription.textContent = "Liste de tous vos pronostics enregistrés";
    container.innerHTML = '';
    
    predictions.forEach(prediction => {
      const predictionCard = document.createElement('div');
      predictionCard.className = 'prediction-card';
      
      // Création du header de la carte
      const header = document.createElement('div');
      header.className = 'prediction-header';
      
      header.innerHTML = `
        <div>
          <div class="prediction-date">${formatDate(prediction.date)}</div>
          <div class="prediction-teams">${prediction.teamA.name} vs ${prediction.teamB.name}</div>
        </div>
        <button class="delete-btn" data-id="${prediction.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      `;
      
      // Création du contenu de la carte
      const content = document.createElement('div');
      content.className = 'prediction-content';
      
      // Groupe les paris par catégorie
      const categories = ['result', 'doubleChance', 'goals'];
      const categoryLabels = {
        'result': 'Résultat',
        'doubleChance': 'Double Chance',
        'goals': 'Nombre de buts'
      };
      
      const predictionBets = document.createElement('div');
      predictionBets.className = 'prediction-bets';
      
      categories.forEach(category => {
        const categoryBets = prediction.selectedBets.filter(bet => bet.option.category === category);
        
        if (categoryBets.length > 0) {
          const categoryElement = document.createElement('div');
          categoryElement.className = 'prediction-category';
          
          categoryElement.innerHTML = `
            <div class="category-name">${categoryLabels[category]}</div>
            <div class="bet-badges">
              ${categoryBets.map(bet => `
                <div class="bet-badge">
                  <span>${bet.option.value}</span>
                  <span class="odd-value">@${parseFloat(bet.odd).toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          `;
          
          predictionBets.appendChild(categoryElement);
        }
      });
      
      content.appendChild(predictionBets);
      
      // Assembler la carte
      predictionCard.appendChild(header);
      predictionCard.appendChild(content);
      
      // Ajouter la carte au conteneur
      container.appendChild(predictionCard);
      
      // Ajouter l'événement de suppression
      const deleteBtn = predictionCard.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        const id = deleteBtn.getAttribute('data-id');
        deletePrediction(id);
        loadPredictions();
        showToast('Pronostic supprimé', 'Le pronostic a été supprimé avec succès.', 'success');
      });
    });
  }
  
  // Affichage des toasts
  function showToast(title, message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = toast.querySelector('.toast-title');
    const toastDescription = toast.querySelector('.toast-description');
    
    // Définir le contenu
    toastTitle.textContent = title;
    toastDescription.textContent = message;
    
    // Définir le type
    toast.className = 'toast';
    toast.classList.add(type);
    
    // Afficher le toast
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Masquer après 3 secondes
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  // Initialisation
  document.addEventListener('DOMContentLoaded', () => {
    setupMainTabs();
    setupBetTabs();
    setupBetOptions();
    setupPredictionForm();
  });