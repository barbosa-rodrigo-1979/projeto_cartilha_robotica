// ==================================================
// a3index.js – SCRIPT UNIFICADO PARA O 3º ANO
// Gerencia: cadastro de alunos, certificados,
// contador de bugs, efeitos e interações do rodapé
// Baseado nos anexos: modelo_index.js, modelo_certificado.js,
// modelo_cabecalho.js, modelo_rodape.js
// ==================================================

(function () {
  "use strict";

  // ========== MÓDULO PRINCIPAL ==========
  const RoboMestres3 = {
    inicializado: false,
    bugsEncontrados: 0,
    alunos: [],
    STORAGE_KEY: "robozada_alunos_ano3",

    // Elementos DOM
    elementos: {
      // Certificado
      inputNome: null,
      btnAdicionar: null,
      listaAlunos: null,
      contadorAlunos: null,
      btnImprimir: null,
      btnPreview: null,
      previewNome: null,
      previewData: null,
      // Contador bugs / rodapé
      relatorioBugs: null,
    },

    // ========== INICIALIZAÇÃO ==========
    init() {
      if (this.inicializado) return;

      // Verifica se está na página correta (presença do cadastro de alunos)
      if (
        !document.getElementById("listaAlunos") &&
        !document.querySelector(".cadastro-alunos")
      ) {
        console.log("⏳ RoboMestres3: página não identificada, ignorando...");
        return;
      }

      console.log("🎓 [RoboMestres3] Inicializando sistema do 3º ano...");
      this.capturarElementos();
      this.carregarAlunosDoStorage();
      this.configurarEventos();
      this.atualizarListaAlunos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializarContadorBugs();
      this.inicializarRelatorioRodape();
      this.inicializado = true;
      this.dispararEvento("robo3:pronto");
      console.log("✅ [RoboMestres3] Sistema pronto!");
    },

    // ========== CAPTURA ELEMENTOS ==========
    capturarElementos() {
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimir = document.getElementById(
        "btnImprimirCertificados",
      );
      this.elementos.btnPreview = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
      this.elementos.relatorioBugs = document.getElementById("relatorioBugs");
    },

    // ========== CONTADOR DE BUGS (localStorage + exibição) ==========
    inicializarContadorBugs() {
      try {
        const salvo = localStorage.getItem("robo3_contador_bugs");
        this.bugsEncontrados = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        this.bugsEncontrados = 0;
      }
      this.atualizarDisplayBugs();
    },

    salvarContadorBugs() {
      try {
        localStorage.setItem(
          "robo3_contador_bugs",
          this.bugsEncontrados.toString(),
        );
      } catch (e) {
        console.warn("Não foi possível salvar contador");
      }
    },

    atualizarDisplayBugs() {
      if (this.elementos.relatorioBugs) {
        this.elementos.relatorioBugs.innerText = this.bugsEncontrados;
        this.animarAtualizacaoRodape();
      }
    },

    incrementarBugs(incremento = 1, mensagem = "") {
      this.bugsEncontrados += incremento;
      this.salvarContadorBugs();
      this.atualizarDisplayBugs();
      if (mensagem) this.adicionarLogDebug(mensagem);
      return this.bugsEncontrados;
    },

    resetarBugs() {
      this.bugsEncontrados = 0;
      this.salvarContadorBugs();
      this.atualizarDisplayBugs();
      this.animarResetRodape();
    },

    animarAtualizacaoRodape() {
      const rel = this.elementos.relatorioBugs;
      if (rel) {
        rel.classList.add("atualizando");
        setTimeout(() => rel.classList.remove("atualizando"), 300);
      }
    },

    animarResetRodape() {
      const footer = document.querySelector(".footer-robotico");
      if (footer) {
        footer.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => (footer.style.animation = ""), 300);
      }
    },

    adicionarLogDebug(mensagem) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        const span = document.createElement("span");
        span.style.fontSize = "0.65rem";
        span.style.opacity = "0.7";
        span.innerHTML = `<br>[DEBUG] ${mensagem}`;
        linhaErro.appendChild(span);
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      } else {
        console.log("[DEBUG]", mensagem);
      }
    },

    // ========== RELATÓRIO DO RODAPÉ (sincronização com outros módulos) ==========
    inicializarRelatorioRodape() {
      // Escuta eventos de bug vindos de possíveis outros módulos
      document.addEventListener("robo:bug", (e) => {
        const inc = e.detail?.incremento || 1;
        this.incrementarBugs(inc, e.detail?.mensagem || "Bug encontrado!");
      });
      document.addEventListener("robo:resetBugs", () => this.resetarBugs());
      document.addEventListener("robo:vitoria", () => {
        this.adicionarLogDebug(
          "🎉 Vitória registrada! Parabéns programadores!",
        );
      });
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
      this.dispararEvento("robo3:alunos_atualizados", {
        total: this.alunos.length,
      });
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
      this.incrementarBugs(0, `Novo aluno adicionado: ${nome}`); // apenas log
    },

    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        const nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarListaAlunos();
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

    atualizarListaAlunos() {
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

      // Eventos dos botões dinâmicos
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

    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimir) {
        this.elementos.btnImprimir.disabled = this.alunos.length === 0;
      }
      if (this.elementos.btnPreview) {
        const nomePreview = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreview.disabled =
          nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
    },

    atualizarPreviewData() {
      if (this.elementos.previewData) {
        const hoje = new Date().toLocaleDateString("pt-BR");
        this.elementos.previewData.textContent = hoje;
      }
    },

    // ========== CERTIFICADOS (impressão) ==========
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
      <head><meta charset="UTF-8"><title>Certificados RobôMestres - 3º Ano</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: white; padding: 20px; }
        .print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media print { body { padding: 0; margin: 0; } .print-grid { gap: 15px; } @page { size: A4; margin: 0.8cm; } }
      </style></head>
      <body><div class="print-grid">${cardsHTML}</div>
      <script>window.onload = function() { setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 200); };<\/script>
      </body></html>`;
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

    // ========== EVENTOS ==========
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
      if (this.elementos.btnImprimir) {
        this.elementos.btnImprimir.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      }
      if (this.elementos.btnPreview) {
        this.elementos.btnPreview.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
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
  };

  // Inicialização quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => RoboMestres3.init());
  } else {
    RoboMestres3.init();
  }

  // Expor globalmente para uso em outros scripts (se necessário)
  window.RoboMestres3 = RoboMestres3;
})();

// Adiciona keyframes dinâmicos para o curto-circuito (caso não exista no CSS)
(function addMissingKeyframes() {
  if (!document.querySelector("#robo3-keyframes")) {
    const style = document.createElement("style");
    style.id = "robo3-keyframes";
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
    `;
    document.head.appendChild(style);
  }
})();
