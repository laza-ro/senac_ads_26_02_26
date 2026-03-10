// ========== UI.JS - Manipulação do DOM ==========
// Este arquivo contém todas as funções relacionadas a renderização e interação com o DOM

// ========== FUNÇÕES UTILITÁRIAS DE CARRINHO ==========

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarTotalProdutos();
}

function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
}

// ========== EXIBIÇÃO DE ALERTAS ==========

// Função para injetar alertas Bootstrap na página
export function mostrarAlerta(mensagem, tipo) {
    const alertaId = 'alerta-' + Date.now();
    const classes = tipo === 'success' ? 'alert-success' : 'alert-danger';
    
    const alertaHTML = `
        <div id="${alertaId}" class="alert ${classes} alert-dismissible fade show" role="alert" style="margin-top: 20px;">
            <strong>${tipo === 'success' ? '✓ Sucesso!' : '✗ Erro!'}</strong> ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    console.log("Exibindo alerta:", tipo, mensagem);
    
    // Inserir o alerta ANTES do formulário
    const form = document.getElementById("formContato");
    if (form) {
        form.insertAdjacentHTML('beforebegin', alertaHTML);
        console.log("Alerta inserido com sucesso");
    } else {
        console.error("Formulário não encontrado");
        // Se não encontrar formulário, inserir no body
        document.body.insertAdjacentHTML('afterbegin', alertaHTML);
    }
    
    // Remover alerta automaticamente após 5 segundos
    setTimeout(() => {
        const alerta = document.getElementById(alertaId);
        if (alerta) {
            alerta.remove();
            console.log("Alerta removido");
        }
    }, 5000);
}

// ========== CARRINHO DE COMPRAS ==========

export function atualizarTotalProdutos() {
    const carrinho = carregarCarrinho();
    const totalProdutos = carrinho.reduce((acc, item) => acc + (parseFloat(item.preco) * item.quantidade), 0);
    const elementoTotal = document.getElementById('valor-total');
    
    if (elementoTotal) {
        elementoTotal.textContent = totalProdutos.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

export function atualizarVisualizacaoCarrinho() {
    const carrinho = carregarCarrinho();
    const containerItens = document.getElementById('itens-carrinho');
    const btnQtd = document.getElementById('qtd-carrinho');
    const totalCarrinho = document.getElementById('total-carrinho');

    // Se os elementos não existem na página, não fazer nada
    if (!containerItens || !btnQtd || !totalCarrinho) {
        console.log("Elementos do carrinho não encontrados nesta página");
        return;
    }

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

export function adicionarAoCarrinho(nome, preco) {
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

// ========== RENDERIZAÇÃO DE CARDS DE DEPOIMENTOS ==========

export function renderizarDepoimentos(depoimentos) {
    const lista = document.getElementById("lista-depoimentos");
    
    if (!lista) {
        console.log("Elemento lista-depoimentos não encontrado");
        return;
    }

    depoimentos.forEach(depoimento => {
        // Cria o card Bootstrap usando template string
        const card = `
            <div class="col-md-4 mb-3">
                <div class="card h-100 shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${depoimento.name}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${depoimento.email}</h6>
                        <p class="card-text">${depoimento.body}</p>
                    </div>
                </div>
            </div>
        `;

        // Insere o card na div
        lista.innerHTML += card;
    });
}

// ========== MODAL DE DETALHES DO PRODUTO ==========

export function configurarModalDetalhes() {
    const modalDetalhes = document.getElementById('modalDetalhes');
    
    if (!modalDetalhes) {
        console.log("Modal de detalhes não encontrado na página");
        return;
    }
    
    // Event listener para quando o modal está sendo mostrado
    modalDetalhes.addEventListener('show.bs.modal', function (event) {
        // Botão que acionou o modal
        const botao = event.relatedTarget;
        
        if (!botao) {
            console.log("Botão que acionou o modal não encontrado");
            return;
        }
        
        // Lê os data attributes do botão
        const nome = botao.getAttribute('data-nome') || 'Produto';
        const descricao = botao.getAttribute('data-descricao') || 'Sem descrição';
        const preco = botao.getAttribute('data-preco') || '0.00';
        
        console.log("Modal aberto para:", { nome, descricao, preco });
        
        // Atualiza o título do modal
        const titulo = modalDetalhes.querySelector('#modalDetalhesLabel');
        if (titulo) {
            titulo.textContent = nome;
        }
        
        // Atualiza o corpo do modal
        const corpo = modalDetalhes.querySelector('#modalDetalhesBody');
        if (corpo) {
            corpo.innerHTML = `
                <p><strong>Descrição:</strong> ${descricao}</p>
                <p><strong>Preço:</strong> R$ ${parseFloat(preco).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })}</p>
            `;
        }
        
        // Armazena os dados do produto no botão "Adicionar ao Carrinho" para um possível próximo passo
        const btnAdicionar = modalDetalhes.querySelector('.btn-adicionar-carrinho');
        if (btnAdicionar) {
            btnAdicionar.setAttribute('data-nome', nome);
            btnAdicionar.setAttribute('data-preco', preco);
        }
    });
}
