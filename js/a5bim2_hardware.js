// ==================================================
// a5bim2_hardware.js - 5º Ano | 2º Bimestre
// DETETIVES LÓGICOS - Versão Extrema
// Módulos: Planos de Aula, Certificados, Menu, Rodapé
// ==================================================

(function () {
  "use strict";

  // ================================================
  // MÓDULO: PLANOS DE AULA
  // ================================================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_5ano_bim2",
    totalSemanas: 10,

    elementos: {
      expandirBtn: null,
      recolherBtn: null,
      checkboxes: null,
      barraProgresso: null,
      progressoTexto: null,
      accordionContainer: null,
    },

    init: function () {
      if (this.inicializado) return;

      if (!document.getElementById("accordionAulas")) {
        console.log("⏳ PlanosAulaModule: accordion não encontrado, ignorando...");
        return;
      }

      console.log("📚 [PlanosAulaModule] Inicializando módulo interativo...");
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.configurarEfeitosHover();
      this.inicializado = true;

      this.dispararEvento("planosAula:pronto");
      console.log("✅ [PlanosAulaModule] Pronto! Total de semanas:", this.totalSemanas);
    },

    capturarElementos: function () {
      this.elementos.expandirBtn = document.getElementById("expandirTodosBtn");
      this.elementos.recolherBtn = document.getElementById("recolherTodosBtn");
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      this.elementos.accordionContainer = document.getElementById("accordionAulas");
      this.elementos.btnImprimir = document.getElementById("btnImprimirAulas");

      if (this.elementos.checkboxes.length === 0) {
        this.elementos.checkboxes = document.querySelectorAll("input[type='checkbox'].semana-check, input.check-concluido");
      }

      if (this.elementos.checkboxes.length > 0) {
        this.totalSemanas = this.elementos.checkboxes.length;
      }
    },

    salvarProgresso: function () {
      const concluidas = {};
      this.elementos.checkboxes.forEach(function (cb) {
        const semana = cb.getAttribute("data-semana");
        if (semana) {
          concluidas[semana] = cb.checked;
        } else {
          const index = Array.from(this.elementos.checkboxes).indexOf(cb);
          concluidas["semana_" + (index + 1)] = cb.checked;
        }
      }.bind(this));
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
      this.dispararEvento("planosAula:progressoSalvo", {
        concluidas: concluidas,
        total: this.getTotalMarcados()
      });
    },

    carregarProgresso: function () {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) {
        this.atualizarBarraProgresso();
        return;
      }
      try {
        const concluidas = JSON.parse(salvo);
        this.elementos.checkboxes.forEach(function (cb, idx) {
          const semana = cb.getAttribute("data-semana");
          if (semana && concluidas.hasOwnProperty(semana)) {
            cb.checked = concluidas[semana];
          } else if (concluidas.hasOwnProperty("semana_" + (idx + 1))) {
            cb.checked = concluidas["semana_" + (idx + 1)];
          }
        });
      } catch (e) {
        console.warn("Erro ao carregar progresso:", e);
      }
      this.atualizarBarraProgresso();
    },

    getTotalMarcados: function () {
      let marcados = 0;
      this.elementos.checkboxes.forEach(function (cb) {
        if (cb.checked) marcados++;
      });
      return marcados;
    },

    atualizarBarraProgresso: function () {
      const marcados = this.getTotalMarcados();
      const percentual = this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;

      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent = Math.round(percentual) + "%";
      }

      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent = marcados + "/" + this.totalSemanas;
      }

      this.dispararEvento("planosAula:progressoAtualizado", {
        concluidas: marcados,
        total: this.totalSemanas,
        percentual: percentual
      });
    },

    // ================================================
    // IMPRESSÃO DOS PLANOS DE AULA - FUNÇÃO COMPLETA
    // ================================================
    imprimirPlanos: function () {
      console.log("🖨️ [PlanosAulaModule] Preparando para imprimir todos os planos...");

      // 1. Verifica se o accordion existe
      if (!this.elementos.accordionContainer) {
        console.warn("⚠️ Accordion não encontrado. Nada para imprimir.");
        return;
      }

      // 2. Expande todos os painéis para garantir que o conteúdo completo apareça no preview
      // Usa o método já existente no módulo, que trata Bootstrap e fallback
      this.expandirTodos();

      // 3. Salva uma referência do escopo para usar dentro do setTimeout
      var self = this;

      // 4. Delay de 400ms para garantir que o DOM seja atualizado antes da impressão
      setTimeout(function () {
        // 5. Abre a janela de impressão do navegador
        window.print();

        // 6. (Opcional) Recolhe todos os painéis após a impressão.
        // Descomente a linha abaixo se quiser que os painéis voltem a ficar recolhidos.
        // self.recolherTodos();

        console.log("✅ [PlanosAulaModule] Impressão finalizada (ou diálogo aberto).");
      }, 400);
    },

    expandirTodos: function () {
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");
      collapses.forEach(function (collapse) {
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
      console.log("📖 Todos os planos expandidos");
      this.mostrarToast("📖 Todos os planos de aula expandidos!", "info");
    },

    recolherTodos: function () {
      const collapses = document.querySelectorAll("#accordionAulas .accordion-collapse");
      collapses.forEach(function (collapse) {
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
      console.log("📕 Todos os planos recolhidos");
      this.mostrarToast("📕 Todos os planos de aula recolhidos!", "info");
    },

    handleCheckboxChange: function (e) {
      const cb = e.target;
      const semana = cb.getAttribute("data-semana") ||
        "semana_" + (Array.from(this.elementos.checkboxes).indexOf(cb) + 1);
      this.salvarProgresso();
      this.atualizarBarraProgresso();
      const acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
      this.mostrarToast(acao + " Semana " + semana, cb.checked ? "success" : "warning");
    },

    configurarEfeitosHover: function () {
      const cards = document.querySelectorAll(".accordion-item");
      cards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
          card.style.transition = "transform 0.2s, box-shadow 0.2s";
          card.style.transform = "translateY(-2px)";
          card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
        });
        card.addEventListener("mouseleave", function () {
          card.style.transform = "";
          card.style.boxShadow = "";
        });
      });
    },

    mostrarToast: function (mensagem, tipo) {
      tipo = tipo || "info";
      let toastContainer = document.querySelector(".toast-container-custom");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container-custom";
        document.body.appendChild(toastContainer);
      }

      const toastId = "toast_" + Date.now();
      const iconClass = tipo === "success" ? "bi-check-circle-fill" :
        tipo === "warning" ? "bi-exclamation-triangle-fill" :
          "bi-info-circle-fill";

      const toastHtml = '<div id="' + toastId + '" class="custom-toast ' + tipo + '">' +
        '<i class="bi ' + iconClass + '"></i>' +
        '<span>' + mensagem + '</span>' +
        '</div>';

      toastContainer.insertAdjacentHTML("beforeend", toastHtml);
      setTimeout(function () {
        const toast = document.getElementById(toastId);
        if (toast) {
          toast.style.animation = "fadeOutRight 0.3s ease-out";
          setTimeout(function () { toast.remove(); }, 300);
        }
      }, 3000);
    },

    resetarProgresso: function () {
      if (confirm("⚠️ ATENÇÃO! Isso irá marcar TODAS as aulas como NÃO concluídas. Deseja continuar?")) {
        this.elementos.checkboxes.forEach(function (cb) {
          cb.checked = false;
        });
        this.salvarProgresso();
        this.atualizarBarraProgresso();
        this.mostrarToast("🔄 Progresso resetado! Todas as aulas foram marcadas como pendentes.", "warning");
        console.log("🔄 Progresso resetado!");
        this.dispararEvento("planosAula:progressoResetado");
      }
    },

    getEstatisticas: function () {
      const marcados = this.getTotalMarcados();
      return {
        total: this.totalSemanas,
        concluidas: marcados,
        pendentes: this.totalSemanas - marcados,
        percentual: this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0
      };
    },

    configurarEventos: function () {
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.addEventListener("click", function () { this.expandirTodos(); }.bind(this));
      }

      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.addEventListener("click", function () { this.recolherTodos(); }.bind(this));
      }

      // 🔽 NOVO EVENTO PARA O BOTÃO DE IMPRIMIR
      if (this.elementos.btnImprimir) {
        this.elementos.btnImprimir.addEventListener("click", function () {
          this.imprimirPlanos();
        }.bind(this));
      }

      this.elementos.checkboxes.forEach(function (cb) {
        cb.addEventListener("change", function (e) { this.handleCheckboxChange(e); }.bind(this));
      }.bind(this));

      document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === "R") {
          e.preventDefault();
          this.resetarProgresso();
        }
      }.bind(this));
    },

    dispararEvento: function (nome, detalhes) {
      detalhes = detalhes || {};
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    }
  };

  // ================================================
  // MÓDULO: CERTIFICADOS (CORRIGIDO)
  // ================================================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_5ano_bim2",

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

    init: function () {
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

    carregarElementos: function () {
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimirTodos = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
    },

    carregarAlunosDoStorage: function () {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      }
      if (!this.alunos || this.alunos.length === 0) {
        this.alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA", "MARIA CLARA SILVA"];
        this.salvarAlunos();
      }
    },

    salvarAlunos: function () {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
      this.dispararEvento("certificado:alunos_atualizados", { total: this.alunos.length });
    },

    atualizarPreviewData: function () {
      if (this.elementos.previewData) {
        const hoje = new Date().toLocaleDateString("pt-BR");
        this.elementos.previewData.textContent = hoje;
      }
    },

    atualizarEstadoBotoes: function () {
      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      }
      if (this.elementos.btnPreviewAluno) {
        const nomePreview = this.elementos.previewNome ? this.elementos.previewNome.textContent : "";
        this.elementos.btnPreviewAluno.disabled = nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
      }
    },

    adicionarAluno: function () {
      if (!this.elementos.inputNome) return;

      var nome = this.elementos.inputNome.value.trim();
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

    removerAluno: function (index) {
      if (confirm("Remover " + this.alunos[index] + " da lista?")) {
        var nomeRemovido = this.alunos[index];
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();

        if (this.elementos.previewNome && this.elementos.previewNome.textContent === nomeRemovido) {
          this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        }
        this.atualizarEstadoBotoes();
      }
    },

    selecionarAlunoPreview: function (nome) {
      if (this.elementos.previewNome) {
        this.elementos.previewNome.textContent = nome;
      }
      this.atualizarEstadoBotoes();
    },

    atualizarLista: function () {
      var listaUl = this.elementos.listaAlunos;
      var contadorSpan = this.elementos.contadorAlunos;

      if (!listaUl) return;

      if (this.alunos.length === 0) {
        listaUl.innerHTML = '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (contadorSpan) contadorSpan.textContent = "0";
        return;
      }

      listaUl.innerHTML = "";
      this.alunos.forEach(function (aluno, idx) {
        var li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = '<span><i class="bi bi-robot"></i> ' + this.escapeHtml(aluno) + '</span>' +
          '<div class="btn-group gap-1">' +
          '<button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="' + this.escapeHtml(aluno) + '">' +
          '<i class="bi bi-eye"></i>' +
          '</button>' +
          '<button class="btn-remover-aluno btn btn-sm btn-danger" data-index="' + idx + '">' +
          '<i class="bi bi-trash"></i>' +
          '</button>' +
          '</div>';
        listaUl.appendChild(li);
      }.bind(this));

      document.querySelectorAll(".btn-selecionar-aluno").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        }.bind(this));
      }.bind(this));

      document.querySelectorAll(".btn-remover-aluno").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        }.bind(this));
      }.bind(this));

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    // ==============================================
    // MÉTODOS DE CERTIFICADOS
    // ==============================================

    gerarCertificadoUnico: function (nomeAluno) {
      var dataAtual = new Date().toLocaleDateString("pt-BR");
      var html = this._gerarHtmlCertificado(nomeAluno, dataAtual);

      var win = window.open("", "_blank", "width=900,height=700,toolbar=yes,scrollbars=yes");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
      }
    },

    _gerarHtmlCertificado: function (nome, data) {
      var nomeEscapado = this.escapeHtml(nome);
      return '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title>Certificado - ' + nomeEscapado + '</title>' +
        '<style>' +
        '* { margin: 0; padding: 0; box-sizing: border-box; }' +
        'body { font-family: "Courier New", monospace; background: #e0e0e0; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }' +
        '.preview-container { max-width: 800px; width: 100%; margin: 0 auto; }' +
        '.preview-actions { text-align: center; margin-bottom: 20px; position: sticky; top: 10px; z-index: 100; }' +
        '.btn-print, .btn-close { background: #ffb347; border: none; border-radius: 40px; padding: 10px 24px; font-weight: bold; cursor: pointer; margin: 0 8px; }' +
        '.btn-close { background: #555; color: white; }' +
        '.certificado { border: 3px solid #ffb347; border-radius: 48px 24px 48px 24px; padding: 30px; text-align: center; background: #fffef7; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }' +
        '.certificado h3 { color: #ffb347; font-family: "Press Start 2P", cursive; font-size: 0.9rem; margin-bottom: 20px; }' +
        '.certificado p { color: #4a6e2c; margin: 10px 0; }' +
        '.certificado strong.nome { font-size: 22px; display: block; margin: 15px 0; color: #2c5e1f; background: #fff0cc; padding: 12px; border-radius: 40px; }' +
        '.certificado hr { margin: 20px 0; border: 1px solid #ffb347; }' +
        '@media print { body { background: white; } .preview-actions { display: none; } @page { size: A4; margin: 1.5cm; } }' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<div class="preview-container">' +
        '<div class="preview-actions">' +
        '<button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button>' +
        '<button class="btn-close" onclick="window.close();">✖️ FECHAR</button>' +
        '</div>' +
        '<div class="certificado">' +
        '<h3>🏆 CERTIFICADO DE DETETIVE LÓGICO NÍVEL 2</h3>' +
        '<p>Outorgado a</p>' +
        '<strong class="nome">' + nomeEscapado + '</strong>' +
        '<p>Por ter concluído com sucesso o <strong>2º Bimestre do Curso de Robótica - "Detetives Lógicos"</strong></p>' +
        '<p>🎯 Operador NOT | 📊 Tabelas Verdade | 🤖 Robô da Tabuada | 🌙 Robô Noturno | 🎵 Orquestra Robótica</p>' +
        '<hr>' +
        '<p>RobôMestres do Paraná • ' + data + '</p>' +
        '<p style="font-size:11px; font-style:italic;">"A lógica não é apenas sobre estar certo - é sobre entender por que você está certo (ou não)."</p>' +
        '<div style="margin-top:10px;">🤖 Professor: _________________________</div>' +
        '</div>' +
        '</div>' +
        '<script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>' +
        '</body>' +
        '</html>';
    },

    imprimirTodosCertificados: function () {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir.");
        return;
      }

      var dataAtual = new Date().toLocaleDateString("pt-BR");
      var cardsHTML = "";

      this.alunos.forEach(function (aluno) {
        var nomeEscapado = this.escapeHtml(aluno);
        cardsHTML += '<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">' +
          '<h3 style="color:#ffb347; font-family:\'Press Start 2P\',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE DETETIVE LÓGICO NÍVEL 2</h3>' +
          '<p style="color:#4a6e2c;">Outorgado a</p>' +
          '<strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">' + nomeEscapado + '</strong>' +
          '<p style="color:#4a6e2c;">Por ter concluído o <strong>2º Bimestre - "Detetives Lógicos"</strong></p>' +
          '<hr style="margin:12px 0; border:1px solid #ffb347;">' +
          '<p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ' + dataAtual + '</p>' +
          '<p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"A lógica não é apenas sobre estar certo - é sobre entender por que você está certo (ou não)."</p>' +
          '<div style="font-size:0.55rem; margin-top:8px;">🤖 Professor: _________________________</div>' +
          '</div>';
      }.bind(this));

      var htmlLote = '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<meta charset="UTF-8">' +
        '<title>Certificados RobôMestres - 5º Ano - Detetives Lógicos</title>' +
        '<style>' +
        '* { margin: 0; padding: 0; box-sizing: border-box; }' +
        'body { font-family: "Courier New", monospace; background: white; padding: 20px; }' +
        '.print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }' +
        '@media print {' +
        'body { padding: 0; margin: 0; }' +
        '.print-grid { gap: 15px; }' +
        '@page { size: A4; margin: 0.8cm; }' +
        '}' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<div class="print-grid">' + cardsHTML + '</div>' +
        '<script>' +
        'window.onload = function() {' +
        'setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 200);' +
        '};' +
        '<\/script>' +
        '</body>' +
        '</html>';

      var win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
      }
    },

    previewAlunoSelecionado: function () {
      var nomeSelecionado = this.elementos.previewNome ? this.elementos.previewNome.textContent : "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    configurarEventos: function () {
      if (this.elementos.btnAdicionar) {
        this.elementos.btnAdicionar.addEventListener("click", function () { this.adicionarAluno(); }.bind(this));
      }

      if (this.elementos.inputNome) {
        this.elementos.inputNome.addEventListener("keypress", function (e) {
          if (e.key === "Enter") this.adicionarAluno();
        }.bind(this));
      }

      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.addEventListener("click", function () { this.imprimirTodosCertificados(); }.bind(this));
      }

      if (this.elementos.btnPreviewAluno) {
        this.elementos.btnPreviewAluno.addEventListener("click", function () { this.previewAlunoSelecionado(); }.bind(this));
      }
    },

    escapeHtml: function (texto) {
      if (!texto) return "";
      return texto.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    },

    dispararEvento: function (nome, detalhes) {
      detalhes = detalhes || {};
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    }
  };

  // ================================================
  // MÓDULO: RODAPÉ
  // ================================================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,

    init: function () {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [RODAPÉ] Módulo inicializado com sucesso", "color: #ffb347; font-size: 12px; font-weight: bold;");
    },

    atualizarRelatorio: function () {
      if (!this.relatorioElement) return;
      var contadorBugs = 0;
      try {
        var salvo = localStorage.getItem("cabecalho_contador_bugs");
        contadorBugs = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        contadorBugs = 0;
      }
      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    animarAtualizacao: function () {
      if (this.relatorioElement) {
        this.relatorioElement.classList.add("atualizando");
        setTimeout(function () {
          if (this.relatorioElement) {
            this.relatorioElement.classList.remove("atualizando");
          }
        }.bind(this), 300);
      }
    },

    configurarEventos: function () {
      document.addEventListener("robo:bug", function () {
        this.atualizarRelatorio();
      }.bind(this));
      document.addEventListener("robo:resetBugs", function () {
        this.atualizarRelatorio();
      }.bind(this));
      document.addEventListener("cabecalho:contador_atualizado", function () {
        this.atualizarRelatorio();
      }.bind(this));
    },

    sincronizar: function () {
      this.atualizarRelatorio();
    }
  };

  // ================================================
  // MÓDULO: CABEÇALHO (Contador de Bugs)
  // ================================================
  const CabecalhoModule = {
    contadorBugs: 0,
    inicializado: false,
    contadorElement: null,
    relatorioElement: null,

    init: function () {
      if (this.inicializado) return;
      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.contadorElement) {
        this.contadorBugs = this.carregarContador();
        this.atualizarDisplayContador();
      }
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [CABEÇALHO] Módulo inicializado com sucesso", "color: #ffb347; font-size: 12px; font-weight: bold;");
    },

    carregarContador: function () {
      try {
        var salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    salvarContador: function () {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs.toString());
      } catch (e) {
        console.warn("[CABEÇALHO] Não foi possível salvar o contador", e);
      }
    },

    atualizarDisplayContador: function () {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = "🤯 " + this.contadorBugs;
      }
      if (this.relatorioElement) {
        this.relatorioElement.innerText = this.contadorBugs;
      }
    },

    incrementarBugs: function (incremento) {
      incremento = incremento || 1;
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarContador();
      return this.contadorBugs;
    },

    resetarBugs: function () {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarReset();
      return this.contadorBugs;
    },

    getContadorBugs: function () {
      return this.contadorBugs;
    },

    animarContador: function () {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(function () {
          if (this.contadorElement) {
            this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
            setTimeout(function () {
              if (this.contadorElement) {
                this.contadorElement.style.animation = "";
              }
            }.bind(this), 300);
          }
        }.bind(this), 10);
      }
    },

    animarReset: function () {
      var painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(function () {
          if (painel) painel.style.animation = "";
        }, 300);
      }
    },

    configurarEventos: function () {
      document.addEventListener("robo:bug", function (evento) {
        var incremento = evento.detail ? (evento.detail.incremento || 1) : 1;
        this.incrementarBugs(incremento);
      }.bind(this));
      document.addEventListener("robo:resetBugs", function () {
        this.resetarBugs();
      }.bind(this));
    }
  };

  // ================================================
  // MENU - DESTAQUE DA PÁGINA ATUAL
  // ================================================
  function highlightCurrentPage() {
    var currentPath = window.location.pathname.split("/").pop() || "a5bim2_hardware.html";
    var navLinks = document.querySelectorAll(".menu-robomestre .nav-link");
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === currentPath) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // ================================================
  // INICIALIZAÇÃO GERAL
  // ================================================
  function initAll() {
    highlightCurrentPage();

    // Inicializa módulos
    if (!PlanosAulaModule.inicializado) {
      PlanosAulaModule.init();
    }
    if (!CertificadoModule.inicializado) {
      CertificadoModule.init();
    }
    if (!RodapeModule.inicializado) {
      RodapeModule.init();
    }
    if (!CabecalhoModule.inicializado) {
      CabecalhoModule.init();
    }

    console.log("%c🤖 ROBOZADA 3000 - 5º ANO | 2º BIMESTRE ATIVO", "color: #ffb347; font-size: 14px; font-family: monospace;");
    console.log("%c🔁 Loop não é macarrão! Variável não é coisa de velho! Depurar não é xingamento!", "color: #9bbc7b;");
    console.log("%c🕵️ DETETIVES LÓGICOS - A REALIDADE INVERTIDA", "color: #ffcc44;");
  }

  // ================================================
  // EXPOSIÇÃO GLOBAL
  // ================================================
  window.PlanosAulaModule = PlanosAulaModule;
  window.CertificadoModule = CertificadoModule;
  window.RodapeModule = RodapeModule;
  window.CabecalhoModule = CabecalhoModule;

  // ================================================
  // AUTO-INICIALIZAÇÃO
  // ================================================
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }

})();  // FIM DO IIFE
