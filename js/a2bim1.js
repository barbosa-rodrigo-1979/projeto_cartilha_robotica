// ==================================================
// a2bim1.js – 2º Ano / 1º Bimestre
// Funcionalidades: jogo LOOP DASH, certificado, checkboxes de planos de aula,
// animações e integração com localStorage
// Baseado nos anexos: modelo_fechamento_bimestre.js, modelo_certificado.js, modelo_planos_aula.js
// ==================================================

(function () {
  "use strict";

  // ==================== MÓDULO: PLANOS DE AULA (checkboxes e progresso) ====================
  const PlanosModule = {
    STORAGE_KEY: "planoAula_Concluidas_2ano",
    totalSemanas: 10,
    init() {
      this.carregarProgresso();
      this.configurarEventos();
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      const checkboxes = document.querySelectorAll(".semana-check");
      if (checkboxes.length) this.totalSemanas = checkboxes.length;
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          checkboxes.forEach((cb, idx) => {
            const semana = cb.getAttribute("data-semana");
            if (semana && concluidas[semana]) cb.checked = true;
            else if (concluidas[`semana_${idx + 1}`]) cb.checked = true;
          });
        } catch (e) {}
      }
      this.atualizarBarraProgresso(); // opcional, se existir barra
    },
    salvarProgresso() {
      const concluidas = {};
      document.querySelectorAll(".semana-check").forEach((cb) => {
        const semana =
          cb.getAttribute("data-semana") ||
          `semana_${Array.from(document.querySelectorAll(".semana-check")).indexOf(cb) + 1}`;
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },
    atualizarBarraProgresso() {
      const barra = document.getElementById("barraProgresso");
      const texto = document.getElementById("progressoTexto");
      if (!barra) return;
      const marcados = document.querySelectorAll(
        ".semana-check:checked",
      ).length;
      const percent = (marcados / this.totalSemanas) * 100;
      barra.style.width = percent + "%";
      if (texto) texto.textContent = `${marcados}/${this.totalSemanas}`;
    },
    configurarEventos() {
      document.querySelectorAll(".semana-check").forEach((cb) => {
        cb.addEventListener("change", () => {
          this.salvarProgresso();
          this.atualizarBarraProgresso();
        });
      });
    },
  };

  // ==================== MÓDULO: CERTIFICADO ====================
  const CertificadoModule = {
    STORAGE_KEY: "robozada_certificados_ano2",
    alunos: [],
    init() {
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
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
      if (this.previewData)
        this.previewData.textContent = new Date().toLocaleDateString("pt-BR");
    },
    atualizarEstadoBotoes() {
      if (this.btnImprimirTodos)
        this.btnImprimirTodos.disabled = this.alunos.length === 0;
      if (this.btnPreviewAluno) {
        const nome = this.previewNome?.textContent || "";
        this.btnPreviewAluno.disabled =
          nome === "[NOME DO ALUNO]" || nome === "";
      }
    },
    adicionarAluno() {
      let nome = this.inputNome.value.trim();
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
      this.inputNome.value = "";
      this.inputNome.focus();
      this.atualizarEstadoBotoes();
    },
    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.previewNome.textContent === this.alunos[index])
          this.previewNome.textContent = "[NOME DO ALUNO]";
        this.atualizarEstadoBotoes();
      }
    },
    selecionarAlunoPreview(nome) {
      this.previewNome.textContent = nome;
      this.atualizarEstadoBotoes();
    },
    atualizarLista() {
      if (!this.listaAlunos) return;
      if (this.alunos.length === 0) {
        this.listaAlunos.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (this.contadorAlunos) this.contadorAlunos.textContent = "0";
        return;
      }
      this.listaAlunos.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
                                <div class="btn-group gap-1">
                                    <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
                                    <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
                                </div>`;
        this.listaAlunos.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () =>
          this.selecionarAlunoPreview(btn.getAttribute("data-nome")),
        );
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () =>
          this.removerAluno(parseInt(btn.getAttribute("data-index"))),
        );
      });
      if (this.contadorAlunos)
        this.contadorAlunos.textContent = this.alunos.length;
    },
    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nome, data);
      const win = window.open(
        "",
        "_blank",
        "width=900,height=700,toolbar=yes,scrollbars=yes",
      );
      if (win) {
        win.document.write(html);
        win.document.close();
      } else
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
    },
    _gerarHtmlCertificado(nome, data) {
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title><style>
                *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'Courier New',monospace;background:#e0e0e0;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:40px 20px;}
                .certificado{border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:30px;text-align:center;background:#fffef7;box-shadow:0 20px 40px rgba(0,0,0,0.2);max-width:800px;margin:auto;}
                .certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;margin-bottom:20px;}
                .certificado p{color:#4a6e2c;margin:10px 0;}
                .certificado strong.nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}
                .btn-print{background:#ffb347;border:none;border-radius:40px;padding:10px 24px;font-weight:bold;cursor:pointer;margin-bottom:20px;}
                @media print{body{background:white;} .btn-print{display:none;} @page{size:A4;margin:1.5cm;}}
            </style></head><body><div><button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button><div class="certificado">
            <h3>🏆 CERTIFICADO DE MESTRE DO SE, ENTÃO E SENÃO</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>🤖 SE → ENTÃO → SENÃO | 🃏 JOGO LOOP DASH | 🤖 PROJETO ROBÔ DO LANCHE</p>
            <hr><p>RobôMestres do Paraná • ${data}</p><p style="font-size:11px;">"SE você pensou, ENTÃO você programou. SENÃO, programe de novo."</p>
            <div>🤖 Ass: Robô Zé 2.0</div></div></div></body></html>`;
    },
    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado!");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;">
                    <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO SE, ENTÃO E SENÃO</h3>
                    <p>Certificamos que</p><strong style="font-size:1rem; display:block; margin:10px 0; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
                    <p>concluiu o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>🤖 SE → ENTÃO → SENÃO | 🃏 JOGO LOOP DASH</p>
                    <hr><p>RobôMestres do Paraná • ${dataAtual}</p><p style="font-size:0.6rem;">"SE você pensou, ENTÃO você programou. SENÃO, programe de novo."</p>
                    <div>🤖 Ass: Robô Zé 2.0</div>
                </div>`;
      });
      const htmlLote = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados RobôMestres - 2º Ano</title><style>
                *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'Courier New',monospace;background:white;padding:20px;}
                .print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
                @media print{body{padding:0;} .print-grid{gap:15px;} @page{size:A4;margin:0.8cm;}}
            </style></head><body><div class="print-grid">${cardsHTML}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200);};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
    },
    previewAlunoSelecionado() {
      const nome = this.previewNome?.textContent || "";
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
    },
    escapeHtml(texto) {
      return texto.replace(/[&<>]/g, function (m) {
        return m === "&" ? "&amp;" : m === "<" ? "&lt;" : "&gt;";
      });
    },
    configurarEventos() {
      if (this.btnAdicionar)
        this.btnAdicionar.addEventListener("click", () =>
          this.adicionarAluno(),
        );
      if (this.inputNome)
        this.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      if (this.btnImprimirTodos)
        this.btnImprimirTodos.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      if (this.btnPreviewAluno)
        this.btnPreviewAluno.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
    },
  };

  // ==================== MÓDULO: JOGO LOOP DASH ====================
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
    init() {
      if (!document.getElementById("loopdashGrid")) return;
      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
    },
    capturarElementos() {
      this.gridEl = document.getElementById("loopdashGrid");
      this.cartoesUsadosEl = document.getElementById("loopdashCartoes");
      this.melhorMarcaEl = document.getElementById("loopdashMelhor");
      this.statusEl = document.getElementById("loopdashStatus");
      this.bonusEl = document.getElementById("loopdashBonus");
      this.algoritmoMontadoEl = document.getElementById("algoritmoMontado");
      this.mensagemEl = document.getElementById("loopdashMensagem");
      this.recordeFase1 = document.getElementById("recordeFase1");
      this.recordeFase2 = document.getElementById("recordeFase2");
      this.recordeFase3 = document.getElementById("recordeFase3");
      this.faseNomeAtual = document.getElementById("faseNomeAtual");
      this.faseIconeAtual = document.getElementById("faseIconeAtual");
    },
    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();
      document
        .querySelectorAll(".btn-phase")
        .forEach((btn) => btn.classList.remove("ativo"));
      document
        .querySelector(`.btn-phase[data-fase="${fase}"]`)
        .classList.add("ativo");
      if (this.faseNomeAtual)
        this.faseNomeAtual.textContent = this.pistas[fase].nome;
      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.faseIconeAtual) this.faseIconeAtual.textContent = icones[fase];
      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(
        `🏁 FASE ${fase}: ${this.pistas[fase].nome} selecionada! Monte seu algoritmo.`,
        "info",
      );
    },
    desenharGrid() {
      const pista = this.pistas[this.faseAtual];
      this.gridEl.className = `loopdash-grid fase${this.faseAtual}`;
      this.gridEl.innerHTML = "";
      for (let l = 0; l < pista.tamanho.linhas; l++) {
        for (let c = 0; c < pista.tamanho.colunas; c++) {
          const celula = pista.grid[l]?.[c] || "⬜";
          const cell = document.createElement("div");
          cell.className = "loopdash-cell";
          if (celula === "🧱") cell.classList.add("wall");
          else if (celula === "🏁") cell.classList.add("target");
          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c)
            cell.classList.add("robot");
          else if (celula === "⬜" || celula === "🚶")
            cell.classList.add("path");
          this.gridEl.appendChild(cell);
        }
      }
    },
    resetarRobo() {
      const pista = this.pistas[this.faseAtual];
      this.posicaoRobo = { x: pista.inicio.x, y: pista.inicio.y, direcao: 1 };
      this.desenharGrid();
      if (this.statusEl) this.statusEl.textContent = "PRONTO";
    },
    limparAlgoritmo() {
      this.cartoesAlgoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
    },
    adicionarCartao(comando, parentContainer = null) {
      let cartaoObj = { comando: comando, filhos: [], contador: 3 };
      if (comando === "repita") cartaoObj.filhos = [];
      if (parentContainer) parentContainer.filhos.push(cartaoObj);
      else this.cartoesAlgoritmo.push(cartaoObj);
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
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
      if (!this.algoritmoMontadoEl) return;
      this.algoritmoMontadoEl.innerHTML = "";
      if (this.cartoesAlgoritmo.length === 0) {
        this.algoritmoMontadoEl.innerHTML =
          '<div class="placeholder-algoritmo">🃏 Clique nos cartões abaixo para montar seu algoritmo...</div>';
        return;
      }
      this.cartoesAlgoritmo.forEach((cartao, idx) => {
        this.algoritmoMontadoEl.appendChild(
          this.criarCartaoElemento(cartao, idx, false),
        );
      });
    },
    criarCartaoElemento(cartao, idx, isFilho) {
      const div = document.createElement("div");
      div.className = "cartao-montado";
      if (cartao.comando === "repita") {
        div.classList.add("repita-container");
        const header = document.createElement("div");
        header.className = "repita-header";
        header.innerHTML = `<span class="cartao-icone">🔄</span><span class="cartao-texto">REPITA</span>
                                    <input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10" style="width:55px; border-radius:20px; text-align:center;">
                                    <span class="cartao-texto">vezes</span>
                                    <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>`;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";
        const btnAdd = document.createElement("button");
        btnAdd.innerHTML = "+ adicionar comando";
        btnAdd.style.cssText =
          "background:#ffb347; border:none; border-radius:20px; padding:4px 8px; font-size:0.7rem; cursor:pointer; margin-bottom:8px;";
        btnAdd.addEventListener("click", (e) => {
          e.stopPropagation();
          this.mostrarSelecaoComandoParaRepita(cartao);
        });
        filhosDiv.appendChild(btnAdd);
        if (cartao.filhos && cartao.filhos.length) {
          cartao.filhos.forEach((filho, fIdx) =>
            filhosDiv.appendChild(this.criarCartaoElemento(filho, fIdx, true)),
          );
        }
        div.appendChild(header);
        div.appendChild(filhosDiv);
        const input = header.querySelector(".repita-contador-input");
        if (input)
          input.addEventListener("change", (e) => {
            cartao.contador = parseInt(e.target.value) || 3;
            this.atualizarContadorCartoes();
          });
      } else {
        div.innerHTML = `<span class="cartao-icone">${this.getIconeComando(cartao.comando)}</span>
                                 <span class="cartao-texto">${this.getNomeComando(cartao.comando)}</span>
                                 <span class="cartao-remove" data-idx="${idx}" data-is-filho="${isFilho}">✖️</span>`;
      }
      const removeBtn = div.querySelector(".cartao-remove");
      if (removeBtn) {
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idxRem = parseInt(removeBtn.getAttribute("data-idx"));
          const isFilhoRem = removeBtn.getAttribute("data-is-filho") === "true";
          this.removerCartao(idxRem, isFilhoRem);
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
      let modalHtml = `<div id="modalComando" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center; z-index:9999;">
                <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:400px;">
                <h3 style="color:#ffb347;">🔄 Adicionar comando ao REPITA</h3><div style="display:flex; flex-wrap:wrap; gap:12px; margin:20px 0;">`;
      comandos.forEach((cmd) => {
        modalHtml += `<button class="btn-selecionar-cmd" data-comando="${cmd.comando}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:12px; cursor:pointer;"><div style="font-size:2rem;">${cmd.icone}</div><div style="color:#ffb347;">${cmd.nome}</div></button>`;
      });
      modalHtml += `</div><button id="btnFecharModal" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; color:white; cursor:pointer;">FECHAR</button></div></div>`;
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
      const fechar = document.getElementById("btnFecharModal");
      if (fechar)
        fechar.addEventListener("click", () => {
          if (modal) modal.remove();
        });
    },
    removerCartao(idx, isFilho) {
      if (!isFilho && this.cartoesAlgoritmo[idx])
        this.cartoesAlgoritmo.splice(idx, 1);
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
      if (this.cartoesUsadosEl) this.cartoesUsadosEl.textContent = total;
      let temLoopAninhado = false;
      const verificar = (arr) => {
        for (const item of arr) {
          if (item.comando === "repita" && item.filhos) {
            for (const filho of item.filhos)
              if (filho.comando === "repita") temLoopAninhado = true;
            verificar(item.filhos);
          }
        }
      };
      verificar(this.cartoesAlgoritmo);
      if (this.bonusEl)
        this.bonusEl.textContent = temLoopAninhado
          ? "⭐ LOOPCEPTION! ⭐"
          : "---";
    },
    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", "erro");
        return;
      }
      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando algoritmo...", "info");
      if (this.statusEl) this.statusEl.textContent = "EXECUTANDO...";
      let sucesso = true,
        erroMsg = "";
      for (const comando of this.cartoesAlgoritmo) {
        const res = await this.executarComando(comando);
        if (!res.sucesso) {
          sucesso = false;
          erroMsg = res.erro;
          break;
        }
      }
      const chegou = this.verificarChegada();
      if (sucesso && chegou) {
        const total = parseInt(this.cartoesUsadosEl?.textContent || "0");
        const recorde = this.recordes[this.faseAtual];
        if (!recorde || total < recorde) {
          this.recordes[this.faseAtual] = total;
          this.salvarRecordes();
          this.atualizarRecordeDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${total} cartões! NOVO RECORDE! 🏆`,
            "success",
          );
        } else
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${total} cartões!`,
            "success",
          );
        if (this.statusEl) this.statusEl.textContent = "VITÓRIA! 🏆";
      } else {
        this.mostrarMensagem(
          `🐛 BUG ENCONTRADO! ${erroMsg || "O robô não conseguiu completar o percurso."}`,
          "erro",
        );
        if (this.statusEl) this.statusEl.textContent = "BUGOU! 💥";
      }
    },
    async executarComando(comandoObj) {
      const comando = comandoObj.comando;
      if (comando === "repita") {
        const vezes = comandoObj.contador || 3;
        for (let i = 0; i < vezes; i++) {
          for (const filho of comandoObj.filhos || []) {
            const res = await this.executarComando(filho);
            if (!res.sucesso) return res;
            await this.delay(200);
            this.desenharGrid();
          }
        }
        return { sucesso: true };
      }
      const pista = this.pistas[this.faseAtual];
      let nx = this.posicaoRobo.x,
        ny = this.posicaoRobo.y;
      switch (comando) {
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
          return { sucesso: false, erro: `Comando desconhecido: ${comando}` };
      }
      if (
        nx < 0 ||
        nx >= pista.tamanho.linhas ||
        ny < 0 ||
        ny >= pista.tamanho.colunas
      )
        return { sucesso: false, erro: "Robô saiu da pista!" };
      if (pista.grid[nx]?.[ny] === "🧱")
        return { sucesso: false, erro: "Robô bateu em obstáculo! 🧱" };
      this.posicaoRobo.x = nx;
      this.posicaoRobo.y = ny;
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
    mostrarMensagem(texto, tipo) {
      if (!this.mensagemEl) return;
      this.mensagemEl.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      this.mensagemEl.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "success" ? "sucesso" : ""}`;
      setTimeout(() => {
        if (this.mensagemEl && tipo !== "erro")
          this.mensagemEl.className = "mensagem-jogo";
      }, 4000);
    },
    carregarRecordes() {
      const saved = localStorage.getItem("loopdash_recordes");
      if (saved)
        try {
          this.recordes = JSON.parse(saved);
        } catch (e) {}
    },
    salvarRecordes() {
      localStorage.setItem("loopdash_recordes", JSON.stringify(this.recordes));
    },
    atualizarRecordeDisplay() {
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
      if (this.melhorMarcaEl)
        this.melhorMarcaEl.textContent = melhor !== Infinity ? melhor : "--";
    },
    mostrarDica() {
      const dicas = {
        1: "💡 Use um único REPITA 7 vezes com ANDE 1!",
        2: "💡 Use REPITA dentro de REPITA para o zigue-zague!",
        3: "💡 Planeje o caminho para desviar dos obstáculos.",
      };
      this.mostrarMensagem(
        dicas[this.faseAtual] ||
          "💡 Tente usar o cartão REPITA para economizar cartões!",
        "info",
      );
    },
    carregarExemplo() {
      this.limparAlgoritmo();
      if (this.faseAtual === 1)
        this.cartoesAlgoritmo.push({
          comando: "repita",
          contador: 7,
          filhos: [{ comando: "ande1", filhos: [] }],
        });
      else if (this.faseAtual === 2)
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
      else
        this.cartoesAlgoritmo.push(
          { comando: "ande1", filhos: [] },
          { comando: "vireDireita", filhos: [] },
          { comando: "ande1", filhos: [] },
        );
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem(
        `📋 Exemplo carregado para a FASE ${this.faseAtual}!`,
        "success",
      );
    },
    configurarEventos() {
      document
        .querySelectorAll(".btn-phase")
        .forEach((btn) =>
          btn.addEventListener("click", () =>
            this.carregarFase(parseInt(btn.getAttribute("data-fase"))),
          ),
        );
      document
        .querySelectorAll(".cartao-comando")
        .forEach((cartao) =>
          cartao.addEventListener("click", () =>
            this.adicionarCartao(cartao.getAttribute("data-comando")),
          ),
        );
      const btnLimpar = document.getElementById("btnLimparAlgoritmo");
      if (btnLimpar)
        btnLimpar.addEventListener("click", () => this.limparAlgoritmo());
      const btnExecutar = document.getElementById("btnExecutarLoopDash");
      const btnReset = document.getElementById("btnResetLoopDash");
      const btnDica = document.getElementById("btnDicaLoopDash");
      const btnExemplo = document.getElementById("btnExemploLoopDash");
      if (btnExecutar)
        btnExecutar.addEventListener("click", () => this.executarAlgoritmo());
      if (btnReset)
        btnReset.addEventListener("click", () => this.resetarRobo());
      if (btnDica) btnDica.addEventListener("click", () => this.mostrarDica());
      if (btnExemplo)
        btnExemplo.addEventListener("click", () => this.carregarExemplo());
    },
  };

  // ==================== INICIALIZAÇÃO GERAL ====================
  document.addEventListener("DOMContentLoaded", () => {
    PlanosModule.init();
    CertificadoModule.init();
    LoopDashModule.init();
    console.log("🤖 a2bim1.js: Todos os módulos inicializados!");
  });
})();
