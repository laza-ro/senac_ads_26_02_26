function atualizarTotalProdutos() {
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

function salvarCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarTotalProdutos();
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
    console.log("Script carregado e DOMContentLoaded disparado!");
    
    atualizarVisualizacaoCarrinho();
    atualizarTotalProdutos();

    // Adicionar eventos aos botões "Compre já!" (apenas se existirem)
    const botoesComprar = document.querySelectorAll('.btn-comprar');
    if (botoesComprar.length > 0) {
        botoesComprar.forEach(btn => {
            btn.addEventListener('click', function() {
                const nome = this.getAttribute('data-nome');
                const preco = this.getAttribute('data-preco');
                adicionarAoCarrinho(nome, preco);
            });
        });
        console.log("Listeners dos botões 'Compre já!' adicionados");
    }

    // Abrir modal ao clicar no botão do carrinho (apenas se existir)
    const btnCarrinho = document.getElementById('btn-carrinho');
    if (btnCarrinho) {
        btnCarrinho.addEventListener('click', function() {
            const modalElement = document.getElementById('modalCarrinho');
            if (modalElement) {
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        });
        console.log("Listener do botão carrinho adicionado");
    }

    // Carregar depoimentos (apenas se a div existir)
    if (typeof carregarDepoimentos === 'function' && document.getElementById('lista-depoimentos')) {
        carregarDepoimentos();
        console.log("Depoimentos carregados");
    }

    // Configurar formulário de contato (apenas se existir)
    const form = document.getElementById("formContato");
    if (form) {
        form.addEventListener("submit", enviarFormulario);
        console.log("Listener do formulário de contato adicionado!");
    } else {
        console.warn("Formulário de contato (formContato) não encontrado nesta página");
    }

    // Contador de caracteres do formulário (apenas se existir)
    const textarea = document.getElementById('mensagem');
    const currentCount = document.getElementById('current');
    if (textarea && currentCount) {
        textarea.addEventListener('input', function() {
            currentCount.textContent = this.value.length;
        });
        console.log("Contador de caracteres ativado");
    }
});


// Função assíncrona para carregar depoimentos
async function carregarDepoimentos() {
  try {
    // Busca dados da API
    const resposta = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=3");
    
    // Converte para JSON
    const dados = await resposta.json();

    // Seleciona a div onde os cards serão inseridos
    const lista = document.getElementById("lista-depoimentos");

    // Percorre os dados recebidos
    dados.forEach(depoimento => {
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

  } catch (erro) {
    console.error("Erro ao carregar depoimentos:", erro);
  }
}

// Função para injetar alertas Bootstrap na página
function mostrarAlerta(mensagem, tipo) {
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

// Validar campos do formulário
function validarFormulario(nome, email, mensagem) {
    console.log("Validando formulário...");
    
    if (!nome || nome.trim() === '') {
        console.log("Nome vazio");
        mostrarAlerta("Por favor, preencha o campo Nome.", "danger");
        return false;
    }
    
    if (!email || !email.includes('@')) {
        console.log("Email inválido:", email);
        mostrarAlerta("Por favor, preencha um email válido.", "danger");
        return false;
    }
    
    if (!mensagem || mensagem.trim() === '') {
        console.log("Mensagem vazia");
        mostrarAlerta("Por favor, escreva uma mensagem.", "danger");
        return false;
    }
    
    if (mensagem.length > 200) {
        console.log("Mensagem muito longa:", mensagem.length);
        mostrarAlerta("A mensagem não pode ter mais de 200 caracteres.", "danger");
        return false;
    }
    
    console.log("Validação OK!");
    return true;
}

async function enviarFormulario(event) {
  event.preventDefault();
  console.log("Formulário submetido!");

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const mensagem = document.getElementById("mensagem").value;
  
  console.log("Valores capturados:", { nome, email, mensagem });
  
  // Validar campos
  if (!validarFormulario(nome, email, mensagem)) {
    console.log("Validação falhou");
    return;
  }
  
  console.log("Validação passou!");
  
  // Agrupar dados em um objeto JavaScript
  const dados = {
    nome: nome,
    email: email,
    mensagem: mensagem
  };
  
  // Converter para JSON string
  const dadosJSON = JSON.stringify(dados);
  console.log("JSON enviado:", dadosJSON);
  
  try {
    // Enviar para JSONPlaceholder usando Fetch API
    console.log("Iniciando requisição fetch...");
    
    const resposta = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      body: dadosJSON
    });

    console.log("Resposta recebida. Status:", resposta.status);
    
    // Verificar resposta
    if (resposta.status === 201) {
      console.log("Sucesso! Status 201");
      mostrarAlerta("Mensagem enviada com sucesso! Obrigado pelo contato.", "success");
      
      // Limpar formulário
      const form = document.getElementById("formContato");
      if (form) {
        form.reset();
        console.log("Formulário resetado");
      }
      
      // Reset contador de caracteres
      const currentCount = document.getElementById('current');
      if (currentCount) {
        currentCount.textContent = '0';
      }
    } else {
      console.log("Erro! Status:", resposta.status);
      mostrarAlerta("Erro ao enviar a mensagem. Por favor, tente novamente.", "danger");
    }

  } catch (erro) {
    console.error("Erro na requisição:", erro);
    mostrarAlerta("Falha na comunicação com o servidor. Tente novamente mais tarde.", "danger");
  }
}