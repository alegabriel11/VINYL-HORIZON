# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## 🤖 Activar el Chat de Inteligencia Artificial

El chat de IA requiere un archivo de configuración local que **no se sube a GitHub** por seguridad. Sigue estos pasos:

**1. Crea el archivo `server/.env`** en la carpeta del proyecto con este contenido:

```env
PORT=5000
DB_USER=neondb_owner
DB_PASSWORD=npg_ne2baMdHYW6G
DB_HOST=ep-purple-shadow-aifiyie5-pooler.c-4.us-east-1.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_SSL=true
JWT_SECRET=super_secret_vinyl_horizon_key_change_me_in_productio
GEMINI_API_KEY=TU_API_KEY_AQUI
```

**2. Obtén tu propia API Key gratuita de Gemini:**
- Entra a https://aistudio.google.com/app/apikey
- Haz clic en **"Create API key in new project"** *(importante: new project para tener cupo independiente)*
- Copia la llave y pégala en `GEMINI_API_KEY=` del archivo `.env`

**3. Reinicia el servidor** y el chat de IA estará activo. 🎵
