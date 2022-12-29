import './App.css';
import Sketch from 'react-p5';
import {useRef, useState} from 'react';
import {Controls} from './Controls';
import {Point} from './Point';
import {hot} from 'react-hot-loader';

const config = {
  canvasSize: {height: 800, width: 800},
  drawInitialPoint: true,
  speed: 50,
  ratio: 2,
};

function App() {
  const [isStarted, setStarted] = useState(false);
  const [canvasInstance, setCanvasInstance] = useState(null);
  const elementRef = useRef(null);
  let initialPoint = new Point(0, 0); // state not used because it's really slow

  const margin = 15;
  const topPoint = new Point(config.canvasSize.width / 2, margin);
  const leftPoint = new Point(margin, config.canvasSize.height - margin);
  const rightPoint = new Point(config.canvasSize.width - margin, config.canvasSize.height - margin);

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

  // draw initial three points of triangle
  const drawTriangle = (p5) => {
    p5.fill(0);
    p5.circle(topPoint.x, topPoint.y, 5);
    p5.circle(leftPoint.x, leftPoint.y, 5);
    p5.circle(rightPoint.x, rightPoint.y, 5);
  };

  const initActions = (p5) => {
    initialPoint = randomInitialPoint(p5);
    drawTriangle(p5);
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
    p5.createCanvas(config.canvasSize.height, config.canvasSize.width).parent(canvasParentRef);
    initActions(p5);
    setCanvasInstance(p5);
  };

  // with 'config.speed' it's possible to control how quickly a triangle will be drawn
  const draw = (p5) => {
    for (let i = 0; i < config.speed; i++) {
      drawRandomPoint(p5);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerHeight, window.innerWidth);
    resetAction();
  };

  const pauseAction = () => {
    setStarted(false);
  };

  const playAction = () => {
    setStarted(true);
  };

  const resetAction = () => {
    setStarted(false);
    canvasInstance.clear();
    initActions(canvasInstance);
  };

  return (
    <div className="App" ref={elementRef}>
      <Controls
        actions={{
          isStarted,
          play: playAction,
          pause: pauseAction,
          reset: resetAction,
        }}
      />
      <Sketch setup={setup} draw={isStarted ? draw : () => {}} windowResized={windowResized} />
    </div>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App;
