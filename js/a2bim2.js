// ==================================================
// modelo_cabecalho.js - LÓGICA DO CABEÇALHO REBELDE
// Módulo específico para gerenciar o cabeçalho robótico
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

  // ========== ANIMAÇÕES ADICIONAIS PARA O CSS (keyframes não declarados no CSS) ==========
  // Adiciona keyframes dinamicamente se não existirem
  const style = document.createElement("style");
  style.textContent = `
        @keyframes curtoCircuito {
            0%, 100% { background-color: #2c3e2b; }
            10%, 30%, 50% { background-color: #ffcc00; }
            20%, 40% { background-color: #ff6600; }
        }

        @keyframes reboot {
            0% { opacity: 1; transform: scale(1); }
            30% { opacity: 0.5; transform: scale(0.98); }
            60% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
    `;
  if (!document.querySelector("#cabecalho-animacoes-dinamicas")) {
    style.id = "cabecalho-animacoes-dinamicas";
    document.head.appendChild(style);
  }
})();

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
        console.log(
          "⏳ ApresentacaoModule: página não identificada, ignorando...",
        );
        return;
      }

      console.log(
        "🎭 [ApresentacaoModule] Inicializando página de apresentação...",
      );

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
      this.elementos.tabelaMapeamento =
        document.querySelector("#mapeamento table");
      this.elementos.planoSintetico = document.querySelector(
        "#plano-sintetico table",
      );
      this.elementos.btnDestaque = document.querySelectorAll(
        ".btn-outline-warning, .btn-robotico",
      );
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

        setTimeout(
          () => {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          },
          200 + index * 150,
        );
      });
    },

    efeitoBrilhoTabela() {
      const tabelas = [
        this.elementos.tabelaMapeamento,
        this.elementos.planoSintetico,
      ];

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

          setTimeout(
            () => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            },
            item.delay + idx * 100,
          );
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
      const elementosComTooltip = document.querySelectorAll(
        "[title], .tooltip-enabled",
      );

      elementosComTooltip.forEach((el) => {
        const titulo =
          el.getAttribute("title") || el.getAttribute("data-tooltip");
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

          el.addEventListener(
            "mouseleave",
            () => {
              tooltip.remove();
            },
            { once: true },
          );
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
  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
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

// ==================================================
// modelo_planos_aula.js
// Módulo para Planos de Aula Detalhados
// Funcionalidades: Expandir/recolher accordions, checkboxes de conclusão, barra de progresso
// ==================================================

(function () {
  "use strict";

  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_3ano",
    totalSemanas: 10,

    elementos: {
      expandirBtn: null,
      recolherBtn: null,
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
      accordionContainer: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta (contém o accordion)
      if (!document.getElementById("accordionAulas")) {
        console.log(
          "⏳ PlanosAulaModule: accordion não encontrado, ignorando...",
        );
        return;
      }

      console.log("📚 [PlanosAulaModule] Inicializando módulo interativo...");

      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.configurarEfeitosHover();
      this.inicializado = true;

      this.dispararEvento("planosAula:pronto");
      console.log(
        "✅ [PlanosAulaModule] Pronto! Total de semanas:",
        this.totalSemanas,
      );
    },

    capturarElementos() {
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.accordionContainer =
        document.getElementById("accordionAulas");

      // Se não encontrou checkboxes, tenta buscar por classe alternativa
      if (this.elementos.checkboxes.length === 0) {
        this.elementos.checkboxes = document.querySelectorAll(
          "input[type='checkbox'].semana-check, input.check-concluido",
        );
      }

      // Atualiza total de semanas baseado nos checkboxes encontrados
      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
    },

    // ========== PROGRESSO ==========
    salvarProgresso() {
      const concluidas = {};

      this.elementos.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) {
          concluidas[semana] = cb.checked;
        } else {
          // Fallback: usar índice
          const index = Array.from(this.elementos.checkboxes).indexOf(cb);
          concluidas[`semana_${index + 1}`] = cb.checked;
        }
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));

      this.dispararEvento("planosAula:progressoSalvo", {
        concluidas: concluidas,
        total: this.getTotalMarcados(),
      });
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);

      if (!salvo) {
        this.atualizarBarraProgresso();
        return;
      }

      try {
        const concluidas = JSON.parse(salvo);

        this.elementos.checkboxes.forEach((cb, idx) => {
          const semana = cb.getAttribute("data-semana");

          if (semana && concluidas.hasOwnProperty(semana)) {
            cb.checked = concluidas[semana];
          } else if (concluidas.hasOwnProperty(`semana_${idx + 1}`)) {
            cb.checked = concluidas[`semana_${idx + 1}`];
          }
        });
      } catch (e) {
        console.warn("Erro ao carregar progresso:", e);
      }

      this.atualizarBarraProgresso();
    },

    getTotalMarcados() {
      let marcados = 0;
      this.elementos.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      return marcados;
    },

    atualizarBarraProgresso() {
      const marcados = this.getTotalMarcados();
      const percentual =
        this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;

      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent =
          Math.round(percentual) + "%";
      }

      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
      }

      // Dispara evento de atualização
      this.dispararEvento("planosAula:progressoAtualizado", {
        concluidas: marcados,
        total: this.totalSemanas,
        percentual: percentual,
      });
    },

    // ========== EXPANDIR / RECOLHER ACCORDION ==========
    expandirTodos() {
      const collapses = document.querySelectorAll(
        "#accordionAulas .accordion-collapse",
      );

      collapses.forEach((collapse) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.show();
          } catch (e) {
            // Fallback
            collapse.classList.add("show");
          }
        } else {
          // Fallback para quando Bootstrap não está disponível
          collapse.classList.add("show");
        }
      });

      console.log("📖 Todos os planos expandidos");
      this.mostrarToast("📖 Todos os planos de aula expandidos!", "info");
    },

    recolherTodos() {
      const collapses = document.querySelectorAll(
        "#accordionAulas .accordion-collapse",
      );

      collapses.forEach((collapse) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.hide();
          } catch (e) {
            // Fallback
            collapse.classList.remove("show");
          }
        } else {
          // Fallback
          collapse.classList.remove("show");
        }
      });

      console.log("📕 Todos os planos recolhidos");
      this.mostrarToast("📕 Todos os planos de aula recolhidos!", "info");
    },

    // ========== CHECKBOX HANDLER ==========
    handleCheckboxChange(e) {
      const cb = e.target;
      const semana =
        cb.getAttribute("data-semana") ||
        `semana_${Array.from(this.elementos.checkboxes).indexOf(cb) + 1}`;

      this.salvarProgresso();
      this.atualizarBarraProgresso();

      // Mensagem de feedback
      const acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
      this.mostrarToast(
        `${acao} Semana ${semana}`,
        cb.checked ? "success" : "warning",
      );
    },

    // ========== EFEITOS VISUAIS ==========
    configurarEfeitosHover() {
      const cards = document.querySelectorAll(".accordion-item");

      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.transition = "transform 0.2s, box-shadow 0.2s";
          card.style.transform = "translateY(-2px)";
          card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
        });

        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
          card.style.boxShadow = "";
        });
      });
    },

    // ========== TOAST NOTIFICATION ==========
    mostrarToast(mensagem, tipo = "info") {
      // Verifica se já existe um toast container
      let toastContainer = document.querySelector(".toast-container-custom");

      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container-custom";
        toastContainer.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        `;
        document.body.appendChild(toastContainer);
      }

      const toastId = "toast_" + Date.now();
      const bgColor =
        tipo === "success"
          ? "#2ecc71"
          : tipo === "warning"
            ? "#f39c12"
            : "#3498db";

      const toastHtml = `
        <div id="${toastId}" class="custom-toast" style="
          background: #1e2a1a;
          border-left: 4px solid ${bgColor};
          border-radius: 12px;
          padding: 12px 20px;
          margin-bottom: 10px;
          color: #e9f5db;
          font-size: 0.85rem;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          animation: slideInRight 0.3s ease-out;
          display: flex;
          align-items: center;
          gap: 10px;
        ">
          <i class="bi ${tipo === "success" ? "bi-check-circle-fill" : tipo === "warning" ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill"}" style="color: ${bgColor};"></i>
          <span>${mensagem}</span>
        </div>
      `;

      toastContainer.insertAdjacentHTML("beforeend", toastHtml);

      // Remove após 3 segundos
      setTimeout(() => {
        const toast = document.getElementById(toastId);
        if (toast) {
          toast.style.animation = "fadeOutRight 0.3s ease-out";
          setTimeout(() => toast.remove(), 300);
        }
      }, 3000);
    },

    // ========== RESETAR PROGRESSO ==========
    resetarProgresso() {
      if (
        confirm(
          "⚠️ ATENÇÃO! Isso irá marcar TODAS as aulas como NÃO concluídas. Deseja continuar?",
        )
      ) {
        this.elementos.checkboxes.forEach((cb) => {
          cb.checked = false;
        });
        this.salvarProgresso();
        this.atualizarBarraProgresso();
        this.mostrarToast(
          "🔄 Progresso resetado! Todas as aulas foram marcadas como pendentes.",
          "warning",
        );
        console.log("🔄 Progresso resetado!");

        this.dispararEvento("planosAula:progressoResetado");
      }
    },

    // ========== ESTATÍSTICAS ==========
    getEstatisticas() {
      const marcados = this.getTotalMarcados();
      return {
        total: this.totalSemanas,
        concluidas: marcados,
        pendentes: this.totalSemanas - marcados,
        percentual:
          this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0,
      };
    },

    // ========== EVENTOS ==========
    configurarEventos() {
      // Botões expandir/recolher
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.removeEventListener(
          "click",
          this._handleExpandir,
        );
        this.elementos.expandirBtn.addEventListener("click", () =>
          this.expandirTodos(),
        );
      }

      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.removeEventListener(
          "click",
          this._handleRecolher,
        );
        this.elementos.recolherBtn.addEventListener("click", () =>
          this.recolherTodos(),
        );
      }

      // Checkboxes
      this.elementos.checkboxes.forEach((cb) => {
        cb.removeEventListener("change", this._handleChange);
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });

      // Tecla de atalho: Ctrl + Shift + R para resetar
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "R") {
          e.preventDefault();
          this.resetarProgresso();
        }
      });
    },

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  // Adiciona animações CSS dinamicamente
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes fadeOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Registra no controlador
  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("planosAula", PlanosAulaModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("planosAula", PlanosAulaModule);
      }
    });
    setTimeout(() => {
      if (!PlanosAulaModule.inicializado) PlanosAulaModule.init();
    }, 800);
  }

  window.PlanosAulaModule = PlanosAulaModule;
})();

// ==================================================
// modelo_certificado.js
// Módulo específico para a página de certificados (modelo_certificado.html)
// ==================================================

(function () {
  "use strict";

  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano3",

    elementos: {
      inputNome: null,
      btnAdicionar: null,
      listaAlunos: null,
      contadorAlunos: null,
      btnImprimirTodos: null,
      btnPreviewAluno: null,
      previewNome: null,
      previewData: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta
      if (
        !document.getElementById("listaAlunos") &&
        !document.querySelector(".cadastro-alunos")
      ) {
        console.log(
          "⏳ CertificadoModule: página não identificada, ignorando...",
        );
        return;
      }

      console.log("🎓 [CertificadoModule] Inicializando...");
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializado = true;

      this.dispararEvento("certificado:pronto");
      console.log("✅ [CertificadoModule] Pronto!");
    },

    carregarElementos() {
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimirTodos = document.getElementById(
        "btnImprimirCertificados",
      );
      this.elementos.btnPreviewAluno =
        document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
    },

    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      }

      if (!this.alunos || this.alunos.length === 0) {
        this.alunos = [
          "ANA BEATRIZ SANTOS",
          "LUCAS MARTINS FERREIRA",
          "MARIA CLARA SILVA",
        ];
        this.salvarAlunos();
      }
    },

    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
      this.dispararEvento("certificado:alunos_atualizados", {
        total: this.alunos.length,
      });
    },

    atualizarPreviewData() {
      if (this.elementos.previewData) {
        const hoje = new Date().toLocaleDateString("pt-BR");
        this.elementos.previewData.textContent = hoje;
      }
    },

    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      }
      if (this.elementos.btnPreviewAluno) {
        const nomePreview = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreviewAluno.disabled =
          nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
    },

    adicionarAluno() {
      if (!this.elementos.inputNome) return;

      let nome = this.elementos.inputNome.value.trim();
      if (!nome) {
        alert("🤖 Digite o nome do aluno(a) primeiro!");
        return;
      }

      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();

      if (this.alunos.includes(nome)) {
        alert("⚠️ Este aluno já está na lista!");
        return;
      }

      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarLista();

      if (this.elementos.inputNome) {
        this.elementos.inputNome.value = "";
        this.elementos.inputNome.focus();
      }

      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        const nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();

        if (
          this.elementos.previewNome &&
          this.elementos.previewNome.textContent === nomeRemovido
        ) {
          this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        }
        this.atualizarEstadoBotoes();
      }
    },

    selecionarAlunoPreview(nome) {
      if (this.elementos.previewNome) {
        this.elementos.previewNome.textContent = nome;
      }
      this.atualizarEstadoBotoes();
    },

    atualizarLista() {
      const listaUl = this.elementos.listaAlunos;
      const contadorSpan = this.elementos.contadorAlunos;

      if (!listaUl) return;

      if (this.alunos.length === 0) {
        listaUl.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (contadorSpan) contadorSpan.textContent = "0";
        return;
      }

      listaUl.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
          <div class="btn-group gap-1">
            <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
        listaUl.appendChild(li);
      });

      // Eventos
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleSelect);
        btn.addEventListener("click", (e) => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });

      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleRemove);
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nomeAluno, dataAtual);

      const win = window.open(
        "",
        "_blank",
        "width=900,height=700,toolbar=yes,scrollbars=yes",
      );
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
      }
    },

    _gerarHtmlCertificado(nome, data) {
      return `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificado - ${this.escapeHtml(nome)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; background: #e0e0e0; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }
          .preview-container { max-width: 800px; width: 100%; margin: 0 auto; }
          .preview-actions { text-align: center; margin-bottom: 20px; position: sticky; top: 10px; z-index: 100; }
          .btn-print, .btn-close { background: #ffb347; border: none; border-radius: 40px; padding: 10px 24px; font-weight: bold; cursor: pointer; margin: 0 8px; }
          .btn-close { background: #555; color: white; }
          .certificado { border: 3px solid #ffb347; border-radius: 48px 24px 48px 24px; padding: 30px; text-align: center; background: #fffef7; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
          .certificado h3 { color: #ffb347; font-family: 'Press Start 2P', cursive; font-size: 0.9rem; margin-bottom: 20px; }
          .certificado p { color: #4a6e2c; margin: 10px 0; }
          .certificado strong.nome { font-size: 22px; display: block; margin: 15px 0; color: #2c5e1f; background: #fff0cc; padding: 12px; border-radius: 40px; }
          .certificado hr { margin: 20px 0; border: 1px solid #ffb347; }
          @media print { body { background: white; } .preview-actions { display: none; } @page { size: A4; margin: 1.5cm; } }
        </style>
      </head>
      <body>
        <div class="preview-container">
          <div class="preview-actions">
            <button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button>
            <button class="btn-close" onclick="window.close();">✖️ FECHAR</button>
          </div>
          <div class="certificado">
            <h3>🏆 CERTIFICADO DE DETETIVE DE EVENTOS - NÍVEL 2</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>2º ANO - ROBÓTICA EDUCACIONAL - 2º BIMESTRE</strong><br>
            ⚡ QUANDO (eventos) | 🔁 SE (condicionais) | 🔗 E / OU (conectivos lógicos) | 🕵️ Projeto Robô Detetive</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"QUANDO você pensa, ENTÃO programa; E se errar, OU aprende, OU ri -- e as duas coisas são boas."</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 2.0</div>
          </div>
        </div>
        <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body>
      </html>`;
    },

    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir.");
        return;
      }

      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";

      this.alunos.forEach((aluno) => {
        cardsHTML += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE DETETIVE DE EVENTOS - NÍVEL 2</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>2º ANO - ROBÓTICA EDUCACIONAL - 2º BIMESTRE</strong><br>
            ⚡ QUANDO (eventos) | 🔁 SE (condicionais) | 🔗 E / OU (conectivos lógicos) | 🕵️ Projeto Robô Detetive</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"QUANDO você pensa, ENTÃO programa; E se errar, OU aprende, OU ri"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 2.0</div>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 2º Ano - 2º Bimestre</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; background: white; padding: 20px; }
          .print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
          @media print {
            body { padding: 0; margin: 0; }
            .print-grid { gap: 15px; }
            @page { size: A4; margin: 0.8cm; }
          }
        </style>
      </head>
      <body>
        <div class="print-grid">${cardsHTML}</div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 200);
          };
        <\/script>
      </body>
      </html>`;

      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
      }
    },

    previewAlunoSelecionado() {
      const nomeSelecionado = this.elementos.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    configurarEventos() {
      if (this.elementos.btnAdicionar) {
        this.elementos.btnAdicionar.addEventListener("click", () =>
          this.adicionarAluno(),
        );
      }

      if (this.elementos.inputNome) {
        this.elementos.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      }

      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      }

      if (this.elementos.btnPreviewAluno) {
        this.elementos.btnPreviewAluno.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
      }
    },

    escapeHtml(texto) {
      if (!texto) return "";
      return texto.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    },

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  // Registra no controlador
  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("certificado", CertificadoModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("certificado", CertificadoModule);
      }
    });
    setTimeout(() => {
      if (!CertificadoModule.inicializado) CertificadoModule.init();
    }, 800);
  }

  window.CertificadoModule = CertificadoModule;
})();

// ==================================================
// modelo_fechamento_bimestre.js
// Módulo do Jogo LOOP DASH - Fechamento do 1º Bimestre
// Conceito: Loop como otimização de código (montagem com cartões)
// ==================================================

(function () {
  "use strict";

  const FechamentoModule = {
    inicializado: false,

    // Estado do jogo
    faseAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 0 },
    recordes: { 1: null, 2: null, 3: null },
    loopsExecutados: 0,
    bugsEncontrados: 0,

    // Configuração das pistas
    pistas: {
      1: {
        nome: "RETA 🏁",
        grid: [["🚶", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "🏁"]],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 1, colunas: 8 },
      },
      2: {
        nome: "ZIGUE-ZAGUE 🔄",
        grid: [
          ["🚶", "⬜", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 5, colunas: 5 },
      },
      3: {
        nome: "OBSTÁCULOS 🧱",
        grid: [
          ["🚶", "⬜", "🧱", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "🧱", "⬜", "⬜"],
          ["🧱", "⬜", "🧱", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "🧱", "⬜"],
          ["⬜", "🧱", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 6, colunas: 6 },
      },
    },

    // Elementos DOM
    elementos: {
      grid: null,
      cartoesUsados: null,
      melhorMarca: null,
      status: null,
      bonus: null,
      algoritmoMontado: null,
      mensagem: null,
      recordeFase1: null,
      recordeFase2: null,
      recordeFase3: null,
      faseNomeAtual: null,
      faseIconeAtual: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta (contém o jogo)
      if (!document.getElementById("loopdashGrid")) {
        console.log("⏳ FechamentoModule: jogo não encontrado, ignorando...");
        return;
      }

      console.log("🎮 [FechamentoModule] LOOP DASH - Inicializando...");

      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
      this.atualizarContadoresGlobais();
      this.inicializado = true;

      this.dispararEvento("fechamento:pronto");
      console.log("✅ [FechamentoModule] LOOP DASH pronto!");
    },

    capturarElementos() {
      this.elementos.grid = document.getElementById("loopdashGrid");
      this.elementos.cartoesUsados = document.getElementById("loopdashCartoes");
      this.elementos.melhorMarca = document.getElementById("loopdashMelhor");
      this.elementos.status = document.getElementById("loopdashStatus");
      this.elementos.bonus = document.getElementById("loopdashBonus");
      this.elementos.algoritmoMontado =
        document.getElementById("algoritmoMontado");
      this.elementos.mensagem = document.getElementById("loopdashMensagem");
      this.elementos.recordeFase1 = document.getElementById("recordeFase1");
      this.elementos.recordeFase2 = document.getElementById("recordeFase2");
      this.elementos.recordeFase3 = document.getElementById("recordeFase3");
      this.elementos.faseNomeAtual = document.getElementById("faseNomeAtual");
      this.elementos.faseIconeAtual = document.getElementById("faseIconeAtual");
    },

    // ========== GERENCIAMENTO DE FASES ==========
    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();

      // Destaca botão da fase
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.getAttribute("data-fase")) === fase) {
          btn.classList.add("ativo");
        }
      });

      // Atualiza nome da fase
      if (this.elementos.faseNomeAtual) {
        this.elementos.faseNomeAtual.textContent = this.pistas[fase].nome;
      }

      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.elementos.faseIconeAtual) {
        this.elementos.faseIconeAtual.textContent = icones[fase];
      }

      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(
        `🏁 FASE ${fase}: ${this.pistas[fase].nome} selecionada! Monte seu algoritmo clicando nos cartões.`,
        "info",
      );
    },

    desenharGrid() {
      const pista = this.pistas[this.faseAtual];
      if (!this.elementos.grid) return;

      this.elementos.grid.className = `loopdash-grid fase${this.faseAtual}`;
      this.elementos.grid.innerHTML = "";

      for (let l = 0; l < pista.tamanho.linhas; l++) {
        for (let c = 0; c < pista.tamanho.colunas; c++) {
          const celula = pista.grid[l]?.[c] || "⬜";
          const cellDiv = document.createElement("div");
          cellDiv.className = "loopdash-cell";

          if (celula === "🧱") cellDiv.classList.add("wall");
          else if (celula === "🏁") cellDiv.classList.add("target");

          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c) {
            cellDiv.classList.add("robot");
          } else if (celula === "⬜" || celula === "🚶") {
            cellDiv.classList.add("path");
          }

          this.elementos.grid.appendChild(cellDiv);
        }
      }
    },

    resetarRobo() {
      const pista = this.pistas[this.faseAtual];
      this.posicaoRobo = { x: pista.inicio.x, y: pista.inicio.y, direcao: 1 }; // 0:cima,1:direita,2:baixo,3:esquerda
      this.desenharGrid();

      if (this.elementos.status) {
        this.elementos.status.textContent = "PRONTO";
        this.elementos.status.classList.remove("text-danger");
      }
    },

    // ========== CONSTRUTOR DE ALGORITMO ==========
    adicionarCartao(comando, parentContainer = null) {
      let cartaoObj = { comando: comando, filhos: [], contador: 3 };

      if (comando === "repita") {
        cartaoObj.filhos = [];
        cartaoObj.contador = 3;
      }

      if (parentContainer) {
        parentContainer.filhos.push(cartaoObj);
      } else {
        this.cartoesAlgoritmo.push(cartaoObj);
      }

      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(
        `➕ Cartão "${this.getNomeComando(comando)}" adicionado!`,
        "info",
      );
    },

    getNomeComando(comando) {
      const nomes = {
        ande1: "ANDE 1",
        ande2: "ANDE 2",
        vireDireita: "VIRE DIREITA",
        vireEsquerda: "VIRE ESQUERDA",
        repita: "REPITA",
      };
      return nomes[comando] || comando;
    },

    getIconeComando(comando) {
      const icones = {
        ande1: "🚶",
        ande2: "🏃",
        vireDireita: "▶️",
        vireEsquerda: "◀️",
        repita: "🔄",
      };
      return icones[comando] || "❓";
    },

    renderizarAlgoritmo() {
      if (!this.elementos.algoritmoMontado) return;

      this.elementos.algoritmoMontado.innerHTML = "";

      if (this.cartoesAlgoritmo.length === 0) {
        this.elementos.algoritmoMontado.innerHTML =
          '<div class="placeholder-algoritmo">🃏 Clique nos cartões abaixo para montar seu algoritmo...</div>';
        return;
      }

      this.cartoesAlgoritmo.forEach((cartao, idx) => {
        const cartaoDiv = this.criarCartaoElemento(cartao, idx, false);
        this.elementos.algoritmoMontado.appendChild(cartaoDiv);
      });
    },

    criarCartaoElemento(cartao, idx, isFilho) {
      const div = document.createElement("div");
      div.className = "cartao-montado";

      if (cartao.comando === "repita") {
        div.classList.add("repita-container");

        const header = document.createElement("div");
        header.className = "repita-header";
        header.innerHTML = `
          <span class="cartao-icone">🔄</span>
          <span class="cartao-texto">REPITA</span>
          <input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10" style="width:55px; border-radius:20px; text-align:center;">
          <span class="cartao-texto">vezes</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;

        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";

        const btnAddFilho = document.createElement("button");
        btnAddFilho.innerHTML = "+ adicionar comando";
        btnAddFilho.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
        btnAddFilho.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaRepita(cartao);
        });

        filhosDiv.appendChild(btnAddFilho);

        if (cartao.filhos && cartao.filhos.length > 0) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx, true);
            filhosDiv.appendChild(filhoDiv);
          });
        }

        div.appendChild(header);
        div.appendChild(filhosDiv);

        const inputContador = header.querySelector(".repita-contador-input");
        if (inputContador) {
          inputContador.addEventListener("change", (e) => {
            cartao.contador = parseInt(e.target.value) || 3;
            this.atualizarContadorCartoes();
          });
        }
      } else {
        div.innerHTML = `
          <span class="cartao-icone">${this.getIconeComando(cartao.comando)}</span>
          <span class="cartao-texto">${this.getNomeComando(cartao.comando)}</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      }

      const removeBtn = div.querySelector(".cartao-remove");
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idxRemover = parseInt(removeBtn.getAttribute("data-idx"));
          const isFilhoRemover =
            removeBtn.getAttribute("data-is-filho") === "true";
          this.removerCartao(idxRemover, isFilhoRemover);
        });
      }

      return div;
    },

    mostrarSelecaoComandoParaRepita(cartaoRepita) {
      const comandos = [
        { comando: "ande1", nome: "ANDE 1", icone: "🚶" },
        { comando: "ande2", nome: "ANDE 2", icone: "🏃" },
        { comando: "vireDireita", nome: "VIRE DIREITA", icone: "▶️" },
        { comando: "vireEsquerda", nome: "VIRE ESQUERDA", icone: "◀️" },
      ];

      let modalHtml = `
        <div id="modalComando" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;">
          <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:400px;">
            <h3 style="color:#ffb347;">🔄 Adicionar comando ao REPITA</h3>
            <div style="display:flex; flex-wrap:wrap; gap:12px; margin:20px 0;">
      `;

      comandos.forEach((cmd) => {
        modalHtml += `
          <button class="btn-selecionar-cmd" data-comando="${cmd.comando}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:12px; cursor:pointer;">
            <div style="font-size:2rem;">${cmd.icone}</div>
            <div style="color:#ffb347;">${cmd.nome}</div>
          </button>
        `;
      });

      modalHtml += `
            </div>
            <button id="btnFecharModal" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; color:white; cursor:pointer;">FECHAR</button>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComando");

      document.querySelectorAll(".btn-selecionar-cmd").forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.getAttribute("data-comando");
          cartaoRepita.filhos.push({ comando: comando, filhos: [] });
          this.renderizarAlgoritmo();
          if (modal) modal.remove();
          this.atualizarContadorCartoes();
          this.mostrarMensagem(
            `➕ Comando adicionado dentro do REPITA!`,
            "success",
          );
        });
      });

      const btnFechar = document.getElementById("btnFecharModal");
      if (btnFechar) {
        btnFechar.addEventListener("click", () => {
          if (modal) modal.remove();
        });
      }
    },

    removerCartao(idx, isFilho) {
      if (!isFilho && this.cartoesAlgoritmo[idx]) {
        this.cartoesAlgoritmo.splice(idx, 1);
      }
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`🗑️ Cartão removido!`, "info");
    },

    limparAlgoritmo() {
      this.cartoesAlgoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(
        `🧹 Algoritmo limpo! Monte um novo usando os cartões.`,
        "info",
      );
    },

    atualizarContadorCartoes() {
      const contarCartoes = (arr) => {
        let total = 0;
        for (const item of arr) {
          total++;
          if (item.comando === "repita" && item.filhos) {
            total += contarCartoes(item.filhos);
          }
        }
        return total;
      };

      const total = contarCartoes(this.cartoesAlgoritmo);
      if (this.elementos.cartoesUsados) {
        this.elementos.cartoesUsados.textContent = total;
      }

      // Verifica loopception (loop aninhado)
      let temLoopAninhado = false;
      const verificarLoopAninhado = (arr) => {
        for (const item of arr) {
          if (
            item.comando === "repita" &&
            item.filhos &&
            item.filhos.length > 0
          ) {
            for (const filho of item.filhos) {
              if (filho.comando === "repita") temLoopAninhado = true;
            }
            verificarLoopAninhado(item.filhos);
          }
        }
      };

      verificarLoopAninhado(this.cartoesAlgoritmo);
      if (this.elementos.bonus) {
        this.elementos.bonus.textContent = temLoopAninhado
          ? "⭐ LOOPCEPTION! ⭐"
          : "---";
      }
    },

    // ========== EXECUÇÃO DO ALGORITMO ==========
    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem(
          "⚠️ Você precisa montar um algoritmo primeiro! Clique nos cartões.",
          "erro",
        );
        return;
      }

      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando algoritmo... 🏃", "info");
      if (this.elementos.status)
        this.elementos.status.textContent = "EXECUTANDO...";

      let sucesso = true;
      let explicacaoErro = "";

      try {
        for (const comando of this.cartoesAlgoritmo) {
          const resultado = await this.executarComando(comando);
          if (!resultado.sucesso) {
            sucesso = false;
            explicacaoErro = resultado.erro;
            break;
          }
        }
      } catch (err) {
        sucesso = false;
        explicacaoErro = err.message;
      }

      const chegou = this.verificarChegada();

      if (sucesso && chegou) {
        const totalCartoes = parseInt(
          this.elementos.cartoesUsados?.textContent || "0",
        );
        const recordeAtual = this.recordes[this.faseAtual];

        if (!recordeAtual || totalCartoes < recordeAtual) {
          this.recordes[this.faseAtual] = totalCartoes;
          this.salvarRecordes();
          this.atualizarRecordeDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${totalCartoes} cartões! NOVO RECORDE! 🏆`,
            "success",
          );
        } else {
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${totalCartoes} cartões!`,
            "success",
          );
        }

        this.loopsExecutados++;
        this.atualizarContadoresGlobais();
        if (this.elementos.status)
          this.elementos.status.textContent = "VITÓRIA! 🏆";
      } else {
        this.bugsEncontrados++;
        this.atualizarContadoresGlobais();
        this.mostrarMensagem(
          `🐛 BUG ENCONTRADO! ${explicacaoErro || "O robô não conseguiu completar o percurso."} Use DICA para melhorar.`,
          "erro",
        );
        if (this.elementos.status) {
          this.elementos.status.textContent = "BUGOU! 💥";
          this.elementos.status.classList.add("text-danger");
        }
      }
    },

    async executarComando(comandoObj) {
      const comando = comandoObj.comando;

      if (comando === "repita") {
        const vezes = comandoObj.contador || 3;
        for (let i = 0; i < vezes; i++) {
          for (const filho of comandoObj.filhos || []) {
            const resultado = await this.executarComando(filho);
            if (!resultado.sucesso) return resultado;
            await this.delay(250);
            this.desenharGrid();
          }
        }
        return { sucesso: true };
      }

      const pista = this.pistas[this.faseAtual];
      let novoX = this.posicaoRobo.x;
      let novoY = this.posicaoRobo.y;

      switch (comando) {
        case "ande1":
          if (this.posicaoRobo.direcao === 0) novoX--;
          else if (this.posicaoRobo.direcao === 1) novoY++;
          else if (this.posicaoRobo.direcao === 2) novoX++;
          else if (this.posicaoRobo.direcao === 3) novoY--;
          break;
        case "ande2":
          if (this.posicaoRobo.direcao === 0) novoX -= 2;
          else if (this.posicaoRobo.direcao === 1) novoY += 2;
          else if (this.posicaoRobo.direcao === 2) novoX += 2;
          else if (this.posicaoRobo.direcao === 3) novoY -= 2;
          break;
        case "vireDireita":
          this.posicaoRobo.direcao = (this.posicaoRobo.direcao + 1) % 4;
          return { sucesso: true };
        case "vireEsquerda":
          this.posicaoRobo.direcao = (this.posicaoRobo.direcao - 1 + 4) % 4;
          return { sucesso: true };
        default:
          return { sucesso: false, erro: `Comando desconhecido: ${comando}` };
      }

      // Valida movimento
      if (
        novoX < 0 ||
        novoX >= pista.tamanho.linhas ||
        novoY < 0 ||
        novoY >= pista.tamanho.colunas
      ) {
        return {
          sucesso: false,
          erro: "O robô tentou sair da pista! Use comandos menores.",
        };
      }

      if (pista.grid[novoX]?.[novoY] === "🧱") {
        return {
          sucesso: false,
          erro: "O robô bateu em um obstáculo! 🧱 Desvie dele.",
        };
      }

      this.posicaoRobo.x = novoX;
      this.posicaoRobo.y = novoY;
      await this.delay(250);
      this.desenharGrid();

      return { sucesso: true };
    },

    verificarChegada() {
      const pista = this.pistas[this.faseAtual];
      return pista.grid[this.posicaoRobo.x]?.[this.posicaoRobo.y] === "🏁";
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // ========== DICAS E EXEMPLOS ==========
    mostrarDica() {
      const dicas = {
        1: "💡 DICA FASE 1: Use um único REPITA 7 vezes com ANDE 1 para percorrer toda a reta!",
        2: "💡 DICA FASE 2: Use REPITA dentro de REPITA para fazer o zigue-zague! Ex: REPITA 2 vezes { ANDE 2, VIRE DIREITA, ANDE 2, VIRE ESQUERDA }",
        3: "💡 DICA FASE 3: Planeje o caminho para desviar dos obstáculos. Use REPITA para repetir padrões de movimento!",
      };
      this.mostrarMensagem(
        dicas[this.faseAtual] ||
          "💡 Tente usar o cartão REPITA para repetir movimentos e economizar cartões!",
        "info",
      );
    },

    carregarExemplo() {
      this.limparAlgoritmo();

      if (this.faseAtual === 1) {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 7,
          filhos: [{ comando: "ande1", filhos: [] }],
        });
      } else if (this.faseAtual === 2) {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 2,
          filhos: [
            { comando: "ande2", filhos: [] },
            { comando: "vireDireita", filhos: [] },
            { comando: "ande2", filhos: [] },
            { comando: "vireEsquerda", filhos: [] },
          ],
        });
      } else {
        this.cartoesAlgoritmo.push({ comando: "ande1", filhos: [] });
        this.cartoesAlgoritmo.push({ comando: "vireDireita", filhos: [] });
        this.cartoesAlgoritmo.push({ comando: "ande1", filhos: [] });
      }

      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(
        `📋 Exemplo carregado para a FASE ${this.faseAtual}! Clique em EXECUTAR para testar.`,
        "success",
      );
    },

    // ========== RECORDES ==========
    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes");
      if (saved) {
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) {}
      }
    },

    salvarRecordes() {
      localStorage.setItem("loopdash_recordes", JSON.stringify(this.recordes));
    },

    atualizarRecordeDisplay() {
      if (this.elementos.recordeFase1) {
        this.elementos.recordeFase1.textContent = this.recordes[1] || "---";
      }
      if (this.elementos.recordeFase2) {
        this.elementos.recordeFase2.textContent = this.recordes[2] || "---";
      }
      if (this.elementos.recordeFase3) {
        this.elementos.recordeFase3.textContent = this.recordes[3] || "---";
      }

      const valores = [
        this.recordes[1],
        this.recordes[2],
        this.recordes[3],
      ].filter((v) => v !== null);
      const melhor = valores.length > 0 ? Math.min(...valores) : "--";

      if (this.elementos.melhorMarca) {
        this.elementos.melhorMarca.textContent = melhor;
      }
    },

    // ========== UTILITÁRIOS ==========
    mostrarMensagem(texto, tipo) {
      if (!this.elementos.mensagem) return;

      this.elementos.mensagem.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      this.elementos.mensagem.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "success" ? "sucesso" : ""}`;

      setTimeout(() => {
        if (this.elementos.mensagem && tipo !== "erro") {
          this.elementos.mensagem.className = "mensagem-jogo";
        }
      }, 4000);
    },

    atualizarContadoresGlobais() {
      const relatorioBugs = document.getElementById("relatorioBugs");
      const relatorioLoops = document.getElementById("relatorioLoops");

      if (relatorioBugs) relatorioBugs.textContent = this.bugsEncontrados;
      if (relatorioLoops) relatorioLoops.textContent = this.loopsExecutados;
    },

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },

    // ========== CONFIGURAÇÃO DE EVENTOS ==========
    configurarEventos() {
      // Botões de fase
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const fase = parseInt(btn.getAttribute("data-fase"));
          if (fase) this.carregarFase(fase);
        });
      });

      // Cartões de comando
      document.querySelectorAll(".cartao-comando").forEach((cartao) => {
        cartao.addEventListener("click", () => {
          const comando = cartao.getAttribute("data-comando");
          this.adicionarCartao(comando);
        });
      });

      // Botão limpar
      const btnLimpar = document.getElementById("btnLimparAlgoritmo");
      if (btnLimpar) {
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      }

      // Botões principais
      const btnExecutar = document.getElementById("btnExecutarLoopDash");
      const btnReset = document.getElementById("btnResetLoopDash");
      const btnDica = document.getElementById("btnDicaLoopDash");
      const btnExemplo = document.getElementById("btnExemploLoopDash");

      if (btnExecutar)
        btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset)
        btnReset.addEventListener("click", () => this.resetarRobo());
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo)
        btnExemplo.addEventListener("click", () => this.carregarExemplo());
    },
  };

  // Registra no controlador
  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("fechamento", FechamentoModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("fechamento", FechamentoModule);
      }
    });
    setTimeout(() => {
      if (!FechamentoModule.inicializado) FechamentoModule.init();
    }, 800);
  }

  window.FechamentoModule = FechamentoModule;
})();

