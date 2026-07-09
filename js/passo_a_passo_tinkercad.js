// ==================================================
// passo_a_passo_tinkercad.js - LÓGICA COMPLETA
// Unificação do cabeçalho, menu e rodapé
// ==================================================

// ==================================================
// modelo_cabecalho.js - LÓGICA DO CABEÇALHO REBELDE
// ==================================================

(function () {
  "use strict";

  const CabecalhoModule = {
    // Estado
    contadorBugs: 0,
    inicializado: false,

    // Elementos DOM
    contadorElement: null,
    relatorioElement: null,

    /**
     * Inicializa o módulo do cabeçalho
     */
    init() {
      if (this.inicializado) return;

      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.contadorElement) {
        // Inicializa contador com valor salvo ou 0
        this.contadorBugs = this.carregarContador();
        this.atualizarDisplayContador();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log(
        "%c🤖 [CABEÇALHO] Módulo inicializado com sucesso",
        "color: #ffb347; font-size: 12px; font-weight: bold;",
      );
    },

    /**
     * Carrega o contador do localStorage
     */
    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    /**
     * Salva o contador no localStorage
     */
    salvarContador() {
      try {
        localStorage.setItem(
          "cabecalho_contador_bugs",
          this.contadorBugs.toString(),
        );
      } catch (e) {
        console.warn("[CABEÇALHO] Não foi possível salvar o contador", e);
      }
    },

    /**
     * Atualiza o display do contador na tela
     */
    atualizarDisplayContador() {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      }
      if (this.relatorioElement) {
        this.relatorioElement.innerText = this.contadorBugs;
      }
    },

    /**
     * Incrementa o contador de bugs
     * @param {number} incremento - Quantidade a incrementar (padrão: 1)
     */
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarContador();
      return this.contadorBugs;
    },

    /**
     * Reseta o contador de bugs para 0
     */
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarReset();
      return this.contadorBugs;
    },

    /**
     * Obtém o valor atual do contador
     */
    getContadorBugs() {
      return this.contadorBugs;
    },

    /**
     * Anima o contador quando incrementado
     */
    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(() => {
          if (this.contadorElement) {
            this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
            setTimeout(() => {
              if (this.contadorElement) {
                this.contadorElement.style.animation = "";
              }
            }, 300);
          }
        }, 10);
      }
    },

    /**
     * Anima o reset do contador
     */
    animarReset() {
      const painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (painel) painel.style.animation = "";
        }, 300);
      }
    },

    /**
     * Atualiza a mensagem da linha de erro
     * @param {string} mensagem - Nova mensagem a exibir
     */
    atualizarMensagemErro(mensagem) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        linhaErro.innerHTML = `<i class="bi bi-terminal"></i> ${mensagem}`;
        // Anima a mensagem nova
        linhaErro.style.animation = "piscaLed 0.2s ease-in-out";
        setTimeout(() => {
          if (linhaErro) linhaErro.style.animation = "";
        }, 400);
      }
    },

    /**
     * Adiciona uma mensagem temporária no log de debug
     * @param {string} texto - Mensagem a adicionar
     */
    adicionarLogDebug(texto) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        const htmlAtual = linhaErro.innerHTML;
        linhaErro.innerHTML = `${htmlAtual}<br><span style="font-size:0.65rem; opacity:0.7;">[DEBUG] ${texto}</span>`;
        // Scroll suave para o final
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    /**
     * Configura os eventos globais que o cabeçalho escuta
     */
    configurarEventos() {
      // Escuta evento de bug vindo de outros módulos (ex: jogo)
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
        if (evento.detail?.mensagem) {
          this.adicionarLogDebug(evento.detail.mensagem);
        }
      });

      // Escuta evento de reset do jogo para resetar contador (opcional)
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
        this.atualizarMensagemErro(
          "[SISTEMA] Contador de bugs reiniciado! Preparem-se para novos erros! 🤖",
        );
      });

      // Escuta evento de vitória (mensagem diferente)
      document.addEventListener("robo:vitoria", () => {
        this.adicionarLogDebug(
          "🎉 Vitória registrada! Parabéns programadores!",
        );
      });
    },

    /**
     * Adiciona um efeito visual de curto-circuito no cabeçalho
     */
    efeitoCurtoCircuito() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },

    /**
     * Adiciona efeito de reboot no cabeçalho
     */
    efeitoReboot() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "reboot 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },
  };

  // Registrar no ControladorRobomestres se existir
  if (
    typeof window.ControladorRobomestres !== "undefined" &&
    window.ControladorRobomestres
  ) {
    window.ControladorRobomestres.registrar("CabecalhoModule", CabecalhoModule);
  }

  // Fallback: expõe globalmente
  window.CabecalhoModule = CabecalhoModule;

  // Auto-inicializa se o controlador não existir
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        CabecalhoModule.init(),
      );
    } else {
      CabecalhoModule.init();
    }
  }
})();

// ==================================================
// modelo_menu.js - FUNCIONALIDADES DO MENU
// ==================================================

