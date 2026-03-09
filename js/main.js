// ========== MAIN.JS - Arquivo Principal ==========
// Este arquivo centraliza os imports e gerencia todos os event listeners

// Importar funções de API
import { validarFormulario, carregarDepoimentos, enviarFormulario } from './api.js';

// Importar funções de UI
import { 
    mostrarAlerta, 
    atualizarTotalProdutos, 
    atualizarVisualizacaoCarrinho, 
    adicionarAoCarrinho,
    renderizarDepoimentos 
} from './ui.js';

// ========== EVENT LISTENERS ==========

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
    if (document.getElementById('lista-depoimentos')) {
        carregarDepoimentos()
            .then(depoimentos => {
                renderizarDepoimentos(depoimentos);
                console.log("Depoimentos carregados e renderizados");
            })
            .catch(erro => {
                console.error("Erro ao carregar depoimentos:", erro);
                mostrarAlerta("Erro ao carregar depoimentos. Tente recarregar a página.", "danger");
            });
    }

    // Configurar formulário de contato (apenas se existir)
    const form = document.getElementById("formContato");
    if (form) {
        form.addEventListener("submit", async function(event) {
            event.preventDefault();
            console.log("Formulário submetido!");

            const nome = document.getElementById("nome").value;
            const email = document.getElementById("email").value;
            const mensagem = document.getElementById("mensagem").value;
            
            console.log("Valores capturados:", { nome, email, mensagem });
            
            try {
                // Enviar para o servidor
                await enviarFormulario(nome, email, mensagem);
                
                // Se chegou aqui, foi sucesso
                mostrarAlerta("Mensagem enviada com sucesso! Obrigado pelo contato.", "success");
                
                // Limpar formulário
                form.reset();
                console.log("Formulário resetado");
                
                // Reset contador de caracteres
                const currentCount = document.getElementById('current');
                if (currentCount) {
                    currentCount.textContent = '0';
                }
                
            } catch (erro) {
                console.error("Erro:", erro.message);
                mostrarAlerta(erro.message, "danger");
            }
        });
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
