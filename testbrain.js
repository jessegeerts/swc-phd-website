var basketball = new Image();

function init(){
  basketball.src = 'brainplayer.png';
  window.requestAnimationFrame(draw);
}

function draw() {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext('2d');

  var centre_x = c.width/2;
  var centre_y = c.height/2;

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,1000,1000); // clear canvas

  ctx.fillStyle = 'rgba(200,0,0,0.5)';
  ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  ctx.save();
  ctx.translate(500,500);

  var time = new Date();
  
  // rectangle
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(105,0);
  ctx.fillRect(0,-12,50,50);
  
  ctx.save();
  ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
  ctx.translate(0,28.5);
  ctx.drawImage(basketball,-300.5,-30.5,60,60);
  ctx.restore();
  ctx.restore();
  
  window.requestAnimationFrame(draw);
}

init();