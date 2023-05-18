import { Box, useToast } from "@chakra-ui/react";
import jwt_decode from "jwt-decode";
import { Device } from "mediasoup-client";
import { Consumer, ConsumerOptions } from "mediasoup-client/lib/Consumer";
import { TransportOptions } from "mediasoup-client/lib/Transport";
import { useRouter } from "next/router";

import {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Draggable from "../../components/Draggable";
import MediaTrack from "../../components/MediaTrack";
import { SocketContext } from "../../modules/SocketProvider";
import { CookieKeys } from "../../utils/constant";
import { getCookie } from "../../utils/cookieManager";
import { getUserMedia } from "../../utils/media";
import {
  loadDevice,
  MediaSoupHandshake,
  MediaSoupSocket,
} from "../../utils/mediasoup";
import SocketManager from "../../utils/socket";
import { calcNewVolume } from "../../utils/volume/spatialvolume";

interface Props {}

const boardWidth = 770;
const boardHeight = 520;
const controllers = [];
let device: Device;

type onProduceArg = {
  transportId: string;
  kind: any;
  rtpParameters: any;
};

interface CreateConsumerArg {
  consumerParameters: Record<string, Array<ConsumerOptions>>;
}

interface Position {
  x: number;
  y: number;
}

let mediasoupHandshake: MediaSoupHandshake = null;

export default function Hocky({}: Props): ReactElement {
  const toast = useToast();
  const router = useRouter();
  const socket = useContext<SocketManager>(SocketContext);
  const [consumersList, setConsumersList] = useState<
    Record<string, Array<Consumer>>
  >({});

  const [userVolumes, setUserVolumes] = useState<Record<string, number>>({});

  const [userpositions, setUserPositions] = useState<Record<string, Position>>(
    {}
  );

  const [myPosition, setMyPosition] = useState<Position>({ x: 0, y: 0 });

  const [isConnected, setIsConnected] = useState<
    "Disconnect" | "Connecting" | "Connected"
  >("Disconnect");

  const [localStream, setLocalStream] = useState<MediaStream>();
  const [userStream, setUserStream] = useState<Record<string, MediaStream>>({});
  const [side, setSide] = useState<"unassigned" | "left" | "right">(
    "unassigned"
  );

  const onStopStream = () => {
    if (localStream) {
      for (const track of localStream?.getTracks()) {
        track?.stop();
      }
      setLocalStream(null);
    }
  };

  useEffect(() => {
    socket.listen(MediaSoupSocket.roomAssigned, async () => {
      setIsConnected("Connecting");
      await getRouterRtpCapabilities();
      await connectTransportToConversation();
    });

    socket.listen(
      MediaSoupSocket.listenConsumers,
      async (consumerResponse: CreateConsumerArg) => {
        addConsumers(consumerResponse);
      }
    );
    socket.listen("newuserjoin", async (data: any) => {
      const { producerId, userId } = data;
      const response: CreateConsumerArg = (await socket.request(
        MediaSoupSocket.consumeUser,
        {
          userId,
          producerIds: [producerId],
          rtpCapabilities: mediasoupHandshake.getrtpCapabilities(),
        }
      )) as any;

      addConsumers(response);
    });
    socket.listen("notifyuserentered", async (data: any) => {
      toast({
        position: "top-right",
        title: `New User Joined`,
        description: data?.name,
        status: "success",
        isClosable: true,
        duration: 3000,
      });
    });
    socket.socket.on("disconnect", () => {
      //   if (socket.isConnected()) socket.request("leaveroom");
      //   socket.socket.removeAllListeners();
      mediasoupHandshake.disconnect();
      onStopStream();
    });

    socket.listen("drag", (data: any) => {
      setUserPositions((prev) => {
        return {
          ...prev,
          [data.userId]: {
            x: data.position.x,
            y: data.position.y,
          },
        };
      });
      const newVol = calcNewVolume(
        {
          x: data.position.x,
          y: data.position.y,
        },
        myPosition,
        10,
        1000
      );
      setUserVolumes((prev) => {
        return {
          ...prev,
          [data.userId]: newVol,
        };
      });
    });
  }, []);

  // useEffect(() => {
  //   console.log(userVolumes);
  // }, [userVolumes]);

  useEffect(() => {
    socket.listen("userleft", (data: any) => {
      toast({
        position: "top-right",
        title: "User Left",
        description: data?.name,
        status: "warning",
        isClosable: true,
        duration: 3000,
      });
      removeConsumers(data.userId);
    });

    return () => {
      socket.socket.off("userleft");
    };
  }, [consumersList]);

  useEffect(() => {
    joinRoom();
  }, []);

  useEffect(() => {
    socket.socket.emit("drag", {
      userId,
      position: {
        x: myPosition.x,
        y: myPosition.y,
      },
    });
  }, [myPosition.x, myPosition.y]);

  const userId = useMemo(() => {
    return (jwt_decode(getCookie(CookieKeys.token)) as any).userId;
  }, []);

  const joinRoom = async () => {
    const data = await socket.request(MediaSoupSocket.startNegotiation, {
      roomId: router.query.game as string,
      userId,
    });
    // tood: check if room allocated if not then start again
  };

  const getRouterRtpCapabilities = async () => {
    const response: any = await socket.request(
      MediaSoupSocket.getRouterRtpCapabilities
    );
    if (response?.rtpCapabilities) {
      const { device: d } = await loadDevice((response as any).rtpCapabilities);
      device = d;
      mediasoupHandshake = new MediaSoupHandshake(device);
    }
  };

  const onTransportConnect = (type: "send" | "recv") => {
    // console.log("onTransportConnect", type);
  };

  const onTransportError = (error: any): void => {
    // console.log("onTransportError", error);
  };

  const onProduce = async ({
    kind,
    rtpParameters,
    transportId,
  }: onProduceArg) => {
    const response = await socket.request(MediaSoupSocket.produce, {
      kind,
      rtpParameters,
      transportId,
    });
    return response;
  };

  const onRecvConnectCallback = async ({
    dtlsParameters,
  }: {
    dtlsParameters: unknown;
  }) => {
    const data = await socket.request(
      MediaSoupSocket.connectConsumerTransport,
      { dtlsParameters }
    );
  };

  const onSendConnectCallback = async ({
    dtlsParameters,
  }: {
    dtlsParameters: unknown;
  }) => {
    const data = await socket.request(
      MediaSoupSocket.connectProducerTransport,
      { dtlsParameters }
    );
  };

  const connectTransportToConversation = async () => {
    const createProducerTransportResponse = await socket.request(
      MediaSoupSocket.createProducerTransport
    );
    const createConsumerTransportResponse = await socket.request(
      MediaSoupSocket.createConsumerTransport
    );
    const sendTransMeta = createProducerTransportResponse as TransportOptions;
    const recvTransMeta = createConsumerTransportResponse as TransportOptions;
    // if (isConnected !== "Connected") return;
    try {
      await mediasoupHandshake.start({
        sendTransMeta,
        recvTransMeta,
        onConnect: onTransportConnect,
        onError: onTransportError,
        onProduce,
        onRecvConnectCallback,
        onSendConnectCallback,
        Connect: trackproduce,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const trackproduce = async () => {
    const stream = await getUserMedia();
    await mediasoupHandshake.produce(stream);
    setLocalStream(stream);
    setIsConnected("Connected");
    trackSubcribe();
  };

  const trackSubcribe = async () => {
    const consumerResponse: CreateConsumerArg = (await socket.request(
      MediaSoupSocket.consume,
      {
        rtpCapabilities: mediasoupHandshake.getrtpCapabilities(),
      }
    )) as any;
    addConsumers(consumerResponse);
  };

  const addConsumers = async (consumerResponse: CreateConsumerArg) => {
    const _consumers: Record<string, Array<Consumer>> = {};
    for (const key in consumerResponse.consumerParameters) {
      const consumerRequest = [];
      for (const consumer of consumerResponse.consumerParameters[key]) {
        consumerRequest.push(mediasoupHandshake.consume(consumer));
      }
      _consumers[key] = await Promise.all(consumerRequest);
      setConsumersList((prevuid) => {
        let _prevConsumers = prevuid[key] ?? [];
        let newConsumerlist = {
          ...prevuid,
          [key]: [..._prevConsumers, ..._consumers[key]],
        };
        return newConsumerlist;
      });

      _consumers[key].map((consumer) =>
        setUserStream((prev) => {
          const prevStream: MediaStream = prev[key] ?? new MediaStream();
          prevStream.addTrack(consumer.track);
          return {
            ...prev,
            [key]: prevStream,
          };
        })
      );
    }
  };

  const leaveRoom = () => {
    if (socket.isConnected()) socket.request("leaveroom");
    socket.socket.removeAllListeners();
    mediasoupHandshake.disconnect();
    setConsumersList({});
    setUserStream({});
    onStopStream();
    router.push("/room");
  };

  const removeConsumers = async (userId: string) => {
    if (userId && consumersList[userId]) {
      consumersList[userId].forEach((consumer) => consumer.close());
      setUserStream((prev) => {
        const _temp_copy = { ...prev };
        delete _temp_copy[userId];
        return _temp_copy;
      });
      setConsumersList((prevConsumer) => {
        const _temp_copy = { ...prevConsumer };
        delete _temp_copy[userId];
        return _temp_copy;
      });
    }
  };

  const board = useRef(null);
  const boardContext = useRef(null);

  const [isGameStarted, setGameStart] = useState(false);

  useEffect(() => {
    if (!board.current) return;
    boardContext.current = board.current.getContext("2d");
  }, [board.current]);

  const boardCenterX = boardWidth / 2;
  const boardCenterY = boardHeight / 2;

  //   const goal = document.getElementsByClassName("table__goal-crease");
  const goal_zero = useRef(null);
  const goal_one = useRef(null);
  const puck = useRef(null);
  const controller = useRef(null);
  const localRef = useRef(null);
  const controllerTwo = useRef(null);

  const goalHeight = useMemo(() => {
    return goal_zero?.current?.clientHeight;
  }, goal_zero.current);

  const goalPosTop = (boardHeight - goalHeight) / 2;
  const score = [];

  useEffect(() => {
    // Set width & height for canvas
    if (
      !isGameStarted &&
      isConnected &&
      boardContext &&
      board.current
      //   controller.current
    ) {
      setGameStart(true);
      board.current.width = boardWidth;
      board.current.height = boardHeight;
      // Set focus to canvas so keyboard events work
      board.current.focus();

      // Events
      document.addEventListener("keydown", function (e) {
        moveController(e.keyCode);
      });

      // Add puck
      puck.current = new Disc();
      // Add controller & adjust settings
      controller.current = new Disc();
      controller.current.color = "#2132CC";
      controller.current.radius += 10;
      controller.current.acceleration = 5;
      controller.current.startingPosX = 125;
      controller.current.mass = 50;
      controller.current.x = controller.current.startingPosX;

      // Add controller two
      controllerTwo.current = new Disc();
      //   controllerTwo.current.color = "#2132CC";
      controllerTwo.current.radius += 10;
      controllerTwo.current.mass = 50;
      controllerTwo.current.startingPosX = boardWidth - 155;
      controllerTwo.current.acceleration = 0.2;
      controllerTwo.current.x = controllerTwo.current.startingPosX;

      // Store controllers
      controllers.push(controller.current, controllerTwo.current);

      // start game
      updateGame();
    }
  }, [boardContext, board.current, controller.current]);

  // Disc
  function Disc() {
    this.startingPosX = boardCenterX;
    this.startingPosY = boardCenterY;
    this.x = this.startingPosX;
    this.y = this.startingPosY;
    this.radius = 34;
    this.mass = 15;
    this.velocityX = 0;
    this.velocityY = 0;
    this.maxSpeed = 10;
    this.frictionX = 0.997;
    this.frictionY = 0.997;
    this.acceleration = 1;
    this.color = "#000000";

    (this.keepControllerInBoard = function () {
      // Need to determine if goal scored on x axis as well
      if (this.x > boardWidth - this.radius || this.x < this.radius) {
        if (this.x < this.radius) {
          this.velocityX = 2;
        } else {
          this.velocityX = -2;
        }
      }

      // Determine if disc is to far up or down
      if (this.y > boardHeight - this.radius || this.y < this.radius) {
        if (this.y < this.radius) {
          this.velocityY = 2;
        } else {
          this.velocityY = -2;
        }
      }

      // Keep player one controller on left hand side of screen
      if (
        controller.current.x > boardCenterX - controller.current.radius &&
        controller.current.x < boardCenterX
      ) {
        controller.current.velocityX = -3;
      }

      // Keep player two controller on right hand side of screen
      if (
        controllerTwo.current.x > boardCenterX &&
        controllerTwo.current.x <
          boardCenterX + controllerTwo.current.radius / 2
      ) {
        controllerTwo.current.velocityX = +3;
      }
    }),
      // Keep disc inside board
      (this.keepPuckInBoard = function () {
        // Determine if disc is to far right or left
        // Need to determine if goal scored on x axis as well
        if (this.x > boardWidth - this.radius || this.x < this.radius) {
          // Stop puck from getting stuck
          if (this.x > boardWidth - this.radius) {
            this.x = boardWidth - this.radius;
          } else {
            this.x = this.radius;
          }

          // Check to see if goal scored
          if (
            this.y > goalPosTop + puck.current.radius &&
            this.y < goalPosTop + goalHeight - puck.current.radius
          ) {
            // Add new puck
            puck.current = new Disc(boardCenterX, boardCenterY);
          } else {
            // Reverse X direction
            this.velocityX = -this.velocityX;
          }
        }

        // Determine if disc is to far up or down
        if (this.y > boardHeight - this.radius || this.y < this.radius) {
          // Stop puck from getting stuck
          if (this.y > boardHeight - this.radius) {
            this.y = boardHeight - this.radius;
          } else {
            this.y = this.radius;
          }

          // Reverse direction
          this.velocityY = -this.velocityY;
        }
      });

    // Collide discs if in same spot
    this.discCollision = function () {
      // Loop over two controllers to see if puck has come in contact
      for (var i = 0; i < controllers.length; i++) {
        // Minus the x pos of one disc from the x pos of the other disc
        var distanceX = this.x - controllers[i].x,
          // Minus the y pos of one disc from the y pos of the other disc
          distanceY = this.y - controllers[i].y,
          // Multiply each of the distances by this
          // Squareroot that number, which gives you the distance between the two disc's
          distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY),
          // Add the two disc radius together
          addedRadius = this.radius + controllers[i].radius;

        // Check to see if the distance between the two circles is smaller than the added radius
        // If it is then we know the circles are overlapping
        if (distance < addedRadius) {
          // Had help from Reddit user Kraft_Punk on the below collision math

          //calculate angle, sine, and cosine
          var angle = Math.atan2(distanceY, distanceX),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            //rotate controllers[i]'s position
            pos0 = {
              x: 0,
              y: 0,
            },
            //rotate this's position
            pos1 = rotate(distanceX, distanceY, sin, cos, true),
            //rotate controllers[i]'s velocity
            vel0 = rotate(
              controllers[i].velocityX,
              controllers[i].velocityY,
              sin,
              cos,
              true
            ),
            //rotate this's velocity
            vel1 = rotate(this.velocityX, this.velocityY, sin, cos, true),
            //collision reaction
            velocityXTotal = vel0.x - vel1.x;

          vel0.x =
            ((controllers[i].mass - this.mass) * vel0.x +
              2 * this.mass * vel1.x) /
            (controllers[i].mass + this.mass);
          vel1.x = velocityXTotal + vel0.x;

          //update position - to avoid objects becoming stuck together
          var absV = Math.abs(vel0.x) + Math.abs(vel1.x),
            overlap =
              controllers[i].radius + this.radius - Math.abs(pos0.x - pos1.x);

          pos0.x += (vel0.x / absV) * overlap;
          pos1.x += (vel1.x / absV) * overlap;

          //rotate positions back
          var pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
            pos1F = rotate(pos1.x, pos1.y, sin, cos, false);

          //adjust positions to actual screen positions
          this.x = controllers[i].x + pos1F.x;
          this.y = controllers[i].y + pos1F.y;
          controllers[i].x = controllers[i].x + pos0F.x;
          controllers[i].y = controllers[i].y + pos0F.y;

          //rotate velocities back
          var vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
            vel1F = rotate(vel1.x, vel1.y, sin, cos, false);

          controllers[i].velocityX = vel0F.x;
          controllers[i].velocityY = vel0F.y;

          this.velocityX = vel1F.x;
          this.velocityY = vel1F.y;
        }
      }
    };

    // Draw disc
    this.draw = function () {
      boardContext.current.shadowColor = "rgba(50, 50, 50, 0.25)";
      boardContext.current.shadowOffsetX = 0;
      boardContext.current.shadowOffsetY = 3;
      boardContext.current.shadowBlur = 6;

      boardContext.current.beginPath();
      boardContext.current.arc(
        this.x,
        this.y,
        this.radius,
        0,
        2 * Math.PI,
        false
      );
      boardContext.current.fillStyle = this.color;
      boardContext.current.fill();
    };

    // Move disc with physic's applied
    this.move = function () {
      // Apply friction
      this.velocityX *= this.frictionX;
      this.velocityY *= this.frictionY;

      // Update position
      this.x += this.velocityX;
      this.y += this.velocityY;
    };

    // Play against a computer
    this.computerPlayer = function () {
      // If pucks about to move into right hand side of screen
      // And controller isnt pushed up against the center line
      if (
        puck.current.x > boardCenterX - 30 &&
        controllerTwo.current.x >
          boardCenterX + controllerTwo.current.radius * 2
      ) {
        // Work out if puck is infront or behind controller
        // Try to hit the puck on right hand side and at the center.

        // If puck is infront on controller
        if (puck.current.x + puck.current.radius < controllerTwo.current.x) {
          controllerTwo.current.velocityX -= controllerTwo.current.acceleration;
        } else {
          controllerTwo.current.velocityX += controllerTwo.current.acceleration;
        }

        // Do same on y axis
        if (puck.current.y < controllerTwo.current.y) {
          controllerTwo.current.velocityY -= controllerTwo.current.acceleration;
        } else {
          // Is behind
          controllerTwo.current.velocityY += controllerTwo.current.acceleration;
        }
      } else {
        // Move back to its starting position so its not stuck at center line.
        // Give it a range to top in
        if (
          controllerTwo.current.x > controllerTwo.current.startingPosX - 50 &&
          controllerTwo.current.x < controllerTwo.current.startingPosX + 50
        ) {
          controllerTwo.current.velocityX = 0;
        } else if (
          controllerTwo.current.x <
          controllerTwo.current.startingPosX - 80
        ) {
          controllerTwo.current.velocityX += controllerTwo.current.acceleration;
        } else {
          controllerTwo.current.velocityX -= controllerTwo.current.acceleration;
        }
      }
    };
  }

  // Run game functions
  function updateGame() {
    // Clear board
    boardContext.current.clearRect(0, 0, boardWidth, boardHeight);
    // Draw & contain puck
    puck.current.draw();
    puck.current.move();
    puck.current.discCollision();
    puck.current.keepPuckInBoard();
    // Controllers
    // controller.current.draw();
    controller.current.move();
    controller.current.keepControllerInBoard();

    setMyPosition({
      x: controller.current.x - 50,
      y: controller.current.y - 64,
    });
    controllerTwo.current.draw();
    controllerTwo.current.computerPlayer();
    controllerTwo.current.move();
    controllerTwo.current.keepControllerInBoard();

    // Loop
    requestAnimationFrame(updateGame);
  }

  // Keyboard events
  function moveController(key) {
    // Up
    if (
      key === 38 &&
      controller.current.velocityY < controller.current.maxSpeed
    ) {
      controller.current.velocityY -= controller.current.acceleration;
    }

    // Down
    if (
      key === 40 &&
      controller.current.velocityY < controller.current.maxSpeed
    ) {
      controller.current.velocityY += controller.current.acceleration;
    }

    // Right
    if (
      key === 39 &&
      controller.current.velocityX < controller.current.maxSpeed
    ) {
      controller.current.velocityX += controller.current.acceleration;
    }

    // Left, decrease acceleration
    if (
      key === 37 &&
      controller.current.acceleration < controller.current.maxSpeed
    ) {
      controller.current.velocityX -= controller.current.acceleration;
    }
  }

  function rotate(x, y, sin, cos, reverse) {
    return {
      x: reverse ? x * cos + y * sin : x * cos - y * sin,
      y: reverse ? y * cos - x * sin : y * cos + x * sin,
    };
  }

  return (
    <Box margin="100px">
      <div className="table">
        <p className="message">
          Use keyboard arrows to control left player.{" "}
          {/* <a href="https://codepen.io/allanpope/full/a01ddb29cbdecef58197c2e829993284/">
            Open in fullscreen
          </a> */}
          .
        </p>
        <div className="table-inner">
          <Draggable
            position={{
              x: myPosition?.x ? myPosition.x : 0,
              y: myPosition?.y ? myPosition.y : 0,
            }}
            isLocal={false}
          >
            <MediaTrack
              size="100px"
              isLocal={true}
              videoSrc={localStream}
              id={(jwt_decode(getCookie(CookieKeys.token)) as any).userId}
            />
          </Draggable>
          {Object.keys(consumersList)?.map((uid) => {
            return (
              <Draggable
                position={userpositions[uid]}
                key={`${uid}-move`}
                isLocal={false}
              >
                {userStream[uid] && (
                  <MediaTrack
                    volume={userVolumes?.[uid] ?? 1}
                    id={uid}
                    videoSrc={userStream[uid]}
                    isLocal={false}
                    key={uid}
                  />
                )}
              </Draggable>
            );
          })}

          <span ref={goal_zero} className="table__goal-crease circle"></span>
          <span className="table__faceoff table__faceoff--top-left circle"></span>
          <span className="table__faceoff table__faceoff--bottom-left circle"></span>
          <span className="table__blue-line"></span>
          <span className="table__center-line"></span>
          <span className="circle"></span>
          <span className="table__blue-line table__blue-line--two"></span>
          <span className="table__faceoff table__faceoff--top-right circle"></span>
          <span className="table__faceoff table__faceoff--bottom-right circle"></span>
          <span
            ref={goal_one}
            className="table__goal-crease table__goal-crease--two circle"
          ></span>
        </div>
      </div>
      <canvas
        ref={board}
        id="canvas"
        className="table table--canvas"
        tabIndex={0}
      ></canvas>
    </Box>
  );
}
