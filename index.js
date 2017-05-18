const ENABLE_APNG = 0;
const MAX_VIDEO = 7;
const PLAY_RATE = 0.25;
var arrVideoPos = [];
var speedRate = 1.0;
var vsno = 0;


$(function(){

  var myName = "Client"
  var socket = io('http://ioserver.isobar.com.tw:3000');

  socket.on('connect', () => {
    console.log(myName+' connect to server');
    socket.emit('AddUser', myName);
  });
  socket.on('disconnect', () => {});
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
      if (vsno <= MAX_VIDEO) {
        if (ENABLE_APNG) {
          addAnim("video"+vsno);
        }
        else {
          addVideo("video"+vsno);
        }
      }
    }
    if (cmd=='rmvideo') {
      removeVideo();
    }
    if (cmd=='speedup') {
      if (ENABLE_APNG) {
        speedupAll();
      }
      else {
        playallFaster();
      }
    }
    if (cmd=='slowdown') {
      if (ENABLE_APNG) {
        slowdownAll();
      }
      else {
        playallSlower();
      }
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

  function playallFaster() {
    speedRate = speedRate + PLAY_RATE;
    $('video').each(function(){
      this.playbackRate = speedRate;
    });
    // $('video').get(0).playbackRate = speedRate;
  }

  function playallSlower() {
    if (speedRate <= 1.0) {
      speedRate = 1.0
    }
    else {
      speedRate = speedRate - PLAY_RATE;
    }
    $('video').each(function(){
      this.playbackRate = speedRate;
    });
    // $('video').get(0).playbackRate = speedRate;
  }

  function playFaster(vid) {
    speedRate = speedRate + PLAY_RATE;
    $('#'+vid).get(0).playbackRate = speedRate;
  }

  function playSlower(vid) {
    if (speedRate <= 1.0) {
      speedRate = 1.0
    }
    else {
      speedRate = speedRate - PLAY_RATE;
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
  // APNG.animateContext("image/elephant.png", document.querySelector('#canvas_apng').getContext("2d")).then(function(anim){
  //   anim.playbackRate = 1.5;
  // });

  // 先產生 20 個 div/img
  if (ENABLE_APNG) {
    randDiv(MAX_VIDEO);
  }
  // 產生 video_pos
  genVideoPos();
});

// 加入影片
// function addVideo(vid) {
//   var video_w = 514;
//   var video_h = 541;
//   var px = (Math.random() * ($(document).width() - video_w)).toFixed();
//   var py = (Math.random() * 10).toFixed();
//   var randw = ((video_w * 0.5) + Math.random() * (video_w * 0.5)).toFixed();
//   console.log("("+px+","+py+"),"+randw);
//   $('.container').append('<div style="position:absolute;left:'+px+'px;bottom:'+py+'px"><video id="'+vid+'" width="'+randw+'" src="video/taiko.webm" autoplay="" loop=""></video></div>');
// }
function addVideo(vid) {
  var video_w = 483;
  var video_h = 452;
  var px = arrVideoPos.splice(Math.random() * arrVideoPos.length | 0, 1)[0];
  // var px = arrVideoPos[vsno-1];
  var py = 0;
  console.log("("+px+","+py+"):"+vid);
  if (vsno==MAX_VIDEO) {
    genVideoPos();
    $('video').each( function () {
      $(this).fadeOut(200);
    });
    // video play again
    if ($('#'+vid).length) {
      $('#'+vid).show();
      $('#'+vid)[0].play();
    }
    else {
      $('.container').append('<div style="position:absolute;left:'+0+'px;bottom:'+0+'px"><video id="'+vid+'" width="'+1024+'" src="video/6taiko.webm" autoplay=""></video></div>');
    }
    $('#'+vid).one('ended',function(){
      $(this).hide();
      vsno = 0;
    });
  }
  else {
    if ($('#'+vid).length) {
      $('#'+vid).show();
    }
    else {
      $('.container').append('<div style="position:absolute;left:'+px+'px;bottom:'+py+'px"><video id="'+vid+'" width="'+video_w+'" src="video/taiko.webm" autoplay="" loop=""></video></div>');
    }
  }
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

function speedupAll() {
  speedRate = speedRate + PLAY_RATE;
  video_map.forEach(function(value,key){
    value.playbackRate = speedRate;
  });
}

function slowdownAll() {
  if (speedRate <= 1.0) {
    speedRate = 1.0
  }
  else {
    speedRate = speedRate - PLAY_RATE;
  }
  video_map.forEach(function(value,key){
    value.playbackRate = speedRate;
  });
}

function genVideoPos() {
  arrVideoPos = [];
  var px = 0;
  var i = MAX_VIDEO-1;
  while (i--) {
    px = -158 + 164*i;
    arrVideoPos.push(px);
  }
}
