function buyCharacter(condition, cost) {
    if (coins >= cost) {
        coins -= cost;

        if (currentChar.name === 'Reset') {
            triggerGameOver();
            return;
        }

        let portraitSrc = getPortraitForCondition(currentChar, condition);

        if(currentChar.name ==  'Katsuie'){
            handleKatsuieChoice(condition);
            reroll(true);
            return;
        }
        
        if(currentChar.name ==  'Bird'){
            handleBirdChoice(condition);
            reroll(true);
            return;
        }
        if(currentChar.name == 'Feliss'){
            if (condition === 'I Want You'){
                condition = 'A Million Dead Ants';
                    document.getElementById('eventMessage').textContent = "";
                    document.querySelector('#roll-button button').disabled = false;
            } else{
                handleFelissChoice(condition);
                reroll(true);
                return;
            }
        }

        logAction(`${playerName} bought ${condition} ${currentChar.name}`);

        checkTwin(condition);
        triggerMiki();
        checkMegaPrima();
        checkMedusa();
        checkCopadon();
        checkShizuka();
        checkNagi();
        addGhosts();
        checkWenlina();

        inventory.push({ name: currentChar.name, src: portraitSrc, condition, demon: !!currentChar.demon });
        const isKatsuieTrigger =
        (currentChar.katsuie === true ||
        (currentChar.name === 'Aten' && condition === 'Brand New') ||
        (currentChar.name === 'Mill' && condition === 'Used (JC)') && boolKatsuie === true);

        if (isKatsuieTrigger && boolKatsuie) {
            boolKatsuie = false;
            forceKatsuie = true;
        }

        if (currentChar.bird === true && birdFlag === false){
            birdFlag = true;
            birdCountdown = 0;
        }

        //remove character from pool
        characters = characters.filter(char => char.name !== currentChar.name);
        updateInventory();
        reroll(true);
    } else {
        alert('Not enough coins!');
    }
}

function checkTwin(condition) {
    if (currentChar.name === 'La-hawzel') {
        const laSeizelIndex = characters.findIndex(c => c.name === 'La-Saizel');
        if (laSeizelIndex !== -1) {
            const laSeizel = characters[laSeizelIndex];
            inventory.push({
                name: laSeizel.name,
                src: getPortraitForCondition(laSeizel, condition),
                condition,
                demon: !!currentChar.demon
            });
            characters.splice(laSeizelIndex, 1); // Remove from pool
            logAction(`${playerName} received La-Seizel for free!`);
        }
    } else if (currentChar.name === 'La-Saizel') {
        const laHawzelIndex = characters.findIndex(c => c.name === 'La-hawzel');
        if (laHawzelIndex !== -1) {
            const laHawzel = characters[laHawzelIndex];
            inventory.push({
                name: laHawzel.name,
                src: getPortraitForCondition(laHawzel, condition),
                condition,
                demon: !!currentChar.demon
            });
            characters.splice(laHawzelIndex, 1); // Remove from pool
            logAction(`${playerName} received La-Hawzel for free!`);
        }
    }
}

