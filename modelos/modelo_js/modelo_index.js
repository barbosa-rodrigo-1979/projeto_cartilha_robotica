// ==================================================
// modelo_index.js
// Módulo Base do Template Principal
// Gerencia: loop simples, contador variável, detetive bugs, cadastro alunos
// ==================================================

(function () {
  "use strict";

  const ModeloModule = {
    // Estado
    inicializado: false,
    bugsEncontrados: 0,

    // Armazenamento
    alunos: [],
    STORAGE_KEY: "robozada_alunos_ano3",

    // Elementos DOM
    elementos: {
      // Loop Simples
      loopMsg: null,
      btnLoop: null,
      contaLoop: null,
      // Variável
      contadorVariavel: null,
      btnIncrementar: null,
      btnZerar: null,
      valorDisplay: null,
      // Detetive Bugs
      bugMsg: null,
      btnAcharBug: null,
      bugCount: null,
      // Cadastro
      inputNome: null,
      btnAdicionar: null,
      listaAlunos: null,
      contadorAlunos: null,
      btnImprimir: null,
      btnPreview: null,
      previewNome: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se a página é a principal (com os elementos necessários)
      const possuiElementos =
        document.getElementById("btnLoopExemplo") ||
        document.getElementById("btnAcharBug") ||
        document.getElementById("listaAlunos");

      if (!possuiElementos) {
        console.log("⏳ ModeloModule: página não identificada, ignorando...");
        return;
      }

      console.log("🎓 [ModeloModule] Inicializando Template Base...");

      this.capturarElementos();
      this.carregarAlunosDoStorage();
      this.configurarEventos();
      this.atualizarListaAlunos();
      this.atualizarContadorBugs();
      this.atualizarPreviewData();

      this.inicializado = true;
      this.dispararEvento("modelo:pronto");

      console.log("✅ [ModeloModule] Template Base pronto!");
    },

    // ========== CAPTURA ELEMENTOS ==========
    capturarElementos() {
      // Loop Simples
      this.elementos.loopMsg = document.getElementById("loopMessage");
      this.elementos.btnLoop = document.getElementById("btnLoopExemplo");
      this.elementos.contaLoop = document.getElementById("contaLoop");

      // Variável Contadora
      this.elementos.valorDisplay = document.getElementById("valorDisplay");
      this.elementos.btnIncrementar = document.getElementById("btnIncrementar");
      this.elementos.btnZerar = document.getElementById("btnZerar");
      this.elementos.contadorVariavel = document.getElementById("contadorVariavel");

      // Detetive Bugs
      this.elementos.bugMsg = document.getElementById("bugMessage");
      this.elementos.btnAcharBug = document.getElementById("btnAcharBug");
      this.elementos.bugCount = document.getElementById("bugCount");

      // Cadastro Certificados
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimir = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreview = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
    },

    // ========== LOOP SIMPLES ==========
    inicializarLoopSimples() {
      if (!this.elementos.btnLoop) return;

      this.elementos.btnLoop.addEventListener("click", () => {
        let contador = 0;
        const mensagens = [
          "🔄 Loop 1: Repetindo ação...",
          "🔄 Loop 2: Ainda repetindo...",
          "🔄 Loop 3: Quase lá...",
          "🔄 Loop 4: Última vez!",
          "✅ LOOP CONCLUÍDO! Repetimos 4 vezes!"
        ];

        const intervalo = setInterval(() => {
          if (contador >= mensagens.length) {
            clearInterval(intervalo);
            return;
          }

          if (this.elementos.loopMsg) {
            this.elementos.loopMsg.innerHTML = mensagens[contador];
          }
          contador++;
        }, 800);
      });
    },

    // ========== VARIÁVEL CONTADORA ==========
    inicializarContadorVariavel() {
      if (!this.elementos.btnIncrementar) return;

      let valor = 0;

      const atualizarDisplay = () => {
        if (this.elementos.valorDisplay) {
          this.elementos.valorDisplay.textContent = valor;
        }
        if (this.elementos.contadorVariavel) {
          this.elementos.contadorVariavel.textContent = valor;
        }
      };

      this.elementos.btnIncrementar.addEventListener("click", () => {
        valor++;
        atualizarDisplay();
      });

      if (this.elementos.btnZerar) {
        this.elementos.btnZerar.addEventListener("click", () => {
          valor = 0;
          atualizarDisplay();
        });
      }

      atualizarDisplay();
    },

    // ========== DETETIVE DE BUGS ==========
    inicializarDetetiveBugs() {
      if (!this.elementos.btnAcharBug) return;

      const bugs = [
        { codigo: "console.log('Olá mundo'", erro: "Faltou fechar parênteses!" },
        { codigo: "repita 3 vezs {", erro: "Escreveu 'vezs' em vez de 'vezes'" },
        { codigo: "variavel = 10; variavel = 'texto'", erro: "Mudou o tipo da variável!" }
      ];

      let bugIndex = 0;

      this.elementos.btnAcharBug.addEventListener("click", () => {
        const bug = bugs[bugIndex % bugs.length];
        this.bugsEncontrados++;

        if (this.elementos.bugMsg) {
          this.elementos.bugMsg.innerHTML = `🐛 BUG #${this.bugsEncontrados}: ${bug.codigo}<br>❌ ERRO: ${bug.erro}`;
          this.elementos.bugMsg.classList.add("bug-detectado");
          setTimeout(() => {
            this.elementos.bugMsg.classList.remove("bug-detectado");
          }, 1000);
        }

        bugIndex++;
        this.atualizarContadorBugs();
      });
    },

    atualizarContadorBugs() {
      if (this.elementos.bugCount) {
        this.elementos.bugCount.textContent = this.bugsEncontrados;
      }

      // Atualiza também no rodapé se existir
      const relatorioBugs = document.getElementById("relatorioBugs");
      if (relatorioBugs) {
        relatorioBugs.textContent = this.bugsEncontrados;
      }
    },

    // ========== CADASTRO DE ALUNOS ==========
    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      }

      // Alunos exemplo
      if (!this.alunos || this.alunos.length === 0) {
        this.alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA", "MARIA CLARA SILVA"];
        this.salvarAlunos();
      }
    },

    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
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
        this.atualizarListaAlunos();

        // Limpa preview se necessário
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

      // Eventos dos botões
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleSelecionar);
        btn.addEventListener("click", (e) => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });

      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleRemover);
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimir) {
        this.elementos.btnImprimir.disabled = this.alunos.length === 0;
      }
      if (this.elementos.btnPreview) {
        const nomePreview = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreview.disabled = nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
    },

    atualizarPreviewData() {
      const previewData = document.getElementById("previewData");
      if (previewData) {
        const hoje = new Date().toLocaleDateString("pt-BR");
        previewData.textContent = hoje;
      }
    },

    // ========== IMPRESSÃO DE CERTIFICADOS ==========
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
      const nomeSelecionado = this.elementos.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificado - ${this.escapeHtml(nomeAluno)}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Courier New', monospace; background: #e0e0e0; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }
          .preview-container { max-width: 800px; width: 100%; margin: 0 auto; }
          .preview-actions { text-align: center; margin-bottom: 20px; position: sticky; top: 10px; z-index: 100; }
          .btn-print, .btn-close { background: #ffb347; border: none; border-radius: 40px; padding: 10px 24px; font-weight: bold; cursor: pointer; margin: 0 8px; }
          .btn-close { background: #555; color: white; }
          .certificado { border: 3px solid #ffb347; border-radius: 48px 24px 48px 24px; padding: 30px; text-align: center; background: #fffef7; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
          .certificado h3 { color: #ffb347; font-family: 'Press Start 2P', cursive; font-size: 0.9rem; margin-bottom: 20px; }
          .certificado strong.nome { font-size: 22px; display: block; margin: 15px 0; color: #2c5e1f; background: #fff0cc; padding: 12px; border-radius: 40px; }
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
            <strong class="nome">${this.escapeHtml(nomeAluno)}</strong>
            <p>concluiu com êxito o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr>
            <p>RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:11px; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 3.0</div>
          </div>
        </div>
        <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body>
      </html>`;

      const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
      }
    },

    // ========== CONFIGURA EVENTOS ==========
    configurarEventos() {
      // Loop
      if (this.elementos.btnLoop) {
        this.elementos.btnLoop.addEventListener("click", () => this.inicializarLoopSimples());
        this.inicializarLoopSimples();
      }

      // Variável
      if (this.elementos.btnIncrementar) {
        this.inicializarContadorVariavel();
      }

      // Detetive Bugs
      if (this.elementos.btnAcharBug) {
        this.inicializarDetetiveBugs();
      }

      // Cadastro
      if (this.elementos.btnAdicionar) {
        this.elementos.btnAdicionar.addEventListener("click", () => this.adicionarAluno());
      }

      if (this.elementos.inputNome) {
        this.elementos.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      }

      if (this.elementos.btnImprimir) {
        this.elementos.btnImprimir.addEventListener("click", () => this.imprimirTodosCertificados());
      }

      if (this.elementos.btnPreview) {
        this.elementos.btnPreview.addEventListener("click", () => this.previewAlunoSelecionado());
      }
    },

    // ========== UTILITÁRIOS ==========
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

    getAlunos() {
      return [...this.alunos];
    },
  };

  // ========== REGISTRA NO CONTROLADOR ==========
  if (window.Controlador && typeof window.Controlador.registrarModulo === "function") {
    window.Controlador.registrarModulo("modelo", ModeloModule);
  } else {
    // Fallback: aguarda controlador ou inicializa sozinho
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("modelo", ModeloModule);
      }
    });

    // Timeout fallback
    setTimeout(() => {
      if (!ModeloModule.inicializado) {
        ModeloModule.init();
      }
    }, 800);
  }

  window.ModeloModule = ModeloModule;
})();
