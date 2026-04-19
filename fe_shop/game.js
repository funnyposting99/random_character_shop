// ===== CONFIG =====
const TOTAL_IMAGES = 237;
const START_COINS = 3000;
const ROLL_COST = 50;
const PRICES = { 'Brand New': 500, 'Used': 400, 'Damaged': 300 };

// Condition constraints by image ID
const CONDITION_CONSTRAINTS = {
    // Can't be Brand New
    1: ['Used', 'Damaged'],
    6: ['Used', 'Damaged'],
    8: ['Used', 'Damaged'],
    12: ['Used', 'Damaged'],
    25: ['Used', 'Damaged'],
    30: ['Used', 'Damaged'],
    39: ['Used', 'Damaged'],
    42: ['Used', 'Damaged'],
    44: ['Used', 'Damaged'],
    45: ['Used', 'Damaged'],
    47: ['Used', 'Damaged'],
    57: ['Used', 'Damaged'],
    60: ['Used', 'Damaged'],
    68: ['Used', 'Damaged'],
    79: ['Used', 'Damaged'],
    80: ['Used', 'Damaged'],
    81: ['Used', 'Damaged'],
    85: ['Used', 'Damaged'],
    88: ['Used', 'Damaged'],
    89: ['Used', 'Damaged'],
    93: ['Used', 'Damaged'],
    94: ['Used', 'Damaged'],
    101: ['Used', 'Damaged'],
    104: ['Used', 'Damaged'],
    109: ['Used', 'Damaged'],
    111: ['Used', 'Damaged'],
    119: ['Used', 'Damaged'],
    128: ['Used', 'Damaged'],
    134: ['Used', 'Damaged'],
    136: ['Used', 'Damaged'],
    142: ['Used', 'Damaged'],
    143: ['Used', 'Damaged'],
    152: ['Used', 'Damaged'],
    158: ['Used', 'Damaged'],
    165: ['Used', 'Damaged'],
    166: ['Used', 'Damaged'],
    180: ['Used', 'Damaged'],
    202: ['Used', 'Damaged'],
    208: ['Used', 'Damaged'],
    211: ['Used', 'Damaged'],
    222: ['Used', 'Damaged'],
    223: ['Used', 'Damaged'],
    232: ['Used', 'Damaged'],
    233: ['Used', 'Damaged'],
    // Can only be Damaged
    173: ['Damaged'],
    210: ['Damaged']
};

// ===== STATE =====
let playerName = localStorage.getItem('feShopPlayerName') || '';
let coins = START_COINS;
let inventory = [];
let crownedIndex = null;
let currentChar = null;

// Build character pool: one entry per image in fe/
let characters = [];
for (let i = 1; i <= TOTAL_IMAGES; i++) {
    const availableConditions = CONDITION_CONSTRAINTS[i] || ['Brand New', 'Used', 'Damaged'];
    characters.push({
        id: i,
        name: `Character #${i}`,
        image: `../fe/image (${i}).webp`,
        availableConditions: availableConditions
    });
}

// ===== START / NAME =====
function onStartClicked() {
    document.getElementById('startScreen').classList.remove('active');
    if (playerName) {
        startGame();
    } else {
        document.getElementById('nameScreen').classList.add('active');
    }
}

function saveName() {
    const input = document.getElementById('playerNameInput').value.trim();
    if (!input) return;
    playerName = input;
    localStorage.setItem('feShopPlayerName', playerName);
    startGame();
}

function startGame() {
    document.getElementById('nameScreen').classList.remove('active');
    document.getElementById('gameScreen').classList.add('active');
    updateInfo();
    reroll(true);
}

// ===== ROLLING =====
function reroll(free = false) {
    if (!free && coins < ROLL_COST) return;
    if (!free) coins -= ROLL_COST;

    // Pick a random character not already in inventory
    const owned = new Set(inventory.map(c => c.id));
    const available = characters.filter(c => !owned.has(c.id));

    if (available.length === 0) {
        triggerFinish();
        return;
    }

    currentChar = available[Math.floor(Math.random() * available.length)];
    document.getElementById('charImage').src = currentChar.image;

    renderOptions();
    updateInfo();
}

