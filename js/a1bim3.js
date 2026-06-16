// ==================================================
// a1bim3.js - Robótica 1º ano Bimestre 3
// Módulos: Planos de Aula, Certificado, Jogo Robô Decisões, Rodapé, Menu
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
      if (document.getElementById("listaAlunos")) {
        this.carregarElementos();
        this.carregarAlunosDoStorage();
        this.atualizarLista();
        this.configurarEventos();
        this.atualizarPreviewData();
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
    },
    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      this.alunos = salvos ? JSON.parse(salvos) : [];
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
      if (this.btnImprimirTodos) this.btnImprimirTodos.disabled = false;

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
      return texto.replace(
        /[&<>]/g,
        (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m] || m,
      );
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
      if (!this.alunos || this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione alunos antes de imprimir.");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid; margin:0 auto; width:100%; box-sizing:border-box;">
          <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.8rem; margin-bottom:10px;">🏆 CERTIFICADO DE MESTRE DO LOOP</h3>
          <p style="color:#4a6e2c;">Certificamos que</p>
          <strong style="display:block; background:#fff0cc; padding:8px; border-radius:40px; font-size:1rem;">${this.escapeHtml(aluno)}</strong>
          <p style="color:#4a6e2c; margin-top:10px;">concluiu o <strong>1º ANO - ROBÓTICA EDUCACIONAL (BIMESTRE 3)</strong><br>🔁 LOOP | ⚖️ CONDICIONAL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
          <hr style="margin:12px 0; border:1px solid #ffb347;">
          <p style="font-size:0.7rem;">RobôMestres do Paraná • ${dataAtual}</p>
          <p style="font-size:0.6rem; font-style:italic;">"SE você aprendeu, ENTÃO merece! SENÃO, tente de novo!"</p>
        </div>`;
      });
      const htmlLote = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados RobôMestres - Turma</title><style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Courier New',monospace;background:white;padding:20px;margin:0;}
        .print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start;}
        .certificado-impressao{break-inside:avoid;page-break-inside:avoid;}
        @media print{body{padding:0;margin:0;background:white;} .print-grid{gap:15px;} @page{size:A4;margin:1cm;}}
      </style></head><body><div class="print-grid">${cardsHTML}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},1000);},300);};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else
        alert(
          "⚠️ Pop-up bloqueado! Permita pop-ups para este site e clique novamente.",
        );
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
        });
      }
      if (this.btnImprimirTodos) {
        this.btnImprimirTodos.removeEventListener(
          "click",
          this.imprimirTodosHandler,
        );
        this.imprimirTodosHandler = () => this.imprimirTodos();
        this.btnImprimirTodos.addEventListener(
          "click",
          this.imprimirTodosHandler,
        );
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

  // ========== MÓDULO JOGO: ROBÔ DAS REPETIÇÕES E DECISÕES (COM SELEÇÃO DE COMANDOS) ==========
  const RoboDecisoes = {
    faseAtual: 1,
    algoritmo: [],
    posRobo: { x: 0, y: 0, dir: 1 },
    recordes: { 1: null, 2: null, 3: null },
    tabuleiros: {
      1: {
        nome: "Loop Simples",
        grid: [
          ["🤖", "⬜", "⬜", "⬜", "🏆"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        size: 5,
      },
      2: {
        nome: "Condicional",
        grid: [
          ["🤖", "🧱", "⬜", "⬜", "🏆"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        size: 5,
      },
      3: {
        nome: "Loop + Condicional",
        grid: [
          ["🤖", "⬜", "🧱", "⬜", "🏆"],
          ["⬜", "🧱", "⬜", "🧱", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
          ["🧱", "⬜", "🧱", "⬜", "⬜"],
          ["⬜", "⬜", "⬜", "⬜", "⬜"],
        ],
        inicio: { x: 0, y: 0 },
        size: 5,
      },
    },
    init() {
      if (!document.getElementById("gameGrid")) return;
      this.carregarRecordes();
      this.capturarElementos();
      this.configurarEventos();
      this.carregarFase(1);
    },
    capturarElementos() {
      this.gridDiv = document.getElementById("gameGrid");
      this.blocosUsadosSpan = document.getElementById("blocosUsados");
      this.melhorMarcaSpan = document.getElementById("melhorMarca");
      this.statusSpan = document.getElementById("statusRobo");
      this.algoritmoDiv = document.getElementById("algoritmoMontado");
      this.mensagemDiv = document.getElementById("mensagemJogo");
      this.recordeSpans = {
        1: document.getElementById("recordeFase1"),
        2: document.getElementById("recordeFase2"),
        3: document.getElementById("recordeFase3"),
      };
    },
    carregarRecordes() {
      const saved = localStorage.getItem("robo_decisoes_recordes");
      if (saved) this.recordes = JSON.parse(saved);
    },
    salvarRecordes() {
      localStorage.setItem(
        "robo_decisoes_recordes",
        JSON.stringify(this.recordes),
      );
    },
    carregarFase(fase) {
      this.faseAtual = fase;
      this.limparAlgoritmo();
      this.resetarRobo();
      this.desenharGrid();
      this.atualizarRecordesDisplay();
      this.mostrarMensagem(
        `Fase ${fase}: ${this.tabuleiros[fase].nome}. Monte seu algoritmo!`,
      );
    },
    desenharGrid() {
      if (!this.gridDiv) return;
      const tab = this.tabuleiros[this.faseAtual];
      this.gridDiv.style.gridTemplateColumns = `repeat(${tab.size}, 70px)`;
      this.gridDiv.innerHTML = "";
      for (let i = 0; i < tab.size; i++) {
        for (let j = 0; j < tab.size; j++) {
          let celula = tab.grid[i][j];
          const cell = document.createElement("div");
          cell.className = "grid-cell";
          if (i === this.posRobo.x && j === this.posRobo.y) {
            cell.classList.add("robot");
            cell.textContent = "🤖";
          } else if (celula === "🏆") {
            cell.classList.add("target");
            cell.textContent = "🏆";
          } else if (celula === "🧱") {
            cell.classList.add("wall");
            cell.textContent = "🧱";
          } else {
            cell.classList.add("path");
            cell.textContent = "⬜";
          }
          this.gridDiv.appendChild(cell);
        }
      }
    },
    resetarRobo() {
      const tab = this.tabuleiros[this.faseAtual];
      this.posRobo = { ...tab.inicio, dir: 1 };
      this.desenharGrid();
      if (this.statusSpan) this.statusSpan.textContent = "PRONTO";
    },
    limparAlgoritmo() {
      this.algoritmo = [];
      this.renderizarAlgoritmo();
      this.atualizarContadorBlocos();
    },
    renderizarAlgoritmo() {
      if (!this.algoritmoDiv) return;
      if (this.algoritmo.length === 0) {
        this.algoritmoDiv.innerHTML =
          '<div class="placeholder-algoritmo">🃏 Clique nos blocos para montar seu algoritmo...</div>';
        return;
      }
      this.algoritmoDiv.innerHTML = "";
      this.algoritmo.forEach((bloco, idx) => {
        const div = document.createElement("div");
        div.className = "bloco-montado";
        if (bloco.tipo === "repetir") {
          div.classList.add("repetir");
          div.innerHTML = `
          <div><span>🔂 REPETIR</span> <input type="number" class="repetir-vezes" value="${bloco.vezes}" min="1" max="10" style="width:60px;"> vezes</div>
          <div class="repetir-conteudo">${this.renderizarSubBlocos(bloco.subBlocos)}</div>
          <button class="btn-remover-bloco" data-idx="${idx}">✖️</button>
        `;
          const inputVezes = div.querySelector(".repetir-vezes");
          inputVezes.addEventListener("change", (e) => {
            bloco.vezes = parseInt(e.target.value);
            this.atualizarContadorBlocos();
          });
          const addBtn = document.createElement("button");
          addBtn.textContent = "+ adicionar comando dentro";
          addBtn.className = "btn-sm-outline-warning";
          addBtn.onclick = () => this.mostrarMenuComandos(idx, "repetir");
          div.querySelector(".repetir-conteudo").appendChild(addBtn);
        } else if (bloco.tipo === "se") {
          div.classList.add("condicional");
          div.innerHTML = `
          <div>⚖️ SE <select class="condicao-select" data-idx="${idx}">
            <option value="parede" ${bloco.condicao === "parede" ? "selected" : ""}>PAREDE à frente</option>
            <option value="livre" ${bloco.condicao === "livre" ? "selected" : ""}>LIVRE à frente</option>
            <option value="tesouro" ${bloco.condicao === "tesouro" ? "selected" : ""}>TESOURO à frente</option>
          </select> ENTÃO:</div>
          <div class="entao-conteudo">${this.renderizarSubBlocos(bloco.entao)}</div>
          <div>SENÃO:</div>
          <div class="senao-conteudo">${this.renderizarSubBlocos(bloco.senao)}</div>
          <button class="btn-remover-bloco" data-idx="${idx}">✖️</button>
        `;
          const select = div.querySelector(".condicao-select");
          select.addEventListener("change", (e) => {
            bloco.condicao = e.target.value;
            this.atualizarContadorBlocos();
          });
          const addEntao = document.createElement("button");
          addEntao.textContent = "+ dentro do ENTÃO";
          addEntao.className = "btn-sm-outline-warning";
          addEntao.onclick = () => this.mostrarMenuComandos(idx, "entao");
          div.querySelector(".entao-conteudo").appendChild(addEntao);
          const addSenao = document.createElement("button");
          addSenao.textContent = "+ dentro do SENÃO";
          addSenao.className = "btn-sm-outline-warning";
          addSenao.onclick = () => this.mostrarMenuComandos(idx, "senao");
          div.querySelector(".senao-conteudo").appendChild(addSenao);
        } else {
          let texto = "";
          if (bloco.tipo === "andar1") texto = "➡️ ANDAR 1";
          else if (bloco.tipo === "andar2") texto = "🏃 ANDAR 2";
          else if (bloco.tipo === "virarDireita") texto = "🔄 VIRAR DIREITA";
          else if (bloco.tipo === "virarEsquerda") texto = "🔁 VIRAR ESQUERDA";
          div.innerHTML = `<span>${texto}</span><button class="btn-remover-bloco" data-idx="${idx}">✖️</button>`;
        }
        this.algoritmoDiv.appendChild(div);
      });
      document.querySelectorAll(".btn-remover-bloco").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-idx"));
          if (!isNaN(idx)) {
            this.algoritmo.splice(idx, 1);
            this.renderizarAlgoritmo();
            this.atualizarContadorBlocos();
          }
        });
      });
    },
    renderizarSubBlocos(sub) {
      if (!sub || sub.length === 0)
        return "<div class='text-muted'>[vazio]</div>";
      return sub
        .map(
          (b) =>
            `<div class='bloco-montado-sub'>${this.nomeBloco(b.tipo)}</div>`,
        )
        .join("");
    },
    nomeBloco(tipo) {
      const nomes = {
        andar1: "➡️ ANDAR 1",
        andar2: "🏃 ANDAR 2",
        virarDireita: "🔄 VIRAR DIREITA",
        virarEsquerda: "🔁 VIRAR ESQUERDA",
        repetir: "🔂 REPETIR",
        se: "⚖️ SE/SENÃO",
      };
      return nomes[tipo] || tipo;
    },
    // MENU PARA ESCOLHER O TIPO DE BLOCO AO ADICIONAR DENTRO DE REPETIR OU CONDICIONAL
    mostrarMenuComandos(paiIdx, lado) {
      const opcoes = [
        { tipo: "andar1", nome: "➡️ ANDAR 1", desc: "1 casa à frente" },
        { tipo: "andar2", nome: "🏃 ANDAR 2", desc: "2 casas à frente" },
        {
          tipo: "virarDireita",
          nome: "🔄 VIRAR DIREITA",
          desc: "gira 90° direita",
        },
        {
          tipo: "virarEsquerda",
          nome: "🔁 VIRAR ESQUERDA",
          desc: "gira 90° esquerda",
        },
        { tipo: "repetir", nome: "🔂 REPETIR", desc: "loop com blocos dentro" },
        { tipo: "se", nome: "⚖️ SE/SENÃO", desc: "condicional aninhada" },
      ];
      let modalHtml = `<div id="menuComandoModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:10000;">
      <div style="background:#1e2a1a; padding:24px; border-radius:24px; border:3px solid #ffb347; max-width:500px; width:90%;">
        <h3 style="color:#ffb347; margin-bottom:16px;">➕ Escolha o comando para adicionar</h3>
        <div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center;">`;
      opcoes.forEach((op) => {
        modalHtml += `<button class="btn-cmd-opcao" data-tipo="${op.tipo}" style="background:#2c3e2b; border:2px solid #4a7c3f; border-radius:16px; padding:12px; cursor:pointer; min-width:130px;">
        <div style="font-size:1.8rem;">${op.nome.split(" ")[0]}</div>
        <div style="color:#ffb347; font-weight:bold;">${op.nome}</div>
        <div style="font-size:0.7rem; color:#ccc;">${op.desc}</div>
      </button>`;
      });
      modalHtml += `</div><button id="btnFecharModalComando" style="background:#e74c3c; border:none; border-radius:40px; padding:8px 20px; margin-top:20px; color:white; cursor:pointer;">FECHAR</button>
      </div></div>`;
      document.body.insertAdjacentHTML("beforeend", modalHtml);
      const modal = document.getElementById("menuComandoModal");
      const fechar = () => modal?.remove();
      document.querySelectorAll(".btn-cmd-opcao").forEach((btn) => {
        btn.addEventListener("click", () => {
          const tipo = btn.getAttribute("data-tipo");
          let novoBloco = null;
          if (tipo === "repetir")
            novoBloco = { tipo: "repetir", vezes: 3, subBlocos: [] };
          else if (tipo === "se")
            novoBloco = {
              tipo: "se",
              condicao: "parede",
              entao: [],
              senao: [],
            };
          else novoBloco = { tipo: tipo };
          const pai = this.algoritmo[paiIdx];
          if (pai.tipo === "repetir") {
            if (!pai.subBlocos) pai.subBlocos = [];
            pai.subBlocos.push(novoBloco);
          } else if (pai.tipo === "se") {
            if (lado === "entao") {
              if (!pai.entao) pai.entao = [];
              pai.entao.push(novoBloco);
            } else if (lado === "senao") {
              if (!pai.senao) pai.senao = [];
              pai.senao.push(novoBloco);
            }
          }
          this.renderizarAlgoritmo();
          this.atualizarContadorBlocos();
          fechar();
        });
      });
      document
        .getElementById("btnFecharModalComando")
        ?.addEventListener("click", fechar);
    },
    adicionarBloco(tipo) {
      if (tipo === "repetir") {
        this.algoritmo.push({ tipo: "repetir", vezes: 3, subBlocos: [] });
      } else if (tipo === "se") {
        this.algoritmo.push({
          tipo: "se",
          condicao: "parede",
          entao: [],
          senao: [],
        });
      } else {
        this.algoritmo.push({ tipo: tipo });
      }
      this.renderizarAlgoritmo();
      this.atualizarContadorBlocos();
    },
    contarBlocos(lista) {
      let total = 0;
      for (const bloco of lista) {
        total++;
        if (bloco.tipo === "repetir" && bloco.subBlocos)
          total += this.contarBlocos(bloco.subBlocos);
        if (bloco.tipo === "se") {
          total += this.contarBlocos(bloco.entao || []);
          total += this.contarBlocos(bloco.senao || []);
        }
      }
      return total;
    },
    atualizarContadorBlocos() {
      const total = this.contarBlocos(this.algoritmo);
      if (this.blocosUsadosSpan) this.blocosUsadosSpan.textContent = total;
    },
    async executarAlgoritmo() {
      if (this.algoritmo.length === 0) {
        this.mostrarMensagem("⚠️ Monte um algoritmo primeiro!", true);
        return;
      }
      this.resetarRobo();
      this.mostrarMensagem("🤖 Executando...");
      if (this.statusSpan) this.statusSpan.textContent = "EXECUTANDO...";
      let sucesso = true,
        erroMsg = "";
      for (const bloco of this.algoritmo) {
        const res = await this.executarBloco(bloco);
        if (!res.sucesso) {
          sucesso = false;
          erroMsg = res.erro;
          break;
        }
      }
      const chegou = this.verificarTesouro();
      if (sucesso && chegou) {
        const total = parseInt(this.blocosUsadosSpan.textContent);
        const recordeAtual = this.recordes[this.faseAtual];
        if (!recordeAtual || total < recordeAtual) {
          this.recordes[this.faseAtual] = total;
          this.salvarRecordes();
          this.atualizarRecordesDisplay();
          this.mostrarMensagem(
            `🎉 PARABÉNS! NOVO RECORDE com ${total} blocos!`,
          );
        } else this.mostrarMensagem(`🎉 Completou a fase com ${total} blocos!`);
        if (this.statusSpan) this.statusSpan.textContent = "VITÓRIA! 🏆";
      } else {
        this.mostrarMensagem(
          `🐛 BUG! ${erroMsg || "Robô não alcançou o tesouro."}`,
          true,
        );
        if (this.statusSpan) this.statusSpan.textContent = "BUGOU! 💥";
      }
    },
    async executarBloco(bloco) {
      const tab = this.tabuleiros[this.faseAtual];
      if (bloco.tipo === "andar1") return this.mover(1, tab);
      if (bloco.tipo === "andar2") return this.mover(2, tab);
      if (bloco.tipo === "virarDireita") {
        this.posRobo.dir = (this.posRobo.dir + 1) % 4;
        await this.delay(100);
        this.desenharGrid();
        return { sucesso: true };
      }
      if (bloco.tipo === "virarEsquerda") {
        this.posRobo.dir = (this.posRobo.dir + 3) % 4;
        await this.delay(100);
        this.desenharGrid();
        return { sucesso: true };
      }
      if (bloco.tipo === "repetir") {
        for (let i = 0; i < bloco.vezes; i++) {
          for (const sub of bloco.subBlocos || []) {
            const res = await this.executarBloco(sub);
            if (!res.sucesso) return res;
          }
        }
        return { sucesso: true };
      }
      if (bloco.tipo === "se") {
        let frente = this.obterFrente(tab);
        let condicaoAtiva = false;
        if (bloco.condicao === "parede") condicaoAtiva = frente === "🧱";
        else if (bloco.condicao === "livre")
          condicaoAtiva =
            frente !== "🧱" && frente !== "🏆" && frente !== undefined;
        else if (bloco.condicao === "tesouro") condicaoAtiva = frente === "🏆";
        const blocosExecutar = condicaoAtiva
          ? bloco.entao || []
          : bloco.senao || [];
        for (const sub of blocosExecutar) {
          const res = await this.executarBloco(sub);
          if (!res.sucesso) return res;
        }
        return { sucesso: true };
      }
      return { sucesso: false, erro: "Comando inválido" };
    },
    obterFrente(tab) {
      let nx = this.posRobo.x,
        ny = this.posRobo.y;
      if (this.posRobo.dir === 0) nx--;
      else if (this.posRobo.dir === 1) ny++;
      else if (this.posRobo.dir === 2) nx++;
      else ny--;
      if (nx < 0 || nx >= tab.size || ny < 0 || ny >= tab.size)
        return undefined;
      return tab.grid[nx][ny];
    },
    async mover(passos, tab) {
      for (let p = 0; p < passos; p++) {
        let nx = this.posRobo.x,
          ny = this.posRobo.y;
        if (this.posRobo.dir === 0) nx--;
        else if (this.posRobo.dir === 1) ny++;
        else if (this.posRobo.dir === 2) nx++;
        else ny--;
        if (nx < 0 || nx >= tab.size || ny < 0 || ny >= tab.size)
          return { sucesso: false, erro: "Saiu do tabuleiro!" };
        if (tab.grid[nx][ny] === "🧱")
          return { sucesso: false, erro: "Bateu em uma parede!" };
        this.posRobo.x = nx;
        this.posRobo.y = ny;
        await this.delay(150);
        this.desenharGrid();
      }
      return { sucesso: true };
    },
    verificarTesouro() {
      const tab = this.tabuleiros[this.faseAtual];
      return tab.grid[this.posRobo.x][this.posRobo.y] === "🏆";
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    mostrarMensagem(msg, isErro = false) {
      if (this.mensagemDiv) {
        this.mensagemDiv.innerHTML = `<i class="bi bi-robot"></i> ${msg}`;
        this.mensagemDiv.classList.toggle("erro", isErro);
        setTimeout(() => this.mensagemDiv.classList.remove("erro"), 3000);
      }
    },
    atualizarRecordesDisplay() {
      if (this.recordeSpans[1])
        this.recordeSpans[1].textContent = this.recordes[1] || "---";
      if (this.recordeSpans[2])
        this.recordeSpans[2].textContent = this.recordes[2] || "---";
      if (this.recordeSpans[3])
        this.recordeSpans[3].textContent = this.recordes[3] || "---";
      const melhor = Math.min(
        ...[this.recordes[1], this.recordes[2], this.recordes[3]].filter(
          (v) => v !== null,
        ),
      );
      if (this.melhorMarcaSpan)
        this.melhorMarcaSpan.textContent = melhor !== Infinity ? melhor : "--";
    },
    configurarEventos() {
      document.querySelectorAll(".fase-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const fase = parseInt(btn.getAttribute("data-fase"));
          if (fase) this.carregarFase(fase);
        });
      });
      document.querySelectorAll(".bloco-comando").forEach((bloco) => {
        bloco.addEventListener("click", () => {
          const tipo = bloco.getAttribute("data-tipo");
          if (tipo) this.adicionarBloco(tipo);
        });
      });
      document
        .getElementById("limparAlgoritmo")
        ?.addEventListener("click", () => this.limparAlgoritmo());
      document
        .getElementById("executarAlgoritmo")
        ?.addEventListener("click", () => this.executarAlgoritmo());
      document
        .getElementById("resetarRobo")
        ?.addEventListener("click", () => this.resetarRobo());
      document.getElementById("dicaFase")?.addEventListener("click", () => {
        const dicas = {
          1: "Use REPETIR 4 vezes com ANDAR 1.",
          2: "Use SE PAREDE à frente ENTÃO VIRAR DIREITA SENÃO ANDAR 1.",
          3: "Combine REPETIR com SE/SENÃO para desviar das paredes.",
        };
        this.mostrarMensagem(`💡 DICA: ${dicas[this.faseAtual]}`);
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

  // ========== 5. MÓDULO MENU ==========
  const MenuModule = {
    highlightCurrentPage() {
      const currentPath =
        window.location.pathname.split("/").pop() || "a1index.html";
      const navLinks = document.querySelectorAll(".menu-robomestre .nav-link");
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === currentPath) link.classList.add("active");
        else link.classList.remove("active");
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
    RoboDecisoes.init(); // NOVO JOGO
    RodapeModule.init();
    MenuModule.init();

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
