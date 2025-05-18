let cowBool = true;
let morurunBool = true;
let mikiBool = false;
let miliCount = 0;
let miliDead = false;
let suzumeCount = 0;
let suzumeDead = false;
let MikiRepeat = false;

function reroll(free = false) {
    if (!free && coins < 50) return;
    if (!free) coins -= 50;

    checkMiki();
    checkPapaya();
    checkLia();
    checkPastel();
    checkSamar();
    checkAki();
    
    checkMili();

    if (birdFlag){
        birdCountdown++;
    }

    if (forceKatsuie){
        checkKatsuie();
    } else if (birdCountdown > 3 && currentChar.name !== 'Feliss' && currentChar.name !== 'Katsuie'){
        checkBird();
    } else { currentChar = characters[Math.floor(Math.random() * characters.length)]; }
    
    document.getElementById('charImage').src = currentChar.image;

    checkSatella();
    checkSuzaku();
    checkFeliss();
    checkTorakoKatsuko()
    checkPrimaMega()

    renderOptions();
    updateInfo(); 
}

function checkPrimaMega() {

    const hasPrima = inventory.some(c => c.name === 'Prima');
    const hasMeg = inventory.some(c => c.name === 'Megadeth');

    if (currentChar.name === 'Megadeth' && hasPrima) {
        currentChar.specialPrices = {
            'Brand New': 250,
            'Used':      200,
            'Damaged':   150
        };
        logAction(`You have Prima in your inventory. The price of this character is halved!`);
    } else if (currentChar.name === 'Megadeth' && !hasPrima){
        delete currentChar.specialPrices;
    }

    if (currentChar.name === 'Prima' && hasMeg) {
        currentChar.specialPrices = {
            'Brand New': 1000,
            'Used':      800,
            'Damaged':   600
        };
        logAction(`You have Megadeth in your inventory. This character's price is doubled!`);
    } else if (currentChar.name === 'Prima' && !hasMeg){
        delete currentChar.specialPrices;
    }
}

function checkLia() {
    // Only run once per Lia roll
    if (!cowBool) return;

    // Must be rolling Lia
    if (currentChar?.name !== 'Lia' || inventory.some(c => c.name === 'Lia')) return;

    // First, try to find Sill specifically
    let victimIndex = inventory.findIndex(item =>
        item.name === 'Sill' &&
        !item.demon &&
        item.condition !== 'Cow'
    );

    let victim = null;

    // If Sill is not found, pick a random valid victim
    if (victimIndex === -1) {
        const victims = inventory.filter(item =>
            item.name !== 'Lia' &&
            !item.demon &&
            item.condition !== 'Cow'
        );

        if (victims.length === 0) return;

        victim = victims[Math.floor(Math.random() * victims.length)];

        // Find that victim's index in inventory
        victimIndex = inventory.findIndex(item =>
            item.name === victim.name &&
            item.condition === victim.condition
        );
        if (victimIndex === -1) return;
    } else {
        victim = inventory[victimIndex];
    }

    // Apply the curse
    inventory[victimIndex].condition = 'Cow';

    // Use special cow portrait for Sill
    if (victim.name === 'Sill') {
        inventory[victimIndex].src = 'img/portrait/special/Sill_cow.webp';
    } else {
        inventory[victimIndex].src = 'img/portrait/special/Cow.webp';
    }

    cowBool = false;
    logAction(`Lia cursed ${victim.name} and turned them into a cow!`);

    updateInventory();
    //removePigu(victim); 
}


function checkPastel(){
    if(morurunBool){
        const pastel = inventory.some(item => item.name === 'Pastel');
        if (currentChar?.name === 'Pastel' && !pastel) {
            logAction(`Pastel activated the Morurun Curse! All characters below lvl 35 are out of the pool.`);
            const beforeCount = characters.length;
            characters = characters.filter(c => c.morurun);
            const removedCount = beforeCount - characters.length;
            morurunBool = false;
        }
    }
}

function checkAki(){
    const aki = inventory.some(c => c.name === 'Aki' && c.condition !== 'Cow');
    if (aki && currentChar.name !== 'Aki') {
        const penalty = 100;
        const before = coins;
        coins = Math.max(0, coins - penalty);
        const actualLoss = before - coins;
        logAction(`Aki spent some of your money on a new dress (-${actualLoss}G)`);   
    }
}

function checkSamar() {
    // Ensure killer is in inventory and there's someone else to kill
    const samar = inventory.some(c => c.name === 'Samar' && c.condition !== 'Cow');
    const victims = inventory.filter(c =>
        c.name !== 'Samar' &&
        !c.demon
    );

    if (samar && victims.length > 0 && currentChar.name !== 'Samar') {
        const randomIndex = Math.floor(Math.random() * victims.length);
        const victim = victims[randomIndex];

        // Remove victim from inventory
        const victimIndex = inventory.findIndex(c => c === victim);
        if (victimIndex !== -1) {
            if (victim.name === 'Suzume') {
                processSuzumeDeath(); // Turn her into a ghost
            } else if (!handleSuzakuDeath(victim)) {
                inventory.splice(victimIndex, 1);
                graveyard.push(victim);
                logAction(`${victim.name} was killed by Samar`);
                updateInventory();
            }
        }
    }
}

