const { queryDatabase } = require('./dbConnect');
const sql = require('./dbSQL');

async function example() {
    let id = 'testuser1';
    let pw = 'password123';
    let name = '홍길동';
    let nickname = '길동이';
    let eth_addr = '0x1234567890abcdef1234567890abcdef12345678';
    let phn = '01012345678';

    // try {
    //     const result = await queryDatabase(queries.createUser,
    //         [id, pw, name, nickname, eth_addr, phn]);
    //     console.log(result);
    // } catch (err) {
    //     console.error(err);
    // }
    
    try {
        const result = await queryDatabase(sql.getTransChart);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

example();