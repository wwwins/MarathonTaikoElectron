$(function(){

  var vsno = 0;
  var PlayRate = 0.25;
  var myName = "Client"
  var socket = io('http://localhost:3000');

  socket.on('connect', function(){
    console.log(myName+' connect to server')
    socket.emit('AddUser', myName);

  });
  socket.on('disconnect', function(){});
  socket.on('ALL', function(data){
    console.log('all message: ' + data);
    var cmd = data.split(' ')[0].toLowerCase();
    var arg = data.split(' ')[1];

    if (cmd=='play') {
      playVideo(arg);
    }
    if (cmd=='pause') {
      pauseVideo(arg);
    }
    if (cmd=='fff') {
      playallFaster();
    }
    if (cmd=='sss') {
      playallSlower();
    }
    if (cmd=='ff') {
      playFaster(arg);
    }
    if (cmd=='ss') {
      playSlower(arg);
    }
    if (cmd=='playall') {
      playallVideo();
    }
    if (cmd=='pauseall') {
      pauseallVideo();
    }
    if (cmd=='addvideo') {
      vsno++;
      // addVideo("video"+vsno);
      addAnim("video"+vsno);
    }
    if (cmd=='rmvideo') {
      removeVideo();
    }
    if (cmd=='speedup') {
      speedupAll();
    }
    if (cmd=='slowdown') {
      slowdownAll();
    }
  });

  function playVideo(vid) {
    $('#'+vid).toggle();
    $('#'+vid).get(0).play();
  }

  function pauseVideo(vid) {
    $('#'+vid).toggle();
    // $('#'+vid).get(0).pause();
  }

  function playallVideo() {
    $('video').show();
    $('video').each(function(){$(this).get(0).play();});
  }

  function pauseallVideo() {
    hideAll();
    // $('video').each(function(){$(this).get(0).pause();});
  }

  // hide all videos
  function hideAll() {
    $('video').hide();
  }

  var speedRate = 1.0;
  function playallFaster() {
    speedRate = speedRate + PlayRate;
    $('video').each(function(){$(this).playbackRate = speedRate;});
    // $('video').get(0).playbackRate = speedRate;
  }

  function playallSlower() {
    if (speedRate <= 1.0) {
      speedRate = 1.0
    }
    else {
      speedRate = speedRate - PlayRate;
    }
    $('video').each(function(){$(this).playbackRate = speedRate;});
    // $('video').get(0).playbackRate = speedRate;
  }

  function playFaster(vid) {
    speedRate = speedRate + PlayRate;
    $('#'+vid).get(0).playbackRate = speedRate;
  }

  function playSlower(vid) {
    if (speedRate <= 1.0) {
      speedRate = 1.0
    }
    else {
      speedRate = speedRate - PlayRate;
    }
    // $('#').each(function(){$(this).playbackRate = speedRate;});
    $('#'+vid).get(0).playbackRate = speedRate;
  }

  // <div class="level3">
  //   <img src="image/animated24.png" width="640" height="360">
  // </div>
  function randDiv(n) {
    var video_w = 640;
    var video_h = 360;

    for (var i = 1; i<n ; i++) {
      var vid = "video" + i;
      var px = (Math.random() * ($(document).width() - video_w)).toFixed();
      var py = (Math.random() * 100).toFixed();
      var randw = ((video_w * 0.5) + Math.random() * (video_w * 0.5)).toFixed();
      var randh = (randw * (360/640)).toFixed();
      $('.container').append('<div style="position:absolute;left:'+px+'px;bottom:'+py+'px"><img id="'+vid+'" width="'+randw+'" height="'+randh+'" src="image/animated24.png"></div>');
    }
    $('img').hide();
  }

  // hideAll();
  // for (var i=0;i<10; i++) {
  //   addVideo("video"+i);
  // }

  // APNG
  // APNG.ifNeeded().then(function () {
  //   $(".container").find("img").each(function () {
  //     $(this).show();
  //     APNG.animateImage(this);
  //   });
  // })

  // APNG.parseURL("image/elephant.png").then(function(anim){
  //   var canvas = document.querySelector('#canvas_apng');
  //   anim.addContext(canvas.getContext("2d"));
  //   anim.playbackRate = 1.0;
  //   anim.play();
  //   console.log("playTime:"+anim.playTime);
  // });
  // 類似上面做法
  APNG.animateContext("image/elephant.png", document.querySelector('#canvas_apng').getContext("2d")).then(function(anim){
    anim.playbackRate = 1.5;
  });

  // 先產生 20 個 div/img
  randDiv(20);
});

// 加入影片
function addVideo(vid) {
  var video_w = 640;
  var video_h = 360;
  var px = (Math.random() * ($(document).width() - video_w)).toFixed();
  var py = (Math.random() * 100).toFixed();
  var randw = ((video_w * 0.5) + Math.random() * (video_w * 0.5)).toFixed();
  console.log("("+px+","+py+"),"+randw);
  $('.container').append('<div style="position:absolute;left:'+px+'px;bottom:'+py+'px"><video id="'+vid+'" width="'+randw+'" src="video/test2M.webm" autoplay="" loop=""></video></div>');
}

var video_map = new Map();
function addAnim(aid) {
  console.log("addAnim:"+aid);
  APNG.ifNeeded().then(function () {
    $('#'+aid).show();
    return APNG.animateImage($('#'+aid)[0]);
    console.log("animated");
  }).then(function (anim) {
    // anim.playbackRate = 1.5;
    // hash[aid] = anim;
    video_map.set(aid, anim);
  })
}

var PlayRate = 0.25;
var speedRate = 1.0;
function speedupAll() {
  speedRate = speedRate + PlayRate;
  video_map.forEach(function(value,key){
    value.playbackRate = speedRate;
  });
}

function slowdownAll() {
  if (speedRate <= 1.0) {
    speedRate = 1.0
  }
  else {
    speedRate = speedRate - PlayRate;
  }
  video_map.forEach(function(value,key){
    value.playbackRate = speedRate;
  });
}
