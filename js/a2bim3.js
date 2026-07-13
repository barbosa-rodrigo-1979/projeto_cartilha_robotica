// ==================================================
// a2bim3.js – Scripts unificados para o 3º bimestre
// ==================================================

(function () {
  "use strict";

  // ============================================================
  // 1. MÓDULO CABEÇALHO
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
    },

    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) { return 0; }
    },

    salvarContador() {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs.toString());
      } catch (e) { }
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
      return this.contadorBugs;
    },

    getContadorBugs() { return this.contadorBugs; },

    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(() => {
          if (this.contadorElement) {
            this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
            setTimeout(() => {
              if (this.contadorElement) this.contadorElement.style.animation = "";
            }, 300);
          }
        }, 10);
      }
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

  // ============================================================
  // 2. MÓDULO MENU BIMESTRAL
  // ============================================================
  const MenuModule = {
    init() {
      const currentPath = window.location.pathname.split("/").pop() || "a2bim3.html";
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
  };

  // ============================================================
  // 3. MÓDULO PLANOS DE AULA
  // ============================================================
  const PlanosAulaModule = {
    STORAGE_KEY: "planoAula_Concluidas_2ano_bim3",
    totalSemanas: 10,
    inicializado: false,

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("accordionAulas")) return;
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.configurarEfeitosHover();
      this.inicializado = true;
    },

    capturarElementos() {
      this.checkboxes = document.querySelectorAll(".semana-check");
      this.barraProgresso = document.getElementById("barraProgresso");
      this.progressoTexto = document.getElementById("progressoTexto");
      if (this.checkboxes.length > 0) {
        this.totalSemanas = this.checkboxes.length;
      }
    },

    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          this.checkboxes.forEach((cb) => {
            const semana = cb.getAttribute("data-semana");
            if (semana && concluidas.hasOwnProperty(semana)) {
              cb.checked = concluidas[semana];
            }
          });
        } catch (e) { }
      }
      this.atualizarBarraProgresso();
    },

    getTotalMarcados() {
      let marcados = 0;
      this.checkboxes.forEach((cb) => { if (cb.checked) marcados++; });
      return marcados;
    },

    atualizarBarraProgresso() {
      const marcados = this.getTotalMarcados();
      const percentual = this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
      if (this.barraProgresso) {
        this.barraProgresso.style.width = percentual + "%";
        this.barraProgresso.textContent = Math.round(percentual) + "%";
      }
      if (this.progressoTexto) {
        this.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
      }
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

    handleCheckboxChange(e) {
      this.salvarProgresso();
      this.atualizarBarraProgresso();
    },

    expandirTodos() {
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");
      collapses.forEach((collapse) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.show();
          } catch (e) { collapse.classList.add("show"); }
        } else {
          collapse.classList.add("show");
        }
      });
    },

    recolherTodos() {
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");
      collapses.forEach((collapse) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.hide();
          } catch (e) { collapse.classList.remove("show"); }
        } else {
          collapse.classList.remove("show");
        }
      });
    },

    configurarEventos() {
      this.checkboxes.forEach((cb) => {
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
      const expandirBtn = document.getElementById("expandirTodosBtn");
      const recolherBtn = document.getElementById("recolherTodosBtn");
      if (expandirBtn) expandirBtn.addEventListener("click", () => this.expandirTodos());
      if (recolherBtn) recolherBtn.addEventListener("click", () => this.recolherTodos());
    }
  };
  // ============================================================
  // 4. MÓDULO CERTIFICADO
  // ============================================================
  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano2_bim3",
    inicializado: false,

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("listaAlunos")) return;
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializado = true;
    },

    carregarElementos() {
      this.inputNome = document.getElementById("nomeAluno");
      this.btnAdicionar = document.getElementById("btnAdicionar");
      this.listaAlunos = document.getElementById("listaAlunos");
      this.contadorAlunos = document.getElementById("contadorAlunos");
      this.btnImprimirTodos = document.getElementById("btnImprimirCertificados");
      this.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.previewNome = document.getElementById("previewNomeAluno");
      this.previewData = document.getElementById("previewData");
    },

    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try { this.alunos = JSON.parse(salvos); } catch (e) { this.alunos = []; }
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
      if (this.previewData) {
        this.previewData.textContent = new Date().toLocaleDateString("pt-BR");
      }
    },

    atualizarEstadoBotoes() {
      if (this.btnImprimirTodos) {
        this.btnImprimirTodos.disabled = this.alunos.length === 0;
      }
      if (this.btnPreviewAluno) {
        const nomePreview = this.previewNome?.textContent || "";
        this.btnPreviewAluno.disabled = nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
    },

    adicionarAluno() {
      if (!this.inputNome) return;
      let nome = this.inputNome.value.trim();
      if (!nome) { alert("🤖 Digite o nome do aluno(a) primeiro!"); return; }
      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();
      if (this.alunos.includes(nome)) { alert("⚠️ Este aluno já está na lista!"); return; }
      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarLista();
      this.inputNome.value = "";
      this.inputNome.focus();
      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        const nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.previewNome && this.previewNome.textContent === nomeRemovido) {
          this.previewNome.textContent = "[NOME DO ALUNO]";
        }
        this.atualizarEstadoBotoes();
      }
    },

    selecionarAlunoPreview(nome) {
      if (this.previewNome) {
        this.previewNome.textContent = nome;
      }
      this.atualizarEstadoBotoes();
    },

    atualizarLista() {
      if (!this.listaAlunos) return;
      if (this.alunos.length === 0) {
        this.listaAlunos.innerHTML = '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (this.contadorAlunos) this.contadorAlunos.textContent = "0";
        return;
      }
      this.listaAlunos.innerHTML = "";
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
        this.listaAlunos.appendChild(li);
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
      if (this.contadorAlunos) this.contadorAlunos.textContent = this.alunos.length;
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nomeAluno)}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Courier New',monospace; background:#e0e0e0; min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
  .preview-container { max-width:800px; width:100%; margin:0 auto; }
  .preview-actions { text-align:center; margin-bottom:20px; position:sticky; top:10px; z-index:100; }
  .btn-print, .btn-close { background:#ffb347; border:none; border-radius:40px; padding:10px 24px; font-weight:bold; cursor:pointer; margin:0 8px; }
  .btn-close { background:#555; color:white; }
  .certificado { border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:30px; text-align:center; background:#fffef7; box-shadow:0 20px 40px rgba(0,0,0,0.2); }
  .certificado h3 { color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.9rem; margin-bottom:20px; }
  .certificado p { color:#4a6e2c; margin:10px 0; }
  .certificado strong.nome { font-size:22px; display:block; margin:15px 0; color:#2c5e1f; background:#fff0cc; padding:12px; border-radius:40px; }
  .certificado hr { margin:20px 0; border:1px solid #ffb347; }
  @media print { body { background:white; } .preview-actions { display:none; } @page { size:A4; margin:1.5cm; } }
</style>
</head>
<body>
<div class="preview-container">
  <div class="preview-actions">
    <button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button>
    <button class="btn-close" onclick="window.close();">✖️ FECHAR</button>
  </div>
  <div class="certificado">
    <h3>🏆 CERTIFICADO DE MESTRE DO SCRATCHJR - NÍVEL 3</h3>
    <p>Certificamos que</p>
    <strong class="nome">${this.escapeHtml(nomeAluno)}</strong>
    <p>concluiu com êxito o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>
    🔁 LOOP | 🎯 EVENTOS | 🧠 CONDICIONAIS | 🐛 DEPURAÇÃO | 🎮 JOGO CONDICIONAL</p>
    <hr>
    <p>RobôMestres do Paraná • ${dataAtual}</p>
    <p style="font-size:11px; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
    <div style="margin-top:10px;">🤖 Ass: Robô Zé 2.0</div>
  </div>
</div>
<script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
</body>
</html>`;
      const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
      if (win) { win.document.write(html); win.document.close(); }
      else { alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado."); }
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO SCRATCHJR - NÍVEL 3</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 🎯 EVENTOS | 🧠 CONDICIONAIS | 🐛 DEPURAÇÃO | 🎮 JOGO CONDICIONAL</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 2.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Certificados RobôMestres - 2º Ano</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Courier New',monospace; background:white; padding:20px; }
  .print-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  @media print { body { padding:0; margin:0; } .print-grid { gap:15px; } @page { size:A4; margin:0.8cm; } }
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
      if (win) { win.document.write(htmlLote); win.document.close(); }
      else { alert("⚠️ Permita pop-ups para gerar os certificados em lote."); }
    },

    previewAlunoSelecionado() {
      const nomeSelecionado = this.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    configurarEventos() {
      if (this.btnAdicionar) {
        this.btnAdicionar.addEventListener("click", () => this.adicionarAluno());
      }
      if (this.inputNome) {
        this.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      }
      if (this.btnImprimirTodos) {
        this.btnImprimirTodos.addEventListener("click", () => this.imprimirTodosCertificados());
      }
      if (this.btnPreviewAluno) {
        this.btnPreviewAluno.addEventListener("click", () => this.previewAlunoSelecionado());
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
    }
  };
  // ============================================================
  // 5. MÓDULO FECHAMENTO – JOGO LOOP DASH (Robô Programador)
  // ============================================================
  const FechamentoModule = {
    faseAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 0 },
    recordes: { 1: null, 2: null, 3: null },
    loopsExecutados: 0,
    bugsEncontrados: 0,
    inicializado: false,

    pistas: {
      1: {
        nome: "RETA 🏁",
        grid: [["🚶", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "🏁"]],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 1, colunas: 8 }
      },
      2: {
        nome: "ZIGUE-ZAGUE 🔄",
        grid: [
          ["🚶", "⬜", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"]
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 5, colunas: 5 }
      },
      3: {
        nome: "OBSTÁCULOS 🧱",
        grid: [
          ["🚶", "⬜", "🧱", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "🧱", "⬜", "⬜"],
          ["🧱", "⬜", "🧱", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "🧱", "⬜"],
          ["⬜", "🧱", "⬜", "⬜", "⬜", "⬜"]
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 6, colunas: 6 }
      }
    },

    elementos: {},

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("loopdashGrid")) return;
      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
      this.inicializado = true;
    },

    capturarElementos() {
      this.elementos.grid = document.getElementById("loopdashGrid");
      this.elementos.cartoesUsados = document.getElementById("loopdashCartoes");
      this.elementos.melhorMarca = document.getElementById("loopdashMelhor");
      this.elementos.status = document.getElementById("loopdashStatus");
      this.elementos.bonus = document.getElementById("loopdashBonus");
      this.elementos.algoritmoMontado = document.getElementById("algoritmoMontado");
      this.elementos.mensagem = document.getElementById("loopdashMensagem");
      this.elementos.recordeFase1 = document.getElementById("recordeFase1");
      this.elementos.recordeFase2 = document.getElementById("recordeFase2");
      this.elementos.recordeFase3 = document.getElementById("recordeFase3");
      this.elementos.faseNomeAtual = document.getElementById("faseNomeAtual");
      this.elementos.faseIconeAtual = document.getElementById("faseIconeAtual");
    },

    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.getAttribute("data-fase")) === fase) btn.classList.add("ativo");
      });
      if (this.elementos.faseNomeAtual) {
        this.elementos.faseNomeAtual.textContent = this.pistas[fase].nome;
      }
      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.elementos.faseIconeAtual) {
        this.elementos.faseIconeAtual.textContent = icones[fase];
      }
      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(`🏁 FASE ${fase}: ${this.pistas[fase].nome} selecionada! Monte seu algoritmo.`, "info");
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
      this.posicaoRobo = { x: pista.inicio.x, y: pista.inicio.y, direcao: 1 };
      this.desenharGrid();
      if (this.elementos.status) {
        this.elementos.status.textContent = "PRONTO";
        this.elementos.status.classList.remove("text-danger");
      }
    },

    adicionarCartao(comando) {
      let cartaoObj = { comando: comando, filhos: [], contador: 3 };
      if (comando === "repita") {
        cartaoObj.filhos = [];
        cartaoObj.contador = 3;
      }
      this.cartoesAlgoritmo.push(cartaoObj);
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`➕ Cartão "${this.getNomeComando(comando)}" adicionado!`, "info");
    },

    getNomeComando(comando) {
      const nomes = { ande1: "ANDE 1", ande2: "ANDE 2", vireDireita: "VIRE DIREITA", vireEsquerda: "VIRE ESQUERDA", repita: "REPITA" };
      return nomes[comando] || comando;
    },

    getIconeComando(comando) {
      const icones = { ande1: "🚶", ande2: "🏃", vireDireita: "▶️", vireEsquerda: "◀️", repita: "🔄" };
      return icones[comando] || "❓";
    },

    renderizarAlgoritmo() {
      if (!this.elementos.algoritmoMontado) return;
      this.elementos.algoritmoMontado.innerHTML = "";
      if (this.cartoesAlgoritmo.length === 0) {
        this.elementos.algoritmoMontado.innerHTML = '<div class="placeholder-algoritmo">🃏 Clique nos cartões abaixo para montar seu algoritmo...</div>';
        return;
      }
      this.cartoesAlgoritmo.forEach((cartao, idx) => {
        const cartaoDiv = this.criarCartaoElemento(cartao, idx);
        this.elementos.algoritmoMontado.appendChild(cartaoDiv);
      });
    },
    criarCartaoElemento(cartao, idx) {
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
          <span class="cartao-remove" data-idx="${idx}">✖️</span>
        `;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";
        const btnAddFilho = document.createElement("button");
        btnAddFilho.innerHTML = "+ adicionar comando";
        btnAddFilho.className = "btn-add-filho-repita";
        btnAddFilho.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaRepita(cartao);
        });
        filhosDiv.appendChild(btnAddFilho);
        if (cartao.filhos && cartao.filhos.length > 0) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx);
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
          <span class="cartao-remove" data-idx="${idx}">✖️</span>
        `;
      }
      const removeBtn = div.querySelector(".cartao-remove");
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idxRemover = parseInt(removeBtn.getAttribute("data-idx"));
          this.removerCartao(idxRemover);
        });
      }
      return div;
    },

    mostrarSelecaoComandoParaRepita(cartaoRepita) {
      const comandos = [
        { comando: "ande1", nome: "ANDE 1", icone: "🚶" },
        { comando: "ande2", nome: "ANDE 2", icone: "🏃" },
        { comando: "vireDireita", nome: "VIRE DIREITA", icone: "▶️" },
        { comando: "vireEsquerda", nome: "VIRE ESQUERDA", icone: "◀️" }
      ];
      let modalHtml = `
        <div id="modalComando" class="modal-comando-overlay">
          <div class="modal-comando-box">
            <h3>🔄 Adicionar comando ao REPITA</h3>
            <div class="modal-comando-options">
      `;
      comandos.forEach((cmd) => {
        modalHtml += `
          <button class="btn-cmd" data-comando="${cmd.comando}">
            <div class="icone">${cmd.icone}</div>
            <div class="nome">${cmd.nome}</div>
          </button>
        `;
      });
      modalHtml += `
            </div>
            <button id="btnFecharModal" class="btn-fechar-modal">FECHAR</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComando");
      document.querySelectorAll(".btn-cmd").forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.getAttribute("data-comando");
          cartaoRepita.filhos.push({ comando: comando, filhos: [] });
          this.renderizarAlgoritmo();
          if (modal) modal.remove();
          this.atualizarContadorCartoes();
          this.mostrarMensagem(`➕ Comando adicionado dentro do REPITA!`, "success");
        });
      });
      const btnFechar = document.getElementById("btnFecharModal");
      if (btnFechar) {
        btnFechar.addEventListener("click", () => { if (modal) modal.remove(); });
      }
    },

    removerCartao(idx) {
      if (this.cartoesAlgoritmo[idx]) {
        this.cartoesAlgoritmo.splice(idx, 1);
        this.renderizarAlgoritmo();
        this.atualizarContadorCartoes();
        this.mostrarMensagem(`🗑️ Cartão removido!`, "info");
      }
    },

    limparAlgoritmo() {
      this.cartoesAlgoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`🧹 Algoritmo limpo! Monte um novo usando os cartões.`, "info");
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
      let temLoopAninhado = false;
      const verificarLoopAninhado = (arr) => {
        for (const item of arr) {
          if (item.comando === "repita" && item.filhos && item.filhos.length > 0) {
            for (const filho of item.filhos) {
              if (filho.comando === "repita") temLoopAninhado = true;
            }
            verificarLoopAninhado(item.filhos);
          }
        }
      };
      verificarLoopAninhado(this.cartoesAlgoritmo);
      if (this.elementos.bonus) {
        this.elementos.bonus.textContent = temLoopAninhado ? "⭐ LOOPCEPTION! ⭐" : "---";
      }
    },

    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Você precisa montar um algoritmo primeiro! Clique nos cartões.", "erro");
        return;
      }
      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando algoritmo... 🏃", "info");
      if (this.elementos.status) this.elementos.status.textContent = "EXECUTANDO...";
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
        const totalCartoes = parseInt(this.elementos.cartoesUsados?.textContent || "0");
        const recordeAtual = this.recordes[this.faseAtual];
        if (!recordeAtual || totalCartoes < recordeAtual) {
          this.recordes[this.faseAtual] = totalCartoes;
          this.salvarRecordes();
          this.atualizarRecordeDisplay();
          this.mostrarMensagem(`🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${totalCartoes} cartões! NOVO RECORDE! 🏆`, "success");
        } else {
          this.mostrarMensagem(`🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${totalCartoes} cartões!`, "success");
        }
        this.loopsExecutados++;
        this.atualizarContadoresGlobais();
        if (this.elementos.status) this.elementos.status.textContent = "VITÓRIA! 🏆";
      } else {
        this.bugsEncontrados++;
        this.atualizarContadoresGlobais();
        this.mostrarMensagem(`🐛 BUG ENCONTRADO! ${explicacaoErro || "O robô não conseguiu completar o percurso."}`, "erro");
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
      if (novoX < 0 || novoX >= pista.tamanho.linhas || novoY < 0 || novoY >= pista.tamanho.colunas) {
        return { sucesso: false, erro: "O robô tentou sair da pista!" };
      }
      if (pista.grid[novoX]?.[novoY] === "🧱") {
        return { sucesso: false, erro: "O robô bateu em um obstáculo! 🧱" };
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

    delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); },

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

    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes");
      if (saved) {
        try { this.recordes = JSON.parse(saved); } catch (e) { }
      }
    },

    salvarRecordes() {
      localStorage.setItem("loopdash_recordes", JSON.stringify(this.recordes));
    },

    atualizarRecordeDisplay() {
      if (this.elementos.recordeFase1) this.elementos.recordeFase1.textContent = this.recordes[1] || "---";
      if (this.elementos.recordeFase2) this.elementos.recordeFase2.textContent = this.recordes[2] || "---";
      if (this.elementos.recordeFase3) this.elementos.recordeFase3.textContent = this.recordes[3] || "---";
      const valores = [this.recordes[1], this.recordes[2], this.recordes[3]].filter(v => v !== null);
      const melhor = valores.length > 0 ? Math.min(...valores) : "--";
      if (this.elementos.melhorMarca) {
        this.elementos.melhorMarca.textContent = melhor;
      }
    },

    atualizarContadoresGlobais() {
      const relatorioBugs = document.getElementById("relatorioBugs");
      const relatorioLoops = document.getElementById("relatorioLoops");
      if (relatorioBugs) relatorioBugs.textContent = this.bugsEncontrados;
      if (relatorioLoops) relatorioLoops.textContent = this.loopsExecutados;
    },

    mostrarDica() {
      const dicas = {
        1: "💡 DICA FASE 1: Use um único REPITA 7 vezes com ANDE 1 para percorrer toda a reta!",
        2: "💡 DICA FASE 2: Use REPITA dentro de REPITA para fazer o zigue-zague! Ex: REPITA 2 vezes { ANDE 2, VIRE DIREITA, ANDE 2, VIRE ESQUERDA }",
        3: "💡 DICA FASE 3: Planeje o caminho para desviar dos obstáculos. Use REPITA para repetir padrões de movimento!"
      };
      this.mostrarMensagem(dicas[this.faseAtual] || "💡 Tente usar o cartão REPITA para repetir movimentos e economizar cartões!", "info");
    },

    carregarExemplo() {
      this.limparAlgoritmo();
      if (this.faseAtual === 1) {
        this.cartoesAlgoritmo.push({ comando: "repita", contador: 7, filhos: [{ comando: "ande1", filhos: [] }] });
      } else if (this.faseAtual === 2) {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 2,
          filhos: [
            { comando: "ande2", filhos: [] },
            { comando: "vireDireita", filhos: [] },
            { comando: "ande2", filhos: [] },
            { comando: "vireEsquerda", filhos: [] }
          ]
        });
      } else {
        this.cartoesAlgoritmo.push({ comando: "ande1", filhos: [] });
        this.cartoesAlgoritmo.push({ comando: "vireDireita", filhos: [] });
        this.cartoesAlgoritmo.push({ comando: "ande1", filhos: [] });
      }
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`📋 Exemplo carregado para a FASE ${this.faseAtual}!`, "success");
    },

    configurarEventos() {
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const fase = parseInt(btn.getAttribute("data-fase"));
          if (fase) this.carregarFase(fase);
        });
      });
      document.querySelectorAll(".cartao-comando").forEach((cartao) => {
        cartao.addEventListener("click", () => {
          const comando = cartao.getAttribute("data-comando");
          this.adicionarCartao(comando);
        });
      });
      const btnLimpar = document.getElementById("btnLimparAlgoritmo");
      if (btnLimpar) btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      const btnExecutar = document.getElementById("btnExecutarLoopDash");
      const btnReset = document.getElementById("btnResetLoopDash");
      const btnDica = document.getElementById("btnDicaLoopDash");
      const btnExemplo = document.getElementById("btnExemploLoopDash");
      if (btnExecutar) btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset) btnReset.addEventListener("click", () => this.resetarRobo());
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo) btnExemplo.addEventListener("click", () => this.carregarExemplo());
    }
  };
  // ============================================================
  // 6. MÓDULO RODAPÉ
  // ============================================================
  const RodapeModule = {
    init() {
      const relatorioElement = document.getElementById("relatorioBugs");
      if (relatorioElement) {
        // Atualiza o contador a partir do módulo de cabeçalho se disponível
        const contador = window.CabecalhoModule ? window.CabecalhoModule.getContadorBugs() : 0;
        relatorioElement.textContent = contador;
      }
    }
  };

  // ============================================================
  // INICIALIZAÇÃO GERAL
  // ============================================================
  document.addEventListener("DOMContentLoaded", function () {
    CabecalhoModule.init();
    MenuModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    FechamentoModule.init();
    RodapeModule.init();

    // Botão de imprimir conteúdo do accordion
    const btnImprimirAccordion = document.getElementById("btnImprimirAccordion");
    if (btnImprimirAccordion) {
      btnImprimirAccordion.addEventListener("click", function () {
        const accordionContent = document.getElementById("accordionAulas");
        if (accordionContent) {
          const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
          if (win) {
            const html = `
              <!DOCTYPE html>
              <html><head><meta charset="UTF-8"><title>Planos de Aula - 3º Bimestre</title>
              <style>
                body { font-family: 'Inter', sans-serif; background: white; color: #1e2a1a; padding: 20px; }
                .accordion-item { border: 1px solid #ccc; margin-bottom: 10px; padding: 10px; }
                .accordion-header { background: #f5f5f5; padding: 10px; font-weight: bold; }
                .semana-card-completo { padding: 10px; }
                h5 { color: #2c5e1f; }
                ul, p { margin: 5px 0; }
                .table { border-collapse: collapse; width: 100%; }
                .table td, .table th { border: 1px solid #ccc; padding: 5px; }
                .materiais-container { display: flex; flex-wrap: wrap; gap: 5px; }
                .material-badge { background: #eee; padding: 3px 8px; border-radius: 20px; }
                .minuto-item { display: flex; margin: 5px 0; }
                .minuto-tempo { background: #ddd; padding: 3px 10px; }
                .minuto-descricao { padding: 3px 10px; }
                .frase-do-dia { background: #f0f0f0; padding: 10px; margin-top: 10px; }
                .check-concluido { display: none; }
              </style>
              </head>
              <body>
                <h1>📚 Planos de Aula Detalhados – 3º Bimestre</h1>
                ${accordionContent.innerHTML}
              </body>
              </html>
            `;
            win.document.write(html);
            win.document.close();
            setTimeout(() => { win.print(); }, 500);
          } else {
            alert("⚠️ Permita pop-ups para imprimir os planos de aula.");
          }
        }
      });
    }
  });

})(); // Fim do IIFE
