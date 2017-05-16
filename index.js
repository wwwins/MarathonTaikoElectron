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
      addVideo("video"+vsno);
    }
    if (cmd=='rmvideo') {
      removeVideo();
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
    if (speedRate > 1.0) {
      speedRate = 1.0
    }
    else {
      speedRate = speedRate + PlayRate;
    }
    $('video').each(function(){$(this).playbackRate = speedRate;});
    // $('video').get(0).playbackRate = speedRate;
  }

  function playFaster(vid) {
    speedRate = speedRate + PlayRate;
    $('#'+vid).get(0).playbackRate = speedRate;
  }

  function playSlower(vid) {
    if (speedRate > 1.0) {
      speedRate = 1.0
    }
    else {
      speedRate = speedRate + PlayRate;
    }
    // $('#').each(function(){$(this).playbackRate = speedRate;});
    $('#'+vid).get(0).playbackRate = speedRate;
  }

  // hideAll();
  // for (var i=0;i<10; i++) {
  //   addVideo("video"+i);
  // }

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
