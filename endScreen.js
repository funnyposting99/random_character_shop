function triggerFinish() {
    let numMonsters = 0;
    if (coins > 0 && coins <= 150) numMonsters = 1;
    if (coins > 150) numMonsters = 2;

    // Check for bonus rolls from specific characters
    const bonusRollers = ['Wenlina', 'Housenurse', 'Bezeleye', 'Serachrolas'];
    bonusRollers.forEach(name => {
        if (inventory.some(c => c.name === name)) {
            numMonsters++;
        }
    });

    // Award monster gals
    for (let i = 0; i < numMonsters; i++) {
        const remainingGals = monsterGals.filter(m => !inventory.some(item => item.name === m.name));
        if (remainingGals.length === 0) break;

        const chosen = remainingGals[Math.floor(Math.random() * remainingGals.length)];
        inventory.push({ name: chosen.name, src: chosen.portrait, condition: 'Gal Monster', demon: false });

        // Remove from the pool to avoid duplicates
        const index = monsterGals.findIndex(m => m.name === chosen.name);
        if (index !== -1) monsterGals.splice(index, 1);
    }

    updateInventory();

    // Hide unnecessary UI elements
    document.getElementById('charImage').style.display = 'none';
    
    document.getElementById('eventMessage').style.display = 'Game is Over';
    document.getElementById('finish-button').style.display = 'none';
    document.getElementById('buyButtons').style.display = 'none';
    document.getElementById('playerInfo').style.display = 'none';
    document.getElementById('roll-button').style.display = 'none';


}