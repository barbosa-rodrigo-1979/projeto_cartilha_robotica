(function () {
  let alunos = [];
  const inputNome = document.getElementById("nomeAluno");
  const btnAdicionar = document.getElementById("btnAdicionar");
  const listaAlunos = document.getElementById("listaAlunos");
  const contadorSpan = document.getElementById("contadorAlunos");
  const btnImprimir = document.getElementById("btnImprimirCertificados");
  const btnPreview = document.getElementById("btnPreviewAluno");
  const previewNome = document.getElementById("previewNomeAluno");
  const previewData = document.getElementById("previewData");
  const dataAtual = new Date().getFullYear();
  if (previewData) previewData.innerText = dataAtual;

  function escapeHtml(texto) {
    if (!texto) return "";
    return texto
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function atualizarLista() {
    if (!listaAlunos) return;
    listaAlunos.innerHTML = "";
    alunos.forEach((aluno, index) => {
      const li = document.createElement("li");
      li.className = "d-flex justify-content-between align-items-center";
      li.innerHTML = `<span><i class="bi bi-robot"></i> ${escapeHtml(
        aluno,
      )}</span><button class="btn-remover-aluno" data-index="${index}"><i class="bi bi-trash3"></i> Remover</button>`;
      listaAlunos.appendChild(li);
    });
    if (contadorSpan) contadorSpan.innerText = alunos.length;
    const possuiAlunos = alunos.length > 0;
    if (btnImprimir) btnImprimir.disabled = !possuiAlunos;
    if (btnPreview) btnPreview.disabled = !possuiAlunos;

    document.querySelectorAll(".btn-remover-aluno").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const idx = parseInt(btn.getAttribute("data-index"), 10);
        if (!isNaN(idx)) {
          alunos.splice(idx, 1);
          atualizarLista();
          if (alunos.length === 0 && previewNome)
            previewNome.innerText = "[NOME DO ALUNO]";
          else if (alunos.length > 0 && previewNome)
            previewNome.innerText = alunos[0];
        }
      });
    });
  }

  function adicionarAluno() {
    if (!inputNome) return;
    let nome = inputNome.value.trim();
    if (nome === "") {
      alert("Digite o nome do aluno(a) antes de adicionar.");
      return;
    }
    if (alunos.some((a) => a.toLowerCase() === nome.toLowerCase())) {
      alert("Este aluno já está na lista!");
      return;
    }
    alunos.push(nome);
    atualizarLista();
    inputNome.value = "";
    inputNome.focus();
    if (previewNome) previewNome.innerText = nome;
  }

  function previewAluno() {
    if (!previewNome) return;
    if (alunos.length === 0) {
      previewNome.innerText = "[NOME DO ALUNO]";
      return;
    }
    previewNome.innerText = alunos[0];
  }

  function imprimirCertificados() {
    if (alunos.length === 0) {
      alert("Nenhum aluno cadastrado.");
      return;
    }
    const win = window.open("", "_blank");
    if (!win) {
      alert("Permita pop-ups para gerar a impressão.");
      return;
    }

    const estilos = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: white;
          font-family: 'Chakra Petch', 'Inter', monospace;
          padding: 0.5cm;
        }
        @page {
          size: A4;
          margin: 0.8cm;
        }
        .certificados-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
          page-break-inside: avoid;
        }
        .certificado-item {
          border: 2px solid #ffb347;
          border-radius: 16px;
          background: #fff9ef;
          padding: 1rem;
          text-align: center;
          break-inside: avoid;
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .certificado-item h3 {
          font-size: 1rem;
          color: #ff8c00;
          margin: 0 0 0.3rem;
          font-family: 'Press Start 2P', monospace;
        }
        .certificado-item p {
          font-size: 0.7rem;
          margin: 0.2rem 0;
        }
        .certificado-item strong.nome {
          font-size: 1rem;
          background: #fff0cc;
          display: inline-block;
          padding: 0.2rem 0.5rem;
          border-radius: 30px;
          margin: 0.2rem 0;
        }
        .linha {
          border-top: 1px dashed #ffb347;
          margin: 0.3rem 0;
        }
        .assinatura {
          font-size: 0.6rem;
          font-style: italic;
        }
        .badge-robotico {
          background: #ffb347;
          color: #2c5e1f;
          font-size: 0.6rem;
          border-radius: 20px;
          padding: 0.1rem 0.5rem;
          display: inline-block;
        }
        @media print {
          .certificados-grid {
            gap: 0.8rem;
          }
        }
      </style>
    `;

    let html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Certificados 2º Ano - RobôMestres</title>
      ${estilos}
    </head>
    <body>
      <div class="certificados-grid">
    `;

    alunos.forEach((aluno) => {
      html += `
        <div class="certificado-item">
          <h3>🤖 CERTIFICADO ROBÔMESTRES</h3>
          <p>Certificamos que</p>
          <strong class="nome">${escapeHtml(aluno)}</strong>
          <p>
            concluiu com êxito o <strong>2º ANO – ROBÓTICA EDUCACIONAL</strong><br />
            Dominando:<br />
            🔀 SE→ENTÃO→SENÃO<br />
            🎬 QUANDO<br />
            🔁 REPITA<br />
            🔍 E/OU<br />
            🤖 PROJETO AUTORAL
          </p>
          <div class="linha"></div>
          <p>RobôMestres do Paraná • ${dataAtual}</p>
          <p class="assinatura">"SE não chove, ENTÃO vamos programar; SENÃO, programamos do mesmo jeito!"</p>
          <div>
            <span class="badge-robotico">🔧 Ass: Robô Zé 2.0</span>
          </div>
        </div>
      `;
    });

    html += `
      </div>
    </body>
    </html>`;

    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  // Event listeners
  if (btnAdicionar) btnAdicionar.addEventListener("click", adicionarAluno);
  if (inputNome) {
    inputNome.addEventListener("keypress", (e) => {
      if (e.key === "Enter") adicionarAluno();
    });
  }
  if (btnImprimir) btnImprimir.addEventListener("click", imprimirCertificados);
  if (btnPreview) btnPreview.addEventListener("click", previewAluno);

  // Inicialização
  atualizarLista();
})();
