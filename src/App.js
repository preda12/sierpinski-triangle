import './App.css';
import Sketch from 'react-p5';
import {useEffect, useRef, useState} from 'react';
import {Controls} from './Controls';
import {Point} from './Point';
import {hot} from 'react-hot-loader';
import {toInt, toBool} from './envHelper'

const config = {
  canvasSize: {height: toInt(process.env.REACT_APP_CANVAS_HEIGHT, 800), width: toInt(process.env.REACT_APP_CANVAS_WEIGHT, 800)},
  drawInitialPoint: toBool(process.env.REACT_APP_DRAW_INITIAL_POINT, true),
  speed: toInt(process.env.REACT_APP_SPEED, 50),
  ratio: toInt(process.env.REACT_APP_RATIO, 2),
};
 const allPoints = [];

function App() {
  const [isStarted, setStarted] = useState(false);
  const [canvasInstance, setCanvasInstance] = useState(null);
  const [isStartingPointShown, setStarttingPointFlag] = useState(config.drawInitialPoint);

  const [initX, setInitX] = useState(0);
  const [initY, setInitY] = useState(0);

  const elementRef = useRef(null);
  let randomPoint = new Point(0, 0); // state not used because it's really slow

  const [interval, _setInterval] = useState(null);

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

    setInitX(qx);
    setInitY(qy);
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
    randomPoint = randomInitialPoint(p5);
    drawTriangle(p5);
  };

  const generateRandomPoint = (p5) => {
    if(allPoints.length > 1000000) { return }

    for (let index = 0; index < 50; index++) {
      const randomTrianglePoint = p5.random([topPoint, leftPoint, rightPoint]);
      randomPoint = {
        x: (randomTrianglePoint.x + randomPoint.x) / config.ratio,
        y: (randomTrianglePoint.y + randomPoint.y) / config.ratio,
      };
      allPoints.push(randomPoint)
    }
  };

  useEffect(() => {

  }, [])

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(config.canvasSize.height, config.canvasSize.width).parent(canvasParentRef);
    initActions(p5);
    setCanvasInstance(p5);
  };

  const drawInitialPoint = (p5) => {
    if(isStartingPointShown){
       p5.fill(255, 0, 0);
      p5.circle(initX, initY, 5);
    }
  }

  const draw = (p5) => {
    p5.clear()
    drawInitialPoint(p5)
    drawTriangle(p5);

    for (let i = 0; i < allPoints.length; i++) {
      p5.fill(0);
      canvasInstance.point(allPoints[i].x, allPoints[i].y);
    }
  };

  const windowResized = (p5) => {
    p5.resizeCanvas(window.innerHeight, window.innerWidth);
    resetAction();
  };

  const pauseAction = () => {
    setStarted(false);
    stopInterval()
  };

  // with 'config.speed' it's possible to control how quickly a triangle will be drawn
  const startInterval = () => {
    if(!interval) {
      _setInterval(setInterval(() => {
        generateRandomPoint(canvasInstance)
      }, config.speed))
    }
  }

  const stopInterval = () => {
    if(interval){
      clearInterval(interval)
      _setInterval(null)
    }
  }

  const playAction = () => {
    setStarted(true);
    startInterval()
  };

  const resetAction = () => {
    setStarted(false);
    stopInterval()
    canvasInstance.clear();
    initActions(canvasInstance);
  };

  const showStartingPoint = (flag) => {
    setStarttingPointFlag(flag)
  }

  return (
    <div className="App" ref={elementRef}>
      <Controls
        actions={{
          isStarted,
          play: playAction,
          pause: pauseAction,
          reset: resetAction,
          showStartingPoint
        }}
        isStartingPointShown={isStartingPointShown}
      />
      <Sketch setup={setup} draw={isStarted ? draw : () => {}} windowResized={windowResized} />
    </div>
  );
}

export default process.env.NODE_ENV === 'development' ? hot(module)(App) : App;
