# Colaboración en el proyecto

> [!IMPORTANT]
> **No se debe trabajar directamente sobre la rama `main`.** Todos los cambios deberán realizarse desde una rama independiente para mantener el proyecto organizado y evitar conflictos entre los integrantes del equipo.

## Flujo de trabajo

Cada integrante del equipo deberá seguir el siguiente proceso:

```text
1. Clonar el repositorio
        │
        ▼
2. Crear una nueva rama
        │
        ▼
3. Realizar los cambios correspondientes
        │
        ▼
4. Guardar los cambios (Commit)
        │
        ▼
5. Publicar la rama en GitHub
        │
        ▼
6. Crear un Pull Request
        │
        ▼
7. Revisar y aprobar los cambios (Lider del proyecto)
        │
        ▼
8. Unir los cambios a la rama principal (Lider del proyecto)
```

---

# Convención para nombrar ramas

Cada rama debe indicar claramente el trabajo que se está realizando.

| Tipo                  | Ejemplo              |
| --------------------- | -------------------- |
| Nueva funcionalidad   | `feature/login`      |
| Nueva pantalla        | `feature/catalogo`   |
| Carrito de compras    | `feature/carrito`    |
| Corrección de errores | `fix/error-login`    |
| Documentación         | `docs/readme`        |
| Refactorización       | `refactor/productos` |

## Etructura de RAMAS en GitHub

Esta será la estructura que trabajaremos (Gissel y Leslie), durante la primera etapa, que es la diseño de HTML y CSS. Luego pasaremos a la **ETPA 2 que las de lógica de JavaScript** :

```text
Repositorio
│
├── main (Es la rama pincipal, aquí nadie debe trabajar, solo cuando los cambios del pull Request se acepten.)
│
│
├── feature/inicio (Rolando)
│
├── feature/carrito (Rolando)
│
├── feature/cuenta (Rolando)
│
├── feature/favoritos (Rolando)
│
├── feature/novedades (Rolando)
│
├── feature/productos (Gissel)
│
├── feature/ofertas  (Gissel)
│
├── feature/nosotros  (Leslie)
│
└── feature/contacto (Leslie)
```

---

# Comandos básicos de Git

| Comando                       | ¿Para qué sirve?                                            | ¿Cuándo usarlo?                                                     |
| ----------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| `git clone URL`               | Descarga el repositorio desde GitHub.                       | Solo la primera vez que se obtiene el proyecto.                     |
| `git status`                  | Muestra el estado de los archivos modificados.              | Antes de guardar cambios o para verificar el estado del proyecto.   |
| `git branch`                  | Lista todas las ramas existentes.                           | Para saber en qué rama estás trabajando.                            |
| `git switch nombre-rama`      | Cambia a una rama existente.                                | Cuando necesites trabajar en otra rama.                             |
| `git switch -c nombre-rama`   | Crea una nueva rama y cambia automáticamente a ella.        | Antes de comenzar una nueva funcionalidad o corrección.             |
| `git add .`                   | Agrega todos los cambios realizados al área de preparación. | Antes de crear un commit.                                           |
| `git commit -m "mensaje"`     | Guarda los cambios de forma local con una descripción.      | Después de finalizar una parte del trabajo.                         |
| `git pull origin main`        | Descarga los cambios más recientes de la rama principal.    | Antes de comenzar a trabajar para mantener el proyecto actualizado. |
| `git push origin nombre-rama` | Publica la rama en GitHub.                                  | Después de realizar uno o varios commits.                           |
| `git log --oneline`           | Muestra el historial de commits de forma resumida.          | Para consultar cambios anteriores.                                  |

---

# Ejemplo de trabajo diario

Cada vez que vayas a trabajar en el proyecto, sigue estos pasos:

## 1. Cambiar a la rama principal

```bash
git switch main
```

## 2. Descargar los cambios más recientes

```bash
git pull origin main
```

## 3. Crear una nueva rama

Ejemplo:

```bash
git switch -c feature/catalogo
```

## 4. Realizar los cambios necesarios

Realizan sus cambios en su rama, con la parte del proyecto que se les han asignado, para trabajar.

## 5. Verificar los archivos modificados

```bash
git status
```

## 6. Guardar los cambios

```bash
git add .
```

```bash
git commit -m "Agrega el catálogo de productos"
```

## 7. Publicar la rama

```bash
git push origin feature/catalogo
```

Finalmente, desde GitHub se deberá crear un **Pull Request** para solicitar la revisión e integración de los cambios al proyecto.

---

# Reglas del equipo

- No trabajar directamente sobre la rama `main`.
- Cada funcionalidad debe desarrollarse en una rama independiente.
- Escribir mensajes de commit claros y descriptivos.
- Descargar los cambios más recientes antes de comenzar a trabajar.
- Publicar los cambios únicamente en la rama correspondiente.
- No eliminar archivos o carpetas sin comunicarlo al equipo.
- Revisar el funcionamiento del proyecto antes de realizar un commit.
- Mantener una comunicación constante con los demás integrantes para evitar trabajar sobre la misma funcionalidad.

---

# Ejemplo de mensajes de Commit

Se recomienda utilizar mensajes cortos y descriptivos.

| Correcto                              | Incorrecto     |
| ------------------------------------- | -------------- |
| `Agrega pantalla de inicio de sesión` | `Cambios`      |
| `Corrige error del carrito`           | `Arreglé algo` |
| `Actualiza estilos del catálogo`      | `Update`       |
| `Mejora validación del formulario`    | `Prueba`       |
| `Agrega documentación del proyecto`   | `asdf`         |

## Instalación del proyecto

Para instalar el proyecto de forma local en una computadora con conexión a Internet, ejecuta los siguientes comandos desde PowerShell o Git Bash.

### 1. Prerrequisitos

Asegúrate de tener instalado el siguiente software:

- [Git](https://git-scm.com)

### 2. Clonar el repositorio

Para poderclonar este repositorio en tu máquina local, en git bash ejecuta:

```bash
git clone https://github.com/joserolandovelascopena-code/DeskStyle.git
```

> [!IMPORTANT]
> Para realizar cambios, publicar actualizaciones o colaborar en el desarrollo de DeskStyle, es necesario contar con los permisos correspondientes del repositorio. Si deseas contribuir al proyecto, comunícate con el administrador para solicitar acceso.
