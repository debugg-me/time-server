const assert = require('assert');
const net = require('net');
const exec = require('child_process').exec;

function test() {
    let client = net.connect({ port: 31337 });
    
    client.on('data', (data) => {
        // convert Buffer to String and remove line breaks
        data = String(data).replace(/(\r\n|\n|\r)/gm,"");

        // check if the datetime is in required format
        const date = data.split(' ')[0];
        const time = data.split(' ')[1];
    
        // Regular expression for YYYY-MM-DD
        const date_re = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
        try {
            assert.equal(date_re.test(date), true);
            console.log('Test succeeded: Date');
        } catch (error) {
            console.log('Test failed: Date');
            console.log(error);
        }
    
        // Regular expression for hh:mm
        const time_re = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        try {
            assert.equal(time_re.test(time), true);
            console.log('Test succeeded: Time');
        } catch (error) {
            console.log('Test failed: Time');
            console.log(error);
        }
    
        // close the socket connection
        client.end();
    });
}

async function runTest() {
    // run the TCP server
    const server = await exec('node time-server.js');

    // run the test
    await test();

    // send kill signal to server script
    server.kill();
}

// finally run the tests
runTest();