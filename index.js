(async () => {
    const tovar = document.querySelectorAll('.products');
    const basket = document.querySelector('#cart');
    const k_price = await fetch('https://kodaktor.ru/cart_data.json').then(x => x.text());
    const prices = JSON.parse(k_price);

    tovar.forEach(element => {
        element.setAttribute('draggable', true);                                                                                                                               
        element.addEventListener('dragstart', el => el.dataTransfer.setData('text/plain', el.target.id));
        const price = document.createElement('p');
        price.setAttribute('class', 'price');
        price.appendChild(document.createTextNode(prices[element.id] + '$'));
        element.appendChild(price);
    });

    let budget = 500;
    const budget_label = document.createElement('label');
    budget_label.setAttribute('class', 'stats');
    budget_label.appendChild(document.createTextNode(`Баланс: ${budget}$`));

    let tovar_price = 0;
    const p_price_label = document.createElement('label');
    p_price_label.setAttribute('class', 'stats');
    p_price_label.appendChild(document.createTextNode(`К оплате ${tovar_price}$`));

    let products_amount = 0;
    const am_label = document.createElement('label');
    am_label.setAttribute('class', 'stats');
    am_label.appendChild(document.createTextNode(`Количество товаров: ${products_amount}`));
    
    basket.addEventListener('dragover', e => e.preventDefault());
    basket.addEventListener('drop', (e) => {
        const dragging_element = document.getElementById(e.dataTransfer.getData('text/plain')).cloneNode(true);        
        const price = Number(dragging_element.lastChild.textContent.slice(0, -1));
        if (budget >= 0 && price <= budget) {
            tovar_price += price;
            products_amount += 1;
            budget -= price;
            p_price_label.firstChild.textContent = `К оплате ${tovar_price}$`;
            am_label.firstChild.textContent = `Количество товаров: ${products_amount}`;
            budget_label.firstChild.textContent = `Баланс: ${budget}$`;
            e.target.appendChild(dragging_element);
        } else {
            alert('Недостаточно средств')
        }
    });

    const remove_button = document.createElement('button');
    remove_button.appendChild(document.createTextNode('Очистить корзину'));
    remove_button.id = 'remove_button'
    remove_button.setAttribute('class', 'stats');
    remove_button.onclick = () => {
        while (basket.firstChild) {
            basket.removeChild(basket.firstChild);
        };
        budget = 500;
        products_amount = 0;
        tovar_price = 0;
        p_price_label.firstChild.textContent = `К оплате ${tovar_price}$`;
        budget_label.firstChild.textContent = `Баланс: ${budget}$`;
        am_label.firstChild.textContent = `Количество товаров: ${products_amount}`;
    };

    const stats = document.createElement('div');
    stats.appendChild(budget_label);
    stats.appendChild(p_price_label);
    stats.appendChild(am_label);
    stats.appendChild(remove_button);
    document.getElementById('cart_section').prepend(stats);
})();