let minus = document.querySelector('.minus');
let plus = document.querySelector('.plus');
let makeLadder = document.querySelector('.button');
let count = 4;
let imgName = '';
let destNum = '';
let insertCanvas = '';

// //이미지 객체 불러오기
// var img1 = new Image();
// img1.src = "img/1.png";


//인원수를 줄였을 때의 작업
minus.addEventListener('click',()=>{
    if(count > 2) {
        imgName = "";
        destNum = ""
        count--;
        document.getElementById("num_name").innerHTML = count.toString();;
        for(let i = 1; i <=count; i++) {
            imgName += '<li><img src="img/' + i.toString() + '.png" alt=""></li>'
            destNum += '<li id = "dest' + i.toString() + '">' + i.toString() + '</li>'
        }
        document.getElementById("animal_image").innerHTML = imgName;
        document.getElementById('destination_list').innerHTML = destNum;
    }
    else{
        alert("더이상 줄일 수 없습니다!");
    }
});

//인원수를 늘렸을 때의 작업
plus.addEventListener('click',()=>{
    if(count < 4) {
        imgName = "";
        destNum = ""
        count++;
        document.getElementById("num_name").innerHTML = count.toString();

        for(let i = 1; i <=count; i++) {
            imgName += '<li><img src="img/' + i.toString() + '.png" alt=""></li>'
            destNum += '<li id = "dest' + i.toString() + '">' + i.toString() + '</li>'
        }
        document.getElementById("animal_image").innerHTML = imgName;
        document.getElementById('destination_list').innerHTML = destNum;
    }
    else{
        alert("더이상 늘릴 수 없습니다!");
    }
});

//start버튼을 눌렸을 때의 작업
makeLadder.addEventListener('click',()=>{
    var form = {
        userNum : count
    }
    $.ajax({
        url: "/start/ladder",
        type: "POST",
        data: form,
        dataType : 'json',
        success: function(data){
            //html 수정
            insertCanvas = '<canvas id = \"paper\" class = \"ladder_paper\" ></canvas>';
            document.getElementById("ladder_body").innerHTML = insertCanvas;

            //사다리 작업 수행
            createLadder(data);
        },
        error: function(){
            alert("통신 중 에러가 발생했습니다.");
        }
    });
});

/*
 *사다리를 만드는 작업
 * @Param : 컨트롤러에서 임의의 사다리에 대한 정보
 */
function createLadder(data){
    let canvas = document.getElementById("paper"),
        c = canvas.getContext("2d"),
        TWO_PI = Math.PI * 2;
    let cutVertical = [];
    let cutHorizontal = [];
    let horizontalTerm = 0;
    let insertHorizontal = 0;
    let horizontalIdx = 0;
    let verticalIdx = 0;

    let horizontalDivCnt = count + 3;

    if(count === 4){
        //수직선 저장
        cutVertical.push(45);
        cutVertical.push(120);
        cutVertical.push(200);
        cutVertical.push(280);

        //가로선 저장
        horizontalTerm = (canvas.height-10) / horizontalDivCnt;
        cutHorizontal.push(0);
        for(let i  = 1; i <= horizontalDivCnt; i++){
            insertHorizontal = horizontalTerm * i;
            cutHorizontal.push(insertHorizontal);
        }
        cutHorizontal.push(canvas.height);
    }
    else if(count === 3){
        //수직선 저장
        cutVertical.push(62);
        cutVertical.push(160);
        cutVertical.push(260);

        //가로선 저장
        horizontalTerm = (canvas.height-10) / horizontalDivCnt;
        cutHorizontal.push(0);
        for(let i  = 1; i <= horizontalDivCnt; i++){
            insertHorizontal = horizontalTerm * i;
            cutHorizontal.push(insertHorizontal);
        }
        cutHorizontal.push(canvas.height);
    }
    else if(count === 2){
        //수직선 저장
        cutVertical.push(80);
        cutVertical.push(240);

        //가로선 저장
        horizontalTerm = (canvas.height-10) / horizontalDivCnt;
        cutHorizontal.push(0);
        for(let i  = 1; i <= horizontalDivCnt; i++){
            insertHorizontal = horizontalTerm * i;
            cutHorizontal.push(insertHorizontal);
        }
        cutHorizontal.push(canvas.height);
    }

    c.fillStyle = "white";
    c.fillRect(0,0,canvas.width,canvas.height);

    c.strokeStyle = "balck";
    c.lineWidth = 2;

    //세로선을 지정
    for(let i = 0 ; i < cutVertical.length; i++){
        c.beginPath();
        c.moveTo(cutVertical[i],0);
        c.lineTo(cutVertical[i],150);
        c.stroke();
    }

    //가로선을 그리는 작업
    console.log(data);
    console.log(cutVertical);
    console.log(cutHorizontal)
    $.each(data,function(i,v){
        //데이터 인풋
        horizontalIdx = Number(v.horizontal);
        verticalIdx = Number(v.vertical);
        console.log(horizontalIdx);
        console.log(verticalIdx);

        c.beginPath();
        c.moveTo(cutVertical[verticalIdx],cutHorizontal[horizontalIdx+1]);
        c.lineTo(cutVertical[verticalIdx+1],cutHorizontal[horizontalIdx+1]);
        c.stroke();

    });
    console.log("날아간 데이터");
    console.log(data);

    imageDown(data,cutVertical,cutHorizontal,0)

}


