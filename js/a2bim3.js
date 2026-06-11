// ==================================================
// a2bim3.js - SCRIPT UNIFICADO PARA 3º BIMESTRE - 2º ANO
// Módulos: menu, cabeçalho, rodapé, planos de aula, certificado, jogo Loop Dash
// Baseado nos anexos e nas especificações do documento .docx
// ==================================================

(function () {
  "use strict";

  // ==================== MÓDULO CABEÇALHO ====================
  const CabecalhoModule = {
    contadorBugs: 0,
    inicializado: false,
    contadorElement: null,
    relatorioElement: null,

    init() {
      if (this.inicializado) return;
      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.contadorElement) {
        this.contadorBugs = this.carregarContador();
        this.atualizarDisplayContador();
      }
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [CABEÇALHO] Inicializado", "color:#ffb347");
    },
    carregarContador() {
      try {
        return parseInt(localStorage.getItem("cabecalho_contador_bugs")) || 0;
      } catch (e) {
        return 0;
      }
    },
    salvarContador() {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs);
      } catch (e) {}
    },
    atualizarDisplayContador() {
      if (this.contadorElement)
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      if (this.relatorioElement)
        this.relatorioElement.innerText = this.contadorBugs;
    },
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      return this.contadorBugs;
    },
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      return 0;
    },
    getContadorBugs() {
      return this.contadorBugs;
    },
    configurarEventos() {
      document.addEventListener("robo:bug", (e) => {
        this.incrementarBugs(e.detail?.incremento || 1);
      });
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
      });
    },
  };

  // ==================== MÓDULO RODAPÉ ====================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,
    init() {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.relatorioElement) this.atualizarRelatorio();
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [RODAPÉ] Inicializado", "color:#ffb347");
    },
    atualizarRelatorio() {
      if (!this.relatorioElement) return;
      let contador = 0;
      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      )
        contador = window.CabecalhoModule.getContadorBugs();
      else
        try {
          contador =
            parseInt(localStorage.getItem("cabecalho_contador_bugs")) || 0;
        } catch (e) {}
      this.relatorioElement.innerText = contador;
    },
    configurarEventos() {
      document.addEventListener("robo:bug", () => this.atualizarRelatorio());
      document.addEventListener("robo:resetBugs", () =>
        this.atualizarRelatorio(),
      );
      document.addEventListener("cabecalho:contador_atualizado", () =>
        this.atualizarRelatorio(),
      );
    },
  };

  // ==================== MÓDULO PLANOS DE AULA (checkboxes) ====================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_2ano_bim3",
    totalSemanas: 10,
    checkboxes: [],
    init() {
      if (!document.getElementById("accordionAulas")) return;
      this.checkboxes = document.querySelectorAll(".semana-check");
      if (this.checkboxes.length) this.totalSemanas = this.checkboxes.length;
      this.carregarProgresso();
      this.configurarEventos();
      this.inicializado = true;
      console.log("📚 [PlanosAulaModule] Inicializado");
    },
    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb, idx) => {
        const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) return;
      try {
        const concluidas = JSON.parse(salvo);
        this.checkboxes.forEach((cb, idx) => {
          const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
          if (concluidas[semana]) cb.checked = concluidas[semana];
        });
      } catch (e) {}
    },
    configurarEventos() {
      this.checkboxes.forEach((cb) =>
        cb.addEventListener("change", () => this.salvarProgresso()),
      );
    },
  };

  // ==================== MÓDULO CERTIFICADO ====================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_2ano_bim3",
    elementos: {},
    init() {
      if (!document.getElementById("listaAlunos")) return;
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.inicializado = true;
      console.log("🎓 [CertificadoModule] Inicializado");
    },
    carregarElementos() {
      this.elementos = {
        inputNome: document.getElementById("nomeAluno"),
        btnAdicionar: document.getElementById("btnAdicionar"),
        listaAlunos: document.getElementById("listaAlunos"),
        contadorAlunos: document.getElementById("contadorAlunos"),
        btnImprimirTodos: document.getElementById("btnImprimirCertificados"),
        btnPreviewAluno: document.getElementById("btnPreviewAluno"),
        previewNome: document.getElementById("previewNomeAluno"),
        previewData: document.getElementById("previewData"),
      };
    },
    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos)
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      if (!this.alunos.length)
        this.alunos = [
          "ANA BEATRIZ SANTOS",
          "LUCAS MARTINS FERREIRA",
          "MARIA CLARA SILVA",
        ];
    },
    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
    },
    atualizarPreviewData() {
      if (this.elementos.previewData)
        this.elementos.previewData.textContent = new Date().toLocaleDateString(
          "pt-BR",
        );
    },
    adicionarAluno() {
      let nome = this.elementos.inputNome?.value.trim();
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
      this.atualizarEstadoBotoes();
    },
    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.elementos.previewNome?.textContent === this.alunos[index])
          this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        this.atualizarEstadoBotoes();
      }
    },
    selecionarAlunoPreview(nome) {
      if (this.elementos.previewNome)
        this.elementos.previewNome.textContent = nome;
      this.atualizarEstadoBotoes();
    },
    atualizarLista() {
      const listaUl = this.elementos.listaAlunos;
      if (!listaUl) return;
      if (this.alunos.length === 0) {
        listaUl.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (this.elementos.contadorAlunos)
          this.elementos.contadorAlunos.textContent = "0";
        return;
      }
      listaUl.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span><div class="btn-group gap-1"><button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button><button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button></div>`;
        listaUl.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) =>
        btn.addEventListener("click", (e) => {
          this.selecionarAlunoPreview(btn.getAttribute("data-nome"));
        }),
      );
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) =>
        btn.addEventListener("click", (e) => {
          this.removerAluno(parseInt(btn.getAttribute("data-index")));
        }),
      );
      if (this.elementos.contadorAlunos)
        this.elementos.contadorAlunos.textContent = this.alunos.length;
    },
    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title><style>body{font-family:'Courier New',monospace;background:#e0e0e0;display:flex;justify-content:center;align-items:center;padding:40px}.certificado{border:3px solid #ffb347;border-radius:48px 24px;padding:30px;background:#fffef7;text-align:center}.certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem}.nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px}@media print{.btn-print{display:none}}</style></head><body><div class="certificado"><h3>🏆 CERTIFICADO DE MESTRE DO SCRATCHJR - NÍVEL 3</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong><p>concluiu com êxito o <strong>3º BIMESTRE - ROBÓTICA EDUCACIONAL</strong><br>🔁 REPITA | 📦 EVENTOS | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p><hr><p>RobôMestres do Paraná • ${data}</p><p>"REPITA 3 VEZES: PARABÉNS! PARABÉNS! PARABÉNS!"</p><div>🤖 Ass: Robô Zé 2.0</div></div><script>window.print();<\/script></body></html>`;
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para imprimir.");
    },
    imprimirTodosCertificados() {
      if (!this.alunos.length) {
        alert("🤖 Nenhum aluno cadastrado!");
        return;
      }
      const data = new Date().toLocaleDateString("pt-BR");
      let cards = "";
      this.alunos.forEach((aluno) => {
        cards += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;"><h3 style="color:#ffb347; font-size:0.7rem;">🏆 CERTIFICADO MESTRE DO SCRATCHJR - NÍVEL 3</h3><p>Certificamos que</p><strong style="display:block; background:#fff0cc; padding:8px; border-radius:40px;">${this.escapeHtml(aluno)}</strong><p>3º BIMESTRE - ROBÓTICA<br>🔁 REPITA | 📦 EVENTOS | 🐛 DEPURAÇÃO</p><hr><p>RobôMestres do Paraná • ${data}</p></div>`;
      });
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados</title><style>.print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;}@media print{@page{size:A4;margin:0.8cm;}}</style></head><body><div class="print-grid">${cards}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200)};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else alert("⚠️ Permita pop-ups.");
    },
    previewAlunoSelecionado() {
      const nome = this.elementos.previewNome?.textContent;
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
    },
    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimirTodos)
        this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      if (this.elementos.btnPreviewAluno)
        this.elementos.btnPreviewAluno.disabled =
          !this.elementos.previewNome?.textContent ||
          this.elementos.previewNome.textContent === "[NOME DO ALUNO]";
    },
    configurarEventos() {
      if (this.elementos.btnAdicionar)
        this.elementos.btnAdicionar.addEventListener("click", () =>
          this.adicionarAluno(),
        );
      if (this.elementos.inputNome)
        this.elementos.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      if (this.elementos.btnImprimirTodos)
        this.elementos.btnImprimirTodos.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      if (this.elementos.btnPreviewAluno)
        this.elementos.btnPreviewAluno.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
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

  // ==================== MÓDULO JOGO LOOP DASH (fechamento bimestre) ====================
  const JogoModule = {
    inicializado: false,
    faseAtual: 1,
    cartoesAlgoritmo: [],
    posicaoRobo: { x: 0, y: 0, direcao: 1 },
    recordes: { 1: null, 2: null, 3: null },
    pistas: {
      1: {
        nome: "LINHA RETA 🏁",
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
        nome: "OBSTÁCULOS + MONSTRO 🧱",
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
    elementos: {},
    init() {
      if (!document.getElementById("loopdashGrid")) return;
      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
      this.inicializado = true;
      console.log("🎮 [JogoModule] LOOP DASH inicializado");
    },
    capturarElementos() {
      this.elementos = {
        grid: document.getElementById("loopdashGrid"),
        cartoesUsados: document.getElementById("loopdashCartoes"),
        melhorMarca: document.getElementById("loopdashMelhor"),
        status: document.getElementById("loopdashStatus"),
        algoritmoMontado: document.getElementById("algoritmoMontado"),
        mensagem: document.getElementById("loopdashMensagem"),
        faseNomeAtual: document.getElementById("faseNomeAtual"),
        faseIconeAtual: document.getElementById("faseIconeAtual"),
      };
    },
    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();
      document
        .querySelectorAll(".btn-phase")
        .forEach((btn) => btn.classList.remove("ativo"));
      const btnAtivo = document.querySelector(
        `.btn-phase[data-fase="${fase}"]`,
      );
      if (btnAtivo) btnAtivo.classList.add("ativo");
      if (this.elementos.faseNomeAtual)
        this.elementos.faseNomeAtual.textContent = this.pistas[fase].nome;
      const icones = { 1: "🏁", 2: "🔄", 3: "🧱" };
      if (this.elementos.faseIconeAtual)
        this.elementos.faseIconeAtual.textContent = icones[fase];
      this.desenharGrid();
      this.atualizarRecordeDisplay();
      this.mostrarMensagem(
        `🏁 FASE ${fase}: ${this.pistas[fase].nome} selecionada! Monte seu algoritmo com os blocos.`,
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
          if (this.posicaoRobo.x === l && this.posicaoRobo.y === c)
            cellDiv.classList.add("robot");
          else if (celula === "⬜" || celula === "🚶")
            cellDiv.classList.add("path");
          this.elementos.grid.appendChild(cellDiv);
        }
      }
    },
    resetarRobo() {
      const pista = this.pistas[this.faseAtual];
      this.posicaoRobo = { x: pista.inicio.x, y: pista.inicio.y, direcao: 1 };
      this.desenharGrid();
      if (this.elementos.status) this.elementos.status.textContent = "PRONTO";
    },
    adicionarCartao(comando) {
      let cartaoObj = { comando: comando, filhos: [], contador: 3 };
      if (comando === "repita") cartaoObj.filhos = [];
      this.cartoesAlgoritmo.push(cartaoObj);
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
        esperarAteBorda: "ESPERAR ATÉ PAREDE",
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
        esperarAteBorda: "⏳",
      };
      return icones[comando] || "❓";
    },
    renderizarAlgoritmo() {
      if (!this.elementos.algoritmoMontado) return;
      this.elementos.algoritmoMontado.innerHTML = "";
      if (this.cartoesAlgoritmo.length === 0) {
        this.elementos.algoritmoMontado.innerHTML =
          '<div class="placeholder-algoritmo">🧩 Arraste os blocos dos cartões abaixo...</div>';
        return;
      }
      this.cartoesAlgoritmo.forEach((cartao, idx) => {
        const cartaoDiv = this.criarCartaoElemento(cartao, idx);
        this.elementos.algoritmoMontado.appendChild(cartaoDiv);
      });
    },
    criarCartaoElemento(cartao, idx) {
      const div = document.createElement("div");
      div.className = "cartao-montado";
      if (cartao.comando === "repita") {
        div.classList.add("repita-container");
        const header = document.createElement("div");
        header.className = "repita-header";
        header.innerHTML = `<span class="cartao-icone">🔄</span><span class="cartao-texto">REPITA</span><input type="number" class="repita-contador-input" value="${cartao.contador}" min="1" max="10" style="width:55px;border-radius:20px;"><span>vezes</span><span class="cartao-remove" data-idx="${idx}">✖️</span>`;
        const filhosDiv = document.createElement("div");
        filhosDiv.className = "repita-filhos";
        const btnAdd = document.createElement("button");
        btnAdd.innerHTML = "+ adicionar comando";
        btnAdd.style.cssText =
          "background:#ffb347;border:none;border-radius:20px;padding:4px 8px;font-size:0.7rem;cursor:pointer;margin-bottom:8px;";
        btnAdd.addEventListener("click", (e) => {
          this.mostrarSelecaoComandoParaRepita(cartao);
        });
        filhosDiv.appendChild(btnAdd);
        if (cartao.filhos && cartao.filhos.length) {
          cartao.filhos.forEach((filho, fIdx) => {
            const filhoDiv = this.criarCartaoElemento(filho, fIdx);
            filhosDiv.appendChild(filhoDiv);
          });
        }
        div.appendChild(header);
        div.appendChild(filhosDiv);
        const inputContador = header.querySelector(".repita-contador-input");
        if (inputContador)
          inputContador.addEventListener("change", (e) => {
            cartao.contador = parseInt(e.target.value) || 3;
            this.atualizarContadorCartoes();
          });
      } else {
        div.innerHTML = `<span class="cartao-icone">${this.getIconeComando(cartao.comando)}</span><span class="cartao-texto">${this.getNomeComando(cartao.comando)}</span><span class="cartao-remove" data-idx="${idx}">✖️</span>`;
      }
      const removeBtn = div.querySelector(".cartao-remove");
      if (removeBtn)
        removeBtn.addEventListener("click", () => {
          this.removerCartao(parseInt(removeBtn.getAttribute("data-idx")));
        });
      return div;
    },
    mostrarSelecaoComandoParaRepita(cartaoRepita) {
      const comandos = [
        { comando: "ande1", nome: "ANDE 1" },
        { comando: "ande2", nome: "ANDE 2" },
        { comando: "vireDireita", nome: "VIRE DIREITA" },
        { comando: "vireEsquerda", nome: "VIRE ESQUERDA" },
        { comando: "esperarAteBorda", nome: "ESPERAR ATÉ PAREDE" },
      ];
      let modalHtml = `<div id="modalComando" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:9999;"><div style="background:#1e2a1a;padding:24px;border-radius:24px;border:3px solid #ffb347;"><h3 style="color:#ffb347;">🔄 Adicionar comando ao REPITA</h3><div style="display:flex;flex-wrap:wrap;gap:12px;margin:20px 0;">`;
      comandos.forEach((cmd) => {
        modalHtml += `<button class="btn-selecionar-cmd" data-comando="${cmd.comando}" style="background:#2c3e2b;border:2px solid #4a7c3f;border-radius:16px;padding:12px;cursor:pointer;"><div style="font-size:2rem;">${this.getIconeComando(cmd.comando)}</div><div style="color:#ffb347;">${cmd.nome}</div></button>`;
      });
      modalHtml += `</div><button id="btnFecharModal" style="background:#e74c3c;border:none;border-radius:40px;padding:8px 20px;color:white;cursor:pointer;">FECHAR</button></div></div>`;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("modalComando");
      document.querySelectorAll(".btn-selecionar-cmd").forEach((btn) =>
        btn.addEventListener("click", () => {
          const comando = btn.getAttribute("data-comando");
          cartaoRepita.filhos.push({ comando: comando, filhos: [] });
          this.renderizarAlgoritmo();
          if (modal) modal.remove();
          this.atualizarContadorCartoes();
        }),
      );
      const btnFechar = document.getElementById("btnFecharModal");
      if (btnFechar)
        btnFechar.addEventListener("click", () => {
          if (modal) modal.remove();
        });
    },
    removerCartao(idx) {
      if (this.cartoesAlgoritmo[idx]) this.cartoesAlgoritmo.splice(idx, 1);
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
    },
    limparAlgoritmo() {
      this.cartoesAlgoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadorCartoes();
      this.mostrarMensagem("🧹 Algoritmo limpo!");
    },
    atualizarContadorCartoes() {
      const contar = (arr) => {
        let t = 0;
        for (let item of arr) {
          t++;
          if (item.comando === "repita" && item.filhos)
            t += contar(item.filhos);
        }
        return t;
      };
      const total = contar(this.cartoesAlgoritmo);
      if (this.elementos.cartoesUsados)
        this.elementos.cartoesUsados.textContent = total;
    },
    async executarAlgoritmo() {
      if (this.cartoesAlgoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", "erro");
        return;
      }
      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando algoritmo...");
      if (this.elementos.status)
        this.elementos.status.textContent = "EXECUTANDO...";
      let sucesso = true,
        erroMsg = "";
      try {
        for (const comando of this.cartoesAlgoritmo) {
          const resultado = await this.executarComando(comando);
          if (!resultado.sucesso) {
            sucesso = false;
            erroMsg = resultado.erro;
            break;
          }
        }
      } catch (e) {
        sucesso = false;
        erroMsg = e.message;
      }
      const chegou = this.verificarChegada();
      if (sucesso && chegou) {
        const total = parseInt(
          this.elementos.cartoesUsados?.textContent || "0",
        );
        const recordeAtual = this.recordes[this.faseAtual];
        if (!recordeAtual || total < recordeAtual) {
          this.recordes[this.faseAtual] = total;
          this.salvarRecordes();
          this.atualizarRecordeDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${total} blocos! NOVO RECORDE! 🏆`,
            "sucesso",
          );
        } else
          this.mostrarMensagem(
            `🎉 PARABÉNS! Completou a FASE ${this.faseAtual} com ${total} blocos!`,
            "sucesso",
          );
        if (this.elementos.status)
          this.elementos.status.textContent = "VITÓRIA! 🏆";
        document.dispatchEvent(new CustomEvent("robo:vitoria"));
      } else {
        document.dispatchEvent(
          new CustomEvent("robo:bug", {
            detail: { incremento: 1, mensagem: erroMsg },
          }),
        );
        this.mostrarMensagem(
          `🐛 BUG! ${erroMsg || "O gato não conseguiu completar."} Use a dica para depurar.`,
          "erro",
        );
        if (this.elementos.status)
          this.elementos.status.textContent = "BUGOU! 💥";
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
            await this.delay(250);
            this.desenharGrid();
          }
        }
        return { sucesso: true };
      }
      const pista = this.pistas[this.faseAtual];
      let novoX = this.posicaoRobo.x,
        novoY = this.posicaoRobo.y;
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
        case "esperarAteBorda":
          if (
            pista.grid[this.posicaoRobo.x][this.posicaoRobo.y + 1] === "🧱" ||
            this.posicaoRobo.y + 1 >= pista.tamanho.colunas
          )
            return { sucesso: true };
          else
            return {
              sucesso: false,
              erro: "O gato não está encostado na parede!",
            };
        default:
          return { sucesso: false, erro: "Comando desconhecido" };
      }
      if (
        novoX < 0 ||
        novoX >= pista.tamanho.linhas ||
        novoY < 0 ||
        novoY >= pista.tamanho.colunas
      )
        return { sucesso: false, erro: "O gato saiu da pista!" };
      if (pista.grid[novoX]?.[novoY] === "🧱")
        return {
          sucesso: false,
          erro: "O gato bateu em um obstáculo/monstro! 🧱",
        };
      this.posicaoRobo.x = novoX;
      this.posicaoRobo.y = novoY;
      await this.delay(250);
      this.desenharGrid();
      return { sucesso: true };
    },
    verificarChegada() {
      return (
        this.pistas[this.faseAtual].grid[this.posicaoRobo.x]?.[
          this.posicaoRobo.y
        ] === "🏁"
      );
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    mostrarDica() {
      const dicas = {
        1: "💡 Use REPITA 7 vezes com ANDE 1 para percorrer a reta!",
        2: "💡 Use REPITA dentro de REPITA para o zigue-zague!",
        3: "💡 Use ESPERAR ATÉ PAREDE para virar nos obstáculos!",
      };
      this.mostrarMensagem(
        dicas[this.faseAtual] ||
          "💡 Tente combinar REPITA com comandos de movimento!",
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
        `📋 Exemplo carregado para a FASE ${this.faseAtual}! Clique em EXECUTAR.`,
      );
    },
    carregarRecordes() {
      try {
        const saved = localStorage.getItem("loopdash_recordes_bim3");
        if (saved) this.recordes = JSON.parse(saved);
      } catch (e) {}
    },
    salvarRecordes() {
      localStorage.setItem(
        "loopdash_recordes_bim3",
        JSON.stringify(this.recordes),
      );
    },
    atualizarRecordeDisplay() {
      const melhor = Math.min(
        ...[this.recordes[1], this.recordes[2], this.recordes[3]].filter(
          (v) => v !== null,
        ),
      );
      if (this.elementos.melhorMarca)
        this.elementos.melhorMarca.textContent =
          melhor !== Infinity ? melhor : "--";
    },
    mostrarMensagem(texto, tipo = "info") {
      if (!this.elementos.mensagem) return;
      this.elementos.mensagem.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      this.elementos.mensagem.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "sucesso" ? "sucesso" : ""}`;
      setTimeout(() => {
        if (this.elementos.mensagem && tipo !== "erro")
          this.elementos.mensagem.className = "mensagem-jogo";
      }, 4000);
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
        ?.addEventListener("click", () => this.mostrarDica());
      document
        .getElementById("btnExemploLoopDash")
        ?.addEventListener("click", () => this.carregarExemplo());
    },
  };

  // ==================== INICIALIZAÇÃO GERAL ====================
  function initAll() {
    CabecalhoModule.init();
    RodapeModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    JogoModule.init();
    window.CabecalhoModule = CabecalhoModule;
    window.RodapeModule = RodapeModule;
    window.PlanosAulaModule = PlanosAulaModule;
    window.CertificadoModule = CertificadoModule;
    window.JogoModule = JogoModule;
    console.log(
      "%c🚀 TODOS OS MÓDULOS INICIALIZADOS - 3º BIMESTRE",
      "color:#ffb347;font-size:16px;font-weight:bold",
    );
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initAll);
  else initAll();
})();
