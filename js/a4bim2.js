// ============================================================
// a4bim2.js – SCRIPTS CONSOLIDADOS PARA O 4º ANO – 2º BIMESTRE
// Módulos: cabeçalho, rodapé, certificado, planos de aula,
// e jogo "Correio Robótico"
// ============================================================

(function () {
  "use strict";

  // ============================================================
  // 1. MÓDULO CABEÇALHO (modelo_cabecalho.js)
  // ============================================================
  const CabecalhoModule = {
    contadorBugs: 0,
    inicializado: false,
    contadorElement: null,

    init() {
      if (this.inicializado) return;
      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.contadorBugs = this.carregarContador();
      this.atualizarDisplay();
      this.configurarEventos();
      this.inicializado = true;
      console.log("🤖 [CABEÇALHO] Inicializado");
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
        localStorage.setItem(
          "cabecalho_contador_bugs",
          this.contadorBugs.toString(),
        );
      } catch (e) {}
    },

    atualizarDisplay() {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      }
      // também atualiza o rodapé se existir
      const relatorio = document.getElementById("relatorioBugsFooter");
      if (relatorio) relatorio.innerText = this.contadorBugs;
    },

    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplay();
      this.salvarContador();
      return this.contadorBugs;
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (e) => {
        const inc = e.detail?.incremento || 1;
        this.incrementarBugs(inc);
      });
    },
  };

  // ============================================================
  // 2. MÓDULO RODAPÉ (modelo_rodape.js)
  // ============================================================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,

    init() {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugsFooter");
      if (this.relatorioElement) {
        this.atualizar();
      }
      this.configurarEventos();
      this.inicializado = true;
      console.log("🤖 [RODAPÉ] Inicializado");
    },

    atualizar() {
      if (!this.relatorioElement) return;
      let contador = 0;
      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      ) {
        contador = window.CabecalhoModule.getContadorBugs();
      } else {
        try {
          const salvo = localStorage.getItem("cabecalho_contador_bugs");
          contador = salvo ? parseInt(salvo) : 0;
        } catch (e) {}
      }
      this.relatorioElement.innerText = contador;
    },

    configurarEventos() {
      document.addEventListener("robo:bug", () => this.atualizar());
      document.addEventListener("cabecalho:contador_atualizado", () =>
        this.atualizar(),
      );
    },
  };

  // ============================================================
  // 3. MÓDULO PLANOS DE AULA (modelo_planos_aula.js)
  // ============================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_4ano_bim2",
    totalSemanas: 10,
    elementos: {
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
      expandirBtn: null,
      recolherBtn: null,
    },

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("accordionAulas")) {
        console.log("⏳ PlanosAulaModule: accordion não encontrado");
        return;
      }
      console.log("📚 [PlanosAulaModule] Inicializando...");
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.inicializado = true;
    },

    capturarElementos() {
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
    },

    salvarProgresso() {
      const concluidas = {};
      this.elementos.checkboxes.forEach((cb, idx) => {
        const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          this.elementos.checkboxes.forEach((cb, idx) => {
            const semana =
              cb.getAttribute("data-semana") || `semana_${idx + 1}`;
            if (concluidas.hasOwnProperty(semana)) {
              cb.checked = concluidas[semana];
            }
          });
        } catch (e) {}
      }
      this.atualizarBarra();
    },

    getTotalMarcados() {
      let marcados = 0;
      this.elementos.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      return marcados;
    },

    atualizarBarra() {
      const marcados = this.getTotalMarcados();
      const percentual =
        this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.textContent =
          Math.round(percentual) + "%";
      }
      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
      }
    },

    handleCheckboxChange(e) {
      this.salvarProgresso();
      this.atualizarBarra();
    },

    expandirTodos() {
      document
        .querySelectorAll("#accordionAulas .accordion-collapse")
        .forEach((collapse) => {
          if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
            try {
              const bsCollapse =
                bootstrap.Collapse.getOrCreateInstance(collapse);
              bsCollapse.show();
            } catch (e) {
              collapse.classList.add("show");
            }
          } else {
            collapse.classList.add("show");
          }
        });
    },

    recolherTodos() {
      document
        .querySelectorAll("#accordionAulas .accordion-collapse")
        .forEach((collapse) => {
          if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
            try {
              const bsCollapse =
                bootstrap.Collapse.getOrCreateInstance(collapse);
              bsCollapse.hide();
            } catch (e) {
              collapse.classList.remove("show");
            }
          } else {
            collapse.classList.remove("show");
          }
        });
    },

    configurarEventos() {
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
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
    },
  };

  // ============================================================
  // 4. MÓDULO CERTIFICADO (modelo_certificado.js)
  // ============================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_4ano_bim2",
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
      if (!document.getElementById("listaAlunos")) {
        console.log("⏳ CertificadoModule: não encontrado");
        return;
      }
      console.log("🎓 [CertificadoModule] Inicializando...");
      this.carregarElementos();
      this.carregarAlunos();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializado = true;
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

    carregarAlunos() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      } else {
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
        const nome = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreviewAluno.disabled =
          nome === "[NOME DO ALUNO]" || nome === "";
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
      const lista = this.elementos.listaAlunos;
      const contador = this.elementos.contadorAlunos;
      if (!lista) return;
      if (this.alunos.length === 0) {
        lista.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (contador) contador.textContent = "0";
        return;
      }
      lista.innerHTML = "";
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
        lista.appendChild(li);
      });
      // eventos
      lista.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });
      lista.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });
      if (contador) contador.textContent = this.alunos.length;
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
      <html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:#e0e0e0; min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
        .preview-container { max-width:800px; width:100%; }
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
      </head><body>
        <div class="preview-container">
          <div class="preview-actions">
            <button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button>
            <button class="btn-close" onclick="window.close();">✖️ FECHAR</button>
          </div>
          <div class="certificado">
            <h3>🏆 CERTIFICADO DE MESTRE DOS PARÂMETROS - 4º ANO</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            📦 PARÂMETROS | 🗺️ COORDENADAS | 🔌 SENSORES DE SUCATA | 🐛 DEPURAÇÃO COLABORATIVA | 📨 PROJETO ENTREGADOR</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Se não quebrou, não aprendeu direito!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        </div>
        <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body></html>`;
    },

    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado!");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DOS PARÂMETROS - 4º ANO</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            📦 PARÂMETROS | 🗺️ COORDENADAS | 🔌 SENSORES DE SUCATA | 🐛 DEPURAÇÃO COLABORATIVA | 📨 PROJETO ENTREGADOR</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Se não quebrou, não aprendeu direito!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Certificados RobôMestres - 4º Ano</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:white; padding:20px; }
        .print-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media print { body { padding:0; margin:0; } .print-grid { gap:15px; } @page { size:A4; margin:0.8cm; } }
      </style>
      </head><body>
        <div class="print-grid">${cardsHTML}</div>
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); setTimeout(function() { window.close(); },500); },200);
          };
        <\/script>
      </body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
      }
    },

    previewAlunoSelecionado() {
      const nome = this.elementos.previewNome?.textContent || "";
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
    },

    escapeHtml(texto) {
      if (!texto) return "";
      return texto.replace(/[&<>]/g, (m) => {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
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
  };

  // ============================================================
  // 5. JOGO "CORREIO ROBÓTICO"
  // ============================================================

  const JogoCorreioModule = {
    inicializado: false,
    gridSize: 8,
    posicao: { x: 0, y: 0 },
    direcao: 1, // 0:cima, 1:direita, 2:baixo, 3:esquerda
    vidas: 3,
    comandos: [],
    passosExecutados: 0,
    obstaculos: [
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 4],
      [2, 4],
      [1, 4],
    ],
    alvo: { x: 5, y: 5 },
    origem: { x: 0, y: 0 },
    emExecucao: false,

    // Armazena o número de repetições temporário (usado no modal)
    _repeticoesTemp: 3,

    elementos: {
      grid: null,
      algoritmoMontado: null,
      mensagem: null,
      vidasDisplay: null,
      passosDisplay: null,
      posicaoDisplay: null,
      statusDisplay: null,
      btnExecutar: null,
      btnReset: null,
      btnDica: null,
      btnLimpar: null,
      // Elementos do modal
      modal: null,
      modalNumero: null,
      modalFechar: null,
      btnMenos: null,
      btnMais: null,
      botoesComando: null,
    },

    // ---------- INICIALIZAÇÃO ----------
    init() {
      if (this.inicializado) return;
      const gridEl = document.getElementById("correioGrid");
      if (!gridEl) {
        console.log("⏳ JogoCorreioModule: grid não encontrado");
        return;
      }
      console.log("🎮 [JogoCorreio] Inicializando...");
      this.capturarElementos();
      this.configurarEventos();
      this.resetarJogo();
      this.inicializado = true;
    },

    capturarElementos() {
      this.elementos.grid = document.getElementById("correioGrid");
      this.elementos.algoritmoMontado =
        document.getElementById("algoritmoCorreio");
      this.elementos.mensagem = document.getElementById("mensagemCorreio");
      this.elementos.vidasDisplay = document.getElementById("correioBilhetes");
      this.elementos.passosDisplay = document.getElementById("correioPassos");
      this.elementos.posicaoDisplay = document.getElementById("correioPosicao");
      this.elementos.statusDisplay = document.getElementById("correioStatus");
      this.elementos.btnExecutar =
        document.getElementById("btnExecutarCorreio");
      this.elementos.btnReset = document.getElementById("btnResetCorreio");
      this.elementos.btnDica = document.getElementById("btnDicaCorreio");
      this.elementos.btnLimpar = document.getElementById("btnLimparCorreio");

      // Modal
      this.elementos.modal = document.getElementById("modalRepetir");
      this.elementos.modalNumero =
        document.getElementById("modalRepetirNumero");
      this.elementos.modalFechar =
        document.getElementById("fecharModalRepetir");
      this.elementos.btnMenos = document.querySelector(
        ".btn-contador[data-op='menos']",
      );
      this.elementos.btnMais = document.querySelector(
        ".btn-contador[data-op='mais']",
      );
      this.elementos.botoesComando =
        document.querySelectorAll(".modal-comando");
    },

    // ---------- MÉTODOS DO MODAL REPETIR ----------
    abrirModalRepetir() {
      if (this.emExecucao) {
        this.mostrarMensagem("⏳ Aguarde a execução terminar!", "erro");
        return;
      }
      this._repeticoesTemp = 3;
      this.atualizarNumeroModal();
      this.elementos.modal.style.display = "flex";
    },

    fecharModalRepetir() {
      this.elementos.modal.style.display = "none";
    },

    atualizarNumeroModal() {
      if (this.elementos.modalNumero) {
        this.elementos.modalNumero.textContent = this._repeticoesTemp;
      }
    },

    mudarRepeticoes(delta) {
      const novo = this._repeticoesTemp + delta;
      if (novo >= 1 && novo <= 10) {
        this._repeticoesTemp = novo;
        this.atualizarNumeroModal();
      }
    },

    // Quando o usuário clica em um comando no modal
    selecionarComandoRepetir(comando, param) {
      // Adiciona o REPETIR com o número escolhido
      this.adicionarComando("repita", this._repeticoesTemp);
      // Adiciona o comando que será repetido (próximo da lista)
      this.adicionarComando(comando, param);
      // Fecha o modal
      this.fecharModalRepetir();
    },

    // ---------- MÉTODOS DO JOGO ----------
    resetarJogo() {
      this.posicao = { x: 0, y: 0 };
      this.direcao = 1;
      this.vidas = 3;
      this.comandos = [];
      this.passosExecutados = 0;
      this.emExecucao = false;
      this.desenharGrid();
      this.atualizarEstatisticas();
      this.renderizarAlgoritmo();
      this.mostrarMensagem(
        "🤖 Robô pronto! Monte seu algoritmo e execute.",
        "info",
      );
      if (this.elementos.btnExecutar)
        this.elementos.btnExecutar.disabled = false;
    },

    desenharGrid() {
      const grid = this.elementos.grid;
      if (!grid) return;
      grid.innerHTML = "";
      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          const cell = document.createElement("div");
          cell.className = "jogo-cell";
          cell.dataset.x = x;
          cell.dataset.y = y;
          const isWall = this.obstaculos.some((o) => o[0] === x && o[1] === y);
          if (isWall) cell.classList.add("wall");
          if (x === this.alvo.x && y === this.alvo.y)
            cell.classList.add("target");
          if (x === this.posicao.x && y === this.posicao.y)
            cell.classList.add("robot");
          grid.appendChild(cell);
        }
      }
    },

    atualizarEstatisticas() {
      if (this.elementos.vidasDisplay) {
        const hearts = "❤️".repeat(Math.max(0, this.vidas));
        this.elementos.vidasDisplay.textContent = hearts || "💀";
      }
      if (this.elementos.passosDisplay) {
        this.elementos.passosDisplay.textContent = this.passosExecutados;
      }
      if (this.elementos.posicaoDisplay) {
        this.elementos.posicaoDisplay.textContent = `(${this.posicao.x},${this.posicao.y})`;
      }
      if (this.elementos.statusDisplay) {
        this.elementos.statusDisplay.textContent = this.emExecucao
          ? "EXECUTANDO"
          : "PRONTO";
      }
    },

    mostrarMensagem(texto, tipo = "info") {
      const msg = this.elementos.mensagem;
      if (!msg) return;
      msg.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      msg.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "sucesso" ? "sucesso" : ""}`;
    },

    // ---------- CONSTRUÇÃO DO ALGORITMO ----------
    adicionarComando(comando, param) {
      if (this.emExecucao) {
        this.mostrarMensagem("⏳ Aguarde a execução terminar!", "erro");
        return;
      }
      this.comandos.push({ comando, param });
      this.renderizarAlgoritmo();
      this.mostrarMensagem(`➕ Adicionado: ${comando} ${param || ""}`, "info");
    },

    removerComando(index) {
      if (this.emExecucao) return;
      this.comandos.splice(index, 1);
      this.renderizarAlgoritmo();
    },

    limparAlgoritmo() {
      if (this.emExecucao) return;
      this.comandos = [];
      this.renderizarAlgoritmo();
      this.mostrarMensagem("🧹 Algoritmo limpo!", "info");
    },

    renderizarAlgoritmo() {
      const container = this.elementos.algoritmoMontado;
      if (!container) return;
      container.innerHTML = "";
      if (this.comandos.length === 0) {
        container.innerHTML =
          '<div class="placeholder-algoritmo">🃏 Clique nos comandos abaixo para montar seu algoritmo...</div>';
        return;
      }
      this.comandos.forEach((cmd, idx) => {
        const div = document.createElement("div");
        div.className = "cartao-montado";
        let icone = "",
          texto = "";
        if (cmd.comando === "andar") {
          icone = "🚶";
          texto = `ANDAR ${cmd.param}`;
        } else if (cmd.comando === "virar") {
          icone = cmd.param === "direita" ? "▶️" : "◀️";
          texto = `VIRAR ${cmd.param.toUpperCase()}`;
        } else if (cmd.comando === "repita") {
          icone = "🔄";
          texto = `REPITA ${cmd.param} vezes`;
        }
        div.innerHTML = `
        <span class="cartao-icone">${icone}</span>
        <span class="cartao-texto">${texto}</span>
        <span class="cartao-remove" data-idx="${idx}">✖️</span>
      `;
        container.appendChild(div);
        div
          .querySelector(".cartao-remove")
          .addEventListener("click", () => this.removerComando(idx));
      });
    },

    // ---------- EXECUÇÃO ----------
    async executar() {
      if (this.emExecucao) return;
      if (this.comandos.length === 0) {
        this.mostrarMensagem(
          "⚠️ Você precisa montar um algoritmo primeiro!",
          "erro",
        );
        return;
      }
      if (this.vidas <= 0) {
        this.mostrarMensagem("💀 Sem vidas! Clique em REINICIAR.", "erro");
        return;
      }

      this.emExecucao = true;
      this.elementos.btnExecutar.disabled = true;
      this.posicao = { x: 0, y: 0 };
      this.direcao = 1;
      this.passosExecutados = 0;
      this.desenharGrid();
      this.atualizarEstatisticas();
      this.mostrarMensagem("🤖 Executando algoritmo...", "info");

      let sucesso = true;
      let erroMsg = "";

      try {
        let i = 0;
        while (i < this.comandos.length) {
          const cmd = this.comandos[i];
          if (cmd.comando === "repita") {
            const vezes = parseInt(cmd.param) || 3;
            if (i + 1 < this.comandos.length) {
              const proxCmd = this.comandos[i + 1];
              for (let r = 0; r < vezes; r++) {
                const resultado = await this.executarComandoSimples(proxCmd);
                if (!resultado.sucesso) {
                  sucesso = false;
                  erroMsg = resultado.erro;
                  break;
                }
                this.desenharGrid();
                this.atualizarEstatisticas();
                await this.delay(200);
              }
              i += 2; // pula o comando repetido
            } else {
              sucesso = false;
              erroMsg = "REPITA sem comando seguinte!";
              break;
            }
          } else {
            const resultado = await this.executarComandoSimples(cmd);
            if (!resultado.sucesso) {
              sucesso = false;
              erroMsg = resultado.erro;
              break;
            }
            this.desenharGrid();
            this.atualizarEstatisticas();
            await this.delay(200);
            i++;
          }
        }
      } catch (err) {
        sucesso = false;
        erroMsg = err.message;
      }

      this.emExecucao = false;
      this.elementos.btnExecutar.disabled = false;

      if (
        sucesso &&
        this.posicao.x === this.alvo.x &&
        this.posicao.y === this.alvo.y
      ) {
        this.mostrarMensagem(
          `🎉 PARABÉNS! Você entregou o bilhete em ${this.passosExecutados} passos!`,
          "sucesso",
        );
        document.dispatchEvent(new CustomEvent("robo:vitoria"));
      } else if (sucesso) {
        this.mostrarMensagem(
          `🤔 O robô parou em (${this.posicao.x},${this.posicao.y}), mas não chegou ao destino.`,
          "erro",
        );
      } else {
        this.vidas--;
        this.atualizarEstatisticas();
        if (this.vidas <= 0) {
          this.mostrarMensagem(
            `💥 Fim de jogo! Você perdeu todas as vidas. Reinicie para tentar novamente.`,
            "erro",
          );
        } else {
          this.mostrarMensagem(
            `🐛 BUG! ${erroMsg || "O robô bateu num obstáculo ou saiu da grade."} Vidas restantes: ${this.vidas}`,
            "erro",
          );
          document.dispatchEvent(
            new CustomEvent("robo:bug", {
              detail: { incremento: 1, mensagem: erroMsg },
            }),
          );
        }
      }
    },

    executarComandoSimples(cmd) {
      return new Promise((resolve) => {
        let sucesso = true;
        let erro = "";
        const { comando, param } = cmd;

        if (comando === "andar") {
          const passos = parseInt(param) || 1;
          let dx = 0,
            dy = 0;
          if (this.direcao === 0) dy = -1;
          else if (this.direcao === 1) dx = 1;
          else if (this.direcao === 2) dy = 1;
          else if (this.direcao === 3) dx = -1;

          for (let i = 0; i < passos; i++) {
            const novoX = this.posicao.x + dx;
            const novoY = this.posicao.y + dy;
            if (
              novoX < 0 ||
              novoX >= this.gridSize ||
              novoY < 0 ||
              novoY >= this.gridSize
            ) {
              sucesso = false;
              erro = "Robô tentou sair da grade!";
              break;
            }
            if (this.obstaculos.some((o) => o[0] === novoX && o[1] === novoY)) {
              sucesso = false;
              erro = "Robô bateu em um obstáculo! 🧱";
              break;
            }
            this.posicao.x = novoX;
            this.posicao.y = novoY;
            this.passosExecutados++;
          }
        } else if (comando === "virar") {
          if (param === "direita") this.direcao = (this.direcao + 1) % 4;
          else if (param === "esquerda")
            this.direcao = (this.direcao - 1 + 4) % 4;
          this.passosExecutados++;
        } else {
          sucesso = false;
          erro = `Comando desconhecido: ${comando}`;
        }

        resolve({ sucesso, erro });
      });
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    mostrarDica() {
      this.mostrarMensagem(
        '💡 Dica: Use "REPITA 3" seguido de "ANDAR 1" para andar 3 passos. Combine com "VIRAR" para desviar de obstáculos!',
        "info",
      );
    },

    // ---------- CONFIGURAÇÃO DE EVENTOS ----------
    configurarEventos() {
      // Mapeamento de comandos da prateleira
      const mapaComandos = {
        andar: { comando: "andar", param: 1 },
        andar2: { comando: "andar", param: 2 },
        virarD: { comando: "virar", param: "direita" },
        virarE: { comando: "virar", param: "esquerda" },
        repetir: { comando: "repita", param: undefined }, // será tratado pelo modal
      };

      document
        .querySelectorAll("#jogo-bimestre .cartao-comando")
        .forEach((cartao) => {
          cartao.addEventListener("click", () => {
            const key = cartao.dataset.comando;
            const mapped = mapaComandos[key];
            if (!mapped) return;

            // Se for REPETIR, abrimos o modal
            if (key === "repetir") {
              this.abrirModalRepetir();
              return;
            }

            // Senão, adiciona o comando normalmente
            this.adicionarComando(mapped.comando, mapped.param);
          });
        });

      // Eventos do modal
      if (this.elementos.modalFechar) {
        this.elementos.modalFechar.addEventListener("click", () =>
          this.fecharModalRepetir(),
        );
      }
      if (this.elementos.btnMenos) {
        this.elementos.btnMenos.addEventListener("click", () =>
          this.mudarRepeticoes(-1),
        );
      }
      if (this.elementos.btnMais) {
        this.elementos.btnMais.addEventListener("click", () =>
          this.mudarRepeticoes(1),
        );
      }
      // Clique nos comandos do modal
      this.elementos.botoesComando.forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.dataset.comando;
          const param = btn.dataset.param;
          const valorParam = isNaN(param) ? param : parseInt(param, 10);
          this.selecionarComandoRepetir(comando, valorParam);
        });
      });

      // Fechar modal clicando fora
      if (this.elementos.modal) {
        this.elementos.modal.addEventListener("click", (e) => {
          if (e.target === this.elementos.modal) {
            this.fecharModalRepetir();
          }
        });
      }

      // Botões principais
      if (this.elementos.btnExecutar) {
        this.elementos.btnExecutar.addEventListener("click", () =>
          this.executar(),
        );
      }
      if (this.elementos.btnReset) {
        this.elementos.btnReset.addEventListener("click", () => {
          this.resetarJogo();
          this.mostrarMensagem("🔄 Jogo reiniciado!", "info");
        });
      }
      if (this.elementos.btnDica) {
        this.elementos.btnDica.addEventListener("click", () =>
          this.mostrarDica(),
        );
      }
      if (this.elementos.btnLimpar) {
        this.elementos.btnLimpar.addEventListener("click", () =>
          this.limparAlgoritmo(),
        );
      }
    },
  };

  // ============================================================
  // INICIALIZAÇÃO GERAL
  // ============================================================
  function initAll() {
    // Inicializa módulos
    CabecalhoModule.init();
    RodapeModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    JogoCorreioModule.init();

    // Sobrescreve o método executar do jogo com a versão correta que trata REPITA
    // (já que a implementação anterior estava simplificada)
    // Vamos substituir a função executar por uma versão mais completa.
    // Mas como já definimos, vamos sobrescrever.
    const originalExecutar = JogoCorreioModule.executar;
    JogoCorreioModule.executar = async function () {
      if (this.emExecucao) return;
      if (this.comandos.length === 0) {
        this.mostrarMensagem(
          "⚠️ Você precisa montar um algoritmo primeiro!",
          "erro",
        );
        return;
      }
      if (this.vidas <= 0) {
        this.mostrarMensagem("💀 Sem vidas! Clique em REINICIAR.", "erro");
        return;
      }

      this.emExecucao = true;
      this.elementos.btnExecutar.disabled = true;
      this.posicao = { x: 0, y: 0 };
      this.direcao = 1;
      this.passosExecutados = 0;
      this.desenharGrid();
      this.atualizarEstatisticas();
      this.mostrarMensagem("🤖 Executando algoritmo...", "info");

      let sucesso = true;
      let erroMsg = "";

      try {
        let i = 0;
        while (i < this.comandos.length) {
          const cmd = this.comandos[i];
          if (cmd.comando === "repita") {
            const vezes = parseInt(cmd.param) || 3;
            // Verifica se há próximo comando
            if (i + 1 < this.comandos.length) {
              const proxCmd = this.comandos[i + 1];
              for (let r = 0; r < vezes; r++) {
                const resultado = await this.executarComandoSimples(proxCmd);
                if (!resultado.sucesso) {
                  sucesso = false;
                  erroMsg = resultado.erro;
                  break;
                }
                this.desenharGrid();
                this.atualizarEstatisticas();
                await this.delay(200);
              }
              // Pula o próximo comando (já foi executado)
              i += 2;
            } else {
              sucesso = false;
              erroMsg = "REPITA sem comando seguinte!";
              break;
            }
          } else {
            const resultado = await this.executarComandoSimples(cmd);
            if (!resultado.sucesso) {
              sucesso = false;
              erroMsg = resultado.erro;
              break;
            }
            this.desenharGrid();
            this.atualizarEstatisticas();
            await this.delay(200);
            i++;
          }
        }
      } catch (err) {
        sucesso = false;
        erroMsg = err.message;
      }

      this.emExecucao = false;
      this.elementos.btnExecutar.disabled = false;

      if (
        sucesso &&
        this.posicao.x === this.alvo.x &&
        this.posicao.y === this.alvo.y
      ) {
        this.mostrarMensagem(
          `🎉 PARABÉNS! Você entregou o bilhete em ${this.passosExecutados} passos!`,
          "sucesso",
        );
        document.dispatchEvent(new CustomEvent("robo:vitoria"));
      } else if (sucesso) {
        this.mostrarMensagem(
          `🤔 O robô parou em (${this.posicao.x},${this.posicao.y}), mas não chegou ao destino.`,
          "erro",
        );
      } else {
        this.vidas--;
        this.atualizarEstatisticas();
        if (this.vidas <= 0) {
          this.mostrarMensagem(
            `💥 Fim de jogo! Você perdeu todas as vidas. Reinicie para tentar novamente.`,
            "erro",
          );
        } else {
          this.mostrarMensagem(
            `🐛 BUG! ${erroMsg || "O robô bateu num obstáculo ou saiu da grade."} Vidas restantes: ${this.vidas}`,
            "erro",
          );
          document.dispatchEvent(
            new CustomEvent("robo:bug", {
              detail: { incremento: 1, mensagem: erroMsg },
            }),
          );
        }
      }
    };

    // Adiciona o método auxiliar executarComandoSimples
    JogoCorreioModule.executarComandoSimples = function (cmd) {
      return new Promise((resolve) => {
        let sucesso = true;
        let erro = "";
        const { comando, param } = cmd;

        if (comando === "andar") {
          const passos = parseInt(param) || 1;
          let dx = 0,
            dy = 0;
          if (this.direcao === 0) {
            dy = -1;
          } else if (this.direcao === 1) {
            dx = 1;
          } else if (this.direcao === 2) {
            dy = 1;
          } else if (this.direcao === 3) {
            dx = -1;
          }

          for (let i = 0; i < passos; i++) {
            const novoX = this.posicao.x + dx;
            const novoY = this.posicao.y + dy;
            if (
              novoX < 0 ||
              novoX >= this.gridSize ||
              novoY < 0 ||
              novoY >= this.gridSize
            ) {
              sucesso = false;
              erro = "Robô tentou sair da grade!";
              break;
            }
            if (this.obstaculos.some((o) => o[0] === novoX && o[1] === novoY)) {
              sucesso = false;
              erro = "Robô bateu em um obstáculo! 🧱";
              break;
            }
            this.posicao.x = novoX;
            this.posicao.y = novoY;
            this.passosExecutados++;
          }
        } else if (comando === "virar") {
          if (param === "direita") {
            this.direcao = (this.direcao + 1) % 4;
          } else if (param === "esquerda") {
            this.direcao = (this.direcao - 1 + 4) % 4;
          }
          this.passosExecutados++;
        } else {
          sucesso = false;
          erro = `Comando desconhecido: ${comando}`;
        }

        resolve({ sucesso, erro });
      });
    };

    console.log("✅ Todos os módulos inicializados!");
  }

  // Aguarda o DOM carregar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
