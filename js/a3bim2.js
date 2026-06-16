// ==================================================
// a3bim2.js – Script unificado para 3º ano – Bimestre 2
// Contém: Jogo ROBÔ DANÇARINO (Loop + Variáveis),
//          Módulo de Certificados, Animações, etc.
// ==================================================

(function () {
  "use strict";

  // ========== 1. JOGO ROBÔ DANÇARINO ==========
  const DancaRoboGame = {
    inicializado: false,
    faseAtual: 1,
    algoritmo: [],
    posicaoRobo: { x: 3, y: 2, direcao: 0 }, // 0=cima, 1=direita, 2=baixo, 3=esquerda
    variaveis: { X: 1, Y: 2, Z: 0 },
    movimentosExecutados: [],
    indicePasso: 0,
    acertos: 0,
    totalPassos: 0,
    estaExecutando: false,
    recordes: { 1: null, 2: null, 3: null, 4: null },
    passosSequencia: [],
    contadorLoop: 0,
    nivelMaximo: 4,

    // Definição das coreografias por fase
    coreografias: {
      1: {
        nome: "A MÚSICA DO ROBÔ",
        icone: "🎵",
        dica: "💡 Use a variável X para contar os passos!",
        passos: ["👣", "👣", "👣", "👣", "🔄"],
        grid: [
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "🤖", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⭐", "⬜"],
        ],
        inicio: { x: 2, y: 2 },
        variaveisSugeridas: { X: 4 },
        movimentoEsperado: ["👣", "👣", "👣", "👣", "🔄"],
      },
      2: {
        nome: "A DANÇA DO LOOP",
        icone: "🔄",
        dica: "💡 Use REPETIR 3 vezes: PASSO, PASSO, GIRO",
        passos: ["👣", "👣", "🔄", "👣", "👣", "🔄", "👣", "👣", "🔄"],
        grid: [
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "🤖", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⭐"],
        ],
        inicio: { x: 2, y: 2 },
        variaveisSugeridas: { X: 3, Y: 2 },
        movimentoEsperado: [
          "👣",
          "👣",
          "🔄",
          "👣",
          "👣",
          "🔄",
          "👣",
          "👣",
          "🔄",
        ],
      },
      3: {
        nome: "VARIAÇÃO NO COMPASSO",
        icone: "🎶",
        dica: "💡 Use dois loops: REPETIR 3 vezes (PASSO, GIRO) e REPETIR 2 vezes PASSO",
        passos: ["👣", "🔄", "👣", "🔄", "👣", "👣", "👣", "🔄", "👣", "🔄"],
        grid: [
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "🤖", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "⭐"],
        ],
        inicio: { x: 2, y: 2 },
        variaveisSugeridas: { X: 3, Y: 2 },
        movimentoEsperado: [
          "👣",
          "🔄",
          "👣",
          "🔄",
          "👣",
          "👣",
          "👣",
          "🔄",
          "👣",
          "🔄",
        ],
      },
      4: {
        nome: "DEPURAÇÃO NA PISTA",
        icone: "🐛",
        dica: "💡 O algoritmo está ERRADO! Encontre o BUG e corrija! (Faltou um PASSO)",
        passos: ["👣", "👣", "👣", "👣", "🔄", "👣"],
        grid: [
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "🤖", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⭐", "⬜"],
        ],
        inicio: { x: 2, y: 2 },
        variaveisSugeridas: { X: 4 },
        movimentoEsperado: ["👣", "👣", "👣", "👣", "🔄", "👣"],
        // Versão bugada para depuração
        algoritmoBugado: [
          { tipo: "PASSO" },
          { tipo: "PASSO" },
          { tipo: "PASSO" },
          { tipo: "PASSO" },
          { tipo: "GIRO" },
          // FALTOU UM PASSO AQUI!
        ],
      },
    },

    elementos: {
      palco: null,
      grid: null,
      algoritmoMontado: null,
      cartoesUsados: null,
      passosExecutados: null,
      acertos: null,
      status: null,
      mensagem: null,
      faseNome: null,
      faseIcone: null,
      recordeFase1: null,
      recordeFase2: null,
      recordeFase3: null,
      recordeFase4: null,
      variaveisDisplay: null,
      coreografiaDisplay: null,
      btnExecutar: null,
      btnReset: null,
      btnDica: null,
      btnDepurar: null,
      btnLimpar: null,
      progressoBar: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;
      const container = document.getElementById("dancaRoboGame");
      if (!container) return;

      this.renderizarEstrutura(container);
      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
      this.inicializado = true;
      console.log("🕺 DancaRoboGame inicializado");
    },

    // ========== RENDERIZAÇÃO DA ESTRUTURA ==========
    renderizarEstrutura(container) {
      container.innerHTML = `
        <div class="danca-header mb-4">
          <div class="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div class="btn-group flex-wrap" role="group">
              <button type="button" class="btn-fase fase1-btn" data-fase="1">
                🎵 FASE 1: A MÚSICA <span class="badge bg-success">INICIANTE</span>
              </button>
              <button type="button" class="btn-fase fase2-btn" data-fase="2">
                🔄 FASE 2: O LOOP <span class="badge bg-warning text-dark">INTERMEDIÁRIO</span>
              </button>
              <button type="button" class="btn-fase fase3-btn" data-fase="3">
                🎶 FASE 3: VARIAÇÃO <span class="badge bg-primary">AVANÇADO</span>
              </button>
              <button type="button" class="btn-fase fase4-btn" data-fase="4">
                🐛 FASE 4: DEPURAÇÃO <span class="badge bg-danger">MESTRE</span>
              </button>
            </div>
          </div>
        </div>

        <div class="row g-4">
          <!-- COLUNA ESQUERDA: PALCO E COREOGRAFIA -->
          <div class="col-lg-7">
            <div class="palco-container bg-robocard p-3 rounded-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span class="badge bg-warning text-dark" id="faseNomeDisplay">
                    🎵 A MÚSICA DO ROBÔ
                  </span>
                </div>
                <div class="d-flex gap-2">
                  <span class="badge bg-info" id="statusDisplay">PRONTO</span>
                </div>
              </div>

              <!-- Grid do Palco -->
              <div id="palcoGrid" class="danca-grid"></div>

              <!-- Coreografia -->
              <div class="coreografia-display mt-3 p-3 rounded-3" style="background: #0a0f08; border: 2px solid var(--robot-gold);">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="text-warning">🎵 COREOGRAFIA:</span>
                  <span id="coreografiaPassos" style="font-size: 1.5rem; letter-spacing: 4px;">👣 👣 👣 👣 🔄</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div id="progressoCoreografia" class="progress-bar bg-warning" style="width: 0%;"></div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                  <small class="text-muted">Passos: <span id="passosAtuais">0</span>/<span id="totalPassos">5</span></small>
                  <small class="text-muted">Acertos: <span id="acertosDisplay">0</span></small>
                </div>
              </div>
            </div>
          </div>

          <!-- COLUNA DIREITA: CONTROLES E ALGORITMO -->
          <div class="col-lg-5">
            <!-- Variáveis -->
            <div class="variaveis-container bg-robocard p-3 rounded-4 mb-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="text-warning">📦 VARIÁVEIS:</span>
                <button class="btn-sm btn-outline-warning" id="btnAddVariavel">+ Adicionar</button>
              </div>
              <div id="variaveisDisplay" class="d-flex flex-wrap gap-2">
                <span class="variavel-badge">X = 1</span>
                <span class="variavel-badge">Y = 2</span>
                <span class="variavel-badge">Z = 0</span>
              </div>
            </div>

            <!-- Cartões de Comando -->
            <div class="comandos-container bg-robocard p-3 rounded-4 mb-3">
              <div class="text-warning mb-2">🔧 COMANDOS (clique para adicionar ao algoritmo):</div>
              <div class="d-flex flex-wrap gap-2">
                <button class="cartao-comando" data-comando="PASSO">👣 PASSO</button>
                <button class="cartao-comando" data-comando="GIRO">🔄 GIRO</button>
                <button class="cartao-comando cartao-especial" data-comando="REPETIR">🔁 REPETIR</button>
                <button class="cartao-comando cartao-variavel" data-comando="VARIAVEL">🔢 VARIÁVEL</button>
                <button class="cartao-comando cartao-bug" data-comando="BUG">🐛 BUG</button>
              </div>
            </div>

            <!-- Algoritmo Montado -->
            <div class="algoritmo-container bg-robocard p-3 rounded-4 mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-warning">📝 SEU ALGORITMO:</span>
                <button class="btn-sm btn-danger" id="btnLimparAlgoritmo">🗑️ LIMPAR</button>
              </div>
              <div id="algoritmoMontado" class="algoritmo-montado-mini" style="min-height: 80px; background: #0a0f08; border-radius: 12px; padding: 8px;">
                <div class="placeholder-algoritmo" style="color: #666; font-size: 0.9rem; text-align: center; padding: 20px;">
                  🃏 Clique nos comandos acima para montar seu algoritmo...
                </div>
              </div>
              <div class="d-flex gap-2 mt-2">
                <span class="badge bg-secondary">Cartões: <span id="contadorCartoes">0</span></span>
                <span class="badge bg-secondary">Loops: <span id="contadorLoops">0</span></span>
              </div>
            </div>

            <!-- Botões de Ação -->
            <div class="botoes-painel d-flex flex-wrap gap-2">
              <button class="btn-executar" id="btnExecutarDanca">▶ EXECUTAR DANÇA!</button>
              <button class="btn-resetar" id="btnResetDanca">🔄 RESETAR</button>
              <button class="btn-dica" id="btnDicaDanca">💡 DICA</button>
              <button class="btn-depurar" id="btnDepurarDanca">🔍 DEPURAR</button>
            </div>

            <!-- Mensagem -->
            <div id="dancaMensagem" class="mensagem-jogo mt-3 p-2 rounded-3" style="background: #0a0f08; border-left: 4px solid var(--robot-gold);">
              <i class="bi bi-robot"></i>
              <span>🏁 Selecione uma fase e monte seu algoritmo!</span>
            </div>
          </div>
        </div>

        <!-- Recordes -->
        <div class="recordes-painel mt-4">
          <div class="recordes-header text-warning mb-2">
            <i class="bi bi-trophy-fill"></i> 🏆 RECORDES (menos cartões = melhor!)
          </div>
          <div class="d-flex flex-wrap gap-3">
            <div class="recorde-card"><span>🎵 FASE 1:</span> <strong id="recordeFase1">---</strong> cartões</div>
            <div class="recorde-card"><span>🔄 FASE 2:</span> <strong id="recordeFase2">---</strong> cartões</div>
            <div class="recorde-card"><span>🎶 FASE 3:</span> <strong id="recordeFase3">---</strong> cartões</div>
            <div class="recorde-card"><span>🐛 FASE 4:</span> <strong id="recordeFase4">---</strong> cartões</div>
          </div>
        </div>

        <div class="legenda-pista mt-3 d-flex flex-wrap gap-3">
          <span class="legenda-item"><span class="badge-robot">🤖</span> ROBÔ</span>
          <span class="legenda-item"><span class="badge-flag">⭐</span> CHEGADA</span>
          <span class="legenda-item"><span class="badge-path">⬜</span> PISTA</span>
          <span class="legenda-item"><span class="badge-loop">🔄</span> GIRO (muda direção)</span>
          <span class="legenda-item"><span class="badge-variavel">🔢</span> VARIÁVEL (contador)</span>
        </div>
      `;
    },

    // ========== CAPTURA DE ELEMENTOS ==========
    capturarElementos() {
      this.elementos.palco = document.getElementById("palcoGrid");
      this.elementos.grid = document.getElementById("palcoGrid");
      this.elementos.algoritmoMontado =
        document.getElementById("algoritmoMontado");
      this.elementos.cartoesUsados = document.getElementById("contadorCartoes");
      this.elementos.passosExecutados = document.getElementById("passosAtuais");
      this.elementos.acertos = document.getElementById("acertosDisplay");
      this.elementos.status = document.getElementById("statusDisplay");
      this.elementos.mensagem = document.getElementById("dancaMensagem");
      this.elementos.faseNome = document.getElementById("faseNomeDisplay");
      this.elementos.faseIcone = document.getElementById("faseIconeDisplay");
      this.elementos.recordeFase1 = document.getElementById("recordeFase1");
      this.elementos.recordeFase2 = document.getElementById("recordeFase2");
      this.elementos.recordeFase3 = document.getElementById("recordeFase3");
      this.elementos.recordeFase4 = document.getElementById("recordeFase4");
      this.elementos.variaveisDisplay =
        document.getElementById("variaveisDisplay");
      this.elementos.coreografiaDisplay =
        document.getElementById("coreografiaPassos");
      this.elementos.btnExecutar = document.getElementById("btnExecutarDanca");
      this.elementos.btnReset = document.getElementById("btnResetDanca");
      this.elementos.btnDica = document.getElementById("btnDicaDanca");
      this.elementos.btnDepurar = document.getElementById("btnDepurarDanca");
      this.elementos.btnLimpar = document.getElementById("btnLimparAlgoritmo");
      this.elementos.progressoBar = document.getElementById(
        "progressoCoreografia",
      );
      this.elementos.totalPassos = document.getElementById("totalPassos");
      this.elementos.contadorLoops = document.getElementById("contadorLoops");
    },

    // ========== RECORDES ==========
    carregarRecordes() {
      const saved = localStorage.getItem("danca_robo_recordes_ano3");
      if (saved)
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) {}
    },

    salvarRecordes() {
      localStorage.setItem(
        "danca_robo_recordes_ano3",
        JSON.stringify(this.recordes),
      );
    },

    // ========== CARREGAR FASE ==========
    carregarFase(fase) {
      this.faseAtual = fase;
      this.algoritmo = [];
      this.movimentosExecutados = [];
      this.indicePasso = 0;
      this.acertos = 0;
      this.totalPassos = 0;
      this.estaExecutando = false;
      this.contadorLoop = 0;

      const coreo = this.coreografias[fase];
      this.passosSequencia = coreo.passos;
      this.totalPassos = coreo.passos.length;

      // Resetar variáveis sugeridas
      this.variaveis = { X: 1, Y: 2, Z: 0 };
      if (coreo.variaveisSugeridas) {
        Object.assign(this.variaveis, coreo.variaveisSugeridas);
      }

      // Resetar posição do robô
      this.posicaoRobo = { ...coreo.inicio, direcao: 0 };

      // Atualizar UI
      this.atualizarUI();
      this.desenharGrid();
      this.atualizarRecordesDisplay();
      this.atualizarVariaveisDisplay();
      this.atualizarCoreografia();
      this.atualizarAlgoritmo();
      this.atualizarContadores();

      // Destacar fase
      document.querySelectorAll(".btn-fase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.dataset.fase) === fase) btn.classList.add("ativo");
      });

      // Status
      this.atualizarStatus("PRONTO", "info");

      this.mostrarMensagem(
        `🎵 FASE ${fase}: ${coreo.nome} selecionada! Monte seu algoritmo.`,
        "info",
      );

      // Se for fase 4, carregar o algoritmo bugado
      if (fase === 4 && coreo.algoritmoBugado) {
        this.algoritmo = coreo.algoritmoBugado.map((c) => ({ ...c }));
        this.atualizarAlgoritmo();
        this.atualizarContadores();
        this.mostrarMensagem(
          "🐛 ALGORITMO COM BUG! Encontre o erro e corrija!",
          "warning",
        );
      }
    },

    // ========== DESENHAR GRID ==========
    desenharGrid() {
      const coreo = this.coreografias[this.faseAtual];
      const grid = coreo.grid;
      const palco = this.elementos.grid;
      if (!palco) return;

      palco.style.display = "grid";
      palco.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;
      palco.style.gap = "4px";
      palco.style.maxWidth = "400px";
      palco.style.margin = "0 auto";

      palco.innerHTML = "";

      for (let l = 0; l < grid.length; l++) {
        for (let c = 0; c < grid[l].length; c++) {
          const cell = document.createElement("div");
          cell.className = "danca-cell";
          const conteudo = grid[l][c];

          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c) {
            cell.classList.add("robo");
            cell.textContent = "🤖";
            // Adicionar indicador de direção
            const dir = this.posicaoRobo.direcao;
            const setas = ["⬆️", "➡️", "⬇️", "⬅️"];
            cell.setAttribute("data-direcao", setas[dir]);
          } else if (conteudo === "⭐") {
            cell.classList.add("chegada");
            cell.textContent = "⭐";
          } else if (conteudo === "🧱") {
            cell.classList.add("obstaculo");
            cell.textContent = "🧱";
          } else {
            cell.classList.add("pista");
            cell.textContent = "⬜";
          }

          palco.appendChild(cell);
        }
      }
    },

    // ========== ATUALIZAR UI ==========
    atualizarUI() {
      const coreo = this.coreografias[this.faseAtual];
      if (this.elementos.faseNome) {
        this.elementos.faseNome.textContent = `${coreo.icone} ${coreo.nome}`;
      }
      if (this.elementos.totalPassos) {
        this.elementos.totalPassos.textContent = this.totalPassos;
      }
      if (this.elementos.passosExecutados) {
        this.elementos.passosExecutados.textContent =
          this.movimentosExecutados.length;
      }
      if (this.elementos.acertos) {
        this.elementos.acertos.textContent = this.acertos;
      }
      if (this.elementos.progressoBar) {
        const progresso =
          this.totalPassos > 0
            ? (this.movimentosExecutados.length / this.totalPassos) * 100
            : 0;
        this.elementos.progressoBar.style.width = `${Math.min(progresso, 100)}%`;
      }
    },

    atualizarCoreografia() {
      const coreo = this.coreografias[this.faseAtual];
      if (this.elementos.coreografiaDisplay) {
        this.elementos.coreografiaDisplay.textContent = coreo.passos.join(" ");
      }
    },

    atualizarVariaveisDisplay() {
      if (!this.elementos.variaveisDisplay) return;
      this.elementos.variaveisDisplay.innerHTML = "";
      for (const [key, value] of Object.entries(this.variaveis)) {
        const badge = document.createElement("span");
        badge.className = "variavel-badge";
        badge.textContent = `${key} = ${value}`;
        // Adicionar botão de edição
        const editBtn = document.createElement("button");
        editBtn.className = "btn-edit-variavel";
        editBtn.textContent = "✏️";
        editBtn.style.cssText =
          "background: none; border: none; color: #ffb347; cursor: pointer; font-size: 0.7rem; margin-left: 4px;";
        editBtn.onclick = () => this.editarVariavel(key);
        badge.appendChild(editBtn);
        this.elementos.variaveisDisplay.appendChild(badge);
      }
    },

    editarVariavel(nome) {
      const valor = prompt(
        `Digite o novo valor para ${nome}:`,
        this.variaveis[nome],
      );
      if (valor !== null && !isNaN(parseInt(valor))) {
        this.variaveis[nome] = parseInt(valor);
        this.atualizarVariaveisDisplay();
        this.mostrarMensagem(
          `🔢 ${nome} agora é ${this.variaveis[nome]}`,
          "info",
        );
      }
    },

    atualizarStatus(texto, tipo) {
      if (!this.elementos.status) return;
      this.elementos.status.textContent = texto;
      this.elementos.status.className = `badge ${tipo === "success" ? "bg-success" : tipo === "danger" ? "bg-danger" : tipo === "warning" ? "bg-warning text-dark" : "bg-info"}`;
    },

    // ========== ALGORITMO ==========
    adicionarComando(tipo) {
      if (this.estaExecutando) return;

      if (tipo === "VARIAVEL") {
        const nome = prompt("Digite o nome da variável (ex: X, Y, Z):", "X");
        if (!nome) return;
        const valor = prompt(`Digite o valor para ${nome}:`, "1");
        if (valor === null) return;
        const valNum = parseInt(valor);
        if (isNaN(valNum)) {
          this.mostrarMensagem("❌ Valor inválido! Use números.", "erro");
          return;
        }
        this.variaveis[nome] = valNum;
        this.atualizarVariaveisDisplay();
        this.mostrarMensagem(
          `🔢 Variável ${nome} = ${valNum} definida!`,
          "success",
        );
        return;
      }

      if (tipo === "REPETIR") {
        const valor = prompt("Quantas vezes repetir?", "3");
        if (valor === null) return;
        const vezes = parseInt(valor);
        if (isNaN(vezes) || vezes < 1) {
          this.mostrarMensagem("❌ Digite um número válido (>= 1)!", "erro");
          return;
        }
        this.algoritmo.push({ tipo: "REPETIR", vezes: vezes, comandos: [] });
        // Adicionar uma estrutura vazia para os comandos do loop
        // O usuário vai adicionar comandos dentro depois
        this.mostrarMensagem(
          `🔁 Loop adicionado! Clique nos comandos abaixo para adicionar dentro do loop.`,
          "info",
        );
        this.atualizarAlgoritmo();
        this.atualizarContadores();
        return;
      }

      // Verificar se há um loop aberto para adicionar dentro
      const ultimo = this.algoritmo[this.algoritmo.length - 1];
      if (ultimo && ultimo.tipo === "REPETIR") {
        // Se o último comando é REPETIR, adicionar dentro dele
        ultimo.comandos.push({ tipo: tipo });
        this.mostrarMensagem(`✅ Adicionado dentro do loop!`, "success");
      } else {
        // Adicionar normalmente
        this.algoritmo.push({ tipo: tipo });
      }

      this.atualizarAlgoritmo();
      this.atualizarContadores();
    },

    // Nova função para adicionar dentro de loops específicos
    adicionarDentroLoop(indiceLoop, tipo) {
      if (this.estaExecutando) return;
      if (indiceLoop < 0 || indiceLoop >= this.algoritmo.length) return;
      const item = this.algoritmo[indiceLoop];
      if (item.tipo !== "REPETIR") return;

      item.comandos.push({ tipo: tipo });
      this.atualizarAlgoritmo();
      this.atualizarContadores();
      this.mostrarMensagem(`✅ Adicionado dentro do loop!`, "success");
    },

    removerComando(indice, loopIndice = null) {
      if (this.estaExecutando) return;

      if (loopIndice !== null) {
        // Remover de dentro de um loop
        const loop = this.algoritmo[loopIndice];
        if (loop && loop.tipo === "REPETIR") {
          loop.comandos.splice(indice, 1);
        }
      } else {
        this.algoritmo.splice(indice, 1);
      }

      this.atualizarAlgoritmo();
      this.atualizarContadores();
    },

    atualizarAlgoritmo() {
      const container = this.elementos.algoritmoMontado;
      if (!container) return;

      if (this.algoritmo.length === 0) {
        container.innerHTML = `
          <div class="placeholder-algoritmo" style="color: #666; font-size: 0.9rem; text-align: center; padding: 20px;">
            🃏 Clique nos comandos para montar seu algoritmo...
          </div>
        `;
        return;
      }

      container.innerHTML = "";
      let loopCount = 0;

      this.algoritmo.forEach((comando, idx) => {
        const div = document.createElement("div");
        div.className = "comando-item";

        if (comando.tipo === "REPETIR") {
          div.className = "comando-item loop-container";
          div.innerHTML = `
            <div class="loop-header">
              <span class="loop-icone">🔁</span>
              <span class="loop-texto">REPETIR ${comando.vezes} vezes</span>
              <button class="btn-remove-comando" data-indice="${idx}">✖️</button>
            </div>
            <div class="loop-comandos">
              ${comando.comandos
                .map(
                  (cmd, cidx) => `
                <div class="comando-item sub-comando">
                  <span>${this.getIconeComando(cmd.tipo)} ${cmd.tipo}</span>
                  <button class="btn-remove-comando" data-loop="${idx}" data-indice="${cidx}">✖️</button>
                </div>
              `,
                )
                .join("")}
              <button class="btn-add-dentro-loop" data-loop="${idx}" style="
                background: rgba(255, 180, 71, 0.2);
                border: 1px dashed var(--robot-gold);
                border-radius: 12px;
                color: var(--robot-gold);
                padding: 4px 8px;
                font-size: 0.7rem;
                cursor: pointer;
                margin-top: 4px;
                width: 100%;
              ">+ adicionar comando dentro do loop</button>
            </div>
          `;

          // Evento para remover o loop
          const rmBtn = div.querySelector(".loop-header .btn-remove-comando");
          if (rmBtn) rmBtn.onclick = () => this.removerComando(idx);

          // Evento para adicionar dentro do loop
          const addBtn = div.querySelector(".btn-add-dentro-loop");
          if (addBtn) {
            const loopIdx = parseInt(addBtn.dataset.loop);
            addBtn.onclick = () => {
              const tipos = ["PASSO", "GIRO"];
              const escolha = prompt(
                `Digite o comando para adicionar dentro do loop (PASSO ou GIRO):`,
                "PASSO",
              );
              if (escolha && tipos.includes(escolha.toUpperCase())) {
                this.adicionarDentroLoop(loopIdx, escolha.toUpperCase());
              } else if (escolha) {
                this.mostrarMensagem(
                  "❌ Comando inválido! Use PASSO ou GIRO.",
                  "erro",
                );
              }
            };
          }

          // Eventos para remover comandos dentro do loop
          div
            .querySelectorAll(".sub-comando .btn-remove-comando")
            .forEach((btn) => {
              const loopIdx = parseInt(btn.dataset.loop);
              const cmdIdx = parseInt(btn.dataset.indice);
              btn.onclick = () => this.removerComando(cmdIdx, loopIdx);
            });

          loopCount++;
        } else {
          // Comando normal
          div.innerHTML = `
            <span>${this.getIconeComando(comando.tipo)} ${comando.tipo}</span>
            <button class="btn-remove-comando" data-indice="${idx}">✖️</button>
          `;
          const rmBtn = div.querySelector(".btn-remove-comando");
          if (rmBtn) rmBtn.onclick = () => this.removerComando(idx);
        }

        container.appendChild(div);
      });
    },

    getIconeComando(tipo) {
      const icones = {
        PASSO: "👣",
        GIRO: "🔄",
        REPETIR: "🔁",
        VARIAVEL: "🔢",
        BUG: "🐛",
      };
      return icones[tipo] || "❓";
    },

    atualizarContadores() {
      const contar = (arr) => {
        let total = 0;
        let loops = 0;
        for (const item of arr) {
          total++;
          if (item.tipo === "REPETIR") {
            loops++;
            if (item.comandos) {
              const sub = contar(item.comandos);
              total += sub.total;
              loops += sub.loops;
            }
          }
        }
        return { total, loops };
      };

      const stats = contar(this.algoritmo);
      if (this.elementos.cartoesUsados) {
        this.elementos.cartoesUsados.textContent = stats.total;
      }
      if (this.elementos.contadorLoops) {
        this.elementos.contadorLoops.textContent = stats.loops;
      }
    },

    // ========== EXECUÇÃO DO ALGORITMO ==========
    async executarAlgoritmo() {
      if (this.estaExecutando) return;
      if (this.algoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", "erro");
        return;
      }

      this.estaExecutando = true;
      this.movimentosExecutados = [];
      this.indicePasso = 0;
      this.acertos = 0;
      this.atualizarStatus("EXECUTANDO...", "warning");

      // Resetar posição do robô
      const coreo = this.coreografias[this.faseAtual];
      this.posicaoRobo = { ...coreo.inicio, direcao: 0 };
      this.desenharGrid();

      this.mostrarMensagem("🕺 Executando coreografia...", "info");

      // Executar cada comando
      let sucesso = true;
      let erroMsg = "";

      for (const comando of this.algoritmo) {
        const res = await this.executarComando(comando);
        if (!res.sucesso) {
          sucesso = false;
          erroMsg = res.erro;
          break;
        }
        // Pequeno delay para efeito visual
        await this.delay(300);
        this.desenharGrid();
        this.atualizarUI();
      }

      this.estaExecutando = false;

      // Verificar resultado
      const coreografia = this.coreografias[this.faseAtual];
      const passosEsperados = coreografia.passos;

      if (sucesso) {
        // Verificar se todos os passos foram executados
        const executados = this.movimentosExecutados;
        const esperados = passosEsperados;

        let acertos = 0;
        const maxPassos = Math.min(executados.length, esperados.length);
        for (let i = 0; i < maxPassos; i++) {
          if (executados[i] === esperados[i]) acertos++;
        }

        this.acertos = acertos;
        this.atualizarUI();

        const percentual = (acertos / esperados.length) * 100;

        if (percentual === 100) {
          // PERFEITO!
          const totalCartoes = parseInt(
            this.elementos.cartoesUsados.textContent,
          );
          const recorde = this.recordes[this.faseAtual];
          if (!recorde || totalCartoes < recorde) {
            this.recordes[this.faseAtual] = totalCartoes;
            this.salvarRecordes();
            this.atualizarRecordesDisplay();
            this.mostrarMensagem(
              `🎉 NOVO RECORDE! Dançou perfeitamente com ${totalCartoes} cartões!`,
              "success",
            );
          } else {
            this.mostrarMensagem(
              `🎉 DANÇOU PERFEITAMENTE! ${acertos}/${esperados.length} passos corretos!`,
              "success",
            );
          }
          this.atualizarStatus("🌟 PERFEITO!", "success");
        } else if (percentual >= 80) {
          this.mostrarMensagem(
            `💃 QUASE LÁ! ${acertos}/${esperados.length} passos corretos. Continue ajustando!`,
            "warning",
          );
          this.atualizarStatus("💃 QUASE LÁ!", "warning");
        } else if (percentual >= 50) {
          this.mostrarMensagem(
            `🕺 BOM COMEÇO! ${acertos}/${esperados.length} passos corretos. Tente usar mais loops!`,
            "info",
          );
          this.atualizarStatus("🕺 TREINANDO", "info");
        } else {
          this.mostrarMensagem(
            `🐛 AINDA TEM BUGS! ${acertos}/${esperados.length} passos corretos. Depure seu algoritmo!`,
            "erro",
          );
          this.atualizarStatus("🐛 COM BUGS", "danger");
        }
      } else {
        this.atualizarStatus("💥 BUG!", "danger");
        this.mostrarMensagem(`🐛 ${erroMsg}`, "erro");
      }
    },

    async executarComando(comando) {
      const coreo = this.coreografias[this.faseAtual];

      if (comando.tipo === "REPETIR") {
        const vezes = comando.vezes || 3;
        for (let i = 0; i < vezes; i++) {
          for (const cmd of comando.comandos || []) {
            const res = await this.executarComando(cmd);
            if (!res.sucesso) return res;
            await this.delay(200);
            this.desenharGrid();
            this.atualizarUI();
          }
        }
        return { sucesso: true };
      }

      if (comando.tipo === "BUG") {
        // Simular um bug: andar para trás ou direção errada
        this.posicaoRobo.direcao = (this.posicaoRobo.direcao + 2) % 4; // Vira 180°
        return {
          sucesso: false,
          erro: "🐛 BUG! Robô virou para o lado errado!",
        };
      }

      if (comando.tipo === "PASSO") {
        let nx = this.posicaoRobo.x;
        let ny = this.posicaoRobo.y;
        const dir = this.posicaoRobo.direcao;

        // Verificar se o robô está no grid
        if (dir === 0) nx--;
        else if (dir === 1) ny++;
        else if (dir === 2) nx++;
        else if (dir === 3) ny--;

        // Verificar limites
        if (
          nx < 0 ||
          nx >= coreo.grid.length ||
          ny < 0 ||
          ny >= coreo.grid[0].length
        ) {
          return { sucesso: false, erro: "Robô saiu da pista! 🚫" };
        }

        // Verificar obstáculo
        if (coreo.grid[nx][ny] === "🧱") {
          return { sucesso: false, erro: "Bateu em obstáculo! 🧱" };
        }

        this.posicaoRobo.x = nx;
        this.posicaoRobo.y = ny;

        // Registrar movimento
        this.movimentosExecutados.push("👣");

        // Verificar se chegou na estrela
        if (coreo.grid[nx][ny] === "⭐") {
          this.movimentosExecutados.push("⭐");
        }

        return { sucesso: true };
      }

      if (comando.tipo === "GIRO") {
        this.posicaoRobo.direcao = (this.posicaoRobo.direcao + 1) % 4;
        this.movimentosExecutados.push("🔄");
        return { sucesso: true };
      }

      return { sucesso: false, erro: `Comando desconhecido: ${comando.tipo}` };
    },

    // ========== DEPURAÇÃO ==========
    depurarAlgoritmo() {
      if (this.faseAtual !== 4) {
        this.mostrarMensagem(
          "🔍 Fase de depuração é apenas na FASE 4!",
          "info",
        );
        return;
      }

      const coreo = this.coreografias[4];
      const esperado = coreo.movimentoEsperado;

      // Contar passos no algoritmo
      let passosAlgoritmo = [];
      const extrairPassos = (arr) => {
        for (const item of arr) {
          if (item.tipo === "PASSO") passosAlgoritmo.push("👣");
          else if (item.tipo === "GIRO") passosAlgoritmo.push("🔄");
          else if (item.tipo === "REPETIR" && item.comandos) {
            for (let i = 0; i < (item.vezes || 3); i++) {
              extrairPassos(item.comandos);
            }
          }
        }
      };
      extrairPassos(this.algoritmo);

      // Comparar
      let bugs = [];
      for (
        let i = 0;
        i < Math.max(esperado.length, passosAlgoritmo.length);
        i++
      ) {
        if (i >= esperado.length) {
          bugs.push(`Passo ${i + 1}: Sobrando "${passosAlgoritmo[i]}"`);
        } else if (i >= passosAlgoritmo.length) {
          bugs.push(`Passo ${i + 1}: Faltando "${esperado[i]}"`);
        } else if (passosAlgoritmo[i] !== esperado[i]) {
          bugs.push(
            `Passo ${i + 1}: Esperado "${esperado[i]}", encontrado "${passosAlgoritmo[i]}"`,
          );
        }
      }

      if (bugs.length === 0) {
        this.mostrarMensagem(
          "🔍 Nenhum bug encontrado! Algoritmo está correto! 🎉",
          "success",
        );
        return;
      }

      this.mostrarMensagem(
        `🐛 Encontrei ${bugs.length} bug(s):\n${bugs.join("\n")}`,
        "erro",
      );
    },

    // ========== RECORDES DISPLAY ==========
    atualizarRecordesDisplay() {
      if (this.elementos.recordeFase1)
        this.elementos.recordeFase1.textContent = this.recordes[1] || "---";
      if (this.elementos.recordeFase2)
        this.elementos.recordeFase2.textContent = this.recordes[2] || "---";
      if (this.elementos.recordeFase3)
        this.elementos.recordeFase3.textContent = this.recordes[3] || "---";
      if (this.elementos.recordeFase4)
        this.elementos.recordeFase4.textContent = this.recordes[4] || "---";
    },

    // ========== UTILITÁRIOS ==========
    mostrarMensagem(texto, tipo) {
      if (!this.elementos.mensagem) return;
      const container = this.elementos.mensagem;
      container.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      container.className = `mensagem-jogo p-2 rounded-3`;
      container.style.background = "#0a0f08";
      if (tipo === "erro") {
        container.style.borderLeft = "4px solid #e74c3c";
        container.style.color = "#ff6b6b";
      } else if (tipo === "success") {
        container.style.borderLeft = "4px solid #2ecc71";
        container.style.color = "#7ddfa0";
      } else if (tipo === "warning") {
        container.style.borderLeft = "4px solid #f39c12";
        container.style.color = "#f1c40f";
      } else {
        container.style.borderLeft = "4px solid var(--robot-gold)";
        container.style.color = "var(--robot-text)";
      }
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // ========== CONFIGURAR EVENTOS ==========
    configurarEventos() {
      // Botões de fase
      document.querySelectorAll(".btn-fase").forEach((btn) => {
        btn.addEventListener("click", () => {
          const fase = parseInt(btn.dataset.fase);
          if (fase) this.carregarFase(fase);
        });
      });

      // Comandos
      document.querySelectorAll(".cartao-comando").forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.dataset.comando;
          this.adicionarComando(comando);
        });
      });

      // Botão de variável
      const btnVar = document.getElementById("btnAddVariavel");
      if (btnVar) {
        btnVar.addEventListener("click", () =>
          this.adicionarComando("VARIAVEL"),
        );
      }

      // Botões principais
      if (this.elementos.btnExecutar) {
        this.elementos.btnExecutar.addEventListener("click", () =>
          this.executarAlgoritmo(),
        );
      }
      if (this.elementos.btnReset) {
        this.elementos.btnReset.addEventListener("click", () => {
          const coreo = this.coreografias[this.faseAtual];
          this.posicaoRobo = { ...coreo.inicio, direcao: 0 };
          this.movimentosExecutados = [];
          this.indicePasso = 0;
          this.acertos = 0;
          this.desenharGrid();
          this.atualizarUI();
          this.atualizarStatus("PRONTO", "info");
          this.mostrarMensagem("🔄 Robô resetado!", "info");
        });
      }
      if (this.elementos.btnDica) {
        this.elementos.btnDica.addEventListener("click", () => {
          const coreo = this.coreografias[this.faseAtual];
          this.mostrarMensagem(
            coreo.dica || "💡 Use loops para repetir passos!",
            "info",
          );
        });
      }
      if (this.elementos.btnDepurar) {
        this.elementos.btnDepurar.addEventListener("click", () =>
          this.depurarAlgoritmo(),
        );
      }
      if (this.elementos.btnLimpar) {
        this.elementos.btnLimpar.addEventListener("click", () => {
          this.algoritmo = [];
          this.atualizarAlgoritmo();
          this.atualizarContadores();
          this.mostrarMensagem("🧹 Algoritmo limpo!", "info");
        });
      }
    },
  };

  // ========== 2. MÓDULO DE CERTIFICADO (mantido do original) ==========
  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano3_bim2",
    init() {
      const inputNome = document.getElementById("nomeAluno");
      if (!inputNome) return;
      this.carregarAlunos();
      this.atualizarLista();
      document
        .getElementById("btnAdicionar")
        .addEventListener("click", () => this.adicionarAluno());
      document
        .getElementById("btnImprimirCertificados")
        .addEventListener("click", () => this.imprimirTodos());
      document
        .getElementById("btnPreviewAluno")
        .addEventListener("click", () => this.previewSelecionado());
      document.getElementById("previewData").textContent =
        new Date().toLocaleDateString("pt-BR");
      document.getElementById("nomeAluno").addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.adicionarAluno();
      });
    },
    carregarAlunos() {
      try {
        let s = localStorage.getItem(this.STORAGE_KEY);
        this.alunos = s
          ? JSON.parse(s)
          : ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA"];
      } catch (e) {
        this.alunos = [];
      }
    },
    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
    },
    adicionarAluno() {
      let nome = document.getElementById("nomeAluno").value.trim();
      if (!nome) return alert("Digite um nome!");
      nome = nome.toUpperCase();
      if (this.alunos.includes(nome)) return alert("Aluno já cadastrado!");
      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarLista();
      document.getElementById("nomeAluno").value = "";
    },
    removerAluno(idx) {
      if (confirm(`Remover ${this.alunos[idx]}?`)) {
        this.alunos.splice(idx, 1);
        this.salvarAlunos();
        this.atualizarLista();
      }
    },
    selecionarPreview(nome) {
      document.getElementById("previewNomeAluno").textContent = nome;
      document.getElementById("btnPreviewAluno").disabled = false;
    },
    atualizarLista() {
      const ul = document.getElementById("listaAlunos");
      const cont = document.getElementById("contadorAlunos");
      if (!ul) return;
      ul.innerHTML = "";
      this.alunos.forEach((a, i) => {
        const li = document.createElement("li");
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${a}</span><div><button class="btn-selecionar-aluno btn btn-sm btn-outline-warning me-1" data-nome="${a}"><i class="bi bi-eye"></i></button><button class="btn-remover-aluno btn btn-sm btn-danger" data-idx="${i}"><i class="bi bi-trash"></i></button></div>`;
        ul.appendChild(li);
      });
      document
        .querySelectorAll(".btn-selecionar-aluno")
        .forEach((b) =>
          b.addEventListener("click", () =>
            this.selecionarPreview(b.dataset.nome),
          ),
        );
      document
        .querySelectorAll(".btn-remover-aluno")
        .forEach((b) =>
          b.addEventListener("click", () =>
            this.removerAluno(parseInt(b.dataset.idx)),
          ),
        );
      cont.textContent = this.alunos.length;
      document.getElementById("btnImprimirCertificados").disabled =
        this.alunos.length === 0;
    },
    gerarCertificado(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado ${nome}</title><style>body{font-family:'Courier New';background:#e0e0e0;display:flex;justify-content:center;align-items:center;min-height:100vh;}.certificado{border:3px solid #ffb347;border-radius:48px 24px;padding:30px;background:#fffef7;text-align:center;max-width:800px;}.certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;}.nome{font-size:22px;background:#fff0cc;padding:12px;border-radius:40px;}</style></head><body><div class="certificado"><h3>🏆 CERTIFICADO DE MESTRE DO LOOP - 3º ANO</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong><p>concluiu o BIMESTRE 2 de Robótica Educacional<br>Dominando LOOP, VARIÁVEL e DEPURAÇÃO</p><hr><p>RobôMestres do Paraná • ${data}</p><p style="font-style:italic;">"Loop não é macarrão!"</p></div><script>window.print();setTimeout(()=>window.close(),500);<\/script></body></html>`;
      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();
    },
    imprimirTodos() {
      if (this.alunos.length === 0) return alert("Nenhum aluno cadastrado!");
      let cards = "";
      this.alunos.forEach((a) => {
        cards += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px; padding:20px; text-align:center; break-inside:avoid;"><h3 style="color:#ffb347;">🏆 CERTIFICADO</h3><p>Certificamos que</p><strong>${this.escapeHtml(a)}</strong><p>concluiu o BIMESTRE 2</p><hr><p>RobôMestres do Paraná • ${new Date().toLocaleDateString("pt-BR")}</p></div>`;
      });
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados em Lote</title><style>.print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}@media print{@page{size:A4;margin:1cm;}}</style></head><body><div class="print-grid">${cards}</div><script>window.print();setTimeout(()=>window.close(),500);<\/script></body></html>`;
      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();
    },
    previewSelecionado() {
      const nome = document.getElementById("previewNomeAluno").textContent;
      if (nome && nome !== "[NOME DO ALUNO]") this.gerarCertificado(nome);
      else alert("Selecione um aluno na lista primeiro!");
    },
    escapeHtml(t) {
      return t.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    },
  };

  // ========== 3. INICIALIZAÇÃO GERAL ==========
  document.addEventListener("DOMContentLoaded", function () {
    DancaRoboGame.init();
    CertificadoModule.init();
    console.log("🚀 a3bim2.js: Todos os módulos inicializados");
  });

  // ========== 4. MENU: DESTAQUE DA PÁGINA ATUAL ==========
  function highlightCurrentPage() {
    const currentPath =
      window.location.pathname.split("/").pop() || "a3bim2.html";
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
})();
