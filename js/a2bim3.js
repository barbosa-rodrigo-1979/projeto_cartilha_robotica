// ==================================================
// a2bim3.js - SCRIPT UNIFICADO PARA 3º BIMESTRE - 2º ANO
// CORRIGIDO: Novo jogo com eventos, loops, condicionais e falar
// ==================================================

(function () {
  "use strict";

  // ==================== MÓDULO CABEÇALHO ====================
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
      console.log("%c🤖 [CABEÇALHO] Inicializado", "color:#ffb347");
    },
    carregarContador() {
      try {
        return parseInt(localStorage.getItem("cabecalho_contador_bugs")) || 0;
      } catch (e) {
        return 0;
      }
    },
    salvarContador() {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs);
      } catch (e) {}
    },
    atualizarDisplayContador() {
      if (this.contadorElement)
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      if (this.relatorioElement)
        this.relatorioElement.innerText = this.contadorBugs;
    },
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      return this.contadorBugs;
    },
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      return 0;
    },
    getContadorBugs() {
      return this.contadorBugs;
    },
    configurarEventos() {
      document.addEventListener("robo:bug", (e) => {
        this.incrementarBugs(e.detail?.incremento || 1);
      });
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
      });
    },
  };

  // ==================== MÓDULO RODAPÉ ====================
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,
    init() {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.relatorioElement) this.atualizarRelatorio();
      this.configurarEventos();
      this.inicializado = true;
      console.log("%c🤖 [RODAPÉ] Inicializado", "color:#ffb347");
    },
    atualizarRelatorio() {
      if (!this.relatorioElement) return;
      let contador = 0;
      if (
        window.CabecalhoModule &&
        typeof window.CabecalhoModule.getContadorBugs === "function"
      )
        contador = window.CabecalhoModule.getContadorBugs();
      else
        try {
          contador =
            parseInt(localStorage.getItem("cabecalho_contador_bugs")) || 0;
        } catch (e) {}
      this.relatorioElement.innerText = contador;
    },
    configurarEventos() {
      document.addEventListener("robo:bug", () => this.atualizarRelatorio());
      document.addEventListener("robo:resetBugs", () =>
        this.atualizarRelatorio(),
      );
      document.addEventListener("cabecalho:contador_atualizado", () =>
        this.atualizarRelatorio(),
      );
    },
  };

  // ==================== MÓDULO PLANOS DE AULA (checkboxes) ====================
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_2ano_bim3",
    totalSemanas: 10,
    checkboxes: [],
    init() {
      if (!document.getElementById("accordionAulas")) return;
      this.checkboxes = document.querySelectorAll(".semana-check");
      if (this.checkboxes.length) this.totalSemanas = this.checkboxes.length;
      this.carregarProgresso();
      this.configurarEventos();
      this.inicializado = true;
      console.log("📚 [PlanosAulaModule] Inicializado");
    },
    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb, idx) => {
        const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (!salvo) return;
      try {
        const concluidas = JSON.parse(salvo);
        this.checkboxes.forEach((cb, idx) => {
          const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
          if (concluidas[semana]) cb.checked = concluidas[semana];
        });
      } catch (e) {}
    },
    configurarEventos() {
      this.checkboxes.forEach((cb) =>
        cb.addEventListener("change", () => this.salvarProgresso()),
      );
    },
  };

  // ==================== MÓDULO CERTIFICADO ====================
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_2ano_bim3",
    elementos: {},
    init() {
      if (!document.getElementById("listaAlunos")) return;
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.inicializado = true;
      console.log("🎓 [CertificadoModule] Inicializado");
    },
    carregarElementos() {
      this.elementos = {
        inputNome: document.getElementById("nomeAluno"),
        btnAdicionar: document.getElementById("btnAdicionar"),
        listaAlunos: document.getElementById("listaAlunos"),
        contadorAlunos: document.getElementById("contadorAlunos"),
        btnImprimirTodos: document.getElementById("btnImprimirCertificados"),
        btnPreviewAluno: document.getElementById("btnPreviewAluno"),
        previewNome: document.getElementById("previewNomeAluno"),
        previewData: document.getElementById("previewData"),
      };
    },
    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos)
        try {
          this.alunos = JSON.parse(salvos);
        } catch (e) {
          this.alunos = [];
        }
      if (!this.alunos.length)
        this.alunos = [
          "ANA BEATRIZ SANTOS",
          "LUCAS MARTINS FERREIRA",
          "MARIA CLARA SILVA",
        ];
    },
    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
    },
    atualizarPreviewData() {
      if (this.elementos.previewData)
        this.elementos.previewData.textContent = new Date().toLocaleDateString(
          "pt-BR",
        );
    },
    adicionarAluno() {
      let nome = this.elementos.inputNome?.value.trim();
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
      this.elementos.inputNome.value = "";
      this.atualizarEstadoBotoes();
    },
    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.elementos.previewNome?.textContent === this.alunos[index])
          this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        this.atualizarEstadoBotoes();
      }
    },
    selecionarAlunoPreview(nome) {
      if (this.elementos.previewNome)
        this.elementos.previewNome.textContent = nome;
      this.atualizarEstadoBotoes();
    },
    atualizarLista() {
      const listaUl = this.elementos.listaAlunos;
      if (!listaUl) return;
      if (this.alunos.length === 0) {
        listaUl.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (this.elementos.contadorAlunos)
          this.elementos.contadorAlunos.textContent = "0";
        return;
      }
      listaUl.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span><div class="btn-group gap-1"><button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button><button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button></div>`;
        listaUl.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) =>
        btn.addEventListener("click", (e) => {
          this.selecionarAlunoPreview(btn.getAttribute("data-nome"));
        }),
      );
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) =>
        btn.addEventListener("click", (e) => {
          this.removerAluno(parseInt(btn.getAttribute("data-index")));
        }),
      );
      if (this.elementos.contadorAlunos)
        this.elementos.contadorAlunos.textContent = this.alunos.length;
    },
    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title><style>body{font-family:'Courier New',monospace;background:#e0e0e0;display:flex;justify-content:center;align-items:center;padding:40px}.certificado{border:3px solid #ffb347;border-radius:48px 24px;padding:30px;background:#fffef7;text-align:center}.certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem}.nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px}@media print{.btn-print{display:none}}</style></head><body><div class="certificado"><h3>🏆 CERTIFICADO DE MESTRE DO SCRATCHJR - NÍVEL 3</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong><p>concluiu com êxito o <strong>3º BIMESTRE - ROBÓTICA EDUCACIONAL</strong><br>🔁 REPITA | 📦 EVENTOS | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p><hr><p>RobôMestres do Paraná • ${data}</p><p>"REPITA 3 VEZES: PARABÉNS! PARABÉNS! PARABÉNS!"</p><div>🤖 Ass: Robô Zé 2.0</div></div><script>window.print();<\/script></body></html>`;
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para imprimir.");
    },
    imprimirTodosCertificados() {
      if (!this.alunos.length) {
        alert("🤖 Nenhum aluno cadastrado!");
        return;
      }
      const data = new Date().toLocaleDateString("pt-BR");
      let cards = "";
      this.alunos.forEach((aluno) => {
        cards += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;"><h3 style="color:#ffb347; font-size:0.7rem;">🏆 CERTIFICADO MESTRE DO SCRATCHJR - NÍVEL 3</h3><p>Certificamos que</p><strong style="display:block; background:#fff0cc; padding:8px; border-radius:40px;">${this.escapeHtml(aluno)}</strong><p>3º BIMESTRE - ROBÓTICA<br>🔁 REPITA | 📦 EVENTOS | 🐛 DEPURAÇÃO</p><hr><p>RobôMestres do Paraná • ${data}</p></div>`;
      });
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados</title><style>.print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;}@media print{@page{size:A4;margin:0.8cm;}}</style></head><body><div class="print-grid">${cards}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200)};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else alert("⚠️ Permita pop-ups.");
    },
    previewAlunoSelecionado() {
      const nome = this.elementos.previewNome?.textContent;
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
    },
    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimirTodos)
        this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      if (this.elementos.btnPreviewAluno)
        this.elementos.btnPreviewAluno.disabled =
          !this.elementos.previewNome?.textContent ||
          this.elementos.previewNome.textContent === "[NOME DO ALUNO]";
    },
    configurarEventos() {
      if (this.elementos.btnAdicionar)
        this.elementos.btnAdicionar.addEventListener("click", () =>
          this.adicionarAluno(),
        );
      if (this.elementos.inputNome)
        this.elementos.inputNome.addEventListener("keypress", (e) => {
          if (e.key === "Enter") this.adicionarAluno();
        });
      if (this.elementos.btnImprimirTodos)
        this.elementos.btnImprimirTodos.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      if (this.elementos.btnPreviewAluno)
        this.elementos.btnPreviewAluno.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
    },
    escapeHtml(t) {
      return t.replace(/[&<>]/g, function (m) {
        if (m === "&") return "&amp;";
        if (m === "<") return "&lt;";
        if (m === ">") return "&gt;";
        return m;
      });
    },
  };

  // ==================== JOGO ESTÚDIO SCRATCHJR (VERSÃO COMPLETA COM LOOPS E CONDICIONAIS EXPLÍCITOS) ====================
  const ScratchJrGame = (function () {
    // Configuração do palco 5x5
    let posRobo = { x: 2, y: 0, direcao: 1 }; // 0:cima,1:dir,2:baixo,3:esq
    const objetivo = { x: 4, y: 4 };
    const obstaculos = [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
    ];
    const gridSize = 5;
    let programa = [];
    let executando = false;
    const posInicial = { x: 2, y: 0, direcao: 1 };
    let elementos = {};

    function obterCelula(x, y) {
      if (x === posRobo.x && y === posRobo.y) return "🤖";
      if (x === objetivo.x && y === objetivo.y) return "⭐";
      if (obstaculos.some((obs) => obs.x === x && obs.y === y)) return "🧱";
      return "⬜";
    }

    function desenharPalco() {
      const container = elementos.palco;
      if (!container) return;
      container.innerHTML = "";
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const celula = document.createElement("div");
          celula.classList.add("celula-palco");
          celula.textContent = obterCelula(i, j);
          container.appendChild(celula);
        }
      }
    }

    function renderizarScript() {
      const container = elementos.listaScript;
      if (!container) return;
      if (programa.length === 0) {
        container.innerHTML =
          '<span class="text-muted">Nenhum bloco adicionado. Clique nos blocos abaixo.</span>';
        return;
      }
      container.innerHTML = "";
      programa.forEach((cmd, idx) => {
        const span = document.createElement("span");
        span.classList.add("badge", "bg-secondary", "me-2", "mb-1", "p-2");
        span.style.fontSize = "0.8rem";
        let texto = "";
        if (cmd.tipo === "evento")
          texto =
            cmd.acao === "quandoTocar" ? "📱 QUANDO TOCAR" : "🌀 QUANDO AGITAR";
        else if (cmd.tipo === "mov") {
          if (cmd.acao === "andar") texto = "🚶 ANDAR 1";
          else if (cmd.acao === "girarDir") texto = "🔄 GIRAR DIREITA";
          else if (cmd.acao === "girarEsq") texto = "🔄 GIRAR ESQUERDA";
          else if (cmd.acao === "falhar") texto = '💬 FALAR "Oi!"';
        } else if (cmd.tipo === "loop") {
          let acaoTexto = "";
          if (cmd.acao === "andar") acaoTexto = "ANDAR";
          else if (cmd.acao === "girarDir") acaoTexto = "GIRAR DIR";
          else if (cmd.acao === "girarEsq") acaoTexto = "GIRAR ESQ";
          else if (cmd.acao === "falhar") acaoTexto = 'FALAR "Oi!"';
          texto = `🔁 REPETIR ${cmd.vezes} VEZES (${acaoTexto})`;
        } else if (cmd.tipo === "condicional") {
          let entaoAcao = cmd.entao?.acao || "?";
          let senaoAcao = cmd.senao?.acao || "?";
          if (entaoAcao === "falhar") entaoAcao = "FALAR";
          if (senaoAcao === "falhar") senaoAcao = "FALAR";
          texto = `🤔 SE parede → ${entaoAcao} SENÃO ${senaoAcao}`;
        }
        span.textContent = texto;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖";
        removeBtn.classList.add("btn", "btn-sm", "btn-danger", "ms-2");
        removeBtn.onclick = () => {
          programa.splice(idx, 1);
          renderizarScript();
        };
        span.appendChild(removeBtn);
        container.appendChild(span);
      });
    }

    function adicionarComando(cmdObj) {
      programa.push(cmdObj);
      renderizarScript();
    }

    function limparScript() {
      programa = [];
      renderizarScript();
      mostrarMsg("Script limpo! Monte um novo programa.", "info");
    }

    function resetRobo() {
      posRobo = { ...posInicial };
      desenharPalco();
      mostrarMsg("Robô reiniciado na posição inicial.", "info");
    }

    async function executarComandoBasico(cmd) {
      if (cmd.tipo === "mov") {
        if (cmd.acao === "andar") {
          let nx = posRobo.x,
            ny = posRobo.y;
          if (posRobo.direcao === 0) nx--;
          else if (posRobo.direcao === 1) ny++;
          else if (posRobo.direcao === 2) nx++;
          else ny--;
          if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize)
            throw new Error("Robô bateu na borda do palco!");
          if (obstaculos.some((obs) => obs.x === nx && obs.y === ny))
            throw new Error("Robô bateu em um obstáculo!");
          posRobo.x = nx;
          posRobo.y = ny;
        } else if (cmd.acao === "girarDir") {
          posRobo.direcao = (posRobo.direcao + 1) % 4;
        } else if (cmd.acao === "girarEsq") {
          posRobo.direcao = (posRobo.direcao + 3) % 4;
        } else if (cmd.acao === "falhar") {
          mostrarMsg("Robô diz: Oi! 🤖", "info");
          await delay(400);
        }
        desenharPalco();
        await delay(300);
      } else if (cmd.tipo === "evento") {
        mostrarMsg(
          `✨ Evento: ${cmd.acao === "quandoTocar" ? "Toque na tela" : "Agitação"} disparado!`,
          "info",
        );
        await delay(400);
      }
      return true;
    }

    function temParedeFrente() {
      let nx = posRobo.x,
        ny = posRobo.y;
      if (posRobo.direcao === 0) nx--;
      else if (posRobo.direcao === 1) ny++;
      else if (posRobo.direcao === 2) nx++;
      else ny--;
      if (nx < 0 || nx >= gridSize || ny < 0 || ny >= gridSize) return true;
      return obstaculos.some((obs) => obs.x === nx && obs.y === ny);
    }

    async function executarPrograma() {
      if (executando) {
        mostrarMsg("Já está executando... aguarde.", "info");
        return;
      }
      if (programa.length === 0) {
        mostrarMsg("⚠️ Nenhum bloco no programa! Adicione blocos.", "erro");
        return;
      }
      executando = true;
      resetRobo();
      let idx = 0;
      let sucesso = true;
      let erroMsg = "";

      while (idx < programa.length && sucesso) {
        const cmd = programa[idx];
        try {
          if (cmd.tipo === "mov" || cmd.tipo === "evento") {
            await executarComandoBasico(cmd);
            idx++;
          } else if (cmd.tipo === "loop") {
            // Loop com ação embutida: repete a mesma ação N vezes
            const acaoLoop = { tipo: "mov", acao: cmd.acao };
            for (let i = 0; i < cmd.vezes; i++) {
              await executarComandoBasico(acaoLoop);
              desenharPalco();
              await delay(200);
              if (posRobo.x === objetivo.x && posRobo.y === objetivo.y) break;
            }
            idx++;
          } else if (cmd.tipo === "condicional") {
            const condVal =
              cmd.condicao === "paredeFrente" ? temParedeFrente() : false;
            const comandoExec = condVal ? cmd.entao : cmd.senao;
            if (comandoExec) await executarComandoBasico(comandoExec);
            idx++;
          } else {
            throw new Error(`Comando desconhecido: ${cmd.tipo}`);
          }

          if (posRobo.x === objetivo.x && posRobo.y === objetivo.y) {
            mostrarMsg("🎉 PARABÉNS! O robô pegou a estrela!", "sucesso");
            document.dispatchEvent(new CustomEvent("robo:vitoria"));
            break;
          }
        } catch (err) {
          sucesso = false;
          erroMsg = err.message;
          break;
        }
      }

      if (sucesso && posRobo.x === objetivo.x && posRobo.y === objetivo.y) {
        // já mostrou
      } else if (sucesso) {
        mostrarMsg(
          "⚠️ O robô não chegou na estrela. Tente outros blocos!",
          "erro",
        );
        document.dispatchEvent(
          new CustomEvent("robo:bug", { detail: { incremento: 1 } }),
        );
      } else {
        mostrarMsg(`🐛 BUG! ${erroMsg}`, "erro");
        document.dispatchEvent(
          new CustomEvent("robo:bug", { detail: { incremento: 1 } }),
        );
      }
      executando = false;
    }

    function carregarExemplo() {
      limparScript();
      programa.push(
        { tipo: "mov", acao: "andar" },
        { tipo: "mov", acao: "andar" },
        {
          tipo: "condicional",
          condicao: "paredeFrente",
          entao: { tipo: "mov", acao: "girarDir" },
          senao: { tipo: "mov", acao: "andar" },
        },
        { tipo: "loop", vezes: 3, acao: "andar" },
        { tipo: "mov", acao: "falhar" },
      );
      renderizarScript();
      mostrarMsg(
        "Exemplo carregado! Execute para ver o robô se mover.",
        "info",
      );
    }

    function mostrarMsg(texto, tipo) {
      const msgDiv = document.getElementById("msgExecucao");
      if (!msgDiv) return;
      msgDiv.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
      msgDiv.className = `alert ${tipo === "erro" ? "alert-danger" : tipo === "sucesso" ? "alert-success" : "alert-warning"} mt-3 py-2 small`;
      setTimeout(() => {
        if (msgDiv) msgDiv.className = "alert alert-warning mt-3 py-2 small";
      }, 4000);
    }

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function init() {
      elementos.palco = document.getElementById("scratchPalco");
      elementos.listaScript = document.getElementById("listaScriptScratch");
      if (!elementos.palco) {
        console.error(
          "Elemento scratchPalco não encontrado. Verifique o HTML.",
        );
        return;
      }
      desenharPalco();

      // Eventos dos blocos normais
      document.querySelectorAll(".bloco-comando").forEach((bloco) => {
        bloco.addEventListener("click", (e) => {
          const cmdAttr = bloco.getAttribute("data-comando");
          if (cmdAttr) {
            try {
              const cmd = JSON.parse(cmdAttr);
              adicionarComando(cmd);
            } catch (e) {
              console.error("Erro ao parsear comando", e);
            }
          }
        });
      });

      // Botão para adicionar loop customizado
      const btnAddCustom = document.getElementById("btnAddLoopCustom");
      if (btnAddCustom) {
        btnAddCustom.addEventListener("click", () => {
          const vezes = parseInt(
            document.getElementById("loopVezesCustom")?.value || 2,
          );
          const acao = document.getElementById("loopAcaoCustom")?.value;
          if (acao) {
            adicionarComando({ tipo: "loop", vezes: vezes, acao: acao });
          }
        });
      }

      document
        .getElementById("btnLimparScript")
        ?.addEventListener("click", limparScript);
      document
        .getElementById("btnExecutarScript")
        ?.addEventListener("click", executarPrograma);
      document
        .getElementById("btnResetRobo")
        ?.addEventListener("click", resetRobo);
      document
        .getElementById("btnExemploScript")
        ?.addEventListener("click", carregarExemplo);

      console.log(
        "🎮 Estúdio ScratchJr inicializado (com loops e condicionais explícitos)",
      );
    }

    return { init };
  })();

  // ==================== INICIALIZAÇÃO GERAL ====================
  function initAll() {
    CabecalhoModule.init();
    RodapeModule.init();
    PlanosAulaModule.init();
    CertificadoModule.init();
    ScratchJrGame.init(); // <-- substitiu o antigo JogoModule

    window.CabecalhoModule = CabecalhoModule;
    window.RodapeModule = RodapeModule;
    window.PlanosAulaModule = PlanosAulaModule;
    window.CertificadoModule = CertificadoModule;
    window.ScratchJrGame = ScratchJrGame;

    console.log(
      "%c🚀 TODOS OS MÓDULOS INICIALIZADOS - 3º BIMESTRE (JOGO CORRIGIDO)",
      "color:#ffb347;font-size:16px;font-weight:bold",
    );
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", initAll);
  else initAll();
})();
