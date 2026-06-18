// ============================================================
// 🚀 a3bim2.js - 3º ANO - BIMESTRE 2
// ============================================================
// 📦 MÓDULOS:
//   1. GameLoopDance  - Jogo do Robô Dançarino
//   2. Certificado    - Sistema de certificados
//   3. MenuHighlight  - Destaque do menu
// ============================================================

(function () {
  "use strict";

  // ================================================================
  // 🎮 MÓDULO 1: GAME LOOP DANCE - O COREOGRAFO DE ROBÔS
  // ================================================================
  const GameLoopDance = {
    // ---------- ESTADO ----------
    faseAtual: 1,
    algoritmo: [],
    posicaoRobo: { x: 2, y: 2, direcao: 0 },
    variaveis: { X: 1, Y: 2, Z: 0 },
    movimentosExecutados: [],
    acertos: 0,
    totalPassos: 0,
    estaExecutando: false,
    recordes: { 1: null, 2: null, 3: null, 4: null },
    passosSequencia: [],
    inicializado: false,

    // ---------- COREOGRAFIAS ----------
    coreografias: {
      1: {
        nome: "A MÚSICA DO ROBÔ",
        icone: "🎵",
        dica: "💡 Use X para contar os passos!",
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
        dica: "💡 Use REPETIR 3x: PASSO, PASSO, GIRO",
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
        dica: "💡 Use dois loops: REPETIR 3x (PASSO, GIRO) e REPETIR 2x PASSO",
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
        dica: "💡 O algoritmo está ERRADO! Encontre o BUG!",
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
        algoritmoBugado: [
          { tipo: "PASSO" },
          { tipo: "PASSO" },
          { tipo: "PASSO" },
          { tipo: "PASSO" },
          { tipo: "GIRO" },
          // FALTA UM PASSO AQUI!
        ],
      },
    },

    // ---------- ELEMENTOS DOM ----------
    el: {},

    // ================================================================
    // 🚀 INICIALIZAÇÃO
    // ================================================================
    init() {
      if (this.inicializado) return;
      const container = document.getElementById("dancaRoboGame");
      if (!container) return;

      this.renderizar(container);
      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
      this.inicializado = true;
      console.log("🕺 GameLoopDance inicializado!");
    },

    // ================================================================
    // 🏗️ RENDERIZAÇÃO DA UI
    // ================================================================
    renderizar(container) {
      container.innerHTML = `
        <div class="game-header mb-4">
          <div class="btn-group flex-wrap gap-2" role="group">
            ${[1, 2, 3, 4]
              .map(
                (f) => `
              <button class="btn-fase btn-fase-${f}" data-fase="${f}">
                ${this.coreografias[f].icone} FASE ${f}
                <span class="badge ${f === 1 ? "bg-success" : f === 2 ? "bg-warning text-dark" : f === 3 ? "bg-primary" : "bg-danger"}">
                  ${["INICIANTE", "INTERMEDIÁRIO", "AVANÇADO", "MESTRE"][f - 1]}
                </span>
              </button>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="row g-4">
          <!-- COLUDA ESQUERDA: PALCO -->
          <div class="col-lg-7">
            <div class="game-palco bg-robocard p-3 rounded-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-warning text-dark" id="faseNomeDisplay">🎵 A MÚSICA DO ROBÔ</span>
                <span class="badge bg-info" id="statusDisplay">PRONTO</span>
              </div>

              <!-- GRID -->
              <div id="palcoGrid" class="danca-grid"></div>

              <!-- COREOGRAFIA -->
              <div class="coreografia-display mt-3 p-3 rounded-3">
                <div class="d-flex align-items-center gap-2 mb-2">
                  <span class="text-warning">🎵 COREOGRAFIA:</span>
                  <span id="coreografiaPassos" class="passos-display">👣 👣 👣 👣 🔄</span>
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

          <!-- COLUNA DIREITA: CONTROLES -->
          <div class="col-lg-5">
            <!-- VARIÁVEIS -->
            <div class="game-variaveis bg-robocard p-3 rounded-4 mb-3">
              <div class="d-flex align-items-center gap-2 mb-2">
                <span class="text-warning">📦 VARIÁVEIS:</span>
                <button class="btn-sm btn-outline-warning" id="btnAddVariavel">+ Adicionar</button>
              </div>
              <div id="variaveisDisplay" class="d-flex flex-wrap gap-2"></div>
            </div>

            <!-- COMANDOS -->
            <div class="game-comandos bg-robocard p-3 rounded-4 mb-3">
              <div class="text-warning mb-2">🔧 COMANDOS (clique para adicionar):</div>
              <div class="d-flex flex-wrap gap-2">
                <button class="cmd-btn cmd-passo" data-comando="PASSO">👣 PASSO</button>
                <button class="cmd-btn cmd-giro" data-comando="GIRO">🔄 GIRO</button>
                <button class="cmd-btn cmd-loop" data-comando="REPETIR">🔁 REPETIR</button>
                <button class="cmd-btn cmd-variavel" data-comando="VARIAVEL">🔢 VARIÁVEL</button>
                <button class="cmd-btn cmd-bug" data-comando="BUG">🐛 BUG</button>
              </div>
            </div>

            <!-- ALGORITMO -->
            <div class="game-algoritmo bg-robocard p-3 rounded-4 mb-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-warning">📝 SEU ALGORITMO:</span>
                <button class="btn-sm btn-danger" id="btnLimparAlgoritmo">🗑️ LIMPAR</button>
              </div>
              <div id="algoritmoMontado" class="algoritmo-container"></div>
              <div class="d-flex gap-2 mt-2">
                <span class="badge bg-secondary">Cartões: <span id="contadorCartoes">0</span></span>
                <span class="badge bg-secondary">Loops: <span id="contadorLoops">0</span></span>
              </div>
            </div>

            <!-- AÇÕES -->
            <div class="game-acoes d-flex flex-wrap gap-2">
              <button class="btn-executar" id="btnExecutarDanca">▶ EXECUTAR DANÇA!</button>
              <button class="btn-resetar" id="btnResetDanca">🔄 RESETAR</button>
              <button class="btn-dica" id="btnDicaDanca">💡 DICA</button>
              <button class="btn-depurar" id="btnDepurarDanca">🔍 DEPURAR</button>
            </div>

            <!-- MENSAGEM -->
            <div id="dancaMensagem" class="mensagem-jogo mt-3 p-2 rounded-3">
              <span>🏁 Selecione uma fase e monte seu algoritmo!</span>
            </div>
          </div>
        </div>

        <!-- RECORDES -->
        <div class="game-recordes mt-4">
          <div class="text-warning mb-2">🏆 RECORDES (menos cartões = melhor!)</div>
          <div class="d-flex flex-wrap gap-3">
            ${[1, 2, 3, 4]
              .map(
                (f) => `
              <div class="recorde-card">
                <span>${this.coreografias[f].icone} FASE ${f}:</span>
                <strong id="recordeFase${f}">---</strong> cartões
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="legenda-pista mt-3 d-flex flex-wrap gap-3">
          <span class="legenda-item">🤖 ROBÔ</span>
          <span class="legenda-item">⭐ CHEGADA</span>
          <span class="legenda-item">⬜ PISTA</span>
          <span class="legenda-item">🔄 GIRO</span>
          <span class="legenda-item">🔢 VARIÁVEL</span>
        </div>
      `;
    },

    // ================================================================
    // 🔍 CAPTURA DE ELEMENTOS
    // ================================================================
    capturarElementos() {
      this.el = {
        palco: document.getElementById("palcoGrid"),
        algoritmo: document.getElementById("algoritmoMontado"),
        cartoes: document.getElementById("contadorCartoes"),
        passos: document.getElementById("passosAtuais"),
        acertos: document.getElementById("acertosDisplay"),
        status: document.getElementById("statusDisplay"),
        mensagem: document.getElementById("dancaMensagem"),
        faseNome: document.getElementById("faseNomeDisplay"),
        recordes: {
          1: document.getElementById("recordeFase1"),
          2: document.getElementById("recordeFase2"),
          3: document.getElementById("recordeFase3"),
          4: document.getElementById("recordeFase4"),
        },
        variaveis: document.getElementById("variaveisDisplay"),
        coreografia: document.getElementById("coreografiaPassos"),
        progresso: document.getElementById("progressoCoreografia"),
        totalPassos: document.getElementById("totalPassos"),
        loops: document.getElementById("contadorLoops"),
        btnExecutar: document.getElementById("btnExecutarDanca"),
        btnReset: document.getElementById("btnResetDanca"),
        btnDica: document.getElementById("btnDicaDanca"),
        btnDepurar: document.getElementById("btnDepurarDanca"),
        btnLimpar: document.getElementById("btnLimparAlgoritmo"),
        btnVariavel: document.getElementById("btnAddVariavel"),
      };
    },

    // ================================================================
    // 🎯 EVENTOS
    // ================================================================
    configurarEventos() {
      // Fases
      document.querySelectorAll(".btn-fase").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.carregarFase(parseInt(btn.dataset.fase));
        });
      });

      // Comandos
      document.querySelectorAll(".cmd-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.adicionarComando(btn.dataset.comando);
        });
      });

      // Ações
      this.el.btnExecutar?.addEventListener("click", () => this.executar());
      this.el.btnReset?.addEventListener("click", () => this.resetar());
      this.el.btnDica?.addEventListener("click", () => this.mostrarDica());
      this.el.btnDepurar?.addEventListener("click", () => this.depurar());
      this.el.btnLimpar?.addEventListener("click", () =>
        this.limparAlgoritmo(),
      );
      this.el.btnVariavel?.addEventListener("click", () =>
        this.adicionarComando("VARIAVEL"),
      );
    },

    // ================================================================
    // 📦 RECORDES
    // ================================================================
    carregarRecordes() {
      try {
        const saved = localStorage.getItem("danca_robo_recordes_ano3");
        if (saved) this.recordes = JSON.parse(saved);
      } catch (e) {
        /* ignora */
      }
    },

    salvarRecordes() {
      localStorage.setItem(
        "danca_robo_recordes_ano3",
        JSON.stringify(this.recordes),
      );
    },

    // ================================================================
    // 🎬 CARREGAR FASE
    // ================================================================
    carregarFase(fase) {
      this.faseAtual = fase;
      this.algoritmo = [];
      this.movimentosExecutados = [];
      this.acertos = 0;
      this.estaExecutando = false;

      const coreo = this.coreografias[fase];
      this.passosSequencia = coreo.passos;
      this.totalPassos = coreo.passos.length;
      this.posicaoRobo = { ...coreo.inicio, direcao: 0 };

      // Resetar variáveis
      this.variaveis = { X: 1, Y: 2, Z: 0 };
      if (coreo.variaveisSugeridas) {
        Object.assign(this.variaveis, coreo.variaveisSugeridas);
      }

      // Carregar bug da fase 4
      if (fase === 4 && coreo.algoritmoBugado) {
        this.algoritmo = coreo.algoritmoBugado.map((c) => ({ ...c }));
      }

      // Atualizar UI
      this.atualizarUI();
      this.desenharGrid();
      this.atualizarRecordes();
      this.atualizarVariaveis();
      this.atualizarCoreografia();
      this.renderizarAlgoritmo();
      this.atualizarContadores();

      // Destacar fase
      document.querySelectorAll(".btn-fase").forEach((btn) => {
        btn.classList.toggle("ativo", parseInt(btn.dataset.fase) === fase);
      });

      this.atualizarStatus("PRONTO", "info");
      this.mostrarMensagem(
        `🎵 FASE ${fase}: ${coreo.nome} selecionada!`,
        "info",
      );
    },

    // ================================================================
    // 🎨 DESENHAR GRID
    // ================================================================
    desenharGrid() {
      const coreo = this.coreografias[this.faseAtual];
      const grid = coreo.grid;
      const palco = this.el.palco;
      if (!palco) return;

      palco.style.display = "grid";
      palco.style.gridTemplateColumns = `repeat(${grid[0].length}, 1fr)`;
      palco.innerHTML = "";

      for (let l = 0; l < grid.length; l++) {
        for (let c = 0; c < grid[l].length; c++) {
          const cell = document.createElement("div");
          cell.className = "danca-cell";

          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c) {
            cell.classList.add("robo");
            cell.textContent = "🤖";
            const setas = ["⬆️", "➡️", "⬇️", "⬅️"];
            cell.dataset.direcao = setas[this.posicaoRobo.direcao];
          } else if (grid[l][c] === "⭐") {
            cell.classList.add("chegada");
            cell.textContent = "⭐";
          } else if (grid[l][c] === "🧱") {
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

    // ================================================================
    // 📝 ADICIONAR COMANDO (SISTEMA INTUITIVO)
    // ================================================================
    adicionarComando(tipo) {
      if (this.estaExecutando) return;

      // ----- VARIÁVEL: Seletor visual -----
      if (tipo === "VARIAVEL") {
        this.mostrarSeletorVariavel();
        return;
      }

      // ----- REPETIR: Seletor visual -----
      if (tipo === "REPETIR") {
        this.mostrarSeletorLoop();
        return;
      }

      // ----- PASSO / GIRO / BUG -----
      // Tenta adicionar ao último loop aberto
      const ultimoLoop = this.encontrarUltimoLoopAberto();
      if (ultimoLoop) {
        ultimoLoop.comandos.push({ tipo });
        this.mostrarMensagem(`✅ ${tipo} adicionado ao loop!`, "success");
      } else {
        this.algoritmo.push({ tipo });
        this.mostrarMensagem(`✅ ${tipo} adicionado!`, "success");
      }

      this.renderizarAlgoritmo();
      this.atualizarContadores();
    },

    // ----- SELETOR VISUAL: VARIÁVEL -----
    mostrarSeletorVariavel() {
      this.removerSeletores();

      const container = this.el.algoritmo;
      if (!container) return;

      const opcoes = [
        { var: "X", valor: 1, cor: "#3498db" },
        { var: "X", valor: 2, cor: "#3498db" },
        { var: "X", valor: 3, cor: "#3498db" },
        { var: "Y", valor: 1, cor: "#9b59b6" },
        { var: "Y", valor: 2, cor: "#9b59b6" },
        { var: "Z", valor: 0, cor: "#1abc9c" },
      ];

      const seletor = this.criarSeletor(
        "variavel",
        "📦 ESCOLHA UMA VARIÁVEL:",
        opcoes.map((o) => ({
          label: `🔢 ${o.var} = ${o.valor}`,
          cor: o.cor,
          onClick: () => {
            this.variaveis[o.var] = o.valor;
            this.atualizarVariaveis();
            this.removerSeletores();
            this.mostrarMensagem(
              `📦 ${o.var} = ${o.valor} definida!`,
              "success",
            );
          },
        })),
      );

      container.prepend(seletor);
    },

    // ----- SELETOR VISUAL: LOOP -----
    mostrarSeletorLoop() {
      this.removerSeletores();

      const container = this.el.algoritmo;
      if (!container) return;

      const opcoes = [2, 3, 4, 5].map((v) => ({
        label: `🔁 ${v} VEZES`,
        cor: "#f39c12",
        onClick: () => {
          const loop = {
            tipo: "REPETIR",
            vezes: v,
            comandos: [],
            _aberto: true,
          };
          this.algoritmo.push(loop);
          this.removerSeletores();
          this.renderizarAlgoritmo();
          this.atualizarContadores();
          this.mostrarMensagem(
            `🔁 Loop criado! Adicione PASSO ou GIRO dentro dele.`,
            "success",
          );
          this.destacarUltimoLoop();
        },
      }));

      const seletor = this.criarSeletor(
        "loop",
        "🔁 QUANTAS VEZES REPETIR?",
        opcoes,
      );
      container.prepend(seletor);
    },

    // ----- SELETOR: COMANDO DENTRO DO LOOP -----
    mostrarSeletorComandoLoop(loopIdx) {
      this.removerSeletores();

      const container = this.el.algoritmo;
      if (!container) return;

      const loop = this.algoritmo[loopIdx];
      if (!loop || loop.tipo !== "REPETIR") return;

      const opcoes = [
        {
          label: "👣 PASSO",
          cor: "#4a7c3f",
          onClick: () => {
            loop.comandos.push({ tipo: "PASSO" });
            this.removerSeletores();
            this.renderizarAlgoritmo();
            this.atualizarContadores();
            this.mostrarMensagem(`👣 PASSO adicionado ao loop!`, "success");
            if (loop.comandos.length >= loop.vezes) {
              this.mostrarMensagem(
                `🎉 Loop completo! ${loop.vezes} comandos!`,
                "success",
              );
            }
          },
        },
        {
          label: "🔄 GIRO",
          cor: "#f39c12",
          onClick: () => {
            loop.comandos.push({ tipo: "GIRO" });
            this.removerSeletores();
            this.renderizarAlgoritmo();
            this.atualizarContadores();
            this.mostrarMensagem(`🔄 GIRO adicionado ao loop!`, "success");
            if (loop.comandos.length >= loop.vezes) {
              this.mostrarMensagem(
                `🎉 Loop completo! ${loop.vezes} comandos!`,
                "success",
              );
            }
          },
        },
      ];

      const seletor = this.criarSeletor(
        "comando-loop",
        `➕ ADICIONAR AO LOOP (${loop.comandos.length}/${loop.vezes}):`,
        opcoes,
        true, // menor
      );

      container.appendChild(seletor);
    },

    // ----- UTILITÁRIO: CRIAR SELETOR -----
    criarSeletor(tipo, titulo, opcoes, pequeno = false) {
      const div = document.createElement("div");
      div.className = `seletor seletor-${tipo}`;
      div.style.cssText = `
        background: ${tipo === "loop" ? "rgba(243, 156, 18, 0.1)" : tipo === "variavel" ? "rgba(52, 152, 219, 0.1)" : "rgba(255, 180, 71, 0.1)"};
        border: 2px solid ${tipo === "loop" ? "#f39c12" : tipo === "variavel" ? "#3498db" : "#f39c12"};
        border-radius: 16px;
        padding: ${pequeno ? "8px 12px" : "16px"};
        margin: ${pequeno ? "4px 0 4px 20px" : "8px 0"};
        animation: comandoEntrar 0.3s ease-out;
      `;

      div.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
          <span style="color: ${tipo === "loop" ? "#f39c12" : tipo === "variavel" ? "#85c1e9" : "#f39c12"}; font-weight: bold; font-size: ${pequeno ? "0.8rem" : "0.9rem"};">
            ${titulo}
          </span>
          ${opcoes
            .map(
              (o) => `
            <button class="seletor-opcao" style="
              background: #2c3e2b;
              border: 2px solid ${o.cor};
              border-radius: 40px;
              padding: ${pequeno ? "4px 14px" : "8px 20px"};
              color: ${o.cor};
              font-weight: bold;
              font-size: ${pequeno ? "0.75rem" : "0.9rem"};
              cursor: pointer;
              transition: all 0.2s ease;
            ">${o.label}</button>
          `,
            )
            .join("")}
          <button class="seletor-cancelar" style="
            background: none;
            border: none;
            color: #e74c3c;
            font-size: 0.7rem;
            cursor: pointer;
            padding: 4px 10px;
          ">✖️ cancelar</button>
        </div>
        ${!pequeno ? `<div style="margin-top: 6px; font-size: 0.65rem; color: #666;">💡 Clique em um botão para escolher</div>` : ""}
      `;

      // Eventos dos botões
      div.querySelectorAll(".seletor-opcao").forEach((btn, i) => {
        btn.addEventListener("click", opcoes[i].onClick);
        btn.addEventListener("mouseenter", () => {
          btn.style.transform = "scale(1.05)";
          btn.style.boxShadow = `0 0 20px ${opcoes[i].cor}33`;
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.transform = "scale(1)";
          btn.style.boxShadow = "none";
        });
      });

      div.querySelector(".seletor-cancelar").addEventListener("click", () => {
        this.removerSeletores();
        this.mostrarMensagem("❌ Cancelado!", "info");
      });

      return div;
    },

    // ----- UTILITÁRIO: REMOVER SELETORES -----
    removerSeletores() {
      const container = this.el.algoritmo;
      if (!container) return;
      container.querySelectorAll(".seletor").forEach((el) => el.remove());
    },

    // ----- UTILITÁRIO: ENCONTRAR ÚLTIMO LOOP ABERTO -----
    encontrarUltimoLoopAberto() {
      for (let i = this.algoritmo.length - 1; i >= 0; i--) {
        if (this.algoritmo[i].tipo === "REPETIR" && this.algoritmo[i]._aberto) {
          return this.algoritmo[i];
        }
      }
      return null;
    },

    // ----- DESTACAR ÚLTIMO LOOP -----
    destacarUltimoLoop() {
      setTimeout(() => {
        const container = this.el.algoritmo;
        if (!container) return;
        const loops = container.querySelectorAll(".loop-container");
        if (loops.length > 0) {
          const ultimo = loops[loops.length - 1];
          ultimo.style.border = "3px solid #ffcc44";
          ultimo.style.boxShadow = "0 0 30px rgba(255, 204, 68, 0.3)";
          setTimeout(() => {
            ultimo.style.border = "";
            ultimo.style.boxShadow = "";
          }, 2000);
        }
      }, 100);
    },

    // ================================================================
    // 🖥️ RENDERIZAR ALGORITMO
    // ================================================================
    renderizarAlgoritmo() {
      const container = this.el.algoritmo;
      if (!container) return;

      this.removerSeletores();

      if (this.algoritmo.length === 0) {
        container.innerHTML = `
          <div class="placeholder-algoritmo">
            🃏 Clique nos comandos para montar seu algoritmo...
          </div>
        `;
        return;
      }

      container.innerHTML = "";

      this.algoritmo.forEach((comando, idx) => {
        if (comando.tipo === "REPETIR") {
          const div = document.createElement("div");
          div.className = "loop-container";
          div.style.cssText = `
            background: linear-gradient(135deg, #1a2b17, #0d1f0b);
            border: 2px solid #f39c12;
            border-radius: 16px;
            padding: 12px;
            margin: 6px 0;
            width: 100%;
          `;

          const estaAberto = comando._aberto || false;

          div.innerHTML = `
            <div class="loop-header" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;">
              <span style="font-size:1.4rem;">🔁</span>
              <span style="color:#f39c12;font-weight:bold;font-size:1rem;background:rgba(0,0,0,0.3);padding:4px 14px;border-radius:20px;">
                REPETIR ${comando.vezes} VEZES
              </span>
              <span style="font-size:0.7rem;color:${estaAberto ? "#2ecc71" : "#666"};background:${estaAberto ? "rgba(46,204,113,0.2)" : "rgba(0,0,0,0.3)"};padding:2px 12px;border-radius:20px;">
                ${estaAberto ? "🟢 ABERTO" : "🔒 FECHADO"}
              </span>
              <button class="btn-toggle-loop" data-indice="${idx}" style="background:none;border:1px solid #f39c12;border-radius:20px;color:#f39c12;padding:2px 12px;font-size:0.7rem;cursor:pointer;">
                ${estaAberto ? "🔒 FECHAR" : "🔓 ABRIR"}
              </button>
              <button class="btn-remove-loop" data-indice="${idx}" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:1rem;margin-left:auto;">✖️</button>
            </div>
            <div class="loop-comandos" style="display:flex;flex-wrap:wrap;gap:6px;padding-left:20px;border-left:3px dashed #f39c12;min-height:${estaAberto ? "40px" : "0"};">
              ${
                comando.comandos && comando.comandos.length > 0
                  ? comando.comandos
                      .map(
                        (cmd, cidx) => `
                  <div class="sub-comando" style="background:linear-gradient(135deg,#2c3e2b,#1a2b17);border-radius:12px;padding:4px 12px;display:inline-flex;align-items:center;gap:6px;font-size:0.85rem;border-left:3px solid #f39c12;">
                    <span>${this.getIcone(cmd.tipo)} ${cmd.tipo}</span>
                    <button class="btn-remove-sub" data-loop="${idx}" data-indice="${cidx}" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:0.7rem;padding:0 4px;">✖️</button>
                  </div>
                `,
                      )
                      .join("")
                  : estaAberto
                    ? `<span style="color:#666;font-size:0.8rem;padding:8px;">👆 Clique em PASSO ou GIRO para adicionar!</span>`
                    : `<span style="color:#444;font-size:0.7rem;padding:4px 0;">🔒 Fechado</span>`
              }
              ${
                estaAberto
                  ? `<button class="btn-add-dentro-loop" data-loop="${idx}" style="background:rgba(255,180,71,0.15);border:2px dashed #f39c12;border-radius:12px;color:#f39c12;padding:6px 14px;font-size:0.75rem;cursor:pointer;width:100%;margin-top:4px;">➕ ADICIONAR DENTRO DO LOOP</button>`
                  : ""
              }
            </div>
          `;

          // Eventos
          div
            .querySelector(".btn-toggle-loop")
            .addEventListener("click", () => {
              comando._aberto = !comando._aberto;
              this.renderizarAlgoritmo();
            });

          div
            .querySelector(".btn-remove-loop")
            .addEventListener("click", () => {
              this.algoritmo.splice(idx, 1);
              this.renderizarAlgoritmo();
              this.atualizarContadores();
              this.mostrarMensagem("🗑️ Loop removido!", "info");
            });

          div.querySelectorAll(".btn-remove-sub").forEach((btn) => {
            btn.addEventListener("click", () => {
              const loop = this.algoritmo[parseInt(btn.dataset.loop)];
              if (loop && loop.tipo === "REPETIR") {
                loop.comandos.splice(parseInt(btn.dataset.indice), 1);
                this.renderizarAlgoritmo();
                this.atualizarContadores();
                this.mostrarMensagem("🗑️ Comando removido do loop!", "info");
              }
            });
          });

          const addBtn = div.querySelector(".btn-add-dentro-loop");
          if (addBtn) {
            addBtn.addEventListener("click", () => {
              this.mostrarSeletorComandoLoop(parseInt(addBtn.dataset.loop));
            });
          }

          container.appendChild(div);
        } else {
          // Comando simples
          const div = document.createElement("div");
          const cores = { PASSO: "#4a7c3f", GIRO: "#f39c12", BUG: "#e74c3c" };
          const cor = cores[comando.tipo] || "#666";
          div.className = "comando-simples";
          div.style.cssText = `
            background: linear-gradient(135deg, #2c3e2b, #1a2b17);
            border-radius: 12px;
            padding: 6px 14px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            border-left: 4px solid ${cor};
            margin: 2px 4px;
            animation: comandoEntrar 0.3s ease-out;
          `;
          div.innerHTML = `
            <span>${this.getIcone(comando.tipo)} ${comando.tipo}</span>
            <button class="btn-remove-simples" data-indice="${idx}" style="background:none;border:none;color:#e74c3c;cursor:pointer;font-size:0.8rem;padding:0 4px;">✖️</button>
          `;
          div
            .querySelector(".btn-remove-simples")
            .addEventListener("click", () => {
              this.algoritmo.splice(idx, 1);
              this.renderizarAlgoritmo();
              this.atualizarContadores();
              this.mostrarMensagem("🗑️ Comando removido!", "info");
            });
          container.appendChild(div);
        }
      });
    },

    // ================================================================
    // 🎯 GET ÍCONE
    // ================================================================
    getIcone(tipo) {
      const icones = {
        PASSO: "👣",
        GIRO: "🔄",
        REPETIR: "🔁",
        VARIAVEL: "🔢",
        BUG: "🐛",
      };
      return icones[tipo] || "❓";
    },

    // ================================================================
    // 📊 CONTADORES
    // ================================================================
    atualizarContadores() {
      const stats = this.contarComandos(this.algoritmo);
      if (this.el.cartoes) this.el.cartoes.textContent = stats.total;
      if (this.el.loops) this.el.loops.textContent = stats.loops;
    },

    contarComandos(arr) {
      let total = 0,
        loops = 0;
      for (const item of arr) {
        total++;
        if (item.tipo === "REPETIR") {
          loops++;
          if (item.comandos) {
            const sub = this.contarComandos(item.comandos);
            total += sub.total;
            loops += sub.loops;
          }
        }
      }
      return { total, loops };
    },

    // ================================================================
    // 🎬 EXECUTAR
    // ================================================================
    async executar() {
      if (this.estaExecutando) return;
      if (this.algoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", "erro");
        return;
      }

      this.estaExecutando = true;
      this.movimentosExecutados = [];
      this.acertos = 0;

      const coreo = this.coreografias[this.faseAtual];
      this.posicaoRobo = { ...coreo.inicio, direcao: 0 };
      this.desenharGrid();
      this.atualizarStatus("EXECUTANDO...", "warning");
      this.mostrarMensagem("🕺 Executando coreografia...", "info");

      let erro = false;
      for (const comando of this.algoritmo) {
        const ok = await this.executarComando(comando);
        if (!ok) {
          erro = true;
          break;
        }
        await this.delay(300);
        this.desenharGrid();
        this.atualizarUI();
      }

      this.estaExecutando = false;

      if (!erro) {
        const esperados = coreo.passos;
        const executados = this.movimentosExecutados;
        let acertos = 0;
        for (
          let i = 0;
          i < Math.min(executados.length, esperados.length);
          i++
        ) {
          if (executados[i] === esperados[i]) acertos++;
        }
        this.acertos = acertos;
        this.atualizarUI();

        const pct = (acertos / esperados.length) * 100;
        if (pct === 100) {
          const total = parseInt(this.el.cartoes.textContent);
          if (
            !this.recordes[this.faseAtual] ||
            total < this.recordes[this.faseAtual]
          ) {
            this.recordes[this.faseAtual] = total;
            this.salvarRecordes();
            this.atualizarRecordes();
            this.mostrarMensagem(
              `🎉 NOVO RECORDE! ${total} cartões!`,
              "success",
            );
          } else {
            this.mostrarMensagem(
              `🎉 PERFEITO! ${acertos}/${esperados.length} acertos!`,
              "success",
            );
          }
          this.atualizarStatus("🌟 PERFEITO!", "success");
        } else if (pct >= 80) {
          this.mostrarMensagem(
            `💃 QUASE LÁ! ${acertos}/${esperados.length}`,
            "warning",
          );
          this.atualizarStatus("💃 QUASE LÁ!", "warning");
        } else {
          this.mostrarMensagem(
            `🐛 AINDA TEM BUGS! ${acertos}/${esperados.length}`,
            "erro",
          );
          this.atualizarStatus("🐛 COM BUGS", "danger");
        }
      } else {
        this.atualizarStatus("💥 BUG!", "danger");
      }
    },

    async executarComando(comando) {
      const coreo = this.coreografias[this.faseAtual];

      if (comando.tipo === "REPETIR") {
        for (let i = 0; i < (comando.vezes || 3); i++) {
          for (const cmd of comando.comandos || []) {
            const ok = await this.executarComando(cmd);
            if (!ok) return false;
            await this.delay(200);
            this.desenharGrid();
            this.atualizarUI();
          }
        }
        return true;
      }

      if (comando.tipo === "PASSO") {
        let nx = this.posicaoRobo.x,
          ny = this.posicaoRobo.y;
        const d = this.posicaoRobo.direcao;
        if (d === 0) nx--;
        else if (d === 1) ny++;
        else if (d === 2) nx++;
        else if (d === 3) ny--;

        if (
          nx < 0 ||
          nx >= coreo.grid.length ||
          ny < 0 ||
          ny >= coreo.grid[0].length
        ) {
          this.mostrarMensagem("🚫 Robô saiu da pista!", "erro");
          return false;
        }
        if (coreo.grid[nx][ny] === "🧱") {
          this.mostrarMensagem("🧱 Bateu no obstáculo!", "erro");
          return false;
        }

        this.posicaoRobo.x = nx;
        this.posicaoRobo.y = ny;
        this.movimentosExecutados.push("👣");
        return true;
      }

      if (comando.tipo === "GIRO") {
        this.posicaoRobo.direcao = (this.posicaoRobo.direcao + 1) % 4;
        this.movimentosExecutados.push("🔄");
        return true;
      }

      if (comando.tipo === "BUG") {
        this.mostrarMensagem("🐛 BUG! Robô girou errado!", "erro");
        return false;
      }

      return true;
    },

    // ================================================================
    // 🔄 RESETAR
    // ================================================================
    resetar() {
      const coreo = this.coreografias[this.faseAtual];
      this.posicaoRobo = { ...coreo.inicio, direcao: 0 };
      this.movimentosExecutados = [];
      this.acertos = 0;
      this.desenharGrid();
      this.atualizarUI();
      this.atualizarStatus("PRONTO", "info");
      this.mostrarMensagem("🔄 Robô resetado!", "info");
    },

    // ================================================================
    // 💡 DICA
    // ================================================================
    mostrarDica() {
      const coreo = this.coreografias[this.faseAtual];
      this.mostrarMensagem(
        coreo.dica || "💡 Use loops para repetir passos!",
        "info",
      );
    },

    // ================================================================
    // 🔍 DEPURAR
    // ================================================================
    depurar() {
      if (this.faseAtual !== 4) {
        this.mostrarMensagem("🔍 Depuração só na FASE 4!", "info");
        return;
      }

      const esperado = this.coreografias[4].movimentoEsperado;
      let passos = [];
      const extrair = (arr) => {
        for (const item of arr) {
          if (item.tipo === "PASSO") passos.push("👣");
          else if (item.tipo === "GIRO") passos.push("🔄");
          else if (item.tipo === "REPETIR" && item.comandos) {
            for (let i = 0; i < (item.vezes || 3); i++) extrair(item.comandos);
          }
        }
      };
      extrair(this.algoritmo);

      const bugs = [];
      for (let i = 0; i < Math.max(esperado.length, passos.length); i++) {
        if (i >= esperado.length)
          bugs.push(`Passo ${i + 1}: Sobrando "${passos[i]}"`);
        else if (i >= passos.length)
          bugs.push(`Passo ${i + 1}: Faltando "${esperado[i]}"`);
        else if (passos[i] !== esperado[i]) {
          bugs.push(
            `Passo ${i + 1}: Esperado "${esperado[i]}", encontrado "${passos[i]}"`,
          );
        }
      }

      if (bugs.length === 0) {
        this.mostrarMensagem("🔍 Nenhum bug! Algoritmo correto! 🎉", "success");
      } else {
        this.mostrarMensagem(
          `🐛 ${bugs.length} bug(s):\n${bugs.join("\n")}`,
          "erro",
        );
      }
    },

    // ================================================================
    // 🧹 LIMPAR ALGORITMO
    // ================================================================
    limparAlgoritmo() {
      this.algoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadores();
      this.mostrarMensagem("🧹 Algoritmo limpo!", "info");
    },

    // ================================================================
    // 📊 ATUALIZAR UI
    // ================================================================
    atualizarUI() {
      if (this.el.passos)
        this.el.passos.textContent = this.movimentosExecutados.length;
      if (this.el.acertos) this.el.acertos.textContent = this.acertos;
      if (this.el.progresso) {
        const pct =
          this.totalPassos > 0
            ? (this.movimentosExecutados.length / this.totalPassos) * 100
            : 0;
        this.el.progresso.style.width = `${Math.min(pct, 100)}%`;
      }
      if (this.el.totalPassos)
        this.el.totalPassos.textContent = this.totalPassos;
    },

    atualizarStatus(texto, tipo) {
      if (!this.el.status) return;
      this.el.status.textContent = texto;
      const cores = {
        success: "bg-success",
        danger: "bg-danger",
        warning: "bg-warning text-dark",
        info: "bg-info",
      };
      this.el.status.className = `badge ${cores[tipo] || "bg-info"}`;
    },

    atualizarVariaveis() {
      const container = this.el.variaveis;
      if (!container) return;
      container.innerHTML = "";
      for (const [key, value] of Object.entries(this.variaveis)) {
        const badge = document.createElement("span");
        badge.className = "variavel-badge";
        badge.textContent = `${key} = ${value}`;
        container.appendChild(badge);
      }
    },

    atualizarCoreografia() {
      const coreo = this.coreografias[this.faseAtual];
      if (this.el.coreografia)
        this.el.coreografia.textContent = coreo.passos.join(" ");
      if (this.el.faseNome)
        this.el.faseNome.textContent = `${coreo.icone} ${coreo.nome}`;
    },

    atualizarRecordes() {
      for (const [fase, el] of Object.entries(this.el.recordes)) {
        if (el) el.textContent = this.recordes[fase] || "---";
      }
    },

    mostrarMensagem(texto, tipo) {
      if (!this.el.mensagem) return;
      this.el.mensagem.innerHTML = `<span>${texto}</span>`;
      const cores = {
        erro: "#e74c3c",
        success: "#2ecc71",
        warning: "#f39c12",
        info: "var(--robot-gold)",
      };
      this.el.mensagem.style.borderLeft = `4px solid ${cores[tipo] || cores.info}`;
      this.el.mensagem.style.color = cores[tipo] || "var(--robot-text)";
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  };

  // ================================================================
  // 🏆 MÓDULO 2: CERTIFICADOS
  // ================================================================
  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano3_bim2",

    init() {
      const input = document.getElementById("nomeAluno");
      if (!input) return;

      this.carregar();
      this.atualizarLista();

      document
        .getElementById("btnAdicionar")
        ?.addEventListener("click", () => this.adicionar());
      document
        .getElementById("btnImprimirCertificados")
        ?.addEventListener("click", () => this.imprimirTodos());
      document
        .getElementById("btnPreviewAluno")
        ?.addEventListener("click", () => this.preview());
      document.getElementById("previewData").textContent =
        new Date().toLocaleDateString("pt-BR");
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") this.adicionar();
      });
    },

    carregar() {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        this.alunos = saved
          ? JSON.parse(saved)
          : ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA"];
      } catch {
        this.alunos = [];
      }
    },

    salvar() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
    },

    adicionar() {
      let nome = document.getElementById("nomeAluno").value.trim();
      if (!nome) return alert("Digite um nome!");
      nome = nome.toUpperCase();
      if (this.alunos.includes(nome)) return alert("Aluno já cadastrado!");
      this.alunos.push(nome);
      this.salvar();
      this.atualizarLista();
      document.getElementById("nomeAluno").value = "";
    },

    remover(idx) {
      if (confirm(`Remover ${this.alunos[idx]}?`)) {
        this.alunos.splice(idx, 1);
        this.salvar();
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
        li.innerHTML = `
          <span><i class="bi bi-robot"></i> ${a}</span>
          <div>
            <button class="btn-selecionar btn btn-sm btn-outline-warning me-1" data-nome="${a}"><i class="bi bi-eye"></i></button>
            <button class="btn-remover btn btn-sm btn-danger" data-idx="${i}"><i class="bi bi-trash"></i></button>
          </div>
        `;
        ul.appendChild(li);
      });

      ul.querySelectorAll(".btn-selecionar").forEach((b) => {
        b.addEventListener("click", () =>
          this.selecionarPreview(b.dataset.nome),
        );
      });
      ul.querySelectorAll(".btn-remover").forEach((b) => {
        b.addEventListener("click", () =>
          this.remover(parseInt(b.dataset.idx)),
        );
      });

      if (cont) cont.textContent = this.alunos.length;
      const btn = document.getElementById("btnImprimirCertificados");
      if (btn) btn.disabled = this.alunos.length === 0;
    },

    gerarHTML(nome, individual = true) {
      const data = new Date().toLocaleDateString("pt-BR");
      return `
        <div style="
          border: 3px solid #ffb347;
          border-radius: 48px 24px;
          padding: 20px 30px;
          text-align: center;
          background: #fffef7;
          max-width: ${individual ? "500px" : "100%"};
          margin: 0 auto;
          font-family: 'Courier New', monospace;
        ">
          <h3 style="color:#ffb347;font-size:0.9rem;margin-bottom:10px;">🏆 CERTIFICADO DE MESTRE DO LOOP</h3>
          <p style="margin:5px 0;">Certificamos que</p>
          <strong style="font-size:22px;display:block;background:#fff0cc;padding:10px;border-radius:40px;margin:10px 0;">
            ${this.escapeHtml(nome)}
          </strong>
          <p style="margin:5px 0;">concluiu o BIMESTRE 2 de Robótica Educacional<br>
          Dominando <strong>LOOP</strong>, <strong>VARIÁVEL</strong> e <strong>DEPURAÇÃO</strong></p>
          <hr style="border-color:#ffb347;margin:15px 0;">
          <p style="margin:5px 0;">RobôMestres do Paraná • ${data}</p>
          <p style="font-style:italic;margin:5px 0;">"Loop não é macarrão!"</p>
        </div>
      `;
    },

    imprimirTodos() {
      if (this.alunos.length === 0) return alert("Nenhum aluno cadastrado!");
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificados em Lote</title>
          <style>
            body { background: #e0e0e0; padding: 20px; }
            .print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
            @media print {
              @page { size: A4; margin: 1cm; }
              body { background: white; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="print-grid">
            ${this.alunos.map((a) => this.gerarHTML(a, false)).join("")}
          </div>
          <script>
            window.print();
            setTimeout(() => window.close(), 1000);
          <\/script>
        </body>
        </html>
      `;
      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();
    },

    preview() {
      const nome = document.getElementById("previewNomeAluno").textContent;
      if (!nome || nome === "[NOME DO ALUNO]")
        return alert("Selecione um aluno!");
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificado ${nome}</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #e0e0e0; margin: 0; }
          </style>
        </head>
        <body>
          ${this.gerarHTML(nome, true)}
          <script>
            window.print();
            setTimeout(() => window.close(), 1000);
          <\/script>
        </body>
        </html>
      `;
      const win = window.open("", "_blank");
      win.document.write(html);
      win.document.close();
    },

    escapeHtml(t) {
      return t.replace(
        /[&<>]/g,
        (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m] || m,
      );
    },
  };

  // ================================================================
  // 🚀 INICIALIZAÇÃO
  // ================================================================
  document.addEventListener("DOMContentLoaded", function () {
    GameLoopDance.init();
    CertificadoModule.init();
    console.log("🚀 a3bim2.js: Todos os módulos inicializados!");
  });
})();
