// SockJS/STOMP browser polyfills - load before React
window.global = window;
if (!window.global.crypto) {
    window.global.crypto = {
        getRandomValues: (arr) => crypto.getRandomValues(arr)
    };
}
console.log('✅ WebSocket polyfills loaded');