function getPortraitForCondition(character, condition) {
    // Define exceptions here
    if (condition === 'Brand New' && character.name === 'Calory') {
        return 'img/portrait/special/Calory_green.webp'; 
    } if ((condition === 'Damaged' || condition === 'Used') && character.name === 'Calory') {
        return 'img/portrait/Calory.webp'; 
    } else if(condition === 'Female' && character.name === 'Suzaku'){
        return 'img/portrait/special/Suzaku_fem.webp';
    } else if(condition === 'Female' && character.name === 'Ryouma'){
        return 'img/portrait/special/Ryouma_fem.webp';
    } else if(condition === 'Female' && character.name === 'Ryouma'){
        return 'img/portrait/special/Ryouma_male.webp';
    } else if(condition === 'Brand New' && character.name === 'Aten'){
        return 'img/portrait/katsuie/Aten_young.webp';
    } else if(condition === 'Brand New' && character.name === 'Aegis'){
        return 'img/portrait/special/Aegis_red.webp';
    } else if(condition === 'Brand New' && character.name === 'Pastel'){
        return 'img/portrait/special/Pastel_red.webp';
    } else if((condition === 'Damaged' || condition === 'Used') && character.name === 'Aegis'){
        return 'img/portrait/Aegis.webp';
    } else if((condition === 'Damaged' || condition === 'Used') && character.name === 'Pastel'){
        return 'img/portrait/Pastel.webp';
    } else if(condition === 'Female' && character.name === 'Kesselring'){
        return 'img/portrait/special/Kesselring_female.webp';
    } else if(condition === 'Damaged (JD)' && character.name === 'Mill'){
        return 'img/portrait/special/Mill_old.webp';
    } else if(condition === 'Damaged (Crazy)' && character.name === 'Papaya'){
        return 'img/portrait/special/Papaya_crazy.webp';
    } else if(condition === 'Broken' && character.name === 'Urza'){
        return 'img/portrait/special/Urza_broken.webp';
    }
    
    // Default fallback
    return character.portrait;
}

function checkMedusa() {
    if (currentChar.name === 'Medusa') {
        inventory.forEach((item, i) => {
            if (item.name === 'Medusa' || item.demon) return; // Skip herself and demons
            // Check for special variants
            if (item.condition === 'Used (JC)') {
                item.condition = 'Damaged (JC)';
            } else if (item.condition === 'Brand New (Big Boobs)') {
                item.condition = 'Damaged (Big Boobs)';
            } else if (item.condition === 'Brand New' || item.condition === 'Used' || item.condition === 'SEEN Goods') {
                item.condition = 'Damaged';
            } else {
                return; // Do nothing for other conditions
            }

            const baseData = characters.find(c => c.name === item.name);
            if (baseData) {
                item.src = getPortraitForCondition(baseData, item.condition);
            }
        });

        updateInventory();
        logAction("Medusa had a little fun with your girls.");
    }
}

function checkCopadon(){
    if (currentChar.name === 'Copandon') {
        const roll = Math.floor(Math.random() * 3) + 1;
        if (roll === 1) {
            const loss = Math.min(1000, coins);
            coins -= loss;
            logAction(`${playerName} has Terrible Fortune. You loss ${loss}G to a Nigerian Prince!`);
        } else if (roll === 2) {
            logAction(`${playerName} luck is just average. Nothing happens.`);
        } else if (roll === 3) {
            coins += 1000;
            logAction(`${playerName} has Great Fortune. While find a wallet with 1000G!`);
        }
    }
}

function checkShizuka(){
    if (currentChar.name === 'Shizuka' && !currentChar.young) {
        const nagi = inventory.find(c => c.name === 'Nagi');
        if (nagi) {
            nagi.condition = 'Brand New';
            nagi.src = 'img/portrait/special/Nagi_new.webp';
            logAction(`Shizuka gave a second oportunity to Nagi!`);
            updateInventory();
        }
    }
}

function checkMegaPrima(){
    if (currentChar.name === 'Megadeth') {
        const prima = inventory.find(c => c.name === 'Prima');
        if (prima) {
            // Downgrade Prima's condition
            if (prima.condition === 'Brand New') {
                prima.condition = 'Used';
                logAction(`Prima was tormented by Megadeth.`);
            } else if (prima.condition === 'Used') {
                prima.condition = 'Damaged';
                logAction(`Prima was tormented by Megadeth.`);
            }
        }
    }   
}

function checkNagi(){
    if (currentChar.name === 'Nagi' && !currentChar.young) {
        const shizukaIndex = inventory.findIndex(c => c.name === 'Shizuka');
        if (shizukaIndex !== -1) {
            const [shizuka] = inventory.splice(shizukaIndex, 1);
            graveyard.push(shizuka);
            logAction(`Nagi killed Shizuka.`);
            updateInventory();
        }
    }
}

