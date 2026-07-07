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
