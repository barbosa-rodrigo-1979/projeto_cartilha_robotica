// ==================================================
// CONSTRUTOR DE CONDICIONAIS - 2º ANO 4º BIMESTRE
// PARTE 1: CONFIGURAÇÕES E CONSTANTES
// ==================================================

const CONFIG = {
  gridSize: 6,
  niveis: [
    {
      id: 1,
      missao:
        "Faça o Robô <strong>ZIG</strong> chegar ao <strong>BAÚ</strong>!",
      dica: "💡 Use SE... ENTÃO... SENÃO com a condição correta",
      robo: {
        nome: "ZIG",
        personalidade: '"Sou teimoso, me programe direito!"',
        emoji: "🤖",
      },
      inicio: { linha: 0, coluna: 0 },
      destino: { linha: 5, coluna: 5 },
      obstaculos: [
        [2, 2],
        [3, 3],
        [1, 4],
      ],
      solucao: ["se", "verde", "entao", "andar", "senao", "parar"],
    },
    {
      id: 2,
      missao:
        "Faça o Robô <strong>PIP</strong> desviar do <strong>BURACO</strong>!",
      dica: "💡 Use SE... ENTÃO... SENÃO com E/OU para duas condições",
      robo: {
        nome: "PIP",
        personalidade: '"Sou medroso, me proteja!"',
        emoji: "🤖",
      },
      inicio: { linha: 0, coluna: 3 },
      destino: { linha: 5, coluna: 3 },
      obstaculos: [
        [2, 3],
        [3, 2],
        [3, 4],
      ],
      solucao: ["se", "buraco", "entao", "pular", "senao", "andar"],
    },
    {
      id: 3,
      missao:
        "Faça o Robô <strong>BIP</strong> passar pelo <strong>SEMÁFORO</strong>!",
      dica: "💡 Use SE... ENTÃO... SENÃO e REPITA para repetir ações",
      robo: {
        nome: "BIP",
        personalidade: '"Adoro repetir, sou um loop vivo!"',
        emoji: "🤖",
      },
      inicio: { linha: 0, coluna: 1 },
      destino: { linha: 5, coluna: 4 },
      obstaculos: [
        [1, 1],
        [2, 1],
        [3, 1],
        [4, 1],
      ],
      solucao: [
        "repita",
        "3",
        "se",
        "vermelho",
        "entao",
        "parar",
        "senao",
        "andar",
      ],
    },
    {
      id: 4,
      missao:
        "Faça o Robô <strong>ZAP</strong> coletar o <strong>TESOURO</strong>!",
      dica: "💡 Use condicionais aninhados: SE dentro de SE",
      robo: {
        nome: "ZAP",
        personalidade: '"Sou curioso, quero explorar tudo!"',
        emoji: "🤖",
      },
      inicio: { linha: 0, coluna: 0 },
      destino: { linha: 5, coluna: 0 },
      obstaculos: [
        [1, 0],
        [2, 0],
        [3, 1],
        [4, 1],
      ],
      solucao: [
        "se",
        "buraco",
        "entao",
        "se",
        "verde",
        "entao",
        "pular",
        "senao",
        "parar",
      ],
    },
    {
      id: 5,
      missao:
        "Faça o Robô <strong>BEEP</strong> vencer o <strong>LABIRINTO</strong>!",
      dica: "💡 Combine E, OU e REPITA para criar um programa poderoso",
      robo: {
        nome: "BEEP",
        personalidade: '"Sou inteligente, mas preciso de boas instruções!"',
        emoji: "🤖",
      },
      inicio: { linha: 0, coluna: 0 },
      destino: { linha: 5, coluna: 5 },
      obstaculos: [
        [1, 1],
        [1, 2],
        [2, 2],
        [3, 2],
        [3, 3],
        [4, 3],
      ],
      solucao: [
        "repita",
        "5",
        "se",
        "verde",
        "e",
        "buraco",
        "entao",
        "virar",
        "senao",
        "andar",
      ],
    },
  ],
  comandos: {
    se: "SE",
    entao: "ENTÃO",
    senao: "SENÃO",
    repita: "REPITA",
    verde: "🟢 VERDE",
    vermelho: "🔴 VERMELHO",
    buraco: "🕳️ BURACO",
    e: "E",
    ou: "OU",
    andar: "🚶 ANDAR",
    parar: "✋ PARAR",
    pular: "⬆️ PULAR",
    virar: "🔄 VIRAR",
  },
  acoesValidas: ["andar", "parar", "pular", "virar"],
  condicoesValidas: ["verde", "vermelho", "buraco"],
};
// ==================================================
// PARTE 2: ESTADO E DOM REFS
// ==================================================

