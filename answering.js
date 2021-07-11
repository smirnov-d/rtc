socket.on('offer', (data) => {
  console.log('offer');
  // textelement = document.getElementById('textoffer');
  // textelement.value = JSON.stringify(data)
  clickofferpasted(data);
});

let wakeLock = null;

// Function that attempts to request a screen wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => {
      console.log('Screen Wake Lock released:', wakeLock.released);
    });
    console.log('Screen Wake Lock released:', wakeLock.released);
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

const handleVisibilityChange = async () => {
  if (wakeLock !== null && document.visibilityState === 'visible') {
    await requestWakeLock();
  }
};

document.addEventListener('visibilitychange', handleVisibilityChange);

let localStream;
// navigator.mediaDevices.getUserMedia({ video: true, audio: true })
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true })
  .then(async function(stream) {
    await requestWakeLock();
    localStream = stream;
    // localvideo.srcObject = stream;
    // localvideo.play();
  }).catch(function(err) {
  console.log("An error occurred: " + err);
});
function gotRemoteStream(e) {
  // if (calleevideo.srcObject) return;
  if (calleevideo.srcObject !== e.streams[0]) {
    calleevideo.srcObject = e.streams[0];
    calleevideo.play();
    console.log('pc1: received remote stream');
  }
}
function clickofferpasted(offer) {
  console.log('clickremoteoffer');
  // document.getElementById('buttonofferpasted').disabled = true;
  peerConnection = createPeerConnection(lasticecandidate);
  peerConnection.ontrack = gotRemoteStream;
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  peerConnection.ondatachannel = handledatachannel;
  // textelement = document.getElementById('textoffer');
  // textelement.readOnly = true;
  // offer = JSON.parse(textelement.value);
  setRemotePromise = peerConnection.setRemoteDescription(offer);
  setRemotePromise.then(setRemoteDone, setRemoteFailed);
}

function setRemoteDone() {
  console.log('setRemoteDone');
  createAnswerPromise = peerConnection.createAnswer();
  createAnswerPromise.then(createAnswerDone, createAnswerFailed);
}

function setRemoteFailed(reason) {
  console.log('setRemoteFailed');
  console.log(reason);
}

function createAnswerDone(answer) {
  console.log('createAnswerDone');
  setLocalPromise = peerConnection.setLocalDescription(answer);
  setLocalPromise.then(setLocalDone, setLocalFailed);
  // document.getElementById('spananswer').classList.toggle('invisible');
}

function createAnswerFailed(reason) {
  console.log('createAnswerFailed');
  console.log(reason);
}

function setLocalDone() {
  socket.emit('systemanswer', peerConnection.localDescription);
  console.log('setLocalDone');
}

function setLocalFailed(reason) {
  console.log('setLocalFailed');
  console.log(reason);
}

function lasticecandidate() {
  console.log('lasticecandidate');
  // textelement = document.getElementById('textanswer');
  answer = peerConnection.localDescription
  // textelement.value = JSON.stringify(answer);
}

function handledatachannel(event) {
  console.log('handledatachannel');
  dataChannel = event.channel;
  dataChannel.onopen = datachannelopen;
  dataChannel.onmessage = datachannelmessage;
}
