// ==================================================
// a2bim1.js – 2º Ano / 1º Bimestre
// Funcionalidades: JOGO CONDICIONAL (SE → ENTÃO → SENÃO), certificado, checkboxes de planos de aula,
// animações e integração com localStorage
// ==================================================

(function () {
  "use strict";

  // ==================== MÓDULO: PLANOS DE AULA (checkboxes e progresso) ====================
  const PlanosModule = {
    STORAGE_KEY: "planoAula_Concluidas_2ano",
    totalSemanas: 10,
    init() {
      this.carregarProgresso();
      this.configurarEventos();
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      const checkboxes = document.querySelectorAll(".semana-check");
      if (checkboxes.length) this.totalSemanas = checkboxes.length;
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          checkboxes.forEach((cb, idx) => {
            const semana = cb.getAttribute("data-semana");
            if (semana && concluidas[semana]) cb.checked = true;
            else if (concluidas[`semana_${idx + 1}`]) cb.checked = true;
          });
        } catch (e) {}
      }
      this.atualizarBarraProgresso();
    },
    salvarProgresso() {
      const concluidas = {};
      document.querySelectorAll(".semana-check").forEach((cb) => {
        const semana =
          cb.getAttribute("data-semana") ||
          `semana_${Array.from(document.querySelectorAll(".semana-check")).indexOf(cb) + 1}`;
        concluidas[semana] = cb.checked;
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },
    atualizarBarraProgresso() {
      const barra = document.getElementById("barraProgresso");
      const texto = document.getElementById("progressoTexto");
      if (!barra) return;
      const marcados = document.querySelectorAll(
        ".semana-check:checked",
      ).length;
      const percent = (marcados / this.totalSemanas) * 100;
      barra.style.width = percent + "%";
      if (texto) texto.textContent = `${marcados}/${this.totalSemanas}`;
    },
    configurarEventos() {
      document.querySelectorAll(".semana-check").forEach((cb) => {
        cb.addEventListener("change", () => {
          this.salvarProgresso();
          this.atualizarBarraProgresso();
        });
      });
    },
  };

  // ==================== MÓDULO: CERTIFICADO ====================
  const CertificadoModule = {
    STORAGE_KEY: "robozada_certificados_ano2",
    alunos: [],
    init() {
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
    },
    carregarElementos() {
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
      if (this.previewData)
        this.previewData.textContent = new Date().toLocaleDateString("pt-BR");
    },
    atualizarEstadoBotoes() {
      if (this.btnImprimirTodos)
        this.btnImprimirTodos.disabled = this.alunos.length === 0;
      if (this.btnPreviewAluno) {
        const nome = this.previewNome?.textContent || "";
        this.btnPreviewAluno.disabled =
          nome === "[NOME DO ALUNO]" || nome === "";
      }
    },
    adicionarAluno() {
      let nome = this.inputNome.value.trim();
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
      this.inputNome.value = "";
      this.inputNome.focus();
      this.atualizarEstadoBotoes();
    },
    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]} da lista?`)) {
        this.alunos.splice(index, 1);
        this.salvarAlunos();
        this.atualizarLista();
        if (this.previewNome.textContent === this.alunos[index])
          this.previewNome.textContent = "[NOME DO ALUNO]";
        this.atualizarEstadoBotoes();
      }
    },
    selecionarAlunoPreview(nome) {
      this.previewNome.textContent = nome;
      this.atualizarEstadoBotoes();
    },
    atualizarLista() {
      if (!this.listaAlunos) return;
      if (this.alunos.length === 0) {
        this.listaAlunos.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>';
        if (this.contadorAlunos) this.contadorAlunos.textContent = "0";
        return;
      }
      this.listaAlunos.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
                                <div class="btn-group gap-1">
                                    <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
                                    <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
                                </div>`;
        this.listaAlunos.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.addEventListener("click", () =>
          this.selecionarAlunoPreview(btn.getAttribute("data-nome")),
        );
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.addEventListener("click", () =>
          this.removerAluno(parseInt(btn.getAttribute("data-index"))),
        );
      });
      if (this.contadorAlunos)
        this.contadorAlunos.textContent = this.alunos.length;
    },
    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nome, data);
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
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title><style>
                *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'Courier New',monospace;background:#e0e0e0;min-height:100vh;display:flex;justify-content:center;align-items:center;padding:40px 20px;}
                .certificado{border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:30px;text-align:center;background:#fffef7;box-shadow:0 20px 40px rgba(0,0,0,0.2);max-width:800px;margin:auto;}
                .certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;margin-bottom:20px;}
                .certificado p{color:#4a6e2c;margin:10px 0;}
                .certificado strong.nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}
                .btn-print{background:#ffb347;border:none;border-radius:40px;padding:10px 24px;font-weight:bold;cursor:pointer;margin-bottom:20px;}
                @media print{body{background:white;} .btn-print{display:none;} @page{size:A4;margin:1.5cm;}}
            </style></head><body><div><button class="btn-print" onclick="window.print();">🖨️ IMPRIMIR</button><div class="certificado">
            <h3>🏆 CERTIFICADO DE MESTRE DO SE, ENTÃO E SENÃO</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong>
            <p>concluiu com êxito o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>🤖 SE → ENTÃO → SENÃO | 🃏 JOGO ROBÔ DECISOR | 🤖 PROJETO ROBÔ DO LANCHE</p>
            <hr><p>RobôMestres do Paraná • ${data}</p><p style="font-size:11px;">"SE você pensou, ENTÃO você programou. SENÃO, programe de novo."</p>
            <div>🤖 Ass: Robô Zé 2.0</div></div></div></body></html>`;
    },
    imprimirTodosCertificados() {
      if (this.alunos.length === 0) {
        alert("🤖 Nenhum aluno cadastrado!");
        return;
      }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach((aluno) => {
        cardsHTML += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;">
                    <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO DE MESTRE DO SE, ENTÃO E SENÃO</h3>
                    <p>Certificamos que</p><strong style="font-size:1rem; display:block; margin:10px 0; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
                    <p>concluiu o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>🤖 SE → ENTÃO → SENÃO | 🃏 JOGO ROBÔ DECISOR</p>
                    <hr><p>RobôMestres do Paraná • ${dataAtual}</p><p style="font-size:0.6rem;">"SE você pensou, ENTÃO você programou. SENÃO, programe de novo."</p>
                    <div>🤖 Ass: Robô Zé 2.0</div>
                </div>`;
      });
      const htmlLote = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados RobôMestres - 2º Ano</title><style>
                *{margin:0;padding:0;box-sizing:border-box;} body{font-family:'Courier New',monospace;background:white;padding:20px;}
                .print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
                @media print{body{padding:0;} .print-grid{gap:15px;} @page{size:A4;margin:0.8cm;}}
            </style></head><body><div class="print-grid">${cardsHTML}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200);};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(htmlLote);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para gerar os certificados em lote.");
    },
    previewAlunoSelecionado() {
      const nome = this.previewNome?.textContent || "";
      if (!nome || nome === "[NOME DO ALUNO]") {
        alert("⚠️ Selecione um aluno na lista primeiro!");
        return;
      }
      this.gerarCertificadoUnico(nome);
    },
    escapeHtml(texto) {
      return texto.replace(/[&<>]/g, function (m) {
        return m === "&" ? "&amp;" : m === "<" ? "&lt;" : "&gt;";
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
      if (this.btnImprimirTodos)
        this.btnImprimirTodos.addEventListener("click", () =>
          this.imprimirTodosCertificados(),
        );
      if (this.btnPreviewAluno)
        this.btnPreviewAluno.addEventListener("click", () =>
          this.previewAlunoSelecionado(),
        );
    },
  };

  // ==================== MÓDULO: JOGO CONDICIONAL (SE, ENTÃO, SENÃO) ====================
  const JogoCondicionalModule = {
    // Banco de cenários alinhados ao conteúdo do bimestre
    cenarios: [
      {
        cenario: "Robô na cozinha",
        condicao: "SE o robô estiver com fome",
        entao: "ENTÃO ele come um biscoito 🍪",
        senao: "SENÃO ele bebe água 💧",
      },
      {
        cenario: "Robô na sala de aula",
        condicao: "SE a professora bater palmas",
        entao: "ENTÃO o robô faz silêncio 🤫",
        senao: "SENÃO ele continua conversando 🗣️",
      },
      {
        cenario: "Robô no parquinho",
        condicao: "SE estiver chovendo",
        entao: "ENTÃO o robô fica em casa 🏠",
        senao: "SENÃO ele vai escorregar no escorregador 🛝",
      },
      {
        cenario: "Robô na floresta",
        condicao: "SE aparecer um urso",
        entao: "ENTÃO o robô corre 🏃",
        senao: "SENÃO ele caminha devagar 🚶",
      },
      {
        cenario: "Robô na fábrica de robôs",
        condicao: "SE a luz estiver vermelha",
        entao: "ENTÃO o robô para ⏹️",
        senao: "SENÃO o robô anda ➡️",
      },
      {
        cenario: "Robô na escola de programação",
        condicao: "SE o código estiver certo",
        entao: "ENTÃO o robô funciona ✅",
        senao: "SENÃO o robô dá bug 🐛",
      },
      {
        cenario: "Robô no trânsito",
        condicao: "SE o semáforo estiver verde",
        entao: "ENTÃO o robô atravessa 🚶‍♂️✅",
        senao: "SENÃO o robô espera ⏸️",
      },
      {
        cenario: "Robô na biblioteca",
        condicao: "SE alguém estiver lendo",
        entao: "ENTÃO o robô sussurra 🤫",
        senao: "SENÃO o robô fala normal 🗣️",
      },
    ],

    indiceAtual: 0,
    acertos: 0,
    erros: 0,
    sequencia: 0,
    timeoutAuto: null,

    init() {
      if (!document.getElementById("jogo-condicional")) return;
      this.carregarElementos();
      this.sortearCenario();
      this.configurarEventos();
      this.atualizarPlacar();
    },

    carregarElementos() {
      this.cenarioTexto = document.getElementById("cenarioTexto");
      this.condicaoTexto = document.getElementById("condicaoTexto");
      this.opcaoEntaoTexto = document.getElementById("opcaoEntaoTexto");
      this.opcaoSenaoTexto = document.getElementById("opcaoSenaoTexto");
      this.feedbackDiv = document.getElementById("feedbackRobo");
      this.pontAcertos = document.getElementById("pontuacaoAcertos");
      this.pontErros = document.getElementById("pontuacaoErros");
      this.sequenciaSpan = document.getElementById("sequenciaAcertos");
      this.btnNovo = document.getElementById("btnNovoCenario");
      this.btnResposta = document.getElementById("btnMostrarResposta");
    },

    sortearCenario() {
      // Evita repetir o mesmo cenário consecutivo
      let novoIndice;
      do {
        novoIndice = Math.floor(Math.random() * this.cenarios.length);
      } while (this.cenarios.length > 1 && novoIndice === this.indiceAtual);
      this.indiceAtual = novoIndice;
      this.atualizarInterface();
    },

    atualizarInterface() {
      const c = this.cenarios[this.indiceAtual];
      if (this.cenarioTexto) this.cenarioTexto.textContent = c.cenario;
      if (this.condicaoTexto) this.condicaoTexto.textContent = c.condicao;
      if (this.opcaoEntaoTexto) this.opcaoEntaoTexto.textContent = c.entao;
      if (this.opcaoSenaoTexto) this.opcaoSenaoTexto.textContent = c.senao;

      // Resetar estilo dos cards
      const opEntao = document.getElementById("opcaoEntao");
      const opSenao = document.getElementById("opcaoSenao");
      if (opEntao) opEntao.classList.remove("opcao-certa", "opcao-errada");
      if (opSenao) opSenao.classList.remove("opcao-certa", "opcao-errada");

      if (this.feedbackDiv) {
        this.feedbackDiv.innerHTML =
          '<i class="bi bi-robot"></i> <span>Escolha a opção correta para o robô!</span>';
        this.feedbackDiv.className = "mensagem-jogo";
      }
    },

    avaliarEscolha(tipo) {
      if (this.timeoutAuto) clearTimeout(this.timeoutAuto);

      const cenario = this.cenarios[this.indiceAtual];
      const correta = tipo === "entao";

      if (correta) {
        this.acertos++;
        this.sequencia++;
        this.atualizarPlacar();
        if (this.feedbackDiv) {
          this.feedbackDiv.innerHTML = `<i class="bi bi-check-circle-fill text-success"></i> <span>✅ Certo! ${cenario.condicao} → ${cenario.entao}. O robô executou e ficou feliz! 🤖👍</span>`;
          this.feedbackDiv.className = "mensagem-jogo sucesso";
        }
        const opEntao = document.getElementById("opcaoEntao");
        if (opEntao) opEntao.classList.add("opcao-certa");
      } else {
        this.erros++;
        this.sequencia = 0;
        this.atualizarPlacar();
        if (this.feedbackDiv) {
          this.feedbackDiv.innerHTML = `<i class="bi bi-exclamation-triangle-fill text-danger"></i> <span>❌ Errado! ${cenario.condicao} → ${cenario.senao} não é o correto. O correto era: ${cenario.entao}. Robô bugou! 🐛</span>`;
          this.feedbackDiv.className = "mensagem-jogo erro";
        }
        const opSenao = document.getElementById("opcaoSenao");
        if (opSenao) opSenao.classList.add("opcao-errada");
      }

      // Após 2 segundos, sorteia novo cenário se acertou
      if (correta) {
        this.timeoutAuto = setTimeout(() => {
          this.sortearCenario();
        }, 2000);
      }
    },

    atualizarPlacar() {
      if (this.pontAcertos) this.pontAcertos.textContent = this.acertos;
      if (this.pontErros) this.pontErros.textContent = this.erros;
      if (this.sequenciaSpan) this.sequenciaSpan.textContent = this.sequencia;
    },

    mostrarResposta() {
      const c = this.cenarios[this.indiceAtual];
      if (this.feedbackDiv) {
        this.feedbackDiv.innerHTML = `<i class="bi bi-lightbulb-fill text-warning"></i> <span>💡 RESPOSTA: ${c.condicao} → ${c.entao} (ENTÃO). O SENÃO seria: ${c.senao}</span>`;
        this.feedbackDiv.className = "mensagem-jogo info";
      }
      // Destacar visualmente a opção correta
      const opEntao = document.getElementById("opcaoEntao");
      const opSenao = document.getElementById("opcaoSenao");
      if (opEntao) opEntao.classList.add("opcao-certa");
      if (opSenao) opSenao.classList.remove("opcao-certa", "opcao-errada");

      // Remove destaque extra após 3 segundos
      setTimeout(() => {
        if (opEntao && !opEntao.classList.contains("opcao-errada")) {
          // Se não foi erro, mantém? Melhor remover após tempo
          opEntao.classList.remove("opcao-certa");
        }
      }, 3000);
    },

    configurarEventos() {
      document.querySelectorAll(".btn-escolher").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const tipo = btn.getAttribute("data-tipo");
          this.avaliarEscolha(tipo);
        });
      });
      if (this.btnNovo) {
        this.btnNovo.addEventListener("click", () => {
          if (this.timeoutAuto) clearTimeout(this.timeoutAuto);
          this.sortearCenario();
        });
      }
      if (this.btnResposta) {
        this.btnResposta.addEventListener("click", () =>
          this.mostrarResposta(),
        );
      }
    },
  };

  // ==================== INICIALIZAÇÃO GERAL ====================
  document.addEventListener("DOMContentLoaded", () => {
    PlanosModule.init();
    CertificadoModule.init();
    JogoCondicionalModule.init(); // Substitui o antigo LoopDashModule
    console.log(
      "🤖 a2bim1.js: Todos os módulos inicializados (Plano, Certificado, Jogo Condicional)!",
    );
  });
})();
