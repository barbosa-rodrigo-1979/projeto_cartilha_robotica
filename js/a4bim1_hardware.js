// ==================================================
// a4bim1_hardware.js
// JavaScript completo para o 4º Ano - 1º Bimestre (Hardware)
// Unifica todos os scripts dos modelos: menu, planos, certificado, fechamento e jogo
// ==================================================

(function () {
  "use strict";

  // ==================================================
  // 1. MÓDULO DO MENU
  // ==================================================
  const MenuModule = {
    init() {
      this.highlightCurrentPage();
      this.consoleWelcome();
      this.initTooltips();
    },

    highlightCurrentPage() {
      const currentPath =
        window.location.pathname.split("/").pop() || "a4bim1_hardware.html";
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
        "%c🤖 ROBOZADA 4000 - 4º ANO HARDWARE ATIVO",
        "color: #ffb347; font-size: 14px; font-family: monospace;",
      );
      console.log(
        "%c🔌 Micro:bit não morde! LED não dói! Bug não é derrota!",
        "color: #9bbc7b;",
      );
    },

    initTooltips() {
      const devEmails = document.querySelectorAll(".dev-contato a");
      devEmails.forEach((email) => {
        email.setAttribute("title", "Clique para enviar e-mail");
        email.style.cursor = "pointer";
      });
    },
  };
  // ==================================================
  // 2. MÓDULO DOS PLANOS DE AULA
  // ==================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_4ano_hardware",
    totalSemanas: 10,

    elementos: {
      checkboxes: null,
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
      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) return;

      try {
        const concluidas = JSON.parse(salvo);
        this.elementos.checkboxes.forEach((cb) => {
          const semana = cb.getAttribute("data-semana");
          if (semana && concluidas.hasOwnProperty(semana)) {
            cb.checked = concluidas[semana];
          }
        });
        this.atualizarContador();
      } catch (e) {
        console.warn("Erro ao carregar progresso:", e);
      }
    },

    salvarProgresso() {
      const concluidas = {};
      this.elementos.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) {
          concluidas[semana] = cb.checked;
        }
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
      this.atualizarContador();
    },

    atualizarContador() {
      const marcados = this.getTotalMarcados();
      // Atualiza barra de progresso se existir
      const barra = document.getElementById("barraProgresso");
      const texto = document.getElementById("progressoTexto");
      if (barra) {
        const percentual =
          this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
        barra.style.width = percentual + "%";
        barra.textContent = Math.round(percentual) + "%";
      }
      if (texto) {
        texto.textContent = `${marcados}/${this.totalSemanas}`;
      }
    },

    getTotalMarcados() {
      let marcados = 0;
      this.elementos.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      return marcados;
    },

    handleCheckboxChange(e) {
      this.salvarProgresso();
    },

    configurarEventos() {
      this.elementos.checkboxes.forEach((cb) => {
        cb.removeEventListener("change", this._handleChange);
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
    },
  };
  // ==================================================
  // 3. MÓDULO DO CERTIFICADO
  // ==================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_4ano_hardware",

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
        console.log("⏳ CertificadoModule: página não identificada");
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
            <h3>🏆 CERTIFICADO DE MESTRE DO HARDWARE - NÍVEL 4</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>4º ANO - ROBÓTICA EDUCACIONAL (HARDWARE)</strong><br>
            🔌 MICRO:BIT | 💡 LEDS E BOTÕES | 🔁 LOOP | 🧠 ANINHAMENTO | 🐛 DEPURAÇÃO</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Micro:bit não morde! LED não dói! Bug não é derrota!"</p>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO HARDWARE - NÍVEL 4</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>4º ANO - ROBÓTICA EDUCACIONAL (HARDWARE)</strong><br>
            🔌 MICRO:BIT | 💡 LEDS E BOTÕES | 🔁 LOOP | 🧠 ANINHAMENTO | 🐛 DEPURAÇÃO</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Micro:bit não morde! LED não dói! Bug não é derrota!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 4º Ano Hardware</title>
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

    escapeHtml(texto) {
      if (!texto) return "";
      return texto.replace(/[&<>]/g, function (m) {
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
  // ==================================================
  // 4. MÓDULO DO JOGO LOOP DASH
  // ==================================================
  const LoopDashModule = {
    inicializado: false,
    bugsEncontrados: 0,

    // Configurações do jogo
    fases: {
      1: { nome: "Fase 1 - Iniciante", grid: 8, linhas: 8, colunas: 8 },
      2: { nome: "Fase 2 - Intermediário", grid: 5, linhas: 5, colunas: 5 },
      3: { nome: "Fase 3 - Avançado", grid: 6, linhas: 6, colunas: 6 }
    },
    faseAtual: 1,
    gridData: [],
    posicaoRobo: { linha: 0, coluna: 0 },
    posicaoAlvo: { linha: 0, coluna: 0 },
    paredes: [],
    caminhoPercorrido: [],
    emExecucao: false,

    elementos: {
      gridContainer: null,
      mensagem: null,
      contadorBugs: null,
      btnExecutar: null,
      btnResetar: null,
      btnDica: null,
      btnExemplo: null,
      btnFase1: null,
      btnFase2: null,
      btnFase3: null,
      algoritmoMontado: null,
      cartoesPrateleira: null,
      recordesFase1: null,
      recordesFase2: null,
      recordesFase3: null
    },

    init() {
      if (this.inicializado) return;
      // Verifica se o container do jogo existe
      if (!document.querySelector(".loopdash-grid")) {
        console.log("⏳ LoopDashModule: jogo não encontrado na página");
        return;
      }

      console.log("🎮 [LoopDashModule] Inicializando...");
      this.carregarElementos();
      this.configurarEventos();
      this.inicializarFase(1);
      this.carregarRecordes();
      this.inicializado = true;
    },

    carregarElementos() {
      this.elementos.gridContainer = document.querySelector(".loopdash-grid");
      this.elementos.mensagem = document.getElementById("mensagemJogo");
      this.elementos.contadorBugs = document.getElementById("contadorBugs");
      this.elementos.btnExecutar = document.getElementById("btnExecutar");
      this.elementos.btnResetar = document.getElementById("btnResetar");
      this.elementos.btnDica = document.getElementById("btnDica");
      this.elementos.btnExemplo = document.getElementById("btnExemplo");
      this.elementos.btnFase1 = document.getElementById("btnFase1");
      this.elementos.btnFase2 = document.getElementById("btnFase2");
      this.elementos.btnFase3 = document.getElementById("btnFase3");
      this.elementos.algoritmoMontado = document.getElementById("algoritmoMontado");
      this.elementos.cartoesPrateleira = document.querySelector(".cartoes-grid");
      this.elementos.recordesFase1 = document.getElementById("recordeFase1");
      this.elementos.recordesFase2 = document.getElementById("recordeFase2");
      this.elementos.recordesFase3 = document.getElementById("recordeFase3");
    },

    configurarEventos() {
      // Botões de fase
      if (this.elementos.btnFase1) {
        this.elementos.btnFase1.addEventListener("click", () => this.inicializarFase(1));
      }
      if (this.elementos.btnFase2) {
        this.elementos.btnFase2.addEventListener("click", () => this.inicializarFase(2));
      }
      if (this.elementos.btnFase3) {
        this.elementos.btnFase3.addEventListener("click", () => this.inicializarFase(3));
      }

      // Botões de controle
      if (this.elementos.btnExecutar) {
        this.elementos.btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      }
      if (this.elementos.btnResetar) {
        this.elementos.btnResetar.addEventListener("click", () => this.resetarJogo());
      }
      if (this.elementos.btnDica) {
        this.elementos.btnDica.addEventListener("click", () => this.mostrarDica());
      }
      if (this.elementos.btnExemplo) {
        this.elementos.btnExemplo.addEventListener("click", () => this.carregarExemplo());
      }

      // Clique nos cartões de comando (arrastar para montar algoritmo)
      document.querySelectorAll(".cartao-comando").forEach((cartao) => {
        cartao.addEventListener("click", () => this.adicionarComando(cartao));
      });

      // Clique para remover comandos do algoritmo montado
      if (this.elementos.algoritmoMontado) {
        this.elementos.algoritmoMontado.addEventListener("click", (e) => {
          const remover = e.target.closest(".cartao-remove");
          if (remover) {
            const cartao = remover.closest(".cartao-montado");
            if (cartao) {
              cartao.remove();
              this.atualizarContadoresGlobais();
            }
          }
        });
      }
    },

    inicializarFase(numero) {
      this.faseAtual = numero;
      const config = this.fases[numero];
      if (!config) return;

      // Atualiza botões ativos
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
      });
      const btnAtivo = document.getElementById(`btnFase${numero}`);
      if (btnAtivo) btnAtivo.classList.add("ativo");

      // Atualiza grid
      this.gridData = [];
      const gridEl = this.elementos.gridContainer;
      if (!gridEl) return;

      // Limpa grid
      gridEl.innerHTML = "";
      gridEl.className = `loopdash-grid fase${numero}`;

      // Gera mapa aleatório
      this.gerarMapa(numero);

      // Desenha grid
      for (let i = 0; i < config.linhas; i++) {
        this.gridData[i] = [];
        for (let j = 0; j < config.colunas; j++) {
          const cell = document.createElement("div");
          cell.className = "loopdash-cell";
          cell.dataset.linha = i;
          cell.dataset.coluna = j;
          gridEl.appendChild(cell);
          this.gridData[i][j] = { tipo: "vazio", elemento: cell };
        }
      }

      // Coloca robô e alvo
      this.posicaoRobo = { linha: 0, coluna: 0 };
      this.posicaoAlvo = { linha: config.linhas - 1, coluna: config.colunas - 1 };
      this.paredes = [];

      // Define paredes aleatórias
      const numParedes = Math.floor((config.linhas * config.colunas) * 0.15);
      let paredesColocadas = 0;
      while (paredesColocadas < numParedes) {
        const linha = Math.floor(Math.random() * config.linhas);
        const coluna = Math.floor(Math.random() * config.colunas);
        // Não colocar parede na posição do robô ou alvo
        if ((linha === 0 && coluna === 0) || (linha === config.linhas - 1 && coluna === config.colunas - 1)) continue;
        if (this.gridData[linha][coluna].tipo === "vazio") {
          this.gridData[linha][coluna].tipo = "parede";
          this.paredes.push({ linha, coluna });
          const cell = this.gridData[linha][coluna].elemento;
          cell.className = "loopdash-cell wall";
          paredesColocadas++;
        }
      }

      // Posiciona robô e alvo
      this.atualizarCelulaRobo();
      this.atualizarCelulaAlvo();

      // Limpa algoritmo montado
      if (this.elementos.algoritmoMontado) {
        this.elementos.algoritmoMontado.innerHTML = `<div class="placeholder-algoritmo">🧩 Arraste os comandos para montar seu algoritmo...</div>`;
      }

      // Mensagem
      this.mostrarMensagem(`🎯 ${config.nome} - Leve o robô até a bandeira!`, "info");

      // Reseta caminho percorrido
      this.caminhoPercorrido = [];
      this.emExecucao = false;

      this.atualizarContadoresGlobais();
    },

    gerarMapa(numero) {
      // Função auxiliar para gerar mapa aleatório (já feito acima)
      // Mantida para compatibilidade
    },

    atualizarCelulaRobo() {
      // Remove classe robot de todas
      document.querySelectorAll(".loopdash-cell.robot").forEach(el => el.classList.remove("robot"));
      const cell = this.gridData[this.posicaoRobo.linha]?.[this.posicaoRobo.coluna]?.elemento;
      if (cell) {
        cell.classList.add("robot");
      }
    },

    atualizarCelulaAlvo() {
      // Remove classe target de todas
      document.querySelectorAll(".loopdash-cell.target").forEach(el => el.classList.remove("target"));
      const cell = this.gridData[this.posicaoAlvo.linha]?.[this.posicaoAlvo.coluna]?.elemento;
      if (cell) {
        cell.classList.add("target");
      }
    },

    adicionarComando(cartao) {
      if (this.emExecucao) {
        this.mostrarMensagem("⏳ Aguarde a execução terminar!", "warning");
        return;
      }

      const comando = cartao.dataset.comando;
      const icone = cartao.querySelector(".cartao-icone")?.textContent || "⬆️";
      const texto = cartao.querySelector(".cartao-texto")?.textContent || comando;

      const container = this.elementos.algoritmoMontado;
      if (!container) return;

      // Remove placeholder se existir
      const placeholder = container.querySelector(".placeholder-algoritmo");
      if (placeholder) placeholder.remove();

      // Cria cartão montado
      const div = document.createElement("div");
      div.className = "cartao-montado";
      div.dataset.comando = comando;
      div.innerHTML = `
        <span>${icone}</span>
        <span>${texto}</span>
        <span class="cartao-remove">✕</span>
      `;
      container.appendChild(div);

      // Scroll para o final
      container.scrollTop = container.scrollHeight;

      this.atualizarContadoresGlobais();
    },

    executarAlgoritmo() {
      if (this.emExecucao) return;

      const container = this.elementos.algoritmoMontado;
      if (!container) return;

      const comandos = container.querySelectorAll(".cartao-montado");
      if (comandos.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", "warning");
        return;
      }

      // Reinicia posição do robô
      this.posicaoRobo = { linha: 0, coluna: 0 };
      this.atualizarCelulaRobo();
      this.caminhoPercorrido = [];
      this.emExecucao = true;

      // Executa passo a passo
      let index = 0;
      const interval = setInterval(() => {
        if (index >= comandos.length) {
          clearInterval(interval);
          this.emExecucao = false;
          this.verificarVitoria();
          return;
        }

        const comando = comandos[index].dataset.comando;
        const movido = this.executarComando(comando);
        if (!movido) {
          // Se bateu na parede ou saiu do grid, para a execução
          clearInterval(interval);
          this.emExecucao = false;
          this.mostrarMensagem("💥 O robô bateu em uma parede! Tente outro caminho.", "erro");
          this.dispararBug();
          return;
        }

        index++;
      }, 500);
    },

    executarComando(comando) {
      let novaLinha = this.posicaoRobo.linha;
      let novaColuna = this.posicaoRobo.coluna;

      switch (comando) {
        case "cima": novaLinha--; break;
        case "baixo": novaLinha++; break;
        case "esquerda": novaColuna--; break;
        case "direita": novaColuna++; break;
        default: return false;
      }

      // Verifica limites
      const config = this.fases[this.faseAtual];
      if (novaLinha < 0 || novaLinha >= config.linhas || novaColuna < 0 || novaColuna >= config.colunas) {
        return false;
      }

      // Verifica parede
      if (this.gridData[novaLinha][novaColuna].tipo === "parede") {
        return false;
      }

      // Move robô
      this.posicaoRobo = { linha: novaLinha, coluna: novaColuna };
      this.atualizarCelulaRobo();
      this.caminhoPercorrido.push({ linha: novaLinha, coluna: novaColuna });

      // Verifica se chegou ao alvo
      if (novaLinha === this.posicaoAlvo.linha && novaColuna === this.posicaoAlvo.coluna) {
        // Será verificado depois
      }

      return true;
    },

    verificarVitoria() {
      if (this.posicaoRobo.linha === this.posicaoAlvo.linha && this.posicaoRobo.coluna === this.posicaoAlvo.coluna) {
        this.mostrarMensagem("🎉 Parabéns! Você levou o robô até a bandeira!", "sucesso");
        // Conta como bug? Não, é sucesso.
        this.salvarRecorde();
      } else {
        this.mostrarMensagem("😅 O robô não chegou ao destino. Tente novamente!", "erro");
        this.dispararBug();
      }
    },

    dispararBug() {
      this.bugsEncontrados++;
      this.atualizarContadoresGlobais();
      // Dispara evento para outros módulos
      document.dispatchEvent(new CustomEvent("robo:bug", { detail: { incremento: 1 } }));
    },

    resetarJogo() {
      if (this.emExecucao) return;
      this.posicaoRobo = { linha: 0, coluna: 0 };
      this.atualizarCelulaRobo();
      this.caminhoPercorrido = [];
      this.mostrarMensagem("🔄 Jogo resetado!", "info");
      // Limpa algoritmo?
      if (this.elementos.algoritmoMontado) {
        this.elementos.algoritmoMontado.innerHTML = `<div class="placeholder-algoritmo">🧩 Arraste os comandos para montar seu algoritmo...</div>`;
      }
    },

    mostrarDica() {
      const dicas = {
        1: "💡 Tente usar 'direita' e 'baixo' para chegar ao alvo!",
        2: "💡 Cuidado com as paredes! Planeje seu caminho.",
        3: "💡 Use loops para repetir movimentos e economizar comandos!"
      };
      this.mostrarMensagem(dicas[this.faseAtual] || "💡 Tente encontrar o caminho mais curto!", "info");
    },

    carregarExemplo() {
      if (this.emExecucao) return;
      // Limpa algoritmo e insere exemplo básico
      const container = this.elementos.algoritmoMontado;
      if (!container) return;
      container.innerHTML = "";

      const exemplo = this.faseAtual === 1 ? ["direita", "direita", "baixo", "baixo"] :
        this.faseAtual === 2 ? ["direita", "baixo", "direita", "baixo", "direita"] :
          ["baixo", "baixo", "direita", "direita", "baixo", "direita"];

      exemplo.forEach(cmd => {
        const cartao = document.createElement("div");
        cartao.className = "cartao-montado";
        const icones = { cima: "⬆️", baixo: "⬇️", esquerda: "⬅️", direita: "➡️" };
        const textos = { cima: "Cima", baixo: "Baixo", esquerda: "Esquerda", direita: "Direita" };
        cartao.dataset.comando = cmd;
        cartao.innerHTML = `
          <span>${icones[cmd] || "⬆️"}</span>
          <span>${textos[cmd] || cmd}</span>
          <span class="cartao-remove">✕</span>
        `;
        container.appendChild(cartao);
      });

      this.mostrarMensagem("📋 Exemplo carregado! Clique em Executar.", "info");
      this.atualizarContadoresGlobais();
    },

    mostrarMensagem(texto, tipo = "info") {
      const msg = this.elementos.mensagem;
      if (!msg) return;
      msg.textContent = texto;
      msg.className = "mensagem-jogo";
      if (tipo === "sucesso") msg.classList.add("sucesso");
      if (tipo === "erro") msg.classList.add("erro");
      if (tipo === "warning") msg.classList.add("warning");
    },

    salvarRecorde() {
      const chave = `recorde_fase${this.faseAtual}`;
      const passos = this.caminhoPercorrido.length;
      const recordeAtual = parseInt(localStorage.getItem(chave) || "999");
      if (passos < recordeAtual) {
        localStorage.setItem(chave, passos.toString());
        this.mostrarMensagem(`🏆 Novo recorde! ${passos} passos!`, "sucesso");
        this.carregarRecordes();
      }
    },

    carregarRecordes() {
      for (let f = 1; f <= 3; f++) {
        const chave = `recorde_fase${f}`;
        const recorde = localStorage.getItem(chave);
        const el = document.getElementById(`recordeFase${f}`);
        if (el) {
          el.textContent = recorde ? `${recorde} passos` : "—";
        }
      }
    },

    atualizarContadoresGlobais() {
      // Atualiza contador de bugs no rodapé
      const footerBug = document.getElementById("relatorioBugsFooter");
      if (footerBug) {
        footerBug.textContent = this.bugsEncontrados;
      }
      // Atualiza contador no jogo se existir
      if (this.elementos.contadorBugs) {
        this.elementos.contadorBugs.textContent = this.bugsEncontrados;
      }
    }
  };
  // ==================================================
  // 5. MÓDULO DE IMPRESSÃO DO ACCORDION (FUNÇÃO COMPLETA)
  // ==================================================
  const ImpressaoModule = (function () {
    "use strict";

    // Referência ao botão e ao accordion
    let btnImprimir = null;
    let accordion = null;

    // Constrói o HTML da nova janela com estilos e conteúdo
    function construirHtmlParaImpressao(clone) {
      const titulo = 'Planos de Aula - 4º Ano - 1º Bimestre (Hardware)';
      const bootstrapCSS = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css';
      const fontes = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Press+Start+2P&family=Chakra+Petch:wght@400;600;700&display=swap';

      return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${titulo}</title>
  <link rel="stylesheet" href="${bootstrapCSS}">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link href="${fontes}" rel="stylesheet">
  <style>
    /* Reset e base */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Chakra Petch', sans-serif;
      background: #e9f5db;
      padding: 20px;
    }
    .container-print {
      max-width: 1100px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 24px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    h1 {
      font-family: 'Press Start 2P', cursive;
      color: #ffb347;
      text-align: center;
      border-bottom: 3px solid #ffb347;
      padding-bottom: 15px;
      margin-bottom: 25px;
      font-size: 1.4rem;
    }
    h1 small {
      font-size: 0.6rem;
      display: block;
      color: #6b8c5c;
      margin-top: 8px;
    }
    /* Estilos dos accordions */
    .accordion-item {
      background: #f8f9fa;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 20px;
      border: 1px solid #4a7c3f;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .accordion-header {
      background: #627454;
    }
    .accordion-button {
      background: #627454 !important;
      color: #ffb347 !important;
      font-weight: bold;
      font-family: 'Chakra Petch', monospace;
      border: none;
      padding: 16px 20px;
      font-size: 1rem;
      width: 100%;
      text-align: left;
      cursor: default;
    }
    .accordion-button::after {
      display: none; /* remove a seta */
    }
    .accordion-body {
      background: #0d1f0b;
      color: #ebf0eb;
      padding: 20px;
    }
    .semana-card-completo {
      background: #505e45;
      padding: 16px;
      border-radius: 12px;
    }
    .semana-card-completo h5 {
      color: #ffb347;
      margin-top: 16px;
      margin-bottom: 8px;
      font-weight: 700;
      border-left: 4px solid #ffb347;
      padding-left: 12px;
    }
    .semana-card-completo h5:first-of-type {
      margin-top: 0;
    }
    .semana-card-completo ul, .semana-card-completo p {
      margin-bottom: 12px;
      line-height: 1.5;
      color: #ebf0eb;
    }
    .semana-card-completo li {
      color: #ebf0eb;
    }
    .check-concluido {
      display: none !important;
    }
    .minuto-item {
      display: flex;
      margin-bottom: 10px;
      background: #0a0f08;
      border-radius: 16px;
      overflow: hidden;
      border-left: 4px solid #ffb347;
    }
    .minuto-tempo {
      background: #2c3e2b;
      padding: 10px 16px;
      font-weight: bold;
      font-family: 'Press Start 2P', cursive;
      font-size: 0.6rem;
      min-width: 100px;
      text-align: center;
      color: #ffb347;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .minuto-descricao {
      padding: 10px 16px;
      flex: 1;
      line-height: 1.4;
      color: #ebf0eb;
    }
    .frase-do-dia {
      background: #2c3e2b;
      border-radius: 16px;
      padding: 12px 20px;
      margin-top: 16px;
      text-align: center;
      border: 1px dashed #ffb347;
      color: #ebf0eb;
      font-style: italic;
    }
    .frase-do-dia i {
      color: #ffb347;
      margin-right: 8px;
    }
    .materiais-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 12px;
    }
    .material-badge {
      background: #2c3e2b;
      padding: 4px 12px;
      border-radius: 40px;
      font-size: 0.7rem;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-left: 2px solid #ffb347;
      color: #ebf0eb;
    }
    .material-badge i {
      font-size: 0.9rem;
    }
    .table-robotica {
      background: #1e2a1a;
      border-radius: 16px;
      overflow: hidden;
      color: #ebf0eb;
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .table-robotica th {
      background: #2c3e2b;
      color: #ffb347;
      padding: 10px 12px;
      text-align: left;
    }
    .table-robotica td {
      padding: 10px 12px;
      border-top: 1px solid #4a7c3f;
      color: #ebf0eb;
    }
    .table-robotica tbody tr:hover {
      background: #1e2a1a;
    }
    .codigo-container {
      background: #0a0f08;
      border-radius: 16px;
      padding: 16px;
      margin: 12px 0;
      border: 1px solid #4a7c3f;
      overflow-x: auto;
    }
    .codigo-container pre {
      margin: 0;
      color: #ebf0eb;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .tabela-criterios-semana {
      background: #0a0f08;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 16px;
    }
    .tabela-criterios-semana thead {
      background: #2c3e2b;
      color: #ffb347;
    }
    .tabela-criterios-semana th, .tabela-criterios-semana td {
      padding: 8px 12px;
      border-color: #4a7c3f;
      vertical-align: middle;
    }
    .rodape-impressao {
      text-align: center;
      margin-top: 30px;
      font-size: 0.8rem;
      color: #6b8c5c;
      border-top: 2px dashed #ffb347;
      padding-top: 20px;
    }

    /* Regras para impressão */
    @media print {
      body {
        background: white !important;
        padding: 0.5cm;
      }
      .container-print {
        box-shadow: none !important;
        padding: 10px;
        border-radius: 0;
        background: white !important;
      }
      h1 {
        color: #ffb347 !important;
        border-bottom-color: #ffb347 !important;
      }
      .accordion-item {
        break-inside: avoid;
        page-break-inside: avoid;
        margin-bottom: 12px;
        border: 1px solid #4a7c3f;
      }
      .accordion-button {
        background: #627454 !important;
        color: #ffb347 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .accordion-body {
        background: #0d1f0b !important;
        color: #ebf0eb !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .semana-card-completo {
        background: #505e45 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .minuto-item {
        break-inside: avoid;
      }
      .table-robotica {
        background: #1e2a1a !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .table-robotica th {
        background: #2c3e2b !important;
        color: #ffb347 !important;
      }
      .codigo-container {
        background: #0a0f08 !important;
        border-color: #4a7c3f !important;
      }
      .frase-do-dia {
        background: #2c3e2b !important;
        border-color: #ffb347 !important;
      }
      .material-badge {
        background: #2c3e2b !important;
        border-left-color: #ffb347 !important;
      }
      .tabela-criterios-semana thead {
        background: #2c3e2b !important;
        color: #ffb347 !important;
      }
      .minuto-tempo {
        background: #2c3e2b !important;
        color: #ffb347 !important;
      }
      /* Remove elementos desnecessários */
      .btn-robotico-ano2, .check-concluido, .accordion-button::after {
        display: none !important;
      }
      .rodape-impressao {
        color: #6b8c5c !important;
      }
    }
  </style>
</head>
<body>
  <div class="container-print">
    <h1>🤖 Planos de Aula Detalhados<br><small>4º Ano – 1º Bimestre (Hardware)</small></h1>
    ${clone.outerHTML}
    <div class="rodape-impressao">
      Documento gerado automaticamente – RobôMestres do Paraná
    </div>
  </div>
  <script>
    // Aguarda o carregamento e dispara a impressão automaticamente
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
        // Opcional: fechar a janela após a impressão (comentado para permitir revisão)
        // window.close();
      }, 500);
    });
  <\/script>
</body>
</html>`;
    }

    // Prepara o clone do accordion para impressão
    function prepararClone(accordionOriginal) {
      // Clona o nó inteiro
      const clone = accordionOriginal.cloneNode(true);

      // Remove checkboxes e labels de "concluída"
      const elementosRemover = clone.querySelectorAll('.semana-check, .check-concluido');
      elementosRemover.forEach(el => el.remove());

      // Abre todos os painéis (remove classes de colapso)
      const botoes = clone.querySelectorAll('.accordion-button');
      botoes.forEach(btn => {
        btn.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
      });

      const colapsos = clone.querySelectorAll('.accordion-collapse');
      colapsos.forEach(col => {
        col.classList.add('show');
        col.classList.remove('collapse');
      });

      return clone;
    }

    // Função principal de impressão
    function imprimirAccordion() {
      if (!accordion) {
        alert('🤖 Nenhum plano de aula encontrado para imprimir.');
        return;
      }

      // Prepara o clone com todos os painéis abertos e sem checkboxes
      const clone = prepararClone(accordion);

      // Constrói o HTML final
      const htmlCompleto = construirHtmlParaImpressao(clone);

      // Abre uma nova janela
      const win = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,menubar=yes');
      if (win) {
        win.document.write(htmlCompleto);
        win.document.close();
      } else {
        alert('⚠️ Permita pop-ups para imprimir os planos de aula.');
      }
    }

    // Inicialização do módulo
    function init() {
      btnImprimir = document.getElementById('btnImprimirPlanos');
      accordion = document.getElementById('accordionAulas');

      if (btnImprimir && accordion) {
        btnImprimir.addEventListener('click', imprimirAccordion);
        console.log('🖨️ [ImpressaoModule] Botão de impressão do accordion ativado.');
      } else {
        console.log('⏳ [ImpressaoModule] Elementos não encontrados (página sem accordion).');
      }
    }

    // Retorna a API pública
    return {
      init: init,
      imprimir: imprimirAccordion   // expõe para possíveis chamadas externas
    };
  })();

  // ==================================================
  // 6. INICIALIZAÇÃO DE TODOS OS MÓDULOS
  // ==================================================
  function initAll() {
    MenuModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    LoopDashModule.init();
    ImpressaoModule.init();   // <-- Módulo de impressão do accordion

    // Sincroniza contador de bugs entre módulos
    document.addEventListener("robo:bug", (e) => {
      const incremento = e.detail?.incremento || 1;
      if (LoopDashModule.bugsEncontrados !== undefined) {
        LoopDashModule.bugsEncontrados += incremento;
        LoopDashModule.atualizarContadoresGlobais();
      }
    });
  }

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // ==================================================
  // 7. ADICIONA ANIMAÇÕES CSS DINAMICAMENTE
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
    @keyframes flutuarBadge {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    @keyframes piscaVariavel {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); background-color: #ffb347; }
    }
    @keyframes bugVibracao {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px) rotate(-1deg); }
      75% { transform: translateX(2px) rotate(1deg); }
    }
    @keyframes glowPulse {
      0% { text-shadow: 0 0 2px #ffb347; }
      100% { text-shadow: 0 0 8px #ffcc44; }
    }
    @keyframes contadorPisca {
      0%, 100% { background-color: rgba(0,0,0,0.3); transform: scale(1); }
      50% { background-color: rgba(255,180,71,0.5); transform: scale(1.05); }
    }
    .variavel-destacada {
      animation: piscaVariavel 1s ease-in-out infinite;
      padding: 0.2rem 0.5rem;
      border-radius: 20px;
      display: inline-block;
    }
    .bug-detectado {
      animation: bugVibracao 0.2s ease-in-out 3;
      background-color: #e74c3c20;
      border-left: 3px solid #e74c3c;
      padding-left: 0.5rem;
    }
    .flutuar {
      animation: flutuarSuave 3s ease-in-out infinite;
    }
    @keyframes flutuarSuave {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
      100% { transform: translateY(0px); }
    }
    #relatorioBugs.atualizando {
      animation: contadorPisca 0.3s ease-in-out;
    }
    .projeto-header h2 i {
      animation: glowPulse 1.5s ease-in-out infinite alternate;
    }
    .badge-projeto {
      animation: flutuarBadge 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);

  // ==================================================
  // 8. EXPOSIÇÃO DOS MÓDULOS GLOBALMENTE
  // ==================================================
  window.MenuModule = MenuModule;
  window.PlanosAulaModule = PlanosAulaModule;
  window.CertificadoModule = CertificadoModule;
  window.LoopDashModule = LoopDashModule;
  window.ImpressaoModule = ImpressaoModule;

  console.log(
    "✅ [a4bim1_hardware.js] Todos os módulos carregados com sucesso!",
  );
})();
