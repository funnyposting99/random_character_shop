function renderOptions() {
    const btns = document.getElementById('buyButtons');
    btns.innerHTML = '';

    const basePrices = {
        'Brand New': 500,
        'Brand New (JS)': 500,
        'Brand New (Big Boobs)': 600,
        'Used': 400,
        'Used (JC)': 400,
        'Damaged': 300,
        'Damaged (JD)': 300,
        'Broken': 200,
        'Male': 100,
        'Female': 400,
        'Futa': 300,
        'Damaged (Crazy)' : 300,
        'Buy Him a Beer' : 100,
        'Anatomically Correct' : 500,
        'Boobs Included' : 400,
        'Barbie Anatomy' : 300
    };

    for (let option in currentChar.options) {
        const isAvailable = currentChar.options[option];
        const special = currentChar.specialPrices?.[option];
        const price = special !== undefined ? special : (basePrices[option] || 0);

        const btn = document.createElement('button');
        btn.textContent = `${option} ${price}G`;

        // Add common button class
        btn.classList.add('btn');

        // background coding based on label
if (option.includes('Brand New') || option === 'SEEN Goods') {
    btn.classList.add('green-btn');
} else if (option.includes('Used')) {
    btn.classList.add('orange-btn');
} else if (option.includes('Damaged') || option === 'A Million Dead Ants') {
    btn.classList.add('red-btn');
} else if (option === 'Male') {
    btn.classList.add('blue-btn');
} else if (option === 'Female') {
    btn.classList.add('pink-btn');
} else if (option === 'Futa') {
    btn.classList.add('purple-btn');
} else if (option === 'Ice') {
    btn.classList.add('cyan-btn');
} else {
    btn.classList.add('black-btn');
}

        // Attach action or disable
        if (isAvailable) {
            if (currentChar.name !== 'Elizabeth') {
                btn.onclick = () => buyCharacter(option, price);
            }
        } else {
            btn.disabled = true;
        }

        btns.appendChild(btn);
    }
}