// Estado do jogo
let state = {
  nivelAtual: 0,
  programa: [],
  posicaoRobo: { linha: 0, coluna: 0 },
  estrelas: 0,
  acertos: 0,
  bugs: 0,
  executando: false,
  historico: [],
  celulas: [],
};

// Referências DOM
let DOM = {};
// ==================================================
// PARTE 3: INICIALIZAÇÃO E EVENTOS
// ==================================================

function init() {
  console.log("🧩 Construtor de Condicionais - Iniciando...");

  // Capturar elementos DOM
  DOM = {
    gridContainer: document.getElementById("gridContainer"),
    roboTabuleiro: document.getElementById("roboTabuleiro"),
    destinoTabuleiro: document.getElementById("destinoTabuleiro"),
    obstaculoTabuleiro: document.getElementById("obstaculoTabuleiro"),
    missaoTexto: document.getElementById("missaoTexto"),
    missaoDica: document.getElementById("missaoDica"),
    roboNome: document.getElementById("roboNome"),
    roboPersonalidade: document.getElementById("roboPersonalidade"),
    linhaMontagem: document.getElementById("linhaMontagem"),
    estrelasJogo: document.getElementById("estrelasJogo"),
    nivelJogo: document.getElementById("nivelJogo"),
    contadorBugsJogo: document.getElementById("contadorBugsJogo"),
    contadorAcertosJogo: document.getElementById("contadorAcertosJogo"),
    historicoProgramas: document.getElementById("historicoProgramas"),
    btnExecutar: document.getElementById("btnExecutarPrograma"),
    btnLimpar: document.getElementById("btnLimparPrograma"),
    btnDica: document.getElementById("btnDicaPrograma"),
  };

  // Carregar estado salvo
  carregarEstado();

  // Configurar eventos
  configurarEventos();

  // Carregar nível
  carregarNivel(0);

  console.log("✅ Construtor de Condicionais - Pronto!");
}

function configurarEventos() {
  // Blocos de programa
  document.querySelectorAll(".bloco-programa").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state.executando) return;
      adicionarBloco(btn.dataset.tipo);
    });
  });

  // Botões principais
  DOM.btnExecutar.addEventListener("click", executarPrograma);
  DOM.btnLimpar.addEventListener("click", limparPrograma);
  DOM.btnDica.addEventListener("click", mostrarDica);

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !state.executando) executarPrograma();
    if ((e.key === "c" || e.key === "C") && !state.executando) limparPrograma();
    if (e.key === "Delete" || e.key === "Backspace") removerUltimoBloco();
  });
}
// ==================================================
// PARTE 4: GERENCIAMENTO DE NÍVEL E GRID
// ==================================================

function carregarNivel(index) {
  const nivel = CONFIG.niveis[index];
  if (!nivel) {
    // Fim do jogo!
    DOM.missaoTexto.innerHTML =
      "🎉 PARABÉNS! Você concluiu todos os níveis! 🎉";
    DOM.missaoDica.textContent = "🌟 Você é um Mestre dos Condicionais!";
    return;
  }

  state.nivelAtual = index;
  state.posicaoRobo = { ...nivel.inicio };
  state.programa = [];

  // Atualizar UI
  DOM.missaoTexto.innerHTML = nivel.missao;
  DOM.missaoDica.textContent = nivel.dica;
  DOM.roboNome.textContent = `${nivel.robo.emoji} ${nivel.robo.nome}`;
  DOM.roboPersonalidade.textContent = nivel.robo.personalidade;
  DOM.nivelJogo.textContent = index + 1;

  // Gerar grid
  gerarGrid(nivel);
  atualizarPosicoes();
  atualizarMontagem();
  atualizarEstatisticas();
}

