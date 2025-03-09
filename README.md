# MemoWorld - Memories Worth Sharing

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## How to install
```
npm i
npm run dev
```
- Some of the features will need the backend, like the shop system.

## LocalStorage list
```
localStorage.setItem('currentRoute', window.location.pathname);
- This stores the current route. To be used by certain features.
```