-- Adicionar coluna data_cadastro à tabela usuario
ALTER TABLE usuario 
ADD COLUMN data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
 
-- Atualizar registros existentes com a data atual
UPDATE usuario 
SET data_cadastro = CURRENT_TIMESTAMP 
WHERE data_cadastro IS NULL; 