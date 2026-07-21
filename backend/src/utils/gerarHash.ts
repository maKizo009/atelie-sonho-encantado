import argon2 from 'argon2';

const password = process.argv[2];

if (!password) {
  console.log('❌ Erro: Forneça a senha que deseja hashear como argumento.');
  console.log('Exemplo: bun src/utils/gerarHash.ts "sua_senha_segura_aqui"');
  process.exit(1);
}

async function gerar() {
  console.log(`⏳ Gerando hash seguro Argon2 para a senha: "${password}"...`);
  try {
    const hash = await argon2.hash(password);
    console.log('\n✅ Hash gerado com sucesso! Insira este valor na coluna "senha_hash" do banco:');
    console.log('\x1b[36m%s\x1b[0m', hash); // Imprime em ciano no terminal
  } catch (err) {
    console.error('❌ Erro ao hashear senha:', err);
  }
}

gerar();
