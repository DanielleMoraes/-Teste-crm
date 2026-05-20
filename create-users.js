const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createUsers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'nexora_crm'
    });

    try {
        const password = await bcrypt.hash('admin123', 10);
        
        await connection.execute('DELETE FROM users WHERE email IN (?, ?, ?)', [
            'admin@nexora.com',
            'vendedor@nexora.com',
            'gestor@nexora.com'
        ]);

        await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Admin Sistema', 'admin@nexora.com', password, 'admin']
        );

        await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['João Silva', 'vendedor@nexora.com', password, 'vendedor']
        );

        await connection.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            ['Maria Santos', 'gestor@nexora.com', password, 'gestor']
        );

        console.log('✅ Usuários criados com sucesso!');
        console.log('\nCredenciais de teste:');
        console.log('- admin@nexora.com / admin123');
        console.log('- vendedor@nexora.com / admin123');
        console.log('- gestor@nexora.com / admin123');

    } catch (error) {
        console.error('❌ Erro ao criar usuários:', error.message);
    } finally {
        await connection.end();
    }
}

createUsers();
