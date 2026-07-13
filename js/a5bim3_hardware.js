// ==================================================
// a5bim3_hardware.js
// Script completo para o 5º Ano | 3º Bimestre | Hardware
// Unifica todas as funcionalidades dos anexos
// ==================================================

(function () {
  "use strict";

  // ============================================================
  // MÓDULO: MENU (destaque da página atual)
  // ============================================================
  const MenuModule = {
    init() {
      this.highlightCurrentPage();
      this.consoleWelcome();
      this.initTooltips();
    },

    highlightCurrentPage() {
      const currentPath =
        window.location.pathname.split("/").pop() || "a5bim3_hardware.html";
      const navLinks = document.querySelectorAll(".menu-robomestre .nav-link");

      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === currentPath) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },

    consoleWelcome() {
      console.log(
        "%c🤖 ROBOZADA 3000 - 5º ANO | 3º BIMESTRE | HARDWARE",
        "color: #ffb347; font-size: 14px; font-family: monospace;",
      );
      console.log(
        "%c🔧 Sucata, sensores e robôs que salvam a escola!",
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
  };

  // ============================================================
  // MÓDULO: PLANOS DE AULA (accordion, checkboxes, progresso)
  // ============================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "a5bim3_concluidas",
    totalSemanas: 10,

    elementos: {
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
    },

    init() {
      if (this.inicializado) return;

      const accordion = document.getElementById("accordionAulas");
      if (!accordion) {
        console.log(
          "⏳ PlanosAulaModule: accordion não encontrado, ignorando...",
        );
        return;
      }

      console.log("📚 [PlanosAulaModule] Inicializando...");
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.inicializado = true;
      console.log("✅ [PlanosAulaModule] Pronto!");
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

    handleCheckboxChange(e) {
      this.salvarProgresso();
      this.atualizarBarraProgresso();
    },

    configurarEventos() {
      this.elementos.checkboxes.forEach((cb) => {
        cb.removeEventListener("change", this._handleChange);
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
    },
  };

  // ============================================================
  // MÓDULO: CERTIFICADO
  // ============================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "a5bim3_certificados",

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
            <h3>🏆 CERTIFICADO DE ENGENHEIRO(A) DE ROBÔS LOUCOS</h3>
            <p>Certificamos que</p>
            <strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com sucesso o <strong>3º BIMESTRE</strong> do curso de Robótica Educacional,<br>
            tendo construído um robô funcional a partir de sucata,<br>
            programado contadores, funções modulares, operadores lógicos e máquinas de estados,<br>
            documentado o projeto em um manual completo,<br>
            e apresentado o trabalho para a comunidade escolar com estilo e irreverência.</p>
            <hr>
            <p>"Nem todo herói usa capa. Alguns usam papel alumínio, código e muita atitude."</p>
            <p style="font-size:11px; font-style:italic;">Professor(a) Responsável</p>
            <p style="font-size:11px;">Data: ${data}</p>
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
            <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE ENGENHEIRO(A) DE ROBÔS LOUCOS</h3>
            <p style="color:#4a6e2c;">Certificamos que</p>
            <strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
            <p style="color:#4a6e2c;">concluiu o <strong>3º BIMESTRE</strong> - Robótica Educacional<br>
            🔧 SUCATA | 🔁 CONTADORES | 🧩 FUNÇÕES | 🧠 OPERADORES LÓGICOS</p>
            <hr style="margin:12px 0; border:1px solid #ffb347;">
            <p style="font-size:0.65rem; color:#6b8c5c;">"Nem todo herói usa capa. Alguns usam papel alumínio, código e muita atitude."</p>
            <p style="font-size:0.6rem; color:#b4621a;">Professor(a) Responsável</p>
            <p style="font-size:0.6rem; color:#6b8c5c;">Data: ${dataAtual}</p>
          </div>
        `;
      });

      const htmlLote = `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Certificados - 5º Ano | 3º Bimestre</title>
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
  };

  // ============================================================
  // MÓDULO: RODAPÉ (contador de bugs)
  // ============================================================
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
      console.log(
        "%c🤖 [RODAPÉ] Módulo inicializado",
        "color: #ffb347; font-size: 12px;",
      );
    },

    atualizarRelatorio() {
      if (!this.relatorioElement) return;

      let contadorBugs = 0;
      try {
        const salvo = localStorage.getItem("a5bim3_contador_bugs");
        contadorBugs = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        contadorBugs = 0;
      }

      this.relatorioElement.innerText = contadorBugs;
    },

    configurarEventos() {
      document.addEventListener("robo:bug", () => {
        this.atualizarRelatorio();
      });

      document.addEventListener("robo:resetBugs", () => {
        this.atualizarRelatorio();
      });
    },
  };

  // ============================================================
  // INICIALIZAÇÃO GERAL
  // ============================================================
  function initAll() {
    MenuModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    RodapeModule.init();
    ImpressaoModule.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

  // ============================================================
  // EXPOSIÇÃO GLOBAL (para uso em outros scripts)
  // ============================================================
  window.MenuModule = MenuModule;
  window.PlanosAulaModule = PlanosAulaModule;
  window.CertificadoModule = CertificadoModule;
  window.RodapeModule = RodapeModule;
})();

// ============================================================
// MÓDULO: IMPRESSÃO DO ACCORDION (PLANOS DE AULA) - VERSÃO CORRIGIDA
// ============================================================
const ImpressaoModule = {
  init() {
    const btn = document.getElementById('imprimirAccordionBtn');
    if (btn) {
      btn.addEventListener('click', () => this.imprimirAccordion());
      console.log('🖨️ [ImpressaoModule] Botão de impressão configurado.');
    } else {
      console.warn('⚠️ [ImpressaoModule] Botão #imprimirAccordionBtn não encontrado.');
    }
  },

  imprimirAccordion() {
    const accordion = document.getElementById('accordionAulas');
    if (!accordion) {
      alert('🤖 Nenhum plano de aula encontrado para imprimir.');
      return;
    }

    // Clona o accordion para não mexer no DOM atual
    const conteudo = accordion.cloneNode(true);

    // Remove checkboxes e outros elementos interativos
    const checkboxes = conteudo.querySelectorAll('.semana-check, .check-concluido');
    checkboxes.forEach(el => el.remove());

    // Remove botões de ação
    const botoesAcao = conteudo.querySelectorAll('.btn, .accordion-button');
    botoesAcao.forEach(btn => {
      btn.removeAttribute('data-bs-toggle');
      btn.removeAttribute('data-bs-target');
      btn.classList.remove('accordion-button', 'collapsed');
      btn.style.cursor = 'default';
      btn.style.pointerEvents = 'none';
    });

    // Abre todos os painéis
    const collapses = conteudo.querySelectorAll('.accordion-collapse');
    collapses.forEach(col => {
      col.classList.add('show');
      col.classList.remove('collapse');
    });

    // Remove atributos de acessibilidade do accordion
    const headers = conteudo.querySelectorAll('.accordion-header');
    headers.forEach(h => {
      h.removeAttribute('data-bs-toggle');
      h.removeAttribute('data-bs-target');
    });

    // ============================================================
    // CSS EMBUTIDO – CORRIGIDO PARA GARANTIR LEGIBILIDADE
    // ============================================================
    const estilos = `
        <style>
          /* Reset e base */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background: #ffffff;
            color: #1e2a1a;
            padding: 20px;
            line-height: 1.5;
          }
          .container { max-width: 1200px; margin: 0 auto; }

          /* Accordion item */
          .accordion-item {
            margin-bottom: 20px;
            border: 1px solid #4a7c3f;
            border-radius: 16px;
            overflow: hidden;
            page-break-inside: avoid;
            break-inside: avoid;
            background: #ffffff;
          }

          /* Cabeçalho da semana */
          .accordion-header {
            background: #2c3e2b;
            color: #ffb347;
            padding: 12px 20px;
            font-weight: bold;
            font-size: 1.1rem;
          }

          /* Corpo do accordion */
          .accordion-body {
            padding: 20px;
            background: #f9faf5;
            color: #1e2a1a;
          }

          /* Card principal da semana */
          .semana-card-completo {
            background: #f0f3ec;
            border-radius: 12px;
            padding: 16px;
            color: #1e2a1a;
          }

          /* Garantia de texto escuro em todos os parágrafos, listas e divs */
          .semana-card-completo p,
          .semana-card-completo li,
          .semana-card-completo ul,
          .semana-card-completo div:not(.materiais-container):not(.minuto-item),
          .semana-card-completo span,
          .semana-card-completo strong,
          .semana-card-completo em {
            color: #1e2a1a;
          }

          /* Títulos (h5) */
          .semana-card-completo h5 {
            color: #2c3e2b;
            margin-top: 16px;
            margin-bottom: 8px;
            border-left: 4px solid #ffb347;
            padding-left: 12px;
          }
          .semana-card-completo h5:first-of-type { margin-top: 0; }

          /* Listas e parágrafos */
          .semana-card-completo ul,
          .semana-card-completo p {
            margin-bottom: 12px;
          }

          /* Badges de materiais */
          .materiais-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 12px;
          }
          .material-badge {
            background: #dce6d6;
            padding: 4px 12px;
            border-radius: 30px;
            border-left: 2px solid #ffb347;
            font-size: 0.8rem;
            color: #1e2a1a;
          }

          /* Itens do minuto a minuto */
          .minuto-item {
            display: flex;
            margin-bottom: 10px;
            background: #e6eee0;
            border-radius: 12px;
            border-left: 4px solid #ffb347;
            color: #1e2a1a;
          }
          .minuto-tempo {
            background: #2c3e2b;
            color: #ffb347;
            padding: 8px 16px;
            font-weight: bold;
            font-family: monospace;
            min-width: 100px;
            text-align: center;
          }
          .minuto-descricao {
            padding: 8px 16px;
            flex: 1;
            color: #1e2a1a;
          }

          /* Frase do dia */
          .frase-do-dia {
            background: #e6eee0;
            border: 1px dashed #ffb347;
            padding: 10px 16px;
            border-radius: 12px;
            margin-top: 16px;
            font-style: italic;
            text-align: center;
            color: #1e2a1a;
          }

          /* Tabelas de critérios */
          .tabela-criterios-semana {
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
          }
          .tabela-criterios-semana th,
          .tabela-criterios-semana td {
            border: 1px solid #4a7c3f;
            padding: 6px 10px;
            text-align: left;
            color: #1e2a1a;
          }
          .tabela-criterios-semana th {
            background: #2c3e2b;
            color: #ffb347;
          }

          /* Blocos de código */
          pre {
            background: #1e2a1a;
            color: #e9f5db;
            padding: 12px;
            border-radius: 12px;
            overflow-x: auto;
            font-size: 0.7rem;
            font-family: 'Courier New', monospace;
            margin: 8px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          /* Código inline */
          code {
            background: #dce6d6;
            padding: 2px 6px;
            border-radius: 6px;
            font-family: monospace;
            color: #1e2a1a;
          }
          /* Código dentro de pre (bloco) – herda cores do pre */
          pre code {
            background: transparent;
            padding: 0;
            color: #e9f5db;
          }

          /* Ocultar elementos interativos */
          .check-concluido { display: none; }
          .accordion-button { display: none; }
          .btn, button { display: none; }

          /* Linha horizontal */
          hr { margin: 16px 0; border-color: #4a7c3f; }

          /* Ajustes para impressão */
          @media print {
            body { padding: 0; }
            .accordion-item { page-break-inside: avoid; break-inside: avoid; }
          }
        </style>
      `;

    const htmlImpressao = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Planos de Aula - 5º Ano - 3º Bimestre - Hardware</title>
          ${estilos}
        </head>
        <body>
          <div class="container">
            <h1 style="font-family: 'Press Start 2P', cursive; font-size: 1.2rem; color: #2c3e2b; text-align: center; margin-bottom: 30px;">
              🧩 PLANOS DE AULA – 5º ANO – 3º BIMESTRE – HARDWARE
            </h1>
            ${conteudo.innerHTML}
          </div>
          <script>
            window.onload = function() {
              // Descomente a linha abaixo para imprimir automaticamente:
              // window.print();
            };
          <\/script>
        </body>
        </html>
      `;

    // Abre nova janela
    const win = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes');
    if (win) {
      win.document.write(htmlImpressao);
      win.document.close();
      win.onload = function () {
        win.focus();
        // Descomente abaixo para impressão automática:
        // win.print();
      };
    } else {
      alert('⚠️ Permita pop-ups para visualizar a impressão dos planos de aula.');
    }
  }
};