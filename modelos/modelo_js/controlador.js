// ==================================================
// controlador.js - VERSÃO QUE CARREGA OS SCRIPTS AUTOMATICAMENTE
// Controlador principal do sistema - ORQUESTRADOR
// ==================================================

(function () {
  "use strict";

  const Controlador = {
    modulosRegistrados: {},
    scriptsCarregados: {},
    status: "inicializando",

    // Lista de scripts a serem carregados (ordem importa!)
    scriptsParaCarregar: [
      { nome: "modelo_index", caminho: "modelo_js/modelo_index.js" },
      { nome: "modelo_certificado", caminho: "modelo_js/modelo_certificado.js" },
      { nome: "modelo_fechamento", caminho: "modelo_js/modelo_fechamento_bimestre.js" },
      { nome: "modelo_planosAula", caminho: "modelo_js/modelo_planos_aula.js" },
      { nome: "modelo_apresentacao", caminho: "modelo_js/modelo_apresentacao_bimestre.js" },
      // Módulos de cabeçalho e rodapé
      { nome: "modelo_cabecalho", caminho: "modelo_cabecalho.js" },
      { nome: "modelo_rodape", caminho: "modelo_rodape.js" }, // NOVO
    ],

    // ========== INÍCIO DO SISTEMA ==========
    async init() {
      console.log(
        "%c🤖 CONTROLADOR - Carregando módulos dinamicamente...",
        "color: #ffb347; font-size: 14px; font-weight: bold;"
      );

      // Aguarda DOM pronto
      if (document.readyState === "loading") {
        await new Promise((resolve) =>
          document.addEventListener("DOMContentLoaded", resolve)
        );
      }

      this.status = "dom_pronto";
      this.dispararEvento("controlador:dom_pronto");

      // Carrega todos os scripts
      await this.carregarTodosScripts();

      // Aguarda um tick e inicializa os módulos registrados
      setTimeout(() => {
        this.inicializarModulosRegistrados();
      }, 100);
    },

    // ========== CARREGA TODOS OS SCRIPTS ==========
    async carregarTodosScripts() {
      console.log("📦 Carregando scripts...");

      for (const script of this.scriptsParaCarregar) {
        await this.carregarScript(script.caminho, script.nome);
      }

      console.log("✅ Todos os scripts carregados!");
    },

    // ========== CARREGA UM SCRIPT ==========
    carregarScript(caminho, nome) {
      return new Promise((resolve, reject) => {
        // Verifica se já foi carregado
        if (this.scriptsCarregados[caminho]) {
          console.log(`⏭️ Script ${nome} já carregado`);
          resolve();
          return;
        }

        // Verifica se o script já existe na página
        const scriptExistente = document.querySelector(`script[src="${caminho}"]`);
        if (scriptExistente) {
          console.log(`⏭️ Script ${nome} já existe na página`);
          this.scriptsCarregados[caminho] = true;
          resolve();
          return;
        }

        console.log(`📥 Carregando: ${caminho}`);

        const script = document.createElement("script");
        script.src = caminho;
        script.onload = () => {
          console.log(`✅ Carregado: ${nome}`);
          this.scriptsCarregados[caminho] = true;
          resolve();
        };
        script.onerror = () => {
          console.error(`❌ Erro ao carregar: ${caminho}`);
          // Não interrompe o fluxo, apenas registra o erro
          resolve();
        };
        document.head.appendChild(script);
      });
    },

    // ========== REGISTRO DE MÓDULOS ==========
    registrarModulo(nome, modulo) {
      if (!modulo || typeof modulo.init !== "function") {
        console.warn(`⚠️ Módulo ${nome} inválido: não possui método init()`);
        return false;
      }

      this.modulosRegistrados[nome] = modulo;
      console.log(`📦 Módulo registrado: ${nome}`);

      this.dispararEvento("controlador:modulo_registrado", { nome });
      return true;
    },

    // ========== INICIALIZA MÓDULOS REGISTRADOS ==========
    inicializarModulosRegistrados() {
      const nomes = Object.keys(this.modulosRegistrados);

      if (nomes.length === 0) {
        console.log("⏳ Nenhum módulo registrado ainda. Aguardando...");
        setTimeout(() => this.inicializarModulosRegistrados(), 300);
        return;
      }

      console.log(`🎯 Inicializando ${nomes.length} módulo(s):`, nomes);

      nomes.forEach((nome, index) => {
        setTimeout(() => {
          try {
            const modulo = this.modulosRegistrados[nome];
            if (modulo && typeof modulo.init === "function") {
              modulo.init();
              console.log(`✅ Módulo inicializado: ${nome}`);
            }
          } catch (error) {
            console.error(`❌ Erro ao inicializar ${nome}:`, error);
          }
        }, index * 50);
      });

      this.status = "modulos_inicializando";

      setTimeout(() => {
        this.status = "pronto";
        this.dispararEvento("controlador:pronto", {
          modulos: nomes,
          timestamp: new Date().toISOString(),
        });
        console.log(
          "%c✅ CONTROLADOR PRONTO - Sistema operacional",
          "color: #2ecc71; font-size: 12px; font-weight: bold;"
        );
      }, 2000);
    },

    // ========== DISPARA EVENTOS GLOBAIS ==========
    dispararEvento(nome, detalhes = {}) {
      const evento = new CustomEvent(nome, { detail: detalhes });
      window.dispatchEvent(evento);
    },

    // ========== OBTÉM STATUS ==========
    getStatus() {
      return {
        status: this.status,
        modulos: Object.keys(this.modulosRegistrados),
        scriptsCarregados: Object.keys(this.scriptsCarregados),
        timestamp: new Date().toISOString(),
      };
    }
  };

  // Expõe globalmente
  window.ControladorRobomestres = Controlador;
  window.Controlador = Controlador;

  // Inicializa
  Controlador.init();
})();