/*
 * 이미지 떨어짐 구현
 * data : 현재 사다리의 상태
 * cutVertical : 수직 좌표정보
 * cutHorizontal : 수평 좌표정보
 * unitNum : 현재 유낫의 정보
 */
function imageDown(data,cutVertical,cutHorizontal,unitNum){
    let canvas = document.getElementById("paper"),
        c = canvas.getContext("2d"),
        TWO_PI = Math.PI * 2;
    let horizontalDivCnt = count + 3;
    let horizontalIdx = 0;
    let verticalIdx = 0;


    //데이터의 상태를 Map으로 저장
    let map = new Array(horizontalDivCnt+2);
    for(let i = 0 ; i < map.length; i++){
        map[i] = new Array(count);
    }
    for(let i = 0; i < map.length; i++){
        for(let j = 0 ; j < map[i].length; j++){
            map[i][j] = 0;
        }
    }

    $.each(data,function(i,v){
        //데이터 인풋
        horizontalIdx = Number(v.horizontal);
        verticalIdx = Number(v.vertical);

        map[horizontalIdx+1][verticalIdx] = 1;
    });

    //유닛에 따른 초기값 설정
    let currentLocation = unitNum;
    let lineColor = "";
    if(unitNum === 0){
        lineColor = "red";
    }
    else if(unitNum === 1){
        lineColor = "blue";
    }
    else if(unitNum === 2){
        lineColor = "green";
    }
    else{
        lineColor = "purple"
    }

    let posY = 0;
    horizontalIdx = 1;
    let directionCheck = 0; //0은 세로방향, 1은 가로방향
    let prevLocation;
    let nextLocation;
    let interval = setInterval(function () {

        //중지조건
        if(posY >= cutHorizontal[cutHorizontal.length-1] - 5){
            c.fillStyle = lineColor;
            c.beginPath();
            c.arc(cutVertical[currentLocation], posY, 1.5, 0, TWO_PI, false);
            c.fill();
            posY += 1;
        }
        else if(posY === cutHorizontal[cutHorizontal.length-1]){
            //5만큼 더 움직이고 나감
            clearInterval(interval);
        }
        //가로선으로 움직이는 작업
        else if(directionCheck === 1){
            if(prevLocation > nextLocation){
                directionCheck = 0;
            }
            else {
                c.fillStyle = lineColor;
                c.beginPath();
                c.arc(prevLocation, posY, 1.5, 0, TWO_PI, false);
                c.fill();
                prevLocation += 1;
            }

        }
        else if(directionCheck === 2){
            if(prevLocation < nextLocation){
                directionCheck = 0;
            }
            else {
                c.fillStyle = lineColor;
                c.beginPath();
                c.arc(prevLocation, posY, 1.5, 0, TWO_PI, false);
                c.fill();
                prevLocation -= 1;
            }
        }
        else if(posY < cutHorizontal[horizontalIdx] && directionCheck === 0) {
            c.fillStyle = lineColor;
            c.beginPath();
            c.arc(cutVertical[currentLocation], posY, 1.5, 0, TWO_PI, false);
            c.fill();
            posY += 1;
        }
        else if(posY >= cutHorizontal[horizontalIdx]){
            console.log(horizontalIdx);
            console.log(currentLocation);

            if(currentLocation === 0){
                if(map[horizontalIdx][currentLocation] === 1){
                    directionCheck = 1;
                    prevLocation = cutVertical[currentLocation];
                    nextLocation = cutVertical[currentLocation + 1];
                    currentLocation += 1;
                }
                horizontalIdx += 1;
            }
            else if(currentLocation === (cutVertical.length - 1)){
                if(map[horizontalIdx][currentLocation-1] === 1){
                    directionCheck = 2;
                    prevLocation = cutVertical[currentLocation];
                    nextLocation = cutVertical[currentLocation - 1];
                    currentLocation -= 1;
                }
                horizontalIdx += 1;
            }
            else{
                if(map[horizontalIdx][currentLocation] === 1){
                    directionCheck = 1;
                    prevLocation = cutVertical[currentLocation];
                    nextLocation = cutVertical[currentLocation + 1];
                    currentLocation += 1;
                }
                else if(map[horizontalIdx][currentLocation-1] === 1){
                    directionCheck = 2;
                    prevLocation = cutVertical[currentLocation];
                    nextLocation = cutVertical[currentLocation - 1];
                    currentLocation -= 1;
                }
                horizontalIdx += 1;
            }
        }
    }, 30);
}