import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import MockDate from "mockdate";

Enzyme.configure({ adapter: new Adapter() });

MockDate.set("2018-01-01T00:00:00", 0);

const serviceWorkerEvents: any = {};

Object.defineProperties(global, {
  dataLayer: {
    value: [],
    writable: true
  },
  requestAnimationFrame: {
    value: (callback: () => void) => setTimeout(callback, 0),
    writable: true
  },
  scrollTo: {
    value: jest.fn(),
    writable: true
  }
});

Object.defineProperty(window.location, "assign", {
  value: jest.fn(),
  writable: true
});

Object.defineProperty(window.navigator, "serviceWorker", {
  value: {
    addEventListener: jest.fn((event: any, handler: any) => {
      if (!serviceWorkerEvents[event]) {
        serviceWorkerEvents[event] = [];
      }
      serviceWorkerEvents[event].push(handler);
    }),
    controller: {
      postMessage: jest.fn(),
      state: "activated"
    },
    dispatchEvent: jest.fn((event: any) => {
      if (serviceWorkerEvents[event.type]) {
        serviceWorkerEvents[event.type].forEach((handler: any) => {
          handler(event);
        });
      }
    }),
    register: jest.fn(),
    removeEventListener: jest.fn((event: any, handler: any) => {
      if (serviceWorkerEvents[event]) {
        serviceWorkerEvents[event].forEach((boundHandler: any, index: any) => {
          if (handler === boundHandler) {
            serviceWorkerEvents[event].splice(index, 1);
          }
        });
      }
    })
  },
  writable: true
});