(function () {
  "use strict";

  /**
   * Inicializa o menu de navegação
   */
  function initMenu() {
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
      "passo_a_passo_tinkercad.html": 'a[href="passo_a_passo_tinkercad.html"]',
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
  }

  // Inicializa o menu quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMenu);
  } else {
    initMenu();
  }
})();

// ==================================================
// modelo_rodape.js - LÓGICA DO RODAPÉ REBELDE
// ==================================================

(function () {
  "use strict";

  const RodapeModule = {
    // Estado
    inicializado: false,

    // Elementos DOM
    relatorioElement: null,

    /**
     * Inicializa o módulo do rodapé
     */
    init() {
      if (this.inicializado) return;

      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log(
        "%c🤖 [RODAPÉ] Módulo inicializado com sucesso",
        "color: #ffb347; font-size: 12px; font-weight: bold;",
      );
    },

    /**
     * Atualiza o relatório de bugs com o valor atual do contador
     */
    atualizarRelatorio() {
      if (!this.relatorioElement) return;

      // Tenta obter o contador do módulo de cabeçalho
      let contadorBugs = 0;

      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      ) {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
        // Fallback: tenta ler do localStorage
        try {
          const salvo = localStorage.getItem("cabecalho_contador_bugs");
          contadorBugs = salvo ? parseInt(salvo) : 0;
        } catch (e) {
          contadorBugs = 0;
        }
      }

      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    /**
     * Anima a atualização do contador no rodapé
     */
    animarAtualizacao() {
      if (this.relatorioElement) {
        this.relatorioElement.classList.add("atualizando");
        setTimeout(() => {
          if (this.relatorioElement) {
            this.relatorioElement.classList.remove("atualizando");
          }
        }, 300);
      }
    },

    /**
     * Configura os eventos globais que o rodapé escuta
     */
    configurarEventos() {
      // Escuta evento de bug vindo de outros módulos
      document.addEventListener("robo:bug", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de reset do contador
      document.addEventListener("robo:resetBugs", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de atualização do cabeçalho
      document.addEventListener("cabecalho:contador_atualizado", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de vitória (apenas para log)
      document.addEventListener("robo:vitoria", () => {
        if (this.relatorioElement) {
          // Pisca o contador em verde para indicar sucesso
          const corOriginal = this.relatorioElement.style.color;
          this.relatorioElement.style.color = "#2ecc71";
          setTimeout(() => {
            if (this.relatorioElement) {
              this.relatorioElement.style.color = "";
            }
          }, 500);
        }
      });

      // Se o controlador estiver disponível, escuta seu evento de pronto
      if (window.ControladorRobomestres) {
        window.addEventListener("controlador:pronto", () => {
          this.atualizarRelatorio();
        });
      }
    },

    /**
     * Sincroniza manualmente o relatório com o cabeçalho
     */
    sincronizar() {
      this.atualizarRelatorio();
    },

    /**
     * Adiciona uma mensagem personalizada ao relatório
     * @param {string} mensagem - Mensagem extra a ser exibida
     */
    adicionarMensagemRelatorio(mensagem) {
      if (this.relatorioElement) {
        const htmlAtual = this.relatorioElement.innerHTML;
        this.relatorioElement.innerHTML = `${htmlAtual}<span class="mensagem-extra ms-2" style="font-size:0.7rem; opacity:0.7;">${mensagem}</span>`;
        setTimeout(() => {
          const msgExtra =
            this.relatorioElement.querySelector(".mensagem-extra");
          if (msgExtra) msgExtra.remove();
        }, 3000);
      }
    },
  };

  // ========== REGISTRO NO CONTROLADOR ==========
  if (
    typeof window.ControladorRobomestres !== "undefined" &&
    window.ControladorRobomestres
  ) {
    window.ControladorRobomestres.registrar("RodapeModule", RodapeModule);
  }

  // Fallback: expõe globalmente
  window.RodapeModule = RodapeModule;

  // Auto-inicializa se o controlador não existir
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => RodapeModule.init());
    } else {
      RodapeModule.init();
    }
  }
})();

// ==================================================
// INICIALIZAÇÃO ADICIONAL PARA O PASSO_A_PASSO
// ==================================================

(function () {
  "use strict";

  /**
   * Inicializa funcionalidades específicas da página
   */
  function initPagina() {
    // Adiciona classe active ao link do menu para esta página
    const linksMenu = document.querySelectorAll(".menu-robomestre .nav-link");
    linksMenu.forEach(function (link) {
      if (link.getAttribute("href") === "passo_a_passo_tinkercad.html") {
        link.classList.add("active");
      }
    });

    // Configura smooth scroll para âncoras internas
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href !== "#") {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });

    console.log(
      "%c📚 [PASSO_A_PASSO] Página inicializada com sucesso",
      "color: #ffb347; font-size: 12px; font-weight: bold;",
    );
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPagina);
  } else {
    initPagina();
  }
})();
