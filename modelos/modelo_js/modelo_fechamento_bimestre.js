// ==================================================
// modelo_fechamento_bimestre.js
// Módulo do Jogo LOOP DASH - Fechamento do 1º Bimestre
// Conceito: Loop como otimização de código (montagem com cartões)
// ==================================================

(function () {
  "use strict";

  const FechamentoModule = {
    inicializado: false,

    // Estado do jogo
    faseAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 0 },
    recordes: { 1: null, 2: null, 3: null },
    loopsExecutados: 0,
    bugsEncontrados: 0,

    // Configuração das pistas
    pistas: {
      1: {
        nome: "RETA 🏁",
        grid: [["🚶", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "🏁"]],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 1, colunas: 8 },
      },
      2: {
        nome: "ZIGUE-ZAGUE 🔄",
        grid: [
          ["🚶", "⬜", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 5, colunas: 5 },
      },
      3: {
        nome: "OBSTÁCULOS 🧱",
        grid: [
          ["🚶", "⬜", "🧱", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "🧱", "⬜", "⬜"],
          ["🧱", "⬜", "🧱", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "🧱", "⬜"],
          ["⬜", "🧱", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 6, colunas: 6 },
      },
    },

    // Elementos DOM
    elementos: {
      grid: null,
      cartoesUsados: null,
      melhorMarca: null,
      status: null,
      bonus: null,
      algoritmoMontado: null,
      mensagem: null,
      recordeFase1: null,
      recordeFase2: null,
      recordeFase3: null,
      faseNomeAtual: null,
      faseIconeAtual: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta (contém o jogo)
      if (!document.getElementById("loopdashGrid")) {
        console.log("⏳ FechamentoModule: jogo não encontrado, ignorando...");
        return;
      }

      console.log("🎮 [FechamentoModule] LOOP DASH - Inicializando...");

      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
      this.atualizarContadoresGlobais();
      this.inicializado = true;

      this.dispararEvento("fechamento:pronto");
      console.log("✅ [FechamentoModule] LOOP DASH pronto!");
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

    // ========== GERENCIAMENTO DE FASES ==========
    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();

      // Destaca botão da fase
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.getAttribute("data-fase")) === fase) {
          btn.classList.add("ativo");
        }
      });

      // Atualiza nome da fase
      if (this.elementos.faseNomeAtual) {
        this.elementos.faseNomeAtual.textContent = this.pistas[fase].nome;
      }

      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.elementos.faseIconeAtual) {
        this.elementos.faseIconeAtual.textContent = icones[fase];
      }

      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(
        `🏁 FASE ${fase}: ${this.pistas[fase].nome} selecionada! Monte seu algoritmo clicando nos cartões.`,
        "info"
      );
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
      this.posicaoRobo = { x: pista.inicio.x, y: pista.inicio.y, direcao: 1 }; // 0:cima,1:direita,2:baixo,3:esquerda
      this.desenharGrid();

      if (this.elementos.status) {
        this.elementos.status.textContent = "PRONTO";
        this.elementos.status.classList.remove("text-danger");
      }
    },

    // ========== CONSTRUTOR DE ALGORITMO ==========
    adicionarCartao(comando, parentContainer = null) {
      let cartaoObj = { comando: comando, filhos: [], contador: 3 };

      if (comando === "repita") {
        cartaoObj.filhos = [];
        cartaoObj.contador = 3;
      }

      if (parentContainer) {
        parentContainer.filhos.push(cartaoObj);
      } else {
        this.cartoesAlgoritmo.push(cartaoObj);
      }

      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`➕ Cartão "${this.getNomeComando(comando)}" adicionado!`, "info");
    },

    getNomeComando(comando) {
      const nomes = {
        ande1: "ANDE 1",
        ande2: "ANDE 2",
        vireDireita: "VIRE DIREITA",
        vireEsquerda: "VIRE ESQUERDA",
        repita: "REPITA",
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
        const cartaoDiv = this.criarCartaoElemento(cartao, idx, false);
        this.elementos.algoritmoMontado.appendChild(cartaoDiv);
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
          <input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10" style="width:55px; border-radius:20px; text-align:center;">
          <span class="cartao-texto">vezes</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;

        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";

        const btnAddFilho = document.createElement("button");
        btnAddFilho.innerHTML = "+ adicionar comando";
        btnAddFilho.style.cssText = "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
        btnAddFilho.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaRepita(cartao);
        });

        filhosDiv.appendChild(btnAddFilho);

        if (cartao.filhos && cartao.filhos.length > 0) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx, true);
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
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      }

      const removeBtn = div.querySelector(".cartao-remove");
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idxRemover = parseInt(removeBtn.getAttribute("data-idx"));
          const isFilhoRemover = removeBtn.getAttribute("data-is-filho") === "true";
          this.removerCartao(idxRemover, isFilhoRemover);
        });
      }

      return div;
    },

    mostrarSelecaoComandoParaRepita(cartaoRepita) {
      const comandos = [
        { comando: "ande1", nome: "ANDE 1", icone: "🚶" },
        { comando: "ande2", nome: "ANDE 2", icone: "🏃" },
        { comando: "vireDireita", nome: "VIRE DIREITA", icone: "▶️" },
        { comando: "vireEsquerda", nome: "VIRE ESQUERDA", icone: "◀️" },
      ];

      let modalHtml = `
        <div id="modalComando" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;">
          <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:400px;">
            <h3 style="color:#ffb347;">🔄 Adicionar comando ao REPITA</h3>
            <div style="display:flex; flex-wrap:wrap; gap:12px; margin:20px 0;">
      `;

      comandos.forEach((cmd) => {
        modalHtml += `
          <button class="btn-selecionar-cmd" data-comando="${cmd.comando}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:12px; cursor:pointer;">
            <div style="font-size:2rem;">${cmd.icone}</div>
            <div style="color:#ffb347;">${cmd.nome}</div>
          </button>
        `;
      });

      modalHtml += `
            </div>
            <button id="btnFecharModal" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; color:white; cursor:pointer;">FECHAR</button>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComando");

      document.querySelectorAll(".btn-selecionar-cmd").forEach((btn) => {
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
        btnFechar.addEventListener("click", () => {
          if (modal) modal.remove();
        });
      }
    },

    removerCartao(idx, isFilho) {
      if (!isFilho && this.cartoesAlgoritmo[idx]) {
        this.cartoesAlgoritmo.splice(idx, 1);
      }
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`🗑️ Cartão removido!`, "info");
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

      // Verifica loopception (loop aninhado)
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

    // ========== EXECUÇÃO DO ALGORITMO ==========
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
        this.mostrarMensagem(`🐛 BUG ENCONTRADO! ${explicacaoErro || "O robô não conseguiu completar o percurso."} Use DICA para melhorar.`, "erro");
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

      // Valida movimento
      if (novoX < 0 || novoX >= pista.tamanho.linhas || novoY < 0 || novoY >= pista.tamanho.colunas) {
        return { sucesso: false, erro: "O robô tentou sair da pista! Use comandos menores." };
      }

      if (pista.grid[novoX]?.[novoY] === "🧱") {
        return { sucesso: false, erro: "O robô bateu em um obstáculo! 🧱 Desvie dele." };
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

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // ========== DICAS E EXEMPLOS ==========
    mostrarDica() {
      const dicas = {
        1: "💡 DICA FASE 1: Use um único REPITA 7 vezes com ANDE 1 para percorrer toda a reta!",
        2: "💡 DICA FASE 2: Use REPITA dentro de REPITA para fazer o zigue-zague! Ex: REPITA 2 vezes { ANDE 2, VIRE DIREITA, ANDE 2, VIRE ESQUERDA }",
        3: "💡 DICA FASE 3: Planeje o caminho para desviar dos obstáculos. Use REPITA para repetir padrões de movimento!",
      };
      this.mostrarMensagem(dicas[this.faseAtual] || "💡 Tente usar o cartão REPITA para repetir movimentos e economizar cartões!", "info");
    },

    carregarExemplo() {
      this.limparAlgoritmo();

      if (this.faseAtual === 1) {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 7,
          filhos: [{ comando: "ande1", filhos: [] }],
        });
      } else if (this.faseAtual === 2) {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 2,
          filhos: [
            { comando: "ande2", filhos: [] },
            { comando: "vireDireita", filhos: [] },
            { comando: "ande2", filhos: [] },
            { comando: "vireEsquerda", filhos: [] },
          ],
        });
      } else {
        this.cartoesAlgoritmo.push({ comando: "ande1", filhos: [] });
        this.cartoesAlgoritmo.push({ comando: "vireDireita", filhos: [] });
        this.cartoesAlgoritmo.push({ comando: "ande1", filhos: [] });
      }

      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`📋 Exemplo carregado para a FASE ${this.faseAtual}! Clique em EXECUTAR para testar.`, "success");
    },

    // ========== RECORDES ==========
    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes");
      if (saved) {
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) { }
      }
    },

    salvarRecordes() {
      localStorage.setItem("loopdash_recordes", JSON.stringify(this.recordes));
    },

    atualizarRecordeDisplay() {
      if (this.elementos.recordeFase1) {
        this.elementos.recordeFase1.textContent = this.recordes[1] || "---";
      }
      if (this.elementos.recordeFase2) {
        this.elementos.recordeFase2.textContent = this.recordes[2] || "---";
      }
      if (this.elementos.recordeFase3) {
        this.elementos.recordeFase3.textContent = this.recordes[3] || "---";
      }

      const valores = [this.recordes[1], this.recordes[2], this.recordes[3]].filter(v => v !== null);
      const melhor = valores.length > 0 ? Math.min(...valores) : "--";

      if (this.elementos.melhorMarca) {
        this.elementos.melhorMarca.textContent = melhor;
      }
    },

    // ========== UTILITÁRIOS ==========
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

    atualizarContadoresGlobais() {
      const relatorioBugs = document.getElementById("relatorioBugs");
      const relatorioLoops = document.getElementById("relatorioLoops");

      if (relatorioBugs) relatorioBugs.textContent = this.bugsEncontrados;
      if (relatorioLoops) relatorioLoops.textContent = this.loopsExecutados;
    },

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },

    // ========== CONFIGURAÇÃO DE EVENTOS ==========
    configurarEventos() {
      // Botões de fase
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const fase = parseInt(btn.getAttribute("data-fase"));
          if (fase) this.carregarFase(fase);
        });
      });

      // Cartões de comando
      document.querySelectorAll(".cartao-comando").forEach((cartao) => {
        cartao.addEventListener("click", () => {
          const comando = cartao.getAttribute("data-comando");
          this.adicionarCartao(comando);
        });
      });

      // Botão limpar
      const btnLimpar = document.getElementById("btnLimparAlgoritmo");
      if (btnLimpar) {
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      }

      // Botões principais
      const btnExecutar = document.getElementById("btnExecutarLoopDash");
      const btnReset = document.getElementById("btnResetLoopDash");
      const btnDica = document.getElementById("btnDicaLoopDash");
      const btnExemplo = document.getElementById("btnExemploLoopDash");

      if (btnExecutar) btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset) btnReset.addEventListener("click", () => this.resetarRobo());
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo) btnExemplo.addEventListener("click", () => this.carregarExemplo());
    },
  };

  // Registra no controlador
  if (window.Controlador && typeof window.Controlador.registrarModulo === "function") {
    window.Controlador.registrarModulo("fechamento", FechamentoModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("fechamento", FechamentoModule);
      }
    });
    setTimeout(() => {
      if (!FechamentoModule.inicializado) FechamentoModule.init();
    }, 800);
  }

  window.FechamentoModule = FechamentoModule;
})();