// ==================================================
// modelo_rodape.js - LÓGICA DO RODAPÉ REBELDE
// Módulo específico para gerenciar o rodapé robótico
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
// JOGO DO BIMESTRE: Robô Detetive – Operação E/OU
// Código completo para funcionamento do jogo descrito no DOCX
// ==================================================
// ========== NOVO JOGO: OPERAÇÃO RESGATE – E ou OU? ==========
(function () {
  // Verifica se o container do jogo existe
  if (!document.getElementById("perguntaTexto")) return;

  let pontos = 0;
  let vidas = 3;
  let perguntaAtual = 0;
  let jogoAtivo = true;

  const perguntas = [
    {
      texto:
        "Para abrir a porta do laboratório, preciso ter a chave ______ o código secreto. (Qualquer um dos dois funciona)",
      resposta: "OU",
      explicacao: "👉 Basta ter a chave OU o código. Não precisa dos dois!",
    },
    {
      texto:
        "O Robô Zé vai sair da sala se estiver com a bateria cheia ______ se o sol estiver brilhando. (Ele só sai se as duas coisas acontecerem)",
      resposta: "E",
      explicacao:
        "👉 Ele só sai se a bateria estiver cheia E se o sol estiver brilhando. As duas condições são obrigatórias.",
    },
    {
      texto:
        "Para ganhar o adesivo de detetive, você precisa resolver o mistério ______ entregar o relatório. (Você precisa fazer as duas coisas)",
      resposta: "E",
      explicacao: "👉 Você precisa resolver E entregar. Nada de preguiça!",
    },
    {
      texto:
        "A mamãe deixou você brincar se você arrumar o quarto ______ se você terminar a lição. (Basta uma delas para liberar a brincadeira)",
      resposta: "OU",
      explicacao:
        "👉 Se arrumar o quarto OU terminar a lição, já pode brincar! Ufa!",
    },
    {
      texto:
        "O robô só avança se não tiver obstáculo ______ se a luz estiver verde. (Ele só anda se as duas condições forem verdadeiras)",
      resposta: "E",
      explicacao:
        "👉 Ele só anda se não tiver obstáculo E a luz estiver verde. Segurança em primeiro lugar!",
    },
  ];

  function atualizarDisplay() {
    document.getElementById("vidasRestantes").innerText = vidas;
    document.getElementById("pontuacao").innerText = pontos;
  }

  function carregarPergunta() {
    if (!jogoAtivo) return;
    if (perguntaAtual >= perguntas.length) {
      // Fim do jogo
      const resultadoDiv = document.getElementById("gameResultado");
      if (pontos === perguntas.length) {
        resultadoDiv.innerHTML =
          '<span class="text-success fs-4">🏆 PARABÉNS! VOCÊ RESGATOU O ROBÔ ZÉ! 🏆</span>';
        resultadoDiv.classList.add(
          "p-3",
          "bg-success",
          "bg-opacity-25",
          "rounded",
        );
        // Exibe botão de certificado (opcional)
      } else {
        resultadoDiv.innerHTML = `<span class="text-warning fs-5">⚠️ Você resgatou ${pontos} de ${perguntas.length} portas. Recomece para tentar todas!</span>`;
      }
      document.getElementById("btnE").disabled = true;
      document.getElementById("btnOU").disabled = true;
      document.getElementById("resetJogo").style.display = "block";
      return;
    }

    const p = perguntas[perguntaAtual];
    document.getElementById("perguntaTexto").innerHTML = p.texto;
    document.getElementById("feedback").style.display = "none";
    document.getElementById("gameResultado").innerHTML = "";
    document.getElementById("btnE").disabled = false;
    document.getElementById("btnOU").disabled = false;
  }

  function verificarResposta(escolha) {
    if (!jogoAtivo) return;
    const pergunta = perguntas[perguntaAtual];
    const feedbackDiv = document.getElementById("feedback");
    const resultadoDiv = document.getElementById("gameResultado");

    if (escolha === pergunta.resposta) {
      // ACERTOU
      pontos++;
      feedbackDiv.className = "alert acerto mt-3";
      feedbackDiv.innerHTML = `<i class="bi bi-check-circle-fill"></i> ACERTOU, MESTRE! +1 ponto. ${pergunta.explicacao}`;
      feedbackDiv.style.display = "block";
      atualizarDisplay();

      // Próxima pergunta após 1.5s
      perguntaAtual++;
      setTimeout(() => {
        carregarPergunta();
      }, 1500);
    } else {
      // ERROU
      vidas--;
      atualizarDisplay();
      feedbackDiv.className = "alert erro mt-3";
      feedbackDiv.innerHTML = `<i class="bi bi-x-circle-fill"></i> BUUUUG! A resposta correta era <strong>${pergunta.resposta}</strong>. ${pergunta.explicacao}`;
      feedbackDiv.style.display = "block";

      if (vidas <= 0) {
        jogoAtivo = false;
        feedbackDiv.innerHTML += `<br><strong>💀 GAME OVER! O robô travou. Clique em Reiniciar Jogo.</strong>`;
        document.getElementById("btnE").disabled = true;
        document.getElementById("btnOU").disabled = true;
        resultadoDiv.innerHTML =
          '<span class="text-danger">🔴 Suas vidas acabaram! Reinicie o jogo para tentar novamente.</span>';
      } else {
        // Vai para a próxima pergunta mesmo assim (mas perdeu ponto)
        perguntaAtual++;
        setTimeout(() => {
          carregarPergunta();
        }, 1500);
      }
    }

    // Se acabaram as vidas, desabilita os botões
    if (vidas <= 0) {
      document.getElementById("btnE").disabled = true;
      document.getElementById("btnOU").disabled = true;
    }
  }

  function reiniciarJogo() {
    pontos = 0;
    vidas = 3;
    perguntaAtual = 0;
    jogoAtivo = true;
    atualizarDisplay();
    document.getElementById("btnE").disabled = false;
    document.getElementById("btnOU").disabled = false;
    document.getElementById("feedback").style.display = "none";
    document.getElementById("gameResultado").innerHTML = "";
    carregarPergunta();
  }

  // Eventos
  document
    .getElementById("btnE")
    .addEventListener("click", () => verificarResposta("E"));
  document
    .getElementById("btnOU")
    .addEventListener("click", () => verificarResposta("OU"));
  document.getElementById("resetJogo").addEventListener("click", reiniciarJogo);

  // Iniciar
  carregarPergunta();
})();
