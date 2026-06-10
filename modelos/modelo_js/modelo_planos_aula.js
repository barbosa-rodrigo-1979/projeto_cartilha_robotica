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
        console.log("⏳ PlanosAulaModule: accordion não encontrado, ignorando...");
        return;
      }

      console.log("📚 [PlanosAulaModule] Inicializando módulo interativo...");

      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.configurarEfeitosHover();
      this.inicializado = true;

      this.dispararEvento("planosAula:pronto");
      console.log("✅ [PlanosAulaModule] Pronto! Total de semanas:", this.totalSemanas);
    },

    capturarElementos() {
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.accordionContainer = document.getElementById("accordionAulas");

      // Se não encontrou checkboxes, tenta buscar por classe alternativa
      if (this.elementos.checkboxes.length === 0) {
        this.elementos.checkboxes = document.querySelectorAll("input[type='checkbox'].semana-check, input.check-concluido");
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
      const percentual = this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;

      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent = Math.round(percentual) + "%";
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
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");

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
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");

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
      const semana = cb.getAttribute("data-semana") ||
        `semana_${Array.from(this.elementos.checkboxes).indexOf(cb) + 1}`;

      this.salvarProgresso();
      this.atualizarBarraProgresso();

      // Mensagem de feedback
      const acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
      this.mostrarToast(`${acao} Semana ${semana}`, cb.checked ? "success" : "warning");
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
      const bgColor = tipo === "success" ? "#2ecc71" : tipo === "warning" ? "#f39c12" : "#3498db";

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
      if (confirm("⚠️ ATENÇÃO! Isso irá marcar TODAS as aulas como NÃO concluídas. Deseja continuar?")) {
        this.elementos.checkboxes.forEach((cb) => {
          cb.checked = false;
        });
        this.salvarProgresso();
        this.atualizarBarraProgresso();
        this.mostrarToast("🔄 Progresso resetado! Todas as aulas foram marcadas como pendentes.", "warning");
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
        percentual: this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0,
      };
    },

    // ========== EVENTOS ==========
    configurarEventos() {
      // Botões expandir/recolher
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.removeEventListener("click", this._handleExpandir);
        this.elementos.expandirBtn.addEventListener("click", () => this.expandirTodos());
      }

      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.removeEventListener("click", this._handleRecolher);
        this.elementos.recolherBtn.addEventListener("click", () => this.recolherTodos());
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
  if (window.Controlador && typeof window.Controlador.registrarModulo === "function") {
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
