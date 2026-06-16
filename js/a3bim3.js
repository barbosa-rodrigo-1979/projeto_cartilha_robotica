// ==================================================
// a3bim3.js – JAVASCRIPT UNIFICADO DO BIMESTRE 3
// Inclui todos os módulos dos anexos + JOGO B.U.G.S.
// ==================================================

(function () {
  "use strict";

  // --------------------------------------------------
  // 1. MÓDULO CABEÇALHO (modelo_cabecalho.js)
  // --------------------------------------------------
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
      console.log("🤖 [CABEÇALHO] Inicializado");
    },
    carregarContador() {
      try { const salvo = localStorage.getItem("cabecalho_contador_bugs"); return salvo ? parseInt(salvo) : 0; } catch (e) { return 0; }
    },
    salvarContador() {
      try { localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs.toString()); } catch (e) { }
    },
    atualizarDisplayContador() {
      if (this.contadorElement) this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      if (this.relatorioElement) this.relatorioElement.innerText = this.contadorBugs;
    },
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarContador();
      return this.contadorBugs;
    },
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      return this.contadorBugs;
    },
    getContadorBugs() { return this.contadorBugs; },
    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(() => { if (this.contadorElement) this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out"; setTimeout(() => { if (this.contadorElement) this.contadorElement.style.animation = ""; }, 300); }, 10);
      }
    },
    configurarEventos() {
      document.addEventListener("robo:bug", (e) => { this.incrementarBugs(e.detail?.incremento || 1); });
      document.addEventListener("robo:resetBugs", () => { this.resetarBugs(); });
    }
  };

  // --------------------------------------------------
  // 2. MÓDULO MENU (modelo_menu_bim.js)
  // --------------------------------------------------
  const MenuModule = {
    init() {
      const currentPath = window.location.pathname.split("/").pop() || "a3bim3.html";
      const navLinks = document.querySelectorAll(".menu-robomestre .nav-link");
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath) link.classList.add("active");
        else link.classList.remove("active");
      });
      console.log("🤖 [MENU] Inicializado");
    }
  };

  // --------------------------------------------------
  // 3. MÓDULO PLANOS DE AULA (modelo_planos_aula.js)
  // --------------------------------------------------
  const PlanosAulaModule = {
    inicializado: false,
    STORAGE_KEY: "planoAula_Concluidas_3ano",
    totalSemanas: 10,
    elementos: { checkboxes: null, barraProgresso: null, progressoTexto: null },
    init() {
      if (this.inicializado) return;
      if (!document.getElementById("accordionAulas")) return;
      this.capturarElementos();
      this.configurarEventos();
      this.carregarProgresso();
      this.inicializado = true;
      console.log("📚 [PlanosAula] Inicializado");
    },
    capturarElementos() {
      this.elementos.checkboxes = document.querySelectorAll(".semana-check");
      this.elementos.barraProgresso = document.getElementById("barraProgresso");
      this.elementos.progressoTexto = document.getElementById("progressoTexto");
      if (this.elementos.checkboxes.length) this.totalSemanas = this.elementos.checkboxes.length;
    },
    salvarProgresso() {
      const concluidas = {};
      this.elementos.checkboxes.forEach(cb => {
        const semana = cb.getAttribute("data-semana");
        if (semana) concluidas[semana] = cb.checked;
        else { const idx = Array.from(this.elementos.checkboxes).indexOf(cb); concluidas[`semana_${idx + 1}`] = cb.checked; }
      });
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(concluidas));
    },
    carregarProgresso() {
      const salvo = localStorage.getItem(this.STORAGE_KEY);
      if (salvo) {
        try {
          const concluidas = JSON.parse(salvo);
          this.elementos.checkboxes.forEach((cb, idx) => {
            const semana = cb.getAttribute("data-semana");
            if (semana && concluidas.hasOwnProperty(semana)) cb.checked = concluidas[semana];
            else if (concluidas.hasOwnProperty(`semana_${idx + 1}`)) cb.checked = concluidas[`semana_${idx + 1}`];
          });
        } catch (e) { }
      }
      this.atualizarBarraProgresso();
    },
    getTotalMarcados() {
      let marcados = 0;
      this.elementos.checkboxes.forEach(cb => { if (cb.checked) marcados++; });
      return marcados;
    },
    atualizarBarraProgresso() {
      const marcados = this.getTotalMarcados();
      const percentual = this.totalSemanas > 0 ? (marcados / this.totalSemanas) * 100 : 0;
      if (this.elementos.barraProgresso) {
        this.elementos.barraProgresso.style.width = percentual + "%";
        this.elementos.barraProgresso.setAttribute("aria-valuenow", marcados);
        this.elementos.barraProgresso.textContent = Math.round(percentual) + "%";
      }
      if (this.elementos.progressoTexto) this.elementos.progressoTexto.textContent = `${marcados}/${this.totalSemanas}`;
    },
    handleCheckboxChange(e) {
      this.salvarProgresso();
      this.atualizarBarraProgresso();
    },
    configurarEventos() {
      this.elementos.checkboxes.forEach(cb => {
        cb.removeEventListener("change", this._handleChange);
        cb.addEventListener("change", (e) => this.handleCheckboxChange(e));
      });
    }
  };

  // --------------------------------------------------
  // 4. MÓDULO RODAPÉ (modelo_rodape.js)
  // --------------------------------------------------
  const RodapeModule = {
    inicializado: false,
    relatorioElement: null,
    init() {
      if (this.inicializado) return;
      this.relatorioElement = document.getElementById("relatorioBugs");
      if (this.relatorioElement) this.atualizarRelatorio();
      this.configurarEventos();
      this.inicializado = true;
      console.log("🤖 [RODAPÉ] Inicializado");
    },
    atualizarRelatorio() {
      if (!this.relatorioElement) return;
      let contadorBugs = 0;
      if (window.CabecalhoModule && typeof window.CabecalhoModule.getContadorBugs === "function") contadorBugs = window.CabecalhoModule.getContadorBugs();
      else { try { const salvo = localStorage.getItem("cabecalho_contador_bugs"); contadorBugs = salvo ? parseInt(salvo) : 0; } catch (e) { } }
      this.relatorioElement.innerText = contadorBugs;
    },
    configurarEventos() {
      document.addEventListener("robo:bug", () => this.atualizarRelatorio());
      document.addEventListener("robo:resetBugs", () => this.atualizarRelatorio());
      document.addEventListener("cabecalho:contador_atualizado", () => this.atualizarRelatorio());
    }
  };

  // --------------------------------------------------
  // 5. MÓDULO CERTIFICADO (modelo_certificado.js)
  // --------------------------------------------------
  const CertificadoModule = {
    inicializado: false,
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano3",
    elementos: { inputNome: null, btnAdicionar: null, listaAlunos: null, contadorAlunos: null, btnImprimirTodos: null, btnPreviewAluno: null, previewNome: null, previewData: null },
    init() {
      if (this.inicializado) return;
      if (!document.getElementById("listaAlunos") && !document.querySelector(".cadastro-alunos")) return;
      this.carregarElementos();
      this.carregarAlunosDoStorage();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      this.atualizarEstadoBotoes();
      this.inicializado = true;
      console.log("🎓 [Certificado] Inicializado");
    },
    carregarElementos() {
      this.elementos.inputNome = document.getElementById("nomeAluno");
      this.elementos.btnAdicionar = document.getElementById("btnAdicionar");
      this.elementos.listaAlunos = document.getElementById("listaAlunos");
      this.elementos.contadorAlunos = document.getElementById("contadorAlunos");
      this.elementos.btnImprimirTodos = document.getElementById("btnImprimirCertificados");
      this.elementos.btnPreviewAluno = document.getElementById("btnPreviewAluno");
      this.elementos.previewNome = document.getElementById("previewNomeAluno");
      this.elementos.previewData = document.getElementById("previewData");
    },
    carregarAlunosDoStorage() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) { try { this.alunos = JSON.parse(salvos); } catch (e) { this.alunos = []; } }
      if (!this.alunos || this.alunos.length === 0) this.alunos = ["ANA BEATRIZ SANTOS", "LUCAS MARTINS FERREIRA", "MARIA CLARA SILVA"];
      this.salvarAlunos();
    },
    salvarAlunos() { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.alunos)); },
    atualizarPreviewData() { if (this.elementos.previewData) this.elementos.previewData.textContent = new Date().toLocaleDateString("pt-BR"); },
    atualizarEstadoBotoes() {
      if (this.elementos.btnImprimirTodos) this.elementos.btnImprimirTodos.disabled = this.alunos.length === 0;
      if (this.elementos.btnPreviewAluno) this.elementos.btnPreviewAluno.disabled = (!this.elementos.previewNome || this.elementos.previewNome.textContent === "[NOME DO ALUNO]");
    },
    adicionarAluno() {
      let nome = this.elementos.inputNome.value.trim();
      if (!nome) { alert("🤖 Digite o nome do aluno(a) primeiro!"); return; }
      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();
      if (this.alunos.includes(nome)) { alert("⚠️ Este aluno já está na lista!"); return; }
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
        if (this.elementos.previewNome && this.elementos.previewNome.textContent === this.alunos[index]) this.elementos.previewNome.textContent = "[NOME DO ALUNO]";
        this.atualizarEstadoBotoes();
      }
    },
    selecionarAlunoPreview(nome) { if (this.elementos.previewNome) this.elementos.previewNome.textContent = nome; this.atualizarEstadoBotoes(); },
    atualizarLista() {
      const listaUl = this.elementos.listaAlunos;
      if (!listaUl) return;
      if (this.alunos.length === 0) { listaUl.innerHTML = '<li class="text-muted text-center">Nenhum aluno cadastrado ainda 🤖</li>'; if (this.elementos.contadorAlunos) this.elementos.contadorAlunos.textContent = "0"; return; }
      listaUl.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span><div class="btn-group gap-1"><button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button><button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button></div>`;
        listaUl.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach(btn => { btn.addEventListener("click", () => { const nome = btn.getAttribute("data-nome"); if (nome) this.selecionarAlunoPreview(nome); }); });
      document.querySelectorAll(".btn-remover-aluno").forEach(btn => { btn.addEventListener("click", () => { const idx = parseInt(btn.getAttribute("data-index")); if (!isNaN(idx)) this.removerAluno(idx); }); });
      if (this.elementos.contadorAlunos) this.elementos.contadorAlunos.textContent = this.alunos.length;
    },
    gerarCertificadoUnico(nomeAluno) {
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const html = this._gerarHtmlCertificado(nomeAluno, dataAtual);
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) { win.document.write(html); win.document.close(); } else alert("⚠️ Permita pop-ups para visualizar/ imprimir o certificado.");
    },
    _gerarHtmlCertificado(nome, data) {
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title><style>body{font-family:'Courier New',monospace;background:#e0e0e0;display:flex;justify-content:center;align-items:center;padding:40px;}.certificado{border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:30px;text-align:center;background:#fffef7;max-width:800px;}.certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;}.nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}@media print{.btn-print{display:none;}}</style></head><body><div class="certificado"><h3>🏆 CERTIFICADO DE MESTRE DA DEPURAÇÃO - NÍVEL 3</h3><p>Certificamos que</p><strong class="nome">${this.escapeHtml(nome)}</strong><p>concluiu com êxito o <strong>3º BIMESTRE - DETETIVES DE BUGS</strong><br>🔍 LOOP NANICO | 🦍 LOOP GIGANTE | 🧟 LOOP ZUMBI | 🐛 DEPURAÇÃO</p><hr><p>RobôMestres do Paraná • ${data}</p><p>"Errar não é vergonha -- é PISTA. Depurar é DIVINO."</p><div>🤖 Ass: Detetive Bugs</div><button class="btn-print" onclick="window.print()" style="margin-top:20px;background:#ffb347;border:none;border-radius:40px;padding:8px 20px;">🖨️ IMPRIMIR</button></div></body></html>`;
    },
    imprimirTodosCertificados() {
      if (this.alunos.length === 0) { alert("🤖 Nenhum aluno cadastrado!"); return; }
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      let cardsHTML = "";
      this.alunos.forEach(aluno => {
        cardsHTML += `<div class="certificado-impressao" style="border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:20px;text-align:center;background:#fffef7;break-inside:avoid;"><h3 style="color:#ffb347;font-size:0.8rem;">🏆 CERTIFICADO DE MESTRE DA DEPURAÇÃO</h3><p>Certificamos que</p><strong style="font-size:1rem;display:block;background:#fff0cc;padding:8px;border-radius:40px;">${this.escapeHtml(aluno)}</strong><p>concluiu o <strong>3º BIMESTRE - DETETIVES DE BUGS</strong></p><hr><p>RobôMestres do Paraná • ${dataAtual}</p><p style="font-size:0.7rem;">"Errar não é vergonha -- é PISTA."</p></div>`;
      });
      const htmlLote = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados RobôMestres</title><style>.print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;}@media print{@page{size:A4;margin:0.8cm;}}</style></head><body><div class="print-grid">${cardsHTML}</div><script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200);};<\/script></body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) { win.document.write(htmlLote); win.document.close(); } else alert("⚠️ Permita pop-ups para gerar os certificados.");
    },
    previewAlunoSelecionado() {
      const nomeSelecionado = this.elementos.previewNome?.textContent || "";
      if (!nomeSelecionado || nomeSelecionado === "[NOME DO ALUNO]") { alert("⚠️ Selecione um aluno na lista primeiro!"); return; }
      this.gerarCertificadoUnico(nomeSelecionado);
    },
    configurarEventos() {
      if (this.elementos.btnAdicionar) this.elementos.btnAdicionar.addEventListener("click", () => this.adicionarAluno());
      if (this.elementos.inputNome) this.elementos.inputNome.addEventListener("keypress", (e) => { if (e.key === "Enter") this.adicionarAluno(); });
      if (this.elementos.btnImprimirTodos) this.elementos.btnImprimirTodos.addEventListener("click", () => this.imprimirTodosCertificados());
      if (this.elementos.btnPreviewAluno) this.elementos.btnPreviewAluno.addEventListener("click", () => this.previewAlunoSelecionado());
    },
    escapeHtml(texto) { return texto.replace(/[&<>]/g, function (m) { if (m === "&") return "&amp;"; if (m === "<") return "&lt;"; if (m === ">") return "&gt;"; return m; }); }
  };

  // --------------------------------------------------
  // 6. MÓDULO APRESENTAÇÃO (modelo_apresentacao_bimestre.js)
  // --------------------------------------------------
  const ApresentacaoModule = {
    init() {
      if (!document.getElementById("carta-abertura") && !document.querySelector(".carta-container")) return;
      this.efeitoDigitacaoCarta();
      console.log("🎭 [Apresentacao] Inicializado");
    },
    efeitoDigitacaoCarta() {
      const paragrafos = document.querySelectorAll(".carta-texto");
      paragrafos.forEach((p, idx) => {
        p.style.opacity = "0";
        p.style.transform = "translateY(10px)";
        p.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        setTimeout(() => { p.style.opacity = "1"; p.style.transform = "translateY(0)"; }, 200 + idx * 150);
      });
    }
  };

  // --------------------------------------------------
  // 7. MÓDULO FECHAMENTO (modelo_fechamento_bimestre.js) - resumido
  // Como o jogo Loop Dash foi substituído pelo B.U.G.S., mantemos apenas estrutura mínima
  const FechamentoModule = {
    init() { console.log("🎮 [Fechamento] Módulo carregado (jogo substituído por B.U.G.S.)"); }
  };

  // --------------------------------------------------
  // 8. JOGO B.U.G.S. (Batalha Ultra Geral de Supressão)
  // Criado com base na descrição do ano3_bimestre_3.docx
  // --------------------------------------------------
  const BugsGame = {
    bugs: [
      { id: 1, nome: "Loop Nanico", descricao: "O loop repete menos vezes do que devia. Corrija o número de repetições.", codigo: "repita 3 vezes { ande 1; vire 90° } // deveria desenhar quadrado", correcao: "repita 4 vezes", tipo: "nanico", pontos: 10 },
      { id: 2, nome: "Loop Gigante", descricao: "Loop repete mais vezes do que necessário. Reduza a quantidade.", codigo: "repita 100 vezes { penteie cabelo } // só precisa pentear 5 vezes", correcao: "repita 5 vezes", tipo: "gigante", pontos: 10 },
      { id: 3, nome: "Loop Zumbi", descricao: "Loop infinito! Nunca termina. Adicione uma condição de parada.", codigo: "repita até x = 10 { x = x - 1 } // x começa em 0", correcao: "x = x + 1", tipo: "zumbi", pontos: 15 },
      { id: 4, nome: "Variável Errada", descricao: "A variável está sendo modificada de forma errada.", codigo: "soma = 0; contador = 1; repita 5 vezes { soma = soma + contador; contador = contador - 1 }", correcao: "contador = contador + 1", tipo: "variavel", pontos: 10 },
      { id: 5, nome: "Ordem Trocada", descricao: "Os comandos estão na ordem errada.", codigo: "vire direita; ande 1; vire esquerda // para desenhar escada", correcao: "ande 1; vire direita; ande 1; vire esquerda", tipo: "ordem", pontos: 10 }
    ],
    bugsResolvidos: [],
    pontuacao: 0,
    ranking: [],
    init() {
      this.carregarRanking();
      this.renderizarBugs();
      this.atualizarStats();
      document.getElementById("btnResetBugsGame")?.addEventListener("click", () => this.resetarProgresso());
      console.log("🐛 [B.U.G.S.] Jogo inicializado");
    },
    renderizarBugs() {
      const container = document.getElementById("bugsGrid");
      if (!container) return;
      container.innerHTML = "";
      this.bugs.forEach(bug => {
        const resolvido = this.bugsResolvidos.includes(bug.id);
        const card = document.createElement("div");
        card.className = "bug-card";
        card.innerHTML = `
          <h4>🐛 ${bug.nome}</h4>
          <p>${bug.descricao}</p>
          <div class="bug-code"><code>${bug.codigo}</code></div>
          <div class="bug-buttons">
            ${!resolvido ? `<button class="btn-bug success" data-id="${bug.id}" data-correcao="${this.escapeHtml(bug.correcao)}">🔧 DEPURAR</button>` : `<span class="badge bg-success">✅ RESOLVIDO +${bug.pontos}</span>`}
          </div>
        `;
        container.appendChild(card);
      });
      document.querySelectorAll(".btn-bug.success").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const id = parseInt(btn.getAttribute("data-id"));
          const correcao = btn.getAttribute("data-correcao");
          this.depurarBug(id, correcao);
        });
      });
    },
    depurarBug(id, correcaoEsperada) {
      const bug = this.bugs.find(b => b.id === id);
      if (!bug) return;
      const resposta = prompt(`Digite a correção para o bug "${bug.nome}":\n\nCódigo atual:\n${bug.codigo}\n\nSua correção:`);
      if (!resposta) return;
      if (resposta.trim().toLowerCase() === correcaoEsperada.toLowerCase()) {
        if (!this.bugsResolvidos.includes(id)) {
          this.bugsResolvidos.push(id);
          this.pontuacao += bug.pontos;
          this.atualizarStats();
          this.renderizarBugs();
          this.dispararEvento("robo:bug", { incremento: 0 }); // não incrementa contador, só registra
          this.mostrarMensagem(`✅ CORRETO! +${bug.pontos} pontos!`, "success");
          if (this.bugsResolvidos.length === this.bugs.length) {
            this.mostrarMensagem("🎉 PARABÉNS! Você exterminou todos os bugs! Você é um MESTRE DA DEPURAÇÃO! 🎉", "success");
            this.salvarRanking();
          }
        } else {
          this.mostrarMensagem("⚠️ Este bug já foi resolvido!", "warning");
        }
      } else {
        this.mostrarMensagem(`❌ Resposta incorreta! A correção era: ${correcaoEsperada}`, "error");
        this.dispararEvento("robo:bug", { incremento: 1, mensagem: `Erro ao depurar ${bug.nome}` });
      }
    },
    atualizarStats() {
      document.getElementById("bugsPontuacao") && (document.getElementById("bugsPontuacao").innerText = this.pontuacao);
      document.getElementById("bugsResolvidos") && (document.getElementById("bugsResolvidos").innerText = `${this.bugsResolvidos.length}/${this.bugs.length}`);
      const media = this.bugsResolvidos.length === 0 ? 0 : (this.pontuacao / this.bugsResolvidos.length).toFixed(1);
      document.getElementById("bugsMedia") && (document.getElementById("bugsMedia").innerText = media);
    },
    resetarProgresso() {
      if (confirm("⚠️ Isso irá zerar toda sua pontuação e progresso no jogo. Deseja continuar?")) {
        this.bugsResolvidos = [];
        this.pontuacao = 0;
        this.atualizarStats();
        this.renderizarBugs();
        this.mostrarMensagem("🔄 Progresso resetado! Recomece a caça aos bugs!", "info");
        this.dispararEvento("robo:resetBugs");
      }
    },
    carregarRanking() {
      try {
        const saved = localStorage.getItem("bugsGame_ranking");
        if (saved) this.ranking = JSON.parse(saved);
      } catch (e) { }
    },
    salvarRanking() {
      const nome = prompt("Parabéns! Digite seu nome para entrar no ranking dos Mestres da Depuração:");
      if (nome) {
        this.ranking.push({ nome: nome, pontos: this.pontuacao, data: new Date().toLocaleDateString() });
        this.ranking.sort((a, b) => b.pontos - a.pontos);
        this.ranking = this.ranking.slice(0, 5);
        localStorage.setItem("bugsGame_ranking", JSON.stringify(this.ranking));
        this.mostrarRanking();
      }
    },
    mostrarRanking() {
      let msg = "🏆 RANKING DOS MESTRES DA DEPURAÇÃO 🏆\n";
      this.ranking.forEach((r, idx) => { msg += `${idx + 1}. ${r.nome} - ${r.pontos} pontos (${r.data})\n`; });
      alert(msg);
    },
    mostrarMensagem(texto, tipo) {
      const msgDiv = document.getElementById("bugsMensagem");
      if (msgDiv) {
        msgDiv.innerHTML = `<i class="bi bi-robot"></i> ${texto}`;
        msgDiv.className = `mensagem-jogo ${tipo === "error" ? "erro" : tipo === "success" ? "sucesso" : ""}`;
        setTimeout(() => { if (msgDiv) msgDiv.className = "mensagem-jogo"; }, 4000);
      } else { alert(texto); }
    },
    escapeHtml(str) { return str.replace(/[&<>]/g, function (m) { if (m === "&") return "&amp;"; if (m === "<") return "&lt;"; if (m === ">") return "&gt;"; return m; }); },
    dispararEvento(nome, detalhes) { window.dispatchEvent(new CustomEvent(nome, { detail: detalhes })); }
  };

  // --------------------------------------------------
  // INICIALIZAÇÃO GERAL
  // --------------------------------------------------
  function initAll() {
    CabecalhoModule.init();
    MenuModule.init();
    PlanosAulaModule.init();
    RodapeModule.init();
    CertificadoModule.init();
    ApresentacaoModule.init();
    FechamentoModule.init();
    BugsGame.init();
    console.log("🚀 Todos os módulos inicializados para a3bim3.html");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAll);
  else initAll();

  // Expor módulos globalmente
  window.CabecalhoModule = CabecalhoModule;
  window.RodapeModule = RodapeModule;
  window.CertificadoModule = CertificadoModule;
  window.BugsGame = BugsGame;
})();

