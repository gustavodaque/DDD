const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');
let gravidade = 0.5;
let gameover = false;
let pulosRestantes = 2; // Controla os pulos
let pontos = 0; // Inicializa a pontuação
let tempoInicio = Date.now(); // Registra o tempo de início
let tempoDecorrido = 0; // Variável para armazenar o tempo decorrido

// Função para reiniciar o jogo
function reiniciarJogo() {
  gameover = false;
  pulosRestantes = 2;
  pontos = 0; // Reseta a pontuação
  tempoInicio = Date.now(); // Reinicia o tempo
  personagem.y = canvas.height - 50; // Reseta a posição do personagem
  personagem.velocidade_y = 0; // Reseta a velocidade do personagem
  obstaculo.x = canvas.width; // Reseta a posição do obstáculo
  obstaculo.velocidade_x = 10; // Reseta a velocidade do obstáculo
}

// Evento para controle do pulo
document.addEventListener('keypress', (evento) => {
  if (evento.code == 'Space' && !gameover) {
    if (pulosRestantes > 0) {
      // Primeiro pulo é 12, segundo pulo é 10
      let alturaPulo = (pulosRestantes === 2) ? 12 : 10;
      personagem.velocidade_y = alturaPulo;
      personagem.pulando = true;
      pulosRestantes--; // Decrementa os pulos restantes
    }
  }

  // Evento para reiniciar o jogo ao pressionar 'Z'
  if (evento.code == 'KeyZ' && gameover) {
    reiniciarJogo(); // Reinicia o jogo
    loop(); // Inicia o loop novamente
  }
});

const personagem = {
  x: 100,
  y: canvas.height - 50,
  largura: 50,
  altura: 50,
  velocidade_y: 0,
  pulando: false
};

const obstaculo = {
  x: canvas.width,
  y: canvas.height - 100,
  largura: 50,
  altura: 100,
  velocidade_x: 10
};

function desenharPersonagem() {
  ctx.fillStyle = 'white';
  ctx.fillRect(personagem.x, personagem.y, personagem.largura, personagem.altura);
}

function atualizarPersonagem() {
  if (personagem.pulando) {
    personagem.y -= personagem.velocidade_y;
    personagem.velocidade_y -= gravidade;
    if (personagem.y >= canvas.height - 50) {
      personagem.velocidade_y = 0;
      personagem.y = canvas.height - 50;
      personagem.pulando = false;
      pulosRestantes = 2; // Permite novos pulos quando o personagem tocar o chão
    }
  }
}

function desenharObstaculo() {
  ctx.fillStyle = 'green';
  ctx.fillRect(obstaculo.x, obstaculo.y, obstaculo.largura, obstaculo.altura);
}

function atualizarObstaculo() {
  obstaculo.x -= obstaculo.velocidade_x;
  if (obstaculo.x <= 0 - obstaculo.largura) {
    obstaculo.x = canvas.width; // Reseta a posição do obstáculo para a largura da tela
    pontos += 10; // Ganha 10 pontos por passar o obstáculo
  }
}

function verificaColisao() {
  if (
    obstaculo.x < personagem.x + personagem.largura &&
    obstaculo.x + obstaculo.largura > personagem.x &&
    personagem.y < obstaculo.y + obstaculo.altura &&
    personagem.y + personagem.altura > obstaculo.y
  ) {
    obstaculo.velocidade_x = 0;
    ctx.fillStyle = 'black';
    ctx.font = '50px Arial';
    ctx.fillText('GAME OVER', 50, 100);
    gameover = true;
    tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 1000); // Tempo em segundos
    salvarPontuacao(); // Salva a pontuação e o tempo no localStorage
  }
}

function desenharPontuacaoETempo() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Pontos: ${pontos}`, 20, 30);
  
  tempoDecorrido = Math.floor((Date.now() - tempoInicio) / 1000); // Tempo em segundos
  ctx.fillText(`Tempo: ${tempoDecorrido}s`, 20, 60);
}

function salvarPontuacao() {
  const pontuacaoAnterior = localStorage.getItem('pontuacao');
  const tempoAnterior = localStorage.getItem('tempo');
  
  // Se a pontuação atual for maior, salva ela no localStorage
  if (!pontuacaoAnterior || pontos > parseInt(pontuacaoAnterior)) {
    localStorage.setItem('pontuacao', pontos);
    localStorage.setItem('tempo', tempoDecorrido);
  }
}

function mostrarMelhorPontuacao() {
  const melhorPontuacao = localStorage.getItem('pontuacao');
  const melhorTempo = localStorage.getItem('tempo');
  
  if (melhorPontuacao && melhorTempo) {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Melhor Pontuação: ${melhorPontuacao}`, 20, 90);
    ctx.fillText(`Melhor Tempo: ${melhorTempo}s`, 20, 120);
  }
}

function loop() {
  if (!gameover) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharPersonagem();
    atualizarPersonagem();
    desenharObstaculo();
    atualizarObstaculo();
    verificaColisao();
    desenharPontuacaoETempo();
    mostrarMelhorPontuacao(); // Mostra a melhor pontuação do localStorage
    requestAnimationFrame(loop); // Mantém o loop rodando
  }
}

loop()