function triggerMiki(){
    if (currentChar.name === 'Miki') {
        const shikibuIndex = inventory.findIndex(c => c.name === 'Shikibu');
        if (shikibuIndex !== -1) {
            const [shikibu] = inventory.splice(shikibuIndex, 1);
            graveyard.push(shikibu);
            logAction(`Miki killed Seiryuu.`);
            updateInventory();
        }
        const sill = inventory.find(c => c.name === 'Sill');
        if (sill) {
            sill.condition = 'Ice';
            sill.src = 'img/portrait/special/Sill_ice.webp';
            logAction(`Miki's power went out of control. Sill is fronzen!`);
            updateInventory();
        }
    }
}

function addGhosts(){
    if (currentChar.name === 'Pastel') {
        characters.push(...ghosts);
        logAction(`${ghosts.length} spirits have joined the pool!`);
    }
}

function handleKatsuieChoice(choice) {
    if (choice === 'No') {
        document.getElementById('eventMessage').textContent = "";
        document.querySelector('#roll-button button').disabled = false;
        logAction(`I see you're a decent man.`);
        reroll(true);
        return;
    } 

    // YES was selected — filter and rebuild character list
    const newCharacterPool = characters.filter(c =>
        c.keep || ['Shizuka', 'Aten', 'Wenlina', 'Bezeleye', 'Housenurse', 'Nagi', 'Mill', 'Ranmaru'].includes(c.name)
    );

    // Apply exceptions
    newCharacterPool.forEach(c => {
        if (['Shizuka', 'Aten', 'Wenlina', 'Bezeleye', 'Housenurse'].includes(c.name)) {
            c.portrait = `img/portrait/katsuie/${c.name}_young.webp`;
            c.image = `img/fullbody/katsuie/${c.name}_young.webp`;
            c.young = true;
        }
        if (c.name === 'Nagi') {
            c.options = { 'Brand New': true, 'Used': true, 'Damaged': c.options?.Damaged };
            c.portrait = 'img/portrait/katsuie/Nagi_young.webp';
            c.image = 'img/fullbody/katsuie/Nagi_young.webp';
            c.young = true;
        }
        if (c.name === 'Mill') {
            c.options = { 'Brand New': true, 'Used': true, 'Damaged': true };
            c.portrait = 'img/portrait/katsuie/Mill_young.webp';
            c.image = 'img/fullbody/katsuie/Mill_young.webp';
        }
        if (c.name === 'Ranmaru') {
            c.options = { 'Brand New': false, 'Used': false, 'Damaged': false };
        }
    });

    // Add all characters in katsuieList
    newCharacterPool.push(...katsuieList);
    logAction(`This is too low, even for an eroge company.`);
    characters = newCharacterPool;
    document.getElementById('eventMessage').textContent = "";
    document.querySelector('#roll-button button').disabled = false;
    reroll(true);
}

function handleBirdChoice(choice) {
    if (choice === 'Buy Him a Beer') {
        // Prioritize Brand New Sill
        let target = inventory.find(c => c.name === 'Sill' && c.condition === 'Brand New');

        if (!target) {
            target = inventory.find(c => c.condition.includes('Brand New'));
        }

        if (target) {
            target.condition = 'SEEN Goods';
            logAction(`Bird saw ${target.name} when she was changing her clothes. She's now SEEN Goods!`);
        } else {
            logAction(`Bird left quietly.`);
        }

    } else if (choice === 'Bully Him') {
        // Prioritize Sill (non-demon, non-cow)
        let validTargets = inventory.filter(c => 
            !c.demon && c.condition !== 'Cow'
        );

        let target = validTargets.find(c => c.name === 'Sill') || 
                     validTargets[Math.floor(Math.random() * validTargets.length)];

        if (target) {
            if (target.name === 'Suzaku') {
                handleSuzakuDeath(target); // Flip gender
            } else if (target.name === 'Suzume') {
                processSuzumeDeath(); // Becomes ghost
            } else {
                const index = inventory.indexOf(target);
                if (index !== -1) {
                    inventory.splice(index, 1);
                    graveyard.push(target);
                    logAction(`Bird killed ${target.name}.`);
                }
            }
        } else {
            logAction(`Bird ran off cursing under his breath.`);
        }
    }

    updateInventory();
    document.getElementById('eventMessage').textContent = "";
    document.querySelector('#roll-button button').disabled = false;
    reroll(true);
}


