// ==================================================
// ano4index_hardware.js – SCRIPTS CONSOLIDADOS
// (copiados de modelo_cabecalho.js, modelo_menu.js,
//  modelo_index.js, modelo_certificado.js, modelo_rodape.js)
// ==================================================

// ---------- modelo_cabecalho.js ----------
(function () {
  "use strict";
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
      console.log("%c🤖 [CABEÇALHO] Módulo inicializado", "color:#ffb347;font-weight:bold;");
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
      } catch (e) { console.warn("[CABEÇALHO] Não foi possível salvar", e); }
    },

    atualizarDisplayContador() {
      if (this.contadorElement) this.contadorElement.innerHTML = "🤯 " + this.contadorBugs;
      if (this.relatorioElement) this.relatorioElement.innerText = this.contadorBugs;
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
            setTimeout(() => { if (this.contadorElement) this.contadorElement.style.animation = ""; }, 300);
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

    atualizarMensagemErro(mensagem) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        linhaErro.innerHTML = '<i class="bi bi-terminal"></i> ' + mensagem;
        linhaErro.style.animation = "piscaLed 0.2s ease-in-out";
        setTimeout(() => { if (linhaErro) linhaErro.style.animation = ""; }, 400);
      }
    },

    adicionarLogDebug(texto) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        const htmlAtual = linhaErro.innerHTML;
        linhaErro.innerHTML = htmlAtual + '<br><span style="font-size:0.65rem;opacity:0.7;">[DEBUG] ' + texto + '</span>';
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (evento) => {
        const inc = evento.detail?.incremento || 1;
        this.incrementarBugs(inc);
        if (evento.detail?.mensagem) this.adicionarLogDebug(evento.detail.mensagem);
      });
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
        this.atualizarMensagemErro("[SISTEMA] Contador de bugs reiniciado! 🤖");
      });
      document.addEventListener("robo:vitoria", () => {
        this.adicionarLogDebug("🎉 Vitória registrada! Parabéns programadores!");
      });
    },

    efeitoCurtoCircuito() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => { if (cabecalho) cabecalho.style.animation = ""; }, 300);
      }
    },

    efeitoReboot() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "reboot 0.3s ease-in-out";
        setTimeout(() => { if (cabecalho) cabecalho.style.animation = ""; }, 300);
      }
    }
  };

  window.CabecalhoModule = CabecalhoModule;
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => CabecalhoModule.init());
    else CabecalhoModule.init();
  }
})();

// ---------- modelo_menu.js ----------
document.addEventListener("DOMContentLoaded", function () {
  var caminho = window.location.pathname;
  var paginaAtual = caminho.substring(caminho.lastIndexOf("/") + 1);
  if (paginaAtual === "" || paginaAtual === "/") paginaAtual = "index.html";

  var mapaPaginas = {
    "index.html": 'a[href="#principal"], a[data-ano="principal"]',
    "a1index.html": 'a[href="#ano1"], a[data-ano="1"]',
    "a2index.html": 'a[href="#ano2"], a[data-ano="2"]',
    "a3index.html": 'a[href="#ano3"], a[data-ano="3"]',
    "a4index.html": 'a[href="#ano4"], a[data-ano="4"]',
    "a5index.html": 'a[href="#ano5"], a[data-ano="5"]',
  };

  var todosLinks = document.querySelectorAll(".menu-robomestre .nav-link");
  todosLinks.forEach(function (link) { link.classList.remove("active"); });

  var seletor = mapaPaginas[paginaAtual];
  if (seletor) {
    var linkAtivo = document.querySelector(seletor);
    if (linkAtivo) linkAtivo.classList.add("active");
  } else {
    var linkPorHref = document.querySelector('.menu-robomestre .nav-link[href="' + paginaAtual + '"]');
    if (linkPorHref) linkPorHref.classList.add("active");
  }

  var navbarToggler = document.querySelector(".navbar-toggler");
  var navbarCollapse = document.querySelector(".navbar-collapse");
  if (navbarToggler && navbarCollapse) {
    var linksMenu = document.querySelectorAll(".menu-robomestre .nav-link");
    linksMenu.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navbarCollapse.classList.contains("show")) navbarToggler.click();
      });
    });
  }
});