function checkSuzaku(){
    if (currentChar.name === 'Suzaku') {
        const ranIndex = inventory.findIndex(c => c.name === 'Ran');
        if (ranIndex !== -1) {
            const [ran] = inventory.splice(ranIndex, 1);
            graveyard.push(ran);
            logAction(`Suzaku burst out of Ran's body. She's dead!`);
            updateInventory();
        }
    }
}

function checkSatella() {
    if (currentChar?.name !== 'Satella') return;

    for (let item of inventory) {
        if (item.name === 'Noah' && item.condition === 'Brand New') {
            item.condition = 'Used';
            item.src = getPortraitForCondition(getCharacterData('Noah'), 'Used');
            logAction(`Satella used a Golem Guardian to abuse Noah. She is now Used.`);
        }
    }
    updateInventory();
}

function getCharacterData(name) {
    return characters.find(c => c.name === name);
}

function removePigu(victim) {
    // Only remove from pool if victim is Pigu
    if (victim.name === 'Pigu') {
        characters = characters.filter(c => c.name !== victim.name);
    }
}

function handleSuzakuDeath(victim) {
    if (victim.name !== 'Suzaku') return false;

    const suzaku = inventory.find(c => c.name === 'Suzaku');
    if (!suzaku) return false;

    // Flip condition label
    if (suzaku.condition === 'Male') {
        suzaku.condition = 'Female';
        suzaku.src = 'img/portrait/special/Suzaku_fem.webp';
    } else if (suzaku.condition === 'Female') {
        suzaku.condition = 'Male';
        suzaku.src = 'img/portrait/Suzaku.webp';
    } else {
        // Default fallback
        suzaku.condition = 'Male';
        suzaku.src = 'img/portrait/Suzaku.webp';
    }
    updateInventory();
    return true;
}

function checkKatsuie(){
    document.querySelector('#roll-button button').disabled = true;
    currentChar = {
            name: 'Katsuie',
            image: 'img/fullbody/event/Katsuie.webp',
            options: { 'Yes (Very Dangerous)': true, 'No': true }
    };
    document.getElementById('eventMessage').textContent = "Do you want to go down the dark path?";
    forceKatsuie = false;
}

function checkBird(){
    document.querySelector('#roll-button button').disabled = true;
    currentChar = {
            name: 'Bird',
            image: 'img/fullbody/event/Bird.webp',
            options: { 'Buy Him a Beer': true, 'Bully Him': true }
    };
    document.getElementById('eventMessage').textContent = "Bird is looking angrily at you.";
    birdFlag = false;
    birdCountdown = 0;
}

function checkFeliss() {
    if (currentChar?.name !== 'Feliss') return;

    document.querySelector('#roll-button button').disabled = true;
    const riznaExists = inventory.some(c => c.name === 'Rizna');

    if (riznaExists) {
        currentChar.options = {
            'Turn Rizna into a Virgin': true,
            'I Want Money': true,
            'I Want You': true
        };
    }

    document.getElementById('eventMessage').textContent = "What do you wish for?";
}

function checkMiki() {
    if (!mikiBool && inventory.some(c => c.name === 'Miki') && !MikiRepeat
        && (currentChar.name !== 'Feliss' && currentChar.name !== 'Katsuie' && currentChar.name !== 'Bird')) {
        lemons--;
        logAction(`Miki eats a 🍋. You have ${lemons} left.`);

        if (lemons <= 0) {
            mikiBool = true;
            logAction(`Miki has eaten all the 🍋... something terrible is about to happen.`);
        }

    } else if (mikiBool && !MikiRepeat
        && (currentChar.name !== 'Feliss' && currentChar.name !== 'Katsuie' && currentChar.name !== 'Bird')) {

        const doomed = inventory.filter(c => !c.demon);
        doomed.forEach(c => {
            if (c.name === 'Suzaku') {
                handleSuzakuDeath(c); // Will flip gender and return true to block death
            } else if (c.name === 'Suzume') {
                processSuzumeDeath(); // Turns her into ghost
            } else {
                graveyard.push(c);
                logAction(`${c.name} turned into Little Princess!`);
            }
        });

        // Keep only demons and ghost Suzume (who has condition 'Dead' and name 'Suzume')
        inventory = inventory.filter(c => c.demon || (c.name === 'Suzume' && c.condition === 'Dead') || (c.name === 'Suzaku'));

        // Update Miki portrait
        inventory.forEach(c => {
            if (c.name === 'Miki') {
                c.src = `img/portrait/special/Miki_lp.webp`;
            }
        });

        updateInventory();
        mikiBool = false;
        MikiRepeat = true;
        return;
    }
}