const BTN_COLOR = { 'Brand New': 'green-btn', 'Used': 'orange-btn', 'Damaged': 'red-btn' };
const LABEL_COLOR = { 'Brand New': 'green-label', 'Used': 'orange-label', 'Damaged': 'red-label' };

// ===== BUY BUTTONS =====
function renderOptions() {
    const btns = document.getElementById('buyButtons');
    btns.innerHTML = '';

    const entries = Object.entries(PRICES).reverse();

    for (const [label, price] of entries) {
        const btn = document.createElement('button');
        btn.textContent = `${label} — ${price}G`;
        btn.classList.add('btn', 'btn-buy', BTN_COLOR[label]);

        const isAvailable = currentChar.availableConditions.includes(label);
        const canAfford = coins >= price;

        if (isAvailable && canAfford) {
            btn.onclick = () => buyCharacter(label, price);
        } else {
            btn.disabled = true;
        }

        btns.appendChild(btn);
    }
}

// ===== PURCHASE =====
function buyCharacter(condition, price) {
    if (!currentChar || coins < price) return;
    coins -= price;

    // Generate portrait by cropping center-top square from fullbody via canvas
    const portraitDataUrl = createPortrait(currentChar.image, (dataUrl) => {
        inventory.push({
            id: currentChar.id,
            name: currentChar.name,
            src: dataUrl,
            condition: condition
        });
        updateInventory();
    });

    updateInfo();
    reroll(true);
}

/**
 * Loads the fullbody image and crops the center-top portion as a square.
 * Calls back with a data URL of the cropped portrait.
 */
function createPortrait(imageSrc, callback) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const size = Math.min(img.width, img.height * 0.5);
        const sx = (img.width - size) / 2;  // center horizontally
        const sy = 0;                         // top of image

        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, sx, sy, size, size, 0, 0, 150, 150);

        callback(canvas.toDataURL('image/webp', 0.85));
    };
    img.src = imageSrc;
}

// ===== INVENTORY =====
function updateInventory() {
    const inv = document.getElementById('inventory');
    inv.innerHTML = '';

    inventory.forEach((entry, index) => {
        const card = document.createElement('div');
        card.classList.add('inv-card');
        if (index === crownedIndex) card.classList.add('crowned');

        // Crown
        const crown = document.createElement('div');
        crown.classList.add('crown');
        crown.textContent = index === crownedIndex ? '👑' : '';

        // Portrait image
        const img = document.createElement('img');
        img.src = entry.src;
        img.alt = entry.name;

        // Label
        const label = document.createElement('div');
        label.classList.add('card-label');
        if (LABEL_COLOR[entry.condition]) label.classList.add(LABEL_COLOR[entry.condition]);
        label.textContent = entry.condition;

        // Click to crown
        card.onclick = () => {
            crownedIndex = crownedIndex === index ? null : index;
            updateInventory();
        };

        card.appendChild(crown);
        card.appendChild(img);
        card.appendChild(label);
        inv.appendChild(card);
    });
}

// ===== INFO BAR =====
function updateInfo() {
    document.getElementById('playerInfo').textContent = `${playerName} — ${coins}G`;
}

// ===== END GAME =====
function triggerFinish() {
    // Hide game, show end screen
    document.getElementById('gameScreen').classList.remove('active');
    document.getElementById('endScreen').classList.add('active');


    const endInv = document.getElementById('endInventory');
    endInv.innerHTML = '';
    inventory.forEach((entry, index) => {
        const card = document.createElement('div');
        card.classList.add('inv-card');
        if (index === crownedIndex) card.classList.add('crowned');

        const crown = document.createElement('div');
        crown.classList.add('crown');
        crown.textContent = index === crownedIndex ? '👑' : '';

        const img = document.createElement('img');
        img.src = entry.src;
        img.alt = entry.name;

        const label = document.createElement('div');
        label.classList.add('card-label');
        if (LABEL_COLOR[entry.condition]) label.classList.add(LABEL_COLOR[entry.condition]);
        label.textContent = entry.condition;

        // Click to crown
        card.onclick = () => {
            crownedIndex = crownedIndex === index ? null : index;
            triggerFinish();
        };

        card.appendChild(crown);
        card.appendChild(img);
        card.appendChild(label);
        endInv.appendChild(card);
    });
}