// ---------- modelo_index.js (parcial – apenas partes não conflitantes) ----------
// (mantido por compatibilidade, mas sem uso direto)
(function () {
  "use strict";
  const ModeloModule = {
    inicializado: false,
    bugsEncontrados: 0,
    alunos: [],
    STORAGE_KEY: "robozada_alunos_ano3",
    elementos: {},

    init() {
      if (this.inicializado) return;
      // Verifica se a página é a principal (com os elementos necessários)
      const possuiElementos = document.getElementById("btnLoopExemplo") || document.getElementById("btnAcharBug") || document.getElementById("listaAlunos");
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

    capturarElementos() {
      this.elementos.loopMsg = document.getElementById("loopMessage");
      this.elementos.btnLoop = document.getElementById("btnLoopExemplo");
      this.elementos.contaLoop = document.getElementById("contaLoop");
      this.elementos.valorDisplay = document.getElementById("valorDisplay");
      this.elementos.btnIncrementar = document.getElementById("btnIncrementar");
      this.elementos.btnZerar = document.getElementById("btnZerar");
      this.elementos.contadorVariavel = document.getElementById("contadorVariavel");
      this.elementos.bugMsg = document.getElementById("bugMessage");
      this.elementos.btnAcharBug = document.getElementById("btnAcharBug");
      this.elementos.bugCount = document.getElementById("bugCount");
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimir = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreview = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
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

    salvarAlunos() { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos)); },

    adicionarAluno() {
      if (!this.elementos.inputNome) return;
      let nome = this.elementos.inputNome.value.trim();
      if (!nome) { alert("🤖 Digite o nome do aluno(a) primeiro!"); return; }
      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();
      if (this.alunos.includes(nome)) { alert("⚠️ Este aluno já está na lista!"); return; }
      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarListaAlunos();
      this.elementos.inputNome.value = "";
      this.elementos.inputNome.focus();
      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm("Remover " + this.alunos[index] + " da lista?")) {
        const nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarListaAlunos();
        if (this.elementos.previewNome && this.elementos.previewNome.textContent === nomeRemovido) {
          this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        }
        this.atualizarEstadoBotoes();
      }
    },

    selecionarAlunoPreview(nome) {
      if (this.elementos.previewNome) this.elementos.previewNome.textContent = nome;
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
            <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
            <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
          </div>
        `;
        listaUl.appendChild(li);
      });
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
      if (this.elementos.btnImprimir) this.elementos.btnImprimir.disabled = this.alunos.length === 0;
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

    imprimirTodosCertificados() {
      if (this.alunos.length === 0) { alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir."); return; }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
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
      if (win) { win.document.write(htmlLote); win.document.close(); }
      else alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
    },

    previewAlunoSelecionado() {
      const nomeSelecionado = this.elementos.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") { alert("⚠️ Selecione um aluno na lista primeiro!"); return; }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nomeAluno)}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Courier New',monospace; background:#e0e0e0; min-height:100vh; display:flex; justify-content:center; align-items:center; padding:40px 20px; }
        .preview-container { max-width:800px; width:100%; margin:0 auto; }
        .preview-actions { text-align:center; margin-bottom:20px; position:sticky; top:10px; z-index:100; }
        .btn-print, .btn-close { background:#ffb347; border:none; border-radius:40px; padding:10px 24px; font-weight:bold; cursor:pointer; margin:0 8px; }
        .btn-close { background:#555; color:white; }
        .certificado { border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:30px; text-align:center; background:#fffef7; box-shadow:0 20px 40px rgba(0,0,0,0.2); }
        .certificado h3 { color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.9rem; margin-bottom:20px; }
        .certificado strong.nome { font-size:22px; display:block; margin:15px 0; color:#2c5e1f; background:#fff0cc; padding:12px; border-radius:40px; }
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
            <h3>🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nomeAluno)}</strong>
            <p>concluiu com êxito o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
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
      if (win) { win.document.write(html); win.document.close(); }
      else alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
    },

    configurarEventos() {
      if (this.elementos.btnAdicionar) this.elementos.btnAdicionar.addEventListener("click", () => this.adicionarAluno());
      if (this.elementos.inputNome) this.elementos.inputNome.addEventListener("keypress", (e) => { if (e.key === "Enter") this.adicionarAluno(); });
      if (this.elementos.btnImprimir) this.elementos.btnImprimir.addEventListener("click", () => this.imprimirTodosCertificados());
      if (this.elementos.btnPreview) this.elementos.btnPreview.addEventListener("click", () => this.previewAlunoSelecionado());
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

    dispararEvento(nome, detalhes = {}) { window.dispatchEvent(new CustomEvent(nome, { detail: detalhes })); },

    getAlunos() { return [...this.alunos]; }
  };

  window.ModeloModule = ModeloModule;
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => ModeloModule.init());
    else ModeloModule.init();
  }
})();

// ---------- modelo_certificado.js (versão específica para certificados) ----------
(function () {
  "use strict";
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano3",
    elementos: {
      inputNome: null, btnAdicionar: null, listaAlunos: null, contadorAlunos: null,
      btnImprimirTodos: null, btnPreviewAluno: null, previewNome: null, previewData: null
    },

    init() {
      if (this.inicializado) return;
      if (!document.getElementById("listaAlunos") && !document.querySelector(".cadastro-alunos")) {
        console.log("⏳ CertificadoModule: página não identificada, ignorando...");
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

    salvarAlunos() { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos)); },

    atualizarPreviewData() {
      if (this.elementos.previewData) {
        const hoje = new Date().toLocaleDateString("pt-BR");
        this.elementos.previewData.textContent = hoje;
      }
    },

    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimirTodos) this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      if (this.elementos.btnPreviewAluno) {
        const nomePreview = this.elementos.previewNome?.textContent || "";
        this.elementos.btnPreviewAluno.disabled = nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
    },

    adicionarAluno() {
      if (!this.elementos.inputNome) return;
      let nome = this.elementos.inputNome.value.trim();
      if (!nome) { alert("🤖 Digite o nome do aluno(a) primeiro!"); return; }
      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();
      if (this.alunos.includes(nome)) { alert("⚠️ Este aluno já está na lista!"); return; }
      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarLista();
      this.elementos.inputNome.value = "";
      this.elementos.inputNome.focus();
      this.atualizarEstadoBotoes();
    },

    removerAluno(index) {
      if (confirm("Remover " + this.alunos[index] + " da lista?")) {
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
      if (this.elementos.previewNome) this.elementos.previewNome.textContent = nome;
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
            <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
            <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
          </div>
        `;
        listaUl.appendChild(li);
      });
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
      const win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
      if (win) { win.document.write(html); win.document.close(); }
      else alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
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
        .certificado strong.nome { font-size:22px; display:block; margin:15px 0; color:#2c5e1f; background:#fff0cc; padding:12px; border-radius:40px; }
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
            <h3>🏆 CERTIFICADO DE CONCLUSÃO - 4º ANO</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 FUNDAMENTOS | 🔀 ANINHAMENTO | ⚙️ CONCORRÊNCIA | 🚀 PROJETO AUTORAL</p>
            <hr>
            <p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px; font-style:italic;">"Bug não é erro, é aprendizado com efeitos especiais!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        </div>
        <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body>
      </html>`;
    },

    imprimirTodosCertificados() {
      if (this.alunos.length === 0) { alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir."); return; }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `
          <div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE CONCLUSÃO - 4º ANO</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>4º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 FUNDAMENTOS | 🔀 ANINHAMENTO | ⚙️ CONCORRÊNCIA | 🚀 PROJETO AUTORAL</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ${dataAtual}</p>
            <p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Bug não é erro, é aprendizado com efeitos especiais!"</p>
            <div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 4.0</div>
          </div>
        `;
      });
      const htmlLote = `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Certificados RobôMestres - 4º Ano</title>
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
      if (win) { win.document.write(htmlLote); win.document.close(); }
      else alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
    },

    previewAlunoSelecionado() {
      const nomeSelecionado = this.elementos.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") { alert("⚠️ Selecione um aluno na lista primeiro!"); return; }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    configurarEventos() {
      if (this.elementos.btnAdicionar) this.elementos.btnAdicionar.addEventListener("click", () => this.adicionarAluno());
      if (this.elementos.inputNome) this.elementos.inputNome.addEventListener("keypress", (e) => { if (e.key === "Enter") this.adicionarAluno(); });
      if (this.elementos.btnImprimirTodos) this.elementos.btnImprimirTodos.addEventListener("click", () => this.imprimirTodosCertificados());
      if (this.elementos.btnPreviewAluno) this.elementos.btnPreviewAluno.addEventListener("click", () => this.previewAlunoSelecionado());
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

    dispararEvento(nome, detalhes = {}) { window.dispatchEvent(new CustomEvent(nome, { detail: detalhes })); }
  };

  window.CertificadoModule = CertificadoModule;
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => CertificadoModule.init());
    else CertificadoModule.init();
  }
})();

