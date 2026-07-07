// ==================================================
// ANO5INDEX_HARDWARE.JS
// Script unificado para o 5º Ano - Hardware
// Copiado integralmente dos anexos .js
// ==================================================

// ==================================================
// modelo_cabecalho.js - LÓGICA DO CABEÇALHO REBELDE
// Módulo específico para gerenciar o cabeçalho robótico
// ==================================================

(function () {
  "use strict";

  const CabecalhoModule = {
    // Estado
    contadorBugs: 0,
    inicializado: false,

    // Elementos DOM
    contadorElement: null,
    relatorioElement: null,

    /**
     * Inicializa o módulo do cabeçalho
     */
    init() {
      if (this.inicializado) return;

      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.contadorElement) {
        // Inicializa contador com valor salvo ou 0
        this.contadorBugs = this.carregarContador();
        this.atualizarDisplayContador();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log(
        "%c🤖 [CABEÇALHO] Módulo inicializado com sucesso",
        "color: #ffb347; font-size: 12px; font-weight: bold;",
      );
    },

    /**
     * Carrega o contador do localStorage
     */
    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    /**
     * Salva o contador no localStorage
     */
    salvarContador() {
      try {
        localStorage.setItem(
          "cabecalho_contador_bugs",
          this.contadorBugs.toString(),
        );
      } catch (e) {
        console.warn("[CABEÇALHO] Não foi possível salvar o contador", e);
      }
    },

    /**
     * Atualiza o display do contador na tela
     */
    atualizarDisplayContador() {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      }
      if (this.relatorioElement) {
        this.relatorioElement.innerText = this.contadorBugs;
      }
    },

    /**
     * Incrementa o contador de bugs
     * @param {number} incremento - Quantidade a incrementar (padrão: 1)
     */
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarContador();
      return this.contadorBugs;
    },

    /**
     * Reseta o contador de bugs para 0
     */
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarReset();
      return this.contadorBugs;
    },

    /**
     * Obtém o valor atual do contador
     */
    getContadorBugs() {
      return this.contadorBugs;
    },

    /**
     * Anima o contador quando incrementado
     */
    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(() => {
          if (this.contadorElement) {
            this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
            setTimeout(() => {
              if (this.contadorElement) {
                this.contadorElement.style.animation = "";
              }
            }, 300);
          }
        }, 10);
      }
    },

    /**
     * Anima o reset do contador
     */
    animarReset() {
      const painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (painel) painel.style.animation = "";
        }, 300);
      }
    },

    /**
     * Atualiza a mensagem da linha de erro
     * @param {string} mensagem - Nova mensagem a exibir
     */
    atualizarMensagemErro(mensagem) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        linhaErro.innerHTML = `<i class="bi bi-terminal"></i> ${mensagem}`;
        // Anima a mensagem nova
        linhaErro.style.animation = "piscaLed 0.2s ease-in-out";
        setTimeout(() => {
          if (linhaErro) linhaErro.style.animation = "";
        }, 400);
      }
    },

    /**
     * Adiciona uma mensagem temporária no log de debug
     * @param {string} texto - Mensagem a adicionar
     */
    adicionarLogDebug(texto) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        const htmlAtual = linhaErro.innerHTML;
        linhaErro.innerHTML = `${htmlAtual}<br><span style="font-size:0.65rem; opacity:0.7;">[DEBUG] ${texto}</span>`;
        // Scroll suave para o final
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    /**
     * Configura os eventos globais que o cabeçalho escuta
     */
    configurarEventos() {
      // Escuta evento de bug vindo de outros módulos (ex: jogo)
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
        if (evento.detail?.mensagem) {
          this.adicionarLogDebug(evento.detail.mensagem);
        }
      });

      // Escuta evento de reset do jogo para resetar contador (opcional)
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
        this.atualizarMensagemErro(
          "[SISTEMA] Contador de bugs reiniciado! Preparem-se para novos erros! 🤖",
        );
      });

      // Escuta evento de vitória (mensagem diferente)
      document.addEventListener("robo:vitoria", () => {
        this.adicionarLogDebug(
          "🎉 Vitória registrada! Parabéns programadores!",
        );
      });
    },

    /**
     * Adiciona um efeito visual de curto-circuito no cabeçalho
     */
    efeitoCurtoCircuito() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },

    /**
     * Adiciona efeito de reboot no cabeçalho
     */
    efeitoReboot() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "reboot 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },
  };

  // Registrar no ControladorRobomestres se existir
  if (
    typeof window.ControladorRobomestres !== "undefined" &&
    window.ControladorRobomestres
  ) {
    window.ControladorRobomestres.registrar("CabecalhoModule", CabecalhoModule);
  }

  // Fallback: expõe globalmente
  window.CabecalhoModule = CabecalhoModule;

  // Auto-inicializa se o controlador não existir
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        CabecalhoModule.init(),
      );
    } else {
      CabecalhoModule.init();
    }
  }

  // ========== ANIMAÇÕES ADICIONAIS PARA O CSS (keyframes não declarados no CSS) ==========
  // Adiciona keyframes dinamicamente se não existirem
  const style = document.createElement("style");
  style.textContent = `
        @keyframes curtoCircuito {
            0%, 100% { background-color: #2c3e2b; }
            10%, 30%, 50% { background-color: #ffcc00; }
            20%, 40% { background-color: #ff6600; }
        }

        @keyframes reboot {
            0% { opacity: 1; transform: scale(1); }
            30% { opacity: 0.5; transform: scale(0.98); }
            60% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }

        @keyframes piscaLed {
            0%, 100% { opacity: 1; text-shadow: 0 0 5px #00ff00; }
            50% { opacity: 0.4; text-shadow: 0 0 15px #ffcc00; }
        }
    `;
  if (!document.querySelector("#cabecalho-animacoes-dinamicas")) {
    style.id = "cabecalho-animacoes-dinamicas";
    document.head.appendChild(style);
  }
})();