function gerarGrid(nivel) {
  const grid = DOM.gridContainer;
  if (!grid) return;

  grid.innerHTML = "";
  state.celulas = [];

  for (let l = 0; l < CONFIG.gridSize; l++) {
    for (let c = 0; c < CONFIG.gridSize; c++) {
      const cell = document.createElement("div");
      cell.className = "grid-cell";
      cell.dataset.linha = l;
      cell.dataset.coluna = c;

      // Verificar se é obstáculo
      const isObstaculo = nivel.obstaculos.some(
        ([ol, oc]) => ol === l && oc === c,
      );
      if (isObstaculo) {
        cell.classList.add("obstaculo");
        cell.textContent = "🧱";
      }

      // Verificar se é destino
      if (nivel.destino.linha === l && nivel.destino.coluna === c) {
        cell.classList.add("destino");
      }

      // Verificar se é início
      if (nivel.inicio.linha === l && nivel.inicio.coluna === c) {
        cell.classList.add("caminho");
      }

      grid.appendChild(cell);
      state.celulas.push({ linha: l, coluna: c, element: cell });
    }
  }

  // Posicionar destino
  const destinoEl = DOM.destinoTabuleiro;
  if (destinoEl) {
    const cellSize = 100 / CONFIG.gridSize;
    destinoEl.style.left = `${nivel.destino.coluna * cellSize + cellSize / 2 - 20}%`;
    destinoEl.style.top = `${nivel.destino.linha * cellSize + cellSize / 2 - 20}%`;
  }

  // Posicionar obstáculos (ícone flutuante no primeiro obstáculo)
  if (nivel.obstaculos.length > 0) {
    const obsEl = DOM.obstaculoTabuleiro;
    if (obsEl) {
      const [ol, oc] = nivel.obstaculos[0];
      const cellSize = 100 / CONFIG.gridSize;
      obsEl.style.left = `${oc * cellSize + cellSize / 2 - 16}%`;
      obsEl.style.top = `${ol * cellSize + cellSize / 2 - 16}%`;
    }
  }
}
// ==================================================
// PARTE 5: POSIÇÃO DO ROBÔ
// ==================================================

function atualizarPosicoes() {
  const roboEl = DOM.roboTabuleiro;
  if (!roboEl) return;

  const cellSize = 100 / CONFIG.gridSize;
  const { linha, coluna } = state.posicaoRobo;

  roboEl.style.left = `${coluna * cellSize + cellSize / 2 - 24}%`;
  roboEl.style.top = `${linha * cellSize + cellSize / 2 - 24}%`;

  // Verificar se chegou ao destino
  const nivel = CONFIG.niveis[state.nivelAtual];
  if (
    nivel &&
    linha === nivel.destino.linha &&
    coluna === nivel.destino.coluna
  ) {
    // Chegou ao destino!
    state.estrelas += 3;
    state.acertos++;
    atualizarEstatisticas();

    // Efeito de vitória
    roboEl.style.animation = "roboPula 0.8s ease-in-out";
    setTimeout(() => {
      roboEl.style.animation = "";
      // Próximo nível após delay
      if (state.nivelAtual < CONFIG.niveis.length - 1) {
        setTimeout(() => {
          carregarNivel(state.nivelAtual + 1);
        }, 500);
      } else {
        DOM.missaoTexto.innerHTML =
          "🎉 PARABÉNS! Você é um Mestre dos Condicionais! 🎉";
        DOM.missaoDica.textContent = "🌟 Todos os níveis concluídos!";
      }
    }, 1000);
  }
}
// ==================================================
// PARTE 6: MONTAGEM DO PROGRAMA
// ==================================================

