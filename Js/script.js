/* ============ SCRIPTS PRINCIPAIS (script.js) ============ */
/* ====================================================================
   MAIS VENDAS — SCRIPTS GLOBAIS
   ====================================================================
   Motor de revelação ao rolar. Todo elemento com a classe .reveal
   ganha a classe .is-visible quando entra na viewport, disparando a
   animação definida no CSS. Use data-delay="100" (ms) para escalonar.
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const elementos = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          obs.unobserve(entry.target); // anima só uma vez
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  elementos.forEach((el) => observer.observe(el));
});

/* ====================================================================
   SEÇÃO 1 — HERO
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Descrição: revela as linhas em sequência (no load) ---- */
  const desc = document.querySelector(".hero__desc");
  if (desc) {
    requestAnimationFrame(() => desc.classList.add("is-in"));
  }

  /* ---- Botão: quebra o texto em letras para o hover em cascata ---- */
  const btnLabel = document.querySelector(".hero__btn-label");
  if (btnLabel) {
    const texto = btnLabel.textContent.trim();
    btnLabel.textContent = "";
    [...texto].forEach((ch, i) => {
      const letra = ch === " " ? " " : ch; // preserva o espaço
      const char = document.createElement("span");
      char.className = "hero__btn-char";
      const inner = document.createElement("span");
      inner.className = "hero__btn-char-inner";
      inner.style.setProperty("--ci", i); // índice = atraso da cascata
      // duas cópias empilhadas da mesma letra
      inner.innerHTML = "<span></span><span></span>";
      inner.children[0].textContent = letra;
      inner.children[1].textContent = letra;
      char.appendChild(inner);
      btnLabel.appendChild(char);
    });
  }

  /* ---- Botão da hero → rola até a seção "Como funciona" ---- */
  const heroBtn = document.querySelector(".hero__btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", () => {
      const alvo = document.getElementById("como-funciona");
      if (alvo) alvo.scrollIntoView({ behavior: "smooth" });
    });
  }

  /* ---- Título: troca de frase (crossfade + blur) conforme o scroll ---- */
  // Desce → "Agora te trouxemos até aqui"; volta ao topo → "Você começou".
  const titulo = document.querySelector(".hero__title");

  if (titulo) {
    const LIMIAR_DESCE = 60; // px de scroll para trocar p/ frase 2
    const LIMIAR_SOBE = 30;  // px para voltar p/ frase 1 (histerese)
    let emFase2 = false;
    let agendado = false;

    function atualizarFrase() {
      const y = window.scrollY || window.pageYOffset || 0;
      if (!emFase2 && y > LIMIAR_DESCE) {
        emFase2 = true;
        titulo.classList.add("fase-2");
      } else if (emFase2 && y < LIMIAR_SOBE) {
        emFase2 = false;
        titulo.classList.remove("fase-2"); // reverso ao subir
      }
      agendado = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!agendado) {
          requestAnimationFrame(atualizarFrase);
          agendado = true;
        }
      },
      { passive: true }
    );

    atualizarFrase(); // estado inicial (caso já carregue rolado)
  }
});

