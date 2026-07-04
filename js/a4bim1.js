// ================================================================
// a4bim1.js – COMPLETO E CORRIGIDO (4º ANO – BIMESTRE 1)
// ================================================================

(function () {
  "use strict";

  // ================================================================
  // 1. MENU (modelo_menu_bim.js)
  // ================================================================
  function highlightCurrentPage() {
    const currentPath =
      window.location.pathname.split("/").pop() || "a4bim1.html";
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

  function consoleWelcome() {
    console.log(
      "%c🤖 ROBOZADA 4000 - 4º ANO BIMESTRE 1 ATIVO",
      "color: #ffb347; font-size: 14px; font-family: monospace;",
    );
    console.log(
      "%c🪆 Aninhar é colocar um comando dentro do outro! Eventos concorrentes? Robô anda e canta ao mesmo tempo!",
      "color: #9bbc7b;",
    );
  }

  // ================================================================
  // 2. CABEÇALHO (modelo_cabecalho.js)
  // ================================================================
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
      console.log("%c🤖 [CABEÇALHO] Módulo inicializado", "color: #ffb347;");
    },

    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    salvarContador() {
      try {
        localStorage.setItem(
          "cabecalho_contador_bugs",
          this.contadorBugs.toString(),
        );
      } catch (e) {}
    },

    atualizarDisplayContador() {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      }
      if (this.relatorioElement) {
        this.relatorioElement.innerText = this.contadorBugs;
      }
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
      return this.contadorBugs;
    },

    getContadorBugs() {
      return this.contadorBugs;
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
      });
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
      });
    },
  };

  // ================================================================
  // 3. RODAPÉ (modelo_rodape.js)
  // ================================================================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,

    init() {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [RODAPÉ] Módulo inicializado", "color: #ffb347;");
    },

    atualizarRelatorio() {
      if (!this.relatorioElement) return;
      let contadorBugs = 0;
      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      ) {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
        try {
          const salvo = localStorage.getItem("cabecalho_contador_bugs");
          contadorBugs = salvo ? parseInt(salvo) : 0;
        } catch (e) {
          contadorBugs = 0;
        }
      }
      this.relatorioElement.innerText = contadorBugs;
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

  // ================================================================
  // 4. APRESENTAÇÃO (modelo_apresentacao_bimestre.js)
  // ================================================================
  const ApresentacaoModule = {
    inicializado: false,

    init() {
      if (this.inicializado) return;
      if (
        !document.getElementById("carta-abertura") &&
        !document.querySelector(".carta-container")
      ) {
        console.log("⏳ ApresentacaoModule: ignorado.");
        return;
      }
      console.log("🎭 [ApresentacaoModule] Inicializando...");
      this.efeitoDigitacaoCarta();
      this.efeitoBrilhoTabela();
      this.efeitoFlutuacaoBadges();
      this.inicializado = true;
    },

    efeitoDigitacaoCarta() {
      const cartaContainer = document.querySelector(".carta-container");
      if (!cartaContainer) return;
      const paragrafos = cartaContainer.querySelectorAll(".carta-texto, p");
      paragrafos.forEach((p, index) => {
        p.style.opacity = "0";
        p.style.transform = "translateY(10px)";
        p.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        setTimeout(
          () => {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          },
          200 + index * 150,
        );
      });
    },

    efeitoBrilhoTabela() {
      const tabelas = document.querySelectorAll(
        "#mapeamento table, #plano-sintetico table",
      );
      tabelas.forEach((tabela) => {
        if (!tabela) return;
        const linhas = tabela.querySelectorAll("tbody tr");
        linhas.forEach((linha) => {
          linha.addEventListener("mouseenter", () => {
            linha.style.transition = "all 0.2s ease";
            linha.style.backgroundColor = "rgba(255, 180, 71, 0.15)";
            linha.style.transform = "scale(1.01)";
          });
          linha.addEventListener("mouseleave", () => {
            linha.style.backgroundColor = "";
            linha.style.transform = "";
          });
        });
      });
    },

    efeitoFlutuacaoBadges() {
      const badges = document.querySelectorAll(".badge-projeto, .selo-sucata");
      badges.forEach((badge, index) => {
        badge.style.animation = `flutuarBadge ${2 + index * 0.3}s ease-in-out infinite`;
        badge.style.transformOrigin = "center";
      });
    },
  };

  // ================================================================
  // 5. PLANOS DE AULA (modelo_planos_aula.js)
  // ================================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_4ano",
    totalSemanas: 10,
    elementos: {},

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("accordionAulas")) {
        console.log("⏳ PlanosAulaModule: accordion não encontrado.");
        return;
      }
      console.log("📚 [PlanosAulaModule] Inicializando...");
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.inicializado = true;
    },

    capturarElementos() {
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.accordionContainer =
        document.getElementById("accordionAulas");
      if (this.elementos.checkboxes.length === 0) {
        this.elementos.checkboxes = document.querySelectorAll(
          "input[type='checkbox'].semana-check, input.check-concluido",
        );
      }
      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
    },

    salvarProgresso() {
      const concluidas = {};
      this.elementos.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) {
          concluidas[semana] = cb.checked;
        } else {
          const index = Array.from(this.elementos.checkboxes).indexOf(cb);
          concluidas[`semana_${index + 1}`] = cb.checked;
        }
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) {
        this.atualizarBarraProgresso();
        return;
      }
      try {
        const concluidas = JSON.parse(salvo);
        this.elementos.checkboxes.forEach((cb, idx) => {
          const semana = cb.getAttribute("data-semana");
          if (semana && concluidas.hasOwnProperty(semana)) {
            cb.checked = concluidas[semana];
          } else if (concluidas.hasOwnProperty(`semana_${idx + 1}`)) {
            cb.checked = concluidas[`semana_${idx + 1}`];
          }
        });
      } catch (e) {
        console.warn("Erro ao carregar progresso:", e);
      }
      this.atualizarBarraProgresso();
    },

    getTotalMarcados() {
      let marcados = 0;
      this.elementos.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      return marcados;
    },

    atualizarBarraProgresso() {
      const marcados = this.getTotalMarcados();
      const percentual =
        this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent =
          Math.round(percentual) + "%";
      }
      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
      }
    },

    expandirTodos() {
      const collapses = document.querySelectorAll(
        "#accordionAulas .accordion-collapse",
      );
      collapses.forEach((collapse) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.show();
          } catch (e) {
            collapse.classList.add("show");
          }
        } else {
          collapse.classList.add("show");
        }
      });
    },

    recolherTodos() {
      const collapses = document.querySelectorAll(
        "#accordionAulas .accordion-collapse",
      );
      collapses.forEach((collapse) => {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
            bsCollapse.hide();
          } catch (e) {
            collapse.classList.remove("show");
          }
        } else {
          collapse.classList.remove("show");
        }
      });
    },

    handleCheckboxChange(e) {
      this.salvarProgresso();
      this.atualizarBarraProgresso();
    },

    configurarEventos() {
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.addEventListener("click", () =>
          this.expandirTodos(),
        );
      }
      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.addEventListener("click", () =>
          this.recolherTodos(),
        );
      }
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
    },
  };

  // ================================================================
  // 6. CERTIFICADO (modelo_certificado.js) – CORRIGIDO
  // ================================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano4",
    elementos: {},

    init() {
      if (this.inicializado) return;
      // Verifica se os elementos do certificado existem
      if (
        !document.getElementById("listaAlunos") &&
        !document.querySelector(".cadastro-alunos")
      ) {
        console.log(
          "⏳ CertificadoModule: ignorado (elementos não encontrados).",
        );
        return;
      }
      console.log("🎓 [CertificadoModule] Inicializando...");
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializado = true;
    },

    carregarElementos() {
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimirTodos = document.getElementById(
        "btnImprimirCertificados",
      );
      this.elementos.btnPreviewAluno =
        document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
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
        this.elementos.btnPreviewAluno.disabled =
          nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
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
      this.atualizarLista();
      if (this.elementos.inputNome) {
        this.elementos.inputNome.value = "";
        this.elementos.inputNome.focus();
      }
      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        const nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (
          this.elementos.previewNome &&
          this.elementos.previewNome.textContent === nomeRemovido
        ) {
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
        listaUl.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
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
      // Reatribuir eventos
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._selectHandler);
        btn.addEventListener("click", (e) => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._removeHandler);
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });
      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
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
            <h3>🏆 CERTIFICADO DE MESTRE DO ANINHAMENTO - NÍVEL 4</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🪆 ANINHAMENTO | 🔄 EVENTOS CONCORRENTES | 🧠 OPERADORES LÓGICOS | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Aninhar é colocar um comando dentro do outro! Eventos concorrentes? Robô anda e canta!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        </div>
        <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body>
      </html>`;
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nomeAluno, dataAtual);
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
        alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir.");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO ANINHAMENTO - NÍVEL 4</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🪆 ANINHAMENTO | 🔄 EVENTOS CONCORRENTES | 🧠 OPERADORES LÓGICOS</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Aninhar é colocar um comando dentro do outro!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 4º Ano</title>
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

    configurarEventos() {
      if (this.elementos.btnAdicionar) {
        this.elementos.btnAdicionar.addEventListener("click", () =>
          this.adicionarAluno(),
        );
      }
      if (this.elementos.inputNome) {
        this.elementos.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      }
      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      }
      if (this.elementos.btnPreviewAluno) {
        this.elementos.btnPreviewAluno.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
      }
    },
  };

  // ================================================================
  // 7. JOGO BUG BATTLE – VERSÃO SIMPLIFICADA E FUNCIONAL
  // ================================================================
  const BugBattleModule = {
    inicializado: false,
    rodadaAtual: 0,
    totalRodadas: 5,
    vidas: 3,
    estrelas: 0,
    combo: 0,
    maxCombo: 0,
    respostaCorreta: null,
    bloqueado: false,
    _timeoutMsg: null,
    elementos: {},

    roboDatabase: [
      {
        nome: "Robô Zé",
        icone: "🤖",
        codigo: [
          { texto: "REPITA 3 VEZES", bug: false },
          { texto: "  ANDAR", bug: false },
          { texto: "  SE sensor ENTÃO", bug: true },
          { texto: "    APITAR", bug: false },
        ],
        pergunta: "Qual é o bug principal?",
        opcoes: ["Loop infinito", "SE mal aninhado", "Evento concorrente"],
        resposta: 1,
      },
      {
        nome: "Diva Robótica",
        icone: "💃",
        codigo: [
          { texto: "REPITA PARA SEMPRE", bug: true },
          { texto: "  ANDAR", bug: false },
          { texto: "  SE toque ENTÃO", bug: false },
          { texto: "    APITAR", bug: false },
        ],
        pergunta: "O que pode travar o robô?",
        opcoes: ["Loop infinito", "SE mal aninhado", "Falta de SENÃO"],
        resposta: 0,
      },
      {
        nome: "Robô Filósofo",
        icone: "🧠",
        codigo: [
          { texto: "SE luz ENTÃO", bug: false },
          { texto: "  REPITA 2 VEZES", bug: false },
          { texto: "    ANDAR", bug: false },
          { texto: "APITAR", bug: true },
        ],
        pergunta: "Qual comando está fora do lugar?",
        opcoes: ["REPITA", "APITAR", "SE"],
        resposta: 1,
      },
      {
        nome: "Robô Trovão",
        icone: "⚡",
        codigo: [
          { texto: "QUANDO tecla espaço", bug: false },
          { texto: "  ANDAR", bug: false },
          { texto: "QUANDO sensor toque", bug: false },
          { texto: "  APITAR", bug: true },
        ],
        pergunta: "Qual problema pode ocorrer?",
        opcoes: ["Loop infinito", "Eventos concorrentes", "Sintaxe errada"],
        resposta: 1,
      },
      {
        nome: "Robô Zumbi",
        icone: "🧟",
        codigo: [
          { texto: "REPITA 10 VEZES", bug: false },
          { texto: "  SE sensor1 ENTÃO", bug: false },
          { texto: "    REPITA 5 VEZES", bug: false },
          { texto: "      ANDAR", bug: false },
          { texto: "  SENÃO", bug: true },
        ],
        pergunta: "O que está errado na estrutura?",
        opcoes: ["SENÃO solto", "Loop infinito", "Falta de variável"],
        resposta: 0,
      },
    ],

    init() {
      if (this.inicializado) return;
      const container = document.getElementById("jogo-bugbattle");
      if (!container) {
        console.warn(
          "⏳ BugBattleModule: elemento #jogo-bugbattle não encontrado. Ignorando.",
        );
        return;
      }
      console.log("🎤 [BugBattleModule] Inicializando o show...");
      this.capturarElementos();
      if (this.elementos.bbCodigo) {
        this.configurarEventos();
        this.iniciarRodada(0);
        this.inicializado = true;
      } else {
        console.warn(
          "⚠️ BugBattleModule: elementos essenciais não encontrados. Abortando.",
        );
      }
    },

    capturarElementos() {
      const ids = [
        "bbEstrelas",
        "bbVidas",
        "bbCombo",
        "bbRodada",
        "bbRoboNome",
        "bbRoboIcone",
        "bbRoboStatus",
        "bbCodigo",
        "bbPergunta",
        "bbOpcoes",
        "bbMensagem",
        "bbBtnProximo",
        "bbBtnReset",
        "bbBtnDica",
      ];
      ids.forEach((id) => {
        this.elementos[id] = document.getElementById(id);
        if (!this.elementos[id]) {
          console.warn(`⚠️ Elemento #${id} não encontrado.`);
        }
      });
    },

    iniciarRodada(indice) {
      if (indice >= this.totalRodadas) {
        this.finalizarJogo();
        return;
      }

      this.rodadaAtual = indice;
      this.bloqueado = false;
      const robo = this.roboDatabase[indice];
      if (!robo) {
        console.error(`Robô da rodada ${indice} não encontrado.`);
        return;
      }

      this.respostaCorreta = robo.resposta;
      this.atualizarPlacar();

      if (this.elementos.bbRoboNome)
        this.elementos.bbRoboNome.textContent = robo.nome;
      if (this.elementos.bbRoboIcone)
        this.elementos.bbRoboIcone.textContent = robo.icone;
      if (this.elementos.bbRoboStatus) {
        this.elementos.bbRoboStatus.textContent = "DESAFIO";
        this.elementos.bbRoboStatus.className = "badge bg-warning text-dark";
      }

      if (this.elementos.bbCodigo) {
        this.elementos.bbCodigo.innerHTML = "";
        robo.codigo.forEach((linha, idx) => {
          const span = document.createElement("span");
          span.className = "linha";
          if (linha.bug) {
            span.classList.add("bug");
            span.dataset.indice = idx;
            span.title = "Clique aqui se achar o bug!";
            // Adiciona um evento de clique apenas para destacar, mas a resposta é pelos botões
            span.addEventListener("click", () => {
              if (!this.bloqueado) {
                // Apenas um feedback visual
                this.mostrarMensagem(
                  `🔍 Você clicou na linha ${idx + 1}. Agora escolha a opção correta!`,
                  "info",
                );
              }
            });
          }
          span.textContent = linha.texto;
          this.elementos.bbCodigo.appendChild(span);
        });
        console.log(
          "Linhas com bug:",
          document.querySelectorAll(".linha.bug").length,
        );
      }

      if (this.elementos.bbPergunta)
        this.elementos.bbPergunta.textContent = robo.pergunta;
      if (this.elementos.bbOpcoes) {
        this.elementos.bbOpcoes.innerHTML = "";
        robo.opcoes.forEach((opcao, idx) => {
          const btn = document.createElement("button");
          btn.className = "btn-opcao";
          btn.textContent = opcao;
          btn.dataset.opcao = idx;
          btn.addEventListener("click", () => this.responder(idx));
          this.elementos.bbOpcoes.appendChild(btn);
        });
        document
          .querySelectorAll(".btn-opcao")
          .forEach((b) => (b.disabled = false));
      }

      this.mostrarMensagem(
        `🎤 Apresentador: "Agora, o robô ${robo.nome}! Encontre o bug!"`,
        "info",
      );

      const destaque = document.querySelector(".robo-destaque");
      if (destaque) {
        destaque.classList.remove("errou", "acertou");
      }
    },

    responder(opcao) {
      if (this.bloqueado) return;
      const robo = this.roboDatabase[this.rodadaAtual];
      if (!robo) return;

      const btns = document.querySelectorAll(".btn-opcao");
      const correta = this.respostaCorreta;

      btns.forEach((b) => (b.disabled = true));
      this.bloqueado = true;

      if (opcao === correta) {
        this.combo++;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        const bonus = 1 + Math.floor(this.combo / 3);
        this.estrelas += bonus;
        this.atualizarPlacar();

        btns[opcao].classList.add("certa");
        document.querySelectorAll(".linha.bug").forEach((el) => {
          el.classList.remove("bug");
          el.classList.add("correta");
        });

        if (this.elementos.bbRoboStatus) {
          this.elementos.bbRoboStatus.textContent = "✅ SALVO!";
          this.elementos.bbRoboStatus.className = "badge bg-success";
        }
        const destaque = document.querySelector(".robo-destaque");
        if (destaque) destaque.classList.add("acertou");

        this.mostrarMensagem(
          `🎉 BOA! Você salvou o ${robo.nome}! +${bonus} estrelas! 🔥`,
          "success",
        );

        setTimeout(() => {
          this.proximoRobo();
        }, 1500);
      } else {
        this.combo = 0;
        this.vidas--;
        this.atualizarPlacar();

        btns[opcao].classList.add("errada");
        btns[correta].classList.add("certa");

        if (this.elementos.bbRoboStatus) {
          this.elementos.bbRoboStatus.textContent = "💥 EXPLODIU!";
          this.elementos.bbRoboStatus.className = "badge bg-danger";
        }
        const destaque = document.querySelector(".robo-destaque");
        if (destaque) destaque.classList.add("errou");

        this.mostrarMensagem(
          `😱 ESTRAGOU! O ${robo.nome} explodiu! Vidas: ${this.vidas}`,
          "erro",
        );

        if (this.vidas <= 0) {
          this.mostrarMensagem(
            "💀 FIM DE JOGO! O público vai embora... Reiniciando...",
            "erro",
          );
          setTimeout(() => {
            this.reiniciarJogo();
          }, 2000);
        } else {
          setTimeout(() => {
            this.proximoRobo();
          }, 1500);
        }
      }
    },

    proximoRobo() {
      this.iniciarRodada(this.rodadaAtual + 1);
    },

    finalizarJogo() {
      this.mostrarMensagem(
        `🏆 SHOW ENCERRADO! Você ganhou ${this.estrelas} estrelas e máximo combo ${this.maxCombo}x! 🎉`,
        "success",
      );
      if (this.elementos.bbBtnProximo)
        this.elementos.bbBtnProximo.disabled = true;
      if (this.elementos.bbRoboStatus) {
        this.elementos.bbRoboStatus.textContent = "FIM!";
        this.elementos.bbRoboStatus.className = "badge bg-warning text-dark";
      }
      document
        .querySelectorAll(".btn-opcao")
        .forEach((b) => (b.disabled = true));
    },

    reiniciarJogo() {
      this.vidas = 3;
      this.estrelas = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.rodadaAtual = 0;
      this.atualizarPlacar();
      if (this.elementos.bbBtnProximo)
        this.elementos.bbBtnProximo.disabled = false;
      this.iniciarRodada(0);
      this.mostrarMensagem("🔄 Novo show! Plateia, vamos nessa!", "info");
    },

    atualizarPlacar() {
      if (this.elementos.bbEstrelas)
        this.elementos.bbEstrelas.textContent = this.estrelas;
      if (this.elementos.bbVidas) {
        this.elementos.bbVidas.textContent = "❤️".repeat(
          Math.max(0, this.vidas),
        );
      }
      if (this.elementos.bbCombo)
        this.elementos.bbCombo.textContent = this.combo + "x";
      if (this.elementos.bbRodada) {
        const total = Math.min(this.rodadaAtual + 1, this.totalRodadas);
        this.elementos.bbRodada.textContent = `${total}/${this.totalRodadas}`;
      }
    },

    mostrarMensagem(texto, tipo) {
      const el = this.elementos.bbMensagem;
      if (!el) return;
      el.innerHTML = `<i class="bi bi-mic-fill"></i> ${texto}`;
      el.className = `mensagem-jogo ${tipo === "erro" ? "erro" : tipo === "success" ? "sucesso" : ""}`;
      if (tipo !== "erro") {
        clearTimeout(this._timeoutMsg);
        this._timeoutMsg = setTimeout(() => {
          el.className = "mensagem-jogo";
        }, 4000);
      }
    },

    darDica() {
      const robo = this.roboDatabase[this.rodadaAtual];
      if (!robo) {
        this.mostrarMensagem(
          "💡 Dica: preste atenção nos aninhamentos e eventos!",
          "info",
        );
        return;
      }
      const bugLinha = robo.codigo.findIndex((l) => l.bug);
      if (bugLinha !== -1) {
        this.mostrarMensagem(
          `💡 Dica: preste atenção na linha ${bugLinha + 1} do código!`,
          "info",
        );
      } else {
        this.mostrarMensagem(
          "💡 Dica: reveja os aninhamentos e eventos concorrentes!",
          "info",
        );
      }
    },

    configurarEventos() {
      if (this.elementos.bbBtnProximo) {
        this.elementos.bbBtnProximo.addEventListener("click", () =>
          this.proximoRobo(),
        );
      }
      if (this.elementos.bbBtnReset) {
        this.elementos.bbBtnReset.addEventListener("click", () =>
          this.reiniciarJogo(),
        );
      }
      if (this.elementos.bbBtnDica) {
        this.elementos.bbBtnDica.addEventListener("click", () =>
          this.darDica(),
        );
      }
    },
  };

  // ================================================================
  // 8. INICIALIZAÇÃO GERAL
  // ================================================================
  function initAll() {
    try {
      if (typeof highlightCurrentPage === "function") highlightCurrentPage();
      if (typeof consoleWelcome === "function") consoleWelcome();

      // Inicializa módulos (cada um verifica sua própria existência)
      if (window.CabecalhoModule) CabecalhoModule.init();
      if (window.RodapeModule) RodapeModule.init();
      if (window.ApresentacaoModule) ApresentacaoModule.init();
      if (window.PlanosAulaModule) PlanosAulaModule.init();
      if (window.CertificadoModule) CertificadoModule.init();
      if (window.BugBattleModule) BugBattleModule.init();

      // Atualiza rodapé
      setTimeout(() => {
        if (
          window.RodapeModule &&
          typeof RodapeModule.atualizarRelatorio === "function"
        ) {
          RodapeModule.atualizarRelatorio();
        }
      }, 300);
    } catch (e) {
      console.error("Erro na inicialização geral:", e);
    }
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // Expor módulos globalmente
  window.CabecalhoModule = CabecalhoModule;
  window.RodapeModule = RodapeModule;
  window.ApresentacaoModule = ApresentacaoModule;
  window.PlanosAulaModule = PlanosAulaModule;
  window.CertificadoModule = CertificadoModule;
  window.BugBattleModule = BugBattleModule;

  console.log(
    "%c✅ TODOS OS MÓDULOS CARREGADOS! Show do Bug Battle pronto!",
    "color: #2ecc71; font-size: 16px; font-weight: bold;",
  );
})();
