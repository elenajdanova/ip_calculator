import IP from './src/ip.js';
import Network from './src/network.js';


let calcBtn = document.getElementById("calcBtn");
let inIP = document.getElementById("inIP");
let inMask = document.getElementById("inMask");
let table = document.getElementById("result");
let tableBody = document.getElementById("tbody");
let errorDiv = document.getElementById("errorDiv");
let errStyle = document.querySelectorAll(".in");

calcBtn.addEventListener('click', function(e) {
    e.preventDefault();
    tableBody.innerHTML = '';

    try {
        let net = new Network(inIP.value, parseInt(inMask.value));
        let range = net.hostRange();
        let binary = net.toBinary();
        let hBin = binary.length/2;
        let netCalc = [];
        netCalc[0] = ['Full address', net.address];
        netCalc[1] = ['Version', net.version];
        netCalc[2] = ['Short address', net.toCompressed(net.address, net.version)];
        netCalc[3] = ['Type', net.printInfo()];
        netCalc[4] = ['Mask', net.getMask()];
        netCalc[5] = ['Network', net.getNetwork()];
        netCalc[6] = ['Network range', range[0] + ' -- ' + range[1]];
        net.version === 4 ? netCalc[7] = ['Broadcast', net.getBroadcast()] :
                            netCalc[7] = [];
        netCalc[8] = ['Hosts', net.networkSize()];
        netCalc[9] = ['Integer ID', net.toInteger()];
        netCalc[10] = ['Binary ID', binary.substring(0, hBin) + '  ' +
                      binary.substring(hBin, binary.length)];
        netCalc[11] = ['Hexadecimal ID', net.toHEX()];
        // just uncomment if you need these integers
        // netCalc[12] = ['Mask as integer', net.maskToInteger()];
        // netCalc[13] = ['Network as integer', net.networkToInteger()];
        // netCalc[14] = ['Broadcast as integer', net.broadcastToLong()];

        for ( let i = 0; i < netCalc.length; i++) {
            let tr = document.createElement('TR');
            for (let j = 0; j < netCalc[i].length; j++) {
                var td = document.createElement('TD')
                td.appendChild(document.createTextNode(netCalc[i][j]));
                tr.appendChild(td);
            }
        tableBody.appendChild(tr);
        };

        errorDiv.innerHTML = '';
        errStyle[0].classList.remove("error");
        errStyle[1].classList.remove("error");

    } catch (err) {
        errStyle[0].classList.add("error");
        errStyle[1].classList.add("error");
        errorDiv.innerHTML = err.message;
    }
});
