// ==================================================
// a1bim2.js – LÓGICA UNIFICADA DO BIMESTRE 2
// 1º ANO | MISSÃO: MEDIR, CLASSIFICAR E NÃO BUGAR!
// Módulos: Jogo Medidor Maluco, Certificado, Planos de Aula, Cabeçalho, Rodapé, Apresentação
// ==================================================

(function () {
  "use strict";

  // ------------------------------------------------------------------
  // 1. JOGO MEDIDOR MALUCO (corrigido: 6 questões únicas, sem repetição)
  // ------------------------------------------------------------------
  const MedidorMaluco = {
    questoes: [
      // FASE 1: COMPARAR
      {
        fase: 1,
        pergunta: "Compare os objetos: qual é o MAIS COMPRIDO?",
        imagem: "📏",
        opcoes: ["Lápis (10cm)", "Borracha (3cm)", "Régua (30cm)"],
        correta: 2,
        explicacao:
          "A régua tem 30cm, é mais comprida que o lápis e a borracha!",
      },
      {
        fase: 1,
        pergunta: "Qual destes é o MAIS CURTO?",
        imagem: "📐",
        opcoes: ["Ônibus (10m)", "Formiga (1cm)", "Girafa (5m)"],
        correta: 1,
        explicacao: "A formiga tem 1cm, é a mais curta!",
      },
      // FASE 2: CLASSIFICAR
      {
        fase: 2,
        pergunta: "Classifique: qual objeto é VERMELHO e PEQUENO?",
        imagem: "🎨",
        opcoes: ["🟥 Botão vermelho", "🔵 Botão azul", "🟥 Balde vermelho"],
        correta: 0,
        explicacao: "O botão vermelho é pequeno e vermelho. O balde é grande!",
      },
      {
        fase: 2,
        pergunta: "Qual objeto é AMARELO e GRANDE?",
        imagem: "🌟",
        opcoes: ["🟨 Página de caderno", "🟨 Ônibus escolar", "🟨 Caneta"],
        correta: 1,
        explicacao: "O ônibus escolar é grande e amarelo!",
      },
      // FASE 3: DEPURAR
      {
        fase: 3,
        pergunta:
          "Qual é o erro nesta sequência? [↑ ↑ → ← ↑] Deveria chegar ao tesouro.",
        imagem: "🐛",
        opcoes: [
          "A última seta deveria ser →",
          "A primeira seta deveria ser ←",
          "A seta do meio deveria ser ↓",
        ],
        correta: 0,
        explicacao:
          "Para chegar ao tesouro, a última seta precisa ser → (direita).",
      },
      {
        fase: 3,
        pergunta: "Qual é o erro? [→ → ← ↑] O robô quer ir para a DIREITA.",
        imagem: "🐞",
        opcoes: [
          "A terceira seta (←) está errada",
          "A primeira seta está errada",
          "Falta uma seta",
        ],
        correta: 0,
        explicacao: "A seta ← (esquerda) atrapalha. Deveria ser → ou ↑.",
      },
    ],
    questoesRestantes: [],
    faseAtual: 1,
    pecas: 0,
    totalPecas: 6,
    questoesRespondidas: 0,
    elementos: {
      faseSpan: null,
      desafioArea: null,
      opcoesArea: null,
      pecasContador: null,
      barraPecas: null,
      mensagemDiv: null,
      resetBtn: null,
    },

    init() {
      this.capturarElementos();
      this.resetarJogoCompleto();
      this.configurarEventos();
      console.log("🎮 [MedidorMaluco] Inicializado!");
    },

    capturarElementos() {
      this.elementos.faseSpan = document.getElementById("faseJogo");
      this.elementos.desafioArea = document.getElementById("desafioArea");
      this.elementos.opcoesArea = document.getElementById("opcoesArea");
      this.elementos.pecasContador = document.getElementById("pecasContador");
      this.elementos.barraPecas = document.getElementById("barraPecas");
      this.elementos.mensagemDiv = document.getElementById("mensagemJogo");
      this.elementos.resetBtn = document.getElementById("resetJogoBtn");
    },

    resetarJogoCompleto() {
      // Embaralha e copia as questões
      this.questoesRestantes = [...this.questoes];
      this.embaralhar(this.questoesRestantes);
      this.pecas = 0;
      this.questoesRespondidas = 0;
      this.atualizarProgresso();
      this.carregarProximaQuestao();
      this.atualizarFaseDisplay();
      this.desabilitarOpcoes(false);
    },

    embaralhar(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    carregarProximaQuestao() {
      if (this.questoesRestantes.length === 0) {
        // Fim do jogo – vitória
        if (this.pecas >= this.totalPecas) {
          this.mostrarMensagem(
            "🎉 PARABÉNS! Você montou o ROBÔ COMPLETO! 🎉 Clique em REINICIAR para jogar novamente.",
            "win",
          );
          this.desabilitarOpcoes(true);
          this.dispararEventoVitoria();
        } else {
          // Caso raro: acabaram as questões mas não completou peças (reforço)
          this.mostrarMensagem(
            "🔄 Você respondeu todas as questões! Clique em REINICIAR para treinar mais.",
            "info",
          );
          this.desabilitarOpcoes(true);
        }
        return;
      }

      const questao = this.questoesRestantes[0];
      this.faseAtual = questao.fase;
      this.atualizarFaseDisplay();

      if (this.elementos.desafioArea) {
        this.elementos.desafioArea.innerHTML = `
          <div class="mb-2" style="font-size: 3rem;">${questao.imagem}</div>
          <p class="mb-0"><strong>${questao.pergunta}</strong></p>
        `;
      }

      if (this.elementos.opcoesArea) {
        this.elementos.opcoesArea.innerHTML = "";
        questao.opcoes.forEach((opcao, idx) => {
          const btn = document.createElement("button");
          btn.className = "opcao-item";
          btn.textContent = opcao;
          btn.setAttribute("data-opcao", idx);
          btn.addEventListener("click", () => this.verificarResposta(idx));
          this.elementos.opcoesArea.appendChild(btn);
        });
      }
    },

    verificarResposta(opcaoEscolhida) {
      const questao = this.questoesRestantes[0];
      if (!questao) return;

      const isAcerto = opcaoEscolhida === questao.correta;

      if (isAcerto) {
        this.pecas = Math.min(this.pecas + 1, this.totalPecas);
        this.questoesRespondidas++;
        this.atualizarProgresso();
        this.mostrarMensagem(
          `✅ ACERTOU! +1 peça. ${questao.explicacao}`,
          "success",
        );

        // Remove a questão atual da lista
        this.questoesRestantes.shift();

        if (this.pecas >= this.totalPecas) {
          this.carregarProximaQuestao(); // vai mostrar a mensagem de vitória
        } else {
          this.carregarProximaQuestao();
        }
      } else {
        this.dispararEventoBug(
          "Errou na classificação! Resposta correta: " +
            questao.opcoes[questao.correta],
        );
        this.mostrarMensagem(
          `❌ ERROU! A resposta correta era: ${questao.opcoes[questao.correta]}. Tente novamente!`,
          "error",
        );
        // Não perde peças, não remove questão – repete a mesma pergunta
      }
    },

    atualizarProgresso() {
      if (this.elementos.pecasContador) {
        this.elementos.pecasContador.textContent = this.pecas;
      }
      const percent = (this.pecas / this.totalPecas) * 100;
      if (this.elementos.barraPecas) {
        this.elementos.barraPecas.style.width = percent + "%";
        this.elementos.barraPecas.textContent = Math.round(percent) + "%";
      }
    },

    atualizarFaseDisplay() {
      if (this.elementos.faseSpan) {
        this.elementos.faseSpan.textContent = this.faseAtual;
      }
    },

    desabilitarOpcoes(disabled) {
      const botoes = document.querySelectorAll(".opcao-item");
      botoes.forEach((btn) => (btn.disabled = disabled));
    },

    resetarJogo() {
      this.resetarJogoCompleto();
      this.mostrarMensagem(
        "🔄 Jogo reiniciado! Responda às questões para montar o robô!",
        "info",
      );
      this.dispararEventoResetBugs();
    },

    mostrarMensagem(msg, tipo) {
      if (!this.elementos.mensagemDiv) return;
      this.elementos.mensagemDiv.textContent = msg;
      let classe = "alert-info";
      if (tipo === "success") classe = "alert-success";
      if (tipo === "error") classe = "alert-danger";
      if (tipo === "win") classe = "alert-warning";
      this.elementos.mensagemDiv.className = `alert ${classe} small`;
      if (tipo !== "error") {
        setTimeout(() => {
          if (
            this.elementos.mensagemDiv &&
            this.questoesRestantes.length > 0 &&
            this.pecas < this.totalPecas
          ) {
            this.elementos.mensagemDiv.className = "alert alert-info small";
            this.elementos.mensagemDiv.textContent =
              "Clique nas opções para ajudar o robô a lembrar!";
          }
        }, 4000);
      }
    },

    dispararEventoBug(mensagem) {
      window.dispatchEvent(
        new CustomEvent("robo:bug", {
          detail: { incremento: 1, mensagem: mensagem },
        }),
      );
    },

    dispararEventoResetBugs() {
      window.dispatchEvent(new CustomEvent("robo:resetBugs"));
    },

    dispararEventoVitoria() {
      window.dispatchEvent(new CustomEvent("robo:vitoria"));
    },

    configurarEventos() {
      if (this.elementos.resetBtn) {
        this.elementos.resetBtn.addEventListener("click", () =>
          this.resetarJogo(),
        );
      }
    },
  };

  // ------------------------------------------------------------------
  // 2. CERTIFICADO (cadastro, lista, pré-visualização, impressão)
  // ------------------------------------------------------------------
  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano1_bim2",
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
      if (!document.getElementById("listaAlunos")) return;
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
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
      this.alunos = salvos ? JSON.parse(salvos) : [];
      if (this.alunos.length === 0) {
        this.alunos = ["ANA BEATRIZ", "LUCAS MARTINS", "MARIA CLARA"];
        this.salvarAlunos();
      }
    },
    salvarAlunos() {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos));
    },
    atualizarPreviewData() {
      if (this.elementos.previewData) {
        this.elementos.previewData.textContent = new Date().toLocaleDateString(
          "pt-BR",
        );
      }
    },
    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimirTodos)
        this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      const nomePreview = this.elementos.previewNome?.textContent || "";
      if (this.elementos.btnPreviewAluno)
        this.elementos.btnPreviewAluno.disabled =
          nomePreview === "[NOME DO ALUNO]" || nomePreview === "";
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
      this.elementos.inputNome.focus();
      this.atualizarEstadoBotoes();
    },
    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (
          this.elementos.previewNome &&
          this.elementos.previewNome.textContent === this.alunos[index]
        ) {
          this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        }
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
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
          <div class="btn-group gap-1">
            <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
            <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
          </div>`;
        listaUl.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const nome = btn.getAttribute("data-nome");
          if (nome) this.selecionarAlunoPreview(nome);
        });
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-index"));
          if (!isNaN(idx)) this.removerAluno(idx);
        });
      });
      if (this.elementos.contadorAlunos)
        this.elementos.contadorAlunos.textContent = this.alunos.length;
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
      } else
        alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
    },
    _gerarHtmlCertificado(nome, data) {
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title>
        <style>
          *{margin:0;padding:0;box-sizing:border-box;}
          body{font-family:'Courier New',monospace;background:#e0e0e0;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:40px 20px;}
          .preview-container{max-width:800px;width:100%;margin:0 auto;}
          .preview-actions{text-align:center;margin-bottom:20px;position:sticky;top:10px;z-index:100;}
          .btn-print,.btn-close{background:#ffb347;border:none;border-radius:40px;padding:10px 24px;font-weight:bold;cursor:pointer;margin:0 8px;}
          .btn-close{background:#555;color:white;}
          .certificado{border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:30px;text-align:center;background:#fffef7;box-shadow:0 20px 40px rgba(0,0,0,0.2);}
          .certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;margin-bottom:20px;}
          .certificado strong.nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}
          @media print{body{background:white;}.preview-actions{display:none;}@page{size:A4;margin:1.5cm;}}
        </style>
      </head><body>
        <div class="preview-container">
          <div class="preview-actions"><button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button><button class="btn-close" onclick="window.close();">✖️ FECHAR</button></div>
          <div class="certificado">
            <h3>🏆 CERTIFICADO DE MESTRE DA MEDIDA E CLASSIFICAÇÃO</h3>
            <p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>1º ANO – ROBÓTICA EDUCACIONAL – BIMESTRE 2</strong><br>📏 COMPARAÇÃO | 🎨 CLASSIFICAÇÃO | 🐛 DEPURAÇÃO | 🗺️ MAPAS</p>
            <hr><p>RobôMestres do Paraná • ${data}</p>
            <p style="font-size:11px;font-style:italic;">"SE o robô não andar, ENTÃO a gente dança, SENÃO a gente programa de novo!"</p>
            <div style="margin-top:10px;">🤖 Ass: Robô Zé 2.0</div>
          </div>
        </div>
        <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
      </body></html>`;
    },
    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado! Adicione nomes antes de imprimir.");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;">
          <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DA MEDIDA</h3>
          <p>Certificamos que</p><strong style="font-size:1rem; display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
          <p>concluiu o <strong>1º ANO – ROBÓTICA EDUCACIONAL – BIMESTRE 2</strong><br>📏 COMPARAÇÃO | 🎨 CLASSIFICAÇÃO | 🐛 DEPURAÇÃO</p>
          <hr><p style="font-size:0.65rem;">RobôMestres do Paraná • ${dataAtual}</p>
          <p style="font-size:0.6rem; font-style:italic;">"SE o robô não andar, ENTÃO a gente dança, SENÃO a gente programa de novo!"</p>
          <div style="font-size:0.55rem;">🤖 Ass: Robô Zé 2.0</div>
        </div>`;
      });
      const htmlLote = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados RobôMestres - 1º Ano</title>
        <style>*{margin:0;padding:0;}body{font-family:'Courier New',monospace;background:white;padding:20px;}.print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}@media print{body{padding:0;}@page{size:A4;margin:0.8cm;}}</style>
      </head><body><div class="print-grid">${cardsHTML}</div>
      <script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200);};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
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
    escapeHtml(texto) {
      return texto
        ? texto.replace(/[&<>]/g, function (m) {
            return m === "&" ? "&amp;" : m === "<" ? "&lt;" : "&gt;";
          })
        : "";
    },
  };

  // ------------------------------------------------------------------
  // 3. PLANOS DE AULA (checkboxes, progresso)
  // ------------------------------------------------------------------
  const PlanosAulaModule = {
    storageKey: "planoAula_Concluidas_ano1_bim2",
    totalSemanas: 10,
    checkboxes: null,
    barraProgresso: null,
    progressoTexto: null,
    init() {
      if (!document.getElementById("accordionAulas")) return;
      this.capturarElementos();
      this.carregarProgresso();
      this.configurarEventos();
      this.configurarEfeitosHover();
    },
    capturarElementos() {
      this.checkboxes = document.querySelectorAll(".semana-check");
      this.barraProgresso = document.getElementById("barraProgresso");
      this.progressoTexto = document.getElementById("progressoTexto");
      if (this.checkboxes.length) this.totalSemanas = this.checkboxes.length;
    },
    salvarProgresso() {
      const concluidas = {};
      this.checkboxes.forEach((cb, idx) => {
        const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.storageKey, JSON.stringify(concluidas));
      this.atualizarBarraProgresso();
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.storageKey);
      if (!salvo) {
        this.atualizarBarraProgresso();
        return;
      }
      try {
        const concluidas = JSON.parse(salvo);
        this.checkboxes.forEach((cb, idx) => {
          const semana = cb.getAttribute("data-semana") || `semana_${idx + 1}`;
          if (concluidas.hasOwnProperty(semana))
            cb.checked = concluidas[semana];
        });
      } catch (e) {}
      this.atualizarBarraProgresso();
    },
    getTotalMarcados() {
      let marcados = 0;
      this.checkboxes.forEach((cb) => {
        if (cb.checked) marcados++;
      });
      return marcados;
    },
    atualizarBarraProgresso() {
      const marcados = this.getTotalMarcados();
      const percent =
        this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
      if (this.barraProgresso) {
        this.barraProgresso.style.width = percent + "%";
        this.barraProgresso.textContent = Math.round(percent) + "%";
      }
      if (this.progressoTexto)
        this.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
    },
    handleCheckboxChange() {
      this.salvarProgresso();
      this.mostrarToast("✅ Progresso atualizado!", "success");
    },
    mostrarToast(mensagem, tipo) {
      let toastContainer = document.querySelector(".toast-container-custom");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container-custom";
        toastContainer.style.cssText =
          "position:fixed;bottom:20px;right:20px;z-index:9999;";
        document.body.appendChild(toastContainer);
      }
      const toastId = "toast_" + Date.now();
      const bgColor = tipo === "success" ? "#2ecc71" : "#f39c12";
      const toastHtml = `<div id="${toastId}" style="background:#1e2a1a;border-left:4px solid ${bgColor};border-radius:12px;padding:12px 20px;margin-bottom:10px;color:#e9f5db;font-size:0.85rem;box-shadow:0 4px 15px rgba(0,0,0,0.3);animation:slideInRight 0.3s ease-out;display:flex;align-items:center;gap:10px;">
        <i class="bi ${tipo === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"}" style="color:${bgColor};"></i><span>${mensagem}</span>
      </div>`;
      toastContainer.insertAdjacentHTML("beforeend", toastHtml);
      setTimeout(() => {
        const toast = document.getElementById(toastId);
        if (toast) toast.remove();
      }, 3000);
    },
    configurarEfeitosHover() {
      document.querySelectorAll(".accordion-item").forEach((card) => {
        card.addEventListener("mouseenter", () => {
          card.style.transform = "translateY(-2px)";
          card.style.transition = "0.2s";
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });
    },
    configurarEventos() {
      this.checkboxes.forEach((cb) =>
        cb.addEventListener("change", () => this.handleCheckboxChange()),
      );
      const expandirBtn = document.getElementById("expandirTodosBtn");
      const recolherBtn = document.getElementById("recolherTodosBtn");
      if (expandirBtn)
        expandirBtn.addEventListener("click", () => {
          document
            .querySelectorAll("#accordionAulas .accordion-collapse")
            .forEach((collapse) => {
              if (typeof bootstrap !== "undefined")
                bootstrap.Collapse.getOrCreateInstance(collapse).show();
              else collapse.classList.add("show");
            });
        });
      if (recolherBtn)
        recolherBtn.addEventListener("click", () => {
          document
            .querySelectorAll("#accordionAulas .accordion-collapse")
            .forEach((collapse) => {
              if (typeof bootstrap !== "undefined")
                bootstrap.Collapse.getOrCreateInstance(collapse).hide();
              else collapse.classList.remove("show");
            });
        });
    },
  };

  // ------------------------------------------------------------------
  // 4. CABEÇALHO / RODAPÉ (contador de bugs)
  // ------------------------------------------------------------------
  const CabecalhoModule = {
    contadorBugs: 0,
    contadorElement: null,
    init() {
      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.carregarContador();
      this.atualizarDisplay();
      this.configurarEventos();
    },
    carregarContador() {
      try {
        this.contadorBugs = parseInt(
          localStorage.getItem("cabecalho_contador_bugs") || "0",
        );
      } catch (e) {}
    },
    salvarContador() {
      localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs);
    },
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplay();
      this.salvarContador();
      this.animarContador();
    },
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplay();
      this.salvarContador();
      this.animarReset();
    },
    atualizarDisplay() {
      if (this.contadorElement)
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      const relatorio = document.getElementById("relatorioBugs");
      if (relatorio) relatorio.innerText = this.contadorBugs;
    },
    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
        setTimeout(() => {
          if (this.contadorElement) this.contadorElement.style.animation = "";
        }, 300);
      }
    },
    animarReset() {
      const painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (painel) painel.style.animation = "";
        }, 300);
      }
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

  // ------------------------------------------------------------------
  // 5. APRESENTAÇÃO (efeitos visuais leves)
  // ------------------------------------------------------------------
  const ApresentacaoModule = {
    init() {
      if (!document.getElementById("carta-abertura")) return;
      this.efeitoDigitacaoCarta();
      this.animarEntradaElementos();
      this.criarBotaoTopo();
    },
    efeitoDigitacaoCarta() {
      const paragrafos = document.querySelectorAll(".carta-texto");
      paragrafos.forEach((p, idx) => {
        p.style.opacity = "0";
        p.style.transform = "translateY(10px)";
        p.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        setTimeout(
          () => {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
          },
          200 + idx * 150,
        );
      });
    },
    animarEntradaElementos() {
      const elementos = document.querySelectorAll(
        ".projeto-header, .bg-robocard, .table-responsive",
      );
      elementos.forEach((el, idx) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        setTimeout(() => {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, idx * 100);
      });
    },
    criarBotaoTopo() {
      const btn = document.createElement("button");
      btn.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
      btn.className = "btn-topo-robotico";
      btn.style.cssText =
        "position:fixed;bottom:20px;left:20px;background:#2c3e2b;border:2px solid #ffb347;border-radius:50%;width:45px;height:45px;color:#ffb347;font-size:1.5rem;cursor:pointer;z-index:1000;opacity:0;visibility:hidden;transition:all 0.3s;display:flex;align-items:center;justify-content:center;";
      btn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );
      document.body.appendChild(btn);
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          btn.style.opacity = "1";
          btn.style.visibility = "visible";
        } else {
          btn.style.opacity = "0";
          btn.style.visibility = "hidden";
        }
      });
    },
  };

  // ------------------------------------------------------------------
  // INICIALIZAÇÃO GERAL
  // ------------------------------------------------------------------
  function initAll() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        MedidorMaluco.init();
        CertificadoModule.init();
        PlanosAulaModule.init();
        CabecalhoModule.init();
        ApresentacaoModule.init();
      });
    } else {
      MedidorMaluco.init();
      CertificadoModule.init();
      PlanosAulaModule.init();
      CabecalhoModule.init();
      ApresentacaoModule.init();
    }
  }

  // Adiciona keyframes dinâmicos (caso não estejam no CSS)
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes piscaLed { 0%,100%{opacity:1;text-shadow:0 0 5px #00ff00;} 50%{opacity:0.4;text-shadow:0 0 15px #ffcc00;} }
    @keyframes curtoCircuito { 0%,100%{background-color:#2c3e2b;} 10%,30%,50%{background-color:#ffcc00;} 20%,40%{background-color:#ff6600;} }
  `;
  document.head.appendChild(style);

  // Exporta módulos para debugging (opcional)
  window.MedidorMaluco = MedidorMaluco;
  window.CertificadoModule = CertificadoModule;
  window.PlanosAulaModule = PlanosAulaModule;
  window.CabecalhoModule = CabecalhoModule;
  window.ApresentacaoModule = ApresentacaoModule;

  initAll();
})();
