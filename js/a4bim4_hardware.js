// ==================================================
// a4bim4_hardware.js - Scripts completos para o 4º Ano - 4º Bimestre
// Projeto Autoral de Hardware
// Consolidado a partir dos modelos anexos
// ==================================================

(function () {
  "use strict";

  // ==================================================
  // MÓDULO: Controle do Menu (modelo_menu_bim.js)
  // ==================================================
  const MenuModule = {
    inicializado: false,

    init() {
      if (this.inicializado) return;
      this.highlightCurrentPage();
      this.consoleWelcome();
      this.initTooltips();
      this.inicializado = true;
      console.log(
        "%c🤖 [MENU] Módulo inicializado",
        "color: #ffb347; font-size: 12px;",
      );
    },

    highlightCurrentPage() {
      const currentPath =
        window.location.pathname.split("/").pop() || "a4bim4_hardware.html";
      const navLinks = document.querySelectorAll(".menu-robomestre .nav-link");
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === currentPath) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },

    consoleWelcome() {
      console.log(
        "%c🤖 ROBOZADA 4000 - 4º ANO - 4º BIMESTRE ATIVO",
        "color: #ffb347; font-size: 14px; font-family: monospace;",
      );
      console.log(
        "%c🔧 Projeto Autoral de Hardware - Montando robôs que resolvem problemas reais!",
        "color: #9bbc7b;",
      );
    },

    initTooltips() {
      const devEmails = document.querySelectorAll(".dev-contato a");
      if (devEmails.length) {
        devEmails.forEach((email) => {
          email.setAttribute("title", "Clique para enviar e-mail");
          email.style.cursor = "pointer";
        });
      }
    },
  };

  // ==================================================
  // MÓDULO: Planos de Aula (modelo_planos_aula.js)
  // ==================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_4ano_hardware",
    totalSemanas: 10,
    elementos: {
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
      expandirBtn: null,
      recolherBtn: null,
      accordionContainer: null,
    },

    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta
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
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      this.elementos.accordionContainer =
        document.getElementById("accordionAulas");

      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
    },

    salvarProgresso() {
      const concluidas = {};
      this.elementos.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) {
          concluidas[semana] = cb.checked;
        } else {
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
      this.dispararEvento("planosAula:progressoAtualizado", {
        concluidas: marcados,
        total: this.totalSemanas,
        percentual: percentual,
      });
    },

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
            collapse.classList.add("show");
          }
        } else {
          collapse.classList.add("show");
        }
      });
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
            collapse.classList.remove("show");
          }
        } else {
          collapse.classList.remove("show");
        }
      });
      this.mostrarToast("📕 Todos os planos de aula recolhidos!", "info");
    },

    handleCheckboxChange(e) {
      const cb = e.target;
      this.salvarProgresso();
      this.atualizarBarraProgresso();
      const semana =
        cb.getAttribute("data-semana") ||
        `semana_${Array.from(this.elementos.checkboxes).indexOf(cb) + 1}`;
      const acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
      this.mostrarToast(
        `${acao} Semana ${semana}`,
        cb.checked ? "success" : "warning",
      );
    },

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
        this.dispararEvento("planosAula:progressoResetado");
      }
    },

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

    configurarEventos() {
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.addEventListener("click", () =>
          this.expandirTodos(),
        );
      }
      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.addEventListener("click", () =>
          this.recolherTodos(),
        );
      }
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });

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

  // ==================================================
  // MÓDULO: Rodapé (modelo_rodape.js)
  // ==================================================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,
    dataElement: null,

    init() {
      if (this.inicializado) return;

      this.relatorioElement = document.getElementById("relatorioBugs");
      this.dataElement = document.getElementById("dataAtualizacao");

      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }
      if (this.dataElement) {
        this.atualizarData();
      }

      this.configurarEventos();
      this.inicializado = true;
      console.log(
        "%c🤖 [RODAPÉ] Módulo inicializado",
        "color: #ffb347; font-size: 12px;",
      );
    },

    atualizarRelatorio() {
      if (!this.relatorioElement) return;

      let contadorBugs = 0;
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        contadorBugs = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        contadorBugs = 0;
      }

      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    atualizarData() {
      if (!this.dataElement) return;
      const hoje = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      this.dataElement.textContent = hoje;
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
    },

    sincronizar() {
      this.atualizarRelatorio();
      this.atualizarData();
    },
  };

  // ==================================================
  // MÓDULO: Apresentação do Bimestre (modelo_apresentacao_bimestre.js)
  // ==================================================
  const ApresentacaoModule = {
    inicializado: false,

    init() {
      if (this.inicializado) return;

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
      this.configurarEfeitosVisuais();
      this.inicializarContadorSemanas();
      this.criarBotaoTopo();
      this.inicializado = true;
      this.dispararEvento("apresentacao:pronto");
      console.log("✅ [ApresentacaoModule] Pronto!");
    },

    configurarEfeitosVisuais() {
      const cartaContainer = document.querySelector(".carta-container");
      if (cartaContainer) {
        const paragrafos = cartaContainer.querySelectorAll(".carta-texto, p");
        paragrafos.forEach((p, index) => {
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
      }

      const tabelas = document.querySelectorAll(
        "#mapeamento table, #plano-sintetico table",
      );
      tabelas.forEach((tabela) => {
        const linhas = tabela.querySelectorAll("tbody tr");
        linhas.forEach((linha) => {
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

      const badges = document.querySelectorAll(".badge-projeto, .selo-sucata");
      badges.forEach((badge, index) => {
        badge.style.animation = `flutuarBadge ${2 + index * 0.3}s ease-in-out infinite`;
        badge.style.transformOrigin = "center";
      });
    },

    inicializarContadorSemanas() {
      const tabela = document.querySelector("#plano-sintetico table");
      if (!tabela) return;

      const linhas = tabela.querySelectorAll("tbody tr");
      const totalSemanas = linhas.length;

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
    },

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

      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          btnTopo.style.opacity = "1";
          btnTopo.style.visibility = "visible";
        } else {
          btnTopo.style.opacity = "0";
          btnTopo.style.visibility = "hidden";
        }
      });
    },

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  // ==================================================
  // INJEÇÃO DE ANIMAÇÕES CSS DINÂMICAS
  // ==================================================
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes flutuarBadge {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
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
    @keyframes piscaLed {
      0%, 100% { opacity: 1; text-shadow: 0 0 5px #00ff00; }
      50% { opacity: 0.4; text-shadow: 0 0 15px #ffcc00; }
    }
    @keyframes glowPulse {
      0% { text-shadow: 0 0 2px #ffb347; }
      100% { text-shadow: 0 0 8px #ffcc44; }
    }
    .pisca-alerta {
      animation: piscaLed 1s step-start infinite;
      color: #ffcc00;
      font-weight: bold;
      background: rgba(0,0,0,0.3);
      padding: 0.1rem 0.3rem;
      border-radius: 8px;
      display: inline-block;
    }
    .toast-container-custom {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }
  `;
  document.head.appendChild(style);

  // ==================================================
  // INICIALIZAÇÃO DOS MÓDULOS
  // ==================================================

  // Função para inicializar todos os módulos
  function initAllModules() {
    MenuModule.init();
    PlanosAulaModule.init();
    RodapeModule.init();
    ApresentacaoModule.init();

    // Dispara evento de pronto
    window.dispatchEvent(new CustomEvent("a4bim4:pronto"));
    console.log(
      "%c🚀 [a4bim4] Todos os módulos inicializados com sucesso!",
      "color: #2ecc71; font-size: 14px; font-weight: bold;",
    );
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllModules);
  } else {
    initAllModules();
  }

  // ==================================================
  // EXPOSIÇÃO DOS MÓDULOS GLOBALMENTE
  // ==================================================
  window.MenuModule = MenuModule;
  window.PlanosAulaModule = PlanosAulaModule;
  window.RodapeModule = RodapeModule;
  window.ApresentacaoModule = ApresentacaoModule;

  // ==================================================
  // CONTADOR DE BUGS (compatibilidade com cabeçalho)
  // ==================================================
  const CabecalhoModule = {
    contadorBugs: 0,

    init() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        this.contadorBugs = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        this.contadorBugs = 0;
      }
    },

    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.salvarContador();
      return this.contadorBugs;
    },

    resetarBugs() {
      this.contadorBugs = 0;
      this.salvarContador();
      return this.contadorBugs;
    },

    getContadorBugs() {
      return this.contadorBugs;
    },

    salvarContador() {
      try {
        localStorage.setItem(
          "cabecalho_contador_bugs",
          this.contadorBugs.toString(),
        );
      } catch (e) {
        console.warn("Não foi possível salvar o contador", e);
      }
    },
  };

  CabecalhoModule.init();
  window.CabecalhoModule = CabecalhoModule;

  // ==================================================
  // MÓDULO: Certificado (modelo_certificado.js)
  // ==================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano4_hardware",

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

    init() {
      if (this.inicializado) return;

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
          '<li class="text-muted text-center" style="color: #ebf0eb !important;">Nenhum aluno cadastrado ainda 🤖</li>';
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
                    <h3>🏆 CERTIFICADO DE ENGENHEIRO(A) DE ROBÔS - 4º ANO</h3>
                    <p>Certificamos que</p>
                    <strong class="nome">${this.escapeHtml(nome)}</strong>
                    <p>concluiu com êxito o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
                    🔧 HARDWARE | 🧠 ALGORITMOS | 🔀 DECISÕES | 🔁 LOOPS | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
                    <hr>
                    <p>RobôMestres do Paraná • ${data}</p>
                    <p style="font-size:11px; font-style:italic;">"Engenheiro não nasce pronto, se constrói com loops, LEDs e muito café!"</p>
                    <div style="margin-top:10px;">🤖 Ass: Robô Zé 4.0</div>
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
                    <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE ENGENHEIRO(A) DE ROBÔS - 4º ANO</h3>
                    <p style="color:#4a6e2c;">Certificamos que</p>
                    <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
                    <p style="color:#4a6e2c;">concluiu o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
                    🔧 HARDWARE | 🧠 ALGORITMOS | 🔀 DECISÕES | 🔁 LOOPS | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
                    <hr style="margin:12px 0; border:1px solid #ffb347;">
                    <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
                    <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Engenheiro não nasce pronto, se constrói com loops, LEDs e muito café!"</p>
                    <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
                </div>
            `;
      });

      const htmlLote = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Certificados RobôMestres - 4º Ano</title>
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

  // Inicializa o módulo de certificado
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      CertificadoModule.init(),
    );
  } else {
    setTimeout(() => CertificadoModule.init(), 300);
  }

  // Registra globalmente
  window.CertificadoModule = CertificadoModule;

  // ==================================================
  // EVENTO PARA RELÓGIO EM TEMPO REAL
  // ==================================================
  setInterval(() => {
    const dataElement = document.getElementById("dataAtualizacao");
    if (dataElement) {
      const agora = new Date().toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      dataElement.textContent = agora;
    }
  }, 60000);
})();
