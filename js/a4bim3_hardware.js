// ==================================================
// a4bim3_hardware.js
// Arquivo JS unificado para o 4º Ano - 3º Bimestre - Hardware com micro:bit
// Baseado nos modelos: modelo_menu_bim.js, modelo_planos_aula.js,
// modelo_certificado.js, modelo_apresentacao_bimestre.js,
// modelo_cabecalho.js e modelo_rodape.js
// ==================================================

// ==================================================
// MÓDULO MENU BIMESTRAL
// ==================================================
(function () {
  "use strict";

  function highlightCurrentPage() {
    var currentPath =
      window.location.pathname.split("/").pop() || "a4bim3_hardware.html";
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

  function consoleWelcome() {
    console.log(
      "%c🤖 4º ANO - 3º BIMESTRE - HARDWARE COM MICRO:BIT",
      "color: #ffb347; font-size: 14px; font-family: monospace;",
    );
    console.log(
      "%c🔧 Robótica com micro:bit - Engenharia de Sistemas do Caos!",
      "color: #9bbc7b;",
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      highlightCurrentPage();
      consoleWelcome();
    });
  } else {
    highlightCurrentPage();
    consoleWelcome();
  }
})();

// ==================================================
// MÓDULO CABEÇALHO
// ==================================================
(function () {
  "use strict";

  var CabecalhoModule = {
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

      console.log(
        "%c🤖 [CABEÇALHO] Módulo inicializado com sucesso",
        "color: #ffb347; font-size: 12px; font-weight: bold;",
      );
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
        localStorage.setItem(
          "cabecalho_contador_bugs",
          this.contadorBugs.toString(),
        );
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
        setTimeout(
          function () {
            if (this.contadorElement) {
              this.contadorElement.style.animation =
                "piscaLed 0.3s ease-in-out";
              setTimeout(
                function () {
                  if (this.contadorElement) {
                    this.contadorElement.style.animation = "";
                  }
                }.bind(this),
                300,
              );
            }
          }.bind(this),
          10,
        );
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

    atualizarMensagemErro: function (mensagem) {
      var linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        linhaErro.innerHTML = '<i class="bi bi-terminal"></i> ' + mensagem;
        linhaErro.style.animation = "piscaLed 0.2s ease-in-out";
        setTimeout(function () {
          if (linhaErro) linhaErro.style.animation = "";
        }, 400);
      }
    },

    adicionarLogDebug: function (texto) {
      var linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        var htmlAtual = linhaErro.innerHTML;
        linhaErro.innerHTML =
          htmlAtual +
          '<br><span style="font-size:0.65rem; opacity:0.7;">[DEBUG] ' +
          texto +
          "</span>";
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    configurarEventos: function () {
      document.addEventListener(
        "robo:bug",
        function (evento) {
          var incremento =
            evento.detail && evento.detail.incremento
              ? evento.detail.incremento
              : 1;
          this.incrementarBugs(incremento);
          if (evento.detail && evento.detail.mensagem) {
            this.adicionarLogDebug(evento.detail.mensagem);
          }
        }.bind(this),
      );

      document.addEventListener(
        "robo:resetBugs",
        function () {
          this.resetarBugs();
          this.atualizarMensagemErro(
            "[SISTEMA] Contador de bugs reiniciado! Preparem-se para novos erros! 🤖",
          );
        }.bind(this),
      );

      document.addEventListener(
        "robo:vitoria",
        function () {
          this.adicionarLogDebug(
            "🎉 Vitória registrada! Parabéns programadores!",
          );
        }.bind(this),
      );
    },

    efeitoCurtoCircuito: function () {
      var cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(function () {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },

    efeitoReboot: function () {
      var cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "reboot 0.3s ease-in-out";
        setTimeout(function () {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },
  };

  window.CabecalhoModule = CabecalhoModule;

  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        CabecalhoModule.init();
      });
    } else {
      CabecalhoModule.init();
    }
  }
})();

