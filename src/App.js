import './App.css';
import Sketch from 'react-p5';
import {useRef, useState} from 'react';
import {Controls} from './Controls';
import {Point} from './Point';

const config = {
  // canvasSize: {height: window.innerHeight, width: window.innerWidth},
  canvasSize: {height: 800, width: 800},
  drawInitialPoint: true,
  speed: 50,
  ratio: 2,
};

function App() {
  const [run, setRun] = useState(false);
  // const [topPoint, setTopPoint] = useState(new Point(0, 0));
  // const [leftPoint, setLeftPoint] = useState(new Point(0, 0));
  // const [rightPoint, setRightPoint] = useState(new Point(0, 0));
  const elementRef = useRef(null);

  const margin = 15;
  const topPoint = new Point(config.canvasSize.width / 2, margin);
  const leftPoint = new Point(margin, config.canvasSize.height - margin);
  const rightPoint = new Point(config.canvasSize.width - margin, config.canvasSize.height - margin);
  let initialPoint = new Point(0, 0);

  // get random point within triangle
  const randomInitialPoint = (p5) => {
    const t = p5.random();
    const s = p5.random();

    const a = 1 - p5.sqrt(t);
    const b = (1 - s) * p5.sqrt(t);
    const c = s * p5.sqrt(t);

    /* Calculate the Point Q*/
    const qx = a * topPoint.x + b * leftPoint.x + c * rightPoint.x;
    const qy = a * topPoint.y + b * leftPoint.y + c * rightPoint.y;

    if (config.drawInitialPoint) {
      /* Draw the point on the Canvas */
      p5.fill(255, 0, 0);
      p5.circle(qx, qy, 5);
    }
    return new Point(qx, qy);
  };

  //draw initial three points of triangle
  const drawTriangle = (p5) => {
    // const topPoint = new Point(config.canvasSize.width / 2, margin);
    // const leftPoint = new Point(margin, config.canvasSize.height - margin);
    // const rightPoint = new Point(config.canvasSize.width - margin, config.canvasSize.height - margin);

    // setTopPoint(new Point(config.canvasSize.width / 2, margin));
    // setLeftPoint(new Point(margin, config.canvasSize.height - margin));
    // setRightPoint(new Point(config.canvasSize.width - margin, config.canvasSize.height - margin));
    p5.fill(0);
    p5.circle(topPoint.x, topPoint.y, 5);
    p5.circle(leftPoint.x, leftPoint.y, 5);
    p5.circle(rightPoint.x, rightPoint.y, 5);
  };

  const drawRandomPoint = (p5) => {
    const randomTrianglePoint = p5.random([topPoint, leftPoint, rightPoint]);
    initialPoint = {
      x: (randomTrianglePoint.x + initialPoint.x) / config.ratio,
      y: (randomTrianglePoint.y + initialPoint.y) / config.ratio,
    };
    p5.point(initialPoint.x, initialPoint.y);
  };

  const setup = (p5, canvasParentRef) => {
    // p5.createCanvas(p5.windowHeight, p5.windowWidth).parent(canvasParentRef);
    p5.createCanvas(config.canvasSize.height, config.canvasSize.width).parent(canvasParentRef);

    initialPoint = randomInitialPoint(p5);
    drawTriangle(p5);
  };

  const draw = (p5) => {
    for (let i = 0; i < config.speed; i++) {
      drawRandomPoint(p5);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerHeight, window.innerWidth);
  };

  const pauseAction = () => {
    setRun(false);
  };

  const playAction = () => {
    setRun(true);
  };

  console.log(elementRef.current?.clientHeight);

  return (
    <div className="App" ref={elementRef}>
      <Controls run={run} play={playAction} pause={pauseAction} />
      <Sketch setup={setup} draw={run ? draw : () => {}} windowResized={windowResized} />
    </div>
  );
}

export default App;
