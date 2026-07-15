// ==================================================
// makecode.js
// Módulo para o Manual do Guerreiro MakeCode
// Funcionalidades: Interações, contador de bugs, animações
// ==================================================

(function () {
  "use strict";

  const MakeCodeModule = {
    inicializado: false,
    bugsEncontrados: 0,
    STORAGE_KEY: "makecode_contador_bugs",

    elementos: {
      relatorioBugs: null,
      btnAcharBug: null,
      bugMessage: null,
      bugCount: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta
      const possuiElementos =
        document.querySelector(".manual-content") ||
        document.getElementById("parte1") ||
        document.querySelector(".aviso-container");

      if (!possuiElementos) {
        console.log("⏳ MakeCodeModule: página não identificada, ignorando...");
        return;
      }

      console.log(
        "📚 [MakeCodeModule] Inicializando Manual do Guerreiro MakeCode...",
      );

      this.capturarElementos();
      this.carregarContador();
      this.configurarEventos();
      this.atualizarContadorBugs();
      this.configurarEfeitosVisuais();
      this.inicializado = true;

      this.dispararEvento("makecode:pronto");
      console.log("✅ [MakeCodeModule] Manual do Guerreiro MakeCode pronto!");
    },

    // ========== CAPTURA ELEMENTOS ==========
    capturarElementos() {
      this.elementos.relatorioBugs = document.getElementById("relatorioBugs");
      this.elementos.btnAcharBug = document.getElementById("btnAcharBug");
      this.elementos.bugMessage = document.getElementById("bugMessage");
      this.elementos.bugCount = document.getElementById("bugCount");
    },

    // ========== CONTADOR DE BUGS ==========
    carregarContador() {
      try {
        const salvo = localStorage.getItem(this.STORAGE_KEY);
        this.bugsEncontrados = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        this.bugsEncontrados = 0;
      }
    },

    salvarContador() {
      try {
        localStorage.setItem(this.STORAGE_KEY, this.bugsEncontrados.toString());
      } catch (e) {
        console.warn("[MakeCodeModule] Não foi possível salvar o contador", e);
      }
    },

    atualizarContadorBugs() {
      // Atualiza no rodapé
      if (this.elementos.relatorioBugs) {
        this.elementos.relatorioBugs.textContent = this.bugsEncontrados;
      }

      // Atualiza no elemento específico se existir
      if (this.elementos.bugCount) {
        this.elementos.bugCount.textContent = this.bugsEncontrados;
      }

      this.salvarContador();
    },

    incrementarBugs(incremento = 1) {
      this.bugsEncontrados += incremento;
      this.atualizarContadorBugs();

      // Dispara evento para outros módulos
      this.dispararEvento("makecode:bug", {
        incremento: incremento,
        total: this.bugsEncontrados,
      });

      return this.bugsEncontrados;
    },

    // ========== DETETIVE DE BUGS ==========
    inicializarDetetiveBugs() {
      if (!this.elementos.btnAcharBug) return;

      const bugs = [
        {
          codigo: "console.log('Olá mundo'",
          erro: "Faltou fechar parênteses!",
        },
        {
          codigo: "repita 3 vezs {",
          erro: "Escreveu 'vezs' em vez de 'vezes'",
        },
        {
          codigo: "variavel = 10; variavel = 'texto'",
          erro: "Mudou o tipo da variável!",
        },
        {
          codigo: 'basic.showString("Hello!"',
          erro: "Faltou fechar aspas ou parênteses!",
        },
        {
          codigo: "input.onButtonPressed(Button.A, function() {",
          erro: "Faltou fechar a função!",
        },
      ];

      let bugIndex = 0;

      this.elementos.btnAcharBug.addEventListener("click", () => {
        const bug = bugs[bugIndex % bugs.length];
        this.incrementarBugs(1);

        if (this.elementos.bugMessage) {
          this.elementos.bugMessage.innerHTML = `
            <div class="bg-danger bg-opacity-25 p-3 rounded-4 border border-danger">
              <strong>🐛 BUG #${this.bugsEncontrados}</strong><br>
              <code>${bug.codigo}</code><br>
              <span class="text-danger">❌ ERRO: ${bug.erro}</span>
            </div>
          `;
          this.elementos.bugMessage.classList.add("bug-detectado");
          setTimeout(() => {
            if (this.elementos.bugMessage) {
              this.elementos.bugMessage.classList.remove("bug-detectado");
            }
          }, 1000);
        }

        bugIndex++;
      });
    },

    // ========== EFEITOS VISUAIS ==========
    configurarEfeitosVisuais() {
      // Animação de hover nos cards
      const cards = document.querySelectorAll(".bg-robocard");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.transition = "transform 0.3s, box-shadow 0.3s";
          card.style.transform = "translateY(-4px)";
          card.style.boxShadow = "0 12px 30px rgba(0, 0, 0, 0.5)";
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
          card.style.boxShadow = "";
        });
      });

      // Animação de digitação nos cabeçalhos
      const headers = document.querySelectorAll(".projeto-header h2");
      headers.forEach((header, index) => {
        if (!header.getAttribute("data-typed")) {
          header.setAttribute("data-typed", "true");
          const textoOriginal = header.textContent;
          // Aplica efeito de brilho apenas
          header.style.transition = "text-shadow 0.3s";
          header.addEventListener("mouseenter", () => {
            header.style.textShadow = "0 0 20px rgba(255, 180, 71, 0.5)";
          });
          header.addEventListener("mouseleave", () => {
            header.style.textShadow = "";
          });
        }
      });

      // Animação de piscar nos badges
      const badges = document.querySelectorAll(".badge-projeto");
      badges.forEach((badge, index) => {
        const delay = index * 0.2;
        badge.style.animation = `piscaBadge 2s ease-in-out ${delay}s infinite`;
      });

      // Adiciona animação para os códigos
      const codeBlocks = document.querySelectorAll(".code-block");
      codeBlocks.forEach((block) => {
        block.addEventListener("click", () => {
          // Seleciona todo o texto do código
          const range = document.createRange();
          range.selectNodeContents(block);
          const selection = window.getSelection();
          selection?.removeAllRanges();
          selection?.addRange(range);

          // Feedback visual
          block.style.borderColor = "#ffcc44";
          block.style.boxShadow = "0 0 20px rgba(255, 180, 71, 0.3)";
          setTimeout(() => {
            block.style.borderColor = "";
            block.style.boxShadow = "";
          }, 1000);

          this.mostrarToast(
            "📋 Código selecionado! Copie e cole no MakeCode.",
            "info",
          );
        });
      });
    },

    // ========== TOAST NOTIFICATION ==========
    mostrarToast(mensagem, tipo = "info") {
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

      setTimeout(() => {
        const toast = document.getElementById(toastId);
        if (toast) {
          toast.style.animation = "fadeOutRight 0.3s ease-out";
          setTimeout(() => toast.remove(), 300);
        }
      }, 3000);
    },

    // ========== BOTÃO DE TOPO ==========
    criarBotaoTopo() {
      // Verifica se já existe
      if (document.querySelector(".btn-topo-makecode")) return;

      const btnTopo = document.createElement("button");
      btnTopo.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
      btnTopo.className = "btn-topo-makecode";
      btnTopo.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
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
        if (window.scrollY > 400) {
          btnTopo.style.opacity = "1";
          btnTopo.style.visibility = "visible";
        } else {
          btnTopo.style.opacity = "0";
          btnTopo.style.visibility = "hidden";
        }
      });

      return btnTopo;
    },

    // ========== BOTÃO DE IMPRESSÃO ==========
    criarBotaoPrint() {
      if (document.querySelector(".btn-print-makecode")) return;

      const btnPrint = document.createElement("button");
      btnPrint.innerHTML = '<i class="bi bi-printer"></i> Imprimir';
      btnPrint.className = "btn-print-makecode";
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

      document.body.appendChild(btnPrint);
    },

    // ========== CONFIGURA EVENTOS ==========
    configurarEventos() {
      // Detetive de Bugs
      if (this.elementos.btnAcharBug) {
        this.inicializarDetetiveBugs();
      }

      // Botão de topo
      setTimeout(() => {
        this.criarBotaoTopo();
      }, 500);

      // Botão de impressão
      setTimeout(() => {
        this.criarBotaoPrint();
      }, 600);

      // Tecla de atalho: Ctrl + Shift + B para adicionar bug
      document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === "B") {
          e.preventDefault();
          this.incrementarBugs(1);
          this.mostrarToast(
            "🐛 Bug adicionado via tecla de atalho!",
            "warning",
          );
        }
      });

      // Escuta eventos de outros módulos
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
      });

      // Quando o usuário rolar para o final do manual
      let mensagemFinalExibida = false;
      window.addEventListener("scroll", () => {
        const scrollBottom = window.scrollY + window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollBottom >= documentHeight - 100 && !mensagemFinalExibida) {
          mensagemFinalExibida = true;
          this.mostrarToast(
            "🎉 Você chegou ao fim do Manual do Guerreiro MakeCode! Que o código esteja com você! ⚡",
            "success",
          );
        }
      });
    },

    // ========== UTILITÁRIOS ==========
    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },

    getContadorBugs() {
      return this.bugsEncontrados;
    },

    resetarBugs() {
      this.bugsEncontrados = 0;
      this.atualizarContadorBugs();
      this.mostrarToast("🔄 Contador de bugs resetado!", "info");
      return this.bugsEncontrados;
    },
  };

  // ========== ANIMAÇÕES CSS DINÂMICAS ==========
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
    @keyframes piscaBadge {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.85;
        transform: scale(1.02);
      }
    }
    @keyframes bugVibracao {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-3px) rotate(-1deg); }
      75% { transform: translateX(3px) rotate(1deg); }
    }
    .bug-detectado {
      animation: bugVibracao 0.3s ease-in-out 2;
    }
    .btn-topo-makecode:hover {
      background: #ffb347;
      color: #1e2a1a;
      transform: scale(1.1);
    }
    .btn-print-makecode:hover {
      background: #ffcc44;
      transform: scale(1.05) !important;
    }
    @media print {
      .btn-topo-makecode, .btn-print-makecode, .toast-container-custom {
        display: none !important;
      }
      .bg-robocard {
        break-inside: avoid;
        page-break-inside: avoid;
        box-shadow: none !important;
        border: 1px solid #ffb347 !important;
      }
      body.bg-robotica {
        background: white !important;
        padding: 0 !important;
      }
      .manual-content {
        background: white !important;
        color: #1e2a1a !important;
      }
      .manual-content p, .manual-content li {
        color: #1e2a1a !important;
      }
      .manual-content h1, .manual-content h2, .manual-content h3 {
        color: #2c5e1f !important;
      }
      .code-block {
        background: #f0f0f0 !important;
        color: #1e2a1a !important;
        border: 1px solid #4a7c3f !important;
      }
      .code-block code {
        color: #1e2a1a !important;
      }
      .aviso-container {
        border-color: #e74c3c !important;
        background: #fce4e4 !important;
      }
      .aviso-container h3 {
        color: #e74c3c !important;
      }
      .aviso-container p {
        color: #1e2a1a !important;
      }
      .table-robotica {
        background: white !important;
        color: #1e2a1a !important;
      }
      .table-robotica th, .table-robotica td {
        border-color: #4a7c3f !important;
        color: #1e2a1a !important;
      }
      .table-robotica thead th {
        background: #4a7c3f !important;
        color: white !important;
      }
      .projeto-header {
        background: #4a7c3f !important;
        border-left: 8px solid #ffb347 !important;
      }
      .projeto-header h2 {
        color: white !important;
      }
      .badge-projeto {
        background: #ffb347 !important;
        color: #1e2a1a !important;
      }
      .selo-sucata {
        background: #ffb347 !important;
        color: #1e2a1a !important;
      }
      .subTitulo-chiclete {
        color: #4a7c3f !important;
      }
    }
  `;
  document.head.appendChild(style);

  // ========== REGISTRO NO CONTROLADOR ==========
  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("makecode", MakeCodeModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("makecode", MakeCodeModule);
      }
    });
    setTimeout(() => {
      if (!MakeCodeModule.inicializado) MakeCodeModule.init();
    }, 800);
  }

  window.MakeCodeModule = MakeCodeModule;
})();