function adicionarBloco(tipo) {
  if (state.executando) return;

  const termo = CONFIG.comandos[tipo];
  if (!termo) return;

  // Validações semânticas
  if (state.programa.length === 0 && !["se", "repita"].includes(tipo)) {
    mostrarFeedback("⚠️ O programa deve começar com SE ou REPITA!", "erro");
    return;
  }

  // Verificar se é um número para REPITA
  if (tipo === "repita") {
    const num = prompt("Quantas vezes repetir? (1-9)", "3");
    if (num && !isNaN(num) && parseInt(num) > 0 && parseInt(num) <= 9) {
      state.programa.push({
        tipo: "repita",
        valor: parseInt(num),
        texto: `REPITA ${num}`,
      });
    } else {
      return;
    }
  } else {
    // Verificar se REPITA já está aberto
    const repitaAberto = state.programa.some(
      (b) => b.tipo === "repita" && !b.fechado,
    );
    if (repitaAberto && !["se", "entao", "senao", "e", "ou"].includes(tipo)) {
      mostrarFeedback("⚠️ Dentro de REPITA, use SE, ENTÃO ou SENÃO!", "erro");
      return;
    }

    state.programa.push({ tipo, texto: termo });
  }

  atualizarMontagem();
  mostrarFeedback(`➕ ${termo} adicionado`, "info");
}

function removerUltimoBloco() {
  if (state.executando || state.programa.length === 0) return;
  const removido = state.programa.pop();
  atualizarMontagem();
  mostrarFeedback(
    `🗑️ Removido: ${removido.texto || CONFIG.comandos[removido.tipo]}`,
    "info",
  );
}

function atualizarMontagem() {
  const linha = DOM.linhaMontagem;
  if (!linha) return;

  if (state.programa.length === 0) {
    linha.innerHTML =
      '<span class="placeholder-programa">⬅️ Clique nos blocos para montar seu programa</span>';
    return;
  }

  linha.innerHTML = state.programa
    .map((bloco, index) => {
      const texto = bloco.texto || CONFIG.comandos[bloco.tipo] || bloco.tipo;
      return `<span class="bloco-montado" data-index="${index}">
      ${texto}
      <button class="btn-remover-bloco" data-index="${index}" title="Remover">✕</button>
    </span>`;
    })
    .join("");

  // Eventos de remoção
  linha.querySelectorAll(".btn-remover-bloco").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      if (!isNaN(index) && index >= 0 && index < state.programa.length) {
        state.programa.splice(index, 1);
        atualizarMontagem();
      }
    });
  });
}
// ==================================================
// PARTE 7: INTERPRETADOR - AÇÕES
// ==================================================

function executarAcao(tipo, pos, nivel) {
  const novaPos = { ...pos };

  if (tipo === "andar") {
    novaPos.coluna = Math.min(novaPos.coluna + 1, CONFIG.gridSize - 1);
    const isObstaculo = nivel.obstaculos.some(
      ([ol, oc]) => ol === novaPos.linha && oc === novaPos.coluna,
    );
    if (isObstaculo) {
      return { pos: pos, parou: true, erro: "Bateu em um obstáculo!" };
    }
  } else if (tipo === "pular") {
    novaPos.coluna = Math.min(novaPos.coluna + 2, CONFIG.gridSize - 1);
    const isObstaculo = nivel.obstaculos.some(
      ([ol, oc]) => ol === novaPos.linha && oc === novaPos.coluna,
    );
    if (isObstaculo) {
      return { pos: pos, parou: true, erro: "Pulou em cima de um obstáculo!" };
    }
  } else if (tipo === "virar") {
    novaPos.linha = Math.min(novaPos.linha + 1, CONFIG.gridSize - 1);
    const isObstaculo = nivel.obstaculos.some(
      ([ol, oc]) => ol === novaPos.linha && oc === novaPos.coluna,
    );
    if (isObstaculo) {
      return { pos: pos, parou: true, erro: "Virou em um obstáculo!" };
    }
  } else if (tipo === "parar") {
    return { pos: novaPos };
  }

  if (novaPos.linha >= CONFIG.gridSize || novaPos.coluna >= CONFIG.gridSize) {
    return { pos: pos, parou: true, erro: "Saiu do grid!" };
  }

  return { pos: novaPos };
}
// ==================================================
// PARTE 8: INTERPRETADOR - PRINCIPAL
// ==================================================

