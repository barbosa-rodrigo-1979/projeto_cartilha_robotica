// ==================================================
// ROBÔ ENTREGADOR - 2º ANO 4º BIMESTRE
// CIDADE DOS CONDICIONAIS - VERSÃO ENTREGAS
// ==================================================

// ==================================================
// CERTIFICADO - 2º ANO 4º BIMESTRE
// Adaptado do modelo_certificado.js
// ==================================================

(function () {
  "use strict";

  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robo_entregador_certificados_2ano_bim4",

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

      // Verifica se está na página correta
      if (
        !document.getElementById("listaAlunos") &&
        !document.querySelector(".cadastro-alunos")
      ) {
        console.log(
          "⏳ CertificadoModule: página não identificada, ignorando...",
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

      console.log("✅ [CertificadoModule] Pronto!");
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

      // Eventos
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

    escapeHtml(texto) {
      if (!texto) return "";
      return texto.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
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
            <h3>🏆 CERTIFICADO - ROBÔ ENTREGADOR</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>2º ANO - ROBÓTICA EDUCACIONAL - 4º BIMESTRE</strong><br>
            📦 CIDADE DOS CONDICIONAIS<br>
            🔁 SE, ENTÃO, SENÃO, QUANDO, REPITA, E, OU</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"SE a cidade funcionou, ENTÃO a gente festejou; SENÃO, a gente debugou!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô ZIG</div>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO - ROBÔ ENTREGADOR</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>2º ANO - ROBÓTICA EDUCACIONAL - 4º BIMESTRE</strong><br>
            📦 CIDADE DOS CONDICIONAIS</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"SE a cidade funcionou, ENTÃO a gente festejou; SENÃO, a gente debugou!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô ZIG</div>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 2º Ano</title>
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

  // Inicializar após o DOM
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => CertificadoModule.init(), 200);
  });

  window.CertificadoModule = CertificadoModule;
})();

