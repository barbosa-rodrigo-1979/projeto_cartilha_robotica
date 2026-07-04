// ==================================================
// a4bim4.js – LÓGICA COMPLETA PARA 4º ANO – 4º BIMESTRE
// ==================================================

(function () {
  "use strict";

  // ================================================
  // 1. PLANOS DE AULA – ACCORDION E PROGRESSO
  // ================================================
  const PlanosModule = {
    STORAGE_KEY: "a4bim4_progresso",
    totalSemanas: 10,

    init() {
      if (document.getElementById("accordionAulas")) {
        this.carregarProgresso();
        this.configurarCheckboxes();
        this.atualizarBarra();
        this.configurarBotoesExpandir();
        console.log("📚 [Planos] Inicializado.");
      }
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
        try {
          const dados = JSON.parse(salvo);
          document.querySelectorAll(".semana-check").forEach((cb) => {
            const semana = cb.dataset.semana;
            if (dados[semana] !== undefined) cb.checked = dados[semana];
          });
        } catch (e) {}
      }
    },

    salvarProgresso() {
      const dados = {};
      document.querySelectorAll(".semana-check").forEach((cb) => {
        const semana = cb.dataset.semana;
        if (semana) dados[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dados));
      this.atualizarBarra();
    },

    configurarCheckboxes() {
      document.querySelectorAll(".semana-check").forEach((cb) => {
        cb.addEventListener("change", () => this.salvarProgresso());
      });
    },

    atualizarBarra() {
      const checks = document.querySelectorAll(".semana-check");
      const marcados = Array.from(checks).filter((cb) => cb.checked).length;
      const total = checks.length || this.totalSemanas;
      const barra = document.getElementById("barraProgresso");
      const texto = document.getElementById("progressoTexto");
      if (barra) {
        const pct = total > 0 ? (marcados / total) * 100 : 0;
        barra.style.width = pct + "%";
        barra.textContent = Math.round(pct) + "%";
        barra.setAttribute("aria-valuenow", marcados);
      }
      if (texto) texto.textContent = `${marcados}/${total}`;
    },

    configurarBotoesExpandir() {
      const expandir = document.getElementById("expandirTodosBtn");
      const recolher = document.getElementById("recolherTodosBtn");
      if (expandir) {
        expandir.addEventListener("click", () => {
          document
            .querySelectorAll("#accordionAulas .accordion-collapse")
            .forEach((el) => {
              if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
                const bs = bootstrap.Collapse.getOrCreateInstance(el);
                bs.show();
              } else {
                el.classList.add("show");
              }
            });
        });
      }
      if (recolher) {
        recolher.addEventListener("click", () => {
          document
            .querySelectorAll("#accordionAulas .accordion-collapse")
            .forEach((el) => {
              if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
                const bs = bootstrap.Collapse.getOrCreateInstance(el);
                bs.hide();
              } else {
                el.classList.remove("show");
              }
            });
        });
      }
    },
  };
  // ================================================
  // 2. JOGO "ANINHAMENTO EXTREMO" – VERSÃO 2.0
  // ================================================
  const JogoModule = {
    nivelAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 0 },
    recordes: { 1: null, 2: null, 3: null },
    bugsEncontrados: 0,
    loopsExecutados: 0,
    variaveis: {},

    niveis: {
      1: {
        nome: "FÁCIL 🌱",
        grid: [
          ["🚶", "⬜", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜"],
          ["⬜", "🧱", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 4, colunas: 4 },
      },
      2: {
        nome: "MÉDIO ⚡",
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
      3: {
        nome: "DIFÍCIL 🔥",
        grid: [
          ["🚶", "⬜", "🧱", "⬜", "⬜", "🧱", "⬜", "🏁"],
          ["⬜", "🧱", "⬜", "🧱", "⬜", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "🧱", "⬜", "⬜", "⬜", "⬜"],
          ["🧱", "⬜", "🧱", "⬜", "⬜", "🧱", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "🧱", "⬜", "⬜", "🧱"],
          ["⬜", "🧱", "⬜", "⬜", "⬜", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "🧱", "⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "🧱", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        tamanho: { linhas: 8, colunas: 8 },
      },
    },

    elementos: {},

    init() {
      if (!document.getElementById("labirintoGrid")) return;
      console.log("🎮 [Jogo] Inicializando Aninhamento Extremo v2...");
      this.carregarElementos();
      this.carregarRecordes();
      this.configurarEventos();
      this.carregarNivel(1);
    },

    carregarElementos() {
      this.elementos.grid = document.getElementById("labirintoGrid");
      this.elementos.cartoesUsados = document.getElementById("jogoCartoes");
      this.elementos.melhorMarca = document.getElementById("jogoMelhor");
      this.elementos.status = document.getElementById("jogoStatus");
      this.elementos.bonus = document.getElementById("jogoBonus");
      this.elementos.algoritmoMontado = document.getElementById(
        "algoritmoMontadoJogo",
      );
      this.elementos.mensagem = document.getElementById("jogoMensagem");
      this.elementos.recordeNivel1 = document.getElementById("recordeNivel1");
      this.elementos.recordeNivel2 = document.getElementById("recordeNivel2");
      this.elementos.recordeNivel3 = document.getElementById("recordeNivel3");
      this.elementos.nivelNomeAtual = document.getElementById("nivelNomeAtual");
      this.elementos.nivelIconeAtual =
        document.getElementById("nivelIconeAtual");
      this.elementos.placeholder = document.getElementById(
        "placeholderAlgoritmoJogo",
      );
    },

    carregarNivel(nivel) {
      this.nivelAtual = nivel;
      this.limparAlgoritmo();
      this.resetarRobo();
      this.variaveis = {};
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.dataset.nivel) === nivel) btn.classList.add("ativo");
      });
      if (this.elementos.nivelNomeAtual) {
        this.elementos.nivelNomeAtual.textContent = this.niveis[nivel].nome;
      }
      const icones = { 1: "🌱", 2: "⚡", 3: "🔥" };
      if (this.elementos.nivelIconeAtual) {
        this.elementos.nivelIconeAtual.textContent = icones[nivel];
      }
      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(
        `🏁 NÍVEL ${nivel} – ${this.niveis[nivel].nome} selecionado!`,
        "info",
      );
    },

    desenharGrid() {
      const nivel = this.niveis[this.nivelAtual];
      if (!this.elementos.grid) return;
      const grid = this.elementos.grid;
      grid.className = `labirinto-grid nivel${this.nivelAtual}`;
      grid.innerHTML = "";
      for (let l = 0; l < nivel.tamanho.linhas; l++) {
        for (let c = 0; c < nivel.tamanho.colunas; c++) {
          const celula = nivel.grid[l]?.[c] || "⬜";
          const cell = document.createElement("div");
          cell.className = "labirinto-cell";
          if (celula === "🧱") cell.classList.add("wall");
          else if (celula === "🏁") cell.classList.add("target");
          else if (this.posicaoRobo.x === l && this.posicaoRobo.y === c) {
            cell.classList.add("robot");
          } else {
            cell.classList.add("path");
          }
          grid.appendChild(cell);
        }
      }
    },

    resetarRobo() {
      const nivel = this.niveis[this.nivelAtual];
      this.posicaoRobo = { x: nivel.inicio.x, y: nivel.inicio.y, direcao: 1 };
      this.desenharGrid();
      if (this.elementos.status) {
        this.elementos.status.textContent = "PRONTO";
        this.elementos.status.classList.remove("text-danger");
      }
    },
    // ====== RENDERIZAÇÃO DO ALGORITMO ======
    renderizarAlgoritmo() {
      const container = this.elementos.algoritmoMontado;
      if (!container) return;
      container.innerHTML = "";
      if (this.cartoesAlgoritmo.length === 0) {
        container.innerHTML =
          '<div class="placeholder-algoritmo">🃏 Clique nos cartões para montar seu algoritmo...</div>';
        return;
      }
      this.cartoesAlgoritmo.forEach((cartao, idx) => {
        const div = this.criarCartaoElemento(cartao, idx, false);
        container.appendChild(div);
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
          <input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10">
          <span class="cartao-texto">vezes</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";
        const btnAdd = document.createElement("button");
        btnAdd.innerHTML = "+ adicionar comando";
        btnAdd.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
        btnAdd.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaFilho(cartao);
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
        const inputContador = header.querySelector(".repita-contador-input");
        if (inputContador) {
          inputContador.addEventListener("change", (e) => {
            cartao.contador = parseInt(e.target.value) || 3;
            this.atualizarContadorCartoes();
          });
        }
      } else if (cartao.comando === "se") {
        div.classList.add("se-container");
        const header = document.createElement("div");
        header.className = "se-header";
        header.innerHTML = `
          <span class="cartao-icone">❓</span>
          <span class="cartao-texto">SE</span>
          <span class="cartao-texto" style="color:#ffcc88;">${cartao.condicao}</span>
          <span class="cartao-texto">ENTÃO</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "se-filhos";
        const btnAdd = document.createElement("button");
        btnAdd.innerHTML = "+ adicionar comando (ENTÃO)";
        btnAdd.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
        btnAdd.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaFilho(cartao);
        });
        filhosDiv.appendChild(btnAdd);
        if (cartao.filhos && cartao.filhos.length > 0) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx, true);
            filhosDiv.appendChild(filhoDiv);
          });
        }
        // SENÃO
        if (cartao.senaoFilhos !== undefined) {
          const senaoDiv = document.createElement("div");
          senaoDiv.style.cssText =
            "width:100%; margin-top:4px; border-top:1px dashed #ffb347; padding-top:4px;";
          senaoDiv.innerHTML = `<span class="cartao-texto" style="color:#ff9999;">SENÃO</span>`;
          const senaoFilhosDiv = document.createElement("div");
          senaoFilhosDiv.className = "se-filhos";
          const btnAddSenao = document.createElement("button");
          btnAddSenao.innerHTML = "+ adicionar comando (SENÃO)";
          btnAddSenao.style.cssText =
            "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
          btnAddSenao.addEventListener("click", (e) => {
            e.stopPropagation();
            this.mostrarSelecaoComandoParaFilho(cartao, true);
          });
          senaoFilhosDiv.appendChild(btnAddSenao);
          if (cartao.senaoFilhos && cartao.senaoFilhos.length > 0) {
            cartao.senaoFilhos.forEach((filho, fIdx) => {
              const filhoDiv = this.criarCartaoElemento(filho, fIdx, true);
              senaoFilhosDiv.appendChild(filhoDiv);
            });
          }
          senaoDiv.appendChild(senaoFilhosDiv);
          filhosDiv.appendChild(senaoDiv);
        }
        div.appendChild(header);
        div.appendChild(filhosDiv);
      } else if (cartao.comando === "parametro") {
        div.innerHTML = `
          <span class="cartao-icone">📊</span>
          <span class="cartao-texto">PARÂMETRO: ${cartao.nomeVar} = ${cartao.valorVar}</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      } else if (cartao.comando === "e_ou") {
        div.innerHTML = `
          <span class="cartao-icone">🔀</span>
          <span class="cartao-texto">(${cartao.cond1} ${cartao.op} ${cartao.cond2})</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      } else if (cartao.comando === "ande") {
        div.innerHTML = `
          <span class="cartao-icone">🚶</span>
          <span class="cartao-texto">ANDE ${cartao.passos}</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      } else if (cartao.comando === "vire") {
        div.innerHTML = `
          <span class="cartao-icone">🔄</span>
          <span class="cartao-texto">VIRE ${cartao.direcao}</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      } else {
        div.innerHTML = `
          <span class="cartao-icone">❓</span>
          <span class="cartao-texto">${cartao.comando}</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;
      }

      const removeBtn = div.querySelector(".cartao-remove");
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idxRemover = parseInt(removeBtn.dataset.idx);
          const isFilho = removeBtn.dataset.isFilho === "true";
          this.removerCartao(idxRemover, isFilho);
        });
      }
      return div;
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
      this.mostrarMensagem(`🧹 Algoritmo limpo! Monte um novo.`, "info");
    },

    atualizarContadorCartoes() {
      const contar = (arr) => {
        let total = 0;
        for (const item of arr) {
          total++;
          if (
            (item.comando === "repita" || item.comando === "se") &&
            item.filhos
          ) {
            total += contar(item.filhos);
          }
          if (item.comando === "se" && item.senaoFilhos) {
            total += contar(item.senaoFilhos);
          }
        }
        return total;
      };
      const total = contar(this.cartoesAlgoritmo);
      if (this.elementos.cartoesUsados)
        this.elementos.cartoesUsados.textContent = total;
      // Verifica profundidade de aninhamento (bônus)
      let profundidade = 0;
      const verificarProfundidade = (arr, nivel) => {
        for (const item of arr) {
          if (item.comando === "se" || item.comando === "repita") {
            if (nivel > profundidade) profundidade = nivel;
            if (item.filhos) verificarProfundidade(item.filhos, nivel + 1);
            if (item.senaoFilhos)
              verificarProfundidade(item.senaoFilhos, nivel + 1);
          }
        }
      };
      verificarProfundidade(this.cartoesAlgoritmo, 1);
      if (this.elementos.bonus) {
        this.elementos.bonus.textContent =
          profundidade >= 3
            ? "⭐ ANINHAMENTO MÁXIMO!"
            : profundidade >= 2
              ? "⭐ ANINHADO!"
              : "---";
      }
    },

    getNomeComando(comando) {
      const nomes = {
        se: "SE",
        repita: "REPITA",
        ande: "ANDE",
        vire: "VIRE",
        parametro: "PARÂMETRO",
        e_ou: "E/OU",
      };
      return nomes[comando] || comando;
    },

    getIconeComando(comando) {
      const icones = {
        se: "❓",
        repita: "🔄",
        ande: "🚶",
        vire: "🔄",
        parametro: "📊",
        e_ou: "🔀",
      };
      return icones[comando] || "❓";
    },
    // ====== ADICIONAR CARTAO (COM MODAL UNIFICADO) ======
    adicionarCartao(comando) {
      this.criarModalComando(comando);
    },

    // ====== CRIA MODAL PARA QUALQUER COMANDO ======
    criarModalComando(comando) {
      const modalExistente = document.getElementById("modalComandoUnificado");
      if (modalExistente) modalExistente.remove();

      const modal = document.createElement("div");
      modal.id = "modalComandoUnificado";
      modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center;
        z-index: 99999; backdrop-filter: blur(4px);
      `;

      const painel = document.createElement("div");
      painel.style.cssText = `
        background: #1e2a1a; border: 3px solid #ffb347; border-radius: 32px;
        padding: 28px; max-width: 500px; width: 90%; color: #e9f5db;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        font-family: 'Chakra Petch', monospace;
      `;

      let titulo = "";
      let camposHTML = "";

      switch (comando) {
        case "se":
          titulo = "❓ SE – Condicional";
          camposHTML = `
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Condição (escolha uma):</label>
              <select id="modalCondicaoSe" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
                <option value="parede">🧱 Parede à frente</option>
                <option value="luz">💡 Luz ambiente (alta/baixa)</option>
                <option value="toque">✋ Sensor de toque</option>
                <option value="sensor">📡 Sensor genérico (aleatório)</option>
              </select>
            </div>
            <div style="margin-bottom: 12px; color:#9bbc7b; font-size:0.8rem;">
              <i class="bi bi-info-circle"></i> 
              <span>O robô vai executar os comandos do ENTÃO se a condição for verdadeira. 
              Você pode adicionar um SENÃO depois.</span>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <button id="modalBtnConfirmar" class="btn-robotico-ano2" style="flex:1;">ADICIONAR SE</button>
              <button id="modalBtnCancelar" style="background:#555; border:none; border-radius:40px; padding:8px 16px; color:white; cursor:pointer;">CANCELAR</button>
            </div>
          `;
          break;

        case "repita":
          titulo = "🔄 REPITA – Loop";
          camposHTML = `
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Número de repetições:</label>
              <input type="number" id="modalContadorRepita" value="3" min="1" max="20" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
            </div>
            <div style="margin-bottom: 12px; color:#9bbc7b; font-size:0.8rem;">
              <i class="bi bi-info-circle"></i> 
              <span>Dentro do REPITA, você vai adicionar outros comandos (ANDE, VIRE, SE, etc.)</span>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <button id="modalBtnConfirmar" class="btn-robotico-ano2" style="flex:1;">ADICIONAR REPITA</button>
              <button id="modalBtnCancelar" style="background:#555; border:none; border-radius:40px; padding:8px 16px; color:white; cursor:pointer;">CANCELAR</button>
            </div>
          `;
          break;

        case "parametro":
          titulo = "📊 PARÂMETRO – Definir variável";
          camposHTML = `
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Nome da variável:</label>
              <input type="text" id="modalNomeParam" value="distancia" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
            </div>
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Valor (número ou "sensor"):</label>
              <input type="text" id="modalValorParam" value="sensor" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
              <div style="font-size:0.7rem; color:#9bbc7b; margin-top:4px;">Use "sensor" para valor aleatório (1 a 5) ou digite um número fixo.</div>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <button id="modalBtnConfirmar" class="btn-robotico-ano2" style="flex:1;">ADICIONAR PARÂMETRO</button>
              <button id="modalBtnCancelar" style="background:#555; border:none; border-radius:40px; padding:8px 16px; color:white; cursor:pointer;">CANCELAR</button>
            </div>
          `;
          break;

        case "e_ou":
          titulo = "🔀 E / OU – Condição composta";
          camposHTML = `
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Operador:</label>
              <select id="modalOpEou" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
                <option value="E">E (AND)</option>
                <option value="OU">OU (OR)</option>
              </select>
            </div>
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Primeira condição:</label>
              <select id="modalCond1Eou" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
                <option value="parede">🧱 Parede</option>
                <option value="luz">💡 Luz</option>
                <option value="toque">✋ Toque</option>
              </select>
            </div>
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Segunda condição:</label>
              <select id="modalCond2Eou" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
                <option value="parede">🧱 Parede</option>
                <option value="luz">💡 Luz</option>
                <option value="toque">✋ Toque</option>
              </select>
            </div>
            <div style="margin-bottom: 12px; color:#9bbc7b; font-size:0.8rem;">
              <i class="bi bi-info-circle"></i> 
              <span>A condição composta será verdadeira se ambas (E) ou pelo menos uma (OU) for verdadeira.</span>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <button id="modalBtnConfirmar" class="btn-robotico-ano2" style="flex:1;">ADICIONAR E/OU</button>
              <button id="modalBtnCancelar" style="background:#555; border:none; border-radius:40px; padding:8px 16px; color:white; cursor:pointer;">CANCELAR</button>
            </div>
          `;
          break;

        case "ande":
          titulo = "🚶 ANDE – Mover passos";
          camposHTML = `
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Quantos passos? (número ou nome de variável):</label>
              <input type="text" id="modalPassosAnde" value="1" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
              <div style="font-size:0.7rem; color:#9bbc7b; margin-top:4px;">Ex: "2" ou "distancia" (se você criou uma variável).</div>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <button id="modalBtnConfirmar" class="btn-robotico-ano2" style="flex:1;">ADICIONAR ANDE</button>
              <button id="modalBtnCancelar" style="background:#555; border:none; border-radius:40px; padding:8px 16px; color:white; cursor:pointer;">CANCELAR</button>
            </div>
          `;
          break;

        case "vire":
          titulo = "🔄 VIRE – Mudar direção";
          camposHTML = `
            <div style="margin-bottom: 12px;">
              <label style="color:#ffb347;">Direção:</label>
              <select id="modalDirVire" style="width:100%; padding:8px; border-radius:20px; background:#2c3e2b; color:#e9f5db; border:1px solid #ffb347;">
                <option value="direita">▶️ Direita (90°)</option>
                <option value="esquerda">◀️ Esquerda (90°)</option>
              </select>
            </div>
            <div style="display:flex; gap:8px; margin-top:12px;">
              <button id="modalBtnConfirmar" class="btn-robotico-ano2" style="flex:1;">ADICIONAR VIRE</button>
              <button id="modalBtnCancelar" style="background:#555; border:none; border-radius:40px; padding:8px 16px; color:white; cursor:pointer;">CANCELAR</button>
            </div>
          `;
          break;

        default:
          return;
      }

      painel.innerHTML = `
        <h3 style="color:#ffb347; font-family:'Press Start 2P', cursive; font-size:1rem; margin-bottom:16px;">${titulo}</h3>
        ${camposHTML}
      `;

      modal.appendChild(painel);
      document.body.appendChild(modal);

      // === Eventos ===
      const confirmar = modal.querySelector("#modalBtnConfirmar");
      const cancelar = modal.querySelector("#modalBtnCancelar");

      confirmar.addEventListener("click", () => {
        let cartaoObj = {
          comando: comando,
          filhos: [],
          contador: 3,
          condicao: "parede",
        };

        switch (comando) {
          case "se": {
            const cond = document.getElementById("modalCondicaoSe").value;
            cartaoObj.condicao = cond;
            cartaoObj.senaoFilhos = [];
            break;
          }
          case "repita": {
            const cont =
              parseInt(document.getElementById("modalContadorRepita").value) ||
              3;
            cartaoObj.contador = cont;
            break;
          }
          case "parametro": {
            const nome = document.getElementById("modalNomeParam").value.trim();
            if (!nome) {
              alert("Digite um nome para a variável!");
              return;
            }
            const valor = document
              .getElementById("modalValorParam")
              .value.trim();
            cartaoObj.nomeVar = nome;
            cartaoObj.valorVar =
              valor === "sensor"
                ? "sensor"
                : isNaN(valor)
                  ? 0
                  : parseInt(valor);
            break;
          }
          case "e_ou": {
            const op = document.getElementById("modalOpEou").value;
            const cond1 = document.getElementById("modalCond1Eou").value;
            const cond2 = document.getElementById("modalCond2Eou").value;
            cartaoObj.op = op;
            cartaoObj.cond1 = cond1;
            cartaoObj.cond2 = cond2;
            break;
          }
          case "ande": {
            const passos = document
              .getElementById("modalPassosAnde")
              .value.trim();
            if (!passos) {
              alert("Digite o número de passos!");
              return;
            }
            cartaoObj.passos = passos;
            break;
          }
          case "vire": {
            const dir = document.getElementById("modalDirVire").value;
            cartaoObj.direcao = dir;
            break;
          }
        }

        this.cartoesAlgoritmo.push(cartaoObj);
        this.renderizarAlgoritmo();
        this.atualizarContadorCartoes();
        this.mostrarMensagem(
          `➕ Cartão "${this.getNomeComando(comando)}" adicionado!`,
          "info",
        );
        modal.remove();
      });

      cancelar.addEventListener("click", () => {
        modal.remove();
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
      });
    },

    // ====== ADICIONAR COMANDO DENTRO DE FILHO (SE/REPITA) ======
    mostrarSelecaoComandoParaFilho(parent, isSenao = false) {
      const comandos = [
        { comando: "ande", nome: "ANDE", icone: "🚶" },
        { comando: "vire", nome: "VIRE", icone: "🔄" },
        { comando: "repita", nome: "REPITA", icone: "🔄" },
        { comando: "se", nome: "SE", icone: "❓" },
        { comando: "parametro", nome: "PARÂMETRO", icone: "📊" },
        { comando: "e_ou", nome: "E/OU", icone: "🔀" },
      ];
      let modalHtml = `
        <div id="modalComandoFilho" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:99999;">
          <div style="background:#1e2a1a;padding:24px;border-radius:24px;border:3px solid #ffb347;max-width:400px;width:90%;">
            <h3 style="color:#ffb347;">➕ Adicionar comando ${isSenao ? "(SENÃO)" : "(ENTÃO)"}</h3>
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin:20px 0;justify-content:center;">
      `;
      comandos.forEach((cmd) => {
        modalHtml += `
          <button class="btn-selecionar-cmd-filho" data-comando="${cmd.comando}" style="background:#2c3e2b;border:2px solid #4a7c3f;border-radius:16px;padding:12px;cursor:pointer;min-width:70px;">
            <div style="font-size:2rem;">${cmd.icone}</div>
            <div style="color:#ffb347;font-size:0.7rem;">${cmd.nome}</div>
          </button>
        `;
      });
      modalHtml += `
            </div>
            <button id="btnFecharModalFilho" style="background:#e74c3c;border:none;border-radius:40px;padding:8px 20px;color:white;cursor:pointer;">FECHAR</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComandoFilho");

      const botoes = modal.querySelectorAll(".btn-selecionar-cmd-filho");
      botoes.forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.dataset.comando;
          // Cria cartão com valores padrão, depois abre modal para configurar
          // Reutilizamos o modal unificado para configurar o comando
          modal.remove();
          // Abre modal para o comando escolhido, mas com callback para inserir no filho
          this.criarModalComandoComCallback(comando, (cartaoObj) => {
            if (isSenao) {
              if (!parent.senaoFilhos) parent.senaoFilhos = [];
              parent.senaoFilhos.push(cartaoObj);
            } else {
              parent.filhos.push(cartaoObj);
            }
            this.renderizarAlgoritmo();
            this.atualizarContadorCartoes();
            this.mostrarMensagem(
              `➕ Comando adicionado dentro do bloco!`,
              "success",
            );
          });
        });
      });

      const fechar = document.getElementById("btnFecharModalFilho");
      if (fechar) fechar.addEventListener("click", () => modal.remove());
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
      });
    },

    // ====== CRIA MODAL COM CALLBACK PARA USO EM FILHOS ======
    criarModalComandoComCallback(comando, callback) {
      // Usa o mesmo modal unificado, mas com callback
      const originalAdicionar = this.adicionarCartao;
      this.adicionarCartao = function (cmd) {
        // Sobrescreve para capturar o objeto criado
        const modal = document.getElementById("modalComandoUnificado");
        if (modal) {
          const confirmar = modal.querySelector("#modalBtnConfirmar");
          // Guarda o listener original e substitui
          const novoConfirmar = confirmar.cloneNode(true);
          confirmar.parentNode.replaceChild(novoConfirmar, confirmar);
          novoConfirmar.addEventListener("click", () => {
            // Coleta dados do modal manualmente
            let cartaoObj = {
              comando: cmd,
              filhos: [],
              contador: 3,
              condicao: "parede",
            };
            // ... (repetir lógica de coleta)
            // Como é complexo, vamos usar a função já existente mas com callback
            // Melhor: usamos o modal original e interceptamos o clique
            // Para simplificar, vamos abrir o modal e depois de confirmar, chamamos o callback
          });
        }
      };
      // Abre o modal normalmente
      this.criarModalComando(comando);
      // Após confirmar, precisamos interceptar. Vamos fazer via evento
      const checkModal = setInterval(() => {
        const modal = document.getElementById("modalComandoUnificado");
        if (!modal) {
          clearInterval(checkModal);
          return;
        }
        const confirmar = modal.querySelector("#modalBtnConfirmar");
        if (confirmar) {
          const oldClick = confirmar._listener;
          if (!oldClick) {
            confirmar._listener = true;
            confirmar.addEventListener(
              "click",
              () => {
                // Pegamos os dados do modal manualmente
                let cartaoObj = {
                  comando: comando,
                  filhos: [],
                  contador: 3,
                  condicao: "parede",
                };
                // Coletar dados conforme comando
                // ... (código de coleta)
                // Por simplicidade, vamos reutilizar a lógica de coleta do modal original
                // Mas como é callback, vamos chamar o callback com o objeto
                // Para evitar duplicação, usamos o método auxiliar
                const dados = this.coletarDadosDoModal(comando);
                if (dados) {
                  callback(dados);
                  modal.remove();
                }
              },
              { once: true },
            );
          }
        }
      }, 100);
    },

    // ====== AUXILIAR PARA COLETAR DADOS DO MODAL ======
    coletarDadosDoModal(comando) {
      let cartaoObj = {
        comando: comando,
        filhos: [],
        contador: 3,
        condicao: "parede",
      };
      try {
        switch (comando) {
          case "se": {
            const cond = document.getElementById("modalCondicaoSe").value;
            cartaoObj.condicao = cond;
            cartaoObj.senaoFilhos = [];
            break;
          }
          case "repita": {
            const cont =
              parseInt(document.getElementById("modalContadorRepita").value) ||
              3;
            cartaoObj.contador = cont;
            break;
          }
          case "parametro": {
            const nome = document.getElementById("modalNomeParam").value.trim();
            if (!nome) return null;
            const valor = document
              .getElementById("modalValorParam")
              .value.trim();
            cartaoObj.nomeVar = nome;
            cartaoObj.valorVar =
              valor === "sensor"
                ? "sensor"
                : isNaN(valor)
                  ? 0
                  : parseInt(valor);
            break;
          }
          case "e_ou": {
            cartaoObj.op = document.getElementById("modalOpEou").value;
            cartaoObj.cond1 = document.getElementById("modalCond1Eou").value;
            cartaoObj.cond2 = document.getElementById("modalCond2Eou").value;
            break;
          }
          case "ande": {
            const passos = document
              .getElementById("modalPassosAnde")
              .value.trim();
            if (!passos) return null;
            cartaoObj.passos = passos;
            break;
          }
          case "vire": {
            cartaoObj.direcao = document.getElementById("modalDirVire").value;
            break;
          }
        }
        return cartaoObj;
      } catch (e) {
        return null;
      }
    },
    // ====== EXECUÇÃO DO ALGORITMO ======
    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem(
          "⚠️ Você precisa montar um algoritmo primeiro!",
          "erro",
        );
        return;
      }
      this.resetarRobo();
      this.variaveis = {};
      this.mostrarMensagem("🤖 Executando algoritmo... 🏃", "info");
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
          await this.delay(300);
          this.desenharGrid();
        }
      } catch (err) {
        sucesso = false;
        erroMsg = err.message;
      }

      const chegou = this.verificarChegada();
      if (sucesso && chegou) {
        const totalCartoes = parseInt(
          this.elementos.cartoesUsados?.textContent || "0",
        );
        const recordeAtual = this.recordes[this.nivelAtual];
        if (!recordeAtual || totalCartoes < recordeAtual) {
          this.recordes[this.nivelAtual] = totalCartoes;
          this.salvarRecordes();
          this.atualizarRecordeDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou o NÍVEL ${this.nivelAtual} com ${totalCartoes} cartões! NOVO RECORDE! 🏆`,
            "success",
          );
        } else {
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou o NÍVEL ${this.nivelAtual} com ${totalCartoes} cartões!`,
            "success",
          );
        }
        this.loopsExecutados++;
        this.atualizarContadoresGlobais();
        if (this.elementos.status)
          this.elementos.status.textContent = "VITÓRIA! 🏆";
      } else {
        this.bugsEncontrados++;
        this.atualizarContadoresGlobais();
        this.mostrarMensagem(
          `🐛 BUG ENCONTRADO! ${erroMsg || "O robô não conseguiu completar o percurso."}`,
          "erro",
        );
        if (this.elementos.status) {
          this.elementos.status.textContent = "BUGOU! 💥";
          this.elementos.status.classList.add("text-danger");
        }
      }
    },

    async executarComando(comandoObj) {
      const comando = comandoObj.comando;

      if (comando === "parametro") {
        let valor = comandoObj.valorVar;
        if (valor === "sensor") {
          valor = Math.floor(Math.random() * 5) + 1;
        }
        this.variaveis[comandoObj.nomeVar] = valor;
        this.mostrarMensagem(`📊 ${comandoObj.nomeVar} = ${valor}`, "info");
        return { sucesso: true };
      }

      if (comando === "e_ou") {
        const cond1 = this.avaliarCondicao(comandoObj.cond1);
        const cond2 = this.avaliarCondicao(comandoObj.cond2);
        const resultado =
          comandoObj.op === "E" ? cond1 && cond2 : cond1 || cond2;
        this.mostrarMensagem(
          `🔀 (${comandoObj.cond1} ${comandoObj.op} ${comandoObj.cond2}) = ${resultado}`,
          "info",
        );
        return { sucesso: true };
      }

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
        this.mostrarMensagem(
          `❓ SE ${comandoObj.condicao} = ${condicaoVerdadeira}`,
          "info",
        );
        if (condicaoVerdadeira) {
          for (const filho of comandoObj.filhos || []) {
            const resultado = await this.executarComando(filho);
            if (!resultado.sucesso) return resultado;
            await this.delay(200);
            this.desenharGrid();
          }
        } else {
          if (comandoObj.senaoFilhos && comandoObj.senaoFilhos.length > 0) {
            for (const filho of comandoObj.senaoFilhos) {
              const resultado = await this.executarComando(filho);
              if (!resultado.sucesso) return resultado;
              await this.delay(200);
              this.desenharGrid();
            }
          }
        }
        return { sucesso: true };
      }

      if (comando === "ande") {
        let passos = comandoObj.passos;
        if (
          typeof passos === "string" &&
          this.variaveis[passos] !== undefined
        ) {
          passos = this.variaveis[passos];
        } else {
          passos = parseInt(passos) || 1;
        }
        if (passos < 1) passos = 1;
        for (let i = 0; i < passos; i++) {
          const prox = this.proximaPosicao();
          if (!this.validarPosicao(prox.x, prox.y)) {
            return {
              sucesso: false,
              erro: `O robô tentou andar ${i + 1} passos e bateu na parede! 🧱`,
            };
          }
          this.posicaoRobo.x = prox.x;
          this.posicaoRobo.y = prox.y;
          await this.delay(200);
          this.desenharGrid();
        }
        return { sucesso: true };
      }

      if (comando === "vire") {
        const dir = comandoObj.direcao === "direita" ? 1 : -1;
        this.posicaoRobo.direcao = (this.posicaoRobo.direcao + dir + 4) % 4;
        return { sucesso: true };
      }

      return { sucesso: false, erro: `Comando desconhecido: ${comando}` };
    },

    avaliarCondicao(condicao) {
      const nivel = this.niveis[this.nivelAtual];
      const { x, y, direcao } = this.posicaoRobo;
      let proxX = x,
        proxY = y;
      if (direcao === 0) proxX--;
      else if (direcao === 1) proxY++;
      else if (direcao === 2) proxX++;
      else if (direcao === 3) proxY--;

      const temParede =
        proxX < 0 ||
        proxX >= nivel.tamanho.linhas ||
        proxY < 0 ||
        proxY >= nivel.tamanho.colunas ||
        nivel.grid[proxX]?.[proxY] === "🧱";
      const luz = Math.random() > 0.5;
      const toque = Math.random() > 0.5;

      if (condicao === "parede") return temParede;
      if (condicao === "luz") return luz;
      if (condicao === "toque") return toque;
      return Math.random() > 0.5;
    },

    proximaPosicao() {
      const { x, y, direcao } = this.posicaoRobo;
      let novoX = x,
        novoY = y;
      if (direcao === 0) novoX--;
      else if (direcao === 1) novoY++;
      else if (direcao === 2) novoX++;
      else if (direcao === 3) novoY--;
      return { x: novoX, y: novoY };
    },

    validarPosicao(x, y) {
      const nivel = this.niveis[this.nivelAtual];
      if (
        x < 0 ||
        x >= nivel.tamanho.linhas ||
        y < 0 ||
        y >= nivel.tamanho.colunas
      )
        return false;
      return nivel.grid[x][y] !== "🧱";
    },

    verificarChegada() {
      const nivel = this.niveis[this.nivelAtual];
      return nivel.grid[this.posicaoRobo.x]?.[this.posicaoRobo.y] === "🏁";
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    // ====== DICAS E EXEMPLOS ======
    mostrarDica() {
      const dicas = {
        1: "💡 Use um SE para verificar se há parede e desviar. Ex: SE parede ENTÃO VIRE direita.",
        2: "💡 Combine REPITA com SE para percorrer corredores. Ex: REPITA 3 vezes { SE parede ENTÃO VIRE }",
        3: "💡 Aninhe dois SE dentro de um REPITA para resolver labirintos complexos.",
      };
      this.mostrarMensagem(
        dicas[this.nivelAtual] ||
          "💡 Use PARÂMETRO para criar variáveis e otimizar seu código.",
        "info",
      );
    },

    carregarExemplo() {
      this.limparAlgoritmo();
      if (this.nivelAtual === 1) {
        this.cartoesAlgoritmo.push({
          comando: "se",
          condicao: "parede",
          filhos: [{ comando: "vire", direcao: "direita" }],
          senaoFilhos: [{ comando: "ande", passos: "1" }],
        });
      } else if (this.nivelAtual === 2) {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 3,
          filhos: [
            {
              comando: "se",
              condicao: "parede",
              filhos: [{ comando: "vire", direcao: "direita" }],
              senaoFilhos: [{ comando: "ande", passos: "1" }],
            },
          ],
        });
      } else {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 2,
          filhos: [
            {
              comando: "se",
              condicao: "parede",
              filhos: [
                {
                  comando: "repita",
                  contador: 2,
                  filhos: [{ comando: "vire", direcao: "direita" }],
                },
              ],
              senaoFilhos: [{ comando: "ande", passos: "1" }],
            },
          ],
        });
      }
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(
        `📋 Exemplo carregado para o NÍVEL ${this.nivelAtual}!`,
        "success",
      );
    },

    // ====== RECORDES ======
    carregarRecordes() {
      const saved = localStorage.getItem("a4bim4_recordes");
      if (saved) {
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) {}
      }
    },
    salvarRecordes() {
      localStorage.setItem("a4bim4_recordes", JSON.stringify(this.recordes));
    },
    atualizarRecordeDisplay() {
      if (this.elementos.recordeNivel1)
        this.elementos.recordeNivel1.textContent = this.recordes[1] || "---";
      if (this.elementos.recordeNivel2)
        this.elementos.recordeNivel2.textContent = this.recordes[2] || "---";
      if (this.elementos.recordeNivel3)
        this.elementos.recordeNivel3.textContent = this.recordes[3] || "---";
      const valores = [
        this.recordes[1],
        this.recordes[2],
        this.recordes[3],
      ].filter((v) => v !== null);
      const melhor = valores.length > 0 ? Math.min(...valores) : "--";
      if (this.elementos.melhorMarca)
        this.elementos.melhorMarca.textContent = melhor;
    },

    // ====== UTILITÁRIOS ======
    mostrarMensagem(texto, tipo) {
      const el = this.elementos.mensagem;
      if (!el) return;
      el.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      el.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "success" ? "sucesso" : ""}`;
      if (tipo !== "erro") {
        setTimeout(() => {
          el.className = "mensagem-jogo";
        }, 4000);
      }
    },

    atualizarContadoresGlobais() {
      const bugs = document.getElementById("relatorioBugs");
      const loops = document.getElementById("relatorioLoops");
      if (bugs) bugs.textContent = this.bugsEncontrados;
      if (loops) loops.textContent = this.loopsExecutados;
    },

    // ====== CONFIGURAR EVENTOS ======
    configurarEventos() {
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nivel = parseInt(btn.dataset.nivel);
          if (nivel) this.carregarNivel(nivel);
        });
      });

      document
        .querySelectorAll("#cartoesGridJogo .cartao-comando")
        .forEach((cartao) => {
          cartao.addEventListener("click", () => {
            const comando = cartao.dataset.comando;
            this.adicionarCartao(comando);
          });
        });

      const btnLimpar = document.getElementById("btnLimparAlgoritmoJogo");
      if (btnLimpar)
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());

      const btnExecutar = document.getElementById("btnExecutarJogo");
      const btnReset = document.getElementById("btnResetJogo");
      const btnDica = document.getElementById("btnDicaJogo");
      const btnExemplo = document.getElementById("btnExemploJogo");
      if (btnExecutar)
        btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset)
        btnReset.addEventListener("click", () => this.resetarRobo());
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo)
        btnExemplo.addEventListener("click", () => this.carregarExemplo());
    },
  };
  // ================================================
  // 3. CERTIFICADO (cadastro, preview, impressão)
  // ================================================
  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "a4bim4_certificados",

    init() {
      if (!document.getElementById("listaAlunos")) return;
      console.log("🎓 [Certificado] Inicializando...");
      this.carregarAlunos();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
    },

    carregarAlunos() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      }
      if (this.alunos.length === 0) {
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
      const el = document.getElementById("previewData");
      if (el) el.textContent = new Date().toLocaleDateString("pt-BR");
    },

    atualizarEstadoBotoes() {
      const btnImprimir = document.getElementById("btnImprimirCertificados");
      const btnPreview = document.getElementById("btnPreviewAluno");
      if (btnImprimir) btnImprimir.disabled = this.alunos.length === 0;
      const nomePreview =
        document.getElementById("previewNomeAluno")?.textContent || "";
      if (btnPreview)
        btnPreview.disabled =
          nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
    },

    adicionarAluno() {
      const input = document.getElementById("nomeAluno");
      if (!input) return;
      let nome = input.value.trim();
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
      input.value = "";
      input.focus();
      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        const nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        const preview = document.getElementById("previewNomeAluno");
        if (preview && preview.textContent === nomeRemovido)
          preview.textContent = "[NOME DO ALUNO]";
        this.atualizarEstadoBotoes();
      }
    },

    selecionarAlunoPreview(nome) {
      const preview = document.getElementById("previewNomeAluno");
      if (preview) preview.textContent = nome;
      this.atualizarEstadoBotoes();
    },

    atualizarLista() {
      const lista = document.getElementById("listaAlunos");
      const contador = document.getElementById("contadorAlunos");
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
        li.innerHTML = `
          <span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
          <div class="btn-group gap-1">
            <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
            <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
          </div>
        `;
        lista.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.dataset.nome;
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.index);
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });
      if (contador) contador.textContent = this.alunos.length;
    },

    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title>
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
        </head>
        <body>
          <div class="preview-container">
            <div class="preview-actions">
              <button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button>
              <button class="btn-close" onclick="window.close();">✖️ FECHAR</button>
            </div>
            <div class="certificado">
              <h3>🏆 CERTIFICADO DE MESTRE DO ANINHAMENTO – 4º ANO</h3>
              <p>Certificamos que</p>
              <strong class="nome">${this.escapeHtml(nome)}</strong>
              <p>concluiu com êxito o <strong>4º ANO – ROBÓTICA EDUCACIONAL</strong><br>
              🔁 ANINHAMENTO | 🤔 E/OU | 📡 PARÂMETROS | 🚧 ROBÔ EQUILIBRISTA | 🧠 PROJETO AUTORAL</p>
              <hr>
              <p>RobôMestres do Paraná • ${data}</p>
              <p style="font-size:11px; font-style:italic;">"Aninhar é como abrir uma boneca russa – dentro de um SE tem um REPITA, dentro do REPITA tem outro SE!"</p>
              <div style="margin-top:10px;">🤖 Ass: Robô Zé 4.0</div>
            </div>
          </div>
          <script>window.onbeforeprint = function(){ document.body.style.printColorAdjust = "exact"; };<\/script>
        </body>
        </html>
      `;
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

    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado!");
        return;
      }
      const data = new Date().toLocaleDateString("pt-BR");
      let cards = "";
      this.alunos.forEach((aluno) => {
        cards += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO MESTRE DO ANINHAMENTO</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>4º ANO – ROBÓTICA EDUCACIONAL</strong><br>🔁 ANINHAMENTO | 🤔 E/OU | 📡 PARÂMETROS</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${data}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Aninhar é abrir uma boneca russa!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Certificados 4º Ano</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:white; padding:20px; }
        .print-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media print { body { padding:0; margin:0; } .print-grid { gap:15px; } @page { size:A4; margin:0.8cm; } }
      </style>
      </head>
      <body>
        <div class="print-grid">${cards}</div>
        <script>
          window.onload = function() {
            setTimeout(function(){ window.print(); setTimeout(function(){ window.close(); },500); },200);
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
      const preview = document.getElementById("previewNomeAluno");
      const nome = preview?.textContent || "";
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
    },

    escapeHtml(texto) {
      if (!texto) return "";
      return texto.replace(
        /[&<>]/g,
        (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m] || m,
      );
    },

    configurarEventos() {
      const btnAdd = document.getElementById("btnAdicionar");
      const inputNome = document.getElementById("nomeAluno");
      const btnImprimir = document.getElementById("btnImprimirCertificados");
      const btnPreview = document.getElementById("btnPreviewAluno");
      if (btnAdd) btnAdd.addEventListener("click", () => this.adicionarAluno());
      if (inputNome)
        inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      if (btnImprimir)
        btnImprimir.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      if (btnPreview)
        btnPreview.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
    },
  };

  // ================================================
  // 4. INICIALIZAÇÃO GERAL
  // ================================================
  document.addEventListener("DOMContentLoaded", function () {
    PlanosModule.init();
    JogoModule.init();
    CertificadoModule.init();
    console.log("🤖 [a4bim4] Todos os módulos inicializados.");
  });
})(); // Fim do IIFE