function interpretarPrograma(programa, posicaoInicial) {
  const nivel = CONFIG.niveis[state.nivelAtual];
  let posAtual = { ...posicaoInicial };
  let i = 0;
  let passos = 0;
  const maxPassos = 50;

  while (i < programa.length && passos < maxPassos) {
    const bloco = programa[i];
    passos++;

    // REPITA
    if (bloco.tipo === "repita") {
      const repitaMax = bloco.valor || 3;
      let internos = [];
      let j = i + 1;
      let profundidade = 0;

      while (j < programa.length) {
        if (programa[j].tipo === "repita") profundidade++;
        if (programa[j].tipo === "fim_repita") {
          if (profundidade === 0) break;
          profundidade--;
        }
        internos.push(programa[j]);
        j++;
      }

      for (let r = 0; r < repitaMax; r++) {
        const resultado = interpretarInterno(internos, posAtual);
        posAtual = resultado.pos;
        if (resultado.parou) return { pos: posAtual, parou: true };
        if (resultado.sucesso)
          return { pos: posAtual, parou: true, sucesso: true };
      }

      i = j + 1;
      continue;
    }

    // SE
    if (bloco.tipo === "se") {
      // Encontrar ENTÃO e SENÃO
      let entaoIndex = -1;
      let senaoIndex = -1;
      let profundidade = 0;

      for (let k = i + 1; k < programa.length; k++) {
        if (programa[k].tipo === "se") profundidade++;
        if (programa[k].tipo === "entao" && profundidade === 0) {
          entaoIndex = k;
          break;
        }
        if (programa[k].tipo === "senao" && profundidade === 0) {
          senaoIndex = k;
          break;
        }
      }

      if (entaoIndex === -1) {
        return { pos: posAtual, erro: "SE sem ENTÃO", parou: true };
      }

      // Avaliar condição
      let condicao = null;
      let operador = null;
      let condicao2 = null;

      let k = i + 1;
      if (
        k < programa.length &&
        CONFIG.condicoesValidas.includes(programa[k].tipo)
      ) {
        condicao = programa[k].tipo;
        k++;

        if (
          k < programa.length &&
          (programa[k].tipo === "e" || programa[k].tipo === "ou")
        ) {
          operador = programa[k].tipo;
          k++;
          if (
            k < programa.length &&
            CONFIG.condicoesValidas.includes(programa[k].tipo)
          ) {
            condicao2 = programa[k].tipo;
          }
        }
      }

      // Determinar se condição é verdadeira
      let condicaoVerdadeira = avaliarCondicao(condicao, posAtual, nivel);

      // Aplicar operador E/OU
      if (condicao2 !== null && operador) {
        let condicao2Verdadeira = avaliarCondicao(condicao2, posAtual, nivel);
        if (operador === "e") {
          condicaoVerdadeira = condicaoVerdadeira && condicao2Verdadeira;
        } else if (operador === "ou") {
          condicaoVerdadeira = condicaoVerdadeira || condicao2Verdadeira;
        }
      }

      // Executar ENTÃO ou SENÃO
      if (condicaoVerdadeira) {
        i = entaoIndex + 1;
        while (
          i < programa.length &&
          programa[i].tipo !== "senao" &&
          programa[i].tipo !== "se"
        ) {
          const resultado = executarAcao(programa[i].tipo, posAtual, nivel);
          posAtual = resultado.pos;
          if (resultado.parou) return { pos: posAtual, parou: true };
          if (
            posAtual.linha === nivel.destino.linha &&
            posAtual.coluna === nivel.destino.coluna
          ) {
            return { pos: posAtual, parou: true, sucesso: true };
          }
          i++;
        }
        if (senaoIndex !== -1) {
          i = senaoIndex + 1;
          while (i < programa.length && programa[i].tipo !== "se") {
            i++;
          }
        } else {
          i = entaoIndex + 1;
        }
      } else {
        if (senaoIndex !== -1) {
          i = senaoIndex + 1;
          while (i < programa.length && programa[i].tipo !== "se") {
            const resultado = executarAcao(programa[i].tipo, posAtual, nivel);
            posAtual = resultado.pos;
            if (resultado.parou) return { pos: posAtual, parou: true };
            i++;
          }
        } else {
          i = entaoIndex + 1;
        }
      }
      continue;
    }

    // Ação direta
    const resultado = executarAcao(bloco.tipo, posAtual, nivel);
    posAtual = resultado.pos;
    if (resultado.parou) return { pos: posAtual, parou: true };
    if (
      posAtual.linha === nivel.destino.linha &&
      posAtual.coluna === nivel.destino.coluna
    ) {
      return { pos: posAtual, parou: true, sucesso: true };
    }

    i++;
  }

  return { pos: posAtual, parou: passos >= maxPassos };
}