// ==================================================
// MÓDULO RODAPÉ
// ==================================================
(function () {
  "use strict";

  var RodapeModule = {
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

      console.log(
        "%c🤖 [RODAPÉ] Módulo inicializado com sucesso",
        "color: #ffb347; font-size: 12px; font-weight: bold;",
      );
    },

    atualizarRelatorio: function () {
      if (!this.relatorioElement) return;

      var contadorBugs = 0;

      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      ) {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
        try {
          var salvo = localStorage.getItem("cabecalho_contador_bugs");
          contadorBugs = salvo ? parseInt(salvo) : 0;
        } catch (e) {
          contadorBugs = 0;
        }
      }

      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    animarAtualizacao: function () {
      if (this.relatorioElement) {
        this.relatorioElement.classList.add("atualizando");
        setTimeout(
          function () {
            if (this.relatorioElement) {
              this.relatorioElement.classList.remove("atualizando");
            }
          }.bind(this),
          300,
        );
      }
    },

    configurarEventos: function () {
      document.addEventListener(
        "robo:bug",
        function () {
          this.atualizarRelatorio();
        }.bind(this),
      );

      document.addEventListener(
        "robo:resetBugs",
        function () {
          this.atualizarRelatorio();
        }.bind(this),
      );

      document.addEventListener(
        "cabecalho:contador_atualizado",
        function () {
          this.atualizarRelatorio();
        }.bind(this),
      );

      document.addEventListener(
        "robo:vitoria",
        function () {
          if (this.relatorioElement) {
            var corOriginal = this.relatorioElement.style.color;
            this.relatorioElement.style.color = "#2ecc71";
            setTimeout(
              function () {
                if (this.relatorioElement) {
                  this.relatorioElement.style.color = "";
                }
              }.bind(this),
              500,
            );
          }
        }.bind(this),
      );

      if (window.ControladorRobomestres) {
        window.addEventListener(
          "controlador:pronto",
          function () {
            this.atualizarRelatorio();
          }.bind(this),
        );
      }
    },

    sincronizar: function () {
      this.atualizarRelatorio();
    },

    adicionarMensagemRelatorio: function (mensagem) {
      if (this.relatorioElement) {
        var htmlAtual = this.relatorioElement.innerHTML;
        this.relatorioElement.innerHTML =
          htmlAtual +
          '<span class="mensagem-extra ms-2" style="font-size:0.7rem; opacity:0.7;">' +
          mensagem +
          "</span>";
        setTimeout(
          function () {
            var msgExtra =
              this.relatorioElement.querySelector(".mensagem-extra");
            if (msgExtra) msgExtra.remove();
          }.bind(this),
          3000,
        );
      }
    },
  };

  window.RodapeModule = RodapeModule;

  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        RodapeModule.init();
      });
    } else {
      RodapeModule.init();
    }
  }
})();

