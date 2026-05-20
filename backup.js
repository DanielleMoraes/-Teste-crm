const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, 'backups');
const DB_NAME = process.env.DB_NAME || 'nexora_crm';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';

if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function createBackup() {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupFile = path.join(BACKUP_DIR, `backup_${timestamp}.sql`);
    
    const passwordArg = DB_PASSWORD ? `-p${DB_PASSWORD}` : '';
    const command = `mysqldump -u ${DB_USER} ${passwordArg} -h ${DB_HOST} ${DB_NAME} > "${backupFile}"`;
    
    console.log(`🔄 Iniciando backup do banco de dados...`);
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Erro ao criar backup: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️ Avisos: ${stderr}`);
        }
        console.log(`✅ Backup criado com sucesso: ${backupFile}`);
        cleanOldBackups();
    });
}

function cleanOldBackups() {
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('backup_') && f.endsWith('.sql'))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time);
    
    const MAX_BACKUPS = 30;
    
    if (files.length > MAX_BACKUPS) {
        const toDelete = files.slice(MAX_BACKUPS);
        toDelete.forEach(file => {
            fs.unlinkSync(path.join(BACKUP_DIR, file.name));
            console.log(`🗑️ Backup antigo removido: ${file.name}`);
        });
    }
}

if (require.main === module) {
    createBackup();
}

module.exports = { createBackup };