function interpretarInterno(programa, pos) {
  const nivel = CONFIG.niveis[state.nivelAtual];
  let posAtual = { ...pos };

  for (let i = 0; i < programa.length; i++) {
    const bloco = programa[i];
    if (bloco.tipo === "se") continue;

    const resultado = executarAcao(bloco.tipo, posAtual, nivel);
    posAtual = resultado.pos;
    if (resultado.parou) return { pos: posAtual, parou: true };
    if (
      posAtual.linha === nivel.destino.linha &&
      posAtual.coluna === nivel.destino.coluna
    ) {
      return { pos: posAtual, parou: true, sucesso: true };
    }
  }
  return { pos: posAtual };
}
// ==================================================
// PARTE 9: AVALIAÇÃO DE CONDIÇÕES E VALIDAÇÃO
// ==================================================

function avaliarCondicao(condicao, pos, nivel) {
  if (condicao === "verde") {
    const proxima = { linha: pos.linha, coluna: pos.coluna + 1 };
    const isObstaculo = nivel.obstaculos.some(
      ([ol, oc]) => ol === proxima.linha && oc === proxima.coluna,
    );
    return !isObstaculo && proxima.coluna < CONFIG.gridSize;
  } else if (condicao === "vermelho" || condicao === "buraco") {
    const proxima = { linha: pos.linha, coluna: pos.coluna + 1 };
    const isObstaculo = nivel.obstaculos.some(
      ([ol, oc]) => ol === proxima.linha && oc === proxima.coluna,
    );
    return isObstaculo;
  }
  return false;
}

