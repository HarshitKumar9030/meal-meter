// Base interfaces
interface BaseEvent {
  clientX: number;
  clientY: number;
  timestamp: number;
  type: "mouse" | "touch" | "keyboard";
}

interface MouseEvent extends BaseEvent {
  type: "mouse";
}

interface TouchEvent extends BaseEvent {
  type: "touch";
}

interface KeyboardEvent extends BaseEvent {
  key: string;
  type: "keyboard";
}

type UserEvent = MouseEvent | TouchEvent | KeyboardEvent;

const MAX_EVENTS = 100;
const VELOCITY_THRESHOLD = 0.1;
const MIN_EVENTS_FOR_ANALYSIS = 10;

let userEvents: UserEvent[] = [];

const addEvent = (event: UserEvent) => {
  userEvents.push(event);
  if (userEvents.length > MAX_EVENTS) {
    userEvents = userEvents.slice(-MAX_EVENTS);
  }
};

const createMouseEvent = (x: number, y: number): MouseEvent => ({
  clientX: x,
  clientY: y,
  timestamp: Date.now(),
  type: "mouse",
});

const createTouchEvent = (x: number, y: number): TouchEvent => ({
  clientX: x,
  clientY: y,
  timestamp: Date.now(),
  type: "touch",
});

const createKeyboardEvent = (key: string): KeyboardEvent => ({
  clientX: 0,
  clientY: 0,
  key,
  timestamp: Date.now(),
  type: "keyboard",
});

const handleMouseMove = (e: globalThis.MouseEvent) => {
  console.log("Mouse moved:", e.clientX, e.clientY);
  addEvent(createMouseEvent(e.clientX, e.clientY));
};

const handleTouchMove = (e: globalThis.TouchEvent) => {
  if (e.touches.length > 0) {
    const touch = e.touches[0];
    console.log("Touch moved:", touch.clientX, touch.clientY);
    addEvent(createTouchEvent(touch.clientX, touch.clientY));
  }
};

const handleKeyPress = (e: globalThis.KeyboardEvent) => {
  console.log("Key pressed:", e.key);
  addEvent(createKeyboardEvent(e.key));
};

export const initUserEventTracking = () => {
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("keypress", handleKeyPress);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("keypress", handleKeyPress);
  };
};

export const analyzeUserPatterns = (): {
  isHuman: boolean;
  avgSpeed: number;
  eventCount: number;
} => {
  if (userEvents.length < MIN_EVENTS_FOR_ANALYSIS) {
    return { isHuman: false, avgSpeed: 0, eventCount: userEvents.length };
  }

  let constantVelocity = true;
  let totalSpeed = 0;
  let prevVelocity = { x: 0, y: 0 };
  let validEventCount = 0;

  for (let i = 1; i < userEvents.length; i++) {
    const curr = userEvents[i];
    const prev = userEvents[i - 1];

    if (
      curr.type === "keyboard" ||
      prev.type === "keyboard" ||
      curr.timestamp === prev.timestamp
    ) {
      continue;
    }

    const dt = (curr.timestamp - prev.timestamp) / 1000;

    const velocity = {
      x: (curr.clientX - prev.clientX) / dt,
      y: (curr.clientY - prev.clientY) / dt,
    };

    const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    totalSpeed += speed;
    validEventCount++;

    if (validEventCount > 1) {
      const velocityChange = Math.sqrt(
        (velocity.x - prevVelocity.x) ** 2 + (velocity.y - prevVelocity.y) ** 2
      );

      if (velocityChange > VELOCITY_THRESHOLD) {
        constantVelocity = false;
      }
    }

    prevVelocity = velocity;
  }

  const avgSpeed = validEventCount > 0 ? totalSpeed / validEventCount : 0;

  return {
    isHuman: !constantVelocity,
    avgSpeed,
    eventCount: userEvents.length,
  };
};

export const getUserEvents = () => [...userEvents];
export const clearUserEvents = () => {
  userEvents = [];
};

export const generateOTP = (): string => {
  const length = 6;
  const characters = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters.charAt(randomIndex);
  }
  return otp;
};

export const storeOTP = (otp: string) => {
  localStorage.setItem("otp", otp);
};

export const getStoredOTP = (): string | null => {
  return localStorage.getItem("otp");
};

export const verifyHumanBehavior = async (code: string): Promise<boolean> => {
  // console.log(getStoredOTP());
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const userAgent = navigator.userAgent;
  const isHumanLikeUserAgent = !userAgent.toLowerCase().includes("bot");

  const isHumanLikePattern = analyzeUserPatterns();
  const storedOtp = getStoredOTP();
  const isValidCode = code === storedOtp;
      console.log(isValidCode && isHumanLikeUserAgent)
    //   console.log(isValidCode, isHumanLikePattern, isHumanLikeUserAgent);

    //   return isHumanLikeUserAgent && isHumanLikePattern.isHuman && isValidCode;

   return isHumanLikeUserAgent && isValidCode;
   
};
