// ==================================================
// a3bim2.js – JavaScript completo para o 3º Ano – 2º Bimestre
// Funcionalidades: accordion, progresso, jogo Loop Dash,
// certificados, impressão e interatividade geral.
// ==================================================

(function () {
  "use strict";

  // ==================================================
  // 1. MÓDULO DE PLANOS DE AULA (Accordion + Progresso)
  // ==================================================
  const PlanosModule = {
    STORAGE_KEY: "a3bim2_progresso",
    totalSemanas: 10,
    checkboxes: [],
    barraProgresso: null,
    progressoTexto: null,

    init() {
      this.checkboxes = document.querySelectorAll(".semana-check");
      this.barraProgresso = document.getElementById("barraProgresso");
      this.progressoTexto = document.getElementById("progressoTexto");

      if (!this.checkboxes.length) return;

      this.carregarProgresso();
      this.configurarEventos();
      this.atualizarBarra();

      // Botões expandir/recolher
      const expandirBtn = document.getElementById("expandirTodosBtn");
      const recolherBtn = document.getElementById("recolherTodosBtn");

      if (expandirBtn) {
        expandirBtn.addEventListener("click", () => this.expandirTodos());
      }
      if (recolherBtn) {
        recolherBtn.addEventListener("click", () => this.recolherTodos());
      }

      // Botão imprimir planos
      const imprimirBtn = document.getElementById("imprimirPlanosBtn");
      if (imprimirBtn) {
        imprimirBtn.addEventListener("click", () => this.imprimirPlanos());
      }

      console.log("📚 PlanosModule inicializado");
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
        try {
          const dados = JSON.parse(salvo);
          this.checkboxes.forEach((cb) => {
            const semana = cb.dataset.semana;
            if (semana && dados[semana] !== undefined) {
              cb.checked = dados[semana];
            }
          });
        } catch (e) {
          console.warn("Erro ao carregar progresso:", e);
        }
      }
    },

    salvarProgresso() {
      const dados = {};
      this.checkboxes.forEach((cb) => {
        const semana = cb.dataset.semana;
        if (semana) dados[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dados));
      this.atualizarBarra();
    },

    atualizarBarra() {
      let marcados = 0;
      this.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      const percentual = (marcados / this.totalSemanas) * 100;
      if (this.barraProgresso) {
        this.barraProgresso.style.width = percentual + "%";
        this.barraProgresso.textContent = Math.round(percentual) + "%";
        this.barraProgresso.setAttribute("aria-valuenow", marcados);
      }
      if (this.progressoTexto) {
        this.progressoTexto.textContent = marcados + "/" + this.totalSemanas;
      }
    },

    configurarEventos() {
      this.checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => {
          this.salvarProgresso();
          const semana = cb.dataset.semana || "?";
          const acao = cb.checked ? "✅ Concluída" : "⏳ Reaberta";
          this.mostrarToast(acao + " Semana " + semana, cb.checked ? "success" : "warning");
        });
      });
    },

    expandirTodos() {
      document.querySelectorAll("#accordionAulas .accordion-collapse").forEach((el) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el);
            bsCollapse.show();
          } catch (e) {
            el.classList.add("show");
          }
        } else {
          el.classList.add("show");
        }
      });
      this.mostrarToast("📖 Todos os planos expandidos!", "info");
    },

    recolherTodos() {
      document.querySelectorAll("#accordionAulas .accordion-collapse").forEach((el) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el);
            bsCollapse.hide();
          } catch (e) {
            el.classList.remove("show");
          }
        } else {
          el.classList.remove("show");
        }
      });
      this.mostrarToast("📕 Todos os planos recolhidos!", "info");
    },

    imprimirPlanos() {
      // Seleciona apenas o conteúdo dos accordions
      const accordion = document.getElementById("accordionAulas");
      if (!accordion) return;

      // Pega o conteúdo expandido (ou todo) e prepara para impressão
      const conteudo = accordion.innerHTML;
      const titulo = document.querySelector("#planos-aula .projeto-header")?.innerHTML || "";

      const janela = window.open("", "_blank", "width=1024,height=800,toolbar=yes,scrollbars=yes");
      if (!janela) {
        alert("⚠️ Permita pop-ups para imprimir os planos.");
        return;
      }

      janela.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Planos de Aula - 3º Ano - 2º Bimestre</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
          <link rel="stylesheet" href="a3bim2.css" />
          <style>
            body { background: white; padding: 20px; color: #1e2a1a; }
            .accordion-button { display: none; }
            .accordion-collapse { display: block !important; }
            .accordion-item { border: 1px solid #4a7c3f; margin-bottom: 16px; border-radius: 12px; }
            .accordion-body { background: white !important; color: #1e2a1a !important; }
            .semana-card-completo { background: #f9f9f9 !important; }
            .projeto-header { background: #f0f0f0 !important; border-left-color: #4a7c3f !important; }
            .projeto-header h2 { color: #4a7c3f !important; }
            .badge-projeto { background: #ffb347 !important; color: white !important; }
            .check-concluido { display: none; }
            .btn { display: none; }
            .table-robotica, .tabela-criterios-semana { background: white !important; }
            .table-robotica th, .table-robotica td,
            .tabela-criterios-semana th, .tabela-criterios-semana td {
              color: #1e2a1a !important;
              border-color: #aaa !important;
            }
            .frase-do-dia { background: #f0f0f0 !important; border-color: #4a7c3f !important; color: #1e2a1a !important; }
            .minuto-item { background: #f9f9f9 !important; border-left-color: #4a7c3f !important; }
            .minuto-tempo { background: #e0e0e0 !important; color: #1e2a1a !important; }
            .minuto-descricao { color: #1e2a1a !important; }
            .materiais-container .material-badge { color: #1e2a1a !important; background: #e0e0e0 !important; }
            code { background: #eee; color: #c0392b; padding: 2px 6px; border-radius: 6px; }
            @media print { .accordion-button { display: none !important; } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="projeto-header" style="margin-bottom:20px;">${titulo}</div>
            ${conteudo}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 300);
            };
          <\/script>
        </body>
        </html>
      `);
      janela.document.close();
    },

    mostrarToast(mensagem, tipo) {
      let container = document.querySelector(".toast-container-custom");
      if (!container) {
        container = document.createElement("div");
        container.className = "toast-container-custom";
        container.style.cssText =
          "position:fixed; bottom:20px; right:20px; z-index:9999; display:flex; flex-direction:column; gap:8px;";
        document.body.appendChild(container);
      }
      const id = "toast_" + Date.now();
      const bgColor = tipo === "success" ? "#2ecc71" : tipo === "warning" ? "#f39c12" : "#3498db";
      const toast = document.createElement("div");
      toast.id = id;
      toast.style.cssText = `
        background: #1e2a1a;
        border-left: 4px solid ${bgColor};
        border-radius: 12px;
        padding: 12px 20px;
        color: #e9f5db;
        font-size: 0.85rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
      `;
      toast.innerHTML = `
        <i class="bi ${tipo === "success" ? "bi-check-circle-fill" : tipo === "warning" ? "bi-exclamation-triangle-fill" : "bi-info-circle-fill"}" style="color:${bgColor};"></i>
        <span>${mensagem}</span>
      `;
      container.appendChild(toast);
      setTimeout(() => {
        toast.style.animation = "fadeOutRight 0.3s ease-out";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }
  };

  // ==================================================
  // 2. MÓDULO DO JOGO LOOP DASH 3000
  // ==================================================
  const LoopDashModule = {
    faseAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 1 },
    recordes: { 1: null, 2: null, 3: null },
    loopsExecutados: 0,
    bugsEncontrados: 0,
    executando: false,

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

    init() {
      // Verifica se o jogo está presente na página
      if (!document.getElementById("loopdashGrid")) {
        console.log("⏳ LoopDashModule: jogo não encontrado, ignorando.");
        return;
      }

      console.log("🎮 LoopDashModule: iniciando...");

      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);

      // Botão de reset global
      const btnReset = document.getElementById("btnResetLoopDash");
      if (btnReset) {
        btnReset.addEventListener("click", () => this.resetarRobo());
      }

      console.log("✅ LoopDashModule pronto!");
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

      // Botões de fase
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.dataset.fase) === fase) btn.classList.add("ativo");
      });

      const pista = this.pistas[fase];
      if (this.elementos.faseNomeAtual) {
        this.elementos.faseNomeAtual.textContent = pista.nome;
      }
      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.elementos.faseIconeAtual) {
        this.elementos.faseIconeAtual.textContent = icones[fase];
      }

      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(`🏁 FASE ${fase}: ${pista.nome} selecionada! Monte seu algoritmo.`, "info");
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
      this.executando = false;
    },

    // ---- CONSTRUTOR DE ALGORITMO ----
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
          <input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10" style="width:55px; border-radius:20px; text-align:center;">
          <span class="cartao-texto">vezes</span>
          <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>
        `;

        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";

        const btnAddFilho = document.createElement("button");
        btnAddFilho.innerHTML = "+ adicionar comando";
        btnAddFilho.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
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
          const idxRemover = parseInt(removeBtn.dataset.idx);
          const isFilhoRemover = removeBtn.dataset.isFilho === "true";
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
          const comando = btn.dataset.comando;
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
      this.mostrarMensagem(`🧹 Algoritmo limpo!`, "info");
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

    // ---- EXECUÇÃO DO ALGORITMO ----
    async executarAlgoritmo() {
      if (this.executando) return;
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Você precisa montar um algoritmo primeiro!", "erro");
        return;
      }

      this.executando = true;
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
      this.executando = false;

      if (sucesso && chegou) {
        const totalCartoes = parseInt(this.elementos.cartoesUsados?.textContent || "0");
        const recordeAtual = this.recordes[this.faseAtual];

        if (!recordeAtual || totalCartoes < recordeAtual) {
          this.recordes[this.faseAtual] = totalCartoes;
          this.salvarRecordes();
          this.atualizarRecordeDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${totalCartoes} cartões! NOVO RECORDE! 🏆`,
            "success"
          );
        } else {
          this.mostrarMensagem(`🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${totalCartoes} cartões!`, "success");
        }

        this.loopsExecutados++;
        if (this.elementos.status) this.elementos.status.textContent = "VITÓRIA! 🏆";
        // Dispara evento de vitória (para contadores globais, se houver)
        document.dispatchEvent(new CustomEvent("robo:vitoria"));
      } else {
        this.bugsEncontrados++;
        this.mostrarMensagem(
          `🐛 BUG ENCONTRADO! ${explicacaoErro || "O robô não conseguiu completar o percurso."} Use DICA para melhorar.`,
          "erro"
        );
        if (this.elementos.status) {
          this.elementos.status.textContent = "BUGOU! 💥";
          this.elementos.status.classList.add("text-danger");
        }
        // Dispara evento de bug
        document.dispatchEvent(new CustomEvent("robo:bug", { detail: { incremento: 1, mensagem: "Bug no Loop Dash" } }));
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

    // ---- DICAS E EXEMPLOS ----
    mostrarDica() {
      const dicas = {
        1: "💡 DICA FASE 1: Use um único REPITA 7 vezes com ANDE 1 para percorrer toda a reta!",
        2: "💡 DICA FASE 2: Use REPITA dentro de REPITA para fazer o zigue-zague! Ex: REPITA 2 vezes { ANDE 2, VIRE DIREITA, ANDE 2, VIRE ESQUERDA }",
        3: "💡 DICA FASE 3: Planeje o caminho para desviar dos obstáculos. Use REPITA para repetir padrões de movimento!",
      };
      this.mostrarMensagem(dicas[this.faseAtual] || "💡 Tente usar o cartão REPITA para repetir movimentos!", "info");
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
        this.cartoesAlgoritmo.push(
          { comando: "ande1", filhos: [] },
          { comando: "vireDireita", filhos: [] },
          { comando: "ande1", filhos: [] }
        );
      }

      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`📋 Exemplo carregado para a FASE ${this.faseAtual}!`, "success");
    },

    // ---- RECORDES ----
    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes_a3bim2");
      if (saved) {
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) { }
      }
    },

    salvarRecordes() {
      localStorage.setItem("loopdash_recordes_a3bim2", JSON.stringify(this.recordes));
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

      const valores = [this.recordes[1], this.recordes[2], this.recordes[3]].filter((v) => v !== null);
      const melhor = valores.length > 0 ? Math.min(...valores) : "--";
      if (this.elementos.melhorMarca) {
        this.elementos.melhorMarca.textContent = melhor;
      }
    },

    mostrarMensagem(texto, tipo) {
      if (!this.elementos.mensagem) return;
      this.elementos.mensagem.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      this.elementos.mensagem.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "success" ? "sucesso" : ""}`;
      if (tipo !== "erro") {
        setTimeout(() => {
          if (this.elementos.mensagem) {
            this.elementos.mensagem.className = "mensagem-jogo";
          }
        }, 4000);
      }
    },

    configurarEventos() {
      // Botões de fase
      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.addEventListener("click", () => {
          const fase = parseInt(btn.dataset.fase);
          if (fase) this.carregarFase(fase);
        });
      });

      // Cartões de comando
      document.querySelectorAll(".cartao-comando").forEach((cartao) => {
        cartao.addEventListener("click", () => {
          const comando = cartao.dataset.comando;
          this.adicionarCartao(comando);
        });
      });

      // Botão limpar
      const btnLimpar = document.getElementById("btnLimparAlgoritmo");
      if (btnLimpar) {
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      }

      // Botão executar
      const btnExecutar = document.getElementById("btnExecutarLoopDash");
      if (btnExecutar) {
        btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      }

      // Botão dica
      const btnDica = document.getElementById("btnDicaLoopDash");
      if (btnDica) {
        btnDica.addEventListener("click", () => this.mostrarDica());
      }

      // Botão exemplo
      const btnExemplo = document.getElementById("btnExemploLoopDash");
      if (btnExemplo) {
        btnExemplo.addEventListener("click", () => this.carregarExemplo());
      }
    },
  };

  // ==================================================
  // 3. MÓDULO DE CERTIFICADOS
  // ==================================================
  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "a3bim2_certificados",

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
      if (!document.getElementById("listaAlunos") && !document.querySelector(".cadastro-alunos")) {
        console.log("⏳ CertificadoModule: não encontrado, ignorando.");
        return;
      }

      console.log("🎓 CertificadoModule: inicializando...");
      this.carregarElementos();
      this.carregarAlunos();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      console.log("✅ CertificadoModule pronto!");
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

    carregarAlunos() {
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
        const nome = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreviewAluno.disabled = nome === "[NOME DO ALUNO]" || nome === "";
      }
    },

    adicionarAluno() {
      const input = this.elementos.inputNome;
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
        if (this.elementos.previewNome && this.elementos.previewNome.textContent === nomeRemovido) {
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

      // Eventos para os botões da lista
      listaUl.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.dataset.nome;
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });

      listaUl.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.dataset.index);
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nome, data);
      const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
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
            <h3>🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 3.0</div>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 3.0</div>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 3º Ano</title>
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
      const nome = this.elementos.previewNome?.textContent || "";
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
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
    },
  };

  // ==================================================
  // 4. INICIALIZAÇÃO GERAL
  // ==================================================

  // Adiciona keyframes de animação para os toasts (caso não existam)
  const styleAnim = document.createElement("style");
  styleAnim.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(styleAnim);

  // Inicializa módulos quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      PlanosModule.init();
      LoopDashModule.init();
      CertificadoModule.init();

      // Botão de voltar ao topo (fixo)
      const btnTopo = document.querySelector(".btn-topo-robotico");
      if (btnTopo) {
        btnTopo.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        window.addEventListener("scroll", () => {
          if (window.scrollY > 300) {
            btnTopo.classList.add("visible");
          } else {
            btnTopo.classList.remove("visible");
          }
        });
      }

      console.log("🚀 Todos os módulos inicializados!");
    });
  } else {
    PlanosModule.init();
    LoopDashModule.init();
    CertificadoModule.init();
  }

  // Expor módulos globalmente para depuração
  window.PlanosModule = PlanosModule;
  window.LoopDashModule = LoopDashModule;
  window.CertificadoModule = CertificadoModule;

})();
