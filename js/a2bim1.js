// ==================================================
// a2bim1.js – Scripts unificados para 2º Ano – 1º Bimestre
// Baseado nos modelos: cabecalho, menu_bim, apresentacao_bimestre,
// planos_aula, certificado, fechamento_bimestre, rodape
// ==================================================

(function () {
  "use strict";

  // ==========================================================
  // 1. CABEÇALHO – CONTADOR DE BUGS
  // ==========================================================
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
      console.log("%c🤖 [CABEÇALHO] Módulo inicializado", "color: #ffb347; font-weight: bold;");
    },

    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) { return 0; }
    },

    salvarContador() {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs.toString());
      } catch (e) { }
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
      this.animarContador();
      return this.contadorBugs;
    },

    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarReset();
      return this.contadorBugs;
    },

    getContadorBugs() { return this.contadorBugs; },

    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(() => {
          if (this.contadorElement) {
            this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
            setTimeout(() => {
              if (this.contadorElement) this.contadorElement.style.animation = "";
            }, 300);
          }
        }, 10);
      }
    },

    animarReset() {
      const painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => { if (painel) painel.style.animation = ""; }, 300);
      }
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
      });
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
      });
    }
  };

  // ==========================================================
  // 2. MENU – DESTAQUE DA PÁGINA ATUAL
  // ==========================================================
  function highlightCurrentPage() {
    const currentPath = window.location.pathname.split("/").pop() || "a2bim1.html";
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

  // ==========================================================
  // 3. PLANOS DE AULA – PROGRESSO E ACORDEÃO
  // ==========================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_2ano_bim1",
    totalSemanas: 10,
    elementos: {
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
    },

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("accordionAulas")) {
        console.log("⏳ PlanosAulaModule: accordion não encontrado");
        return;
      }
      console.log("📚 [PlanosAulaModule] Inicializando...");
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.inicializado = true;
    },

    capturarElementos() {
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
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
      } catch (e) { }
      this.atualizarBarraProgresso();
    },

    getTotalMarcados() {
      let marcados = 0;
      this.elementos.checkboxes.forEach((cb) => { if (cb.checked) marcados++; });
      return marcados;
    },

    atualizarBarraProgresso() {
      const marcados = this.getTotalMarcados();
      const percentual = this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent = Math.round(percentual) + "%";
      }
      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
      }
    },

    handleCheckboxChange(e) {
      this.salvarProgresso();
      this.atualizarBarraProgresso();
    },

    configurarEventos() {
      this.elementos.checkboxes.forEach((cb) => {
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
      // Botões expandir/recolher (usando Bootstrap Collapse)
      const expandirBtn = document.getElementById("expandirTodosBtn");
      const recolherBtn = document.getElementById("recolherTodosBtn");
      if (expandirBtn) {
        expandirBtn.addEventListener("click", () => {
          document.querySelectorAll("#accordionAulas .accordion-collapse").forEach(el => {
            if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
              const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el);
              bsCollapse.show();
            } else {
              el.classList.add("show");
            }
          });
        });
      }
      if (recolherBtn) {
        recolherBtn.addEventListener("click", () => {
          document.querySelectorAll("#accordionAulas .accordion-collapse").forEach(el => {
            if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
              const bsCollapse = bootstrap.Collapse.getOrCreateInstance(el);
              bsCollapse.hide();
            } else {
              el.classList.remove("show");
            }
          });
        });
      }
    }
  };

  // ==========================================================
  // 4. CERTIFICADO
  // ==========================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_2ano_bim1",
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
      if (this.inicializado) return;
      if (!document.getElementById("listaAlunos") && !document.querySelector(".cadastro-alunos")) {
        console.log("⏳ CertificadoModule: página não identificada");
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
      this.elementos.btnImprimirTodos = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
    },

    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try { this.alunos = JSON.parse(salvos); } catch (e) { this.alunos = []; }
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
        const nomePreview = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreviewAluno.disabled = nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
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
      this.elementos.inputNome.value = "";
      this.elementos.inputNome.focus();
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
      // Eventos
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });
      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nomeAluno, dataAtual);
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
      <head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:#e0e0e0; min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
        .preview-container { max-width:800px; width:100%; margin:0 auto; }
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
            <h3>🏆 CERTIFICADO DE PROGRAMAÇÃO CONDICIONAL – NÍVEL 1</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>2º ANO – ROBÓTICA EDUCACIONAL</strong><br>
            🔁 SE → ENTÃO → SENÃO | 📦 DECISÃO BINÁRIA | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"SE você pensou, ENTÃO você programou. SENÃO, programe de novo, seu preguiçoso."</p>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE PROGRAMAÇÃO CONDICIONAL – NÍVEL 1</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>2º ANO – ROBÓTICA EDUCACIONAL</strong><br>
            🔁 SE → ENTÃO → SENÃO | 📦 DECISÃO BINÁRIA | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"SE você pensou, ENTÃO você programou. SENÃO, programe de novo."</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 3.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Certificados RobôMestres - 2º Ano</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:white; padding:20px; }
        .print-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
        @media print { body { padding:0; margin:0; } .print-grid { gap:15px; } @page { size:A4; margin:0.8cm; } }
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

    escapeHtml(texto) {
      if (!texto) return "";
      return texto.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    }
  };

  // ==========================================================
  // 5. JOGO DO BIMESTRE – DECISOR ROBÓTICO
  // ==========================================================
  const JogoDecisorModule = {
    init() {
      const btnExecutar = document.getElementById("btnExecutarDecisor");
      const resultado = document.getElementById("resultadoDecisor");
      const roboDisplay = document.getElementById("roboDisplay");
      const statusRobo = document.getElementById("statusRobo");
      const caminhoVermelho = document.getElementById("caminhoVermelho");
      const caminhoAzul = document.getElementById("caminhoAzul");

      if (!btnExecutar) return;

      // Definir condição inicial (padrão: vermelho)
      let condicaoAtual = "vermelho";

      // Cliques nos botões de condição
      document.querySelectorAll(".btn-condicao").forEach(btn => {
        btn.addEventListener("click", function () {
          condicaoAtual = this.getAttribute("data-condicao");
          statusRobo.textContent = `Condição: ${condicaoAtual.toUpperCase()} selecionada. Aguardando execução.`;
          resultado.innerHTML = "";
          roboDisplay.textContent = "🤖";
        });
      });

      btnExecutar.addEventListener("click", function () {
        let escolha = "";
        if (condicaoAtual === "vermelho") {
          escolha = caminhoVermelho.value;
        } else if (condicaoAtual === "azul") {
          escolha = caminhoAzul.value;
        } else {
          escolha = "caminho desconhecido";
        }

        // Simula a decisão do robô
        roboDisplay.textContent = "🤖";
        statusRobo.textContent = "Processando decisão...";
        resultado.innerHTML = '<span class="text-warning">⏳ Robô pensando...</span>';

        setTimeout(() => {
          let emoji = escolha === "biscoito" ? "🍪" : "🥕";
          let texto = escolha === "biscoito" ? "BISCOITO!" : "CENOURA!";
          roboDisplay.textContent = `🤖${emoji}`;
          statusRobo.textContent = `Decisão tomada: ${texto}`;
          resultado.innerHTML = `
            <div class="alert alert-success">
              <strong>🎉 O robô escolheu ${texto}</strong><br>
              <small>Condição: ${condicaoAtual.toUpperCase()} → ${escolha.toUpperCase()}</small>
            </div>
          `;
          // Dispara evento de bug (para contador)
          document.dispatchEvent(new CustomEvent("robo:bug", { detail: { incremento: 0 } }));
        }, 800);
      });
    }
  };

  // ==========================================================
  // 6. RODAPÉ – SINCRONIZAÇÃO COM CABEÇALHO
  // ==========================================================
  const RodapeModule = {
    init() {
      const relatorioElement = document.getElementById("relatorioBugs");
      if (relatorioElement) {
        // Atualiza sempre que o cabeçalho mudar
        document.addEventListener("robo:bug", () => {
          if (CabecalhoModule.getContadorBugs) {
            relatorioElement.innerText = CabecalhoModule.getContadorBugs();
          }
        });
        document.addEventListener("robo:resetBugs", () => {
          if (CabecalhoModule.getContadorBugs) {
            relatorioElement.innerText = CabecalhoModule.getContadorBugs();
          }
        });
        // Inicializa
        setTimeout(() => {
          if (CabecalhoModule.getContadorBugs) {
            relatorioElement.innerText = CabecalhoModule.getContadorBugs();
          }
        }, 100);
      }
    }
  };

  // ==========================================================
  // 7. IMPRESSÃO DOS PLANOS DE AULA
  // ==========================================================
  function imprimirPlanosAula() {
    const accordion = document.getElementById('accordionAulas');
    if (!accordion) {
      alert('Nenhum plano de aula encontrado para imprimir.');
      return;
    }

    // Clona o accordion para não interferir na página atual
    const conteudo = accordion.cloneNode(true);

    // Remove checkboxes e botões de interação dentro do clone
    const checkboxes = conteudo.querySelectorAll('.semana-check, .check-concluido, .btn-group, .navbar-toggler');
    checkboxes.forEach(el => el.remove());

    // Abre uma nova janela para impressão
    const win = window.open('', '_blank', 'width=900,height=700,toolbar=yes,scrollbars=yes');
    if (!win) {
      alert('Permita pop-ups para imprimir os planos de aula.');
      return;
    }

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    win.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Planos de Aula - 2º Ano - 1º Bimestre</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" />
      <link rel="stylesheet" href="css/a2bim1.css" />
      <style>
        /* Garantir que a impressão use as regras definidas no CSS */
        body { background: white; padding: 20px; }
        .projeto-header { margin-bottom: 20px; }
        .badge-projeto { display: none; }
        .check-concluido { display: none; }
        .btn-group { display: none; }
        .accordion-button::after { display: none; } /* esconde ícone de seta */
        .accordion-collapse { display: block !important; }
        .accordion-button { cursor: default; background: #627454 !important; color: #ffb347 !important; }
        .accordion-button:focus { box-shadow: none; }
        .accordion-item { border: 1px solid #4a7c3f; margin-bottom: 12px; }
        .semana-card-completo { background: #505e45; border-radius: 12px; padding: 16px; }
        .material-badge { background: #2c3e2b; color: #ebf0eb; }
        .minuto-item { background: #0a0f08; }
        .minuto-tempo { background: #2c3e2b; color: #ffb347; }
        .minuto-descricao { color: #ebf0eb; }
        .table-robotica { background: rgba(30,42,26,0.85); color: #ebf0eb; }
        .table-robotica th { background: #1e2a1a; color: #ffb347; }
        .bg-robocard { background: #2c3e2b; border: 1px solid #ffb347; }
        h5 { color: #ffb347; border-left: 4px solid #ffb347; padding-left: 12px; }
        .projeto-header { background: #1e2a1a; border-left: 8px solid #ffb347; padding: 12px 20px; }
        .projeto-header h2 { color: #ffb347; }
        @media print {
          .accordion-button { background: #627454 !important; color: #ffb347 !important; }
          .semana-card-completo { background: #505e45 !important; }
          .bg-robocard { background: #2c3e2b !important; }
          .projeto-header { background: #1e2a1a !important; }
          body { background: white; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="projeto-header">
          <h2><i class="bi bi-book"></i> 📖 PLANOS DE AULA DETALHADOS</h2>
          <span class="badge-projeto">Impresso em ${dataAtual}</span>
        </div>
        ${conteudo.outerHTML}
      </div>
      <script>
        window.onload = function() {
          window.print();
          // Fecha a janela após impressão (opcional)
          // window.close();
        };
      <\/script>
    </body>
    </html>
  `);
    win.document.close();
  }

  // ==========================================================
  // INICIALIZAÇÃO GERAL
  // ==========================================================
  document.addEventListener("DOMContentLoaded", function () {
    highlightCurrentPage();
    CabecalhoModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    JogoDecisorModule.init();
    RodapeModule.init();

    // Adiciona keyframes dinâmicos se não existirem
    if (!document.querySelector("#dinamic-keyframes")) {
      const style = document.createElement("style");
      style.id = "dinamic-keyframes";
      style.textContent = `
        @keyframes piscaLed {
          0%, 100% { opacity:1; text-shadow:0 0 5px #00ff00; }
          50% { opacity:0.4; text-shadow:0 0 15px #ffcc00; }
        }
        @keyframes curtoCircuito {
          0%, 100% { background-color:#2c3e2b; }
          10%,30%,50% { background-color:#ffcc00; }
          20%,40% { background-color:#ff6600; }
        }
        @keyframes slideInRight {
          from { transform:translateX(100%); opacity:0; }
          to { transform:translateX(0); opacity:1; }
        }
        @keyframes fadeOutRight {
          from { transform:translateX(0); opacity:1; }
          to { transform:translateX(100%); opacity:0; }
        }
      `;
      document.head.appendChild(style);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    // ... código existente ...

    // Botão imprimir planos
    const btnImprimir = document.getElementById('btnImprimirPlanos');
    if (btnImprimir) {
      btnImprimir.addEventListener('click', imprimirPlanosAula);
    }
  });

})();