/* ====================================================================
   SEÇÃO 2 — E PRA ISSO CRIAMOS O INDICADOR+
   Revela a seção (título linha por linha + descrição) ao entrar na tela.
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const secao2 = document.querySelector(".secao2");
  if (!secao2) return;

  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          o.unobserve(entry.target); // dispara só uma vez
        }
      });
    },
    { threshold: 0.3 }
  );

  obs.observe(secao2);
});

/* ====================================================================
   CASCATA DE LETRAS — helper reutilizável
   Quebra o texto de qualquer .cascata__label em letras (2 cópias
   empilhadas) para o efeito de hover letra por letra (igual à Hero).
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cascata__label").forEach((label) => {
    const texto = label.textContent.trim();
    label.textContent = "";
    [...texto].forEach((ch, i) => {
      const char = document.createElement("span");
      char.className = "cascata__char";
      const inner = document.createElement("span");
      inner.className = "cascata__inner";
      inner.style.setProperty("--ci", i);
      inner.innerHTML = "<span></span><span></span>";
      inner.children[0].textContent = ch;
      inner.children[1].textContent = ch;
      char.appendChild(inner);
      label.appendChild(char);
    });
  });
});

/* ====================================================================
   SEÇÃO 7 — PROVA SOCIAL: count-up das métricas
   Anima cada número de 0 até o valor final ao entrar na tela (uma vez),
   mantendo prefixo (+) e sufixo (mil / k / %) no lugar.
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const metricas = document.querySelector(".prova__metricas");
  if (!metricas) return;

  const nums = metricas.querySelectorAll(".prova__num");
  const semMovimento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function contar(el) {
    const alvo = parseInt(el.dataset.target, 10) || 0;
    const prefixo = el.dataset.prefix || "";
    const sufixo = el.dataset.suffix || "";
    const duracao = 1000; // ms

    if (semMovimento) {
      el.textContent = prefixo + alvo + sufixo;
      return;
    }

    let inicio = null;
    function passo(ts) {
      if (inicio === null) inicio = ts;
      const p = Math.min((ts - inicio) / duracao, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
      el.textContent = prefixo + Math.round(alvo * eased) + sufixo;
      if (p < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  const obs = new IntersectionObserver(
    (entries, o) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          nums.forEach(contar);
          o.unobserve(entry.target); // dispara uma vez
        }
      });
    },
    { threshold: 0.4 }
  );

  obs.observe(metricas);
});

/* ====================================================================
   SEÇÃO 9 — FAQ: acordeão (um aberto por vez)
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const itens = document.querySelectorAll(".faq__item");
  if (!itens.length) return;

  itens.forEach((item) => {
    const botao = item.querySelector(".faq__pergunta");

    botao.addEventListener("click", () => {
      const abrindo = !item.classList.contains("is-open");

      // Fecha todos (um aberto por vez)
      itens.forEach((outro) => {
        outro.classList.remove("is-open");
        outro
          .querySelector(".faq__pergunta")
          .setAttribute("aria-expanded", "false");
      });

      // Abre o clicado (se estava fechado)
      if (abrindo) {
        item.classList.add("is-open");
        botao.setAttribute("aria-expanded", "true");
      }
    });
  });
});

/* ====================================================================
   SEÇÃO 10 — CTA FINAL: modal (form → planilha → WhatsApp) e chatbot
   - Botão primário "Conheça o Indicador+"  → abre o modal
   - Botão secundário "Falar com um gestor" → abre o chatbot (n8n)
==================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // URL do Web App do Google Apps Script (mesma planilha da Ecossistema)
  const SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbw92buj8wQXQwkZZ6VD2RgOx4ICWr221XsYbkL7ERA1HS90av9vqrKA5_9DGiDkBgcc/exec";
  // Número do WhatsApp (somente dígitos, com DDI+DDD)
  const WHATSAPP_NUMERO = "553788512990";

  const modal = document.getElementById("modal-lead");
  const botaoCta = document.querySelector(".final__btn--primario");
  const formLead = document.getElementById("form-lead");

  if (modal && botaoCta && formLead) {
    function abrirModal(e) {
      if (e) e.preventDefault();
      modal.classList.add("is-aberto");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-ativo");
      const primeiro = modal.querySelector("input");
      if (primeiro) setTimeout(() => primeiro.focus(), 100);
    }

    function fecharModal() {
      modal.classList.remove("is-aberto");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-ativo");
    }

    // Abre ao clicar no botão primário do CTA final
    botaoCta.addEventListener("click", abrirModal);

    // Fecha: botão X, overlay e tecla ESC
    modal.querySelectorAll("[data-fechar-modal]").forEach((el) => {
      el.addEventListener("click", fecharModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-aberto")) {
        fecharModal();
      }
    });

    // Envio do formulário → planilha + WhatsApp
    formLead.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!formLead.checkValidity()) {
        formLead.reportValidity();
        return;
      }

      const nome = document.getElementById("lead-nome").value.trim();
      const email = document.getElementById("lead-email").value.trim();
      const telefone = document.getElementById("lead-telefone").value.trim();

      const botaoEnviar = formLead.querySelector(".modal__enviar");
      const textoOriginal = botaoEnviar.textContent;
      botaoEnviar.disabled = true;
      botaoEnviar.textContent = "Enviando...";

      // Corpo em application/x-www-form-urlencoded — o Apps Script lê
      // esses campos via e.parameter (colunas A, B e C).
      const params = new URLSearchParams();
      params.append("nome", nome);       // coluna A
      params.append("email", email);     // coluna B
      params.append("telefone", telefone); // coluna C
      // o horário (coluna D) é gerado no Apps Script (servidor)

      // 1) sendBeacon: garante a entrega mesmo ao sair da página
      let enviado = false;
      if (navigator.sendBeacon) {
        const blob = new Blob([params.toString()], {
          type: "application/x-www-form-urlencoded;charset=UTF-8",
        });
        enviado = navigator.sendBeacon(SHEETS_WEBAPP_URL, blob);
      }

      // 2) Fallback: fetch com keepalive
      if (!enviado) {
        try {
          await fetch(SHEETS_WEBAPP_URL, {
            method: "POST",
            body: params,
            mode: "no-cors",
            keepalive: true,
          });
        } catch (err) {
          console.error("Erro ao enviar para a planilha:", err);
        }
      }

      // Redireciona ao WhatsApp com mensagem pré-preenchida
      const mensagem = encodeURIComponent(
        `Olá! Meu nome é ${nome} e quero lucrar mais com o Indicador+.`
      );
      setTimeout(() => {
        window.location.href =
          `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`;
        botaoEnviar.disabled = false;
        botaoEnviar.textContent = textoOriginal;
      }, 300);
    });
  }

  // ===== Botão "Ainda tenho dúvidas" (CTA final) → abre o chatbot =====
  const botaoDuvidas = document.querySelector(".final__btn--secundario");

  if (botaoDuvidas) {
    botaoDuvidas.addEventListener("click", (e) => {
      e.preventDefault();
      abrirChat();
    });
  }

  // ===== Link "Fale com a gente" (abaixo do FAQ) → abre o chatbot =====
  const linkChatFaq = document.querySelector(".faq__link-chat");

  if (linkChatFaq) {
    linkChatFaq.addEventListener("click", (e) => {
      e.preventDefault();
      abrirChat();
    });
  }

  // Aciona o toggle do widget n8n. Se ainda não montou, tenta de novo.
  function abrirChat(tentativas = 20) {
    const toggle = document.querySelector(".chat-window-toggle");

    if (!toggle) {
      // widget do chat ainda carregando (módulo do CDN) — tenta de novo
      if (tentativas > 0) setTimeout(() => abrirChat(tentativas - 1), 300);
      else console.warn("Widget de chat (n8n) não encontrado na página.");
      return;
    }

    // A janela usa v-show: fica sempre no DOM (display:none quando fechada).
    // Só está "aberta" se estiver realmente visível.
    const janela = document.querySelector(".chat-window");
    const aberta = janela && janela.offsetParent !== null;

    if (!aberta) toggle.click();
  }
});


/* ============ CALCULADORA (calculadora.js) ============ */
/* =====================================================================
   CALCULADORA INDICADOR+ — Lógica do componente
   Autossuficiente. Basta incluir este arquivo e o HTML do componente.
   A inicialização acontece automaticamente no DOMContentLoaded.
   ===================================================================== */
