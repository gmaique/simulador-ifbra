# 🕹️ Simulador IFBrA — O Jogo da Avaliação PCD

Simulador educativo, em estilo arcade 8-bit, das **41 atividades do IFBrA**
(Índice de Funcionalidade Brasileiro Aplicado) — o instrumento brasileiro de **avaliação biopsicossocial da pessoa com deficiência** (LC 142/2013, Portaria Interministerial AGU/MPS/MF/SEDH/MP 01/2014).

**Jogue:** abra o `index.html` no navegador (ou acesse a versão publicada).

## O que ele faz

- Percorre as **41 atividades** dos 7 domínios, uma a uma, com as 4 notas
  oficiais (100/75/50/25) traduzidas pra linguagem de gente;
- Dicas contextuais por **tipo de impedimento** (mental/intelectual, motor,
  visual, auditivo);
- Aplica a **questão emblemática e o método Fuzzy** oficiais do seu tipo;
- No final: pontuação total (×2 avaliadores), **grau provável**
  (grave / moderada / leve / não caracterizada), detalhamento por domínio e
  dicas de preparação pra avaliação real;
- Som chiptune (WebAudio), visual CRT, navegação por teclado (1-4),
  leitor de tela (ARIA), progresso salvo no navegador.

## Privacidade

Nada sai do seu navegador. Sem servidor, sem cookies de terceiros, sem
analytics. O progresso fica só no `localStorage` da sua máquina.

## Aviso importante

⚠️ **Simulação educativa.** Não é a avaliação oficial e não substitui orientação profissional (jurídica ou de saúde). As notas reais são atribuídas por avaliador médico e assistente social. Use para **entender a lógica do instrumento** e
se preparar para relatar sua funcionalidade com fidelidade — sem minimizar
nem exagerar.

## Fontes

- Portaria Interministerial AGU/MPS/MF/SEDH/MP nº 01/2014 (IFBrA, anexos)
- Lei Complementar 142/2013
- Faixas: ≤5.739 grave · 5.740–6.354 moderada · 6.355–7.584 leve · ≥7.585 não caracterizada

Feito com 💚 pra comunidade PCD. Compartilhe.

## 🎮 Jogo 2: Resista ao Avaliador (`resista.html`)

Treino anti-pegadinha focado em **TEA/TDAH**: você joga como "Alex" (ficha
definida) e enfrenta 20 perguntas sorteadas de um banco de **100**, cobrindo as
6 técnicas clássicas de teste de consistência em entrevistas de avaliação:

1. **Sintoma plantado** — o avaliador oferece um sintoma que não existe;
2. **Premissa falsa** — a pergunta embute algo que não aconteceu;
3. **Generalização oferecida** — "então você não consegue NADA…";
4. **Minimização-isca** — "mas no geral está tudo bem, né?";
5. **Pergunta legítima** — confirmar o que é real (sem esconder nem inflar);
6. **Pedido de exemplo** — sustentar com cena concreta.

Barra de **credibilidade** (erros derrubam, com explicação do porquê) e rank
final: 🛡 BLINDADO · ⚠ ESCORREGOU · 💀 QUEIMOU O FILME.

> O treino ensina **fidelidade do relato** — recusar o que não é seu E não
> esconder o que é. Nunca invenção.
