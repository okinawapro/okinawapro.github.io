/*
 * JavaScript Logic for Motherboard Component Matching
 * 
 * This script handles the drag-and-drop functionality and validation.
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
                // Append the actual element to the drop zone's content container
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
            const dropZonesArray = Array.from(document.querySelectorAll('.drop-zone'));
            dropZonesArray.forEach(zone => {
                // Check if the card is a child of this drop zone
                if (zone.contains(card)) {
                    foundZone = zone;
                }
            });

            // Check for correctness
            if (foundZone) {
                const zoneComponent = foundZone.getAttribute('data-component');
                if (originalComponent === zoneComponent) {
                    correctCount++;
                    // Correct placement
                    card.style.border = '27ae60'; // Green
                } else {
                    // Incorrect placement
                    card.style.border = '#c0392b'; // Red
                }
            } else {
                // Not placed in a zone
                card.style.border = 'orange';
            }
        });

        // Display results
        if (correctCount === totalCards) {
            feedbackElement.innerHTML = `🎉 **PERFECT MATCH!** All ${totalCards} components are correctly mapped to their function. You are an expert hardware student!`;
            feedbackElement.className = 'correct';
        } else {
            feedbackElement.innerHTML = `⚠️ **Review Required.** You correctly matched ${correctCount} out of ${totalCards} components. Check the highlighted cards to see the correct function.`;
            feedbackElement.className = 'incorrect';
        }
    });

});