function handleFelissChoice(choice) {
    if (choice === 'I Want Money') {
        coins += 1000;
        logAction(`${playerName} accepted Feliss's offer and received 1000G.`);
    }else if (choice === 'Turn Rizna into a Virgin') {
        const riznaIndex = inventory.findIndex(c => c.name === 'Rizna');
        if (riznaIndex !== -1) {
            inventory[riznaIndex].condition = 'Brand New';
            logAction(`${playerName} used Feliss's power to reset Rizna's virginity.`);
            updateInventory();
        }
    }
    document.getElementById('eventMessage').textContent = "";
    document.querySelector('#roll-button button').disabled = false;
    characters = characters.filter(char => char.name !== currentChar.name);

    reroll(true);
    return;
}
function checkWenlina() {
    if (currentChar.name === 'Wenlina') {
        if (graveyard.length > 0) {
            const index = Math.floor(Math.random() * graveyard.length);
            const resurrected = graveyard.splice(index, 1)[0];

            if (resurrected.name === 'Suzume') {
                // Find ghost Suzume in inventory
                const suzume = inventory.find(c => c.name === 'Suzume');
                if (suzume) {
                    // Replace ghost with revived Suzume
                    suzume.condition = resurrected.condition;
                    suzume.src = resurrected.src;
                    suzume.demon = false; // Remove demon status
                } else {
                    // Fallback: if ghost not found, just push
                    inventory.push(resurrected);
                }
            } else {
                inventory.push(resurrected);
            }

            logAction(`Wenlina used her power to bring back ${resurrected.name}!`);
            updateInventory();
        } else {
            logAction(`Wenlina looked into the graveyard, but found no one to save.`);
        }
    }
}

function triggerGameOver() {
    // Hide all existing game elements
    document.getElementById('inventory').style.display = 'none';
    document.getElementById('log').style.display = 'none';
    document.getElementById('charImage').style.display = 'none';
    document.getElementById('eventMessage').style.display = 'none';
    document.getElementById('roll-button').style.display = 'none';

    // Create game over screen
    const gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over-screen';
    gameOverScreen.style.position = 'fixed';
    gameOverScreen.style.top = '0';
    gameOverScreen.style.left = '0';
    gameOverScreen.style.width = '100%';
    gameOverScreen.style.height = '100%';
    gameOverScreen.style.backgroundColor = 'black';
    gameOverScreen.style.display = 'flex';
    gameOverScreen.style.flexDirection = 'column';
    gameOverScreen.style.alignItems = 'center';
    gameOverScreen.style.justifyContent = 'center';
    gameOverScreen.style.zIndex = '9999';
    gameOverScreen.style.color = 'white';

    const img = document.createElement('img');
    img.src = 'img/fullbody/event/Rance.webp';
    img.style.maxWidth = '60%';
    img.style.marginBottom = '30px';

    const text = document.createElement('div');
    text.textContent = 'YOU DIED';
    text.style.fontSize = '72px';
    text.style.fontWeight = 'bold';
    text.style.color = 'red';
    text.style.textShadow = '2px 2px 10px black';

    gameOverScreen.appendChild(img);
    gameOverScreen.appendChild(text);
    document.body.appendChild(gameOverScreen);
}
