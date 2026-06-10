// ==================================================
// modelo_cabecalho.js - LÓGICA DO CABEÇALHO REBELDE
// Módulo específico para gerenciar o cabeçalho robótico
// ==================================================

(function () {
  "use strict";

  const CabecalhoModule = {
    // Estado
    contadorBugs: 0,
    inicializado: false,

    // Elementos DOM
    contadorElement: null,
    relatorioElement: null,

    /**
     * Inicializa o módulo do cabeçalho
     */
    init() {
      if (this.inicializado) return;

      this.contadorElement = document.getElementById("contadorBugsHeader");
      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.contadorElement) {
        // Inicializa contador com valor salvo ou 0
        this.contadorBugs = this.carregarContador();
        this.atualizarDisplayContador();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log("%c🤖 [CABEÇALHO] Módulo inicializado com sucesso", "color: #ffb347; font-size: 12px; font-weight: bold;");
    },

    /**
     * Carrega o contador do localStorage
     */
    carregarContador() {
      try {
        const salvo = localStorage.getItem("cabecalho_contador_bugs");
        return salvo ? parseInt(salvo) : 0;
      } catch (e) {
        return 0;
      }
    },

    /**
     * Salva o contador no localStorage
     */
    salvarContador() {
      try {
        localStorage.setItem("cabecalho_contador_bugs", this.contadorBugs.toString());
      } catch (e) {
        console.warn("[CABEÇALHO] Não foi possível salvar o contador", e);
      }
    },

    /**
     * Atualiza o display do contador na tela
     */
    atualizarDisplayContador() {
      if (this.contadorElement) {
        this.contadorElement.innerHTML = `🤯 ${this.contadorBugs}`;
      }
      if (this.relatorioElement) {
        this.relatorioElement.innerText = this.contadorBugs;
      }
    },

    /**
     * Incrementa o contador de bugs
     * @param {number} incremento - Quantidade a incrementar (padrão: 1)
     */
    incrementarBugs(incremento = 1) {
      this.contadorBugs += incremento;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarContador();
      return this.contadorBugs;
    },

    /**
     * Reseta o contador de bugs para 0
     */
    resetarBugs() {
      this.contadorBugs = 0;
      this.atualizarDisplayContador();
      this.salvarContador();
      this.animarReset();
      return this.contadorBugs;
    },

    /**
     * Obtém o valor atual do contador
     */
    getContadorBugs() {
      return this.contadorBugs;
    },

    /**
     * Anima o contador quando incrementado
     */
    animarContador() {
      if (this.contadorElement) {
        this.contadorElement.style.animation = "none";
        setTimeout(() => {
          if (this.contadorElement) {
            this.contadorElement.style.animation = "piscaLed 0.3s ease-in-out";
            setTimeout(() => {
              if (this.contadorElement) {
                this.contadorElement.style.animation = "";
              }
            }, 300);
          }
        }, 10);
      }
    },

    /**
     * Anima o reset do contador
     */
    animarReset() {
      const painel = document.querySelector(".painel-status-sucata");
      if (painel) {
        painel.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (painel) painel.style.animation = "";
        }, 300);
      }
    },

    /**
     * Atualiza a mensagem da linha de erro
     * @param {string} mensagem - Nova mensagem a exibir
     */
    atualizarMensagemErro(mensagem) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        linhaErro.innerHTML = `<i class="bi bi-terminal"></i> ${mensagem}`;
        // Anima a mensagem nova
        linhaErro.style.animation = "piscaLed 0.2s ease-in-out";
        setTimeout(() => {
          if (linhaErro) linhaErro.style.animation = "";
        }, 400);
      }
    },

    /**
     * Adiciona uma mensagem temporária no log de debug
     * @param {string} texto - Mensagem a adicionar
     */
    adicionarLogDebug(texto) {
      const linhaErro = document.querySelector(".linha-de-erro");
      if (linhaErro) {
        const htmlAtual = linhaErro.innerHTML;
        linhaErro.innerHTML = `${htmlAtual}<br><span style="font-size:0.65rem; opacity:0.7;">[DEBUG] ${texto}</span>`;
        // Scroll suave para o final
        linhaErro.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    },

    /**
     * Configura os eventos globais que o cabeçalho escuta
     */
    configurarEventos() {
      // Escuta evento de bug vindo de outros módulos (ex: jogo)
      document.addEventListener("robo:bug", (evento) => {
        const incremento = evento.detail?.incremento || 1;
        this.incrementarBugs(incremento);
        if (evento.detail?.mensagem) {
          this.adicionarLogDebug(evento.detail.mensagem);
        }
      });

      // Escuta evento de reset do jogo para resetar contador (opcional)
      document.addEventListener("robo:resetBugs", () => {
        this.resetarBugs();
        this.atualizarMensagemErro("[SISTEMA] Contador de bugs reiniciado! Preparem-se para novos erros! 🤖");
      });

      // Escuta evento de vitória (mensagem diferente)
      document.addEventListener("robo:vitoria", () => {
        this.adicionarLogDebug("🎉 Vitória registrada! Parabéns programadores!");
      });
    },

    /**
     * Adiciona um efeito visual de curto-circuito no cabeçalho
     */
    efeitoCurtoCircuito() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "curtoCircuito 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    },

    /**
     * Adiciona efeito de reboot no cabeçalho
     */
    efeitoReboot() {
      const cabecalho = document.querySelector(".cabecalho-robotico");
      if (cabecalho) {
        cabecalho.style.animation = "reboot 0.3s ease-in-out";
        setTimeout(() => {
          if (cabecalho) cabecalho.style.animation = "";
        }, 300);
      }
    }
  };

  // Registrar no ControladorRobomestres se existir
  if (typeof window.ControladorRobomestres !== "undefined" && window.ControladorRobomestres) {
    window.ControladorRobomestres.registrar("CabecalhoModule", CabecalhoModule);
  }

  // Fallback: expõe globalmente
  window.CabecalhoModule = CabecalhoModule;

  // Auto-inicializa se o controlador não existir
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => CabecalhoModule.init());
    } else {
      CabecalhoModule.init();
    }
  }

  // ========== ANIMAÇÕES ADICIONAIS PARA O CSS (keyframes não declarados no CSS) ==========
  // Adiciona keyframes dinamicamente se não existirem
  const style = document.createElement("style");
  style.textContent = `
        @keyframes curtoCircuito {
            0%, 100% { background-color: #2c3e2b; }
            10%, 30%, 50% { background-color: #ffcc00; }
            20%, 40% { background-color: #ff6600; }
        }

        @keyframes reboot {
            0% { opacity: 1; transform: scale(1); }
            30% { opacity: 0.5; transform: scale(0.98); }
            60% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
        }
    `;
  if (!document.querySelector("#cabecalho-animacoes-dinamicas")) {
    style.id = "cabecalho-animacoes-dinamicas";
    document.head.appendChild(style);
  }

})();
