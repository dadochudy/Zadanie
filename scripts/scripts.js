fetch('./scripts/mock.json')
    .then(response => response.json() )
    .then( json => {
        var data = json.filter((obj) => Valideate(obj) );
        data.map((obj) => {

            new MyObject(obj);

        });
    })
    .catch(err => console.log('Fetch problem: ' + err.message) );

class MyObject {

    constructor(data) {

        this.dataList = document.getElementById('data-list');

        this.showData(data)

    }
}

MyObject.prototype.showData = function (data) {

    var text = document.createTextNode(data.text);
    var newP = document.createElement('p')
    var newLi = document.createElement('li');

    newP.appendChild(text);

    setAttributes(newLi, {
        time: data.time,
        limit: data.limit
    })

    newLi.appendChild(newP);

    this.dataList.appendChild(newLi);    

    this.listener(newLi)

};

MyObject.prototype.listener = function(elem) {
    console.log(elem.getElementsByTagName('p').innerHTML);
    elem.addEventListener('click', () => this.handleClick(elem) );

}

MyObject.prototype.handleClick = function (elem) {

    var time = elem.getAttribute('data-time');
    var limit = elem.getAttribute('data-limit');

    var result = getTimeDiffrence(time, limit);

    showResult( result ,elem );

}

function showResult( result, elem ){

    removeClass('selected');
    removeClass('available');
    removeClass('unavailable');

    var resultElem = document.getElementById('result');

    resultElem.innerHTML = result.time;

    elem.classList.add('selected');

    if(result.timeLeft) {

        resultElem.classList.add('available');

    } else {

        resultElem.classList.add('unavailable');

    }
}

function removeClass(className) {

    var elem = document.getElementsByClassName(className);

    if(elem.length > 0) {

        elem[0].classList.remove(className);
        
    }
}

function addMinutes(date, minutes) {

    return new Date( date.getTime() + minutes * 60000);

}

function getTimeDiffrence (time, limit){

    var currDate = new Date();
    
    var objectTime = addMinutes( new Date(currDate.getUTCFullYear() + ' ' + (currDate.getUTCMonth()+1)+' '+ currDate.getUTCDate()+' '+time), limit);
    
    var diff = currDate - objectTime;

    var timeLeft = diff <= 0 ? true : false; 

    return {
        'time': msToHM(Math.abs(diff)),
        'timeLeft': timeLeft
    }

}

function msToHM( ms ) {
    
    var seconds = ms / 1000;

    var hours = formatTime(parseInt( seconds / 3600 ));

    seconds = seconds % 3600;

    var minutes = formatTime(parseInt( seconds / 60 ));

    return hours+':'+minutes;
}  
function formatTime(value) {

    if( value < 10) return 0+''+value;

    return value;
}

function Valideate(obj) {
    var bool = true;

    if( ! testTime(obj.time)) return false;

    for (var key in obj) {

        if (obj[key] === null || obj[key] === "" || obj[key] === undefined && bool ) {
            return bool = false;
        } 
    }

    return obj;
}

function testTime(time){

    var regEx = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    return regEx.test(time); 

}

function setAttributes(element, attributes) {

    Object.keys(attributes).forEach(function(name) {

        element.setAttribute('data-'+name, attributes[name]);
        
    });
}