function checkMili() {
    if (!miliDead && inventory.some(c => c.name === 'Mili')) {
        miliCount++;
        if (miliCount > 5) {
            const index = inventory.findIndex(c => c.name === 'Mili');
            if (index !== -1) {
                const deadMili = inventory.splice(index, 1)[0];
                graveyard.push(deadMili);
                logAction(`Mili died off-screen from Genfluenza.`);
                updateInventory();
                miliDead = true;
            }
        }
    }
}

function checkSuzume() {
    if (!suzumeDead && inventory.some(c => c.name === 'Suzume')) {
        suzumeCount++;
        if (suzumeCount > 5) {
            processSuzumeDeath(); // Triggers ghost transformation
        }
    }
}

function processSuzumeDeath() {
    const index = inventory.findIndex(c => c.name === 'Suzume' && c.condition !== 'Dead');
    if (index === -1) return;

    const suzume = inventory[index];

    // Save original condition and portrait for revival
    graveyard.push({ ...suzume });

    // Make her a ghost
    suzume.condition = 'Dead';
    suzume.src = 'img/portrait/special/Suzume_ghost.webp';
    suzume.demon = true; // Immune to other effects
    suzumeDead = true;

    // Push copy to graveyard for record-keeping
    graveyard.push({ ...suzume });

    logAction(`Suzume just died!`);
    updateInventory();
}

function checkTorakoKatsuko() {

    const hasTorako = inventory.some(c => c.name === 'Torako');
    const hasKatsuko = inventory.some(c => c.name === 'Katsuko');

    if (currentChar.name === 'Katsuko' && hasTorako) {
        currentChar.specialPrices = {
            'Brand New': 250,
            'Used':      200,
            'Damaged':   150
        };
        logAction(`You have Torako in your inventory. The price of this character is halved!`);
    } else if (currentChar.name === 'Katsuko' && !hasTorako){
        delete currentChar.specialPrices;
    }

    if (currentChar.name === 'Torako' && hasKatsuko) {
        currentChar.specialPrices = {
            'Brand New': 250,
            'Used':      200,
            'Damaged':   150
        }; 
        logAction(`You have Katsuko in your inventory. The price of this character is halved!`);
    } else if (currentChar.name === 'Torako' && !hasKatsuko){
        delete currentChar.specialPrices;
    }
}


function checkPapaya() {
    const papaya = inventory.find(c => c.name === 'Papaya' && c.condition === 'Damaged (Crazy)');
    if (!papaya) return;

    const roll = Math.floor(Math.random() * 6); // 0 to 5

    if (roll <= 2) {
        // Do nothing (50% chance)
        logAction(`Papaya twitched, but nothing happened...`);
        return;
    }

    // Get valid targets for chaos effects
    const targets = inventory.filter(c => c.name !== 'Papaya');

    if (roll === 3 && targets.length > 0) {
        // Try to kill a random character (except demons)
        const killable = targets.filter(c => !c.demon);
        if (killable.length === 0) {
            return;
        }

        const target = killable[Math.floor(Math.random() * killable.length)];

        // Handle Suzaku and Suzume death cases
        if (!handleSuzakuDeath(target)) {
            if (target.name === 'Suzume') {
                processSuzumeDeath(); // 👈 Corrected call
            } else {
                const index = inventory.indexOf(target);
                if (index !== -1) {
                    inventory.splice(index, 1);
                    graveyard.push(target);
                    logAction(`Papaya used ${target.name} for one of her experiments!`);
                }
            }
        }

    } else if (roll === 4 && targets.length > 0) {
        // Damage a random character
        const damageable = targets.filter(item => 
            item.condition?.includes('Used') ||
            item.condition?.includes('Brand New') ||
            item.condition === 'SEEN Goods'
        );

        if (damageable.length === 0) {
            return;
        }

        const item = damageable[Math.floor(Math.random() * damageable.length)];

        if (item.condition === 'Used (JC)') {
            item.condition = 'Damaged (JC)';
        } else if (item.condition === 'Brand New (Big Boobs)') {
            item.condition = 'Damaged (Big Boobs)';
        } else if (
            item.condition === 'Brand New' ||
            item.condition === 'Used' ||
            item.condition === 'SEEN Goods'
        ) {
            item.condition = 'Damaged';
        } else {
            return; // Safety fallback
        }

        logAction(`Papaya had a little fun with ${item.name}... now she’s Damaged.`);

    } else if (roll === 5) {
        // Give player 500 coins
        coins += 500;
        logAction(`Papaya giggled and threw 500G at you for no reason!`);
    }

    updateInventory();
    updateInfo?.(); // In case you use it to update coin count
}

function updateInfo() {
    document.getElementById('playerInfo').textContent = `${playerName} - ${coins}G`;
}

