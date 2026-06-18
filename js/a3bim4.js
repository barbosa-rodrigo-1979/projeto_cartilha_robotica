// ==================================================
// a3bim4.js – CORRIGIDO – JOGO FUNCIONAL + DEMAIS MÓDULOS
// ==================================================

(function () {
  "use strict";

  // --------------------------------------------------------------
  // 1. CONTADOR DE BUGS (CABEÇALHO / RODAPÉ)
  // --------------------------------------------------------------
  let contadorBugs = 0;
  const relatorioBugsEl = document.querySelector(".relatorio-bugs");

  function atualizarContadorBugs() {
    if (relatorioBugsEl)
      relatorioBugsEl.innerText = `🐛 Bugs encontrados: ${contadorBugs}`;
    localStorage.setItem("cabecalho_contador_bugs", contadorBugs);
  }

  function incrementarBug() {
    contadorBugs++;
    atualizarContadorBugs();
  }

  try {
    const salvo = localStorage.getItem("cabecalho_contador_bugs");
    if (salvo !== null) contadorBugs = parseInt(salvo);
  } catch (e) {}
  atualizarContadorBugs();

  // --------------------------------------------------------------
  // 2. MENU – DESTAQUE DA PÁGINA ATUAL
  // --------------------------------------------------------------
  function highlightMenu() {
    const current = window.location.pathname.split("/").pop();
    document.querySelectorAll(".menu-robomestre .nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === current) link.classList.add("active");
      else link.classList.remove("active");
    });
  }
  highlightMenu();

  // --------------------------------------------------------------
  // 3. PLANOS DE AULA – CHECKBOXES, PROGRESSO, ACORDEÃO
  // --------------------------------------------------------------
  const STORAGE_KEY = "planoAula_Concluidas_3ano_bim4";
  let checkboxes = [];
  let barraProgresso = null;
  let progressoTexto = null;
  let expandirBtn = null;
  let recolherBtn = null;

  function atualizarProgresso() {
    const total = checkboxes.length;
    const marcados = Array.from(checkboxes).filter((cb) => cb.checked).length;
    const percent = total ? (marcados / total) * 100 : 0;
    if (barraProgresso) {
      barraProgresso.style.width = percent + "%";
      barraProgresso.textContent = Math.round(percent) + "%";
      barraProgresso.setAttribute("aria-valuenow", marcados);
    }
    if (progressoTexto) progressoTexto.textContent = `${marcados}/${total}`;
    const concluidas = {};
    checkboxes.forEach((cb) => {
      concluidas[cb.dataset.semana] = cb.checked;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concluidas));
  }

  function carregarProgresso() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        const concluidas = JSON.parse(salvo);
        checkboxes.forEach((cb) => {
          if (concluidas[cb.dataset.semana]) cb.checked = true;
        });
      } catch (e) {}
    }
    atualizarProgresso();
  }

  function initPlanosAula() {
    checkboxes = document.querySelectorAll(".semana-check");
    if (checkboxes.length === 0) return;

    barraProgresso = document.getElementById("barraProgresso");
    progressoTexto = document.getElementById("progressoTexto");
    expandirBtn = document.getElementById("expandirTodosBtn");
    recolherBtn = document.getElementById("recolherTodosBtn");

    if (!barraProgresso && document.querySelector(".progress-container")) {
      const container = document.querySelector(".progress-container");
      container.innerHTML = `<div class="progress"><div id="barraProgresso" class="progress-bar bg-warning" style="width:0%">0%</div></div><div id="progressoTexto" class="mt-1 small text-center">0/0</div>`;
      barraProgresso = document.getElementById("barraProgresso");
      progressoTexto = document.getElementById("progressoTexto");
    }

    carregarProgresso();
    checkboxes.forEach((cb) =>
      cb.addEventListener("change", atualizarProgresso),
    );

    if (expandirBtn && typeof bootstrap !== "undefined") {
      expandirBtn.addEventListener("click", () => {
        document
          .querySelectorAll("#accordionAulas .accordion-collapse")
          .forEach((coll) => {
            bootstrap.Collapse.getOrCreateInstance(coll).show();
          });
      });
    }
    if (recolherBtn && typeof bootstrap !== "undefined") {
      recolherBtn.addEventListener("click", () => {
        document
          .querySelectorAll("#accordionAulas .accordion-collapse")
          .forEach((coll) => {
            bootstrap.Collapse.getOrCreateInstance(coll).hide();
          });
      });
    }
  }

  // --------------------------------------------------------------
  // 4. CERTIFICADO – CADASTRO, PRÉ-VISUALIZAÇÃO, IMPRESSÃO
  // --------------------------------------------------------------
  let alunos = [];
  const CERT_STORAGE = "robozada_certificados_ano3_bim4";
  const listaAlunosEl = document.getElementById("listaAlunos");
  const contadorAlunosEl = document.getElementById("contadorAlunos");
  const inputNome = document.getElementById("nomeAluno");
  const btnAdicionar = document.getElementById("btnAdicionar");
  const btnImprimir = document.getElementById("btnImprimirCertificados");
  const btnPreview = document.getElementById("btnPreviewAluno");
  const previewNome = document.getElementById("previewNomeAluno");
  const previewData = document.getElementById("previewData");

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function (m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    });
  }

  function salvarAlunos() {
    localStorage.setItem(CERT_STORAGE, JSON.stringify(alunos));
    atualizarListaAlunos();
  }

  function atualizarListaAlunos() {
    if (!listaAlunosEl) return;
    if (alunos.length === 0) {
      listaAlunosEl.innerHTML =
        '<li class="text-muted text-center">Nenhum aluno cadastrado 🤖</li>';
      if (contadorAlunosEl) contadorAlunosEl.textContent = "0";
      if (btnImprimir) btnImprimir.disabled = true;
      if (btnPreview) btnPreview.disabled = true;
      return;
    }
    listaAlunosEl.innerHTML = "";
    alunos.forEach((aluno, idx) => {
      const li = document.createElement("li");
      li.className = "d-flex justify-content-between align-items-center";
      li.innerHTML = `
        <span><i class="bi bi-robot"></i> ${escapeHtml(aluno)}</span>
        <div class="btn-group gap-1">
          <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
          <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
        </div>
      `;
      listaAlunosEl.appendChild(li);
    });
    if (contadorAlunosEl) contadorAlunosEl.textContent = alunos.length;
    if (btnImprimir) btnImprimir.disabled = false;
    if (
      btnPreview &&
      previewNome &&
      previewNome.textContent !== "[NOME DO ALUNO]"
    )
      btnPreview.disabled = false;
    else if (btnPreview) btnPreview.disabled = true;

    document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
      btn.removeEventListener("click", handleSelect);
      btn.addEventListener("click", handleSelect);
    });
    document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
      btn.removeEventListener("click", handleRemove);
      btn.addEventListener("click", handleRemove);
    });
  }

  function handleSelect(e) {
    const nome = e.currentTarget.getAttribute("data-nome");
    if (previewNome) previewNome.textContent = nome;
    if (btnPreview) btnPreview.disabled = false;
  }

  function handleRemove(e) {
    const idx = parseInt(e.currentTarget.getAttribute("data-index"));
    if (confirm(`Remover ${alunos[idx]} da lista?`)) {
      const nomeRemovido = alunos[idx];
      alunos.splice(idx, 1);
      salvarAlunos();
      if (previewNome && previewNome.textContent === nomeRemovido) {
        previewNome.textContent = "[NOME DO ALUNO]";
        if (btnPreview) btnPreview.disabled = true;
      }
    }
  }

  function gerarCertificadoUnico(nome) {
    const data = new Date().toLocaleDateString("pt-BR");
    const html = `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Certificado - ${escapeHtml(nome)}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Courier New',monospace;background:#e0e0e0;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:20px;}
        .certificado{border:3px solid #ffb347;border-radius:48px 24px;padding:30px;text-align:center;background:#fffef7;max-width:800px;margin:auto;}
        .certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;}
        .nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}
        hr{margin:20px 0;border:1px solid #ffb347;}
        .btn-print{background:#ffb347;border:none;border-radius:40px;padding:10px 24px;cursor:pointer;margin-bottom:20px;}
        @media print{.btn-print{display:none;}}
      </style>
      </head>
      <body>
        <div>
          <div class="certificado">
            <h3>🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>
            <p>Certificamos que</p>
            <strong class="nome">${escapeHtml(nome)}</strong>
            <p>concluiu o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
            <hr><p>RobôMestres do Paraná • ${data}</p>
            <p style="font-style:italic;">"Loop não é macarrão! Variável não é coisa de velho!"</p>
            <div>🤖 Ass: Robô Zé 3.0</div>
          </div>
          <button class="btn-print" onclick="window.print()">🖨️ IMPRIMIR</button>
        </div>
      </body>
      </html>`;
    const win = window.open("", "_blank", "width=800,height=600");
    if (win) {
      win.document.write(html);
      win.document.close();
    } else alert("Permita pop-ups para gerar o certificado.");
  }

  function imprimirTodosCertificados() {
    if (!alunos.length) {
      alert("Nenhum aluno cadastrado!");
      return;
    }
    const data = new Date().toLocaleDateString("pt-BR");
    let cards = "";
    alunos.forEach((aluno) => {
      cards += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;">
        <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO LOOP - NÍVEL 3</h3>
        <p>Certificamos que</p>
        <strong style="display:block; margin:10px 0; background:#fff0cc; padding:6px; border-radius:40px;">${escapeHtml(aluno)}</strong>
        <p>concluiu o <strong>3º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 LOOP | 📦 VARIÁVEL | 🐛 DEPURAÇÃO | 🤖 PROJETO AUTORAL</p>
        <hr><p>RobôMestres do Paraná • ${data}</p>
        <p style="font-size:0.6rem;">"Loop não é macarrão!"</p><div>🤖 Ass: Robô Zé 3.0</div>
      </div>`;
    });
    const html = `<!DOCTYPE html>
      <html>
      <head><meta charset="UTF-8"><title>Certificados em Lote</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:white;padding:20px;}
        .print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
        @media print{@page{size:A4;margin:0.8cm;} .print-grid{gap:15px;}}
      </style>
      </head>
      <body><div class="print-grid">${cards}</div>
      <script>window.onload=function(){window.print();setTimeout(function(){window.close();},500);};<\/script>
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    } else alert("Permita pop-ups para gerar os certificados.");
  }

  function initCertificado() {
    if (!inputNome) return;
    const salvos = localStorage.getItem(CERT_STORAGE);
    if (salvos) {
      try {
        alunos = JSON.parse(salvos);
      } catch (e) {
        alunos = [];
      }
    }
    if (!alunos.length)
      alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA"];
    salvarAlunos();
    if (previewData)
      previewData.textContent = new Date().toLocaleDateString("pt-BR");
    if (btnAdicionar) {
      btnAdicionar.addEventListener("click", () => {
        let nome = inputNome.value.trim().toUpperCase();
        if (!nome) return alert("Digite o nome!");
        if (alunos.includes(nome)) return alert("Aluno já existe!");
        alunos.push(nome);
        salvarAlunos();
        inputNome.value = "";
      });
    }
    if (btnImprimir)
      btnImprimir.addEventListener("click", imprimirTodosCertificados);
    if (btnPreview) {
      btnPreview.addEventListener("click", () => {
        if (previewNome && previewNome.textContent !== "[NOME DO ALUNO]") {
          gerarCertificadoUnico(previewNome.textContent);
        } else alert("Selecione um aluno na lista primeiro.");
      });
    }
    if (inputNome) {
      inputNome.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && btnAdicionar) btnAdicionar.click();
      });
    }
  }

  // ==================================================
  // JOGO: ROBÔ LOMBRIGUEIRO V5 - CORRIGIDO COMPLETAMENTE
  // Usa array de posições para controle de peças
  // ==================================================

  (function () {
    "use strict";

    // --- Estado do jogo ---
    let comandos = [];
    let pecasColetadas = 0;
    let posicaoRobo = 0;
    let execucaoEmAndamento = false;
    let pontuacaoAtual = 0;
    let totalLoops = 0;
    let logMessages = [];

    // --- Array que controla quais posições têm peças ---
    // posicoes[1] = true significa que a posição 1 tem peça
    // posicoes[1] = false significa que a peça da posição 1 já foi coletada
    let posicoes = {
      1: true, // peça na posição 1
      2: true, // peça na posição 2
      3: true, // peça na posição 3
      4: true, // peça na posição 4
      5: true, // peça na posição 5
    };
    const TOTAL_PECAS = 5;

    // --- Configuração do LOOP ---
    let loopConfig = { vezes: 3, cmd1: null, cmd2: null };
    let loopSelecionados = [];

    // --- Elementos DOM ---
    const roboAnimationDiv = document.getElementById("roboAnimation");
    const variavelDisplay = document.getElementById("variavelDisplay");
    const esteiraDiv = document.getElementById("esteiraVisual");
    const mensagemDiv = document.getElementById("mensagemJogo");
    const listaComandosDiv = document.getElementById("listaComandos");
    const algoritmoVazioMsg = document.getElementById("algoritmoVazioMsg");
    const btnExecutar = document.getElementById("btnExecutarRobo");
    const btnReiniciar = document.getElementById("btnReiniciarJogo");
    const btnDica = document.getElementById("btnDicaJogo");
    const btnLimpar = document.getElementById("btnLimparAlgoritmo");
    const pontuacaoFinalSpan = document.getElementById("pontuacaoFinal");
    const pecasColetadasSpan = document.getElementById("pecasColetadas");
    const loopCounterSpan = document.getElementById("loopCounter");
    const cmdCounterSpan = document.getElementById("cmdCounter");
    const pontuacaoStatusSpan = document.getElementById("pontuacaoStatus");
    const logDiv = document.getElementById("logExecucao");

    // --- Elementos do Modal ---
    const loopModal = document.getElementById("loopModal");
    const loopCmdPreview = document.getElementById("loopCmdPreview");
    const btnInserirLoop = document.getElementById("btnInserirLoop");
    const btnLoop = document.getElementById("btnLoop");
    const modalCloseBtns = document.querySelectorAll(
      '[data-bs-dismiss="modal"]',
    );
    let modalAberto = false;

    // --- Utilitários ---
    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function addLog(msg, isError = false) {
      const prefix = isError ? "🐛" : "🤖";
      logMessages.push(`${prefix} ${msg}`);
      if (logMessages.length > 30) logMessages.shift();
      if (logDiv) {
        logDiv.innerHTML = logMessages.join("<br>");
        logDiv.scrollTop = logDiv.scrollHeight;
      }
    }

    // --- MODAL (JavaScript puro) ---
    function abrirModal() {
      if (execucaoEmAndamento) {
        mostrarMensagem("⏳ Aguarde a execução terminar!", "warning");
        return;
      }
      loopSelecionados = [];
      loopConfig = { vezes: 3, cmd1: null, cmd2: null };
      if (loopCmdPreview) loopCmdPreview.textContent = "(nenhum)";

      document.querySelectorAll(".loop-cmd-btn").forEach((btn) => {
        btn.classList.remove("btn-warning");
        btn.classList.add("btn-secondary");
      });

      document.querySelectorAll(".loop-vezes").forEach((btn) => {
        btn.classList.remove("btn-warning", "btn-active");
        btn.classList.add("btn-outline-warning");
      });
      const btn3x = document.querySelector('.loop-vezes[data-vezes="3"]');
      if (btn3x) {
        btn3x.classList.remove("btn-outline-warning");
        btn3x.classList.add("btn-warning", "btn-active");
      }
      loopConfig.vezes = 3;

      if (loopModal) {
        loopModal.style.display = "flex";
        loopModal.style.alignItems = "center";
        loopModal.style.justifyContent = "center";
        document.body.style.overflow = "hidden";
        modalAberto = true;
      }
    }

    function fecharModal() {
      if (loopModal) {
        loopModal.style.display = "none";
        document.body.style.overflow = "";
        modalAberto = false;
      }
    }

    // --- Eventos do Modal ---
    document.querySelectorAll(".loop-vezes").forEach((btn) => {
      btn.addEventListener("click", function () {
        document.querySelectorAll(".loop-vezes").forEach((b) => {
          b.classList.remove("btn-warning", "btn-active");
          b.classList.add("btn-outline-warning");
        });
        this.classList.remove("btn-outline-warning");
        this.classList.add("btn-warning", "btn-active");
        loopConfig.vezes = parseInt(this.dataset.vezes);
      });
    });

    document.querySelectorAll(".loop-cmd-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const cmd = this.dataset.cmd;
        if (loopSelecionados.length < 2) {
          if (!loopSelecionados.includes(cmd)) {
            loopSelecionados.push(cmd);
            this.classList.remove("btn-secondary");
            this.classList.add("btn-warning");

            if (loopSelecionados.length === 1) loopConfig.cmd1 = cmd;
            else if (loopSelecionados.length === 2) loopConfig.cmd2 = cmd;

            if (loopCmdPreview) {
              const nomes = {
                andar: "🚶ANDAR",
                catar: "🔧CATAR",
                pular: "⬆️PULAR",
              };
              loopCmdPreview.textContent = loopSelecionados
                .map((c) => nomes[c] || c)
                .join(" → ");
            }
          }
        } else {
          mostrarMensagem("⚠️ LOOP só pode ter 2 comandos!", "warning");
        }
      });
    });

    btnInserirLoop?.addEventListener("click", function () {
      if (!loopConfig.cmd1 || !loopConfig.cmd2) {
        mostrarMensagem("⚠️ Selecione 2 comandos para o LOOP!", "warning");
        return;
      }
      const loopObj = {
        type: "loop",
        vezes: loopConfig.vezes,
        cmd1: loopConfig.cmd1,
        cmd2: loopConfig.cmd2,
      };
      comandos.push(loopObj);
      totalLoops++;
      atualizarInterfaceComandos();
      atualizarDisplay();
      calcularPontuacao();
      addLog(
        `🔄 LOOP ${loopConfig.vezes}x [${loopConfig.cmd1} ${loopConfig.cmd2}]`,
      );
      mostrarMensagem(`✅ LOOP ${loopConfig.vezes}x adicionado!`, "success");
      fecharModal();
    });

    modalCloseBtns.forEach((btn) => btn.addEventListener("click", fecharModal));
    loopModal?.addEventListener("click", function (e) {
      if (e.target === this) fecharModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modalAberto) fecharModal();
    });
    btnLoop?.addEventListener("click", abrirModal);

    // --- DESENHO DA ESTEIRA (CORRETO) ---
    function desenharEsteira() {
      if (!esteiraDiv) return;
      esteiraDiv.innerHTML = "";

      for (let i = 0; i < 6; i++) {
        const div = document.createElement("div");
        div.className = "caixa-esteira";

        let conteudo = "";
        let bg = "#1a2a17";
        let borda = "2px solid #4a7c3f";
        let sombra = "none";

        // Posição 0: início
        if (i === 0) {
          if (posicaoRobo === 0) {
            conteudo = "🤖";
            bg = "#4a90e2";
            borda = "3px solid #ffb347";
            sombra = "0 0 25px rgba(74, 144, 226, 0.5)";
          } else {
            conteudo = "⬜";
            bg = "#1a2a17";
          }
        }
        // Posições 1-5
        else {
          const temPeca = posicoes[i] === true;
          const roboAqui = posicaoRobo === i;

          if (roboAqui) {
            // Robô está nesta posição
            conteudo = "🤖";
            bg = "#4a90e2";
            borda = "3px solid #ffb347";
            sombra = "0 0 25px rgba(74, 144, 226, 0.5)";
          } else if (temPeca) {
            // Tem peça disponível
            conteudo = "🔩";
            bg = "#ffb347";
            borda = "2px solid #e67e22";
          } else {
            // Peça já foi coletada
            conteudo = "✅";
            bg = "#2c3e2b";
          }
        }

        div.style.cssText = `
        width: 60px; height: 60px; 
        background: ${bg};
        border-radius: 14px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        margin: 0 5px; 
        font-size: 2rem;
        transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
        border: ${borda};
        box-shadow: ${sombra};
        position: relative;
      `;
        div.textContent = conteudo;

        // Label da posição
        const label = document.createElement("span");
        label.style.cssText = `
        position: absolute;
        bottom: -20px;
        font-size: 0.5rem;
        color: #9bbc7b;
        font-family: monospace;
        background: rgba(0,0,0,0.5);
        padding: 0 6px;
        border-radius: 8px;
      `;
        label.textContent = i;
        div.appendChild(label);

        esteiraDiv.appendChild(div);
      }
    }

    // --- Atualização de display ---
    function atualizarDisplay() {
      // Conta quantas peças foram coletadas
      let coletadas = 0;
      for (let i = 1; i <= TOTAL_PECAS; i++) {
        if (posicoes[i] === false) coletadas++;
      }
      pecasColetadas = coletadas;

      if (variavelDisplay)
        variavelDisplay.innerHTML = `🔩 Peças: ${pecasColetadas}`;
      if (pecasColetadasSpan)
        pecasColetadasSpan.textContent = `${pecasColetadas}/${TOTAL_PECAS}`;
      if (loopCounterSpan) loopCounterSpan.textContent = totalLoops;
      if (cmdCounterSpan) cmdCounterSpan.textContent = comandos.length;
      if (pontuacaoStatusSpan) pontuacaoStatusSpan.textContent = pontuacaoAtual;
      desenharEsteira();
    }

    // --- Cálculo de pontuação ---
    function calcularPontuacao() {
      // Conta quantas peças foram coletadas
      let coletadas = 0;
      for (let i = 1; i <= TOTAL_PECAS; i++) {
        if (posicoes[i] === false) coletadas++;
      }
      pecasColetadas = coletadas;

      const bonusLoop = totalLoops > 0 ? 15 : 0;
      const eficiencia = Math.max(
        0,
        100 - comandos.length * 2 + pecasColetadas * 10 + bonusLoop,
      );
      pontuacaoAtual = Math.min(200, eficiencia);
      if (pontuacaoFinalSpan) pontuacaoFinalSpan.textContent = pontuacaoAtual;
      if (pontuacaoStatusSpan) pontuacaoStatusSpan.textContent = pontuacaoAtual;
    }

    // --- Inicialização do cenário ---
    function inicializarCenario() {
      // Reseta todas as posições
      posicoes = {
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
      };
      pecasColetadas = 0;
      posicaoRobo = 0;
      totalLoops = 0;
      logMessages = [];
      if (logDiv)
        logDiv.innerHTML =
          "🕹️ Robô na posição 0. Use ANDAR para chegar nas peças (posições 1-5)!";
      atualizarDisplay();
      calcularPontuacao();
      if (roboAnimationDiv) roboAnimationDiv.textContent = "🤖";
      if (mensagemDiv) {
        mensagemDiv.className = "alert alert-info py-2";
        mensagemDiv.style.background = "#1e2a1a";
        mensagemDiv.style.borderColor = "#ffb347";
        mensagemDiv.style.color = "#ebf0eb";
        mensagemDiv.innerHTML =
          "🚶 ANDAR para ir até as peças (posições 1-5) → depois CATAR para coletar!";
      }
    }

    function mostrarMensagem(msg, tipo = "info") {
      if (!mensagemDiv) return;
      const cores = {
        info: { bg: "#1e2a1a", border: "#ffb347", color: "#ebf0eb" },
        success: { bg: "#1a3a1a", border: "#2ecc71", color: "#d5f5e3" },
        danger: { bg: "#3a1a1a", border: "#e74c3c", color: "#fadbd8" },
        warning: { bg: "#3a2a1a", border: "#f1c40f", color: "#fef9e7" },
      };
      const estilo = cores[tipo] || cores.info;
      mensagemDiv.style.background = estilo.bg;
      mensagemDiv.style.borderColor = estilo.border;
      mensagemDiv.style.color = estilo.color;
      mensagemDiv.innerHTML = msg;
    }

    // --- Gerenciamento de comandos ---
    function adicionarComando(comando) {
      if (execucaoEmAndamento) {
        mostrarMensagem("⏳ Aguarde a execução terminar!", "warning");
        return;
      }
      comandos.push(comando);
      atualizarInterfaceComandos();
      atualizarDisplay();
      calcularPontuacao();
      addLog(`➕ Adicionado: ${comando.toUpperCase()}`);
    }

    function removerComando(idx) {
      if (execucaoEmAndamento) {
        mostrarMensagem("⏳ Aguarde a execução terminar!", "warning");
        return;
      }
      const removido = comandos[idx];
      comandos.splice(idx, 1);
      if (typeof removido === "object" && removido.type === "loop")
        totalLoops--;
      atualizarInterfaceComandos();
      atualizarDisplay();
      calcularPontuacao();
      addLog(`✖️ Removido: ${removido.toUpperCase()}`);
    }

    function limparAlgoritmo() {
      if (execucaoEmAndamento) {
        mostrarMensagem("⏳ Aguarde a execução terminar!", "warning");
        return;
      }
      comandos = [];
      totalLoops = 0;
      atualizarInterfaceComandos();
      atualizarDisplay();
      calcularPontuacao();
      addLog("🗑️ Algoritmo limpo!");
      mostrarMensagem("🧹 Algoritmo limpo! Monte um novo.", "info");
    }

    function atualizarInterfaceComandos() {
      if (!listaComandosDiv) return;
      if (comandos.length === 0) {
        algoritmoVazioMsg.style.display = "block";
        listaComandosDiv.innerHTML = "";
        return;
      }
      algoritmoVazioMsg.style.display = "none";
      listaComandosDiv.innerHTML = comandos
        .map((cmd, idx) => {
          let icone = "",
            label = "",
            cor = "#ffb347";
          if (typeof cmd === "object" && cmd.type === "loop") {
            const nomes = {
              andar: "🚶ANDAR",
              catar: "🔧CATAR",
              pular: "⬆️PULAR",
            };
            icone = "🔄";
            label = `LOOP ${cmd.vezes}x [${nomes[cmd.cmd1] || cmd.cmd1} ${nomes[cmd.cmd2] || cmd.cmd2}]`;
            cor = "#ffcc44";
          } else {
            icone = cmd === "andar" ? "🚶" : cmd === "catar" ? "🔧" : "⬆️";
            label = cmd.toUpperCase();
          }
          return `
        <span class="comando-item" style="background:#2c3e2b; border-left:4px solid ${cor}; border-radius:16px; padding:6px 14px; display:inline-flex; align-items:center; gap:8px; margin:4px; font-size:0.85rem;">
          ${icone} ${label}
          <span class="remover-comando" data-idx="${idx}" style="cursor:pointer; color:#e74c3c; font-weight:bold; font-size:1.1rem;">✖️</span>
        </span>
      `;
        })
        .join("");
      document.querySelectorAll(".remover-comando").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
          removerComando(idx);
        });
      });
      atualizarDisplay();
    }

    // --- EXECUÇÃO DO ROBÔ (CORRIGIDA) ---
    async function executarRobo() {
      if (execucaoEmAndamento) {
        mostrarMensagem("⏳ Já estou executando! Aguarde.", "warning");
        return;
      }
      if (comandos.length === 0) {
        mostrarMensagem(
          "❌ Nenhum comando! Monte o algoritmo primeiro.",
          "danger",
        );
        return;
      }

      inicializarCenario();
      execucaoEmAndamento = true;
      btnExecutar.disabled = true;
      btnReiniciar.disabled = true;
      btnLimpar.disabled = true;
      btnLoop.disabled = true;

      addLog("🚀 Iniciando execução...");
      mostrarMensagem("⚙️ Executando programa...", "info");

      let sucesso = true;
      let i = 0;

      while (i < comandos.length && sucesso) {
        const cmd = comandos[i];

        if (typeof cmd === "object" && cmd.type === "loop") {
          addLog(`🔄 LOOP ${cmd.vezes}x [${cmd.cmd1} ${cmd.cmd2}]`);
          for (let r = 0; r < cmd.vezes; r++) {
            if (!sucesso) break;

            // Verifica se todas as peças foram coletadas
            let todasColetadas = true;
            for (let p = 1; p <= TOTAL_PECAS; p++) {
              if (posicoes[p] === true) {
                todasColetadas = false;
                break;
              }
            }
            if (todasColetadas) break;

            addLog(`  🔄 Iteração ${r + 1}/${cmd.vezes}`);

            const r1 = await executarComando(cmd.cmd1);
            if (!r1) {
              sucesso = false;
              break;
            }

            const r2 = await executarComando(cmd.cmd2);
            if (!r2) {
              sucesso = false;
              break;
            }

            await delay(150);
          }
          i++;
        } else {
          const result = await executarComando(cmd);
          if (!result) {
            sucesso = false;
            break;
          }
          i++;
        }

        // Verifica se todas as peças foram coletadas
        let todasColetadas = true;
        for (let p = 1; p <= TOTAL_PECAS; p++) {
          if (posicoes[p] === true) {
            todasColetadas = false;
            break;
          }
        }
        if (todasColetadas) break;
      }

      execucaoEmAndamento = false;
      btnExecutar.disabled = false;
      btnReiniciar.disabled = false;
      btnLimpar.disabled = false;
      btnLoop.disabled = false;

      // Verifica se todas foram coletadas
      let todasColetadas = true;
      for (let p = 1; p <= TOTAL_PECAS; p++) {
        if (posicoes[p] === true) {
          todasColetadas = false;
          break;
        }
      }

      if (sucesso && todasColetadas) {
        calcularPontuacao();
        roboAnimationDiv.textContent = "🤖🎉✨";
        addLog(
          `✅ VITÓRIA! ${pecasColetadas} peças! Pontos: ${pontuacaoAtual}`,
        );
        mostrarMensagem(
          `🎉 VITÓRIA! Coletou TODAS as ${pecasColetadas} peças! 🏆 ${pontuacaoAtual} pontos`,
          "success",
        );
      } else if (sucesso && !todasColetadas) {
        calcularPontuacao();
        roboAnimationDiv.textContent = "🤔";
        // Conta quantas peças ainda faltam
        let faltam = 0;
        for (let p = 1; p <= TOTAL_PECAS; p++) {
          if (posicoes[p] === true) faltam++;
        }
        addLog(
          `⏹️ Parou com ${faltam} peças restantes na posição ${posicaoRobo}`,
        );
        mostrarMensagem(
          `⚠️ Faltam ${faltam} peças! O robô está na posição ${posicaoRobo}.`,
          "warning",
        );
      } else {
        roboAnimationDiv.textContent = "🤖💥";
        addLog("💥 Execução interrompida por erro!");
        calcularPontuacao();
      }
    }

    // --- EXECUTAR COMANDO SIMPLES (CORRIGIDO) ---
    async function executarComando(cmd) {
      if (cmd === "andar") {
        // ANDAR: move para a direita (+1)
        if (posicaoRobo < 5) {
          posicaoRobo++;
          addLog(`  🚶 ANDAR → posição ${posicaoRobo}`);
          atualizarDisplay();
          await delay(350);
          return true;
        } else {
          addLog("  🐛 ERRO: ANDAR - robô já está no fim da esteira!", true);
          mostrarMensagem(
            "🐛 ERRO: O robô já está na última posição (5)!",
            "danger",
          );
          return false;
        }
      } else if (cmd === "catar") {
        // CATAR: coleta a peça na posição ATUAL do robô
        if (posicaoRobo === 0) {
          addLog("  🐛 ERRO: CATAR - robô está na posição 0 (sem peça)!", true);
          mostrarMensagem(
            "🐛 ERRO: Não há peça na posição 0! Use ANDAR primeiro.",
            "danger",
          );
          return false;
        }

        // Verifica se a posição atual tem peça
        if (posicoes[posicaoRobo] === true) {
          // Coleta a peça
          posicoes[posicaoRobo] = false;
          pecasColetadas++;
          addLog(
            `  🔧 CATAR → coletou peça na posição ${posicaoRobo} (total: ${pecasColetadas})`,
          );
          atualizarDisplay();
          await delay(350);
          return true;
        } else {
          addLog(
            `  🐛 ERRO: CATAR - posição ${posicaoRobo} já foi coletada!`,
            true,
          );
          mostrarMensagem(
            `🐛 ERRO: A peça na posição ${posicaoRobo} já foi coletada!`,
            "danger",
          );
          return false;
        }
      } else if (cmd === "pular") {
        // PULAR: move 2 posições para a direita
        if (posicaoRobo < 4) {
          posicaoRobo += 2;
          if (posicaoRobo > 5) posicaoRobo = 5;
          addLog(`  ⬆️ PULAR → posição ${posicaoRobo}`);
          atualizarDisplay();
          await delay(350);
          return true;
        } else {
          addLog("  🐛 ERRO: PULAR - não há espaço para pular!", true);
          mostrarMensagem(
            "🐛 ERRO: Não dá para pular da posição atual!",
            "danger",
          );
          return false;
        }
      }
      return false;
    }

    // --- Controle do jogo ---
    function reiniciarCompleto() {
      if (execucaoEmAndamento) {
        mostrarMensagem("⏳ Aguarde a execução atual terminar.", "warning");
        return;
      }
      comandos = [];
      totalLoops = 0;
      loopConfig = { vezes: 3, cmd1: null, cmd2: null };
      loopSelecionados = [];
      atualizarInterfaceComandos();
      inicializarCenario();
      calcularPontuacao();
      addLog("🔄 Jogo reiniciado!");
      mostrarMensagem("🔄 Jogo reiniciado! O robô está na posição 0.", "info");
    }

    function mostrarDica() {
      const dicas = [
        "💡 ANDAR move o robô 1 posição para a DIREITA.",
        "💡 CATAR coleta a peça onde o robô ESTÁ (posição 1-5).",
        "💡 Use ANDAR + CATAR para andar e coletar uma peça.",
        "💡 LOOP 5x [ANDAR CATAR] → anda e coleta todas as 5 peças!",
        "💡 PULAR avança 2 posições de uma vez.",
        "💡 O robô começa na posição 0 (sem peça).",
        "💡 Peças estão nas posições 1, 2, 3, 4, 5.",
        "💡 Depois de coletar, a peça vira ✅.",
        "💡 Tente: LOOP 3x [ANDAR CATAR] + ANDAR + CATAR para coletar 4 peças!",
      ];
      const dica = dicas[Math.floor(Math.random() * dicas.length)];
      mostrarMensagem(dica, "warning");
      addLog(`💡 Dica: ${dica}`);
    }

    // --- Inicialização ---
    function initJogo() {
      if (!btnExecutar) return;

      document
        .querySelectorAll(".cartao-comando-jogo:not(.loop-card)")
        .forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const comando = e.currentTarget.dataset.comando;
            if (comando) adicionarComando(comando);
          });
        });

      btnExecutar.addEventListener("click", executarRobo);
      btnReiniciar.addEventListener("click", reiniciarCompleto);
      btnDica.addEventListener("click", mostrarDica);
      btnLimpar.addEventListener("click", limparAlgoritmo);

      inicializarCenario();
      calcularPontuacao();
      addLog("🤖 Robô Lembrete V5 - Controle por posições!");
      addLog("📌 Posição 0 = início | Posições 1-5 = peças individuais");

      console.log("🎮 Robô Lembrete V5 inicializado!");
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initJogo);
    } else {
      initJogo();
    }
  })();

  // --------------------------------------------------------------
  // 6. INICIALIZAÇÃO GERAL
  // --------------------------------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    initPlanosAula();
    initCertificado();
    initJogo();
    console.log("🤖 a3bim4.js carregado – Caos organizado ativado!");
  });

  window.incrementarBug = incrementarBug;
})();