// ==================================================
// MÓDULO PLANOS DE AULA
// ==================================================
(function () {
  "use strict";

  var PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_4ano_bim3",
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
        console.log(
          "⏳ PlanosAulaModule: accordion não encontrado, ignorando...",
        );
        return;
      }

      console.log("📚 [PlanosAulaModule] Inicializando módulo interativo...");

      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.configurarEfeitosHover();
      this.inicializado = true;

      this.dispararEvento("planosAula:pronto");
      console.log(
        "✅ [PlanosAulaModule] Pronto! Total de semanas:",
        this.totalSemanas,
      );
    },

    capturarElementos: function () {
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

    salvarProgresso: function () {
      var concluidas = {};

      this.elementos.checkboxes.forEach(
        function (cb) {
          var semana = cb.getAttribute("data-semana");
          if (semana) {
            concluidas[semana] = cb.checked;
          } else {
            var index = Array.from(this.elementos.checkboxes).indexOf(cb);
            concluidas["semana_" + (index + 1)] = cb.checked;
          }
        }.bind(this),
      );

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));

      this.dispararEvento("planosAula:progressoSalvo", {
        concluidas: concluidas,
        total: this.getTotalMarcados(),
      });
    },

    carregarProgresso: function () {
      var salvo = localStorage.getItem(this.STORAGE_KEY);

      if (!salvo) {
        this.atualizarBarraProgresso();
        return;
      }

      try {
        var concluidas = JSON.parse(salvo);

        this.elementos.checkboxes.forEach(function (cb, idx) {
          var semana = cb.getAttribute("data-semana");

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
      var marcados = 0;
      this.elementos.checkboxes.forEach(function (cb) {
        if (cb.checked) marcados++;
      });
      return marcados;
    },

    atualizarBarraProgresso: function () {
      var marcados = this.getTotalMarcados();
      var percentual =
        this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;

      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent =
          Math.round(percentual) + "%";
      }

      if (this.elementos.progressoTexto) {
        this.elementos.progressoTexto.textContent =
          marcados + "/" + this.totalSemanas;
      }

      this.dispararEvento("planosAula:progressoAtualizado", {
        concluidas: marcados,
        total: this.totalSemanas,
        percentual: percentual,
      });
    },

    expandirTodos: function () {
      var collapses = document.querySelectorAll(
        "#accordionAulas .accordion-collapse",
      );

      collapses.forEach(function (collapse) {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
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
      var collapses = document.querySelectorAll(
        "#accordionAulas .accordion-collapse",
      );

      collapses.forEach(function (collapse) {
        if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
          try {
            var bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapse);
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
      var cb = e.target;
      var semana =
        cb.getAttribute("data-semana") ||
        "semana_" + (Array.from(this.elementos.checkboxes).indexOf(cb) + 1);

      this.salvarProgresso();
      this.atualizarBarraProgresso();

      var acao = cb.checked ? "✅ Concluída!" : "⏳ Reaberta!";
      this.mostrarToast(
        acao + " Semana " + semana,
        cb.checked ? "success" : "warning",
      );
    },

    configurarEfeitosHover: function () {
      var cards = document.querySelectorAll(".accordion-item");

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
      var toastContainer = document.querySelector(".toast-container-custom");

      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container-custom";
        toastContainer.style.cssText =
          "position:fixed;bottom:20px;right:20px;z-index:9999;";
        document.body.appendChild(toastContainer);
      }

      var toastId = "toast_" + Date.now();
      var bgColor =
        tipo === "success"
          ? "#2ecc71"
          : tipo === "warning"
            ? "#f39c12"
            : "#3498db";

      var toastHtml =
        '<div id="' +
        toastId +
        '" class="custom-toast" style="background:#1e2a1a;border-left:4px solid ' +
        bgColor +
        ';border-radius:12px;padding:12px 20px;margin-bottom:10px;color:#e9f5db;font-size:0.85rem;box-shadow:0 4px 15px rgba(0,0,0,0.3);animation:slideInRight 0.3s ease-out;display:flex;align-items:center;gap:10px;">' +
        '<i class="bi ' +
        (tipo === "success"
          ? "bi-check-circle-fill"
          : tipo === "warning"
            ? "bi-exclamation-triangle-fill"
            : "bi-info-circle-fill") +
        '" style="color:' +
        bgColor +
        ';"></i>' +
        "<span>" +
        mensagem +
        "</span>" +
        "</div>";

      toastContainer.insertAdjacentHTML("beforeend", toastHtml);

      setTimeout(function () {
        var toast = document.getElementById(toastId);
        if (toast) {
          toast.style.animation = "fadeOutRight 0.3s ease-out";
          setTimeout(function () {
            toast.remove();
          }, 300);
        }
      }, 3000);
    },

    resetarProgresso: function () {
      if (
        confirm(
          "⚠️ ATENÇÃO! Isso irá marcar TODAS as aulas como NÃO concluídas. Deseja continuar?",
        )
      ) {
        this.elementos.checkboxes.forEach(function (cb) {
          cb.checked = false;
        });
        this.salvarProgresso();
        this.atualizarBarraProgresso();
        this.mostrarToast(
          "🔄 Progresso resetado! Todas as aulas foram marcadas como pendentes.",
          "warning",
        );
        console.log("🔄 Progresso resetado!");

        this.dispararEvento("planosAula:progressoResetado");
      }
    },

    getEstatisticas: function () {
      var marcados = this.getTotalMarcados();
      return {
        total: this.totalSemanas,
        concluidas: marcados,
        pendentes: this.totalSemanas - marcados,
        percentual:
          this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0,
      };
    },

    configurarEventos: function () {
      if (this.elementos.expandirBtn) {
        this.elementos.expandirBtn.removeEventListener(
          "click",
          this._handleExpandir,
        );
        this.elementos.expandirBtn.addEventListener(
          "click",
          function () {
            this.expandirTodos();
          }.bind(this),
        );
      }

      if (this.elementos.recolherBtn) {
        this.elementos.recolherBtn.removeEventListener(
          "click",
          this._handleRecolher,
        );
        this.elementos.recolherBtn.addEventListener(
          "click",
          function () {
            this.recolherTodos();
          }.bind(this),
        );
      }

      this.elementos.checkboxes.forEach(
        function (cb) {
          cb.removeEventListener("change", this._handleChange);
          cb.addEventListener(
            "change",
            function (e) {
              this.handleCheckboxChange(e);
            }.bind(this),
          );
        }.bind(this),
      );

      document.addEventListener(
        "keydown",
        function (e) {
          if (e.ctrlKey && e.shiftKey && e.key === "R") {
            e.preventDefault();
            this.resetarProgresso();
          }
        }.bind(this),
      );
    },

    dispararEvento: function (nome, detalhes) {
      detalhes = detalhes || {};
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("planosAula", PlanosAulaModule);
  } else {
    window.addEventListener("controlador:pronto", function () {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("planosAula", PlanosAulaModule);
      }
    });
    setTimeout(function () {
      if (!PlanosAulaModule.inicializado) PlanosAulaModule.init();
    }, 800);
  }

  window.PlanosAulaModule = PlanosAulaModule;
})();

// ==================================================
// MÓDULO CERTIFICADO
// ==================================================
(function () {
  "use strict";

  var CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano4_bim3",

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

    carregarElementos: function () {
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

    carregarAlunosDoStorage: function () {
      var salvos = localStorage.getItem(this.STORAGE_KEY);
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

    salvarAlunos: function () {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
      this.dispararEvento("certificado:alunos_atualizados", {
        total: this.alunos.length,
      });
    },

    atualizarPreviewData: function () {
      if (this.elementos.previewData) {
        var hoje = new Date().toLocaleDateString("pt-BR");
        this.elementos.previewData.textContent = hoje;
      }
    },

    atualizarEstadoBotoes: function () {
      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      }
      if (this.elementos.btnPreviewAluno) {
        var nomePreview = this.elementos.previewNome
          ? this.elementos.previewNome.textContent
          : "";
        this.elementos.btnPreviewAluno.disabled =
          nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
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

      if (this.alunos.indexOf(nome) !== -1) {
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

        if (
          this.elementos.previewNome &&
          this.elementos.previewNome.textContent === nomeRemovido
        ) {
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
        listaUl.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (contadorSpan) contadorSpan.textContent = "0";
        return;
      }

      listaUl.innerHTML = "";
      this.alunos.forEach(
        function (aluno, idx) {
          var li = document.createElement("li");
          li.className = "d-flex justify-content-between align-items-center";
          li.innerHTML =
            '<span><i class="bi bi-robot"></i> ' +
            this.escapeHtml(aluno) +
            "</span>" +
            '<div class="btn-group gap-1">' +
            '<button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="' +
            this.escapeHtml(aluno) +
            '">' +
            '<i class="bi bi-eye"></i>' +
            "</button>" +
            '<button class="btn-remover-aluno btn btn-sm btn-danger" data-index="' +
            idx +
            '">' +
            '<i class="bi bi-trash"></i>' +
            "</button>" +
            "</div>";
          listaUl.appendChild(li);
        }.bind(this),
      );

      document.querySelectorAll(".btn-selecionar-aluno").forEach(
        function (btn) {
          btn.removeEventListener("click", this._handleSelect);
          btn.addEventListener(
            "click",
            function () {
              var nome = btn.getAttribute("data-nome");
              if (nome) this.selecionarAlunoPreview(nome);
            }.bind(this),
          );
        }.bind(this),
      );

      document.querySelectorAll(".btn-remover-aluno").forEach(
        function (btn) {
          btn.removeEventListener("click", this._handleRemove);
          btn.addEventListener(
            "click",
            function () {
              var idx = parseInt(btn.getAttribute("data-index"));
              if (!isNaN(idx)) this.removerAluno(idx);
            }.bind(this),
          );
        }.bind(this),
      );

      if (contadorSpan) contadorSpan.textContent = this.alunos.length;
    },

    gerarCertificadoUnico: function (nomeAluno) {
      var dataAtual = new Date().toLocaleDateString("pt-BR");
      var html = this._gerarHtmlCertificado(nomeAluno, dataAtual);

      var win = window.open(
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

    _gerarHtmlCertificado: function (nome, data) {
      return (
        "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        "<title>Certificado - " +
        this.escapeHtml(nome) +
        "</title>\n" +
        "<style>\n" +
        "* { margin: 0; padding: 0; box-sizing: border-box; }\n" +
        "body { font-family: 'Courier New', monospace; background: #e0e0e0; min-height: 100vh; display: flex; justify-content: center; align-items: center; padding: 40px 20px; }\n" +
        ".preview-container { max-width: 800px; width: 100%; margin: 0 auto; }\n" +
        ".preview-actions { text-align: center; margin-bottom: 20px; position: sticky; top: 10px; z-index: 100; }\n" +
        ".btn-print, .btn-close { background: #ffb347; border: none; border-radius: 40px; padding: 10px 24px; font-weight: bold; cursor: pointer; margin: 0 8px; }\n" +
        ".btn-close { background: #555; color: white; }\n" +
        ".certificado { border: 3px solid #ffb347; border-radius: 48px 24px 48px 24px; padding: 30px; text-align: center; background: #fffef7; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }\n" +
        ".certificado h3 { color: #ffb347; font-family: 'Press Start 2P', cursive; font-size: 0.9rem; margin-bottom: 20px; }\n" +
        ".certificado p { color: #4a6e2c; margin: 10px 0; }\n" +
        ".certificado strong.nome { font-size: 22px; display: block; margin: 15px 0; color: #2c5e1f; background: #fff0cc; padding: 12px; border-radius: 40px; }\n" +
        ".certificado hr { margin: 20px 0; border: 1px solid #ffb347; }\n" +
        "@media print { body { background: white; } .preview-actions { display: none; } @page { size: A4; margin: 1.5cm; } }\n" +
        "</style>\n" +
        "</head>\n" +
        "<body>\n" +
        '<div class="preview-container">\n' +
        '<div class="preview-actions">\n' +
        '<button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button>\n' +
        '<button class="btn-close" onclick="window.close();">✖️ FECHAR</button>\n' +
        "</div>\n" +
        '<div class="certificado">\n' +
        "<h3>🏆 CERTIFICADO ENGENHEIRO(A) DE SISTEMAS DO CAOS</h3>\n" +
        "<p>Certificamos que</p>\n" +
        '<strong class="nome">' +
        this.escapeHtml(nome) +
        "</strong>\n" +
        "<p>concluiu com êxito o <strong>4º ANO - 3º BIMESTRE</strong><br>\n" +
        "🔧 MICRO:BIT | 🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROTÓTIPO</p>\n" +
        "<hr>\n" +
        "<p>RobôMestres do Paraná • " +
        data +
        "</p>\n" +
        '<p style="font-size:11px; font-style:italic;">"Bug não é erro, é aprendizado com efeitos especiais!"</p>\n' +
        '<div style="margin-top:10px;">🤖 Ass: Professor(a) do Caos</div>\n' +
        "</div>\n" +
        "</div>\n" +
        '<script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>\n' +
        "</body>\n" +
        "</html>"
      );
    },

    imprimirTodosCertificados: function () {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir.");
        return;
      }

      var dataAtual = new Date().toLocaleDateString("pt-BR");
      var cardsHTML = "";

      this.alunos.forEach(
        function (aluno) {
          cardsHTML +=
            '<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">' +
            "<h3 style=\"color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;\">🏆 CERTIFICADO ENGENHEIRO(A) DE SISTEMAS DO CAOS</h3>\n" +
            '<p style="color:#4a6e2c;">Certificamos que</p>\n' +
            '<strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">' +
            this.escapeHtml(aluno) +
            "</strong>\n" +
            '<p style="color:#4a6e2c;">concluiu o <strong>4º ANO - 3º BIMESTRE</strong><br>\n' +
            "🔧 MICRO:BIT | 🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROTÓTIPO</p>\n" +
            '<hr style="margin:12px 0; border:1px solid #ffb347;">\n' +
            '<p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ' +
            dataAtual +
            "</p>\n" +
            '<p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Bug não é erro, é aprendizado com efeitos especiais!"</p>\n' +
            '<div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Professor(a) do Caos</div>\n' +
            "</div>";
        }.bind(this),
      );

      var htmlLote =
        "<!DOCTYPE html>\n" +
        "<html>\n" +
        "<head>\n" +
        '<meta charset="UTF-8">\n' +
        "<title>Certificados RobôMestres - 4º Ano - 3º Bimestre</title>\n" +
        "<style>\n" +
        "* { margin: 0; padding: 0; box-sizing: border-box; }\n" +
        "body { font-family: 'Courier New', monospace; background: white; padding: 20px; }\n" +
        ".print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }\n" +
        "@media print {\n" +
        "body { padding: 0; margin: 0; }\n" +
        ".print-grid { gap: 15px; }\n" +
        "@page { size: A4; margin: 0.8cm; }\n" +
        "}\n" +
        "</style>\n" +
        "</head>\n" +
        "<body>\n" +
        '<div class="print-grid">' +
        cardsHTML +
        "</div>\n" +
        "<script>\n" +
        "window.onload = function() {\n" +
        "setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 200);\n" +
        "};\n" +
        "<\/script>\n" +
        "</body>\n" +
        "</html>";

      var win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
      }
    },

    previewAlunoSelecionado: function () {
      var nomeSelecionado = this.elementos.previewNome
        ? this.elementos.previewNome.textContent
        : "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nomeSelecionado);
    },

    configurarEventos: function () {
      if (this.elementos.btnAdicionar) {
        this.elementos.btnAdicionar.addEventListener(
          "click",
          function () {
            this.adicionarAluno();
          }.bind(this),
        );
      }

      if (this.elementos.inputNome) {
        this.elementos.inputNome.addEventListener(
          "keypress",
          function (e) {
            if (e.key === "Enter") this.adicionarAluno();
          }.bind(this),
        );
      }

      if (this.elementos.btnImprimirTodos) {
        this.elementos.btnImprimirTodos.addEventListener(
          "click",
          function () {
            this.imprimirTodosCertificados();
          }.bind(this),
        );
      }

      if (this.elementos.btnPreviewAluno) {
        this.elementos.btnPreviewAluno.addEventListener(
          "click",
          function () {
            this.previewAlunoSelecionado();
          }.bind(this),
        );
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
    },
  };

  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("certificado", CertificadoModule);
  } else {
    window.addEventListener("controlador:pronto", function () {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("certificado", CertificadoModule);
      }
    });
    setTimeout(function () {
      if (!CertificadoModule.inicializado) CertificadoModule.init();
    }, 800);
  }

  window.CertificadoModule = CertificadoModule;
})();

// ==================================================
// MÓDULO APRESENTAÇÃO BIMESTRE
// ==================================================
(function () {
  "use strict";

  var ApresentacaoModule = {
    inicializado: false,

    elementos: {
      cartaAbertura: null,
      tabelaMapeamento: null,
      planoSintetico: null,
    },

    init: function () {
      if (this.inicializado) return;

      var possuiElementos =
        document.getElementById("carta-abertura") ||
        document.querySelector(".carta-container") ||
        document.getElementById("mapeamento");

      if (!possuiElementos) {
        console.log(
          "⏳ ApresentacaoModule: página não identificada, ignorando...",
        );
        return;
      }

      console.log(
        "🎭 [ApresentacaoModule] Inicializando página de apresentação...",
      );

      this.capturarElementos();
      this.configurarEfeitosVisuais();
      this.inicializarContadorSemanas();
      this.configurarEventos();
      this.inicializado = true;

      this.dispararEvento("apresentacao:pronto");
      console.log("✅ [ApresentacaoModule] Pronto!");
    },

    capturarElementos: function () {
      this.elementos.cartaAbertura = document.querySelector(".carta-container");
      this.elementos.tabelaMapeamento =
        document.querySelector("#mapeamento table");
      this.elementos.planoSintetico = document.querySelector(
        "#plano-sintetico table",
      );
    },

    configurarEfeitosVisuais: function () {
      this.efeitoDigitacaoCarta();
      this.efeitoBrilhoTabela();
      this.efeitoFlutuacaoBadges();
    },

    efeitoDigitacaoCarta: function () {
      var cartaContainer = this.elementos.cartaAbertura;
      if (!cartaContainer) return;

      var paragrafos = cartaContainer.querySelectorAll(".carta-texto, p");

      paragrafos.forEach(function (p, index) {
        p.style.opacity = "0";
        p.style.transform = "translateY(10px)";
        p.style.transition = "opacity 0.5s ease, transform 0.5s ease";

        setTimeout(
          function () {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          },
          200 + index * 150,
        );
      });
    },

    efeitoBrilhoTabela: function () {
      var tabelas = [
        this.elementos.tabelaMapeamento,
        this.elementos.planoSintetico,
      ];

      tabelas.forEach(
        function (tabela) {
          if (!tabela) return;

          var linhas = tabela.querySelectorAll("tbody tr");

          linhas.forEach(function (linha) {
            linha.addEventListener("mouseenter", function () {
              linha.style.transition = "all 0.2s ease";
              linha.style.backgroundColor = "rgba(255, 180, 71, 0.15)";
              linha.style.transform = "scale(1.01)";
            });

            linha.addEventListener("mouseleave", function () {
              linha.style.backgroundColor = "";
              linha.style.transform = "";
            });
          });
        }.bind(this),
      );
    },

    efeitoFlutuacaoBadges: function () {
      var badges = document.querySelectorAll(".badge-projeto, .selo-sucata");

      badges.forEach(function (badge, index) {
        badge.style.animation =
          "flutuarBadge " + (2 + index * 0.3) + "s ease-in-out infinite";
        badge.style.transformOrigin = "center";
      });
    },

    inicializarContadorSemanas: function () {
      var tabela = this.elementos.planoSintetico;
      if (!tabela) return;

      var linhas = tabela.querySelectorAll("tbody tr");
      var totalSemanas = linhas.length;

      var header = document.querySelector("#plano-sintetico .projeto-header");
      if (header && totalSemanas > 0) {
        var contadorSpan = document.createElement("span");
        contadorSpan.className = "badge bg-warning text-dark ms-2";
        contadorSpan.innerHTML = "📅 " + totalSemanas + " semanas";
        contadorSpan.style.fontSize = "0.7rem";
        contadorSpan.style.verticalAlign = "middle";

        var titulo = header.querySelector("h2");
        if (titulo && !header.querySelector(".badge")) {
          titulo.appendChild(contadorSpan);
        }
      }

      console.log("📊 Total de semanas no bimestre: " + totalSemanas);
    },

    animarEntradaElementos: function () {
      var elementosParaAnimacao = [
        { selector: ".projeto-header", delay: 0 },
        { selector: ".bg-robocard", delay: 100 },
        { selector: ".table-responsive", delay: 200 },
      ];

      elementosParaAnimacao.forEach(function (item) {
        var elementos = document.querySelectorAll(item.selector);
        elementos.forEach(function (el, idx) {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
          el.style.transition = "opacity 0.4s ease, transform 0.4s ease";

          setTimeout(
            function () {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            },
            item.delay + idx * 100,
          );
        });
      });
    },

    gerarPrintAmigavel: function () {
      var btnPrint = document.createElement("button");
      btnPrint.innerHTML = '<i class="bi bi-printer"></i> Imprimir/Exportar';
      btnPrint.className = "btn-print-amigavel";
      btnPrint.style.cssText =
        "position:fixed;bottom:20px;right:20px;background:#ffb347;border:none;border-radius:40px;padding:10px 20px;color:#1e2a1a;font-weight:bold;cursor:pointer;z-index:1000;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.2s;font-family:monospace;";

      btnPrint.addEventListener("mouseenter", function () {
        btnPrint.style.transform = "scale(1.05)";
      });
      btnPrint.addEventListener("mouseleave", function () {
        btnPrint.style.transform = "scale(1)";
      });

      btnPrint.addEventListener("click", function () {
        window.print();
      });

      if (!document.querySelector(".btn-print-amigavel")) {
        document.body.appendChild(btnPrint);
      }
    },

    inicializarTooltips: function () {
      var elementosComTooltip = document.querySelectorAll(
        "[title], .tooltip-enabled",
      );

      elementosComTooltip.forEach(function (el) {
        var titulo =
          el.getAttribute("title") || el.getAttribute("data-tooltip");
        if (!titulo) return;

        el.addEventListener("mouseenter", function (e) {
          var tooltip = document.createElement("div");
          tooltip.className = "custom-tooltip";
          tooltip.textContent = titulo;
          tooltip.style.cssText =
            "position:absolute;background:#1e2a1a;color:#ffb347;padding:5px 12px;border-radius:20px;font-size:0.7rem;font-family:monospace;border:1px solid #ffb347;white-space:nowrap;z-index:1000;pointer-events:none;box-shadow:0 2px 10px rgba(0,0,0,0.3);";

          var rect = el.getBoundingClientRect();
          tooltip.style.left = rect.left + rect.width / 2 - 50 + "px";
          tooltip.style.top = rect.top - 30 + "px";

          document.body.appendChild(tooltip);

          el.addEventListener(
            "mouseleave",
            function () {
              tooltip.remove();
            },
            { once: true },
          );
        });
      });
    },

    criarBotaoTopo: function () {
      var btnTopo = document.createElement("button");
      btnTopo.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
      btnTopo.className = "btn-topo-robotico";
      btnTopo.style.cssText =
        "position:fixed;bottom:20px;left:20px;background:#2c3e2b;border:2px solid #ffb347;border-radius:50%;width:45px;height:45px;color:#ffb347;font-size:1.5rem;cursor:pointer;z-index:1000;opacity:0;visibility:hidden;transition:all 0.3s;display:flex;align-items:center;justify-content:center;";

      btnTopo.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      document.body.appendChild(btnTopo);

      window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
          btnTopo.style.opacity = "1";
          btnTopo.style.visibility = "visible";
        } else {
          btnTopo.style.opacity = "0";
          btnTopo.style.visibility = "hidden";
        }
      });

      return btnTopo;
    },

    configurarEventos: function () {
      setTimeout(
        function () {
          this.animarEntradaElementos();
        }.bind(this),
        100,
      );

      setTimeout(
        function () {
          this.gerarPrintAmigavel();
        }.bind(this),
        500,
      );

      setTimeout(
        function () {
          this.criarBotaoTopo();
        }.bind(this),
        600,
      );

      setTimeout(
        function () {
          this.inicializarTooltips();
        }.bind(this),
        700,
      );

      var botoes = document.querySelectorAll(".btn, .badge-projeto");
      botoes.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          btn.style.transform = "scale(0.98)";
          setTimeout(function () {
            btn.style.transform = "";
          }, 150);
        });
      });
    },

    dispararEvento: function (nome, detalhes) {
      detalhes = detalhes || {};
      window.dispatchEvent(new CustomEvent(nome, { detail: detalhes }));
    },
  };

  if (
    window.Controlador &&
    typeof window.Controlador.registrarModulo === "function"
  ) {
    window.Controlador.registrarModulo("apresentacao", ApresentacaoModule);
  } else {
    window.addEventListener("controlador:pronto", function () {
      if (window.Controlador && window.Controlador.registrarModulo) {
        window.Controlador.registrarModulo("apresentacao", ApresentacaoModule);
      }
    });
    setTimeout(function () {
      if (!ApresentacaoModule.inicializado) ApresentacaoModule.init();
    }, 800);
  }

  window.ApresentacaoModule = ApresentacaoModule;
})();

console.log(
  "%c🤖 4º ANO - 3º BIMESTRE - HARDWARE COM MICRO:BIT CARREGADO!",
  "color: #ffb347; font-size: 16px; font-weight: bold;",
);
