navigator.getUserMedia = navigator.getUserMedia
                       || navigator.webkitGetUserMedia
                       || navigator.mozGetUserMedia;

navigator.getUserMedia({ video : false, audio : true }, callback, console.log);


function callback(stream) {
    var canvas = document.querySelector('.visualizer');
    var canvasCtx = canvas.getContext("2d");
    var ctx = new AudioContext();
    var mic = ctx.createMediaStreamSource(stream);
    var analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    // 分析 mic 進來的聲音
    mic.connect(analyser);

    var w = canvas.width;
    var h = canvas.height;
    var bufferLength = analyser.frequencyBinCount;
    var data = new Uint8Array(bufferLength);
    var barWidth = (w / bufferLength) * 2.5;
    var barHeight;

    console.log(w, h);

    canvasCtx.clearRect(0, 0, w, h);

    function draw() {

        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(data);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.clearRect(0, 0, w, h);

        // get fullest bin
        var x = 0;
        // var idx = 0;
        for (var j=0; j < bufferLength; j++) {
            // if (data[j] > data[idx]) {
            //     idx = j;
            // }
            barHeight = data[j];
            canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasCtx.fillRect(x, h-barHeight/2, barWidth, barHeight);

            x += barWidth + 1;
        }

        // var frequency = idx * ctx.sampleRate / analyser.fftSize;
        // console.log(frequency);

    }

    draw();
}
