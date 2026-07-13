// ==================================================
// a5bim1_hardware.js - 5º ANO - 1º BIMESTRE
// FUNÇÕES, LÓGICA E MICRO:BIT
// Módulo integrado com todas as funcionalidades
// ==================================================

(function () {
  "use strict";

  // ==================================================
  // 1. PLANOS DE AULA - MÓDULO
  // ==================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "a5bim1_hardware_planos_concluidas",
    totalSemanas: 10,

    elementos: {
      expandirBtn: null,
      recolherBtn: null,
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
      accordionContainer: null,
    },

    init() {
      if (this.inicializado) return;

      if (!document.getElementById("accordionAulas")) {
        console.log("⏳ PlanosAulaModule: accordion não encontrado, ignorando...");
        return;
      }

      console.log("📚 [PlanosAulaModule] Inicializando...");
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.configurarEfeitosHover();
      this.inicializado = true;
      console.log("✅ [PlanosAulaModule] Pronto!");
    },

    capturarElementos() {
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.accordionContainer = document.getElementById("accordionAulas");

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
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
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
    },

    expandirTodos() {
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");
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
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");
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
      const acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
      const semana = cb.getAttribute("data-semana") || "";
      this.mostrarToast(`${acao} Semana ${semana}`, cb.checked ? "success" : "warning");
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

    configurarEventos() {
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.addEventListener("click", () => this.expandirTodos());
      }
      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.addEventListener("click", () => this.recolherTodos());
      }
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
    }
  };

  // ==================================================
  // 2. CERTIFICADO - MÓDULO
  // ==================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "a5bim1_hardware_certificados",

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

      if (!document.getElementById("listaAlunos") && !document.querySelector(".cadastro-alunos")) {
        console.log("⏳ CertificadoModule: página não identificada, ignorando...");
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
      console.log("✅ [CertificadoModule] Pronto!");
    },

    carregarElementos() {
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimirTodos = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreviewAluno = document.getElementById("btnPreviewAluno");
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
        this.alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA", "MARIA CLARA SILVA"];
        this.salvarAlunos();
      }
    },

    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
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
        this.elementos.btnPreviewAluno.disabled = nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
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
      this.elementos.inputNome.value = "";
      this.elementos.inputNome.focus();
      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.elementos.previewNome && this.elementos.previewNome.textContent === this.alunos[index]) {
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
        listaUl.innerHTML = '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
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

      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });

      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
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
                        <h3>🏆 CERTIFICADO DE MESTRE DOS PARAFUSOS PENSANTES</h3>
                        <p>Certificamos que</p>
                        <strong class="nome">${this.escapeHtml(nome)}</strong>
                        <p>concluiu com êxito o <strong>5º ANO - ROBÓTICA EDUCACIONAL</strong><br>
                        🔁 FUNÇÕES | 📦 PARÂMETROS | 🪆 ANINHAMENTO | 🔀 OPERADORES LÓGICOS | 🖐️ SENSORES | 🐛 DEPURAÇÃO</p>
                        <hr>
                        <p>RobôMestres do Paraná • ${data}</p>
                        <p style="font-size:11px; font-style:italic;">"Agora você já pode chamar a função SALVAR_O_MUNDO()!"</p>
                        <div style="margin-top:10px;">🤖 Ass: Robô Zé 3.0</div>
                    </div>
                </div>
                <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
            </body>
            </html>`;
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nomeAluno, dataAtual);
      const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
      }
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
                        <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DOS PARAFUSOS PENSANTES</h3>
                        <p style="color:#4a6e2c;">Certificamos que</p>
                        <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
                        <p style="color:#4a6e2c;">concluiu o <strong>5º ANO - ROBÓTICA EDUCACIONAL</strong><br>
                        🔁 FUNÇÕES | 📦 PARÂMETROS | 🪆 ANINHAMENTO | 🔀 OPERADORES LÓGICOS | 🖐️ SENSORES | 🐛 DEPURAÇÃO</p>
                        <hr style="margin:12px 0; border:1px solid #ffb347;">
                        <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
                        <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Agora você já pode chamar a função SALVAR_O_MUNDO()!"</p>
                        <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 3.0</div>
                    </div>
                `;
      });

      const htmlLote = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Certificados RobôMestres - 5º Ano</title>
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
        this.elementos.btnAdicionar.addEventListener("click", () => this.adicionarAluno());
      }
      if (this.elementos.inputNome) {
        this.elementos.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      }
      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.addEventListener("click", () => this.imprimirTodosCertificados());
      }
      if (this.elementos.btnPreviewAluno) {
        this.elementos.btnPreviewAluno.addEventListener("click", () => this.previewAlunoSelecionado());
      }
    }
  };

  // ==================================================
  // 3. CABEÇALHO - MÓDULO
  // ==================================================
  const CabecalhoModule = {
    contadorBugs: 0,
    inicializado: false,

    init() {
      if (this.inicializado) return;
      this.contadorBugs = this.carregarContador();
      this.atualizarDisplayContador();
      this.configurarEventos();
      this.inicializado = true;
      console.log("🤖 [CABEÇALHO] Módulo inicializado");
    },

    carregarContador() {
      try {
        const salvo = localStorage.getItem("a5bim1_hardware_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    salvarContador() {
      try {
        localStorage.setItem("a5bim1_hardware_contador_bugs", this.contadorBugs.toString());
      } catch (e) {
        console.warn("Não foi possível salvar o contador", e);
      }
    },

    atualizarDisplayContador() {
      const relatorio = document.getElementById("relatorioBugs");
      if (relatorio) {
        relatorio.innerHTML = `🤯 ${this.contadorBugs}`;
      }
    },

    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      return this.contadorBugs;
    },

    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      return this.contadorBugs;
    },

    getContadorBugs() {
      return this.contadorBugs;
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
      });
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
      });
    }
  };

  // ==================================================
  // 4. INICIALIZAÇÃO
  // ==================================================
  function initAll() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        PlanosAulaModule.init();
        CertificadoModule.init();
        CabecalhoModule.init();
      });
    } else {
      PlanosAulaModule.init();
      CertificadoModule.init();
      CabecalhoModule.init();
    }
  }

  // Expor módulos globalmente
  window.PlanosAulaModule = PlanosAulaModule;
  window.CertificadoModule = CertificadoModule;
  window.CabecalhoModule = CabecalhoModule;

  initAll();

  console.log("%c🤖 ROBOZADA 3000 - 5º ANO - 1º BIMESTRE ATIVO", "color: #ffb347; font-size: 14px; font-family: monospace;");
  console.log("%c🔁 Funções, Lógica e Micro:bit - A Revolução dos Parafusos Pensantes!", "color: #9bbc7b;");

})();

