// ==================================================
// a2index.js – Módulo completo para o 2º ANO
// Gerencia: cabeçalho, menu, rodapé e certificado
// ==================================================

(function () {
  "use strict";

  // ---------- CABEÇALHO ----------
  const CabecalhoModule = {
    contadorBugs: 0,
    init() {
      console.log("%c🤖 [CABEÇALHO] 2º ano ativo", "color: #ffb347;");
      this.contadorBugs = parseInt(
        localStorage.getItem("cabecalho_contador_bugs") || "0",
        10,
      );
      this.atualizarDisplay();
      document.addEventListener("robo:bug", (e) => {
        this.incrementarBugs(e.detail?.incremento || 1);
      });
    },
    atualizarDisplay() {
      const el = document.querySelector(".relatorio-bugs");
      if (el) el.innerText = this.contadorBugs;
    },
    incrementarBugs(valor) {
      this.contadorBugs += valor;
      localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs);
      this.atualizarDisplay();
    },
  };

  // ---------- MENU (destacar página atual) ----------
  const MenuModule = {
    init() {
      const current = window.location.pathname.split("/").pop();
      document
        .querySelectorAll(".menu-robomestre .nav-link")
        .forEach((link) => {
          if (link.getAttribute("href") === current)
            link.classList.add("active");
        });
      console.log("📡 Menu bimestral ativo");
    },
  };

  // ---------- RODAPÉ ----------
  const RodapeModule = {
    init() {
      this.sincronizar();
      document.addEventListener("robo:bug", () => this.sincronizar());
    },
    sincronizar() {
      const bugs = localStorage.getItem("cabecalho_contador_bugs") || "0";
      const relatorio = document.querySelector(".relatorio-bugs");
      if (relatorio) relatorio.innerText = bugs;
    },
  };

  // ---------- CERTIFICADO (adaptado do modelo_certificado.js para o 2º ano) ----------

  const CertificadoModule = {
    alunos: [],
    STORAGE_KEY: "robozada_certificados_ano2",
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
      this.carregarAlunos();
      this.atualizarLista();
      this.configurarEventos();
      this.atualizarPreviewData();
      console.log("🎓 [Certificado 2º ano] Pronto!");
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
    carregarAlunos() {
      const salvos = localStorage.getItem(this.STORAGE_KEY);
      if (salvos) this.alunos = JSON.parse(salvos);
      if (!this.alunos || this.alunos.length === 0)
        this.alunos = [
          "ANA BEATRIZ SANTOS",
          "LUCAS MARTINS FERREIRA",
          "MARIA CLARA SILVA",
        ];
      this.salvarAlunos();
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
      if (!nome) return alert("🤖 Digite o nome do aluno!");
      nome = nome.toUpperCase().replace(/\s+/g, " ").trim();
      if (this.alunos.includes(nome)) return alert("⚠️ Aluno já cadastrado!");
      this.alunos.push(nome);
      this.salvarAlunos();
      this.atualizarLista();
      this.elementos.inputNome.value = "";
      this.elementos.inputNome.focus();
    },
    removerAluno(index) {
      if (confirm(`Remover ${this.alunos[index]}?`)) {
        const nomeRemovido = this.alunos[index];
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
    selecionarPreview(nome) {
      if (this.elementos.previewNome) {
        this.elementos.previewNome.textContent = nome;
      }
      this.atualizarEstadoBotoes();
    },
    atualizarLista() {
      const ul = this.elementos.listaAlunos;
      if (!ul) return;
      if (this.alunos.length === 0) {
        ul.innerHTML =
          '<li class="text-muted text-center">Nenhum aluno cadastrado 🤖</li>';
        if (this.elementos.contadorAlunos)
          this.elementos.contadorAlunos.textContent = "0";
        this.atualizarEstadoBotoes();
        return;
      }
      ul.innerHTML = "";
      this.alunos.forEach((aluno, idx) => {
        const li = document.createElement("li");
        li.className = "d-flex justify-content-between align-items-center";
        li.innerHTML = `<span><i class="bi bi-robot"></i> ${this.escapeHtml(aluno)}</span>
                      <div class="btn-group gap-1">
                        <button class="btn-selecionar-aluno btn btn-sm btn-outline-warning" data-nome="${this.escapeHtml(aluno)}"><i class="bi bi-eye"></i></button>
                        <button class="btn-remover-aluno btn btn-sm btn-danger" data-index="${idx}"><i class="bi bi-trash"></i></button>
                      </div>`;
        ul.appendChild(li);
      });
      document.querySelectorAll(".btn-selecionar-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleSelect);
        this._handleSelect = () =>
          this.selecionarPreview(btn.getAttribute("data-nome"));
        btn.addEventListener("click", this._handleSelect);
      });
      document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
        btn.removeEventListener("click", this._handleRemove);
        this._handleRemove = () =>
          this.removerAluno(parseInt(btn.getAttribute("data-index")));
        btn.addEventListener("click", this._handleRemove);
      });
      if (this.elementos.contadorAlunos)
        this.elementos.contadorAlunos.textContent = this.alunos.length;
      this.atualizarEstadoBotoes();
    },
    atualizarEstadoBotoes() {
      const hasAlunos = this.alunos.length > 0;
      if (this.elementos.btnImprimirTodos)
        this.elementos.btnImprimirTodos.disabled = !hasAlunos;
      if (this.elementos.btnPreviewAluno) {
        const nomePreview = this.elementos.previewNome
          ? this.elementos.previewNome.textContent
          : "";
        const isAlunoValido =
          nomePreview &&
          nomePreview !== "[NOME DO ALUNO]" &&
          this.alunos.includes(nomePreview);
        this.elementos.btnPreviewAluno.disabled = !isAlunoValido;
      }
    },
    gerarCertificadoUnico(nome) {
      const data = new Date().toLocaleDateString("pt-BR");
      const html = `<!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Certificado - ${this.escapeHtml(nome)}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{background:#e0e0e0;display:flex;justify-content:center;align-items:center;min-height:100vh;font-family:'Courier New',monospace;padding:20px;}
      .container{max-width:800px;margin:0 auto;}
      .actions{text-align:center;margin-bottom:20px;}
      .btn{background:#ffb347;border:none;border-radius:40px;padding:10px 24px;font-weight:bold;cursor:pointer;margin:0 8px;}
      .certificado{border:3px solid #ffb347;border-radius:48px 24px 48px 24px;padding:30px;text-align:center;background:#fffef7;box-shadow:0 20px 40px rgba(0,0,0,0.2);}
      .certificado h3{color:#ffb347;font-family:'Press Start 2P',cursive;font-size:0.9rem;}
      .nome{font-size:22px;display:block;margin:15px 0;color:#2c5e1f;background:#fff0cc;padding:12px;border-radius:40px;}
      @media print{.actions{display:none;} @page{size:A4;margin:1.5cm;}}
    </style>
    </head>
    <body>
      <div class="container">
        <div class="actions"><button class="btn" onclick="window.print();">🖨️ IMPRIMIR</button><button class="btn" onclick="window.close();">✖️ FECHAR</button></div>
        <div class="certificado">
          <h3>🏆 CERTIFICADO DE MESTRE DO SE/ENTÃO/SENÃO</h3>
          <p>Certificamos que</p>
          <strong class="nome">${this.escapeHtml(nome)}</strong>
          <p>concluiu o <strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>🔁 SE→ENTÃO→SENÃO | 🎲 EVENTOS | 🧠 E/OU | 🐛 DEPURAÇÃO | 🤖 CIDADE DOS CONDICIONAIS</p>
          <hr><p>RobôMestres do Paraná • ${data}</p>
          <p style="font-size:11px;">"SE aprendeu, ENTÃO merece; SENÃO… tente de novo, mas se divertindo!"</p>
          <div>🤖 Ass: Robô Zé 3.0</div>
        </div>
      </div>
      <script>window.onbeforeprint = function() { document.body.style.printColorAdjust = "exact"; };<\/script>
    </body>
    </html>`;
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para visualizar o certificado.");
    },
    imprimirTodos() {
      if (this.alunos.length === 0) return alert("Nenhum aluno cadastrado!");
      const data = new Date().toLocaleDateString("pt-BR");
      let cards = "";
      this.alunos.forEach((aluno) => {
        cards += `<div class="certificado-impressao" style="border:3px solid #ffb347; border-radius:48px 24px 48px 24px; padding:20px; text-align:center; background:#fffef7; break-inside:avoid;">
        <h3 style="color:#ffb347; font-family:'Press Start 2P',cursive; font-size:0.7rem;">🏆 CERTIFICADO 2º ANO</h3>
        <p>Certificamos que</p>
        <strong style="display:block; margin:10px 0; color:#2c5e1f; background:#fff0cc; padding:6px; border-radius:40px;">${this.escapeHtml(aluno)}</strong>
        <p><strong>2º ANO - ROBÓTICA EDUCACIONAL</strong><br>SE/ENTÃO/SENÃO | EVENTOS | E/OU | DEPURAÇÃO</p>
        <hr><p>RobôMestres do Paraná • ${data}</p>
        <div>🤖 Ass: Robô Zé 3.0</div>
      </div>`;
      });
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificados 2º Ano</title>
    <style>.print-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;} @media print{@page{size:A4;margin:0.8cm;}}</style>
    </head><body><div class="print-grid">${cards}</div>
    <script>window.onload=function(){setTimeout(function(){window.print();setTimeout(function(){window.close();},500);},200);};<\/script>
    </body></html>`;
      const win = window.open("", "_blank", "width=1000,height=800");
      if (win) {
        win.document.write(html);
        win.document.close();
      } else alert("⚠️ Permita pop-ups para gerar os certificados.");
    },
    previewAluno() {
      if (!this.elementos.previewNome) {
        alert("Erro: elemento de pré-visualização não encontrado.");
        return;
      }
      const nome = this.elementos.previewNome.textContent;
      if (!nome || nome === "[NOME DO ALUNO]" || !this.alunos.includes(nome)) {
        alert(
          "Selecione um aluno da lista primeiro (clique no olho 👁️ ao lado do nome).",
        );
        return;
      }
      this.gerarCertificadoUnico(nome);
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
          this.imprimirTodos(),
        );
      if (this.elementos.btnPreviewAluno)
        this.elementos.btnPreviewAluno.addEventListener("click", () =>
          this.previewAluno(),
        );
    },
    escapeHtml(str) {
      return str.replace(
        /[&<>]/g,
        (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[m],
      );
    },
  };

  // ---------- INICIALIZAÇÃO GLOBAL ----------
  document.addEventListener("DOMContentLoaded", () => {
    CabecalhoModule.init();
    MenuModule.init();
    RodapeModule.init();
    CertificadoModule.init();
  });
})();
