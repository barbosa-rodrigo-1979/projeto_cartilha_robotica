// ==================================================
// modelo_rodape.js - LÓGICA DO RODAPÉ REBELDE
// Módulo específico para gerenciar o rodapé robótico
// ==================================================

(function () {
  "use strict";

  const RodapeModule = {
    // Estado
    inicializado: false,

    // Elementos DOM
    relatorioElement: null,

    /**
     * Inicializa o módulo do rodapé
     */
    init() {
      if (this.inicializado) return;

      this.relatorioElement = document.getElementById("relatorioBugs");

      if (this.relatorioElement) {
        this.atualizarRelatorio();
      }

      this.configurarEventos();
      this.inicializado = true;

      console.log("%c🤖 [RODAPÉ] Módulo inicializado com sucesso", "color: #ffb347; font-size: 12px; font-weight: bold;");
    },

    /**
     * Atualiza o relatório de bugs com o valor atual do contador
     */
    atualizarRelatorio() {
      if (!this.relatorioElement) return;

      // Tenta obter o contador do módulo de cabeçalho
      let contadorBugs = 0;

      if (window.CabecalhoModule && typeof window.CabecalhoModule.getContadorBugs === "function") {
        contadorBugs = window.CabecalhoModule.getContadorBugs();
      } else {
        // Fallback: tenta ler do localStorage
        try {
          const salvo = localStorage.getItem("cabecalho_contador_bugs");
          contadorBugs = salvo ? parseInt(salvo) : 0;
        } catch (e) {
          contadorBugs = 0;
        }
      }

      this.relatorioElement.innerText = contadorBugs;
      this.animarAtualizacao();
    },

    /**
     * Anima a atualização do contador no rodapé
     */
    animarAtualizacao() {
      if (this.relatorioElement) {
        this.relatorioElement.classList.add("atualizando");
        setTimeout(() => {
          if (this.relatorioElement) {
            this.relatorioElement.classList.remove("atualizando");
          }
        }, 300);
      }
    },

    /**
     * Configura os eventos globais que o rodapé escuta
     */
    configurarEventos() {
      // Escuta evento de bug vindo de outros módulos
      document.addEventListener("robo:bug", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de reset do contador
      document.addEventListener("robo:resetBugs", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de atualização do cabeçalho
      document.addEventListener("cabecalho:contador_atualizado", () => {
        this.atualizarRelatorio();
      });

      // Escuta evento de vitória (apenas para log)
      document.addEventListener("robo:vitoria", () => {
        if (this.relatorioElement) {
          // Pisca o contador em verde para indicar sucesso
          const corOriginal = this.relatorioElement.style.color;
          this.relatorioElement.style.color = "#2ecc71";
          setTimeout(() => {
            if (this.relatorioElement) {
              this.relatorioElement.style.color = "";
            }
          }, 500);
        }
      });

      // Se o controlador estiver disponível, escuta seu evento de pronto
      if (window.ControladorRobomestres) {
        window.addEventListener("controlador:pronto", () => {
          this.atualizarRelatorio();
        });
      }
    },

    /**
     * Sincroniza manualmente o relatório com o cabeçalho
     */
    sincronizar() {
      this.atualizarRelatorio();
    },

    /**
     * Adiciona uma mensagem personalizada ao relatório
     * @param {string} mensagem - Mensagem extra a ser exibida
     */
    adicionarMensagemRelatorio(mensagem) {
      if (this.relatorioElement) {
        const htmlAtual = this.relatorioElement.innerHTML;
        this.relatorioElement.innerHTML = `${htmlAtual}<span class="mensagem-extra ms-2" style="font-size:0.7rem; opacity:0.7;">${mensagem}</span>`;
        setTimeout(() => {
          const msgExtra = this.relatorioElement.querySelector(".mensagem-extra");
          if (msgExtra) msgExtra.remove();
        }, 3000);
      }
    }
  };

  // ========== REGISTRO NO CONTROLADOR ==========
  if (typeof window.ControladorRobomestres !== "undefined" && window.ControladorRobomestres) {
    window.ControladorRobomestres.registrar("RodapeModule", RodapeModule);
  }

  // Fallback: expõe globalmente
  window.RodapeModule = RodapeModule;

  // Auto-inicializa se o controlador não existir
  if (typeof window.ControladorRobomestres === "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => RodapeModule.init());
    } else {
      RodapeModule.init();
    }
  }

})();