// ---------- modelo_rodape.js ----------
(function () {
  "use strict";
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,

    init() {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.relatorioElement) this.atualizarRelatorio();
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [RODAPÉ] Módulo inicializado", "color:#ffb347;font-weight:bold;");
    },

    atualizarRelatorio() {
      if (!this.relatorioElement) return;
      let contadorBugs = 0;
      if (window.CabecalhoModule && typeof window.CabecalhoModule.getContadorBugs === "function") {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
        try {
          const salvo = localStorage.getItem("cabecalho_contador_bugs");
          contadorBugs = salvo ? parseInt(salvo) : 0;
        } catch (e) { contadorBugs = 0; }
      }
      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    animarAtualizacao() {
      if (this.relatorioElement) {
        this.relatorioElement.classList.add("atualizando");
        setTimeout(() => { if (this.relatorioElement) this.relatorioElement.classList.remove("atualizando"); }, 300);
      }
    },

    configurarEventos() {
      document.addEventListener("robo:bug", () => this.atualizarRelatorio());
      document.addEventListener("robo:resetBugs", () => this.atualizarRelatorio());
      document.addEventListener("cabecalho:contador_atualizado", () => this.atualizarRelatorio());
      document.addEventListener("robo:vitoria", () => {
        if (this.relatorioElement) {
          const corOriginal = this.relatorioElement.style.color;
          this.relatorioElement.style.color = "#2ecc71";
          setTimeout(() => { if (this.relatorioElement) this.relatorioElement.style.color = ""; }, 500);
        }
      });
    },

    sincronizar() { this.atualizarRelatorio(); },

    adicionarMensagemRelatorio(mensagem) {
      if (this.relatorioElement) {
        const htmlAtual = this.relatorioElement.innerHTML;
        this.relatorioElement.innerHTML = htmlAtual + '<span class="mensagem-extra ms-2" style="font-size:0.7rem;opacity:0.7;">' + mensagem + '</span>';
        setTimeout(() => {
          const msgExtra = this.relatorioElement.querySelector(".mensagem-extra");
          if (msgExtra) msgExtra.remove();
        }, 3000);
      }
    }
  };

  window.RodapeModule = RodapeModule;
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => RodapeModule.init());
    else RodapeModule.init();
  }
})();

// ========== FIM ==========