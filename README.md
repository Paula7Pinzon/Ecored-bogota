# EcoRed Bogotá 🌱
**Sistema Web para la Gestión y Seguimiento de Residuos Reciclables en Comunidades Urbanas de Bogotá**

Proyecto de Grado — Universidad Nacional Abierta y a Distancia (UNAD)  
Escuela de Ciencias Básicas, Tecnología e Ingeniería (ECBTI) — Ingeniería de Sistemas  
**Autores:** Paula Daniela Pinzón Malagón & Miguel Oswaldo Chaparro Forero  

---

## Arquitectura Tecnológica
- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Base de Datos:** MySQL (`ecored_db`)
- **Seguridad:** JWT (JSON Web Token) + bcrypt
- **Geolocalización:** Leaflet + OpenStreetMap

## Estructura del Repositorio
- `/frontend`: Interfaz web responsiva (Login, Registro, Dashboard, Registro de Residuos, Mapa y Usuarios).
- `/backend`: API RESTful, conexión a MySQL y autenticación segura.
- `/database`: Script SQL (`schema.sql`) con el modelo relacional y datos semilla de Bogotá.
- `/docs`: Evidencias de validación funcional y soporte nivel TRL 5.

## Instrucciones de Ejecución Local
1. **Base de datos:** Ejecutar `/database/schema.sql` en MySQL Workbench.
2. **Backend:** Entrar a `/backend`, configurar `.env` con las credenciales de MySQL, ejecutar `npm install` y `node server.js`.
3. **Frontend:** Entrar a `/frontend`, ejecutar `npm install` y `npm run dev`.
