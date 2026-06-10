// ==================================================
// modelo_apresentacao_bimestre.js
// Módulo para página de Apresentação do Bimestre
// Funcionalidades: Animações, interações visuais, contador de aulas
// ==================================================

(function () {
  "use strict";

  const ApresentacaoModule = {
    inicializado: false,

    elementos: {
      cartaAbertura: null,
      tabelaMapeamento: null,
      planoSintetico: null,
      btnDestaque: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta (contém elementos da apresentação)
      const possuiElementos =
        document.getElementById("carta-abertura") ||
        document.querySelector(".carta-container") ||
        document.getElementById("mapeamento");

      if (!possuiElementos) {
        console.log("⏳ ApresentacaoModule: página não identificada, ignorando...");
        return;
      }

      console.log("🎭 [ApresentacaoModule] Inicializando página de apresentação...");

      this.capturarElementos();
      this.configurarEfeitosVisuais();
      this.inicializarContadorSemanas();
      this.configurarEventos();
      this.inicializado = true;

      this.dispararEvento("apresentacao:pronto");
      console.log("✅ [ApresentacaoModule] Pronto!");
    },

    capturarElementos() {
      this.elementos.cartaAbertura = document.querySelector(".carta-container");
      this.elementos.tabelaMapeamento = document.querySelector("#mapeamento table");
      this.elementos.planoSintetico = document.querySelector("#plano-sintetico table");
      this.elementos.btnDestaque = document.querySelectorAll(".btn-outline-warning, .btn-robotico");
    },

    // ========== EFEITOS VISUAIS ==========
    configurarEfeitosVisuais() {
      // Efeito de digitação na carta de abertura
      this.efeitoDigitacaoCarta();

      // Efeito de brilho nas linhas da tabela
      this.efeitoBrilhoTabela();

      // Efeito de flutuação nos badges
      this.efeitoFlutuacaoBadges();
    },

    efeitoDigitacaoCarta() {
      const cartaContainer = this.elementos.cartaAbertura;
      if (!cartaContainer) return;

      // Procura por elementos de texto dentro da carta
      const paragrafos = cartaContainer.querySelectorAll(".carta-texto, p");

      paragrafos.forEach((p, index) => {
        // Adiciona delay progressivo para cada parágrafo
        p.style.opacity = "0";
        p.style.transform = "translateY(10px)";
        p.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(() => {
          p.style.opacity = "1";
          p.style.transform = "translateY(0)";
        }, 200 + index * 150);
      });
    },

    efeitoBrilhoTabela() {
      const tabelas = [this.elementos.tabelaMapeamento, this.elementos.planoSintetico];

      tabelas.forEach((tabela) => {
        if (!tabela) return;

        const linhas = tabela.querySelectorAll("tbody tr");

        linhas.forEach((linha, index) => {
          linha.addEventListener("mouseenter", () => {
            linha.style.transition = "all 0.2s ease";
            linha.style.backgroundColor = "rgba(255, 180, 71, 0.15)";
            linha.style.transform = "scale(1.01)";
          });

          linha.addEventListener("mouseleave", () => {
            linha.style.backgroundColor = "";
            linha.style.transform = "";
          });
        });
      });
    },

    efeitoFlutuacaoBadges() {
      const badges = document.querySelectorAll(".badge-projeto, .selo-sucata");

      badges.forEach((badge, index) => {
        badge.style.animation = `flutuarBadge ${2 + index * 0.3}s ease-in-out infinite`;
        badge.style.transformOrigin = "center";
      });
    },

    // ========== CONTADOR DE SEMANAS ==========
    inicializarContadorSemanas() {
      const tabela = this.elementos.planoSintetico;
      if (!tabela) return;

      const linhas = tabela.querySelectorAll("tbody tr");
      const totalSemanas = linhas.length;

      // Adiciona um indicador visual do total de semanas
      const header = document.querySelector("#plano-sintetico .projeto-header");
      if (header && totalSemanas > 0) {
        const contadorSpan = document.createElement("span");
        contadorSpan.className = "badge bg-warning text-dark ms-2";
        contadorSpan.innerHTML = `📅 ${totalSemanas} semanas`;
        contadorSpan.style.fontSize = "0.7rem";
        contadorSpan.style.verticalAlign = "middle";

        const titulo = header.querySelector("h2");
        if (titulo && !header.querySelector(".badge")) {
          titulo.appendChild(contadorSpan);
        }
      }

      console.log(`📊 Total de semanas no bimestre: ${totalSemanas}`);
    },

    // ========== ANIMAÇÃO DE ENTRADA ==========
    animarEntradaElementos() {
      const elementosParaAnimacao = [
        { selector: ".projeto-header", delay: 0 },
        { selector: ".bg-robocard", delay: 100 },
        { selector: ".table-responsive", delay: 200 },
      ];

      elementosParaAnimacao.forEach((item) => {
        const elementos = document.querySelectorAll(item.selector);
        elementos.forEach((el, idx) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
          el.style.transition = "opacity 0.4s ease, transform 0.4s ease";

          setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          }, item.delay + idx * 100);
        });
      });
    },

    // ========== GERADOR DE PRINT AMIGÁVEL ==========
    gerarPrintAmigavel() {
      const btnPrint = document.createElement("button");
      btnPrint.innerHTML = '<i class="bi bi-printer"></i> Imprimir/Exportar';
      btnPrint.className = "btn-print-amigavel";
      btnPrint.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #ffb347;
        border: none;
        border-radius: 40px;
        padding: 10px 20px;
        color: #1e2a1a;
        font-weight: bold;
        cursor: pointer;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        transition: all 0.2s;
        font-family: monospace;
      `;

      btnPrint.addEventListener("mouseenter", () => {
        btnPrint.style.transform = "scale(1.05)";
      });
      btnPrint.addEventListener("mouseleave", () => {
        btnPrint.style.transform = "scale(1)";
      });

      btnPrint.addEventListener("click", () => {
        window.print();
      });

      // Adiciona apenas se não existir
      if (!document.querySelector(".btn-print-amigavel")) {
        document.body.appendChild(btnPrint);
      }
    },

    // ========== TOOLTIPS INTERATIVAS ==========
    inicializarTooltips() {
      // Adiciona tooltips em elementos com título
      const elementosComTooltip = document.querySelectorAll("[title], .tooltip-enabled");

      elementosComTooltip.forEach((el) => {
        const titulo = el.getAttribute("title") || el.getAttribute("data-tooltip");
        if (!titulo) return;

        el.addEventListener("mouseenter", (e) => {
          const tooltip = document.createElement("div");
          tooltip.className = "custom-tooltip";
          tooltip.textContent = titulo;
          tooltip.style.cssText = `
            position: absolute;
            background: #1e2a1a;
            color: #ffb347;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.7rem;
            font-family: monospace;
            border: 1px solid #ffb347;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
          `;

          const rect = el.getBoundingClientRect();
          tooltip.style.left = rect.left + rect.width / 2 - 50 + "px";
          tooltip.style.top = rect.top - 30 + "px";

          document.body.appendChild(tooltip);

          el.addEventListener("mouseleave", () => {
            tooltip.remove();
          }, { once: true });
        });
      });
    },

    // ========== BOTÃO DE DESTAQUE (Rolar para topo) ==========
    criarBotaoTopo() {
      const btnTopo = document.createElement("button");
      btnTopo.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
      btnTopo.className = "btn-topo-robotico";
      btnTopo.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: #2c3e2b;
        border: 2px solid #ffb347;
        border-radius: 50%;
        width: 45px;
        height: 45px;
        color: #ffb347;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        justify-content: center;
      `;

      btnTopo.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      document.body.appendChild(btnTopo);

      // Mostra/esconde baseado no scroll
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          btnTopo.style.opacity = "1";
          btnTopo.style.visibility = "visible";
        } else {
          btnTopo.style.opacity = "0";
          btnTopo.style.visibility = "hidden";
        }
      });

      return btnTopo;
    },

    // ========== CONFIGURA EVENTOS ==========
    configurarEventos() {
      // Anima entrada ao carregar
      setTimeout(() => {
        this.animarEntradaElementos();
      }, 100);

      // Botão de print amigável
      setTimeout(() => {
        this.gerarPrintAmigavel();
      }, 500);

      // Botão de topo
      setTimeout(() => {
        this.criarBotaoTopo();
      }, 600);

      // Tooltips interativas
      setTimeout(() => {
        this.inicializarTooltips();
      }, 700);

      // Efeito de clique nos botões
      const botoes = document.querySelectorAll(".btn, .badge-projeto");
      botoes.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          btn.style.transform = "scale(0.98)";
          setTimeout(() => {
            btn.style.transform = "";
          }, 150);
        });
      });
    },

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  // Adiciona keyframes de animação dinamicamente
  const style = document.createElement("style");
  style.textContent = `
    @keyframes flutuarBadge {
      0%, 100% {
        transform: translateY(0px);
      }
      50% {
        transform: translateY(-5px);
      }
    }
    
    @keyframes piscaSuave {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
    
    .badge-projeto {
      display: inline-block;
    }
    
    /* Estilos para impressão */
    @media print {
      .btn-print-amigavel, .btn-topo-robotico, .custom-tooltip {
        display: none !important;
      }
      
      .projeto-header, .bg-robocard {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      
      table {
        break-inside: avoid;
      }
      
      body {
        background: white;
        padding: 0;
        margin: 0;
      }
      
      .bg-robotica {
        background: white;
      }
    }
  `;
  document.head.appendChild(style);

  // Registra no controlador
  if (window.Controlador && typeof window.Controlador.registrarModulo === "function") {
    window.Controlador.registrarModulo("apresentacao", ApresentacaoModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("apresentacao", ApresentacaoModule);
      }
    });
    setTimeout(() => {
      if (!ApresentacaoModule.inicializado) ApresentacaoModule.init();
    }, 800);
  }

  window.ApresentacaoModule = ApresentacaoModule;
})();
