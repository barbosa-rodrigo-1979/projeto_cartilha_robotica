// ==================================================
// a4bim3.js – SCRIPTS COMPLETOS PARA O 3º BIMESTRE DO 4º ANO
// Unifica: menu, planos de aula, certificado, jogo, fechamento
// ==================================================

(function () {
  "use strict";

  // ============================================================
  // 1. MENU (modelo_menu_bim)
  // ============================================================
  function highlightCurrentPage() {
    const currentPath =
      window.location.pathname.split("/").pop() || "a4bim3.html";
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
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", highlightCurrentPage);
  } else {
    highlightCurrentPage();
  }

  // ============================================================
  // 2. PLANOS DE AULA (modelo_planos_aula)
  // ============================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_4ano_bim3",
    totalSemanas: 10,
    elementos: {
      checkboxes: null,
    },
    init() {
      if (this.inicializado) return;
      if (
        !document.getElementById("accordionAulas") &&
        !document.getElementById("accordionAulas2")
      ) {
        console.log("PlanosAulaModule: accordion não encontrado");
        return;
      }
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
      this.carregarProgresso();
      this.configurarEventos();
      this.inicializado = true;
    },
    salvarProgresso() {
      const concluidas = {};
      this.elementos.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
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
      } catch (e) {}
    },
    configurarEventos() {
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => this.salvarProgresso());
      });
    },
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      PlanosAulaModule.init(),
    );
  } else {
    PlanosAulaModule.init();
  }

  // ============================================================
  // 3. CERTIFICADO (modelo_certificado)
  // ============================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_4ano_bim3",
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
      if (!document.getElementById("listaAlunos4")) return;
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializado = true;
    },
    carregarElementos() {
      this.elementos.inputNome = document.getElementById("nomeAluno4");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar4");
      this.elementos.listaAlunos = document.getElementById("listaAlunos4");
      this.elementos.contadorAlunos =
        document.getElementById("contadorAlunos4");
      this.elementos.btnImprimirTodos = document.getElementById(
        "btnImprimirCertificados4",
      );
      this.elementos.btnPreviewAluno =
        document.getElementById("btnPreviewAluno4");
      this.elementos.previewNome = document.getElementById("previewNomeAluno4");
      this.elementos.previewData = document.getElementById("previewData4");
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
        this.elementos.previewData.textContent = new Date().toLocaleDateString(
          "pt-BR",
        );
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
        alert("Digite o nome do aluno(a)!");
        return;
      }
      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();
      if (this.alunos.includes(nome)) {
        alert("Este aluno já está na lista!");
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
      if (confirm("Remover " + this.alunos[index] + " da lista?")) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (
          this.elementos.previewNome &&
          this.elementos.previewNome.textContent === this.alunos[index]
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
          '<li class="text-muted text-center">Nenhum aluno cadastrado</li>';
        if (contadorSpan) contadorSpan.textContent = "0";
        return;
      }
      listaUl.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <span><i class="bi bi-robot"></i> ${aluno}</span>
          <div class="btn-group gap-1">
            <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${aluno}">
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
      const html = `<!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Certificado - ${nomeAluno}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:#e0e0e0; min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
        .preview-container { max-width:800px; width:100%; }
        .preview-actions { text-align:center; margin-bottom:20px; }
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
          <h3>🏆 CERTIFICADO DE ENGENHEIRO(A) DE SISTEMAS DO CAOS</h3>
          <p>Certificamos que</p>
          <strong class="nome">${nomeAluno}</strong>
          <p>concluiu com êxito o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
          🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | ⚡ EVENTOS CONCORRENTES</p>
          <hr>
          <p>RobôMestres do Paraná • ${dataAtual}</p>
          <p style="font-size:11px; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
          <div style="margin-top:10px;">🤖 Ass: Robô Zé 4.0</div>
        </div>
      </div>
      <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body></html>`;
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("Permita pop-ups para visualizar o certificado.");
      }
    },
    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("Nenhum aluno cadastrado!");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE ENGENHEIRO(A) DE SISTEMAS DO CAOS</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${aluno}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | ⚡ EVENTOS CONCORRENTES</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Certificados - 4º Ano</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:white; padding:20px; }
        .print-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media print { body { padding:0; margin:0; } .print-grid { gap:15px; } @page { size:A4; margin:0.8cm; } }
      </style>
      </head><body>
      <div class="print-grid">${cardsHTML}</div>
      <script>window.onload = function() { setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 200); };<\/script>
      </body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else {
        alert("Permita pop-ups para gerar os certificados em lote.");
      }
    },
    previewAlunoSelecionado() {
      const nomeSelecionado = this.elementos.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("Selecione um aluno na lista primeiro!");
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
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      CertificadoModule.init(),
    );
  } else {
    CertificadoModule.init();
  }

  // ============================================================
  // 4. JOGO DO BIMESTRE - MISSÃO: RESGATE DO GIZ (VERSÃO REVISADA)
  // ============================================================
  const JogoModule = {
    inicializado: false,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 5, y: 0, direcao: 1 },
    pontos: 0,
    bugs: 0,
    // Tabuleiro 6x6
    grid: [
      ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
      ["⬜", "🧱", "⬜", "🧱", "⬜", "⬜"],
      ["⬜", "⬜", "⬜", "🧱", "⬜", "⬜"],
      ["🧱", "⬜", "🧱", "⬜", "⬜", "⬜"],
      ["⬜", "⬜", "⬜", "⬜", "🧱", "⬜"],
      ["⬜", "🧱", "⬜", "⬜", "⬜", "🖍️"],
    ],
    // Opções de condição para o SE
    condicoesDisponiveis: [
      { id: "obstaculo_frente", descricao: "Obstáculo à frente" },
      { id: "giz_frente", descricao: "Giz à frente" },
      { id: "luz_baixa", descricao: "Sensor de luz < 50" },
      { id: "luz_alta", descricao: "Sensor de luz >= 50" },
      { id: "toque_ativado", descricao: "Sensor de toque ativado" },
      { id: "sempre", descricao: "Sempre (verdadeiro)" },
    ],
    elementos: {
      grid: null,
      cartoesUsados: null,
      pontos: null,
      status: null,
      bonus: null,
      algoritmoMontado: null,
      mensagem: null,
    },
    init() {
      if (this.inicializado) return;
      if (!document.getElementById("jogoGrid")) return;
      this.capturarElementos();
      this.configurarEventos();
      this.desenharGrid();
      this.atualizarStatus();
      this.inicializado = true;
    },
    capturarElementos() {
      this.elementos.grid = document.getElementById("jogoGrid");
      this.elementos.cartoesUsados = document.getElementById("jogoCartoes");
      this.elementos.pontos = document.getElementById("jogoPontos");
      this.elementos.status = document.getElementById("jogoStatus");
      this.elementos.bonus = document.getElementById("jogoBonus");
      this.elementos.algoritmoMontado = document.getElementById(
        "algoritmoMontadoJogo",
      );
      this.elementos.mensagem = document.getElementById("jogoMensagem");
    },
    desenharGrid() {
      if (!this.elementos.grid) return;
      this.elementos.grid.innerHTML = "";
      for (let l = 0; l < 6; l++) {
        for (let c = 0; c < 6; c++) {
          const cell = document.createElement("div");
          cell.className = "jogo-cell";
          const valor = this.grid[l][c];
          if (valor === "🧱") cell.classList.add("wall");
          else if (valor === "🖍️") cell.classList.add("target");
          else if (valor === "🔍") cell.classList.add("clue");
          else cell.classList.add("path");
          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c) {
            cell.classList.add("robot");
          }
          this.elementos.grid.appendChild(cell);
        }
      }
    },
    // Função auxiliar para verificar se há obstáculo à frente
    haObstaculoFrente() {
      const { x, y, direcao } = this.posicaoRobo;
      let nx = x,
        ny = y;
      if (direcao === 0) nx--;
      else if (direcao === 1) ny++;
      else if (direcao === 2) nx++;
      else if (direcao === 3) ny--;
      if (nx < 0 || nx >= 6 || ny < 0 || ny >= 6) return true;
      return this.grid[nx][ny] === "🧱";
    },
    haGizFrente() {
      const { x, y, direcao } = this.posicaoRobo;
      let nx = x,
        ny = y;
      if (direcao === 0) nx--;
      else if (direcao === 1) ny++;
      else if (direcao === 2) nx++;
      else if (direcao === 3) ny--;
      if (nx < 0 || nx >= 6 || ny < 0 || ny >= 6) return false;
      return this.grid[nx][ny] === "🖍️";
    },
    // Avalia uma condição
    avaliarCondicao(condId) {
      switch (condId) {
        case "obstaculo_frente":
          return this.haObstaculoFrente();
        case "giz_frente":
          return this.haGizFrente();
        case "luz_baixa":
          return true; // simulação: sempre verdadeiro para demo
        case "luz_alta":
          return false;
        case "toque_ativado":
          return Math.random() < 0.3; // simulação
        case "sempre":
          return true;
        default:
          return false;
      }
    },
    // Adiciona cartão com possibilidade de escolher condição para SE
    adicionarCartao(comando, parentContainer = null) {
      let cartaoObj = {
        comando: comando,
        filhos: [],
        contador: 3,
        condicao: "sempre",
      };
      if (comando === "repita") {
        cartaoObj.filhos = [];
        cartaoObj.contador = 3;
      }
      if (comando === "se") {
        // Mostra modal para escolher condição
        this.mostrarModalCondicao((condId) => {
          cartaoObj.condicao = condId;
          if (parentContainer) {
            parentContainer.filhos.push(cartaoObj);
          } else {
            this.cartoesAlgoritmo.push(cartaoObj);
          }
          this.renderizarAlgoritmo();
          this.atualizarStatus();
          this.mostrarMensagem(
            `➕ SE adicionado com condição: ${this.getNomeCondicao(condId)}`,
            "info",
          );
        });
        return; // aguarda callback
      }
      // Para outros comandos, adiciona diretamente
      if (parentContainer) {
        parentContainer.filhos.push(cartaoObj);
      } else {
        this.cartoesAlgoritmo.push(cartaoObj);
      }
      this.renderizarAlgoritmo();
      this.atualizarStatus();
      this.mostrarMensagem(
        `➕ ${this.getNomeComando(comando)} adicionado!`,
        "info",
      );
    },
    mostrarModalCondicao(callback) {
      let modalHtml = `
        <div id="modalCondicao" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;">
          <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:400px; width:90%;">
            <h3 style="color:#ffb347;">❓ Escolha a condição do SE</h3>
            <div style="display:flex; flex-direction:column; gap:10px; margin:20px 0;">
      `;
      this.condicoesDisponiveis.forEach((cond) => {
        modalHtml += `
          <button class="btn-condicao" data-cond="${cond.id}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:10px; cursor:pointer; color:#e9f5db; font-weight:bold; transition:0.2s;">
            ${cond.descricao}
          </button>
        `;
      });
      modalHtml += `
            </div>
            <button id="btnCancelarCondicao" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; color:white; cursor:pointer;">CANCELAR</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalCondicao");
      document.querySelectorAll(".btn-condicao").forEach((btn) => {
        btn.addEventListener("click", () => {
          const condId = btn.getAttribute("data-cond");
          if (modal) modal.remove();
          callback(condId);
        });
      });
      const btnCancelar = document.getElementById("btnCancelarCondicao");
      if (btnCancelar)
        btnCancelar.addEventListener("click", () => {
          if (modal) modal.remove();
        });
    },
    getNomeCondicao(condId) {
      const found = this.condicoesDisponiveis.find((c) => c.id === condId);
      return found ? found.descricao : condId;
    },
    getNomeComando(comando) {
      const nomes = {
        ande1: "ANDE 1",
        ande2: "ANDE 2",
        vireDireita: "DIREITA",
        vireEsquerda: "ESQUERDA",
        repita: "REPITA",
        se: "SE",
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
        se: "❓",
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
        const div = this.criarCartaoElemento(cartao, idx, false);
        this.elementos.algoritmoMontado.appendChild(div);
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
          <input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10" style="width:50px; border-radius:20px; text-align:center; background:#ffb347; border:none; padding:2px 4px;">
          <span class="cartao-texto">vezes</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";
        const btnAdd = document.createElement("button");
        btnAdd.innerHTML = "+ comando";
        btnAdd.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:2px 8px; font-size:0.6rem; cursor:pointer; margin-bottom:4px;";
        btnAdd.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaContainer(cartao);
        });
        filhosDiv.appendChild(btnAdd);
        if (cartao.filhos && cartao.filhos.length > 0) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx, true);
            filhosDiv.appendChild(filhoDiv);
          });
        }
        div.appendChild(header);
        div.appendChild(filhosDiv);
        const input = header.querySelector(".repita-contador-input");
        if (input) {
          input.addEventListener("change", () => {
            cartao.contador = parseInt(input.value) || 3;
            this.atualizarStatus();
          });
        }
      } else if (cartao.comando === "se") {
        div.classList.add("se-container");
        const header = document.createElement("div");
        header.className = "se-header";
        const nomeCond = this.getNomeCondicao(cartao.condicao);
        header.innerHTML = `
          <span class="cartao-icone">❓</span>
          <span class="cartao-texto">SE</span>
          <span class="cartao-condicao" style="background:#2c3e2b; padding:0 8px; border-radius:12px; font-size:0.7rem; color:#ffcc44;">${nomeCond}</span>
          <span class="cartao-texto">ENTÃO</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "se-filhos";
        const btnAdd = document.createElement("button");
        btnAdd.innerHTML = "+ comando";
        btnAdd.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:2px 8px; font-size:0.6rem; cursor:pointer; margin-bottom:4px;";
        btnAdd.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaContainer(cartao);
        });
        filhosDiv.appendChild(btnAdd);
        if (cartao.filhos && cartao.filhos.length > 0) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx, true);
            filhosDiv.appendChild(filhoDiv);
          });
        }
        div.appendChild(header);
        div.appendChild(filhosDiv);
        // Botão para alterar condição (opcional)
        const alterarCond = document.createElement("button");
        alterarCond.innerHTML = "⚙️";
        alterarCond.style.cssText =
          "background:transparent; border:none; color:#ffb347; cursor:pointer; font-size:0.8rem; margin-left:4px;";
        alterarCond.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarModalCondicao((novaCond) => {
            cartao.condicao = novaCond;
            this.renderizarAlgoritmo();
            this.atualizarStatus();
          });
        });
        header.appendChild(alterarCond);
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
    mostrarSelecaoComandoParaContainer(container) {
      const comandos = [
        { comando: "ande1", nome: "ANDE 1", icone: "🚶" },
        { comando: "ande2", nome: "ANDE 2", icone: "🏃" },
        { comando: "vireDireita", nome: "DIREITA", icone: "▶️" },
        { comando: "vireEsquerda", nome: "ESQUERDA", icone: "◀️" },
        { comando: "repita", nome: "REPITA", icone: "🔄" },
        { comando: "se", nome: "SE", icone: "❓" },
      ];
      let modalHtml = `
        <div id="modalComandoJogo" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;">
          <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:400px; width:90%;">
            <h3 style="color:#ffb347;">➕ Adicionar comando</h3>
            <div style="display:flex; flex-wrap:wrap; gap:12px; margin:20px 0; justify-content:center;">
      `;
      comandos.forEach((cmd) => {
        modalHtml += `
          <button class="btn-selecionar-cmd-jogo" data-comando="${cmd.comando}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:10px; cursor:pointer; min-width:70px;">
            <div style="font-size:1.8rem;">${cmd.icone}</div>
            <div style="color:#ffb347; font-size:0.7rem;">${cmd.nome}</div>
          </button>
        `;
      });
      modalHtml += `
            </div>
            <button id="btnFecharModalJogo" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; color:white; cursor:pointer;">FECHAR</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComandoJogo");
      document.querySelectorAll(".btn-selecionar-cmd-jogo").forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.getAttribute("data-comando");
          if (modal) modal.remove();
          // Se for SE, chama adicionarCartao que abrirá modal de condição
          this.adicionarCartao(comando, container);
        });
      });
      const btnFechar = document.getElementById("btnFecharModalJogo");
      if (btnFechar)
        btnFechar.addEventListener("click", () => {
          if (modal) modal.remove();
        });
    },
    removerCartao(idx, isFilho) {
      if (!isFilho && this.cartoesAlgoritmo[idx]) {
        this.cartoesAlgoritmo.splice(idx, 1);
      }
      this.renderizarAlgoritmo();
      this.atualizarStatus();
    },
    limparAlgoritmo() {
      this.cartoesAlgoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarStatus();
      this.mostrarMensagem("🧹 Algoritmo limpo!", "info");
    },
    resetarRobo() {
      this.posicaoRobo = { x: 5, y: 0, direcao: 1 };
      this.desenharGrid();
      if (this.elementos.status) this.elementos.status.textContent = "PRONTO";
    },
    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", "erro");
        return;
      }
      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando...", "info");
      if (this.elementos.status)
        this.elementos.status.textContent = "EXECUTANDO...";
      let sucesso = true;
      let erroMsg = "";
      try {
        for (const comando of this.cartoesAlgoritmo) {
          const resultado = await this.executarComando(comando);
          if (!resultado.sucesso) {
            sucesso = false;
            erroMsg = resultado.erro;
            break;
          }
        }
      } catch (err) {
        sucesso = false;
        erroMsg = err.message;
      }
      const encontrouGiz = this.verificarGiz();
      if (sucesso && encontrouGiz) {
        const totalCartoes = this.contarCartoes();
        this.pontos += Math.max(10 - Math.floor(totalCartoes / 2), 0);
        this.mostrarMensagem(
          `🎉 GIZ ENCONTRADO! +${Math.max(10 - Math.floor(totalCartoes / 2), 0)} pontos!`,
          "success",
        );
        if (this.elementos.status)
          this.elementos.status.textContent = "VITÓRIA! 🏆";
      } else if (!sucesso) {
        this.bugs++;
        this.mostrarMensagem(`🐛 BUG: ${erroMsg}`, "erro");
        if (this.elementos.status)
          this.elementos.status.textContent = "BUGOU! 💥";
      } else {
        this.mostrarMensagem(
          "😅 O robô não encontrou o giz! Tente novamente.",
          "erro",
        );
        if (this.elementos.status)
          this.elementos.status.textContent = "PERDEU!";
      }
      this.atualizarStatus();
    },
    async executarComando(comandoObj) {
      const comando = comandoObj.comando;
      if (comando === "repita") {
        const vezes = comandoObj.contador || 3;
        for (let i = 0; i < vezes; i++) {
          for (const filho of comandoObj.filhos || []) {
            const resultado = await this.executarComando(filho);
            if (!resultado.sucesso) return resultado;
            await this.delay(200);
            this.desenharGrid();
          }
        }
        return { sucesso: true };
      }
      if (comando === "se") {
        const condicaoVerdadeira = this.avaliarCondicao(comandoObj.condicao);
        if (condicaoVerdadeira) {
          for (const filho of comandoObj.filhos || []) {
            const resultado = await this.executarComando(filho);
            if (!resultado.sucesso) return resultado;
            await this.delay(200);
            this.desenharGrid();
          }
        }
        return { sucesso: true };
      }
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
      if (novoX < 0 || novoX >= 6 || novoY < 0 || novoY >= 6) {
        return { sucesso: false, erro: "Robô saiu da pista!" };
      }
      if (this.grid[novoX][novoY] === "🧱") {
        return { sucesso: false, erro: "Bateu em um obstáculo! 🧱" };
      }
      this.posicaoRobo.x = novoX;
      this.posicaoRobo.y = novoY;
      await this.delay(200);
      this.desenharGrid();
      return { sucesso: true };
    },
    verificarGiz() {
      return this.grid[this.posicaoRobo.x][this.posicaoRobo.y] === "🖍️";
    },
    contarCartoes(arr) {
      if (!arr) arr = this.cartoesAlgoritmo;
      let total = 0;
      for (const item of arr) {
        total++;
        if (item.filhos && item.filhos.length > 0) {
          total += this.contarCartoes(item.filhos);
        }
      }
      return total;
    },
    atualizarStatus() {
      const totalCartoes = this.contarCartoes();
      if (this.elementos.cartoesUsados)
        this.elementos.cartoesUsados.textContent = totalCartoes;
      if (this.elementos.pontos)
        this.elementos.pontos.textContent = this.pontos;
      // Verifica aninhamento (loopception)
      let temAninhado = false;
      const verificar = (arr) => {
        for (const item of arr) {
          if (
            item.comando === "repita" &&
            item.filhos &&
            item.filhos.length > 0
          ) {
            for (const f of item.filhos) {
              if (f.comando === "se" || f.comando === "repita")
                temAninhado = true;
            }
            verificar(item.filhos);
          }
          if (item.comando === "se" && item.filhos && item.filhos.length > 0) {
            verificar(item.filhos);
          }
        }
      };
      verificar(this.cartoesAlgoritmo);
      if (this.elementos.bonus) {
        this.elementos.bonus.textContent = temAninhado ? "⭐ ANINHADO!" : "---";
      }
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    mostrarMensagem(texto, tipo) {
      if (!this.elementos.mensagem) return;
      this.elementos.mensagem.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      this.elementos.mensagem.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "success" ? "sucesso" : ""}`;
      if (tipo !== "erro") {
        setTimeout(() => {
          if (this.elementos.mensagem)
            this.elementos.mensagem.className = "mensagem-jogo";
        }, 4000);
      }
    },
    mostrarDica() {
      this.mostrarMensagem(
        "💡 Use REPITA para repetir movimentos e SE para tomar decisões com condições reais (ex: obstáculo à frente). Aninhe comandos para mais eficiência!",
        "info",
      );
    },
    carregarExemplo() {
      this.limparAlgoritmo();
      // Exemplo: repita 3 vezes [ande1, se obstáculo_frente então vireDireita senao ande2]
      const seObj = {
        comando: "se",
        condicao: "obstaculo_frente",
        filhos: [{ comando: "vireDireita", filhos: [] }],
      };
      const repitaObj = {
        comando: "repita",
        contador: 3,
        filhos: [
          { comando: "ande1", filhos: [] },
          seObj,
          { comando: "ande2", filhos: [] },
        ],
      };
      this.cartoesAlgoritmo.push(repitaObj);
      this.renderizarAlgoritmo();
      this.atualizarStatus();
      this.mostrarMensagem(
        "📋 Exemplo carregado! Clique em EXECUTAR.",
        "success",
      );
    },
    configurarEventos() {
      document
        .querySelectorAll("#cartoesGridJogo .cartao-comando")
        .forEach((cartao) => {
          cartao.addEventListener("click", () => {
            const comando = cartao.getAttribute("data-comando");
            this.adicionarCartao(comando);
          });
        });
      const btnLimpar = document.getElementById("btnLimparJogo");
      if (btnLimpar)
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      const btnExecutar = document.getElementById("btnExecutarJogo");
      const btnReset = document.getElementById("btnResetJogo");
      const btnDica = document.getElementById("btnDicaJogo");
      const btnExemplo = document.getElementById("btnExemploJogo");
      if (btnExecutar)
        btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset)
        btnReset.addEventListener("click", () => {
          this.resetarRobo();
          this.atualizarStatus();
          this.mostrarMensagem("🔄 Robô reiniciado!", "info");
        });
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo)
        btnExemplo.addEventListener("click", () => this.carregarExemplo());
    },
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => JogoModule.init());
  } else {
    JogoModule.init();
  }

  // ============================================================
  // 5. RODAPÉ - Sincronização do relatório de bugs
  // ============================================================
  const relatorioElement = document.getElementById("relatorioBugs");
  if (relatorioElement) {
    let contadorBugs = 0;
    try {
      const salvo = localStorage.getItem("cabecalho_contador_bugs");
      if (salvo) contadorBugs = parseInt(salvo) || 0;
    } catch (e) {}
    relatorioElement.innerText = contadorBugs;
    // Atualiza quando o jogo encontra bug
    document.addEventListener("robo:bug", () => {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        contadorBugs = salvo ? parseInt(salvo) || 0 : 0;
        relatorioElement.innerText = contadorBugs;
        relatorioElement.classList.add("atualizando");
        setTimeout(() => relatorioElement.classList.remove("atualizando"), 300);
      } catch (e) {}
    });
  }

  console.log(
    "%c🤖 [a4bim3] Todos os módulos carregados!",
    "color: #ffb347; font-size:14px; font-weight:bold;",
  );
  console.log(
    "%c🔁 Loop não é macarrão! Variável não é coisa de velho! Depurar não é xingamento!",
    "color: #9bbc7b;",
  );
})();
