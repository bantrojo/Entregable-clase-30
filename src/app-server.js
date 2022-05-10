const express = require('express');
const cluster = require('cluster');
const os = require('os');



module.exports = sv_cluster;


//numero de procesos del cpu
const numeroCPUs = os.cpus().length;



if (cluster.isPrimary) {

    for (let i = 0; i < numeroCPUs; i++) {
        cluster.fork();

    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`el procesi ${worker.process.pid} murio`);
        cluster.fork()
    })

} else {
    app.listen(PORT, (req, res) => {
        console.log(`running process ${process.pid} on port ${PORT}`);
    })
}



const PORT = process.env.PORT || 8080;