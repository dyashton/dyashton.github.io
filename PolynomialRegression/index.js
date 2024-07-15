const x_vals = [];
const y_vals = [];
let b;
const coeff = [];
const learningRate = 0.1;
let funcdegree = 1;
const optimizer = tf.train.momentum(learningRate, 0.8);


function setup() {
    let myCanvas = createCanvas(400, 400);
    myCanvas.parent('canvasContainer');
    for (let i = 0; i < funcdegree; i++) {
        coeff.push(tf.variable(tf.scalar(random(-1, 1))));
    }
    b = tf.variable(tf.scalar(random(-1, 1)));
    loadHTML();
}

function predict(x) {
    const xs = tf.tensor1d(x);
    let sum = tf.scalar(0);
    for (let i = 0; i < coeff.length; i++) {
        sum = sum.add(coeff[i].mul(xs.pow(tf.scalar(i + 1))));
    }
    const ys = sum.add(b);
    return ys;

}

function loss(pred, labels) {
    return pred.sub(labels).square().mean();
}


function mousePressed() {
    if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
        let x = map(mouseX, 0, width, -1, 1);
        let y = map(mouseY, 0, height, 1, -1);

        x_vals.push(x);
        y_vals.push(y);
    }
    
}

function draw() {

    tf.tidy(() => {
        if (x_vals.length > 0) {
            const ys = tf.tensor1d(y_vals);
            optimizer.minimize(() => loss(predict(x_vals), ys));
        }
    });


    background(0);
    stroke(255);
    strokeWeight(8);
    for (let i = 0; i < x_vals.length; i++) {
        let px = map(x_vals[i], -1, 1, 0, width);
        let py = map(y_vals[i], -1, 1, height, 0);
        point(px, py);
    }

    const curveX = [];
    for (let x = -1; x <= 1.01; x += 0.05) {
        curveX.push(x);
    }
    const ys = tf.tidy(() => predict(curveX));
    let curveY = ys.dataSync();
    ys.dispose();

    beginShape();
    noFill();
    stroke(255);
    strokeWeight(2);
    for (let i = 0; i < curveX.length; i++) {
        let x = map(curveX[i], -1, 1, 0, width);
        let y = map(curveY[i], -1, 1, height, 0);
        vertex(x, y);
    }
    endShape();
}
function loadHTML() {
        const instruct = document.createElement('h3');
        const inputBox = document.createElement('input');
        const htmlContainer = document.createElement('div');
        const btnContainer = document.createElement('div');
        const resetBtn = document.createElement('button');

        instruct.innerText = 'Degree of Polynomial: ';
        instruct.id = 'title';
        inputBox.value = 1;
        inputBox.type = 'number';
        inputBox.min = 1;
        inputBox.id = 'degree';
        htmlContainer.id = 'container';
        resetBtn.id = 'reset';
        btnContainer.id = 'btnContainer';

        document.body.append(htmlContainer);
        htmlContainer.appendChild(instruct);
        htmlContainer.append(inputBox);
        htmlContainer.appendChild(btnContainer);
        btnContainer.appendChild(resetBtn);
        resetBtn.innerText = 'Reset';

    inputBox.addEventListener('change', (e) => {
        funcdegree = e.target.value;
        coeff.length = 0;
        for (let i = 0; i < funcdegree; i++) {
            coeff.push(tf.variable(tf.scalar(random(-1, 1))));
        }

    });

    resetBtn.addEventListener('click', () => {
        x_vals.length = 0;
        y_vals.length = 0;
        console.log('reset');
    });
}

