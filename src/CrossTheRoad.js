class CrossTheRoad {
  state = {
    playerPosition: [0, 0, 0],
    camera: [0, 0, 2],
    moving: { direction: null, value: 0 },
    world: [
      'grass',
      'grass',
      'road',
      'road',
      'grass',
      'grass',
      'road',
      'road',
      'road',
      'grass',
      'road',
      'road',
      'grass',
      'grass',
    ],
  };

  constructor(canvas) {
    const iso = new Isomer(canvas);

    this.canvas = canvas;
    this.iso = iso;

    this.render();

    window.addEventListener('keydown', this.movePlayer);
    setInterval(this.updateGameState, 15);
  }

  movePlayer = event => {
    if (!this.state.moving.direction) {
      switch (event.key) {
        case 'ArrowUp':
          this.state.moving = { direction: 'up', value: 100 };
          break;
        case 'ArrowLeft':
          this.state.moving = { direction: 'left', value: 100 };
          break;
        case 'ArrowRight':
          this.state.moving = { direction: 'right', value: 100 };
          break;
        case 'ArrowDown':
          this.state.moving = { direction: 'down', value: 100 };
          break;
      }
    }
  };

  updateGameState = () => {
    const { playerPosition, camera, moving } = this.state;

    if (moving.direction) {
      switch (moving.direction) {
        case 'up':
          playerPosition[0] += 0.1;
          break;
        case 'down':
          playerPosition[0] -= 0.1;
          break;
        case 'left':
          playerPosition[1] += 0.1;
          break;
        case 'right':
          playerPosition[1] -= 0.1;
          break;
      }

      moving.value -= 10;
      if (moving.value <= 0) {
        moving.direction = null;
      }
    }

    camera[0] -= (playerPosition[0] + camera[0]) / 50;
    camera[1] -= (playerPosition[1] + camera[1]) / 50;
  };

  render = () => {
    const {
      iso,
      state: { playerPosition, camera, world },
      render,
    } = this;
    const {
      Shape: { Prism, extrude },
      Point,
      Color,
      Path,
    } = Isomer;

    iso.canvas.clear();
    window.requestAnimationFrame(render);

    const white = new Color(189, 195, 199);
    const red = new Color(192, 57, 43);
    const orange = new Color(230, 126, 34);
    const grey = new Color(43, 47, 62);
    const lightGrey = new Color(109, 118, 140);
    const green = new Color(84, 109, 48);

    world
      .map((level, index) => ({ level, index }))
      .reverse()
      .forEach(({ level, index }) => {
        switch (level) {
          case 'road':
            iso.add(
              new Path([
                Point(index, -20),
                Point(index + 1, -20),
                Point(index + 1, 20),
                Point(index, 20),
              ]).translate(...camera),
              grey
            );
            break;
          case 'grass':
            iso.add(
              extrude(
                new Path([
                  Point(index, -20),
                  Point(index + 1, -20),
                  Point(index + 1, 20),
                  Point(index, 20),
                ]),
                0.15
              ).translate(...camera),
              green
            );
            break;
        }
      });

    const rightLeg = Prism(Point(0.4, 0.2, 0.0), 0.2, 0.2, 0.2);
    const beak = Prism(Point(0.8, 0.4, 0.6), 0.25, 0.2, 0.2);
    const leftWing = Prism(Point(0.2, 0.8, 0.3), 0.5, 0.2, 0.2);
    const bottomBody = Prism(Point(0.1, 0.2, 0.2), 0.7, 0.6, 0.3);
    const upperBody = Prism(Point(0.3, 0.2, 0.5), 0.5, 0.6, 0.4);
    const tail = Prism(Point(0.0, 0.3, 0.3), 0.1, 0.4, 0.2);
    const rightWing = Prism(Point(0.2, 0.0, 0.3), 0.5, 0.2, 0.2);
    const crest = Prism(Point(0.4, 0.4, 0.9), 0.35, 0.2, 0.1);

    iso.add(rightLeg.translate(...playerPosition).translate(...camera), orange);
    iso.add(beak.translate(...playerPosition).translate(...camera), orange);
    iso.add(leftWing.translate(...playerPosition).translate(...camera), white);
    iso.add(
      bottomBody.translate(...playerPosition).translate(...camera),
      white
    );
    iso.add(upperBody.translate(...playerPosition).translate(...camera), white);
    iso.add(tail.translate(...playerPosition).translate(...camera), white);
    iso.add(rightWing.translate(...playerPosition).translate(...camera), white);
    iso.add(crest.translate(...playerPosition).translate(...camera), red);
  };
}
