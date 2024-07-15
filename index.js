
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger-container');
const sidebar = document.getElementById('sidebar');
const arrowBack = document.getElementById('arrowBack');
let sidebarActive = false;
const moreDescrip = ['For my Engineering Fundamentals class, we were tasked showcasing a mythological scene of our choice. This scene was to contain two states: a passive state and an active state. We showcased the chinese dragon. Our passive state consisted of all of the LEDs on. Our active state was intiated by waving your hand over the ultrasonic sensor. This would make the lights flash in a pattern, activate the stepper motor that turned the crank shaft for the dragon to "fly", and played a chinese themed tune through a buzzer. Language: C++',
    'This program makes use of the OpenWeatherMap API to the current weather data of a city or country. The user can input a city or country and the program will add a weather card of the city/country with the current weather data. Language: Javascript',
    'This program is an implementation of a hash table. The user can input a key and value pair and the program will hash the key and store the value in the hash table. This program has two hash functions: Last7 & XOR; And two collision strategies: Linear Probing & double Hasing. The user can then print all of the key value pairs in the table. Language: C++',
    'This was an independent project sparked from a video exemplifying linear regression using the tensorflow.js api. I wanted to see if I could create a polynomial regression model using the same concepts. Language: Javascript(Tensorflow.js & p5.js)',
    '',
    ];
const imgUrl = ['Elements/EFCompress.png', 'Elements/0708.gif', 'Elements/HashTableSS.jpg', 'Elements/0620(1).gif'];
function scrollToSection(ElementId) {
    document.getElementById(ElementId).scrollIntoView({ behavior: 'smooth' });
}

window.addEventListener('scroll', function (event) {
    if (this.window.scrollY > 200 && sidebarActive == false) {
        navbar.style.transform = "translateY(-100%)";
        burger.style.transform = "translateX(0%)";
    }


    if (this.window.scrollY < 200) {
        navbar.style.transform = "translateY(0%)";
        burger.style.transform = "translateX(-100%)";
        sidebar.style.transform = "translateX(-100%)";
        sidebarActive = false;
    }
});



burger.addEventListener('click', function () {
    burger.style.transform = "translateX(-100%)";
    sidebar.style.transform = "translateX(0%)";
    sidebarActive = true;
    setTimeout(() => {},500);
});

document.addEventListener('click', function (event) {

    if(sidebarActive){
        if(event.target.id != "sidebar" && event.target.id != "burger-container" && event.target.id != "arrowBack"){
            console.log('clicked outside');
            sidebar.style.transform = "translateX(-100%)";
            burger.style.transform = "translateX(0%)";
            sidebarActive = false;
        }
    }
});

arrowBack.addEventListener('click', function () {
    sidebar.style.transform = "translateX(-100%)";
    burger.style.transform = "translateX(0%)";
    sidebarActive = false;
});

function moreInfo(Index) {
    let description = moreDescrip[Index];
    let imgURL = imgUrl[Index];
    const newDescription = document.createElement('p');
    const newDescripContainer = document.createElement('div');
    const image = document.createElement('img');

    image.src = imgURL;
    image.classList.add('moreDescripImg');
    newDescription.textContent = description;
    newDescription.classList.add('moreDescrip');
    newDescription.classList.add('hidden');
    newDescription.id = 'newDescription';
    newDescripContainer.classList.add('descripContainer');
    newDescripContainer.id = 'newDescripContainer';
    document.body.append(newDescripContainer);
    document.getElementById('newDescripContainer').append(newDescription);
    document.getElementById('newDescription').prepend(image);

    setTimeout(() => {
        newDescription.classList.replace('hidden', 'visible');

    }, 50);


    document.getElementById("newDescripContainer").addEventListener('click', function (event) {
        if (event.target.id != 'newDescription') {
            newDescription.classList.replace('visible', 'hidden');
            setTimeout(() => {
                document.getElementById('newDescripContainer').removeChild(newDescription);
                document.body.removeChild(newDescripContainer);
            }, 200);

        }

    });
}