(function () {
    'use strict';

    // ===== Premissas de cálculo =====
    // adoption    -> % de aderência da carteira ao produto
    // annualValue -> valor anual do produto (R$)
    // recurring   -> entra no cálculo do MRR (receita recorrente mensal)
    const PRODUCTS = [
        { name: 'Certifica SST',        adoption: 0.20,  annualValue: 1000.00, recurring: true  },
        { name: 'Certifica Concilia',   adoption: 0.15,  annualValue: 2398.80, recurring: true  },
        { name: 'Certifica GED',        adoption: 0.05,  annualValue: 1800.00, recurring: true  },
        { name: 'Certifica ERP',        adoption: 0.10,  annualValue: 1740.00, recurring: true  },
        { name: 'Certifica Signer',     adoption: 0.025, annualValue: 478.80,  recurring: true  },
        { name: 'Certifica Registro',   adoption: 0.10,  annualValue: 1900.00, recurring: false },
        { name: 'Certifica UP Digital', adoption: 0.10,  annualValue: 797.00,  recurring: false },
        { name: 'Certifica Ponto',      adoption: 0.20,  annualValue: 1788.00, recurring: true  },
        { name: 'Certifica Nota',       adoption: 0.05,  annualValue: 598.80,  recurring: true  }
    ];
    const COMMISSION_RATE = 0.10;       // 10% de comissão sobre o valor anual
    const CERTIFICATE_COMMISSION = 100; // comissão por renovação de certificado (por cliente)

    const fmtNum = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const fmt = (n) => `<span class="currency-prefix">R$</span>${fmtNum.format(n)}`;
    const fmtCurrency = (n) => `R$ ${fmtNum.format(n)}`;
    const fmtPercent = (n) => `${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

    function calculate(clients) {
        let annualPerClient = 0;
        let recurringAnnualPerClient = 0;
        for (const p of PRODUCTS) {
            const commissionPerClient = p.adoption * p.annualValue * COMMISSION_RATE;
            annualPerClient += commissionPerClient;
            if (p.recurring) recurringAnnualPerClient += commissionPerClient;
        }
        const annual      = annualPerClient * clients;
        const monthly     = annual / 12;
        const mrr         = (recurringAnnualPerClient * clients) / 12;
        const certificate = CERTIFICATE_COMMISSION * clients;
        // "Com indicador+" (anual): renda do certificado + potencial de comissão anual
        const total       = certificate + annual;
        return { annual, monthly, mrr, certificate, total };
    }

    // Inicializa uma instância da calculadora dentro de um contexto (default: document)
    function initCalculadora(root) {
        root = root || document;

        const q = (sel) => root.querySelector(sel);

        const el = q('#calcWrapper');
        if (!el) return; // componente não presente nesta página

        const input      = q('#clientsInput');
        const calcBtn    = q('#calcBtn');
        const presetBtns = root.querySelectorAll('.preset-btn');
        const annualEl   = q('#annualValue');
        const monthlyEl  = q('#monthlyValue');
        const mrrEl      = q('#mrrValue');
        const certEl     = q('#certificateValue');
        const totalEl    = q('#totalValue');

        function setPresetActive(value) {
            presetBtns.forEach(btn => {
                btn.classList.toggle('active', Number(btn.dataset.value) === Number(value));
            });
        }

        function updateResults() {
            const clients = parseInt(input.value, 10);
            if (!clients || clients < 1) {
                annualEl.innerHTML  = fmt(0);
                monthlyEl.innerHTML = fmt(0);
                mrrEl.innerHTML     = fmt(0);
                certEl.innerHTML    = fmt(0);
                totalEl.innerHTML   = fmt(0);
                updateBreakdown(0);
                return;
            }
            const r = calculate(clients);
            annualEl.innerHTML  = fmt(r.annual);
            monthlyEl.innerHTML = fmt(r.monthly);
            mrrEl.innerHTML     = fmt(r.mrr);
            certEl.innerHTML    = fmt(r.certificate);
            totalEl.innerHTML   = fmt(r.total);
            updateBreakdown(clients);
        }

        // ===== DETALHAMENTO POR PRODUTO =====
        const breakdownRows       = q('#breakdownRows');
        const breakdownTotalSales = q('#breakdownTotalSales');
        const breakdownTotalGain  = q('#breakdownTotalGain');

        const recurringPill = `<span class="recurring-pill" aria-label="Recorrente sim">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="17 1 21 5 17 9"/>
                <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                <polyline points="7 23 3 19 7 15"/>
                <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>sim
        </span>`;
        const notRecurring = `<span class="recurring-no">não</span>`;

        function renderBreakdownRows() {
            if (!breakdownRows) return;
            breakdownRows.innerHTML = PRODUCTS.map(p => {
                const commissionPerSale = p.annualValue * COMMISSION_RATE;
                return `
                    <div class="breakdown-row" role="row" data-product="${p.name}">
                        <div role="cell" data-label="Produto">${p.name}</div>
                        <div role="cell" data-label="Aderência">${fmtPercent(p.adoption * 100)}</div>
                        <div role="cell" data-label="Vendas" data-sales>0</div>
                        <div role="cell" data-label="Comissão / venda">${fmtCurrency(commissionPerSale)}</div>
                        <div role="cell" data-label="Ganho anual" data-gain>${fmtCurrency(0)}</div>
                        <div role="cell" data-label="Recorrente?">${p.recurring ? recurringPill : notRecurring}</div>
                    </div>
                `;
            }).join('');
        }

        function updateBreakdown(clients) {
            if (!breakdownRows) return;
            const rows = breakdownRows.querySelectorAll('.breakdown-row');
            let totalSalesFloat = 0;
            let totalGain = 0;
            PRODUCTS.forEach((p, i) => {
                const salesFloat = p.adoption * clients;
                const gain = salesFloat * p.annualValue * COMMISSION_RATE;
                totalSalesFloat += salesFloat;
                totalGain += gain;
                const row = rows[i];
                if (!row) return;
                row.querySelector('[data-sales]').textContent = Math.round(salesFloat);
                row.querySelector('[data-gain]').textContent = fmtCurrency(gain);
            });
            if (breakdownTotalSales) breakdownTotalSales.textContent = Math.round(totalSalesFloat);
            if (breakdownTotalGain)  breakdownTotalGain.textContent  = fmtCurrency(totalGain);
        }

        renderBreakdownRows();
        updateBreakdown(1);

        // Toggle accordion
        const breakdownCard   = q('#breakdownCard');
        const breakdownToggle = q('#breakdownToggle');
        const breakdownBody   = q('#breakdownBody');
        if (breakdownToggle && breakdownBody && breakdownCard) {
            breakdownToggle.addEventListener('click', () => {
                const isOpen = breakdownCard.classList.toggle('is-open');
                breakdownToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        }

        function reveal() {
            const clients = parseInt(input.value, 10);
            if (!clients || clients < 1) {
                input.focus();
                return;
            }
            updateResults();
            el.classList.add('show-results');

            const breakdownSection = q('#breakdownSection');
            if (breakdownSection && breakdownSection.classList.contains('is-hidden')) {
                breakdownSection.classList.remove('is-hidden');
                breakdownSection.classList.add('is-entering');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        breakdownSection.classList.remove('is-entering');
                    });
                });
            }
        }

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.value;
                input.value = val;
                setPresetActive(val);
                if (el.classList.contains('show-results')) {
                    updateResults();
                } else {
                    reveal();
                }
            });
        });

        input.addEventListener('input', () => {
            setPresetActive(input.value);
            if (el.classList.contains('show-results')) {
                updateResults();
            } else {
                const clients = parseInt(input.value, 10);
                updateBreakdown(clients > 0 ? clients : 0);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') reveal();
        });

        if (calcBtn) calcBtn.addEventListener('click', reveal);

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.classList.add('is-in');
                        io.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
            io.observe(el);
        } else {
            el.classList.add('is-in');
        }
    }

    // Expõe para uso manual, se necessário
    window.initCalculadora = initCalculadora;

    // Auto-inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initCalculadora(document));
    } else {
        initCalculadora(document);
    }
})();


/* ============ PORTFÓLIO (portfolio.js) ============ */
/* =====================================================================
   PORTFÓLIO DE SOLUÇÕES — Lógica do componente
   Autossuficiente. Controla a troca de abas (tabs) e os painéis.
   Inicializa automaticamente e escopa tudo dentro de .portfolio-widget.
   ===================================================================== */
(function () {
    'use strict';

    function initPortfolio(root) {
        root = root || document;

        const widget = root.querySelector('.portfolio-widget');
        if (!widget) return; // componente não presente nesta página

        const tabs = widget.querySelectorAll('.tab');
        const panels = widget.querySelectorAll('.panel');
        if (!tabs.length || !panels.length) return;

        function activateTab(target) {
            tabs.forEach(t => {
                const isActive = t.dataset.tab === target;
                t.classList.toggle('active', isActive);
                t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
            panels.forEach(p => {
                const isActive = p.dataset.panel === target;
                p.classList.toggle('active', isActive);
                if (isActive) p.removeAttribute('hidden');
                else p.setAttribute('hidden', '');
            });
        }

        tabs.forEach(tab => {
            tab.addEventListener('click', () => activateTab(tab.dataset.tab));
        });

        // Navegação por teclado (setas ← →)
        const tablist = widget.querySelector('[role="tablist"]');
        if (tablist) {
            tablist.addEventListener('keydown', (e) => {
                const list = Array.from(tabs);
                const idx = list.indexOf(document.activeElement);
                if (idx === -1) return;
                let next = idx;
                if (e.key === 'ArrowRight') next = (idx + 1) % list.length;
                else if (e.key === 'ArrowLeft') next = (idx - 1 + list.length) % list.length;
                else return;
                e.preventDefault();
                list[next].focus();
                activateTab(list[next].dataset.tab);
            });
        }

        // Animação de entrada (fade-in ao entrar na tela) — escopada ao portfólio
        const section = root.querySelector('.portfolio.reveal');
        if (section) {
            if ('IntersectionObserver' in window) {
                const io = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                            io.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.12 });
                io.observe(section);
            } else {
                section.classList.add('is-visible');
            }
        }
    }

    // Expõe para uso manual, se necessário
    window.initPortfolio = initPortfolio;

    // Auto-inicialização
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => initPortfolio(document));
    } else {
        initPortfolio(document);
    }
})();
