// ==================================================
// a1bim3.js - Arquivo JS unificado para Robótica 1º ano Bimestre 3
// Módulos: Planos de Aula, Certificado, Jogo Loop Dash (corrigido), Rodapé, Menu
// ==================================================

(function () {
  "use strict";

  // ========== 1. MÓDULO PLANOS DE AULA ==========
  const PlanosAulaModule = {
    STORAGE_KEY: "planoAula_Concluidas_1ano_bim3",
    init() {
      if (document.getElementById("accordionAulas")) {
        this.capturarElementos();
        this.configurarEventos();
        this.carregarProgresso();
      }
    },
    capturarElementos() {
      this.checkboxes = document.querySelectorAll(".semana-check");
      this.totalSemanas = this.checkboxes.length || 10;
    },
    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb, idx) => {
        const semana = cb.getAttribute("data-semana") || (idx + 1).toString();
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
      this.atualizarBarraProgresso();
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          this.checkboxes.forEach((cb, idx) => {
            const semana =
              cb.getAttribute("data-semana") || (idx + 1).toString();
            if (concluidas.hasOwnProperty(semana))
              cb.checked = concluidas[semana];
          });
        } catch (e) {}
      }
      this.atualizarBarraProgresso();
    },
    atualizarBarraProgresso() {
      let marcados = 0;
      this.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      const percentual = (marcados / this.totalSemanas) * 100;
      const barra = document.getElementById("barraProgresso");
      if (barra) barra.style.width = percentual + "%";
      const texto = document.getElementById("progressoTexto");
      if (texto) texto.textContent = `${marcados}/${this.totalSemanas}`;
    },
    configurarEventos() {
      this.checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => this.salvarProgresso());
      });
      const expandirBtn = document.getElementById("expandirTodosBtn");
      const recolherBtn = document.getElementById("recolherTodosBtn");
      if (expandirBtn) {
        expandirBtn.addEventListener("click", () => {
          document
            .querySelectorAll("#accordionAulas .accordion-collapse")
            .forEach((c) => {
              if (typeof bootstrap !== "undefined")
                bootstrap.Collapse.getOrCreateInstance(c).show();
              else c.classList.add("show");
            });
        });
      }
      if (recolherBtn) {
        recolherBtn.addEventListener("click", () => {
          document
            .querySelectorAll("#accordionAulas .accordion-collapse")
            .forEach((c) => {
              if (typeof bootstrap !== "undefined")
                bootstrap.Collapse.getOrCreateInstance(c).hide();
              else c.classList.remove("show");
            });
        });
      }
    },
  };

  // ========== 2. MÓDULO CERTIFICADO ==========

  const CertificadoModule = {
    STORAGE_KEY: "robozada_certificados_ano1_bim3",
    alunos: [],
    init() {
      console.log("🔧 Inicializando CertificadoModule");
      if (document.getElementById("listaAlunos")) {
        this.carregarElementos();
        this.carregarAlunosDoStorage();
        this.atualizarLista();
        this.configurarEventos();
        this.atualizarPreviewData();
      } else {
        console.warn("Elemento listaAlunos não encontrado");
      }
    },
    carregarElementos() {
      this.inputNome = document.getElementById("nomeAluno");
      this.btnAdicionar = document.getElementById("btnAdicionar");
      this.listaAlunos = document.getElementById("listaAlunos");
      this.contadorAlunos = document.getElementById("contadorAlunos");
      this.btnImprimirTodos = document.getElementById(
        "btnImprimirCertificados",
      );
      this.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.previewNome = document.getElementById("previewNomeAluno");
      this.previewData = document.getElementById("previewData");
      console.log("Elementos capturados:", {
        btnImprimir: this.btnImprimirTodos,
      });
    },
    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      this.alunos = salvos ? JSON.parse(salvos) : [];
      if (this.alunos.length === 0) {
        // Dados de exemplo
        this.alunos = [
          "ANA BEATRIZ SANTOS",
          "LUCAS MARTINS FERREIRA",
          "MARIA CLARA SILVA",
        ];
        this.salvarAlunos();
      }
      console.log("Alunos carregados:", this.alunos);
    },
    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
    },
    atualizarPreviewData() {
      if (this.previewData)
        this.previewData.textContent = new Date().toLocaleDateString("pt-BR");
    },
    atualizarLista() {
      if (!this.listaAlunos) return;
      if (this.alunos.length === 0) {
        this.listaAlunos.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado 🤖</li>';
        if (this.contadorAlunos) this.contadorAlunos.textContent = "0";
        if (this.btnImprimirTodos) this.btnImprimirTodos.disabled = true;
        return;
      }
      let html = "";
      this.alunos.forEach((aluno, idx) => {
        html += `<li class="d-flex justify-content-between align-items-center mb-2 p-2 rounded-3" style="background:#2c3e2b;">
        <span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
        <div class="btn-group gap-1">
          <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
          <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
        </div>
      </li>`;
      });
      this.listaAlunos.innerHTML = html;
      if (this.contadorAlunos)
        this.contadorAlunos.textContent = this.alunos.length;
      if (this.btnImprimirTodos) this.btnImprimirTodos.disabled = false; // HABILITAR BOTÃO

      // Eventos dos botões de selecionar e remover
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.getAttribute("data-nome");
          if (nome && this.previewNome) this.previewNome.textContent = nome;
          if (this.btnPreviewAluno) this.btnPreviewAluno.disabled = false;
        });
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) {
            if (confirm(`Remover ${this.alunos[idx]}?`)) {
              this.alunos.splice(idx, 1);
              this.salvarAlunos();
              this.atualizarLista();
              if (
                this.previewNome &&
                this.previewNome.textContent === this.alunos[idx]
              )
                this.previewNome.textContent = "[NOME DO ALUNO]";
            }
          }
        });
      });
    },
    escapeHtml(texto) {
      return texto.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    },
    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${nome}</title><style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Courier New',monospace;background:#e0e0e0;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;}
      .certificado{border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:30px;text-align:center;background:#fffef7;max-width:800px;margin:auto;}
      h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;}
      .nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}
      @media print{body{background:white;} .certificado{box-shadow:none;} @page{size:A4;margin:1.5cm;}}
    </style></head><body><div class="certificado"><h3>🏆 CERTIFICADO DE MESTRE DO LOOP - 1º ANO BIM3</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong><p>concluiu com êxito o <strong>1º ANO - ROBÓTICA EDUCACIONAL (BIMESTRE 3)</strong><br>🔁 LOOP | ⚖️ CONDICIONAL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p><hr><p>RobôMestres do Paraná • ${data}</p><p style="font-size:11px;">"SE você aprendeu, ENTÃO merece! SENÃO, tente de novo!"</p></div><script>window.print();<\/script></body></html>`;
      const win = window.open("", "_blank", "width=800,height=600");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else
        alert(
          "⚠️ Pop-up bloqueado! Permita pop-ups para este site e tente novamente.",
        );
    },
    imprimirTodos() {
      console.log("🖨️ Função imprimirTodos chamada. Alunos:", this.alunos);
      if (!this.alunos || this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione alunos antes de imprimir.");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `
        <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid; margin:0 auto; width:100%; box-sizing:border-box;">
          <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.8rem; margin-bottom:10px;">🏆 CERTIFICADO DE MESTRE DO LOOP</h3>
          <p style="color:#4a6e2c;">Certificamos que</p>
          <strong style="display:block; background:#fff0cc; padding:8px; border-radius:40px; font-size:1rem;">${this.escapeHtml(aluno)}</strong>
          <p style="color:#4a6e2c; margin-top:10px;">concluiu o <strong>1º ANO - ROBÓTICA EDUCACIONAL (BIMESTRE 3)</strong><br>🔁 LOOP | ⚖️ CONDICIONAL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
          <hr style="margin:12px 0; border:1px solid #ffb347;">
          <p style="font-size:0.7rem;">RobôMestres do Paraná • ${dataAtual}</p>
          <p style="font-size:0.6rem; font-style:italic;">"SE você aprendeu, ENTÃO merece! SENÃO, tente de novo!"</p>
        </div>
      `;
      });
      const htmlLote = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Certificados RobôMestres - Turma</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Courier New', monospace; 
          background: white; 
          padding: 20px; 
          margin: 0;
        }
        .print-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          align-items: start;
        }
        .certificado-impressao {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        @media print {
          body { padding: 0; margin: 0; background: white; }
          .print-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 0;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-grid">
        ${cardsHTML}
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          }, 300);
        };
      <\/script>
    </body>
    </html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
        console.log("✅ Janela de impressão aberta");
      } else {
        alert(
          "⚠️ Pop-up bloqueado! Por favor, permita pop-ups para este site e clique novamente.",
        );
      }
    },
    configurarEventos() {
      if (this.btnAdicionar) {
        this.btnAdicionar.addEventListener("click", () => {
          let nome = this.inputNome?.value.trim();
          if (!nome) {
            alert("Digite um nome!");
            return;
          }
          nome = nome.toUpperCase();
          if (this.alunos.includes(nome)) {
            alert("Aluno já cadastrado!");
            return;
          }
          this.alunos.push(nome);
          this.salvarAlunos();
          this.atualizarLista();
          if (this.inputNome) this.inputNome.value = "";
          console.log("Aluno adicionado, total:", this.alunos.length);
        });
      }
      if (this.btnImprimirTodos) {
        // Remove qualquer listener anterior para evitar duplicação
        this.btnImprimirTodos.removeEventListener(
          "click",
          this.imprimirTodosHandler,
        );
        this.imprimirTodosHandler = () => this.imprimirTodos();
        this.btnImprimirTodos.addEventListener(
          "click",
          this.imprimirTodosHandler,
        );
        console.log("Evento de clique conectado ao botão imprimir");
      }
      if (this.btnPreviewAluno) {
        this.btnPreviewAluno.addEventListener("click", () => {
          const nome = this.previewNome?.textContent;
          if (!nome || nome === "[NOME DO ALUNO]")
            alert("Selecione um aluno na lista primeiro!");
          else this.gerarCertificadoUnico(nome);
        });
      }
    },
  };
  // ========== 3. MÓDULO JOGO LOOP DASH (CORRIGIDO - REPITA FUNCIONAL) ==========
  const LoopDashModule = {
    faseAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 1 },
    recordes: { 1: null, 2: null, 3: null },
    pistas: {
      1: {
        nome: "RETA 🏁",
        grid: [["🚶", "⬜", "⬜", "⬜", "⬜", "⬜", "⬜", "🏁"]],
        inicio: { x: 0, y: 0 },
        linhas: 1,
        colunas: 8,
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
        linhas: 5,
        colunas: 5,
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
        linhas: 6,
        colunas: 6,
      },
    },
    init() {
      if (document.getElementById("loopdashGrid")) {
        this.carregarRecordes();
        this.capturarElementos();
        this.configurarEventos();
        this.carregarFase(1);
      }
    },
    capturarElementos() {
      this.gridDiv = document.getElementById("loopdashGrid");
      this.cartoesUsadosSpan = document.getElementById("loopdashCartoes");
      this.melhorMarcaSpan = document.getElementById("loopdashMelhor");
      this.statusSpan = document.getElementById("loopdashStatus");
      this.bonusSpan = document.getElementById("loopdashBonus");
      this.algoritmoDiv = document.getElementById("algoritmoMontado");
      this.mensagemDiv = document.getElementById("loopdashMensagem");
      this.faseNomeSpan = document.getElementById("faseNomeAtual");
      this.faseIconeSpan = document.getElementById("faseIconeAtual");
      this.recordeFase1 = document.getElementById("recordeFase1");
      this.recordeFase2 = document.getElementById("recordeFase2");
      this.recordeFase3 = document.getElementById("recordeFase3");
    },
    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes_bim3");
      if (saved) this.recordes = JSON.parse(saved);
    },
    salvarRecordes() {
      localStorage.setItem(
        "loopdash_recordes_bim3",
        JSON.stringify(this.recordes),
      );
    },
    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();
      if (this.faseNomeSpan)
        this.faseNomeSpan.textContent = this.pistas[fase].nome;
      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.faseIconeSpan) this.faseIconeSpan.textContent = icones[fase];
      this.desenharGrid();
      this.atualizarRecordesDisplay();
      this.mostrarMensagem(
        `FASE ${fase}: ${this.pistas[fase].nome} selecionada! Monte seu algoritmo.`,
      );
    },
    desenharGrid() {
      if (!this.gridDiv) return;
      const p = this.pistas[this.faseAtual];
      this.gridDiv.className = `loopdash-grid fase${this.faseAtual}`;
      this.gridDiv.innerHTML = "";
      for (let l = 0; l < p.linhas; l++) {
        for (let c = 0; c < p.colunas; c++) {
          const celula = p.grid[l][c] || "⬜";
          const cell = document.createElement("div");
          cell.className = "loopdash-cell";
          if (celula === "🧱") cell.classList.add("wall");
          else if (celula === "🏁") cell.classList.add("target");
          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c)
            cell.classList.add("robot");
          else if (celula === "⬜" || celula === "🚶")
            cell.classList.add("path");
          this.gridDiv.appendChild(cell);
        }
      }
    },
    resetarRobo() {
      const p = this.pistas[this.faseAtual];
      this.posicaoRobo = { x: p.inicio.x, y: p.inicio.y, direcao: 1 };
      this.desenharGrid();
      if (this.statusSpan) this.statusSpan.textContent = "PRONTO";
    },
    limparAlgoritmo() {
      this.cartoesAlgoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
    },
    renderizarAlgoritmo() {
      if (!this.algoritmoDiv) return;
      if (this.cartoesAlgoritmo.length === 0) {
        this.algoritmoDiv.innerHTML =
          '<div class="placeholder-algoritmo">🃏 Clique nos cartões abaixo para montar seu algoritmo...</div>';
        return;
      }
      this.algoritmoDiv.innerHTML = "";
      this.cartoesAlgoritmo.forEach((cmd, idx) => {
        const div = document.createElement("div");
        div.className = "cartao-montado";
        if (cmd.comando === "repita") {
          div.classList.add("repita-container");
          div.setAttribute("data-idx", idx);
          // Cabeçalho do REPITA
          const header = document.createElement("div");
          header.className = "repita-header";
          header.innerHTML = `<span>🔄 REPITA</span><input type="number" class="repita-contador-input" value="${cmd.contador || 3}" min="1" max="10" style="width:55px;"><span>vezes</span><button class="btn-remover-cartao" data-idx="${idx}">✖️</button>`;
          const input = header.querySelector(".repita-contador-input");
          input.addEventListener("change", (e) => {
            cmd.contador = parseInt(e.target.value);
            this.atualizarContadorCartoes();
          });
          // Container dos filhos
          const filhosDiv = document.createElement("div");
          filhosDiv.className = "repita-filhos";
          // Botão para adicionar comando dentro do loop
          const btnAdd = document.createElement("button");
          btnAdd.textContent = "+ adicionar comando";
          btnAdd.style.cssText =
            "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; margin:8px 0; cursor:pointer; font-size:0.7rem;";
          btnAdd.addEventListener("click", (e) => {
            e.stopPropagation();
            this.mostrarSelecaoComandoParaRepita(cmd, idx);
          });
          filhosDiv.appendChild(btnAdd);
          // Exibir filhos existentes
          if (cmd.filhos && cmd.filhos.length) {
            cmd.filhos.forEach((filho, fIdx) => {
              const filhoDiv = document.createElement("div");
              filhoDiv.className = "cartao-montado";
              filhoDiv.style.margin = "4px 0";
              filhoDiv.innerHTML = `<span>${this.getIconeComando(filho.comando)} ${this.getNomeComando(filho.comando)}</span><button class="btn-remover-filho" data-pai-idx="${idx}" data-filho-idx="${fIdx}" style="background:#e74c3c; border:none; border-radius:50%; width:20px; height:20px; color:white;">✖️</button>`;
              filhosDiv.appendChild(filhoDiv);
            });
          }
          div.appendChild(header);
          div.appendChild(filhosDiv);
        } else {
          div.innerHTML = `<span>${this.getIconeComando(cmd.comando)} ${this.getNomeComando(cmd.comando)}</span><button class="btn-remover-cartao" data-idx="${idx}" style="background:#e74c3c; border:none; border-radius:50%; width:20px; height:20px; color:white;">✖️</button>`;
        }
        this.algoritmoDiv.appendChild(div);
      });
      // Eventos de remoção (escopo global após renderização)
      document.querySelectorAll(".btn-remover-cartao").forEach((btn) => {
        btn.removeEventListener("click", this.handleRemoveCartao);
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          if (!isNaN(idx)) {
            this.cartoesAlgoritmo.splice(idx, 1);
            this.renderizarAlgoritmo();
            this.atualizarContadorCartoes();
          }
        });
      });
      document.querySelectorAll(".btn-remover-filho").forEach((btn) => {
        btn.removeEventListener("click", this.handleRemoveFilho);
        btn.addEventListener("click", (e) => {
          const paiIdx = parseInt(btn.getAttribute("data-pai-idx"));
          const filhoIdx = parseInt(btn.getAttribute("data-filho-idx"));
          if (
            !isNaN(paiIdx) &&
            !isNaN(filhoIdx) &&
            this.cartoesAlgoritmo[paiIdx] &&
            this.cartoesAlgoritmo[paiIdx].filhos
          ) {
            this.cartoesAlgoritmo[paiIdx].filhos.splice(filhoIdx, 1);
            this.renderizarAlgoritmo();
            this.atualizarContadorCartoes();
          }
        });
      });
    },
    getIconeComando(comando) {
      const map = {
        ande1: "🚶",
        ande2: "🏃",
        vireDireita: "▶️",
        vireEsquerda: "◀️",
        repita: "🔄",
      };
      return map[comando] || "❓";
    },
    getNomeComando(comando) {
      const map = {
        ande1: "ANDE 1",
        ande2: "ANDE 2",
        vireDireita: "VIRE DIREITA",
        vireEsquerda: "VIRE ESQUERDA",
        repita: "REPITA",
      };
      return map[comando] || comando;
    },
    mostrarSelecaoComandoParaRepita(cmdRepita, paiIdx) {
      const opcoes = [
        { comando: "ande1", nome: "ANDE 1", icone: "🚶" },
        { comando: "ande2", nome: "ANDE 2", icone: "🏃" },
        { comando: "vireDireita", nome: "VIRE DIREITA", icone: "▶️" },
        { comando: "vireEsquerda", nome: "VIRE ESQUERDA", icone: "◀️" },
      ];
      let modalHtml = `<div id="modalComando" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;">
        <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:400px;">
          <h3 style="color:#ffb347;">➕ Adicionar comando ao REPITA</h3>
          <div style="display:flex; flex-wrap:wrap; gap:12px; margin:20px 0;">`;
      opcoes.forEach((op) => {
        modalHtml += `<button class="btn-cmd-opcao" data-comando="${op.comando}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:12px; cursor:pointer;">
          <div style="font-size:2rem;">${op.icone}</div><div style="color:#ffb347;">${op.nome}</div></button>`;
      });
      modalHtml += `</div><button id="btnFecharModal" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; color:white; cursor:pointer;">FECHAR</button>
        </div></div>`;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComando");
      document.querySelectorAll(".btn-cmd-opcao").forEach((btn) => {
        btn.addEventListener("click", () => {
          const comando = btn.getAttribute("data-comando");
          if (!cmdRepita.filhos) cmdRepita.filhos = [];
          cmdRepita.filhos.push({ comando: comando });
          this.renderizarAlgoritmo();
          this.atualizarContadorCartoes();
          if (modal) modal.remove();
        });
      });
      const fechar = document.getElementById("btnFecharModal");
      if (fechar) fechar.addEventListener("click", () => modal?.remove());
    },
    adicionarCartao(comando) {
      if (comando === "repita") {
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 3,
          filhos: [],
        });
      } else {
        this.cartoesAlgoritmo.push({ comando: comando });
      }
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
    },
    atualizarContadorCartoes() {
      const contar = (arr) => {
        let total = 0;
        for (const item of arr) {
          total++;
          if (item.comando === "repita" && item.filhos)
            total += contar(item.filhos);
        }
        return total;
      };
      const total = contar(this.cartoesAlgoritmo);
      if (this.cartoesUsadosSpan) this.cartoesUsadosSpan.textContent = total;
      let temLoopAninhado = false;
      const verificar = (arr) => {
        for (const item of arr) {
          if (item.comando === "repita" && item.filhos) {
            for (const f of item.filhos)
              if (f.comando === "repita") temLoopAninhado = true;
            verificar(item.filhos);
          }
        }
      };
      verificar(this.cartoesAlgoritmo);
      if (this.bonusSpan)
        this.bonusSpan.textContent = temLoopAninhado
          ? "⭐ LOOPCEPTION! ⭐"
          : "---";
    },
    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", true);
        return;
      }
      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando algoritmo...");
      if (this.statusSpan) this.statusSpan.textContent = "EXECUTANDO...";
      let sucesso = true;
      let erroMsg = "";
      for (const cmd of this.cartoesAlgoritmo) {
        const res = await this.executarComando(cmd);
        if (!res.sucesso) {
          sucesso = false;
          erroMsg = res.erro;
          break;
        }
      }
      const chegou = this.verificarChegada();
      if (sucesso && chegou) {
        const total = parseInt(this.cartoesUsadosSpan?.textContent || "0");
        const recordeAtual = this.recordes[this.faseAtual];
        if (!recordeAtual || total < recordeAtual) {
          this.recordes[this.faseAtual] = total;
          this.salvarRecordes();
          this.atualizarRecordesDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! NOVO RECORDE com ${total} cartões!`,
          );
        } else {
          this.mostrarMensagem(`🎉 Completou a fase com ${total} cartões!`);
        }
        if (this.statusSpan) this.statusSpan.textContent = "VITÓRIA! 🏆";
        document.dispatchEvent(new CustomEvent("robo:vitoria"));
      } else {
        this.mostrarMensagem(
          `🐛 BUG! ${erroMsg || "Robô não chegou ao fim."}`,
          true,
        );
        if (this.statusSpan) this.statusSpan.textContent = "BUGOU! 💥";
        document.dispatchEvent(
          new CustomEvent("robo:bug", {
            detail: { incremento: 1, mensagem: erroMsg },
          }),
        );
      }
    },
    async executarComando(cmd) {
      if (cmd.comando === "repita") {
        const vezes = cmd.contador || 3;
        for (let i = 0; i < vezes; i++) {
          for (const filho of cmd.filhos || []) {
            const res = await this.executarComando(filho);
            if (!res.sucesso) return res;
            await this.delay(200);
            this.desenharGrid();
          }
        }
        return { sucesso: true };
      }
      const p = this.pistas[this.faseAtual];
      let nx = this.posicaoRobo.x,
        ny = this.posicaoRobo.y;
      switch (cmd.comando) {
        case "ande1":
          if (this.posicaoRobo.direcao === 0) nx--;
          else if (this.posicaoRobo.direcao === 1) ny++;
          else if (this.posicaoRobo.direcao === 2) nx++;
          else ny--;
          break;
        case "ande2":
          if (this.posicaoRobo.direcao === 0) nx -= 2;
          else if (this.posicaoRobo.direcao === 1) ny += 2;
          else if (this.posicaoRobo.direcao === 2) nx += 2;
          else ny -= 2;
          break;
        case "vireDireita":
          this.posicaoRobo.direcao = (this.posicaoRobo.direcao + 1) % 4;
          return { sucesso: true };
        case "vireEsquerda":
          this.posicaoRobo.direcao = (this.posicaoRobo.direcao - 1 + 4) % 4;
          return { sucesso: true };
        default:
          return { sucesso: false, erro: "Comando inválido" };
      }
      if (nx < 0 || nx >= p.linhas || ny < 0 || ny >= p.colunas)
        return { sucesso: false, erro: "Saiu da pista!" };
      if (p.grid[nx][ny] === "🧱")
        return { sucesso: false, erro: "Bateu em obstáculo!" };
      this.posicaoRobo.x = nx;
      this.posicaoRobo.y = ny;
      await this.delay(200);
      this.desenharGrid();
      return { sucesso: true };
    },
    verificarChegada() {
      const p = this.pistas[this.faseAtual];
      return p.grid[this.posicaoRobo.x][this.posicaoRobo.y] === "🏁";
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    mostrarMensagem(msg, isErro = false) {
      if (this.mensagemDiv) {
        this.mensagemDiv.innerHTML = `<i class="bi bi-robot"></i> ${msg}`;
        this.mensagemDiv.className = `mensagem-jogo ${isErro ? "erro" : ""}`;
        setTimeout(() => {
          if (this.mensagemDiv) this.mensagemDiv.className = "mensagem-jogo";
        }, 3000);
      }
    },
    atualizarRecordesDisplay() {
      if (this.recordeFase1)
        this.recordeFase1.textContent = this.recordes[1] || "---";
      if (this.recordeFase2)
        this.recordeFase2.textContent = this.recordes[2] || "---";
      if (this.recordeFase3)
        this.recordeFase3.textContent = this.recordes[3] || "---";
      const melhor = Math.min(
        ...[this.recordes[1], this.recordes[2], this.recordes[3]].filter(
          (v) => v !== null,
        ),
      );
      if (this.melhorMarcaSpan)
        this.melhorMarcaSpan.textContent = melhor !== Infinity ? melhor : "--";
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
          if (comando) this.adicionarCartao(comando);
        });
      });
      document
        .getElementById("btnLimparAlgoritmo")
        ?.addEventListener("click", () => this.limparAlgoritmo());
      document
        .getElementById("btnExecutarLoopDash")
        ?.addEventListener("click", () => this.executarAlgoritmo());
      document
        .getElementById("btnResetLoopDash")
        ?.addEventListener("click", () => this.resetarRobo());
      document
        .getElementById("btnDicaLoopDash")
        ?.addEventListener("click", () => {
          const dicas = {
            1: "Use REPITA 7 vezes ANDE 1!",
            2: "Use REPITA aninhado para zigue-zague.",
            3: "Planeje desvios com condicionais implícitas.",
          };
          this.mostrarMensagem(
            `💡 DICA: ${dicas[this.faseAtual] || "Use REPITA para repetir comandos!"}`,
          );
        });
      document
        .getElementById("btnExemploLoopDash")
        ?.addEventListener("click", () => {
          this.limparAlgoritmo();
          if (this.faseAtual === 1) {
            this.cartoesAlgoritmo.push({
              comando: "repita",
              contador: 7,
              filhos: [{ comando: "ande1" }],
            });
          } else if (this.faseAtual === 2) {
            this.cartoesAlgoritmo.push({
              comando: "repita",
              contador: 2,
              filhos: [
                { comando: "ande2" },
                { comando: "vireDireita" },
                { comando: "ande2" },
                { comando: "vireEsquerda" },
              ],
            });
          } else {
            this.cartoesAlgoritmo = [
              { comando: "ande1" },
              { comando: "vireDireita" },
              { comando: "ande1" },
            ];
          }
          this.renderizarAlgoritmo();
          this.atualizarContadorCartoes();
        });
    },
  };

  // ========== 4. MÓDULO RODAPÉ ==========
  const RodapeModule = {
    init() {
      const relatorio = document.getElementById("relatorioBugs");
      if (relatorio) {
        this.atualizarContador();
        document.addEventListener("robo:bug", () => this.atualizarContador());
        document.addEventListener("robo:resetBugs", () =>
          this.atualizarContador(),
        );
      }
    },
    atualizarContador() {
      const contador = localStorage.getItem("cabecalho_contador_bugs");
      let bugs = contador ? parseInt(contador) : 0;
      const relatorio = document.getElementById("relatorioBugs");
      if (relatorio) relatorio.innerHTML = `🐛 BUGS ENCONTRADOS: ${bugs}`;
    },
  };

  // ========== 5. MÓDULO MENU (highlight da página atual) ==========
  const MenuModule = {
    highlightCurrentPage() {
      const currentPath =
        window.location.pathname.split("/").pop() || "a1index.html";
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
        "%c🤖 ROBOZADA 3000 - MENU BIMESTRAL ATIVO",
        "color: #ffb347; font-size: 14px; font-family: monospace;",
      );
      console.log(
        "%c🔁 Loop não é macarrão! Variável não é coisa de velho! Depurar não é xingamento!",
        "color: #9bbc7b;",
      );
    },
    initTooltips() {
      const devEmails = document.querySelectorAll(".dev-contato a");
      if (devEmails.length) {
        devEmails.forEach((email) => {
          email.setAttribute("title", "Clique para enviar e-mail");
          email.style.cursor = "pointer";
        });
      }
    },
    init() {
      this.highlightCurrentPage();
      this.consoleWelcome();
      this.initTooltips();
    },
  };

  // ========== INICIALIZAÇÃO GERAL ==========
  document.addEventListener("DOMContentLoaded", () => {
    PlanosAulaModule.init();
    CertificadoModule.init();
    LoopDashModule.init();
    RodapeModule.init();
    MenuModule.init(); // NOVO: ativa funcionalidades do menu
    window.CabecalhoModule = {
      incrementarBugs: (inc = 1) => {
        let atual = parseInt(
          localStorage.getItem("cabecalho_contador_bugs") || "0",
        );
        atual += inc;
        localStorage.setItem("cabecalho_contador_bugs", atual);
        document.dispatchEvent(new CustomEvent("robo:bug"));
      },
    };
  });
})();