// ==================================================
// MOTOR DO ROBÔ ENTREGADOR - VERSÃO INTERATIVA
// Módulo de Simulação da Cidade dos Condicionais
// ==================================================
(function () {
  "use strict";

  const RoboEntregadorModule = {
    gridSize: 5,
    currentStep: 0,
    semaforoVerde: false,
    timer: null,
    status: "parado", // parado, rodando, gameover, sucesso

    // Rota pré-configurada no mapa para interceptar todos os testes de lógica
    path: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1, type: "semaforo" },
      { x: 2, y: 1 },
      { x: 2, y: 2, type: "obstaculo" },
      { x: 3, y: 2 },
      { x: 3, y: 3, type: "buraco" },
      { x: 4, y: 3 },
      { x: 4, y: 4, type: "destino" },
    ],

    elementos: {},

    init() {
      // Verifica se a interface do simulador está presente na tela
      if (!document.getElementById("grid-simulador")) return;

      console.log("📦 [RoboEntregadorModule] Inicializando Cidade Virtual...");
      this.cacheElementos();
      this.configurarEventos();
      this.renderizarGrid();
    },

    cacheElementos() {
      this.elementos.grid = document.getElementById("grid-simulador");
      this.elementos.console = document.getElementById("console-logs");
      this.elementos.btnSinal = document.getElementById("btn-mudar-sinal");
      this.elementos.txtSinal = document.getElementById("txt-sinal-status");
      this.elementos.btnIniciar = document.getElementById("btn-jogo-iniciar");
      this.elementos.btnPasso = document.getElementById("btn-jogo-passo");
      this.elementos.btnReiniciar =
        document.getElementById("btn-jogo-reiniciar");
      this.elementos.selSemaforo = document.getElementById("regra-semaforo");
      this.elementos.selObstaculo = document.getElementById("regra-obstaculo");
      this.elementos.selBuraco = document.getElementById("regra-buraco");
    },

    configurarEventos() {
      this.elementos.btnSinal?.addEventListener("click", () =>
        this.alternarSemaforo(),
      );
      this.elementos.btnIniciar?.addEventListener("click", () =>
        this.iniciarSimulacao(),
      );
      this.elementos.btnPasso?.addEventListener("click", () =>
        this.executarProximoPasso(),
      );
      this.elementos.btnReiniciar?.addEventListener("click", () =>
        this.reiniciarSimulacao(),
      );
    },

    alternarSemaforo() {
      this.semaforoVerde = !this.semaforoVerde;
      if (this.elementos.txtSinal) {
        if (this.semaforoVerde) {
          this.elementos.txtSinal.textContent = "SEMÁFORO: VERDE";
          this.elementos.txtSinal.className = "badge bg-success p-2";
          this.printLog(
            "🚦 Evento Externo: Alguém apertou o botão. Semáforo mudou para VERDE!",
          );
        } else {
          this.elementos.txtSinal.textContent = "SEMÁFORO: VERMELHO";
          this.elementos.txtSinal.className = "badge bg-danger p-2";
          this.printLog(
            "🚦 Evento Externo: Tempo esgotado! Semáforo mudou para VERMELHO!",
          );
        }
      }
      this.renderizarGrid();
    },

    printLog(msg) {
      if (this.elementos.console) {
        this.elementos.console.innerHTML += `<div>🤖 &gt; ${msg}</div>`;
        this.elementos.console.scrollTop = this.elementos.console.scrollHeight;
      }
    },

    renderizarGrid() {
      if (!this.elementos.grid) return;
      this.elementos.grid.innerHTML = "";

      const posAtual = this.path[this.currentStep] || { x: 0, y: 0 };

      for (let y = 0; y < this.gridSize; y++) {
        for (let x = 0; x < this.gridSize; x++) {
          const celula = document.createElement("div");
          celula.style.background = "rgba(255, 255, 255, 0.05)";
          celula.style.border = "1px solid rgba(74, 124, 63, 0.25)";
          celula.style.borderRadius = "8px";
          celula.style.display = "flex";
          celula.style.justifyContent = "center";
          celula.style.alignItems = "center";
          celula.style.fontSize = "1.4rem";
          celula.style.transition = "all 0.2s ease";

          // Elementos Estáticos do Cenário Urbano Maker
          if (x === 4 && y === 4) {
            celula.textContent = "🏠";
            celula.style.background = "rgba(46, 204, 113, 0.15)";
          } else if (x === 1 && y === 1) {
            celula.textContent = this.semaforoVerde ? "🟢" : "🔴";
            celula.style.background = "rgba(0, 0, 0, 0.25)";
          } else if (x === 2 && y === 2) {
            celula.textContent = "📦";
            celula.style.background = "rgba(230, 126, 34, 0.15)";
          } else if (x === 3 && y === 3) {
            celula.textContent = "🕳️";
            celula.style.background = "rgba(142, 68, 173, 0.15)";
          }

          // Injeção visual do Robô ZIG na célula da sua posição atual
          if (x === posAtual.x && y === posAtual.y) {
            celula.textContent = "🤖";
            celula.style.background = "rgba(255, 179, 71, 0.4)";
            celula.style.boxShadow = "0 0 12px #ffb347";
          }

          this.elementos.grid.appendChild(celula);
        }
      }
    },

    iniciarSimulacao() {
      if (this.status === "rodando") return;
      if (this.status === "gameover" || this.status === "sucesso") {
        this.reiniciarSimulacao();
      }

      this.status = "rodando";
      this.printLog(
        "🚀 Iniciando motores autônomos! Rodando verificação condicional...",
      );
      this.timer = setInterval(() => {
        this.executarProximoPasso();
      }, 1400);
    },

    executarProximoPasso() {
      if (this.status === "gameover" || this.status === "sucesso") {
        this.printLog(
          "⚠️ O ciclo terminou. Clique em 'Reiniciar' para rearmar o sistema.",
        );
        clearInterval(this.timer);
        return;
      }

      if (this.currentStep >= this.path.length - 1) {
        this.finalizarSucesso();
        return;
      }

      const proximoAlvo = this.path[this.currentStep + 1];

      // 🛑 VALIDAÇÃO DE CONDICIONAIS: SEMÁFORO (Semana 34)
      if (proximoAlvo.type === "semaforo") {
        const regraSinal = this.elementos.selSemaforo?.value || "parar";
        if (!this.semaforoVerde && regraSinal === "parar") {
          this.printLog(
            "🚦 [LOGICA] SE vermelho ENTÃO espere. Robô ZIG freou e está aguardando o Semáforo ficar Verde!",
          );
          return; // Trava a execução sem avançar o passo
        } else if (!this.semaforoVerde && regraSinal === "ignorar") {
          this.printLog(
            "💥 [CAOS URBANO] SE vermelho ENTÃO ignore! O robô cruzou voando no vermelho e quase atropelou o fiscal!",
          );
        } else {
          this.printLog(
            "🟢 [LOGICA] SE verde ENTÃO prossiga. Caminho limpo pelo cruzamento.",
          );
        }
      }

      // 📦 VALIDAÇÃO DE CONDICIONAIS: CAIXA DE LEITE (Semana 32)
      if (proximoAlvo.type === "obstaculo") {
        const regraObs = this.elementos.selObstaculo?.value || "virar";
        if (regraObs === "bater") {
          this.currentStep++;
          this.renderizarGrid();
          this.printLog(
            "💥 [BUG!] SE obstáculo ENTÃO seguir reto... BUM! ZIG bateu direto na caixa de leite! Fita crepe arrebentada. Chame o mecânico.",
          );
          this.status = "gameover";
          clearInterval(this.timer);
          return;
        } else {
          this.printLog(
            "↪️ [LÓGICA] SE caixa de leite ENTÃO desvie. Robô fez um contorno limpo no papelão!",
          );
        }
      }

      // 🕳️ VALIDAÇÃO DE CONDICIONAIS: BURACO DA MINHOCA (Semana 31)
      if (proximoAlvo.type === "buraco") {
        const regraBuraco = this.elementos.selBuraco?.value || "desviar";
        if (regraBuraco === "cair") {
          this.currentStep++;
          this.renderizarGrid();
          this.printLog(
            "🌀 [LOOP INFINITO] QUANDO ver buraco ENTÃO cair... Splat! Robô ZIG caiu no buraco da minhoca e foi parar na lixeira de sucata!",
          );
          this.status = "gameover";
          clearInterval(this.timer);
          return;
        } else {
          this.printLog(
            "✨ [LÓGICA] QUANDO ver buraco ENTÃO saltar! Acionando molas imaginárias. Passou raspando!",
          );
        }
      }

      // Executa a movimentação efetiva para a próxima célula livre do grid
      this.currentStep++;
      this.renderizarGrid();
      this.printLog(
        `Movendo para coordenada urbana: (${this.path[this.currentStep].x}, ${this.path[this.currentStep].y})...`,
      );

      if (this.path[this.currentStep].type === "destino") {
        this.finalizarSucesso();
      }
    },

    finalizarSucesso() {
      this.status = "sucesso";
      clearInterval(this.timer);
      this.printLog(
        "🏆 SUCESSO DE ENTREGA! Pacote entregue na casa do cliente! SE a maquete funcionou, ENTÃO o 2º ano festejou! 🎉",
      );
      alert(
        "🤖 Parabéns! Seu código condicional funcionou perfeitamente. Aluno promovido a Mestre do SE-ENTÃO-SENÃO!",
      );
    },

    reiniciarSimulacao() {
      clearInterval(this.timer);
      this.currentStep = 0;
      this.status = "parado";
      this.semaforoVerde = false;
      if (this.elementos.txtSinal) {
        this.elementos.txtSinal.textContent = "SEMÁFORO: VERMELHO";
        this.elementos.txtSinal.className = "badge bg-danger p-2";
      }
      if (this.elementos.console) {
        this.elementos.console.innerHTML =
          "[Reiniciado] Modifique os blocos acima e tente novas combinações!";
      }
      this.renderizarGrid();
      this.printLog("🔄 Simulador resetado e reforçado com fita isolante!");
    },
  };

  // Garante a inicialização segura após o carregamento completo da página
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => RoboEntregadorModule.init(), 300);
  });
})();
