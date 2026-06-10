// ==================================================
// a1bim4.js - Lógica consolidada para o 1º Ano - Bimestre 4
// Funcionalidades: cabeçalho, planos de aula (checkboxes),
// jogo do bimestre (Robô Artista), certificado, rodapé
// ==================================================

(function () {
  "use strict";

  // ========== 1. CABEÇALHO (contador de bugs) ==========
  const CabecalhoModule = {
    contadorBugs: 0,
    contadorElement: null,
    linhaErroElement: null,

    init() {
      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.linhaErroElement = document.getElementById("linhaErroHeader");
      this.carregarContador();
      this.atualizarDisplay();
      this.configurarEventos();
    },

    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        this.contadorBugs = salvo ? parseInt(salvo) : 0;
      } catch (e) {
        this.contadorBugs = 0;
      }
    },

    salvarContador() {
      localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs);
    },

    atualizarDisplay() {
      if (this.contadorElement)
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      const rodapeRel = document.getElementById("relatorioBugsRodape");
      if (rodapeRel)
        rodapeRel.innerHTML = `🐛 Relatório de bugs: ${this.contadorBugs}`;
    },

    incrementarBugs(incremento = 1, mensagem = "") {
      this.contadorBugs += incremento;
      this.salvarContador();
      this.atualizarDisplay();
      if (this.linhaErroElement && mensagem) {
        this.linhaErroElement.innerHTML = `<i class="bi bi-terminal"></i> ${mensagem}`;
        setTimeout(() => {
          if (this.linhaErroElement)
            this.linhaErroElement.innerHTML = `<i class="bi bi-terminal"></i> [SISTEMA] Bimestre 4 inicializado.`;
        }, 3000);
      }
      return this.contadorBugs;
    },

    configurarEventos() {
      document.addEventListener("robo:bug", (e) => {
        this.incrementarBugs(
          e.detail?.incremento || 1,
          e.detail?.mensagem || "Bug detectado!",
        );
      });
      document.addEventListener("robo:resetBugs", () => {
        this.contadorBugs = 0;
        this.salvarContador();
        this.atualizarDisplay();
      });
    },
  };

  // ========== 2. PLANOS DE AULA (checkboxes e progresso) ==========
  const PlanosAulaModule = {
    STORAGE_KEY: "planoAula_Concluidas_1ano_bim4",
    checkboxes: null,

    init() {
      this.checkboxes = document.querySelectorAll(".semana-check");
      if (!this.checkboxes.length) return;
      this.carregarProgresso();
      this.configurarEventos();
    },

    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb) => {
        const semana = cb.getAttribute("data-semana");
        if (semana) concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },

    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) return;
      try {
        const concluidas = JSON.parse(salvo);
        this.checkboxes.forEach((cb) => {
          const semana = cb.getAttribute("data-semana");
          if (semana && concluidas.hasOwnProperty(semana))
            cb.checked = concluidas[semana];
        });
      } catch (e) { }
    },

    configurarEventos() {
      this.checkboxes.forEach((cb) => {
        cb.addEventListener("change", () => this.salvarProgresso());
      });
    },
  };

  // ========== 3. JOGO DO BIMESTRE (Robô Artista) ==========
  (function () {
    let pilhaOK = true;
    let limpezaOK = true;
    let canvas, ctx;
    let desenhando = false;
    let ultimoX, ultimoY;

    const statusDiv = document.getElementById("statusRoboNovo");
    const feedbackSaude = document.getElementById("feedbackSaudeNovo");
    const feedbackArte = document.getElementById("feedbackArteNovo");
    const btnPilha = document.getElementById("btnTrocarPilha");
    const btnLimpar = document.getElementById("btnLimparRobo");
    const btnReset = document.getElementById("btnResetJogoNovo");
    const botoesComando = document.querySelectorAll(".btn-comando-novo");

    function initCanvas() {
      canvas = document.getElementById("canvasDesenhoNovo");
      if (!canvas) {
        console.error("Canvas não encontrado!");
        return;
      }
      ctx = canvas.getContext("2d");
      limparDesenho();
    }

    function limparDesenho() {
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ultimoX = canvas.width / 2;
      ultimoY = canvas.height / 2;
      ctx.beginPath();
      ctx.moveTo(ultimoX, ultimoY);
    }

    function atualizarStatusUI() {
      if (statusDiv) {
        let texto = pilhaOK ? "🔋 Pilha: OK" : "🔋 Pilha: FRACA";
        texto += " | ";
        texto += limpezaOK ? "🧼 Limpeza: OK" : "🧼 Limpeza: SUJA";
        statusDiv.innerHTML = texto;
      }

      if (!pilhaOK && !limpezaOK) {
        feedbackSaude.innerHTML =
          "⚠️ Robô sem bateria e sujo! Use os botões para consertar.";
      } else if (!pilhaOK) {
        feedbackSaude.innerHTML = "⚠️ Bateria fraca! Troque a pilha.";
      } else if (!limpezaOK) {
        feedbackSaude.innerHTML = "⚠️ Robô sujo! Faça a limpeza.";
      } else {
        feedbackSaude.innerHTML =
          "✅ Robô saudável! Use os comandos para desenhar.";
      }
    }

    function podeDesenhar() {
      if (!pilhaOK) {
        feedbackArte.innerHTML =
          "🔋 ERRO: Bateria fraca! Troque a pilha primeiro.";
        dispararBug("Bateria fraca - não desenhou");
        return false;
      }
      if (!limpezaOK) {
        feedbackArte.innerHTML = "🧼 ERRO: Robô sujo! Limpe antes de desenhar.";
        dispararBug("Sensor sujo - não desenhou");
        return false;
      }
      return true;
    }

    function dispararBug(mensagem) {
      const event = new CustomEvent("robo:bug", {
        detail: { incremento: 1, mensagem: mensagem },
      });
      document.dispatchEvent(event);
      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.incrementarBugs === "function"
      ) {
        window.CabecalhoModule.incrementarBugs(1, mensagem);
      } else {
        const contadorSpan = document.getElementById("contadorBugsHeader");
        if (contadorSpan) {
          let atual = parseInt(contadorSpan.innerHTML.replace("🤯 ", "")) || 0;
          contadorSpan.innerHTML = `🤯 ${atual + 1}`;
        }
        const rodapeRel = document.getElementById("relatorioBugsRodape");
        if (rodapeRel) {
          let atual =
            parseInt(
              rodapeRel.innerHTML.replace("🐛 Relatório de bugs: ", ""),
            ) || 0;
          rodapeRel.innerHTML = `🐛 Relatório de bugs: ${atual + 1}`;
        }
      }
    }

    function executarComando(comando) {
      if (!podeDesenhar()) return;

      let novoX = ultimoX;
      let novoY = ultimoY;
      const passo = 15;

      switch (comando) {
        case "frente":
          novoY -= passo;
          break;
        case "tras":
          novoY += passo;
          break;
        case "esquerda":
          novoX -= passo;
          break;
        case "direita":
          novoX += passo;
          break;
        case "limpar":
          limparDesenho();
          feedbackArte.innerHTML = "🗑️ Desenho limpo!";
          return;
        default:
          return;
      }

      if (
        novoX < 0 ||
        novoX > canvas.width ||
        novoY < 0 ||
        novoY > canvas.height
      ) {
        feedbackArte.innerHTML = "🚧 Robô bateu na borda! Comando ignorado.";
        dispararBug("Tentativa de sair do canvas");
        return;
      }

      ctx.beginPath();
      ctx.moveTo(ultimoX, ultimoY);
      ctx.lineTo(novoX, novoY);
      ctx.stroke();
      ultimoX = novoX;
      ultimoY = novoY;
      feedbackArte.innerHTML = `🎨 Executou: ${comando}`;
    }

    function trocarPilha() {
      pilhaOK = true;
      atualizarStatusUI();
      feedbackSaude.innerHTML = "🔋 Pilha trocada! Robô recarregado.";
      setTimeout(() => {
        if (feedbackSaude.innerHTML === "🔋 Pilha trocada! Robô recarregado.")
          feedbackSaude.innerHTML = "";
      }, 2000);
    }

    function limparRobo() {
      limpezaOK = true;
      atualizarStatusUI();
      feedbackSaude.innerHTML = "🧽 Robô limpo! Sensores funcionando.";
      setTimeout(() => {
        if (feedbackSaude.innerHTML === "🧽 Robô limpo! Sensores funcionando.")
          feedbackSaude.innerHTML = "";
      }, 2000);
    }

    function resetJogo() {
      pilhaOK = true;
      limpezaOK = true;
      limparDesenho();
      atualizarStatusUI();
      feedbackArte.innerHTML = "Jogo reiniciado! Robô saudável.";
      feedbackSaude.innerHTML = "";
      setTimeout(() => {
        if (feedbackArte.innerHTML === "Jogo reiniciado! Robô saudável.")
          feedbackArte.innerHTML = "";
      }, 3000);
    }

    function configurarEventos() {
      if (btnPilha) btnPilha.addEventListener("click", trocarPilha);
      if (btnLimpar) btnLimpar.addEventListener("click", limparRobo);
      if (btnReset) btnReset.addEventListener("click", resetJogo);
      if (botoesComando) {
        botoesComando.forEach((btn) => {
          btn.addEventListener("click", () => {
            const comando = btn.getAttribute("data-comando");
            if (comando) executarComando(comando);
          });
        });
      }
    }

    function init() {
      initCanvas();
      configurarEventos();
      atualizarStatusUI();
      console.log("✅ Jogo Robô Artista (versão revisada) inicializado!");
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  })();

  // ========== 4. CERTIFICADO ==========
  (function () {
    const CertificadoModule = {
      alunos: [],
      STORAGE_KEY: "robozada_certificados_ano1_bim4",

      init() {
        console.log("🎓 Inicializando CertificadoModule...");
        this.carregarElementos();
        this.carregarAlunos();
        this.atualizarLista();
        this.configurarEventos();
        this.atualizarPreviewData();
      },

      carregarElementos() {
        this.inputNome = document.getElementById("nomeAluno");
        this.btnAdicionar = document.getElementById("btnAdicionar");
        this.listaAlunos = document.getElementById("listaAlunos");
        this.contadorAlunos = document.getElementById("contadorAlunos");
        this.btnImprimir = document.getElementById("btnImprimirCertificados");
        this.btnPreview = document.getElementById("btnPreviewAluno");
        this.previewNome = document.getElementById("previewNomeAluno");
        this.previewData = document.getElementById("previewData");
      },

      carregarAlunos() {
        const salvos = localStorage.getItem(this.STORAGE_KEY);
        if (salvos) {
          try {
            this.alunos = JSON.parse(salvos);
          } catch (e) {
            this.alunos = [];
          }
        }
        if (!this.alunos.length)
          this.alunos = ["ANA BEATRIZ", "LUCAS MARTINS", "MARIA CLARA"];
        this.salvar();
      },

      salvar() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
      },

      atualizarLista() {
        if (!this.listaAlunos) return;
        if (!this.alunos.length) {
          this.listaAlunos.innerHTML =
            '<li class="text-muted text-center">Nenhum aluno cadastrado</li>';
          if (this.contadorAlunos) this.contadorAlunos.textContent = "0";
          return;
        }
        this.listaAlunos.innerHTML = "";
        this.alunos.forEach((aluno, idx) => {
          const li = document.createElement("li");
          li.className = "d-flex justify-content-between align-items-center";
          li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
          <div class="btn-group gap-1">
            <button class="btn-selecionar-aluno btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
            <button class="btn-remover-aluno btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
          </div>`;
          this.listaAlunos.appendChild(li);
        });
        if (this.contadorAlunos)
          this.contadorAlunos.textContent = this.alunos.length;
        this.atualizarEstadoBotoes();

        document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
          btn.removeEventListener("click", this._handleSelect);
          btn.addEventListener("click", (e) => {
            const nome = btn.getAttribute("data-nome");
            if (nome && this.previewNome) this.previewNome.textContent = nome;
            this.atualizarEstadoBotoes();
          });
        });
        document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
          btn.removeEventListener("click", this._handleRemove);
          btn.addEventListener("click", (e) => {
            const idx = parseInt(btn.getAttribute("data-index"));
            if (!isNaN(idx)) this.removerAluno(idx);
          });
        });
      },

      removerAluno(idx) {
        if (confirm(`Remover ${this.alunos[idx]} da lista?`)) {
          this.alunos.splice(idx, 1);
          this.salvar();
          this.atualizarLista();
          if (
            this.previewNome &&
            this.previewNome.textContent === this.alunos[idx]
          )
            this.previewNome.textContent = "[NOME DO ALUNO]";
        }
      },

      adicionarAluno() {
        let nome = this.inputNome?.value.trim();
        if (!nome) {
          alert("Digite o nome do aluno!");
          return;
        }
        nome = nome.toUpperCase();
        if (this.alunos.includes(nome)) {
          alert("Aluno já cadastrado!");
          return;
        }
        this.alunos.push(nome);
        this.salvar();
        this.atualizarLista();
        if (this.inputNome) this.inputNome.value = "";
      },

      atualizarEstadoBotoes() {
        if (this.btnImprimir)
          this.btnImprimir.disabled = this.alunos.length === 0;
        if (this.btnPreview) {
          const nome = this.previewNome?.textContent || "";
          this.btnPreview.disabled = nome === "[NOME DO ALUNO]" || nome === "";
        }
      },

      previewAlunoSelecionado() {
        const nome = this.previewNome?.textContent;
        if (!nome || nome === "[NOME DO ALUNO]") {
          alert("Selecione um aluno na lista primeiro!");
          return;
        }
        this.gerarCertificadoUnico(nome);
      },

      gerarCertificadoUnico(nome) {
        const data = new Date().toLocaleDateString("pt-BR");
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${nome}</title><style>
        body { font-family: monospace; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #e0e0e0; }
        .cert { border:3px solid #ffb347; border-radius:48px 24px; padding:30px; text-align:center; background:#fffef7; max-width:600px; }
        h3 { color:#ffb347; } .nome { font-size:22px; background:#fff0cc; padding:12px; border-radius:40px; }
        @media print { body { background:white; } .btn { display:none; } }
      </style></head><body>
      <div class="cert"><h3>🏆 CERTIFICADO DE DOUTOR(A) EM DESBUGAÇÃO</h3>
      <p>Certificamos que</p><div class="nome">${this.escapeHtml(nome)}</div>
      <p>concluiu o <strong>1º ANO - ROBÓTICA EDUCACIONAL</strong><br>🤖 Algoritmos 🔄 Loops ⚖️ Condicionais 🎨 Robôs artistas</p>
      <hr><p>RobôMestres do Paraná • ${data}</p><p>"Programar é dar comandos com carinho. E errar é só um bug esperando um abraço."</p>
      <div>🤖 Ass: Robô Zé 1.0</div><div><button onclick="window.print()">🖨️ Imprimir</button> <button onclick="window.close()">Fechar</button></div>
      </div></body></html>`;
        const win = window.open("", "_blank", "width=800,height=600");
        if (win) {
          win.document.write(html);
          win.document.close();
        } else alert("Permita pop-ups para visualizar o certificado.");
      },

      imprimirTodos() {
        if (!this.alunos.length) {
          alert("Nenhum aluno cadastrado!");
          return;
        }
        const data = new Date().toLocaleDateString("pt-BR");
        let cards = "";
        this.alunos.forEach((aluno) => {
          cards += `<div class="cert-print" style="border:2px solid #ffb347; border-radius:32px; padding:15px; text-align:center; break-inside:avoid;">
          <h3 style="color:#ffb347;">🏆 CERTIFICADO</h3><p>Certificamos que</p><strong>${this.escapeHtml(aluno)}</strong>
          <p>concluiu o 1º ano de Robótica</p><hr><p>${data}</p></div>`;
        });
        const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados Lote</title>
        <style>.print-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:15px; } @media print { @page { size:A4; margin:0.8cm; } }</style>
      </head><body><div class="print-grid">${cards}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200);};<\/script></body></html>`;
        const win = window.open("", "_blank", "width=1000,height=800");
        if (win) {
          win.document.write(html);
          win.document.close();
        }
      },

      atualizarPreviewData() {
        if (this.previewData)
          this.previewData.textContent = new Date().toLocaleDateString("pt-BR");
      },

      escapeHtml(str) {
        if (!str) return "";
        return str.replace(/[&<>]/g, function (m) {
          if (m === "&") return "&amp;";
          if (m === "<") return "&lt;";
          if (m === ">") return "&gt;";
          return m;
        });
      },

      configurarEventos() {
        if (this.btnAdicionar)
          this.btnAdicionar.addEventListener("click", () =>
            this.adicionarAluno(),
          );
        if (this.inputNome)
          this.inputNome.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.adicionarAluno();
          });
        if (this.btnImprimir)
          this.btnImprimir.addEventListener("click", () =>
            this.imprimirTodos(),
          );
        if (this.btnPreview)
          this.btnPreview.addEventListener("click", () =>
            this.previewAlunoSelecionado(),
          );
      },
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        CertificadoModule.init(),
      );
    } else {
      CertificadoModule.init();
    }
  })();

  // ========== 5. MENU: DESTAQUE DA PÁGINA ATIVA (modelo_menu_bim.js) ==========
  function highlightCurrentPage() {
    const currentPath = window.location.pathname.split("/").pop() || "a1index.html";
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

  function consoleWelcome() {
    console.log(
      "%c🤖 ROBOZADA 3000 - MENU BIMESTRAL ATIVO",
      "color: #ffb347; font-size: 14px; font-family: monospace;",
    );
    console.log(
      "%c🔁 Loop não é macarrão! Variável não é coisa de velho! Depurar não é xingamento!",
      "color: #9bbc7b;",
    );
  }

  function initTooltips() {
    const devEmails = document.querySelectorAll(".dev-contato a");
    if (devEmails.length) {
      devEmails.forEach((email) => {
        email.setAttribute("title", "Clique para enviar e-mail");
        email.style.cursor = "pointer";
      });
    }
  }

  // ========== INICIALIZAÇÃO GERAL ==========
  document.addEventListener("DOMContentLoaded", () => {
    CabecalhoModule.init();
    PlanosAulaModule.init();
    // O jogo já se autoinicializou via IIFE, então não chamamos novamente.
    // CertificadoModule já foi inicializado via seu próprio DOMContentLoaded, mas para evitar duplicidade,
    // vamos garantir que não seja chamado duas vezes. Como ele já tem seu próprio listener, não precisamos chamar aqui.
    // No entanto, para manter a ordem e não quebrar nada, vamos apenas adicionar as funções do menu.
    highlightCurrentPage();
    consoleWelcome();
    initTooltips();

    // Botão de reset de bugs (opcional via console)
    window.resetBugs = () =>
      document.dispatchEvent(new CustomEvent("robo:resetBugs"));
  });
})();
