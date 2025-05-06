const pool = require('./db'); // importa sua conexão com o banco

async function criarTabelas() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuario (
        id SERIAL PRIMARY KEY,
        nome VARCHAR,
        email VARCHAR,
        senha VARCHAR,
        tipo VARCHAR
      );

      CREATE TABLE IF NOT EXISTS notificacao (
        id SERIAL PRIMARY KEY,
        mensagem VARCHAR,
        data_envio DATE
      );

      CREATE TABLE IF NOT EXISTS notificacao_usuario (
        id_usuario INTEGER,
        id_notificacao INTEGER,
        PRIMARY KEY (id_usuario, id_notificacao),
        FOREIGN KEY (id_usuario) REFERENCES usuario(id),
        FOREIGN KEY (id_notificacao) REFERENCES notificacao(id)
      );

      CREATE TABLE IF NOT EXISTS categoria (
        id SERIAL PRIMARY KEY,
        nome VARCHAR,
        descricao VARCHAR
      );

      CREATE TABLE IF NOT EXISTS transacao (
        id SERIAL PRIMARY KEY,
        valor FLOAT,
        data DATE,
        descricao VARCHAR,
        categoria VARCHAR,
        id_usuario INTEGER NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
      );

      CREATE TABLE IF NOT EXISTS relatorio (
        id SERIAL PRIMARY KEY,
        periodo VARCHAR,
        tipo VARCHAR,
        formato VARCHAR
      );

      CREATE TABLE IF NOT EXISTS relatorio_transacao (
        id_relatorio INTEGER,
        id_transacao INTEGER,
        PRIMARY KEY (id_relatorio, id_transacao),
        FOREIGN KEY (id_relatorio) REFERENCES relatorio(id),
        FOREIGN KEY (id_transacao) REFERENCES transacao(id)
      );
    `);

    console.log('✅ Todas as tabelas foram criadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  }
}

module.exports = criarTabelas;
