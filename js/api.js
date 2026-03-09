// ========== API.JS - Comunicação com servidores ==========
// Este arquivo contém todas as funções relacionadas a requisições HTTP (fetch)

// Validar campos do formulário
export function validarFormulario(nome, email, mensagem) {
    console.log("Validando formulário...");
    
    if (!nome || nome.trim() === '') {
        console.log("Nome vazio");
        return { valido: false, mensagem: "Por favor, preencha o campo Nome." };
    }
    
    if (!email || !email.includes('@')) {
        console.log("Email inválido:", email);
        return { valido: false, mensagem: "Por favor, preencha um email válido." };
    }
    
    if (!mensagem || mensagem.trim() === '') {
        console.log("Mensagem vazia");
        return { valido: false, mensagem: "Por favor, escreva uma mensagem." };
    }
    
    if (mensagem.length > 200) {
        console.log("Mensagem muito longa:", mensagem.length);
        return { valido: false, mensagem: "A mensagem não pode ter mais de 200 caracteres." };
    }
    
    console.log("Validação OK!");
    return { valido: true, mensagem: "" };
}

// Função assíncrona para carregar depoimentos
export async function carregarDepoimentos() {
    try {
        // Busca dados da API
        const resposta = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=3");
        
        // Converte para JSON
        const dados = await resposta.json();
        
        console.log("Depoimentos carregados com sucesso:", dados);
        return dados;

    } catch (erro) {
        console.error("Erro ao carregar depoimentos:", erro);
        throw erro;
    }
}

// Função para enviar formulário
export async function enviarFormulario(nome, email, mensagem) {
    console.log("Iniciando envio de formulário...");
    
    // Validar antes de enviar
    const validacao = validarFormulario(nome, email, mensagem);
    if (!validacao.valido) {
        throw new Error(validacao.mensagem);
    }
    
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
            return { sucesso: true, messagem: "Mensagem enviada com sucesso! Obrigado pelo contato." };
        } else {
            console.log("Erro! Status:", resposta.status);
            throw new Error("Erro ao enviar a mensagem. Tente novamente.");
        }

    } catch (erro) {
        console.error("Erro na requisição:", erro);
        throw new Error("Falha na comunicação com o servidor. Tente novamente mais tarde.");
    }
}
