// ==============================================================
// INDEX.JS – LÓGICA UNIFICADA (cabeçalho, menu, rodapé e conteúdo)
// Todos os scripts inline foram migrados para cá.
// ==============================================================

(function () {
  "use strict";

  // ============================================================
  // MÓDULO DO CABEÇALHO (modelo_cabecalho.js)
  // ============================================================
  const CabecalhoModule = {
    contadorBugs: 0,
    inicializado: false,
    contadorElement: null,
    relatorioElement: null,

    init() {
      if (this.inicializado) return;

      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.contadorElement) {
        this.contadorBugs = this.carregarContador();
        this.atualizarDisplayContador();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log("%c🤖 [CABEÇALHO] Módulo inicializado com sucesso", "color: #ffb347; font-size: 12px; font-weight: bold;");
    },

    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    salvarContador() {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs.toString());
      } catch (e) {
        console.warn("[CABEÇALHO] Não foi possível salvar o contador", e);
      }
    },

    atualizarDisplayContador() {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      }
      if (this.relatorioElement) {
        this.relatorioElement.innerText = this.contadorBugs;
      }
    },

    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarContador();
      return this.contadorBugs;
    },

    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarReset();
      return this.contadorBugs;
    },

    getContadorBugs() {
      return this.contadorBugs;
    },

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

    animarReset() {
      const painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (painel) painel.style.animation = "";
        }, 300);
      }
    },

    atualizarMensagemErro(mensagem) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        linhaErro.innerHTML = `<i class="bi bi-terminal"></i> ${mensagem}`;
        linhaErro.style.animation = "piscaLed 0.2s ease-in-out";
        setTimeout(() => {
          if (linhaErro) linhaErro.style.animation = "";
        }, 400);
      }
    },

    adicionarLogDebug(texto) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        const htmlAtual = linhaErro.innerHTML;
        linhaErro.innerHTML = `${htmlAtual}<br><span style="font-size:0.65rem; opacity:0.7;">[DEBUG] ${texto}</span>`;
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
        if (evento.detail?.mensagem) {
          this.adicionarLogDebug(evento.detail.mensagem);
        }
      });

      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
        this.atualizarMensagemErro("[SISTEMA] Contador de bugs reiniciado! Preparem-se para novos erros! 🤖");
      });

      document.addEventListener("robo:vitoria", () => {
        this.adicionarLogDebug("🎉 Vitória registrada! Parabéns programadores!");
      });
    },

    efeitoCurtoCircuito() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },

    efeitoReboot() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "reboot 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    }
  };

  // ============================================================
  // MÓDULO DO RODAPÉ (modelo_rodape.js)
  // ============================================================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,

    init() {
      if (this.inicializado) return;

      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log("%c🤖 [RODAPÉ] Módulo inicializado com sucesso", "color: #ffb347; font-size: 12px; font-weight: bold;");
    },

    atualizarRelatorio() {
      if (!this.relatorioElement) return;

      let contadorBugs = 0;

      if (window.CabecalhoModule && typeof window.CabecalhoModule.getContadorBugs === "function") {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
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

    configurarEventos() {
      document.addEventListener("robo:bug", () => {
        this.atualizarRelatorio();
      });

      document.addEventListener("robo:resetBugs", () => {
        this.atualizarRelatorio();
      });

      document.addEventListener("cabecalho:contador_atualizado", () => {
        this.atualizarRelatorio();
      });

      document.addEventListener("robo:vitoria", () => {
        if (this.relatorioElement) {
          const corOriginal = this.relatorioElement.style.color;
          this.relatorioElement.style.color = "#2ecc71";
          setTimeout(() => {
            if (this.relatorioElement) {
              this.relatorioElement.style.color = "";
            }
          }, 500);
        }
      });

      if (window.ControladorRobomestres) {
        window.addEventListener("controlador:pronto", () => {
          this.atualizarRelatorio();
        });
      }
    },

    sincronizar() {
      this.atualizarRelatorio();
    },

    adicionarMensagemRelatorio(mensagem) {
      if (this.relatorioElement) {
        const htmlAtual = this.relatorioElement.innerHTML;
        this.relatorioElement.innerHTML = `${htmlAtual}<span class="mensagem-extra ms-2" style="font-size:0.7rem; opacity:0.7;">${mensagem}</span>`;
        setTimeout(() => {
          const msgExtra = this.relatorioElement.querySelector(".mensagem-extra");
          if (msgExtra) msgExtra.remove();
        }, 3000);
      }
    }
  };

  // ============================================================
  // MENU – lógica específica (modelo_menu.js)
  // ============================================================
  function initMenu() {
    var caminho = window.location.pathname;
    var paginaAtual = caminho.substring(caminho.lastIndexOf("/") + 1);

    if (paginaAtual === "" || paginaAtual === "/") {
      paginaAtual = "index.html";
    }

    var mapaPaginas = {
      "index.html": 'a[href="#principal"], a[data-ano="principal"]',
      "a1index.html": 'a[href="#ano1"], a[data-ano="1"]',
      "a2index.html": 'a[href="#ano2"], a[data-ano="2"]',
      "a3index.html": 'a[href="#ano3"], a[data-ano="3"]',
      "a4index.html": 'a[href="#ano4"], a[data-ano="4"]',
      "a5index.html": 'a[href="#ano5"], a[data-ano="5"]',
    };

    var todosLinks = document.querySelectorAll(".menu-robomestre .nav-link");
    todosLinks.forEach(function (link) {
      link.classList.remove("active");
    });

    var seletor = mapaPaginas[paginaAtual];
    if (seletor) {
      var linkAtivo = document.querySelector(seletor);
      if (linkAtivo) {
        linkAtivo.classList.add("active");
      }
    } else {
      var linkPorHref = document.querySelector(
        '.menu-robomestre .nav-link[href="' + paginaAtual + '"]'
      );
      if (linkPorHref) {
        linkPorHref.classList.add("active");
      }
    }

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

  // ============================================================
  // INICIALIZAÇÃO PRINCIPAL
  // ============================================================
  document.addEventListener("DOMContentLoaded", function () {
    // Inicializa o menu
    initMenu();

    // Inicializa o cabeçalho
    if (typeof CabecalhoModule !== "undefined") {
      window.CabecalhoModule = CabecalhoModule;
      CabecalhoModule.init();
    }

    // Inicializa o rodapé
    if (typeof RodapeModule !== "undefined") {
      window.RodapeModule = RodapeModule;
      RodapeModule.init();
    }

    // Sincroniza o contador do rodapé com o cabeçalho
    setTimeout(function () {
      if (RodapeModule && typeof RodapeModule.sincronizar === "function") {
        RodapeModule.sincronizar();
      }
    }, 100);

    console.log("%c🤖 [INDEX] Página inicial carregada com sucesso", "color: #ffb347; font-size: 12px;");
  });

  // ============================================================
  // EXPOSIÇÃO GLOBAL (para uso em outros scripts)
  // ============================================================
  window.CabecalhoModule = CabecalhoModule;
  window.RodapeModule = RodapeModule;

})();
