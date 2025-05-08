const pool = require('../db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Adicionar coluna data_cadastro
    await client.query(`
      ALTER TABLE usuario 
      ADD COLUMN IF NOT EXISTS data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);

    // Atualizar registros existentes
    await client.query(`
      UPDATE usuario 
      SET data_cadastro = CURRENT_TIMESTAMP 
      WHERE data_cadastro IS NULL
    `);

    await client.query('COMMIT');
    console.log('Migração concluída com sucesso!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Erro durante a migração:', err);
  } finally {
    client.release();
    process.exit();
  }
}

migrate(); 