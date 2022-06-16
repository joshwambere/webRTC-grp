let app_id="95b2b4f4603a43a2842839ed6c175667";
let uid = sessionStorage.getItem("uid")
    ? sessionStorage.getItem("uid")
    : String(Math.floor(Math.random() * 10000));
let token = null;
let client;

const Url = window.location.search;
const urlParams = new URLSearchParams(Url);
const roomId = urlParams.get('room');

let localTrack = [];
let remoteUsers = {};


const joinRoom = async () => {
    client = await AgoraRTC.createClient({mode:'rtc', codec:'vp8'});
    await client.join(app_id, roomId, token, uid);
    client.on('user-published', handleNewMember);
    client.on('user-left', handleUserLeft);
    await getStream()
}

const getStream = async()=>{
    localTrack = await AgoraRTC.createMicrophoneAndCameraTracks({},{encoderConfig:{
            width:{
                min:640,
                ideal:1920,
                max:1920
            },
            height:{
                min:480,
                ideal:1080,
                max:1080
            }
        }})
    let player = `<div class="player-container" id="user-container-${uid}">
                    <div class="video-player" id="user-id-${uid}">
                       
                    </div>
                </div>`
    document.getElementById('user').insertAdjacentHTML('beforeend', player);
    document.getElementById(`user-container-${uid}`).addEventListener('click', expandedStream);

    localTrack[1].play(`user-id-${uid}`);
    await client.publish([localTrack[0],localTrack[1]])
}

const handleNewMember = async(user, mediaType)=>{
    remoteUsers[user.uid] = user;
    await client.subscribe(user, mediaType);

    let player =document.getElementById(`user-container-${user.uid}`)

    if(player===null){
       player=`<div class="player-container" id="user-container-${user.uid}">
                    <div class="video-player" id="user-id-${user.uid}">
                       
                    </div>
                </div>`

        document.getElementById('video-container').insertAdjacentHTML('beforeend', player);
        document.getElementById(`user-container-${user.uid}`).addEventListener('click', expandedStream);
    }

    if (mediaType=== 'video'){
        user.videoTrack.play(`user-id-${user.uid}`)

    }
    if (mediaType=== 'audio'){
        user.audioTrack.play()
    }
}

const handleUserLeft = async(user)=>{
    delete remoteUsers[user.uid];
    document.getElementById(`user-container-${user.uid}`).remove();


}

const toggleMute = async(e)=>{
    let btn = e.currentTarget;
    await localTrack[0].setMuted(!localTrack[0].muted);
    localTrack[0].muted? btn.classList.add('muted') : btn.classList.remove('muted');
}

const toggleVideo = async(e)=>{
    let btn = e.currentTarget;
    await localTrack[1].setMuted(!localTrack[1].muted);
    localTrack[1].muted? btn.classList.add('muted') : btn.classList.remove('muted');
}
document.getElementById('camera-btn').addEventListener('click', toggleVideo);
document.getElementById('mic-btn').addEventListener('click', toggleMute);

joinRoom()
