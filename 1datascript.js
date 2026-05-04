/*
 * JavaScript Logic for Knowledge Pyramid Sort
 * 
 * NOTE: This script shuffles the initial card positions on load 
 * to randomize the workshop starting experience.
 */

// Helper function to shuffle the card elements (Fisher-Yates algorithm)
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap
    }
    return shuffled;
};

/**
 * Shuffles the cards and resets the source area display.
 */
const initializeCardOrder = () => {
    const sourceCardsContainer = document.getElementById('source-card-area');
    // Select all cards that are currently in the source container
    const cards = Array.from(sourceCardsContainer.querySelectorAll('.card'));
    
    if (cards.length === 0) return;

    // 1. Shuffle the array of card elements
    const shuffledCards = shuffleArray(cards);

    // 2. Clear the container (to remove original order)
    sourceCardsContainer.innerHTML = '';

    // 3. Append the shuffled elements back in the new order
    shuffledCards.forEach(card => {
        sourceCardsContainer.appendChild(card);
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const dropZones = document.querySelectorAll('.drop-zone');
    const feedbackElement = document.getElementById('feedback');
    const checkAnswerBtn = document.getElementById('checkAnswerBtn');
    
    // Run the shuffling function immediately to randomize the start
    initializeCardOrder();

    // --- 1. Drag and Drop Initialization ---
    
    // Make all source cards draggable
    cards.forEach(card => {
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            e.dataTransfer.effectAllowed = 'move';
            e.target.style.opacity = '0.4'; // Visual cue when dragging
        });

        card.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1'; // Reset opacity when drag finishes
        });
    });

    // Add event listeners to all drop zones
    dropZones.forEach(zone => {
        const dropZoneContents = zone.querySelector('.drop-zone-contents');

        // Drag Enter/Over: Provides visual feedback
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Essential: Allows dropping
            zone.classList.add('dragover');
        });

        // Drag Leave: Removes visual feedback
        zone.addEventListener('dragleave', (e) => {
            zone.classList.remove('dragover');
        });

        // Drop: Handles placement of the card
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('dragover');
            
            const cardId = e.dataTransfer.getData('text/plain');
            const cardElement = document.getElementById(cardId);
            
            if (cardElement) {
                // Append the actual element to the container inside the drop zone
                dropZoneContents.appendChild(cardElement);
            }
        });
    });

    // --- 2. Feedback and Checking Logic ---

    checkAnswerBtn.addEventListener('click', () => {
        let correctCount = 0;
        let totalCards = cards.length;
        
        // Temporarily remove all color styling before checking
        cards.forEach(card => {
            card.style.border = '2px solid #ccc';
        });

        // Iterate over all cards (we check where they ended up)
        cards.forEach(card => {
            const originalComponent = card.getAttribute('data-component');
            let foundZone = null;

            // Find which drop zone the card was placed in
            const droppedZones = document.querySelectorAll('.drop-zone-contents');
            droppedZones.forEach(zoneContents => {
                if (zoneContents.contains(card)) {
                    foundZone = zoneContents.closest('.drop-zone');
                }
            });

            // Check for correctness
            if (foundZone) {
                const zoneComponent = foundZone.getAttribute('data-component');
                if (originalComponent === zoneComponent) {
                    correctCount++;
                    // Correct placement: use a noticeable color
                    card.style.border = '2px solid #2ecc71';
                } else {
                    // Incorrect placement: use a warning color
                    card.style.border = '2px solid #e74c3c';
                }
            } else {
                // Not placed in a zone
                card.style.border = '2px solid orange';
            }
        });

        // Display results
        if (correctCount === totalCards) {
            feedbackElement.innerHTML = `🎉 **PERFECT PYRAMID!** All ${totalCards} scenarios are correctly mapped. You've mastered the flow from Data to actionable Knowledge.`;
            feedbackElement.className = 'correct';
        } else {
            feedbackElement.innerHTML = `⚠️ **Needs Review.** You correctly classified ${correctCount} out of ${totalCards} scenarios. Check the highlighted cards and review the definitions of Data, Information, and Knowledge.`;
            feedbackElement.className = 'incorrect';
        }
    });

});