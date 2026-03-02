function calcularTotal() {
    const checkboxes = document.querySelectorAll('.item-produto');
    const quantidades = document.querySelectorAll('.qtd-produto');

    let total = 0;

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            const preco = parseFloat(checkbox.value);
            const qtd = parseInt(quantidades[index].value);
            total += preco * qtd;
        }
    });

    document.getElementById('valor-total').textContent =
        total.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}

document.querySelectorAll('.item-produto, .qtd-produto')
    .forEach(element => {
        element.addEventListener('change', calcularTotal);
    });