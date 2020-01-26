var source = "-1";
var destination = "-1";
var found = 0;
var isDangerous = new Set();
var solPath = new Map();
function createGrid(matrixData){
    var areaParent = document.getElementById("playable-area");
    var table = document.createElement('table');
    var row = {};
    matrixData.forEach(function(rowData) {
        row = table.insertRow(-1);
        rowData.forEach(function(cellData){
            var tdCreator = document.createElement("td");
            var btnCreate = document.createElement("button");
            btnCreate.setAttribute("id",cellData[0].toString()+"_"+cellData[1].toString());
            btnCreate.setAttribute("class","btn-normal");
            btnCreate.setAttribute("transition","all 2s");
            btnCreate.setAttribute("value",cellData[0].toString()+"_"+cellData[1].toString());
            btnCreate.setAttribute("onclick",'checkGridComponent("'+cellData[0].toString()+"_"+cellData[1].toString()+'")');
            tdCreator.appendChild(btnCreate);
            row.appendChild(tdCreator);
        });
    });
    areaParent.appendChild(table);
}

function checkGridComponent(ele){
    console.log(ele);
    if(source=="-1"){
        source=ele;
        Swal.fire('Source Set')
        document.getElementById(ele).style.background='#2dce89';
    }
    else if(source!="-1" && destination=="-1"){
        destination=ele;
        Swal.fire('Destination Set');
        document.getElementById(ele).style.background='#f5365c';
    }
    else if(document.getElementById("obstacle").checked){
        document.getElementById(ele).style.background="#000000";
        isDangerous.add(ele);
    }
}

function gridGenerator(){
    var dataGenerator=[];
    for(var i=0;i<40;i++){
        var cellData=[];
        for(var j=0;j<50;j++){
            cellData.push([i,j]);
        }
        dataGenerator.push(cellData);
    }
    createGrid(dataGenerator);
}

function choseSource(){
    alert("click on any cell");
}

function choseDestination(){
    alert("click on any cell");
}
function isValid(x,y){
    if(x>=40 || y>=50 || x<0 || y<0){
        return false;
    }
    return true;
}

async function delay(delayInms) {
    return new Promise(resolve  => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
async function bfs(){
    if(source=="-1" || destination=="-1"){
        Swal.fire("Things went Wrong\n");
        return;
    }
    queue=[source];
    visited= new Set();
    visited.add(source);
    solPath.set(source,0);
    while(queue.length!=0){
        var size = queue.length;
        let delayres = await delay(200);
        for(var j=0;j<size;j++){
        var eleq=queue[0];
        var ele = queue[0].split("_");
        queue.shift();
        var x = parseInt(ele[0],10);
        var y = parseInt(ele[1],10);
        var dx=[1,-1,0,0];
        var dy=[0,0,-1,1];
        for(var i=0;i<4;i++){
            var nx=dx[i]+x;
            var ny=dy[i]+y;
            var strCheck = nx.toString()+"_"+ny.toString();
            if(strCheck==destination){
                found=1;
                solPath.set(strCheck,eleq);
                break;
            }
            if(isValid(nx,ny) && !isDangerous.has(strCheck) && !visited.has(strCheck)){
                    solPath.set(strCheck,eleq);
                    queue.push(strCheck);
                    visited.add(strCheck);
                    animate(strCheck,'#8e44ad');
                }
            }
        }
        if(found==1){
            break;
        }
    }
    setTimeout(await finalColor,100);
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Path Found',
        showConfirmButton: false,
        timer: 1500
      })
}

async function finalColor(){
    var exStart = solPath.get(destination);
    console.log(solPath);
    while(exStart!=source){
        animate(exStart,'#f1c40f');
        let delayres = await delay(120);
        exStart=solPath.get(exStart);
    }
}

function animate(strCheck,code){
    document.getElementById(strCheck).classList.toggle('.btn-normal-changed')
    document.getElementById(strCheck).style.backgroundColor=code;
    console.log("cooking the path");
}
function cookingColor(){
    console.log("cooking the color");
}

function reloadCall(){
    window.location.reload();
}