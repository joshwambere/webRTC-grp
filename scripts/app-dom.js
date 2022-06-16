const mainStream = document.getElementById('user');
const streams = document.getElementsByName('player-container');
const userIdInDisplayed = null;

const expandedStream = async(e)=>{
    let child = mainStream.children[0];
    if(child){
        document.getElementById('video-container').appendChild(child);
    }

    mainStream.style.display = "block";
    mainStream.appendChild(e.currentTarget)
    streams.forEach(stream => {
        stream.style.width='170px';
        stream.style.height='100px';
    })
}

streams.forEach(stream => {
    stream.addEventListener('click', expandedStream);
})





