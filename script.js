
let players=["Joueur 1","Joueur 2"], scores=[0,0], currentPlayerIndex=0;
let words=[], wrongWords=[], currentWord="chat";
let timer, timeLeft=60, timerPaused=false, gameStarted=false, turnCount=0, maxTurns=10;

function startGame(){
  if(gameStarted) return;
  gameStarted=true;
  currentWord="chat";
  document.getElementById('currentWord').innerText=currentWord;
  updateScoreBoard();
  highlightCurrent();
  document.getElementById('wordInput').disabled=false;
  startTimer();
}

function startTimer(){
  clearInterval(timer);
  timeLeft = 60; // 1 minute
  updateTimerDisplay();
  timer=setInterval(() => {
    if(!timerPaused){
      timeLeft--;
      updateTimerDisplay();
      if(timeLeft <= 0){
        nextPlayer();
      }
    }
  }, 1000);
}

function updateTimerDisplay(){
  const minutes = Math.floor(timeLeft/60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').innerText = `⏳ Temps restant : ${minutes}:${seconds.toString().padStart(2,'0')}`;
}

function pauseGame(){
  timerPaused=!timerPaused;
  const btn=document.getElementById('pauseBtn');
  btn.innerText=timerPaused ? "Reprendre" : "Pause";
  if(timerPaused){ document.getElementById('pauseSound').play(); }
  else { document.getElementById('resumeSound').play(); }
}

function updateScoreBoard(){
  const board=document.getElementById('scoreBoard');
  board.innerHTML="";
  players.forEach((p,i)=>{
    const div=document.createElement('div');
    div.classList.add('player');
    div.id='player'+i;
    div.innerHTML=`${p}: <span id="score${i}">${scores[i]}</span>`;
    board.appendChild(div);
  });
}

function highlightCurrent(){
  document.querySelectorAll('.player').forEach(el=>el.classList.remove('current'));
  document.getElementById('player'+currentPlayerIndex).classList.add('current');
}

function checkWord(){
  const input=document.getElementById('wordInput').value.trim().toLowerCase();
  if(input==='') return;
  clearInterval(timer);
  const lastLetter=currentWord.slice(-1).toLowerCase();
  if(input[0]===lastLetter && !words.includes(input)){
    words.push(input);
    scores[currentPlayerIndex]++;
    currentWord=input;
    document.getElementById('currentWord').innerText=currentWord;
    document.getElementById('correctSound').play();
    displayWords();
  } else {
    wrongWords.push(input);
    document.getElementById('wrongSound').play();
    displayWrongWords();
  }
  document.getElementById('wordInput').value='';
  document.getElementById('score'+currentPlayerIndex).innerText=scores[currentPlayerIndex];
  turnCount++;
  if(turnCount>=maxTurns){ endGame(); }
  else { nextPlayer(); }
}

function displayWords(){
  const list=document.getElementById('wordList');
  list.innerHTML='';
  words.forEach((w,i)=>{
    const li=document.createElement('li');
    li.textContent=w;
    li.classList.add('correct');
    list.appendChild(li);
    setTimeout(()=>li.classList.add('show'),50*i);
  });
}

function displayWrongWords(){
  const list=document.getElementById('wrongList');
  list.innerHTML='';
  wrongWords.forEach((w,i)=>{
    const li=document.createElement('li');
    li.textContent=w;
    li.classList.add('incorrect');
    list.appendChild(li);
    setTimeout(()=>li.classList.add('show'),50*i);
  });
}

function nextPlayer(){
  currentPlayerIndex=(currentPlayerIndex+1)%players.length;
  highlightCurrent();
  startTimer();
}

function endGame(){
  clearInterval(timer);
  document.getElementById('wordInput').disabled=true;
  document.getElementById('replayBtn').style.display='block';
  document.getElementById('endSound').play();
  const maxScore=Math.max(...scores);
  const winners=scores.map((s,i)=>s===maxScore?players[i]:null).filter(Boolean);
  const msg=winners.length===1?`${winners[0]} a gagné avec ${maxScore} points !`:`Égalité ! ${winners.join(', ')} ont ${maxScore} points.`;
  document.getElementById('endMessage').innerText='🏁 '+msg;
  document.getElementById('endMessage').style.display='block';
}

function resetGame(){
  scores=[0,0]; currentPlayerIndex=0; words=[]; wrongWords=[]; turnCount=0;
  const sampleWords=["chat","lampe","voiture","soleil","piano","ordinateur","fleur"];
  currentWord=sampleWords[Math.floor(Math.random()*sampleWords.length)];
  document.getElementById('currentWord').innerText=currentWord;
  document.getElementById('wordInput').disabled=false;
  document.getElementById('endMessage').style.display='none';
  document.getElementById('replayBtn').style.display='none';
  document.getElementById('wordList').innerHTML='';
  document.getElementById('wrongList').innerHTML='';
  gameStarted=false; timerPaused=false;
  startGame();
}