// ==================================================
// modelo_rodape.js - LÓGICA DO RODAPÉ REBELDE
// Módulo específico para gerenciar o rodapé robótico
// ==================================================

(function () {
  "use strict";

  const RodapeModule = {
    // Estado
    inicializado: false,

    // Elementos DOM
    relatorioElement: null,

    /**
     * Inicializa o módulo do rodapé
     */
    init() {
      if (this.inicializado) return;

      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log(
        "%c🤖 [RODAPÉ] Módulo inicializado com sucesso",
        "color: #ffb347; font-size: 12px; font-weight: bold;",
      );
    },

    /**
     * Atualiza o relatório de bugs com o valor atual do contador
     */
    atualizarRelatorio() {
      if (!this.relatorioElement) return;

      // Tenta obter o contador do módulo de cabeçalho
      let contadorBugs = 0;

      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      ) {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
        // Fallback: tenta ler do localStorage
        try {
          const salvo = localStorage.getItem("cabecalho_contador_bugs");
          contadorBugs = salvo ? parseInt(salvo) : 0;
        } catch (e) {
          contadorBugs = 0;
        }
      }

      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    /**
     * Anima a atualização do contador no rodapé
     */
    animarAtualizacao() {
      if (this.relatorioElement) {
        this.relatorioElement.classList.add("atualizando");
        setTimeout(() => {
          if (this.relatorioElement) {
            this.relatorioElement.classList.remove("atualizando");
          }
        }, 300);
      }
    },

    /**
     * Configura os eventos globais que o rodapé escuta
     */
    configurarEventos() {
      // Escuta evento de bug vindo de outros módulos
      document.addEventListener("robo:bug", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de reset do contador
      document.addEventListener("robo:resetBugs", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de atualização do cabeçalho
      document.addEventListener("cabecalho:contador_atualizado", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de vitória (apenas para log)
      document.addEventListener("robo:vitoria", () => {
        if (this.relatorioElement) {
          // Pisca o contador em verde para indicar sucesso
          const corOriginal = this.relatorioElement.style.color;
          this.relatorioElement.style.color = "#2ecc71";
          setTimeout(() => {
            if (this.relatorioElement) {
              this.relatorioElement.style.color = "";
            }
          }, 500);
        }
      });

      // Se o controlador estiver disponível, escuta seu evento de pronto
      if (window.ControladorRobomestres) {
        window.addEventListener("controlador:pronto", () => {
          this.atualizarRelatorio();
        });
      }
    },

    /**
     * Sincroniza manualmente o relatório com o cabeçalho
     */
    sincronizar() {
      this.atualizarRelatorio();
    },

    /**
     * Adiciona uma mensagem personalizada ao relatório
     * @param {string} mensagem - Mensagem extra a ser exibida
     */
    adicionarMensagemRelatorio(mensagem) {
      if (this.relatorioElement) {
        const htmlAtual = this.relatorioElement.innerHTML;
        this.relatorioElement.innerHTML = `${htmlAtual}<span class="mensagem-extra ms-2" style="font-size:0.7rem; opacity:0.7;">${mensagem}</span>`;
        setTimeout(() => {
          const msgExtra =
            this.relatorioElement.querySelector(".mensagem-extra");
          if (msgExtra) msgExtra.remove();
        }, 3000);
      }
    },
  };

  // ========== REGISTRO NO CONTROLADOR ==========
  if (
    typeof window.ControladorRobomestres !== "undefined" &&
    window.ControladorRobomestres
  ) {
    window.ControladorRobomestres.registrar("RodapeModule", RodapeModule);
  }

  // Fallback: expõe globalmente
  window.RodapeModule = RodapeModule;

  // Auto-inicializa se o controlador não existir
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => RodapeModule.init());
    } else {
      RodapeModule.init();
    }
  }
})();