// ==================================================
// semana21.js – JavaScript para a Semana 21
// Gerencia o checkbox de conclusão e armazenamento local
// ==================================================
(function() {
  const STORAGE_KEY = "semana21_concluida";
  const checkbox = document.querySelector(".semana-check[data-semana='21']");
  const barraProgresso = document.getElementById("barraProgresso");

  function carregarEstado() {
    if (!checkbox) return;
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo === "true") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    atualizarBarra();
  }

  function salvarEstado() {
    if (!checkbox) return;
    localStorage.setItem(STORAGE_KEY, checkbox.checked);
    atualizarBarra();
    if (checkbox.checked) {
      mostrarToast("✅ Semana 21 concluída! Parabéns, detetive!", "success");
    } else {
      mostrarToast("⏳ Semana 21 reaberta. Continue a caça aos bugs!", "info");
    }
  }

  function atualizarBarra() {
    if (!barraProgresso) return;
    const concluida = checkbox ? checkbox.checked : false;
    const percentual = concluida ? 100 : 0;
    barraProgresso.style.width = percentual + "%";
    barraProgresso.setAttribute("aria-valuenow", concluida ? 1 : 0);
    barraProgresso.textContent = percentual + "%";
    const textoProgresso = document.getElementById("progressoTexto");
    if (textoProgresso) textoProgresso.textContent = concluida ? "1/1" : "0/1";
  }

  function mostrarToast(mensagem, tipo) {
    let toastContainer = document.querySelector(".toast-container-custom");
    if (!toastContainer) {
      toastContainer = document.createElement("div");
      toastContainer.className = "toast-container-custom";
      toastContainer.style.cssText = "position:fixed; bottom:20px; right:20px; z-index:9999;";
      document.body.appendChild(toastContainer);
    }
    const toastId = "toast_" + Date.now();
    const bgColor = tipo === "success" ? "#2ecc71" : "#3498db";
    const html = `<div id="${toastId}" style="background:#1e2a1a; border-left:4px solid ${bgColor}; border-radius:12px; padding:12px 20px; margin-bottom:10px; color:#e9f5db; box-shadow:0 4px 15px rgba(0,0,0,0.3); display:flex; align-items:center; gap:10px;"><i class="bi ${tipo === "success" ? "bi-check-circle-fill" : "bi-info-circle-fill"}" style="color:${bgColor};"></i><span>${mensagem}</span></div>`;
    toastContainer.insertAdjacentHTML("beforeend", html);
    setTimeout(() => {
      const toast = document.getElementById(toastId);
      if (toast) toast.remove();
    }, 3000);
  }

  if (checkbox) {
    checkbox.addEventListener("change", salvarEstado);
    carregarEstado();
  }
  console.log("🐞 [Semana21] Pronto! Lupa e checklist ativados.");
})();
