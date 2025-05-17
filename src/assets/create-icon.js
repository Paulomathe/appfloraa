/**
 * Script para gerar um ícone simples com texto PDV
 * Necessita instalação do sharp:
 * npm install sharp
 * node create-icon.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configurações
const SIZE = 1024;
const BACKGROUND_COLOR = '#00A551'; // Verde
const TEXT_COLOR = '#FFFFFF'; // Branco
const TEXT = 'PDV';
const FONT = 'bold 320px Arial';

// Função para criar o ícone
async function createIcon() {
  // Criar canvas
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  // Desenhar fundo
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Configurar texto
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Desenhar texto
  ctx.fillText(TEXT, SIZE / 2, SIZE / 2);

  // Salvar para arquivos
  const buffer = canvas.toBuffer('image/png');
  
  // Caminhos para salvar
  const iconPath = path.join(__dirname, 'icon.png');
  const faviconPath = path.join(__dirname, 'favicon.png');
  const adaptiveIconPath = path.join(__dirname, 'adaptive-icon.png');
  
  // Salvar os arquivos
  fs.writeFileSync(iconPath, buffer);
  fs.writeFileSync(faviconPath, buffer);
  fs.writeFileSync(adaptiveIconPath, buffer);
  
  console.log('Ícones gerados com sucesso!');
}

// Executar a função
createIcon().catch(err => {
  console.error('Erro ao criar o ícone:', err);
}); 