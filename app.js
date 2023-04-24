const express = require("express");
const http = require('http');
const cors = require('cors');
const { exec } = require("child_process");

// exec("ls -la", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });


const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(cors("*"))

app.get('/id', async (req, res) => {
    console.log("req-->", req.hostname)
    console.log("ip", req.query.ip)
    const ip = req.query.ip;
    const cmd = "nmap -Pn " + ip
    let output = ''
    const response = exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    })

    response.on('close', (code) => {

        console.log('process has exited', output)
        if (output) {
            return res.status(200).send({
                output
            })
        } else {
            return res.status(302).send({
                error: "Not found or invalid IP"
            })
        }

    })


    // return res.status(200).send({
    //     "check":"done"
    // })
})

app.post('/check-port', (req, res) => {
    console.log("check Port", req.body)
    const ip = req.body.text;
    const cmd = "nmap -Pn " + ip
    try {
        let output = ""
        const response = exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            output = stdout
        })

        response.on('close', (code) => {

            console.log('process has exited', output)
            if (output) {
                return res.status(200).send({
                    output
                })
            } else {
                return res.status(302).send({
                    error: "Not found or invalid IP"
                })
            }

        })

    } catch (error) {
        res.status(400).send({
            error: "some error ocuurs"
        })
    }



})

const PORT = 8080

server.listen(PORT, () => {
    console.log(`server is running on the ${PORT}`)
})

