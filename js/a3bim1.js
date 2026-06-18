// ==================================================
// a3bim1.js – Módulos unificados para 3º Ano Bimestre 1
// Versão revisada – Interface intuitiva para o comando REPITA (loop)
// ==================================================

(function () {
  "use strict";

  // ========== MÓDULO MENU ATIVO ==========
  function highlightCurrentPage() {
    // Pega o caminho atual da página (ex: "a3bim1.html")
    var currentPath = window.location.pathname.split("/").pop() || "index.html";
    // Pega também o hash se existir (ex: "#apresentacao")
    var currentHash = window.location.hash || "";

    var navLinks = document.querySelectorAll(".menu-robomestre .nav-link");
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;

      // Remove qualquer hash do href para comparar com o caminho
      var hrefClean = href.split("#")[0];

      // Verifica se o href corresponde ao caminho atual
      var isPathMatch =
        hrefClean === currentPath ||
        (hrefClean === "index.html" && currentPath === "") ||
        (hrefClean === "" && currentPath === "index.html");

      // Verifica se o hash corresponde (se houver)
      var isHashMatch = false;
      if (currentHash && href.indexOf("#") !== -1) {
        var hrefHash = href.split("#")[1];
        if (hrefHash && currentHash.indexOf(hrefHash) !== -1) {
          isHashMatch = true;
        }
      }

      // Se o link é para a página atual, adiciona active
      if (isPathMatch || isHashMatch) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Fallback: se nenhum link ficou ativo, tenta pelo texto
    var hasActive = document.querySelector(".menu-robomestre .nav-link.active");
    if (!hasActive) {
      navLinks.forEach(function (link) {
        var href = link.getAttribute("href");
        if (href && href.indexOf("bim1") !== -1) {
          link.classList.add("active");
        }
      });
    }
  }

  // ========== MÓDULO PLANOS DE AULA ==========
  const PlanosModule = {
    storageKey: "planoAula_3ano_bim1",
    init() {
      this.checkboxes = document.querySelectorAll(".semana-check");
      if (!this.checkboxes.length) return;
      this.carregarProgresso();
      this.configurarEventos();
      this.atualizarBarraProgresso();
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.storageKey);
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          this.checkboxes.forEach((cb) => {
            const semana = cb.getAttribute("data-semana");
            if (semana && concluidas[semana]) cb.checked = true;
          });
        } catch (e) {
          console.warn("Erro ao carregar progresso:", e);
        }
      }
    },
    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(concluidas));
      this.atualizarBarraProgresso();
    },
    atualizarBarraProgresso() {
      let marcados = 0;
      this.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      const percentual = this.checkboxes.length
        ? (marcados / this.checkboxes.length) * 100
        : 0;

      let barra = document.querySelector("#barraProgressoGlobal");

      if (!barra) {
        const planosSection = document.querySelector("#planos");
        if (planosSection) {
          let header = planosSection.querySelector(".projeto-header");
          if (!header) {
            header = document.createElement("div");
            header.className = "projeto-header";
            header.innerHTML = `<h2><i class="bi bi-journal-bookmark-fill"></i> Planos de Aula</h2>`;
            const primeiroAccordion =
              planosSection.querySelector(".accordion-item");
            if (primeiroAccordion) {
              planosSection.insertBefore(header, primeiroAccordion);
            } else {
              planosSection.prepend(header);
            }
          }
          const div = document.createElement("div");
          div.className = "progress w-50 ms-auto";
          div.innerHTML = `<div id="barraProgressoGlobal" class="progress-bar bg-warning" style="width:0%">0%</div>`;
          header.appendChild(div);
          barra = document.getElementById("barraProgressoGlobal");
        }
      }

      if (barra) {
        barra.style.width = percentual + "%";
        barra.textContent = Math.round(percentual) + "%";
      }
    },
    configurarEventos() {
      this.checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => this.salvarProgresso());
      });
    },
  };

  // ========== MÓDULO JOGO REPITA COMIGO (VERSÃO REVISADA) ==========
  const JogoModule = {
    comandos: [],
    loopEmEdicao: null,
    modoLoop: false,
    seletorLoopAtivo: false,
    desafios: [
      { texto: "PULE 3 VEZES", acaoEsperada: ["pular", "pular", "pular"] },
      {
        texto: "BATA PALMA 2 VEZES E GIRE 1 VEZ",
        acaoEsperada: ["bater_palma", "bater_palma", "girar"],
      },
      {
        texto: "REPITA 3 VEZES: PULAR",
        acaoEsperada: ["pular", "pular", "pular"],
      },
      {
        texto: "REPITA 2 VEZES: BATER PALMA",
        acaoEsperada: ["bater_palma", "bater_palma"],
      },
      {
        texto: "PULE, GIRE, PULE, GIRE",
        acaoEsperada: ["pular", "girar", "pular", "girar"],
      },
      {
        texto: "REPITA 2 VEZES: PULAR E BATER PALMA",
        acaoEsperada: ["pular", "bater_palma", "pular", "bater_palma"],
      },
    ],
    indice: 0,
    pontuacao: 0,
    acertos: 0,
    timeoutId: null,
    nomesAcoes: {
      pular: "🤸 PULAR",
      bater_palma: "👏 BATER PALMA",
      girar: "🔄 GIRAR",
    },

    init() {
      if (!document.getElementById("jogoRepitaComigo")) return;
      this.carregarDesafio();
      this.configurarEventos();
      this.atualizarPontuacao();
    },

    carregarDesafio() {
      const desafio = this.desafios[this.indice];
      const desafioEl = document.getElementById("desafioAlvo");
      if (desafioEl) desafioEl.innerHTML = desafio.texto;
      this.comandos = [];
      this.loopEmEdicao = null;
      this.modoLoop = false;
      this.seletorLoopAtivo = false;
      this.esconderSeletorLoop();
      this.atualizarAreaAlgoritmo();
      this.atualizarStatusLoop(false);
      const msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        msgDiv.className = "alert alert-info mt-2";
        msgDiv.innerHTML =
          "🎯 Clique nos cartões abaixo para montar seu algoritmo! Use o botão 🔁 REPITA para criar um loop.";
      }
      this.atualizarBarraProgressoJogo(0);
      const btnProximo = document.getElementById("btnProximoDesafio");
      if (btnProximo) btnProximo.disabled = false;
      const btnLoop = document.getElementById("btnLoop");
      if (btnLoop) {
        btnLoop.textContent = "🔁 REPITA (loop)";
        btnLoop.classList.remove("btn-loop-ativo");
      }
      document.querySelectorAll(".cartao-cmd:not(.especial)").forEach((btn) => {
        btn.classList.remove("modo-loop-ativo");
      });
    },

    // ===== SELETOR DE NÚMEROS (sem pop-up) =====
    mostrarSeletorLoop() {
      if (this.seletorLoopAtivo) return;
      this.seletorLoopAtivo = true;

      const container = document.getElementById("jogoRepitaComigo");
      if (!container) return;

      this.esconderSeletorLoop();

      const seletor = document.createElement("div");
      seletor.id = "seletorLoop";
      seletor.className = "seletor-loop-overlay";
      seletor.innerHTML = `
        <div class="seletor-loop-card">
          <div class="seletor-loop-header">
            <span class="seletor-loop-titulo">🔁 QUANTAS VEZES?</span>
            <button class="seletor-loop-fechar" id="seletorLoopFechar">✖</button>
          </div>
          <div class="seletor-loop-grid">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
              .map(function (n) {
                return (
                  '<button class="seletor-loop-numero" data-vezes="' +
                  n +
                  '">' +
                  n +
                  "</button>"
                );
              })
              .join("")}
          </div>
          <div class="seletor-loop-footer">
            <span class="text-muted small">Clique em um número para criar o loop</span>
          </div>
        </div>
      `;

      container.appendChild(seletor);

      // Evento para fechar
      var fecharBtn = document.getElementById("seletorLoopFechar");
      if (fecharBtn) {
        fecharBtn.addEventListener(
          "click",
          function () {
            this.fecharSeletorLoop();
          }.bind(this),
        );
      }

      // Clicar fora do card fecha
      seletor.addEventListener(
        "click",
        function (e) {
          if (e.target === seletor) {
            this.fecharSeletorLoop();
          }
        }.bind(this),
      );

      // Eventos dos números
      document.querySelectorAll(".seletor-loop-numero").forEach(
        function (btn) {
          btn.addEventListener(
            "click",
            function (e) {
              var vezes = parseInt(btn.getAttribute("data-vezes"));
              this.fecharSeletorLoop();
              this.criarLoopComVezes(vezes);
            }.bind(this),
          );
        }.bind(this),
      );
    },

    esconderSeletorLoop() {
      var existente = document.getElementById("seletorLoop");
      if (existente) existente.remove();
      this.seletorLoopAtivo = false;
    },

    fecharSeletorLoop() {
      this.esconderSeletorLoop();
      var btnLoop = document.getElementById("btnLoop");
      if (btnLoop) btnLoop.focus();
    },

    // ===== CRIA UM LOOP COM NÚMERO DE REPETIÇÕES ESCOLHIDO =====
    criarLoopComVezes(vezes) {
      if (this.modoLoop) {
        if (
          !confirm(
            "⚠️ Você já está editando um loop. Deseja substituí-lo por um novo?",
          )
        ) {
          return;
        }
        this.cancelarLoop();
      }

      var novoLoop = {
        tipo: "repita",
        vezes: vezes,
        filhos: [],
        emEdicao: true,
      };

      this.comandos.push(novoLoop);
      this.loopEmEdicao = novoLoop;
      this.modoLoop = true;

      this.atualizarStatusLoop(
        true,
        "Repetir " + vezes + "× — adicione ações!",
      );
      this.atualizarAreaAlgoritmo();

      var btnLoop = document.getElementById("btnLoop");
      if (btnLoop) {
        btnLoop.textContent = "🔁 EDITANDO LOOP...";
        btnLoop.classList.add("btn-loop-ativo");
      }

      document
        .querySelectorAll(".cartao-cmd:not(.especial)")
        .forEach(function (btn) {
          btn.classList.add("modo-loop-ativo");
        });

      var msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        msgDiv.className = "alert alert-warning mt-2";
        msgDiv.innerHTML =
          "🔁 Loop criado com <strong>" +
          vezes +
          " repetições</strong>! Clique em <strong>PULAR</strong>, <strong>BATER PALMA</strong> ou <strong>GIRAR</strong> para adicionar ações dentro do loop. Depois clique em <strong>FECHAR LOOP</strong>.";
      }
    },

    // ===== ADICIONA AÇÃO AO LOOP EM EDIÇÃO =====
    adicionarAcaoAoLoop(acao) {
      if (!this.modoLoop || !this.loopEmEdicao) {
        this.adicionarComando(acao);
        return;
      }

      this.loopEmEdicao.filhos.push(acao);
      this.atualizarAreaAlgoritmo();

      var msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        var nome =
          this.nomesAcoes[acao] || acao.replace(/_/g, " ").toUpperCase();
        var total = this.loopEmEdicao.filhos.length;
        msgDiv.className = "alert alert-success mt-2";
        msgDiv.innerHTML =
          "✅ " +
          nome +
          " adicionado ao loop! (" +
          total +
          " ação" +
          (total > 1 ? "es" : "") +
          ")";
      }
    },

    // ===== FECHA O LOOP EM EDIÇÃO =====
    fecharLoop() {
      if (!this.loopEmEdicao) {
        this.cancelarLoop();
        return;
      }

      if (this.loopEmEdicao.filhos.length === 0) {
        if (
          !confirm(
            "⚠️ Este loop não tem nenhuma ação. Deseja mantê-lo mesmo assim?",
          )
        ) {
          return;
        }
      }

      this.loopEmEdicao.emEdicao = false;
      this.loopEmEdicao = null;
      this.modoLoop = false;

      this.atualizarStatusLoop(false);
      this.atualizarAreaAlgoritmo();

      var msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        msgDiv.className = "alert alert-success mt-2";
        msgDiv.innerHTML =
          "🎉 Loop finalizado! Continue montando seu algoritmo.";
      }

      var btnLoop = document.getElementById("btnLoop");
      if (btnLoop) {
        btnLoop.textContent = "🔁 REPITA (loop)";
        btnLoop.classList.remove("btn-loop-ativo");
      }

      document
        .querySelectorAll(".cartao-cmd:not(.especial)")
        .forEach(function (btn) {
          btn.classList.remove("modo-loop-ativo");
        });
    },

    // ===== CANCELA O LOOP EM EDIÇÃO =====
    cancelarLoop() {
      if (!this.loopEmEdicao) {
        this.modoLoop = false;
        this.atualizarStatusLoop(false);
        return;
      }

      var index = this.comandos.indexOf(this.loopEmEdicao);
      if (index !== -1) {
        this.comandos.splice(index, 1);
      }

      this.loopEmEdicao = null;
      this.modoLoop = false;
      this.atualizarStatusLoop(false);
      this.atualizarAreaAlgoritmo();

      var msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        msgDiv.className = "alert alert-info mt-2";
        msgDiv.innerHTML =
          "⏹️ Loop cancelado e removido. Clique em REPITA para criar outro.";
      }

      var btnLoop = document.getElementById("btnLoop");
      if (btnLoop) {
        btnLoop.textContent = "🔁 REPITA (loop)";
        btnLoop.classList.remove("btn-loop-ativo");
      }

      document
        .querySelectorAll(".cartao-cmd:not(.especial)")
        .forEach(function (btn) {
          btn.classList.remove("modo-loop-ativo");
        });
    },

    // ===== ADICIONA COMANDO NORMAL =====
    adicionarComando(cmd) {
      if (this.modoLoop && this.loopEmEdicao) {
        this.adicionarAcaoAoLoop(cmd);
        return;
      }

      this.comandos.push(cmd);
      this.atualizarAreaAlgoritmo();

      var msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        var nome = this.nomesAcoes[cmd] || cmd.replace(/_/g, " ").toUpperCase();
        msgDiv.className = "alert alert-success mt-2";
        msgDiv.innerHTML = "✅ " + nome + " adicionado!";
      }
    },

    // ===== RENDERIZA A ÁREA DO ALGORITMO =====
    atualizarAreaAlgoritmo() {
      var area = document.getElementById("areaAlgoritmo");
      if (!area) return;

      if (this.comandos.length === 0) {
        area.innerHTML =
          '<span class="text-muted">⚡ Nenhum comando adicionado</span>';
        return;
      }

      var html = "";

      for (var i = 0; i < this.comandos.length; i++) {
        var cmd = this.comandos[i];

        if (cmd.tipo === "repita") {
          var isEditando = cmd.emEdicao === true;
          var borderColor = isEditando ? "#ffcc44" : "#ffb347";
          var bgColor = isEditando ? "#2a3b24" : "#1a2b17";
          var estiloBorda = isEditando
            ? "border-style:dashed; border-width:3px;"
            : "";

          html +=
            '<div class="loop-container mb-2 p-2" style="border:2px solid ' +
            borderColor +
            "; border-radius:12px; background:" +
            bgColor +
            "; " +
            estiloBorda +
            '">';
          html +=
            '<div class="d-flex align-items-center gap-2 mb-1 flex-wrap">';
          html +=
            '<span class="badge ' +
            (isEditando ? "bg-warning text-dark" : "bg-warning text-dark") +
            ' p-2">';
          html +=
            "🔁 REPITA " + cmd.vezes + "× " + (isEditando ? "✏️ EDITANDO" : "");
          html += "</span>";
          if (!isEditando) {
            html +=
              '<button class="btn-remover-loop btn btn-sm btn-danger" data-index="' +
              i +
              '" title="Remover este loop">✕</button>';
          }
          if (!isEditando && cmd.filhos && cmd.filhos.length > 0) {
            html +=
              '<span class="badge bg-info text-dark">' +
              cmd.filhos.length +
              " ação" +
              (cmd.filhos.length > 1 ? "es" : "") +
              "</span>";
          }
          if (isEditando) {
            html +=
              '<span class="badge bg-info p-1">' +
              cmd.filhos.length +
              " ações adicionadas</span>";
          }
          html += "</div>";

          html += '<div class="loop-filhos ms-3 d-flex flex-wrap gap-1">';
          if (cmd.filhos && cmd.filhos.length > 0) {
            for (var j = 0; j < cmd.filhos.length; j++) {
              var filho = cmd.filhos[j];
              var nomeFilho =
                this.nomesAcoes[filho] ||
                filho
                  .replace(/_/g, " ")
                  .toUpperCase()
                  .replace(/BATER PALMA/g, "BATER PALMA");
              html +=
                '<span class="badge bg-info p-2">' + nomeFilho + "</span>";
            }
          } else {
            html +=
              '<span class="text-' +
              (isEditando ? "warning" : "danger") +
              ' small">' +
              (isEditando ? "⚠️ Adicione ações!" : "⚠️ Nenhuma ação") +
              "</span>";
          }
          html += "</div>";

          if (isEditando) {
            html += '<div class="mt-2 d-flex gap-2 flex-wrap">';
            html +=
              '<button class="btn-add-ao-loop btn btn-sm btn-outline-success" data-acao="pular">🤸 PULAR</button>';
            html +=
              '<button class="btn-add-ao-loop btn btn-sm btn-outline-success" data-acao="bater_palma">👏 BATER PALMA</button>';
            html +=
              '<button class="btn-add-ao-loop btn btn-sm btn-outline-success" data-acao="girar">🔄 GIRAR</button>';
            html +=
              '<button class="btn-fechar-loop-inline btn btn-sm btn-success">✅ FECHAR</button>';
            html +=
              '<button class="btn-cancelar-loop-inline btn btn-sm btn-secondary">✖ CANCELAR</button>';
            html += "</div>";
          }

          html += "</div>";
        } else {
          var nomeCmd =
            this.nomesAcoes[cmd] ||
            cmd
              .replace(/_/g, " ")
              .toUpperCase()
              .replace(/BATER PALMA/g, "BATER PALMA");
          html += '<span class="badge bg-info p-2 m-1">' + nomeCmd + "</span>";
        }
      }

      area.innerHTML = html;

      // Eventos para botões de remover loop
      var self = this;
      document.querySelectorAll(".btn-remover-loop").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var index = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(index) && index >= 0 && index < self.comandos.length) {
            self.comandos.splice(index, 1);
            self.atualizarAreaAlgoritmo();
          }
        });
      });

      // Eventos para botões inline de adicionar ação ao loop
      document.querySelectorAll(".btn-add-ao-loop").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var acao = btn.getAttribute("data-acao");
          if (acao && self.modoLoop && self.loopEmEdicao) {
            self.loopEmEdicao.filhos.push(acao);
            self.atualizarAreaAlgoritmo();
            var msgDiv = document.getElementById("feedbackMsg");
            if (msgDiv) {
              var nome = self.nomesAcoes[acao] || acao;
              msgDiv.className = "alert alert-success mt-2";
              msgDiv.innerHTML =
                "✅ " +
                nome +
                " adicionado ao loop! (" +
                self.loopEmEdicao.filhos.length +
                " ações)";
            }
          }
        });
      });

      document
        .querySelectorAll(".btn-fechar-loop-inline")
        .forEach(function (btn) {
          btn.addEventListener("click", function () {
            self.fecharLoop();
          });
        });

      document
        .querySelectorAll(".btn-cancelar-loop-inline")
        .forEach(function (btn) {
          btn.addEventListener("click", function () {
            self.cancelarLoop();
          });
        });
    },

    // ===== LIMPAR ALGORITMO =====
    limparAlgoritmo() {
      if (this.modoLoop) {
        this.cancelarLoop();
      }
      this.comandos = [];
      this.atualizarAreaAlgoritmo();
      var msgDiv = document.getElementById("feedbackMsg");
      if (msgDiv) {
        msgDiv.className = "alert alert-info mt-2";
        msgDiv.innerHTML =
          "🗑️ Algoritmo limpo. Monte um novo com os cartões abaixo!";
      }
    },

    // ===== EXECUTAR ALGORITMO =====
    executarAlgoritmo() {
      if (this.timeoutId) clearTimeout(this.timeoutId);

      if (this.modoLoop) {
        var msgDiv = document.getElementById("feedbackMsg");
        if (msgDiv) {
          msgDiv.className = "alert alert-warning mt-2";
          msgDiv.innerHTML =
            "⚠️ Você está editando um loop. Finalize ou cancele antes de executar!";
        }
        return;
      }

      var acoes = [];
      for (var i = 0; i < this.comandos.length; i++) {
        var cmd = this.comandos[i];
        if (cmd.tipo === "repita") {
          if (!cmd.filhos || cmd.filhos.length === 0) continue;
          for (var r = 0; r < cmd.vezes; r++) {
            acoes.push.apply(acoes, cmd.filhos);
          }
        } else {
          acoes.push(cmd);
        }
      }

      if (acoes.length === 0) {
        var msgDiv = document.getElementById("feedbackMsg");
        if (msgDiv) {
          msgDiv.className = "alert alert-warning mt-2";
          msgDiv.innerHTML =
            "⚠️ Nenhuma ação para executar! Monte um algoritmo primeiro.";
        }
        return;
      }

      var esperado = this.desafios[this.indice].acaoEsperada;
      var acertou = JSON.stringify(acoes) === JSON.stringify(esperado);
      var msgDiv = document.getElementById("feedbackMsg");

      if (acertou) {
        this.pontuacao += 10;
        this.acertos++;
        if (msgDiv) {
          msgDiv.className = "alert alert-success mt-2";
          msgDiv.innerHTML = "🎉 PARABÉNS! Algoritmo correto! +10 pontos";
        }
        this.atualizarPontuacao();
        this.atualizarBarraProgressoJogo(100);
        var self = this;
        this.timeoutId = setTimeout(function () {
          if (self.indice + 1 < self.desafios.length) {
            self.indice++;
            self.carregarDesafio();
          } else {
            if (msgDiv) {
              msgDiv.className = "alert alert-warning mt-2";
              msgDiv.innerHTML =
                "🏆 VOCÊ COMPLETOU TODOS OS DESAFIOS! É UM MESTRE DO LOOP! 🏆";
            }
            var btnProximo = document.getElementById("btnProximoDesafio");
            if (btnProximo) btnProximo.disabled = true;
          }
          self.timeoutId = null;
        }, 1500);
      } else {
        if (msgDiv) {
          msgDiv.className = "alert alert-danger mt-2";
          var msg = "❌ BUG! Algoritmo errado. ";
          var acoesStr = acoes
            .map(function (a) {
              return self.nomesAcoes[a] || a;
            })
            .join(" → ");
          var esperadoStr = esperado
            .map(function (a) {
              return self.nomesAcoes[a] || a;
            })
            .join(" → ");
          msg +=
            "Seu algoritmo: " +
            (acoesStr || "(vazio)") +
            ". Esperado: " +
            esperadoStr +
            ". Tente novamente!";
          msgDiv.innerHTML = msg;
        }
        this.atualizarBarraProgressoJogo(0);
      }
    },

    // ===== PONTUAÇÃO =====
    atualizarPontuacao() {
      var pontuacaoEl = document.getElementById("pontuacao");
      var acertosEl = document.getElementById("acertos");
      if (pontuacaoEl) pontuacaoEl.innerText = this.pontuacao;
      if (acertosEl) acertosEl.innerHTML = "Acertos: " + this.acertos;
    },

    atualizarBarraProgressoJogo(percent) {
      var barra = document.getElementById("barraProgressoJogo");
      if (barra) {
        barra.style.width = percent + "%";
        barra.setAttribute("aria-valuenow", percent);
      }
    },

    atualizarStatusLoop(ativo, textoExtra) {
      var statusEl = document.getElementById("statusLoop");
      if (!statusEl) return;
      if (ativo) {
        var extra = textoExtra || "Adicione ações clicando nos cartões abaixo";
        statusEl.innerHTML =
          '<div class="alert alert-warning p-2 mb-0">' +
          "<strong>🔁 MODO LOOP ATIVO</strong> " +
          '<span class="badge bg-dark text-warning ms-2">' +
          extra +
          "</span> " +
          '<button id="btnFecharLoopEdicao" class="btn btn-success btn-sm ms-2">✅ FECHAR LOOP</button> ' +
          '<button id="btnCancelarLoopEdicao" class="btn btn-secondary btn-sm">✖ CANCELAR</button>' +
          "</div>";
        statusEl.style.display = "block";

        var self = this;
        var btnFechar = document.getElementById("btnFecharLoopEdicao");
        if (btnFechar) {
          btnFechar.addEventListener("click", function () {
            self.fecharLoop();
          });
        }
        var btnCancelar = document.getElementById("btnCancelarLoopEdicao");
        if (btnCancelar) {
          btnCancelar.addEventListener("click", function () {
            self.cancelarLoop();
          });
        }
      } else {
        statusEl.style.display = "none";
      }
    },

    // ===== EVENTOS =====
    configurarEventos: function () {
      var self = this;

      var cartoes = document.querySelectorAll(".cartao-cmd");
      cartoes.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var cmd = btn.getAttribute("data-cmd");
          if (cmd === "repita") {
            if (self.seletorLoopAtivo) {
              self.fecharSeletorLoop();
            }
            self.mostrarSeletorLoop();
          } else {
            self.adicionarComando(cmd);
          }
        });
      });

      var btnLoop = document.getElementById("btnLoop");
      if (btnLoop) {
        btnLoop.addEventListener("click", function () {
          if (self.seletorLoopAtivo) {
            self.fecharSeletorLoop();
          }
          self.mostrarSeletorLoop();
        });
      }

      var btnLimpar = document.getElementById("btnLimparAlgoritmo");
      if (btnLimpar) {
        btnLimpar.addEventListener("click", function () {
          self.limparAlgoritmo();
        });
      }

      var btnExecutar = document.getElementById("btnExecutar");
      if (btnExecutar) {
        btnExecutar.addEventListener("click", function () {
          self.executarAlgoritmo();
        });
      }

      var btnProximo = document.getElementById("btnProximoDesafio");
      if (btnProximo) {
        btnProximo.addEventListener("click", function () {
          if (self.modoLoop) {
            alert(
              "⚠️ Você está editando um loop. Finalize ou cancele primeiro!",
            );
            return;
          }
          if (self.indice + 1 < self.desafios.length) {
            self.indice++;
            self.carregarDesafio();
          } else {
            alert("🎉 Você já completou todos os desafios! Parabéns!");
          }
        });
      }
    },
  };

  // ========== MÓDULO CERTIFICADO ==========
  const CertificadoModule = {
    alunos: [],
    storageKey: "robozada_certificados_ano3",
    init() {
      this.inputNome = document.getElementById("nomeAluno");
      this.btnAdicionar = document.getElementById("btnAdicionar");
      this.listaAlunos = document.getElementById("listaAlunos");
      this.contadorAlunos = document.getElementById("contadorAlunos");
      this.btnImprimirTodos = document.getElementById(
        "btnImprimirCertificados",
      );
      this.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.previewNome = document.getElementById("previewNomeAluno");
      this.previewData = document.getElementById("previewData");

      if (!this.listaAlunos) return;

      this.carregarAlunos();
      this.atualizarLista();
      this.atualizarDataPreview();
      this.configurarEventos();
    },
    carregarAlunos() {
      var salvos = localStorage.getItem(this.storageKey);
      if (salvos) {
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      }
      if (!this.alunos.length) {
        this.alunos = [
          "ANA BEATRIZ SANTOS",
          "LUCAS MARTINS FERREIRA",
          "MARIA CLARA SILVA",
        ];
        this.salvarAlunos();
      }
    },
    salvarAlunos() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.alunos));
    },
    atualizarDataPreview() {
      if (this.previewData) {
        var hoje = new Date().toLocaleDateString("pt-BR");
        this.previewData.textContent = hoje;
      }
    },
    atualizarLista() {
      if (!this.listaAlunos) return;
      this.listaAlunos.innerHTML = "";
      if (this.alunos.length === 0) {
        this.listaAlunos.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado 🤖</li>';
        if (this.contadorAlunos) this.contadorAlunos.textContent = "0";
        this.atualizarBotoes();
        return;
      }
      var self = this;
      this.alunos.forEach(function (aluno, idx) {
        var li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML =
          '<span><i class="bi bi-robot"></i> ' +
          self.escapeHtml(aluno) +
          "</span>" +
          "<div>" +
          '<button class="btn-selecionar-aluno btn-sm" data-nome="' +
          self.escapeHtml(aluno) +
          '">👁️</button> ' +
          '<button class="btn-remover-aluno btn-sm btn-danger ms-1" data-idx="' +
          idx +
          '">🗑️</button>' +
          "</div>";
        self.listaAlunos.appendChild(li);
      });
      if (this.contadorAlunos)
        this.contadorAlunos.textContent = this.alunos.length;
      this.atualizarBotoes();

      document
        .querySelectorAll(".btn-selecionar-aluno")
        .forEach(function (btn) {
          btn.addEventListener("click", function (e) {
            var nome = btn.getAttribute("data-nome");
            if (nome && self.previewNome) self.previewNome.textContent = nome;
            self.atualizarBotoes();
          });
        });
      document.querySelectorAll(".btn-remover-aluno").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          var idx = parseInt(btn.getAttribute("data-idx"));
          if (!isNaN(idx)) self.removerAluno(idx);
        });
      });
    },
    removerAluno(idx) {
      var nomeRemovido = this.alunos[idx];
      if (confirm("Remover " + nomeRemovido + " da lista?")) {
        this.alunos.splice(idx, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.previewNome && this.previewNome.textContent === nomeRemovido) {
          this.previewNome.textContent = "[NOME DO ALUNO]";
        }
      }
    },
    atualizarBotoes() {
      var temAlunos = this.alunos.length > 0;
      if (this.btnImprimirTodos) this.btnImprimirTodos.disabled = !temAlunos;
      if (this.btnPreviewAluno) {
        var nomeSelecionado = this.previewNome
          ? this.previewNome.textContent
          : "";
        this.btnPreviewAluno.disabled =
          nomeSelecionado === "[NOME DO ALUNO]" || nomeSelecionado === "";
      }
    },
    adicionarAluno() {
      if (!this.inputNome) return;
      var nome = this.inputNome.value.trim().toUpperCase();
      if (!nome) {
        alert("🤖 Digite o nome do aluno(a) primeiro!");
        return;
      }
      if (this.alunos.indexOf(nome) !== -1) {
        alert("⚠️ Este aluno já está na lista!");
        return;
      }
      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarLista();
      this.inputNome.value = "";
      this.inputNome.focus();
    },
    imprimirTodos: function () {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir.");
        return;
      }
      var dataAtual = new Date().toLocaleDateString("pt-BR");
      var cardsHTML = "";
      var self = this;
      this.alunos.forEach(function (aluno) {
        cardsHTML +=
          '<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid; page-break-inside:avoid;">' +
          "<h3 style=\"color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;\">🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>" +
          '<p style="color:#4a6e2c;">Certificamos que</p>' +
          '<strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">' +
          self.escapeHtml(aluno) +
          "</strong>" +
          '<p style="color:#4a6e2c;">concluiu o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>' +
          '<hr style="margin:12px 0; border:1px solid #ffb347;">' +
          '<p style="font-size:0.65rem; color:#6b8c5c;">RobôMestres do Paraná • ' +
          dataAtual +
          "</p>" +
          '<p style="font-size:0.6rem; color:#b4621a; font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>' +
          '<div style="font-size:0.55rem; margin-top:8px;">🤖 Ass: Robô Zé 3.0</div>' +
          "</div>";
      });
      var htmlLote =
        "<!DOCTYPE html>" +
        "<html>" +
        '<head><meta charset="UTF-8"><title>Certificados RobôMestres - 3º Ano</title>' +
        "<style>" +
        "* { margin: 0; padding: 0; box-sizing: border-box; }" +
        "body { font-family: 'Courier New', monospace; background: white; padding: 20px; }" +
        ".print-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }" +
        "@media print {" +
        "body { padding: 0; margin: 0; }" +
        ".print-grid { gap: 15px; }" +
        "@page { size: A4; margin: 0.8cm; }" +
        "}" +
        "</style>" +
        "</head>" +
        "<body>" +
        '<div class="print-grid">' +
        cardsHTML +
        "</div>" +
        "<script>" +
        "window.onload = function() {" +
        "setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 200);" +
        "};" +
        "<\/script>" +
        "</body>" +
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
      var nomeSelecionado = this.previewNome
        ? this.previewNome.textContent
        : "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      var dataAtual = new Date().toLocaleDateString("pt-BR");
      var html =
        "<!DOCTYPE html>" +
        "<html>" +
        '<head><meta charset="UTF-8"><title>Certificado - ' +
        this.escapeHtml(nomeSelecionado) +
        "</title>" +
        "<style>" +
        "body { font-family: 'Courier New', monospace; background: #e0e0e0; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; }" +
        ".certificado { border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:30px; text-align:center; background:#fffef7; max-width:800px; margin:0 auto; }" +
        ".certificado h3 { color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.9rem; }" +
        ".certificado strong.nome { font-size:22px; display:block; margin:15px 0; color:#2c5e1f; background:#fff0cc; padding:12px; border-radius:40px; }" +
        "@media print { body { background:white; } @page { size: A4; margin: 1.5cm; } }" +
        "</style>" +
        "</head>" +
        "<body>" +
        '<div class="certificado">' +
        "<h3>🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>" +
        "<p>Certificamos que</p>" +
        '<strong class="nome">' +
        this.escapeHtml(nomeSelecionado) +
        "</strong>" +
        "<p>concluiu com êxito o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>" +
        "<hr><p>RobôMestres do Paraná • " +
        dataAtual +
        "</p>" +
        '<p style="font-size:11px;">"Loop não é macarrão! Variável não é coisa de velho!"</p>' +
        "<div>🤖 Ass: Robô Zé 3.0</div>" +
        "</div>" +
        "<script>window.print(); setTimeout(window.close, 500);<\/script>" +
        "</body>" +
        "</html>";
      var win = window.open("", "_blank", "width=900,height=700");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else {
        alert("⚠️ Permita pop-ups para visualizar o certificado.");
      }
    },
    escapeHtml: function (str) {
      if (!str) return "";
      return str.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    },
    configurarEventos: function () {
      var self = this;
      if (this.btnAdicionar) {
        this.btnAdicionar.addEventListener("click", function () {
          self.adicionarAluno();
        });
      }
      if (this.inputNome) {
        this.inputNome.addEventListener("keypress", function (e) {
          if (e.key === "Enter") self.adicionarAluno();
        });
      }
      if (this.btnImprimirTodos) {
        this.btnImprimirTodos.addEventListener("click", function () {
          self.imprimirTodos();
        });
      }
      if (this.btnPreviewAluno) {
        this.btnPreviewAluno.addEventListener("click", function () {
          self.previewAlunoSelecionado();
        });
      }
    },
  };

  // ========== INICIALIZAÇÃO GERAL ==========
  document.addEventListener("DOMContentLoaded", function () {
    try {
      highlightCurrentPage();
      PlanosModule.init();
      JogoModule.init();
      CertificadoModule.init();
      console.log("✅ a3bim1.js carregado - Todos os módulos ativos!");
    } catch (err) {
      console.error("Erro na inicialização dos módulos:", err);
    }
  });

  window.addEventListener("hashchange", highlightCurrentPage);
})();
