function updateInventory() {
    const inv = document.getElementById('inventory');
    inv.innerHTML = '';
    inventory.forEach((entry, index) => {
        const container = document.createElement('div');
        container.style.display = 'inline-block';
        container.style.position = 'relative';
        container.style.margin = '5px';
        container.style.cursor = 'pointer';
        container.style.textAlign = 'center';

        // Handle crown
        const crown = document.createElement('div');
        crown.textContent = (index === crownedIndex) ? '👑' : '';
        crown.style.position = 'absolute';
        crown.style.top = '-5px';
        crown.style.left = '50%';
        crown.style.transform = 'translateX(-50%)';
        crown.style.fontSize = '200%';
        crown.style.zIndex = '1';

        const img = document.createElement('img');
        img.src = entry.src;
        img.width = 50;
        img.classList.add('portrait-img');

        const label = document.createElement('div');
        label.textContent = entry.condition;
        label.style.fontSize = '12px';

        // Set label color based on condition
        if ((entry.condition.includes('Brand New')) || entry.condition === 'SEEN Goods' ) {
          label.style.color = 'green';
        } else if (entry.condition.includes('Used')) {
          label.style.color = 'orange'; 
        } else if ((entry.condition.includes('Damaged')) || entry.condition === 'A Million Dead Ants') {
          label.style.color = 'red';
        } else if (entry.condition === 'Male') {
          label.style.color = 'blue';
        } else if (entry.condition === 'Female') {
          label.style.color = 'pink';
        } else if (entry.condition === 'Futa') {
          label.style.color = 'purple';
        } else if (entry.condition === 'Ice') {
          label.style.color = 'cyan';
        }else {
          label.style.color = 'black';
        }
        label.style.fontWeight = 'bold';
        label.style.textShadow = '1px 1px 2px black';

        // Click handler to set crown
        container.onclick = () => {
            crownedIndex = (crownedIndex === index) ? null : index;
            updateInventory(); // Re-render to show crown
        };

        container.appendChild(crown);
        container.appendChild(img);
        container.appendChild(label);
        inv.appendChild(container);
    });
}