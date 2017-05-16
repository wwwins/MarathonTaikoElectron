navigator.getUserMedia = navigator.getUserMedia
                       || navigator.webkitGetUserMedia
                       || navigator.mozGetUserMedia;

navigator.getUserMedia({ video : false, audio : true }, callback, console.log);


function callback(stream) {
    var canvas = document.querySelector('#visualizer');
    var canvasCtx = canvas.getContext("2d");
    var ctx = new AudioContext();
    var mic = ctx.createMediaStreamSource(stream);
    var analyser = ctx.createAnalyser();
    analyser.fftSize = 256;

    // gradient color for bar
    var gradient = canvasCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(1, '#0f0');
    gradient.addColorStop(0.5, '#ff0');
    gradient.addColorStop(0, '#f00');

    // 分析 mic 進來的聲音
    mic.connect(analyser);

    var w = canvas.width;
    var h = canvas.height;
    var bufferLength = analyser.frequencyBinCount;
    var data = new Uint8Array(bufferLength);
    var barWidth = (w / bufferLength) * 2.5;
    var barHeight;
    var frame_cnt = 0;
    var animation_sno = 0;

    console.log(w, h);

    canvasCtx.clearRect(0, 0, w, h);

    // get average volume
    function getAverageVolume(array) {
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;
        return average;
    }

    function draw() {

        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(data);
        var avg = getAverageVolume(data);
        if (avg>150) {
          frame_cnt++;
          console.log("cnt="+frame_cnt+",avg="+avg);
          if ((frame_cnt % 10) == 9) {
            animation_sno++;
            addVideo("animation"+animation_sno);
          }
        }

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
            // canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
            canvasCtx.fillStyle = gradient;
            // canvasCtx.fillStyle = 'hsl(0,77%,35%)';
            canvasCtx.fillRect(x, h-barHeight/2, barWidth, barHeight);

            x += barWidth + 1;
        }

        // var frequency = idx * ctx.sampleRate / analyser.fftSize;
        // console.log(frequency);

    }

    draw();
}
