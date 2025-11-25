import Quagga from 'quagga';

export default function Scanner(elementId, onDetected) {
    const element = document.getElementById(elementId);
    if (!element) return;

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: element,
            constraints: {
                facingMode: "environment"
            },
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader"]
        }
    }, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        onDetected(data.codeResult.code);
        Quagga.stop();
    });
}
