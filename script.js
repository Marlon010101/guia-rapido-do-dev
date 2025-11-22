const cardContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("#campo-busca");
const filterControls = document.querySelector(".filter-controls");
 
let todosOsDados = [];
let filtroAtual = "Todos"; // Estado inicial do filtro de categoria
 
// 1. Carrega os dados do JSON assim que a página é carregada.
window.addEventListener('load', async () => {
    try {
        // Usa fetch para carregar o arquivo data.json
        const resposta = await fetch("data.json");
        todosOsDados = await resposta.json();
        aplicarFiltros(); // Renderiza todos os cards inicialmente
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        // Mensagem amigável de erro
        cardContainer.innerHTML = "<p style='text-align: center; color: #dc3545;'>Não foi possível carregar o Guia. Verifique o arquivo data.json.</p>";
    }
});

// 2. Adiciona listeners para busca de texto (evento 'input') e botões de filtro.
campoBusca.addEventListener('input', aplicarFiltros);

// Listener para a seção de botões de filtro
filterControls.addEventListener('click', (e) => {
    // Verifica se o elemento clicado é um botão de filtro
    if (e.target.classList.contains('filter-btn')) {
        
        // A. Remove a classe 'active' de todos os botões para desmarcá-los
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        
        // B. Adiciona a classe 'active' ao botão clicado para destacá-lo
        e.target.classList.add('active');
        
        // C. Atualiza o estado do filtro atual com o valor do atributo 'data-filter'
        filtroAtual = e.target.dataset.filter;
        
        // D. Aplica os filtros combinados (texto + categoria)
        aplicarFiltros();
    }
});
 
// Função principal que combina a busca de texto e o filtro de categoria.
function aplicarFiltros() {
    const termoBuscado = campoBusca.value.toLowerCase().trim();
 
    let resultados = todosOsDados;

    // 1. FILTRO DE CATEGORIA: Se não for 'Todos', filtra pelos dados da categoria selecionada.
    if (filtroAtual !== "Todos") {
        resultados = resultados.filter(dado => dado.categoria === filtroAtual);
    }

    // 2. FILTRO DE BUSCA POR TEXTO: Filtra os resultados restantes pelo termo digitado (se houver).
    if (termoBuscado !== "") {
        resultados = resultados.filter(dado => 
            dado.nome.toLowerCase().includes(termoBuscado) || 
            dado.descricao.toLowerCase().includes(termoBuscado)
        );
    }
 
    renderizaCards(resultados);
}
 
// Função que renderiza os cards na tela
function renderizaCards(dados) {
    cardContainer.innerHTML = ""; // Limpa os cards antigos
 
    if (dados.length === 0) {
        // Mensagem caso não encontre resultados
        cardContainer.innerHTML = `<p style="text-align: center; margin-top: 3rem; color: var(--tertiary-color);">Nenhum conceito encontrado para os filtros aplicados. Tente buscar algo como 'DOM' ou 'CSS'.</p>`;
        return;
    }

    dados.forEach(dado => {
        const article = document.createElement("article");
        // Cria a estrutura HTML do card, incluindo os metadados
        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p>${dado.descricao}</p>
            <div class="metadata">
                <span class="category-${dado.categoria}">${dado.categoria}</span>
                <span class="level-${dado.nivel}">${dado.nivel}</span>
            </div>
            <a href="${dado.Link}" target="_blank">Leia a referência técnica...</a>
        `;
        cardContainer.appendChild(article);
    });
}