function validarPrograma(programa) {
  if (programa.length === 0) {
    return { valido: false, erro: "Programa vazio!" };
  }

  let profundidade = 0;
  let temSe = false;
  let temEntao = false;
  let temAcao = false;

  for (let i = 0; i < programa.length; i++) {
    const bloco = programa[i];

    if (bloco.tipo === "se") {
      temSe = true;
      profundidade++;
      if (i + 1 < programa.length) {
        const prox = programa[i + 1];
        if (!CONFIG.condicoesValidas.includes(prox.tipo)) {
          return {
            valido: false,
            erro: "Após SE, deve vir uma condição (VERDE, VERMELHO, BURACO)",
          };
        }
      } else {
        return { valido: false, erro: "SE sem condição!" };
      }
    }

    if (bloco.tipo === "entao") {
      temEntao = true;
      if (profundidade === 0) {
        return { valido: false, erro: "ENTÃO sem SE correspondente!" };
      }
      if (i + 1 < programa.length) {
        const prox = programa[i + 1];
        if (!CONFIG.acoesValidas.includes(prox.tipo) && prox.tipo !== "se") {
          return {
            valido: false,
            erro: "Após ENTÃO, deve vir uma ação (ANDAR, PARAR, PULAR, VIRAR) ou SE",
          };
        }
      } else {
        return { valido: false, erro: "ENTÃO sem ação!" };
      }
    }

    if (bloco.tipo === "senao") {
      if (profundidade === 0) {
        return { valido: false, erro: "SENÃO sem SE correspondente!" };
      }
      if (i + 1 < programa.length) {
        const prox = programa[i + 1];
        if (!CONFIG.acoesValidas.includes(prox.tipo) && prox.tipo !== "se") {
          return {
            valido: false,
            erro: "Após SENÃO, deve vir uma ação (ANDAR, PARAR, PULAR, VIRAR) ou SE",
          };
        }
      } else {
        return { valido: false, erro: "SENÃO sem ação!" };
      }
    }

    if (CONFIG.acoesValidas.includes(bloco.tipo)) {
      temAcao = true;
    }

    if (bloco.tipo === "repita") {
      if (!bloco.valor || bloco.valor < 1 || bloco.valor > 9) {
        return {
          valido: false,
          erro: "REPITA deve ter um número entre 1 e 9!",
        };
      }
    }
  }

  if (!temSe) {
    return { valido: false, erro: "Programa deve conter pelo menos um SE!" };
  }
  if (!temEntao) {
    return { valido: false, erro: "Programa deve conter um ENTÃO!" };
  }
  if (!temAcao) {
    return { valido: false, erro: "Programa deve conter pelo menos uma ação!" };
  }

  return { valido: true };
}
// ==================================================
// PARTE 10: EXECUÇÃO DO PROGRAMA
// ==================================================

function executarPrograma() {
  if (state.executando) return;
  if (state.programa.length === 0) {
    mostrarFeedback("⚠️ Monte um programa primeiro!", "erro");
    return;
  }

  state.executando = true;
  DOM.btnExecutar.disabled = true;

  // Validar programa
  const validacao = validarPrograma(state.programa);
  if (!validacao.valido) {
    mostrarFeedback(`❌ ${validacao.erro}`, "erro");
    state.bugs++;
    atualizarEstatisticas();
    state.executando = false;
    DOM.btnExecutar.disabled = false;
    return;
  }

  // Executar
  const nivel = CONFIG.niveis[state.nivelAtual];
  const resultado = interpretarPrograma(state.programa, state.posicaoRobo);
  const novaPos = resultado.pos;

  // Atualizar posição do robô
  state.posicaoRobo = { ...novaPos };
  atualizarPosicoes();

  // Verificar resultado
  const chegou =
    novaPos.linha === nivel.destino.linha &&
    novaPos.coluna === nivel.destino.coluna;
  const acertou = chegou;

  // Registrar histórico
  const programaStr = state.programa
    .map((b) => b.texto || CONFIG.comandos[b.tipo])
    .join(" ");
  state.historico.unshift({ programa: programaStr, acertou });
  if (state.historico.length > 10) state.historico.pop();
  atualizarHistorico();

  if (acertou) {
    state.estrelas += 2;
    state.acertos++;
    mostrarFeedback("🎉 PARABÉNS! Programa executado com sucesso!", "sucesso");

    const roboEl = DOM.roboTabuleiro;
    roboEl.style.animation = "roboPula 0.8s ease-in-out";
    setTimeout(() => {
      roboEl.style.animation = "";
    }, 1000);

    // Avançar nível automaticamente
    setTimeout(() => {
      if (state.nivelAtual < CONFIG.niveis.length - 1) {
        carregarNivel(state.nivelAtual + 1);
      } else {
        DOM.missaoTexto.innerHTML =
          "🎉 PARABÉNS! Você é um Mestre dos Condicionais! 🎉";
        DOM.missaoDica.textContent = "🌟 Todos os níveis concluídos!";
      }
    }, 1500);
  } else {
    state.bugs++;
    mostrarFeedback(
      `❌ O robô não chegou ao destino! ${resultado.erro || "Tente novamente."}`,
      "erro",
    );

    const roboEl = DOM.roboTabuleiro;
    roboEl.style.animation = "travouRobo 0.5s ease-in-out 2";
    setTimeout(() => {
      roboEl.style.animation = "";
    }, 1000);
  }

  atualizarEstatisticas();
  state.executando = false;
  DOM.btnExecutar.disabled = false;
}
// ==================================================
// PARTE 11: UTILITÁRIOS
// ==================================================

