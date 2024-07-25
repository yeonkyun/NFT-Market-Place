const { queryDatabase } = require('./dbConnect');

const queries = {
    createUser: `
      INSERT INTO users (id, pw, name, nickname, eth_addr, phn, createAt)
      VALUES (?, ?, ?, ?, ?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
    `
};

async function example() {
    let id = 'testuser1';
    let pw = 'password123';
    let name = '홍길동';
    let nickname = '길동이';
    let eth_addr = '0x1234567890abcdef1234567890abcdef12345678';
    let phn = '01012345678';

    try {
        const result = await queryDatabase(queries.createUser,
            [id, pw, name, nickname, eth_addr, phn]);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

// 테스트 로직
const testUser = {
    id: 'testuser1',
    pw: 'password123',
    name: '홍길동',
    nickname: '길동이',
    eth_addr: '0x1234567890abcdef1234567890abcdef12345678',
    phn: '01012345678'
};

example(testUser);