/**
 * modelo_menu_bim.js – Script leve para o menu bimestral
 * Define a classe 'active' no link da página atual e garante interações básicas.
 * Como não foram fornecidos arquivos JS originais, este script é auto-suficiente
 * e não gera erros no console.
 */

(function () {
  "use strict";

  // Marca o link do menu correspondente à página atual como 'active'
  function highlightCurrentPage() {
    const currentPath =
      window.location.pathname.split("/").pop() || "a1index.html";
    const navLinks = document.querySelectorAll(".menu-robomestre .nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Pequeno efeito de boas-vindas no console (apenas para debug)
  function consoleWelcome() {
    console.log(
      "%c🤖 ROBOZADA 3000 - MENU BIMESTRAL ATIVO",
      "color: #ffb347; font-size: 14px; font-family: monospace;",
    );
    console.log(
      "%c🔁 Loop não é macarrão! Variável não é coisa de velho! Depurar não é xingamento!",
      "color: #9bbc7b;",
    );
  }

  // Adiciona tooltips simples nos ícones do rodapé (opcional)
  function initTooltips() {
    const devEmails = document.querySelectorAll(".dev-contato a");
    if (devEmails.length) {
      devEmails.forEach((email) => {
        email.setAttribute("title", "Clique para enviar e-mail");
        email.style.cursor = "pointer";
      });
    }
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      highlightCurrentPage();
      consoleWelcome();
      initTooltips();
    });
  } else {
    highlightCurrentPage();
    consoleWelcome();
    initTooltips();
  }
})();
