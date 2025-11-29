Sistema de Control de Acceso Vehicular

TECNM Campus Cancún - Residencia Profesional 2025

TecPass es una plataforma web integral diseñada para modernizar y agilizar el control de acceso vehicular en el Instituto Tecnológico de Cancún. Permite la gestión de usuarios, generación de gafetes digitales (QR) y monitoreo de aforo en tiempo real.

###########################################################################################


Características Principales

Panel Administrativo (Web)

Dashboard Interactivo: Vista general con métricas clave (Vehículos activos, accesos del día).

Gestión de Usuarios (CRUD): Alta, baja y modificación de alumnos, docentes y administrativos.

Validación Inteligente: Verificación de formato de placas (NOM-001-SCT-2-2016) para evitar errores.

Generación de QR: Creación automática de códigos QR únicos para cada vehículo registrado.

Bitácora Digital: Historial completo de entradas y salidas con filtros de búsqueda.

##############################################################################################

Módulo de Guardia (Punto de Acceso)

Escáner QR Integrado: Lectura rápida de gafetes mediante la cámara del dispositivo.

Lógica "Anti-Passback": El sistema detecta automáticamente si el vehículo está entrando o saliendo.

Feedback Visual: Pantallas de colores (Verde/Azul/Rojo) para una rápida toma de decisiones en caseta.

Control de Aforo: Visualización en tiempo real de cuántos y cuáles vehículos están dentro del campus.

#################################################################################################

Tecnologías Utilizadas

Este proyecto fue construido utilizando un stack moderno y escalable:

Frontend: React.js + Vite (Velocidad y modularidad).

Estilos: Tailwind CSS (Diseño responsivo y moderno).

Backend & Base de Datos: Firebase (Firestore Database & Authentication).

Iconografía: Lucide React.

Tecnología QR: react-qr-code (Generación) y @yudiel/react-qr-scanner (Lectura).

#######################################################################

Instalación y Despliegue Local:

Clonar el repositorio:

git clone [https://github.com/TU_USUARIO/tecpass-cancun.git](https://github.com/TU_USUARIO/tecpass-cancun.git)
cd tecpass-cancun


Instalar dependencias:

npm install


Configurar Firebase:

Crea un proyecto en Firebase Console.

Habilita Authentication (Email/Password) y Firestore Database.

Crea un archivo src/firebase.js y pega tus credenciales:

// src/firebase.js
import { initializeApp } from 'firebase/app';
// ... 


Ejecutar el servidor de desarrollo:

npm run dev


Abrir en el navegador:
Visita http://localhost:5173

Roles de Usuario

El sistema cuenta con control de acceso basado en roles (RBAC):

Administrador (admin@tecnm.mx): Acceso total al sistema, gestión de base de datos y reportes.

Guardia (guardia@tecnm.mx): Acceso restringido únicamente al módulo de escaneo y validación.



