// ==================================================
// a1bim1.js - MÓDULO PRINCIPAL
// 1º Ano / 1º Bimestre - Robótica Educacional
// ==================================================

(function () {
  "use strict";

  const A1Bim1Module = {
    inicializado: false,

    // Estado do jogo Loop Dash
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

    // Estado do certificado
    alunos: [],
    STORAGE_KEY_CERT: "robozada_certificados_ano1",
    STORAGE_KEY_PROG: "planoAula_Concluidas_ano1",

    // Elementos DOM
    elementos: {
      // Cabeçalho
      contadorBugs: null,
      relatorioBugs: null,
      // Jogo
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
      // Planos de aula
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
      // Certificado
      inputNome: null,
      btnAdicionar: null,
      listaAlunos: null,
      contadorAlunos: null,
      btnImprimirTodos: null,
      btnPreviewAluno: null,
      previewNome: null,
      previewData: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      console.log("🎮 [A1Bim1Module] Inicializando módulo principal...");

      this.capturarElementos();
      this.configurarCabecalho();
      this.configurarPlanosAula();
      this.configurarJogo();
      this.configurarCertificado();
      this.configurarEventosGlobais();

      this.inicializado = true;
      this.dispararEvento("a1bim1:pronto");
      console.log("✅ [A1Bim1Module] Pronto!");
    },

    // ========== CAPTURA DE ELEMENTOS ==========
    capturarElementos() {
      // Cabeçalho
      this.elementos.contadorBugs = document.getElementById("contadorBugsHeader");
      this.elementos.relatorioBugs = document.getElementById("relatorioBugs");

      // Jogo
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

      // Planos de aula
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");

      // Certificado
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimirTodos = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
    },

    // ========== CABEÇALHO ==========
    configurarCabecalho() {
      let contadorBugs = this.carregarContadorBugs();
      this.atualizarDisplayContador(contadorBugs);
    },

    carregarContadorBugs() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    salvarContadorBugs(valor) {
      try {
        localStorage.setItem("cabecalho_contador_bugs", valor.toString());
      } catch (e) { }
    },

    atualizarDisplayContador(valor) {
      if (this.elementos.contadorBugs) {
        this.elementos.contadorBugs.innerHTML = `🤯 ${valor}`;
      }
      if (this.elementos.relatorioBugs) {
        this.elementos.relatorioBugs.innerText = valor;
      }
    },

    incrementarBugs(incremento = 1) {
      let atual = this.carregarContadorBugs();
      atual += incremento;
      this.salvarContadorBugs(atual);
      this.atualizarDisplayContador(atual);
      this.animarContador();
    },

    animarContador() {
      if (this.elementos.contadorBugs) {
        this.elementos.contadorBugs.style.animation = "piscaLed 0.3s ease-in-out";
        setTimeout(() => {
          if (this.elementos.contadorBugs) {
            this.elementos.contadorBugs.style.animation = "";
          }
        }, 300);
      }
    },

    // ========== PLANOS DE AULA ==========
    configurarPlanosAula() {
      this.carregarProgressoPlanos();
      this.configurarBotoesAccordion();
      this.configurarCheckboxesPlanos();
      this.configurarEfeitosHover();
    },

    carregarProgressoPlanos() {
      const salvo = localStorage.getItem(this.STORAGE_KEY_PROG);
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          this.elementos.checkboxes.forEach((cb, idx) => {
            const semana = cb.getAttribute("data-semana");
            if (semana && concluidas.hasOwnProperty(semana)) {
              cb.checked = concluidas[semana];
            }
          });
        } catch (e) { }
      }
      this.atualizarBarraProgresso();
    },

    salvarProgressoPlanos() {
      const concluidas = {};
      this.elementos.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) {
          concluidas[semana] = cb.checked;
        }
      });
      localStorage.setItem(this.STORAGE_KEY_PROG, JSON.stringify(concluidas));
      this.atualizarBarraProgresso();
    },

    atualizarBarraProgresso() {
      const total = this.elementos.checkboxes.length;
      let marcados = 0;
      this.elementos.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      const percentual = total > 0 ? (marcados / total) * 100 : 0;

      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.textContent = Math.round(percentual) + "%";
      }
      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent = `${marcados}/${total}`;
      }
    },

    configurarBotoesAccordion() {
      const expandirBtn = document.getElementById("expandirTodosBtn");
      const recolherBtn = document.getElementById("recolherTodosBtn");

      if (expandirBtn) {
        expandirBtn.addEventListener("click", () => {
          document.querySelectorAll("#accordionAulas .accordion-collapse").forEach((collapse) => {
            if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
              bootstrap.Collapse.getOrCreateInstance(collapse).show();
            } else {
              collapse.classList.add("show");
            }
          });
        });
      }

      if (recolherBtn) {
        recolherBtn.addEventListener("click", () => {
          document.querySelectorAll("#accordionAulas .accordion-collapse").forEach((collapse) => {
            if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
              bootstrap.Collapse.getOrCreateInstance(collapse).hide();
            } else {
              collapse.classList.remove("show");
            }
          });
        });
      }
    },

    configurarCheckboxesPlanos() {
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => {
          this.salvarProgressoPlanos();
          const semana = cb.getAttribute("data-semana");
          const acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
          this.mostrarToast(`${acao} Semana ${semana}`, cb.checked ? "success" : "warning");
        });
      });
    },

    configurarEfeitosHover() {
      const cards = document.querySelectorAll(".accordion-item");
      cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.transform = "translateY(-2px)";
          card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
          card.style.boxShadow = "";
        });
      });
    },

    // ========== JOGO LOOP DASH ==========
    configurarJogo() {
      this.carregarRecordes();
      this.carregarFase(1);
      this.configurarEventosJogo();
    },

    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes_ano1");
      if (saved) {
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) { }
      }
    },

    salvarRecordes() {
      localStorage.setItem("loopdash_recordes_ano1", JSON.stringify(this.recordes));
    },

    carregarFase(fase) {
      this.faseAtual = fase;
      this.cartoesAlgoritmo = [];
      this.resetarRobo();

      document.querySelectorAll(".btn-phase").forEach((btn) => {
        btn.classList.remove("ativo");
        if (parseInt(btn.getAttribute("data-fase")) === fase) {
          btn.classList.add("ativo");
        }
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
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(`🏁 FASE ${fase}: ${this.pistas[fase].nome} selecionada!`, "info");
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
      this.mostrarMensagem(`➕ Cartão adicionado!`, "info");
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
    },

    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Você precisa montar um algoritmo primeiro!", "erro");
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
          this.mostrarMensagem(`🎉 PARABÉNS! NOVO RECORDE! 🏆`, "success");
        } else {
          this.mostrarMensagem(`🎉 PARABÉNS! Completou a FASE ${this.faseAtual}!`, "success");
        }

        this.loopsExecutados++;
        if (this.elementos.status) this.elementos.status.textContent = "VITÓRIA! 🏆";
      } else {
        this.bugsEncontrados++;
        this.incrementarBugs(1);
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
            await this.delay(200);
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
      await this.delay(200);
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

    mostrarDica() {
      const dicas = {
        1: "💡 DICA: Use um único REPITA 7 vezes com ANDE 1 para percorrer toda a reta!",
        2: "💡 DICA: Use REPITA dentro de REPITA para fazer o zigue-zague!",
        3: "💡 DICA: Planeje o caminho para desviar dos obstáculos!",
      };
      this.mostrarMensagem(dicas[this.faseAtual], "info");
    },

    carregarExemplo() {
      this.cartoesAlgoritmo = [];

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
      this.mostrarMensagem(`📋 Exemplo carregado!`, "success");
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

    configurarEventosJogo() {
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
      if (btnLimpar) {
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      }

      const btnExecutar = document.getElementById("btnExecutarLoopDash");
      const btnReset = document.getElementById("btnResetLoopDash");
      const btnDica = document.getElementById("btnDicaLoopDash");
      const btnExemplo = document.getElementById("btnExemploLoopDash");

      if (btnExecutar) btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset) btnReset.addEventListener("click", () => this.resetarRobo());
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo) btnExemplo.addEventListener("click", () => this.carregarExemplo());
    },

    // ========== CERTIFICADO ==========
    configurarCertificado() {
      this.carregarAlunosDoStorage();
      this.atualizarListaAlunos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.configurarEventosCertificado();
    },

    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY_CERT);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      }
      if (this.alunos.length === 0) {
        this.alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA", "MARIA CLARA SILVA"];
        this.salvarAlunos();
      }
    },

    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY_CERT, JSON.stringify(this.alunos));
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
      this.atualizarListaAlunos();

      this.elementos.inputNome.value = "";
      this.elementos.inputNome.focus();

      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarListaAlunos();

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

    atualizarListaAlunos() {
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
        btn.addEventListener("click", (e) => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });

      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = this.gerarHtmlCertificado(nomeAluno, dataAtual);

      const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
      }
    },

    gerarHtmlCertificado(nome, data) {
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
            <h3>🏆 CERTIFICADO DE ROBÓTICA - 1º ANO</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>1º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 🤖 ROBÔ SUCATA | 🐛 DEPURAÇÃO</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Loop não é macarrão! Repetir é preciso!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 1.0</div>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE ROBÓTICA - 1º ANO</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>1º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 🤖 ROBÔ SUCATA | 🐛 DEPURAÇÃO</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Loop não é macarrão! Repetir é preciso!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 1.0</div>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 1º Ano</title>
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

    configurarEventosCertificado() {
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

    // ========== TOAST ==========
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
          animation: slideInRight 0.3s ease-out;
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

    // ========== EVENTOS GLOBAIS ==========
    configurarEventosGlobais() {
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
        @keyframes flutuarBadge {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        .badge-projeto { display: inline-block; }
      `;
      document.head.appendChild(style);
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

    dispararEvento(nome, detalhes = {}) {
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  // Registra no controlador
  if (window.Controlador && typeof window.Controlador.registrarModulo === "function") {
    window.Controlador.registrarModulo("a1bim1", A1Bim1Module);
  }

  window.A1Bim1Module = A1Bim1Module;

  if (!window.Controlador) {
    document.addEventListener("DOMContentLoaded", () => A1Bim1Module.init());
  }
})();
