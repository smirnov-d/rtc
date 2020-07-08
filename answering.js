window.addEventListener('DOMContentLoaded', function () {
  // create socket client
  // emit camera ready and share socket id


})

var socket = io('https://calm-sea-76928.herokuapp.com/');

socket.on('offer', (data) => {
  console.log('offer');
  // textelement = document.getElementById('textoffer');
  // textelement.value = JSON.stringify(data)
  clickofferpasted(data);
});

socket.on('new-icecandidate', (data) => {
  console.log('new-icecandidate');
  peerConnection.addIceCandidate(data);
});

function gotRemoteStream1(e) {
  // if (calleevideo.srcObject) return;
  if (calleevideo.srcObject !== e.streams[0]) {
    calleevideo.srcObject = e.streams[0];
    calleevideo.play();
    console.log('pc1: received remote stream');
  }
}
/**/
function clickofferpasted(offer) {
  console.log('clickremoteoffer');
  document.getElementById('buttonofferpasted').disabled = true;
  peerConnection = createPeerConnection(lasticecandidate);
  peerConnection.ontrack = gotRemoteStream1;
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
  document.getElementById('spananswer').classList.toggle('invisible');
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
  textelement = document.getElementById('textanswer');
  answer = peerConnection.localDescription
  textelement.value = JSON.stringify(answer);
}

function handledatachannel(event) {
  console.log('handledatachannel');
  dataChannel = event.channel;
  dataChannel.onopen = datachannelopen;
  dataChannel.onmessage = datachannelmessage;
}
