/**
 * modelo_menu.js
 * Funcionalidades para o menu de navegação RobôMestres
 * - Destaca o link ativo com base na página atual
 * - Mantém consistência visual entre as páginas
 */

// Aguarda o DOM estar completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  // Obtém o nome do arquivo atual a partir da URL
  var caminho = window.location.pathname;
  var paginaAtual = caminho.substring(caminho.lastIndexOf("/") + 1);

  // Se a URL terminar com barra ou estiver vazia, assume index.html
  if (paginaAtual === "" || paginaAtual === "/") {
    paginaAtual = "index.html";
  }

  // Mapeia os arquivos para os seletores dos links
  var mapaPaginas = {
    "index.html": 'a[href="#principal"], a[data-ano="principal"]',
    "a1index.html": 'a[href="#ano1"], a[data-ano="1"]',
    "a2index.html": 'a[href="#ano2"], a[data-ano="2"]',
    "a3index.html": 'a[href="#ano3"], a[data-ano="3"]',
    "a4index.html": 'a[href="#ano4"], a[data-ano="4"]',
    "a5index.html": 'a[href="#ano5"], a[data-ano="5"]',
  };

  // Remove a classe 'active' de todos os links
  var todosLinks = document.querySelectorAll(".menu-robomestre .nav-link");
  todosLinks.forEach(function (link) {
    link.classList.remove("active");
  });

  // Adiciona a classe 'active' ao link correspondente à página atual
  var seletor = mapaPaginas[paginaAtual];
  if (seletor) {
    var linkAtivo = document.querySelector(seletor);
    if (linkAtivo) {
      linkAtivo.classList.add("active");
    }
  } else {
    // Fallback: tenta encontrar pelo href exato
    var linkPorHref = document.querySelector(
      '.menu-robomestre .nav-link[href="' + paginaAtual + '"]',
    );
    if (linkPorHref) {
      linkPorHref.classList.add("active");
    }
  }

  // (Opcional) Fechar o menu mobile ao clicar em um link (para melhor usabilidade)
  var navbarToggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    var linksMenu = document.querySelectorAll(".menu-robomestre .nav-link");
    linksMenu.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navbarCollapse.classList.contains("show")) {
          navbarToggler.click();
        }
      });
    });
  }
});
