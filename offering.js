socket.on('answer', (data) => {
  console.log('offer');
  clickanswerpasted(data)
});

var localStream;
navigator.mediaDevices.getUserMedia({ video: false, audio: true })
  .then(function(stream) {
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

function mute() {
  localStream.getTracks().forEach(track => track.enabled = !track.enabled);
}

function clickcreateoffer() {
  console.log('clickcreateoffer');
  // document.getElementById('buttoncreateoffer').disabled = true;
  // document.getElementById('spanoffer').classList.toggle('invisible');
  peerConnection = createPeerConnection(lasticecandidate);
  peerConnection.ontrack = gotRemoteStream;
  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
  dataChannel = peerConnection.createDataChannel('chat');
  dataChannel.onopen = datachannelopen;
  dataChannel.onmessage = datachannelmessage;
  createOfferPromise = peerConnection.createOffer({offerToReceiveVideo: true});
  createOfferPromise.then(createOfferDone, createOfferFailed);
}

function createOfferDone(offer) {
  console.log('createOfferDone');
  setLocalPromise = peerConnection.setLocalDescription(offer);
  setLocalPromise.then(setLocalDone, setLocalFailed);
}

function createOfferFailed(reason) {
  console.log('createOfferFailed');
  console.log(reason);
}

function setLocalDone() {
  socket.emit('system', peerConnection.localDescription)
  console.log('setLocalDone');
}

function setLocalFailed(reason) {
  console.log('setLocalFailed');
  console.log(reason);
}

function lasticecandidate() {
  console.log('lasticecandidate');
  // textelement = document.getElementById('textoffer');
  // offer = peerConnection.localDescription;
  // textelement.value = JSON.stringify(offer);
  // document.getElementById('buttonoffersent').disabled = false;
}

// function clickoffersent() {
//   console.log('clickoffersent');
//   document.getElementById('spananswer').classList.toggle('invisible');
//   document.getElementById('buttonoffersent').disabled = true;
// }

function clickanswerpasted(answer) {
  console.log('clickanswerpasted');
  // document.getElementById('buttonanswerpasted').disabled = true;
  // textelement = document.getElementById('textanswer');
  // textelement.readOnly = true;
  // answer = JSON.parse(textelement.value);
  setRemotePromise = peerConnection.setRemoteDescription(answer);
  setRemotePromise.then(setRemoteDone, setRemoteFailed);
}

function setRemoteDone() {
  console.log('setRemoteDone');
}

function setRemoteFailed(reason) {
  console.log('setRemoteFailed');
  console.log(reason);
}

