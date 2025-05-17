const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Configurações
const SIZE = 1024;
const BACKGROUND_COLOR = '#00A551';
const TEXT_COLOR = '#FFFFFF';
const TEXT = 'PDV';
const FONT = 'bold 320px Arial';

async function generateIcon() {
  console.log('Gerando ícone PDV...');
  
  // Criar o canvas
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  
  // Preencher o fundo
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, SIZE, SIZE);
  
  // Configurar o texto
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Desenhar o texto
  ctx.fillText(TEXT, SIZE / 2, SIZE / 2);
  
  // Converter para buffer
  const buffer = canvas.toBuffer('image/png');
  
  // Definir caminhos
  const directories = [
    path.join(__dirname, '..', '..', 'assets', 'images'),
    path.join(__dirname, 'images')
  ];
  
  const fileNames = ['icon.png', 'favicon.png', 'adaptive-icon.png', 'profile-default.png'];
  
  // Salvar em todos os diretórios
  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    for (const fileName of fileNames) {
      const filePath = path.join(dir, fileName);
      fs.writeFileSync(filePath, buffer);
      console.log(`Ícone salvo em: ${filePath}`);
    }
  }
  
  console.log('Ícones gerados com sucesso!');
}

// Executar a função
generateIcon().catch(err => {
  console.error('Erro ao gerar ícone:', err);
}); 