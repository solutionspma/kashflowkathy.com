import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=0d3f8826"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=0d3f8826"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=0d3f8826"; const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule ? __vite__cjsImport2_reactDom_client.default : __vite__cjsImport2_reactDom_client;
import App from "/src/App.jsx";
import "/src/index.css";
import interruptManager from "/src/agents/interruptManager.js";
import { applyThemeOnStartup } from "/src/utils/themeManager.js";
applyThemeOnStartup();
if (typeof window !== "undefined" && window.agentAPI && window.agentAPI.onInterrupt) {
  window.agentAPI.onInterrupt(({ id, reason }) => {
    try {
      interruptManager.externalInterrupt(id, reason);
    } catch {
    }
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(React.StrictMode, { children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
    fileName: "/Users/cffsmacmini/Documents/studio_app/src/main.jsx",
    lineNumber: 20,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "/Users/cffsmacmini/Documents/studio_app/src/main.jsx",
    lineNumber: 19,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBbUJJO0FBbkJKLE9BQU9BLFdBQVc7QUFDbEIsT0FBT0MsY0FBYztBQUNyQixPQUFPQyxTQUFTO0FBQ2hCLE9BQU87QUFDUCxPQUFPQyxzQkFBc0I7QUFDN0IsU0FBU0MsMkJBQTJCO0FBR3BDQSxvQkFBb0I7QUFHcEIsSUFBSSxPQUFPQyxXQUFXLGVBQWVBLE9BQU9DLFlBQVlELE9BQU9DLFNBQVNDLGFBQWE7QUFDbkZGLFNBQU9DLFNBQVNDLFlBQVksQ0FBQyxFQUFFQyxJQUFJQyxPQUFPLE1BQU07QUFDOUMsUUFBSTtBQUFFTix1QkFBaUJPLGtCQUFrQkYsSUFBSUMsTUFBTTtBQUFBLElBQUcsUUFBUTtBQUFBLElBQUM7QUFBQSxFQUNqRSxDQUFDO0FBQ0g7QUFFQVIsU0FBU1UsV0FBV0MsU0FBU0MsZUFBZSxNQUFNLENBQUMsRUFBRUM7QUFBQUEsRUFDbkQsdUJBQUMsTUFBTSxZQUFOLEVBQ0MsaUNBQUMsU0FBRDtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBQUksS0FETjtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBRUE7QUFDRiIsIm5hbWVzIjpbIlJlYWN0IiwiUmVhY3RET00iLCJBcHAiLCJpbnRlcnJ1cHRNYW5hZ2VyIiwiYXBwbHlUaGVtZU9uU3RhcnR1cCIsIndpbmRvdyIsImFnZW50QVBJIiwib25JbnRlcnJ1cHQiLCJpZCIsInJlYXNvbiIsImV4dGVybmFsSW50ZXJydXB0IiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZXMiOlsibWFpbi5qc3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb20vY2xpZW50XCI7XG5pbXBvcnQgQXBwIGZyb20gXCIuL0FwcC5qc3hcIjtcbmltcG9ydCBcIi4vaW5kZXguY3NzXCI7XG5pbXBvcnQgaW50ZXJydXB0TWFuYWdlciBmcm9tIFwiLi9hZ2VudHMvaW50ZXJydXB0TWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgYXBwbHlUaGVtZU9uU3RhcnR1cCB9IGZyb20gXCIuL3V0aWxzL3RoZW1lTWFuYWdlci5qc1wiO1xuXG4vLyBBcHBseSBzYXZlZCB0aGVtZSBpbW1lZGlhdGVseSBiZWZvcmUgUmVhY3QgcmVuZGVycyAocHJldmVudHMgZmxhc2gpXG5hcHBseVRoZW1lT25TdGFydHVwKCk7XG5cbi8vIFdpcmUgcHJlbG9hZCAtPiByZW5kZXJlciBpbnRlcnJ1cHRzIGludG8gdGhlIGNsaWVudC1zaWRlIG1hbmFnZXJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuYWdlbnRBUEkgJiYgd2luZG93LmFnZW50QVBJLm9uSW50ZXJydXB0KSB7XG4gIHdpbmRvdy5hZ2VudEFQSS5vbkludGVycnVwdCgoeyBpZCwgcmVhc29uIH0pID0+IHtcbiAgICB0cnkgeyBpbnRlcnJ1cHRNYW5hZ2VyLmV4dGVybmFsSW50ZXJydXB0KGlkLCByZWFzb24pOyB9IGNhdGNoIHt9XG4gIH0pO1xufVxuXG5SZWFjdERPTS5jcmVhdGVSb290KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSkucmVuZGVyKFxuICA8UmVhY3QuU3RyaWN0TW9kZT5cbiAgICA8QXBwIC8+XG4gIDwvUmVhY3QuU3RyaWN0TW9kZT5cbik7XG4iXSwiZmlsZSI6Ii9Vc2Vycy9jZmZzbWFjbWluaS9Eb2N1bWVudHMvc3R1ZGlvX2FwcC9zcmMvbWFpbi5qc3gifQ==