function limparPrograma() {
  if (state.executando) return;
  state.programa = [];
  atualizarMontagem();
  mostrarFeedback("🧹 Programa limpo!", "info");
}

function mostrarDica() {
  const nivel = CONFIG.niveis[state.nivelAtual];
  if (!nivel) return;

  const dicas = [
    `💡 ${nivel.dica}`,
    "💡 SE + condição + ENTÃO + ação = programa básico",
    "💡 Adicione SENÃO para o caso contrário",
    "💡 Use E ou OU para combinar condições",
    "💡 REPITA faz o bloco interno se repetir N vezes",
    "💡 Condições: 🟢 VERDE, 🔴 VERMELHO, 🕳️ BURACO",
    "💡 Ações: 🚶 ANDAR, ✋ PARAR, ⬆️ PULAR, 🔄 VIRAR",
  ];

  const dica = dicas[Math.floor(Math.random() * dicas.length)];
  DOM.missaoDica.textContent = dica;
  mostrarFeedback(dica, "info");
}

function mostrarFeedback(msg, tipo) {
  const missaoDica = DOM.missaoDica;
  if (!missaoDica) return;

  missaoDica.textContent = msg;
  missaoDica.style.transition = "all 0.3s ease";

  if (tipo === "sucesso") {
    missaoDica.style.color = "#2ecc71";
  } else if (tipo === "erro") {
    missaoDica.style.color = "#e74c3c";
  } else {
    missaoDica.style.color = "#9bbc7b";
  }

  setTimeout(() => {
    const nivel = CONFIG.niveis[state.nivelAtual];
    if (nivel) {
      missaoDica.textContent = nivel.dica;
      missaoDica.style.color = "#9bbc7b";
    }
  }, 3000);
}
// ==================================================
// PARTE 12: ESTATÍSTICAS, HISTÓRICO E SALVAMENTO
// ==================================================

function atualizarEstatisticas() {
  DOM.estrelasJogo.textContent = state.estrelas;
  DOM.contadorBugsJogo.textContent = state.bugs;
  DOM.contadorAcertosJogo.textContent = state.acertos;
  salvarEstado();
}

function atualizarHistorico() {
  const container = DOM.historicoProgramas;
  if (!container) return;

  if (state.historico.length === 0) {
    container.innerHTML =
      '<span style="font-size:0.6rem;color:#5a6a5a;">Nenhum programa executado</span>';
    return;
  }

  container.innerHTML = state.historico
    .map((item) => {
      const texto =
        item.programa.length > 30
          ? item.programa.substring(0, 30) + "…"
          : item.programa;
      return `<span class="historico-item-programa ${item.acertou ? "acertou" : "errou"}">
      ${item.acertou ? "✅" : "❌"} ${texto}
    </span>`;
    })
    .join("");
}

function salvarEstado() {
  try {
    const data = {
      nivelAtual: state.nivelAtual,
      estrelas: state.estrelas,
      acertos: state.acertos,
      bugs: state.bugs,
      historico: state.historico.slice(0, 10),
    };
    localStorage.setItem(
      "construtor_condicionais_2ano_bim4",
      JSON.stringify(data),
    );
  } catch {}
}

function carregarEstado() {
  try {
    const salvo = localStorage.getItem("construtor_condicionais_2ano_bim4");
    if (salvo) {
      const data = JSON.parse(salvo);
      state.nivelAtual = data.nivelAtual || 0;
      state.estrelas = data.estrelas || 0;
      state.acertos = data.acertos || 0;
      state.bugs = data.bugs || 0;
      state.historico = data.historico || [];
    }
  } catch {}
}
// ==================================================
// PARTE 13: INICIALIZAÇÃO FINAL
// ==================================================

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  init();
});