// ==================================================
// modelo_certificado.js
// Módulo específico para a página de certificados
// ==================================================

(function () {
  "use strict";

  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano5_hardware",

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

    // ========== INICIALIZAÇÃO ==========
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

      this.dispararEvento("certificado:pronto");
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
      this.dispararEvento("certificado:alunos_atualizados", {
        total: this.alunos.length,
      });
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
        btn.removeEventListener("click", this._handleSelect);
        btn.addEventListener("click", (e) => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });

      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleRemove);
        btn.addEventListener("click", (e) => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
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
            <h3>🏆 CERTIFICADO DE MESTRE DO HARDWARE - NÍVEL 5</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>5º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔧 HARDWARE | 📡 SENSORES | 🚀 ATUADORES | 📶 COMUNICAÇÃO | 🤖 PROJETO AUTÔNOMO</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Placa não é prato! Resistor não é de academia! LED não é abreviação de ledo!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 5.0</div>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO HARDWARE - NÍVEL 5</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>5º ANO - ROBÓTICA EDUCACIONAL</strong><br>
            🔧 HARDWARE | 📡 SENSORES | 🚀 ATUADORES | 📶 COMUNICAÇÃO | 🤖 PROJETO AUTÔNOMO</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Placa não é prato! Resistor não é de academia! LED não é abreviação de ledo!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 5.0</div>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados RobôMestres - 5º Ano Hardware</title>
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
  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("certificado", CertificadoModule);
  } else {
    window.addEventListener("controlador:pronto", () => {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("certificado", CertificadoModule);
      }
    });
    setTimeout(() => {
      if (!CertificadoModule.inicializado) CertificadoModule.init();
    }, 800);
  }

  window.CertificadoModule = CertificadoModule;
})();

// ==================================================
// modelo_menu_bim.js – Script leve para o menu bimestral
// ==================================================

(function () {
  "use strict";

  // Marca o link do menu correspondente à página atual como 'active'
  function highlightCurrentPage() {
    const currentPath =
      window.location.pathname.split("/").pop() || "ano5index_hardware.html";
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

  // Pequeno efeito de boas-vindas no console (apenas para debug)
  function consoleWelcome() {
    console.log(
      "%c🤖 ROBOZADA 3000 - 5º ANO HARDWARE ATIVO",
      "color: #ffb347; font-size: 14px; font-family: monospace;",
    );
    console.log(
      "%c🔧 Placa não é prato! Resistor não é de academia! LED não é abreviação de ledo!",
      "color: #9bbc7b;",
    );
  }

  // Adiciona tooltips simples nos ícones do rodapé (opcional)
  function initTooltips() {
    const devEmails = document.querySelectorAll(".dev-contato a");
    if (devEmails.length) {
      devEmails.forEach((email) => {
        email.setAttribute("title", "Clique para enviar e-mail");
        email.style.cursor = "pointer";
      });
    }
  }

  // Executa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      highlightCurrentPage();
      consoleWelcome();
      initTooltips();
    });
  } else {
    highlightCurrentPage();
    consoleWelcome();
    initTooltips();
  }
})();
