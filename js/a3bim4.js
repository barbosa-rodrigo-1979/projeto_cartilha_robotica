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
    if (relatorioBugsEl) relatorioBugsEl.innerText = `🐛 Bugs encontrados: ${contadorBugs}`;
    localStorage.setItem("cabecalho_contador_bugs", contadorBugs);
  }

  function incrementarBug() {
    contadorBugs++;
    atualizarContadorBugs();
  }

  try {
    const salvo = localStorage.getItem("cabecalho_contador_bugs");
    if (salvo !== null) contadorBugs = parseInt(salvo);
  } catch (e) { }
  atualizarContadorBugs();

  // --------------------------------------------------------------
  // 2. MENU – DESTAQUE DA PÁGINA ATUAL
  // --------------------------------------------------------------
  function highlightMenu() {
    const current = window.location.pathname.split("/").pop();
    document.querySelectorAll(".menu-robomestre .nav-link").forEach(link => {
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
    const marcados = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percent = total ? (marcados / total) * 100 : 0;
    if (barraProgresso) {
      barraProgresso.style.width = percent + "%";
      barraProgresso.textContent = Math.round(percent) + "%";
      barraProgresso.setAttribute("aria-valuenow", marcados);
    }
    if (progressoTexto) progressoTexto.textContent = `${marcados}/${total}`;
    const concluidas = {};
    checkboxes.forEach(cb => { concluidas[cb.dataset.semana] = cb.checked; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(concluidas));
  }

  function carregarProgresso() {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      try {
        const concluidas = JSON.parse(salvo);
        checkboxes.forEach(cb => {
          if (concluidas[cb.dataset.semana]) cb.checked = true;
        });
      } catch (e) { }
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
    checkboxes.forEach(cb => cb.addEventListener("change", atualizarProgresso));

    if (expandirBtn && typeof bootstrap !== "undefined") {
      expandirBtn.addEventListener("click", () => {
        document.querySelectorAll("#accordionAulas .accordion-collapse").forEach(coll => {
          bootstrap.Collapse.getOrCreateInstance(coll).show();
        });
      });
    }
    if (recolherBtn && typeof bootstrap !== "undefined") {
      recolherBtn.addEventListener("click", () => {
        document.querySelectorAll("#accordionAulas .accordion-collapse").forEach(coll => {
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
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
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
      listaAlunosEl.innerHTML = '<li class="text-muted text-center">Nenhum aluno cadastrado 🤖</li>';
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
    if (btnPreview && previewNome && previewNome.textContent !== "[NOME DO ALUNO]") btnPreview.disabled = false;
    else if (btnPreview) btnPreview.disabled = true;

    document.querySelectorAll(".btn-selecionar-aluno").forEach(btn => {
      btn.removeEventListener("click", handleSelect);
      btn.addEventListener("click", handleSelect);
    });
    document.querySelectorAll(".btn-remover-aluno").forEach(btn => {
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
    if (win) { win.document.write(html); win.document.close(); }
    else alert("Permita pop-ups para gerar o certificado.");
  }

  function imprimirTodosCertificados() {
    if (!alunos.length) { alert("Nenhum aluno cadastrado!"); return; }
    const data = new Date().toLocaleDateString("pt-BR");
    let cards = "";
    alunos.forEach(aluno => {
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
    if (win) { win.document.write(html); win.document.close(); }
    else alert("Permita pop-ups para gerar os certificados.");
  }

  function initCertificado() {
    if (!inputNome) return;
    const salvos = localStorage.getItem(CERT_STORAGE);
    if (salvos) { try { alunos = JSON.parse(salvos); } catch (e) { alunos = []; } }
    if (!alunos.length) alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA"];
    salvarAlunos();
    if (previewData) previewData.textContent = new Date().toLocaleDateString("pt-BR");
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
    if (btnImprimir) btnImprimir.addEventListener("click", imprimirTodosCertificados);
    if (btnPreview) {
      btnPreview.addEventListener("click", () => {
        if (previewNome && previewNome.textContent !== "[NOME DO ALUNO]") {
          gerarCertificadoUnico(previewNome.textContent);
        } else alert("Selecione um aluno na lista primeiro.");
      });
    }
    if (inputNome) {
      inputNome.addEventListener("keypress", (e) => { if (e.key === "Enter" && btnAdicionar) btnAdicionar.click(); });
    }
  }

  // --------------------------------------------------------------
  // 5. JOGO DO BIMESTRE – VERSÃO CORRIGIDA E FUNCIONAL
  // --------------------------------------------------------------
  let comandos = [];
  let caixasRestantes = 0;
  let caixasPegas = 0;
  let posicaoRobo = 0;
  let execucaoEmAndamento = false;
  let pontuacaoAtual = 0;

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

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function desenharEsteira() {
    if (!esteiraDiv) return;
    esteiraDiv.innerHTML = "";
    for (let i = 0; i < 5; i++) {
      const caixaDiv = document.createElement("div");
      caixaDiv.className = "caixa-esteira";
      caixaDiv.style.cssText = "width:50px; height:50px; background:#ffb347; border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 4px; font-size:1.5rem;";
      if (i < caixasRestantes) caixaDiv.innerHTML = "📦";
      else caixaDiv.innerHTML = "✅";
      esteiraDiv.appendChild(caixaDiv);
    }
    const todasCaixas = esteiraDiv.children;
    for (let i = 0; i < todasCaixas.length; i++) {
      if (i === posicaoRobo) todasCaixas[i].style.border = "3px solid #2ecc71";
      else todasCaixas[i].style.border = "none";
    }
  }

  function atualizarDisplayCaixas() {
    if (variavelDisplay) variavelDisplay.innerHTML = `📦 Caixas: ${caixasPegas}`;
    desenharEsteira();
  }

  function inicializarCenario() {
    caixasRestantes = 5;
    caixasPegas = 0;
    posicaoRobo = 0;
    atualizarDisplayCaixas();
    if (roboAnimationDiv) roboAnimationDiv.innerHTML = "🤖";
    if (mensagemDiv) {
      mensagemDiv.className = "alert alert-info py-2";
      mensagemDiv.innerHTML = "Cenário reiniciado! Monte o algoritmo e clique em EXECUTAR.";
    }
    pontuacaoAtual = 0;
    if (pontuacaoFinalSpan) pontuacaoFinalSpan.innerText = "0";
  }

  function mostrarMensagem(msg, tipo = "info") {
    if (!mensagemDiv) return;
    mensagemDiv.innerHTML = msg;
    mensagemDiv.className = `alert alert-${tipo === "erro" ? "danger" : tipo === "warning" ? "warning" : "info"} py-2`;
    setTimeout(() => {
      if (mensagemDiv && !mensagemDiv.className.includes("danger")) {
        mensagemDiv.className = "alert alert-info py-2";
        mensagemDiv.innerHTML = "Clique nos comandos para montar o algoritmo.";
      }
    }, 3000);
  }

  function adicionarComando(comando) {
    if (execucaoEmAndamento) {
      mostrarMensagem("Aguarde a execução terminar para editar o algoritmo.", "warning");
      return;
    }
    comandos.push(comando);
    atualizarInterfaceComandos();
  }

  function removerComando(idx) {
    if (execucaoEmAndamento) {
      mostrarMensagem("Aguarde a execução terminar.", "warning");
      return;
    }
    comandos.splice(idx, 1);
    atualizarInterfaceComandos();
  }

  function atualizarInterfaceComandos() {
    if (!listaComandosDiv) return;
    if (comandos.length === 0) {
      algoritmoVazioMsg.style.display = "block";
      listaComandosDiv.innerHTML = "";
    } else {
      algoritmoVazioMsg.style.display = "none";
      listaComandosDiv.innerHTML = comandos.map((cmd, idx) => {
        let texto = cmd === "andar" ? "🚶 ANDAR" : cmd === "pegar" ? "✋ PEGAR" : "🔄 LOOP (3x)";
        return `<span class="comando-item" data-idx="${idx}" style="background:#2c3e2b; border-left:4px solid #ffb347; border-radius:16px; padding:6px 12px; display:inline-flex; align-items:center; gap:8px; margin:4px;">
                  ${texto}
                  <span class="remover-comando" data-idx="${idx}" style="cursor:pointer; color:#e74c3c;">✖️</span>
                </span>`;
      }).join("");
      document.querySelectorAll(".remover-comando").forEach(btn => {
        btn.removeEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
          removerComando(idx);
        });
        btn.addEventListener("click", (e) => {
          const idx = parseInt(e.currentTarget.getAttribute("data-idx"));
          removerComando(idx);
        });
      });
    }
  }

  function limparAlgoritmo() {
    if (execucaoEmAndamento) {
      mostrarMensagem("Aguarde a execução terminar.", "warning");
      return;
    }
    comandos = [];
    atualizarInterfaceComandos();
    mostrarMensagem("Algoritmo limpo! Monte um novo.", "info");
  }

  async function executarRobo() {
    if (execucaoEmAndamento) {
      mostrarMensagem("Já estou executando! Aguarde.", "warning");
      return;
    }
    if (comandos.length === 0) {
      mostrarMensagem("❌ Nenhum comando! Monte o algoritmo primeiro.", "erro");
      return;
    }
    inicializarCenario();
    execucaoEmAndamento = true;
    btnExecutar.disabled = true;
    btnReiniciar.disabled = true;
    btnLimpar.disabled = true;
    let sucesso = true;
    let i = 0;

    while (i < comandos.length && sucesso && caixasRestantes > 0) {
      const cmd = comandos[i];
      if (cmd === "andar") {
        if (posicaoRobo < 4) {
          posicaoRobo++;
          desenharEsteira();
          await delay(400);
        } else {
          sucesso = false;
          mostrarMensagem("🐛 ERRO: O robô tentou sair da esteira! Use ANDAR com cuidado.", "erro");
          incrementarBug();
          break;
        }
        i++;
      }
      else if (cmd === "pegar") {
        if (posicaoRobo < caixasRestantes) {
          caixasPegas++;
          caixasRestantes--;
          atualizarDisplayCaixas();
          await delay(300);
        } else {
          sucesso = false;
          mostrarMensagem("🐛 ERRO: Não há caixa para pegar nessa posição!", "erro");
          incrementarBug();
          break;
        }
        i++;
      }
      else if (cmd === "loop") {
        if (i + 2 >= comandos.length) {
          sucesso = false;
          mostrarMensagem("🐛 ERRO: LOOP sem os dois comandos obrigatórios depois!", "erro");
          incrementarBug();
          break;
        }
        const subCmd1 = comandos[i + 1];
        const subCmd2 = comandos[i + 2];
        for (let r = 0; r < 3; r++) {
          // executa subCmd1
          if (subCmd1 === "andar") {
            if (posicaoRobo < 4) {
              posicaoRobo++;
              desenharEsteira();
              await delay(300);
            } else { sucesso = false; break; }
          } else if (subCmd1 === "pegar") {
            if (posicaoRobo < caixasRestantes) {
              caixasPegas++;
              caixasRestantes--;
              atualizarDisplayCaixas();
              await delay(300);
            } else { sucesso = false; break; }
          }
          if (!sucesso) break;
          // executa subCmd2
          if (subCmd2 === "andar") {
            if (posicaoRobo < 4) {
              posicaoRobo++;
              desenharEsteira();
              await delay(300);
            } else { sucesso = false; break; }
          } else if (subCmd2 === "pegar") {
            if (posicaoRobo < caixasRestantes) {
              caixasPegas++;
              caixasRestantes--;
              atualizarDisplayCaixas();
              await delay(300);
            } else { sucesso = false; break; }
          }
          if (!sucesso) break;
        }
        if (!sucesso) break;
        i += 3; // pula o LOOP + dois comandos
      }
    }

    execucaoEmAndamento = false;
    btnExecutar.disabled = false;
    btnReiniciar.disabled = false;
    btnLimpar.disabled = false;

    if (sucesso && caixasRestantes === 0) {
      const numComandos = comandos.length;
      const bonusLoop = comandos.includes("loop") ? 20 : 0;
      pontuacaoAtual = Math.max(0, 100 - (numComandos * 3) + (caixasPegas * 2) + bonusLoop);
      pontuacaoFinalSpan.innerText = pontuacaoAtual;
      roboAnimationDiv.innerHTML = "🤖🎉✨";
      mostrarMensagem(`✅ VITÓRIA! Você pegou todas as ${caixasPegas} caixas com ${numComandos} comandos. Pontuação: ${pontuacaoAtual}`, "success");
    } else if (sucesso && caixasRestantes > 0) {
      mostrarMensagem(`⚠️ O robô parou, mas ainda restam ${caixasRestantes} caixas. Acrescente mais comandos ou use LOOP.`, "warning");
    } else {
      roboAnimationDiv.innerHTML = "🤖💥";
    }
  }

  function reiniciarCompleto() {
    if (execucaoEmAndamento) {
      mostrarMensagem("Aguarde a execução atual terminar.", "warning");
      return;
    }
    comandos = [];
    atualizarInterfaceComandos();
    inicializarCenario();
    mostrarMensagem("Jogo reiniciado! Monte um novo algoritmo.", "info");
  }

  function mostrarDicaJogo() {
    mostrarMensagem("💡 DICA: Use LOOP + PEGAR + PEGAR para pegar 2 caixas repetidas 3 vezes (total 6 caixas). Combine com ANDAR para se mover.", "info");
  }

  function initJogo() {
    if (!btnExecutar) return;
    document.querySelectorAll(".cartao-comando-jogo").forEach(btn => {
      btn.removeEventListener("click", (e) => {
        const comando = e.currentTarget.getAttribute("data-comando");
        if (comando) adicionarComando(comando);
      });
      btn.addEventListener("click", (e) => {
        const comando = e.currentTarget.getAttribute("data-comando");
        if (comando) adicionarComando(comando);
      });
    });
    btnExecutar.addEventListener("click", executarRobo);
    btnReiniciar.addEventListener("click", reiniciarCompleto);
    btnDica.addEventListener("click", mostrarDicaJogo);
    btnLimpar.addEventListener("click", limparAlgoritmo);
    inicializarCenario();
  }

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