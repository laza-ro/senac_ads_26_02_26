// Funções para gerenciar localStorage do carrinho
function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

function atualizarVisualizacaoCarrinho() {
    const carrinho = carregarCarrinho();
    const containerItens = document.getElementById('itens-carrinho');
    const btnQtd = document.getElementById('qtd-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    // Atualizar quantidade de itens no botão
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    btnQtd.textContent = totalItens;

    // Se carrinho vazio
    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p class="text-center text-muted">O carrinho está vazio</p>';
        totalCarrinho.textContent = '0,00';
        return;
    }

    // Montar HTML dos itens
    let html = '<table class="table">';
    html += '<thead><tr><th>Produto</th><th>Preco</th><th>Qtd</th><th>Subtotal</th><th></th></tr></thead>';
    html += '<tbody>';

    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = parseFloat(item.preco) * item.quantidade;
        total += subtotal;

        html += `<tr>
            <td>${item.nome}</td>
            <td>R$ ${parseFloat(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><input type="number" class="form-control" style="width: 60px;" value="${item.quantidade}" min="1" data-index="${index}" class="input-qtd-carrinho"></td>
            <td>R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            <td><button class="btn btn-danger btn-sm btn-remover" data-index="${index}">Remover</button></td>
        </tr>`;
    });

    html += '</tbody></table>';
    containerItens.innerHTML = html;

    // Atualizar total
    totalCarrinho.textContent = total.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // Adicionar listeners aos inputs de quantidade
    document.querySelectorAll('.input-qtd-carrinho').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const novaQtd = parseInt(this.value);

            if (novaQtd > 0) {
                carrinho[index].quantidade = novaQtd;
            } else {
                this.value = carrinho[index].quantidade;
            }

            salvarCarrinho(carrinho);
            atualizarVisualizacaoCarrinho();
        });
    });

    // Adicionar listeners aos botões de remover
    document.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            carrinho.splice(index, 1);
            salvarCarrinho(carrinho);
            atualizarVisualizacaoCarrinho();
        });
    });
}

function adicionarAoCarrinho(nome, preco) {
    const carrinho = carregarCarrinho();
    const precoNum = parseFloat(preco);

    // Verificar se produto já existe no carrinho
    const produtoExistente = carrinho.find(item => item.nome === nome);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    salvarCarrinho(carrinho);
    atualizarVisualizacaoCarrinho();
}

// Carregar carrinho ao iniciar a página
document.addEventListener('DOMContentLoaded', function() {
    atualizarVisualizacaoCarrinho();

    // Adicionar eventos aos botões "Compre já!"
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function() {
            const nome = this.getAttribute('data-nome');
            const preco = this.getAttribute('data-preco');
            adicionarAoCarrinho(nome, preco);
        });
    });

    // Abrir modal ao clicar no botão do carrinho
    const btnCarrinho = document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        btnCarrinho.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('modalCarrinho'));
            modal.show();
        });
    }
});