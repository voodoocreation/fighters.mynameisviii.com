import util from "util";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MockDate from "mockdate";

Enzyme.configure({ adapter: new Adapter() });

MockDate.set("2018-01-01T00:00:00", 0);

const serviceWorkerEvents = {};
beforeAll(() => {
  global.dataLayer = [];
  global.location.assign = jest.fn();
  global.requestAnimationFrame = callback => setTimeout(callback, 0);
  global.scrollTo = jest.fn();

  Object.defineProperty(global.navigator, "serviceWorker", {
    value: {
      addEventListener: jest.fn((event, handler) => {
        if (!serviceWorkerEvents[event]) {
          serviceWorkerEvents[event] = [];
        }
        serviceWorkerEvents[event].push(handler);
      }),
      controller: {
        postMessage: jest.fn(),
        state: "activated"
      },
      dispatchEvent: jest.fn(event => {
        if (serviceWorkerEvents[event.type]) {
          serviceWorkerEvents[event.type].forEach(handler => {
            handler(event);
          });
        }
      }),
      register: jest.fn(),
      removeEventListener: jest.fn((event, handler) => {
        if (serviceWorkerEvents[event]) {
          serviceWorkerEvents[event].forEach((boundHandler, index) => {
            if (handler === boundHandler) {
              serviceWorkerEvents[event].splice(index, 1);
            }
          });
        }
      })
    },
    writable: true
  });
});

/* eslint-disable no-console */
// nobody cares about warnings so lets make them errors
// keep a reference to the original console methods
const consoleWarn = console.warn;
const consoleError = console.error;

function logToError(...rest) {
  const error = util.format.apply(this, rest);

  throw new Error(error);
}

jasmine.getEnv().beforeEach(() => {
  // make calls to console.warn and console.error throw an error
  console.warn = logToError;
  console.error = logToError;
});

jasmine.getEnv().afterEach(() => {
  // return console.warn and console.error to default behaviour
  console.warn = consoleWarn;
  console.error = consoleError;
});

// In Node v7 and below, unhandled promise rejections will terminate the process
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on("unhandledRejection", reason => {
    throw reason;
  });

  // Avoid memory leak by adding too many listeners
  process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
}