// ============================================================
// função independente para imprimir planos de aula (accordion)
// ============================================================

/**
 * Função principal de impressão dos planos de aula.
 * @param {string} containerId - ID do elemento que contém os itens do accordion.
 * @param {boolean} apenasSelecionadas - Se true, imprime apenas as aulas marcadas como concluídas.
 */
function imprimirPlanosAula(containerId = "accordionAulas", apenasSelecionadas = false) {
  // 1. Obtém o container
  const container = document.getElementById(containerId);
  if (!container) {
    alert("🤖 Container de planos de aula não encontrado.");
    return;
  }

  // 2. Seleciona todos os itens do accordion
  const itens = container.querySelectorAll(".accordion-item");
  if (itens.length === 0) {
    alert("🤖 Nenhum plano de aula encontrado.");
    return;
  }

  // 3. Filtra os itens conforme a opção
  let itensParaImprimir = [];
  itens.forEach((item) => {
    const checkbox = item.querySelector(".semana-check");
    const isChecked = checkbox ? checkbox.checked : false;
    if (!apenasSelecionadas || (apenasSelecionadas && isChecked)) {
      itensParaImprimir.push(item);
    }
  });

  if (itensParaImprimir.length === 0) {
    alert("🤖 Nenhuma aula selecionada. Marque pelo menos uma como concluída.");
    return;
  }

  // 4. Coleta informações para o cabeçalho
  const headerEl = document.querySelector("#aulas .projeto-header h2");
  const titulo = headerEl ? headerEl.innerHTML : "Planos de Aula - 5º Ano";
  const subtituloEl = document.querySelector("#aulas .badge-projeto");
  const subtitulo = subtituloEl ? subtituloEl.textContent : "Funções, Lógica e Micro:bit";

  const agora = new Date();
  const dataStr = agora.toLocaleDateString("pt-BR");
  const horaStr = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // 5. Gera o HTML de cada item
  let conteudoHTML = "";
  itensParaImprimir.forEach((item, index) => {
    const clone = item.cloneNode(true);

    // Remove elementos interativos
    clone.querySelectorAll(".semana-check, .check-concluido, .d-flex .btn, .accordion-button").forEach(el => el.remove());

    // Expande o collapse
    const collapse = clone.querySelector(".accordion-collapse");
    if (collapse) {
      collapse.classList.add("show");
      collapse.style.display = "block";
    }

    // Converte o cabeçalho (botão) em texto
    const headerBtn = clone.querySelector(".accordion-header .accordion-button");
    if (headerBtn) {
      const span = document.createElement("span");
      span.className = "accordion-header-text";
      span.innerHTML = headerBtn.innerHTML;
      headerBtn.parentNode.replaceChild(span, headerBtn);
    }

    // Adiciona numeração
    const header = clone.querySelector(".accordion-header");
    if (header) {
      const num = document.createElement("span");
      num.className = "badge bg-secondary me-2";
      num.textContent = `${index + 1}/${itensParaImprimir.length}`;
      header.prepend(num);
    }

    conteudoHTML += clone.outerHTML;
  });

  // 6. Monta a página de impressão
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Planos de Aula - Impressão</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Press+Start+2P&family=Chakra+Petch:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    /* Reset e base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: white; color: #1e2a1a; padding: 20px; line-height: 1.5; }
    .print-container { max-width: 1100px; margin: 0 auto; }
    .print-header { border-bottom: 3px solid #ffb347; padding-bottom: 10px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
    .print-header h1 { font-family: 'Press Start 2P', cursive; font-size: 1.2rem; color: #2c3e2b; margin: 0; }
    .print-header .badge { font-size: 0.8rem; background: #ffb347; color: #1e2a1a; }
    .print-header .data-hora { font-size: 0.8rem; color: #6c7a7a; }
    .accordion-item { border: 1px solid #ccc; border-radius: 12px; margin-bottom: 20px; page-break-inside: avoid; }
    .accordion-header { background: #f5f5f5; padding: 12px 16px; border-bottom: 1px solid #ddd; border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 10px; }
    .accordion-header-text { font-weight: bold; font-size: 1rem; font-family: 'Chakra Petch', monospace; color: #2c3e2b; }
    .accordion-body { padding: 16px; background: white; }
    .semana-card-completo { padding: 8px; }
    .semana-card-completo h5 { color: #2c3e2b; margin-top: 16px; margin-bottom: 8px; font-weight: 700; border-left: 4px solid #ffb347; padding-left: 12px; }
    .semana-card-completo ul, .semana-card-completo p { margin-bottom: 12px; }
    .materiais-container { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .material-badge { background: #f0f0f0; padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; border-left: 2px solid #ffb347; display: inline-flex; align-items: center; gap: 4px; }
    .minuto-item { display: flex; margin-bottom: 10px; background: #f9f9f9; border-radius: 12px; overflow: hidden; border-left: 4px solid #ffb347; }
    .minuto-tempo { background: #e9e9e9; padding: 6px 12px; font-weight: bold; font-family: 'Press Start 2P', cursive; font-size: 0.6rem; min-width: 90px; text-align: center; color: #2c3e2b; }
    .minuto-descricao { padding: 6px 12px; flex: 1; }
    .frase-do-dia { background: #f5f5f5; border-radius: 12px; padding: 8px 16px; margin-top: 16px; text-align: center; font-style: italic; border: 1px dashed #ffb347; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 8px; white-space: pre-wrap; word-break: break-word; border-left: 4px solid #ffb347; }
    code { font-family: 'Courier New', monospace; font-size: 0.85rem; }
    .table-robotica { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
    .table-robotica th, .table-robotica td { border: 1px solid #ccc; padding: 6px 8px; text-align: left; font-size: 0.85rem; }
    .table-robotica th { background: #f0f0f0; font-weight: bold; }
    .badge-projeto { background: #e74c3c; color: white; padding: 2px 10px; border-radius: 20px; font-size: 0.7rem; display: inline-block; }
    .print-footer { margin-top: 30px; border-top: 2px solid #ccc; padding-top: 10px; text-align: center; font-size: 0.7rem; color: #6c7a7a; }
    .btn, .progress-container, .check-concluido, .d-flex.gap-2, .navbar, .cabecalho-robotico, footer { display: none !important; }
    @media print { body { padding: 0.5cm; margin: 0; } .accordion-item { page-break-inside: avoid; } }
    @media (max-width: 600px) { .minuto-item { flex-direction: column; } .minuto-tempo { min-width: auto; text-align: left; } }
  </style>
</head>
<body>
  <div class="print-container">
    <div class="print-header">
      <div>
        <h1>${titulo}</h1>
        <span class="badge">${subtitulo}</span>
      </div>
      <div class="data-hora">
        <i class="bi bi-calendar"></i> ${dataStr} &nbsp;|&nbsp; <i class="bi bi-clock"></i> ${horaStr}
        <br><span class="badge bg-secondary">${itensParaImprimir.length} aula(s)</span>
      </div>
    </div>
    ${conteudoHTML}
    <div class="print-footer">
      <i class="bi bi-robot"></i> Robótica Educacional - 5º Ano | Gerado em ${dataStr} às ${horaStr}
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 300);
    };
  <\/script>
</body>
</html>`;

  // 7. Abre a janela
  const win = window.open("", "_blank", "width=1024,height=800,toolbar=no,menubar=no,scrollbars=yes");
  if (win) {
    win.document.write(html);
    win.document.close();
  } else {
    alert("⚠️ Permita pop-ups para imprimir.");
  }
}
