# Guía de contribución — PQRS SuperMarket

Este documento explica cómo trabaja el equipo con Git para que
todos sigamos el mismo flujo y no haya conflictos.

---

## Ramas del proyecto

| Rama | Propósito |
|------|-----------|
| `main` | Versión estable. Nadie trabaja aquí directo. Solo recibe merge al cerrar un sprint. |
| `develop` | Rama de integración. Aquí se unen todos los trabajos del equipo. |
| `feature/nombre-tarea` | Rama personal por tarea. Se crea desde `develop` y se borra al hacer merge. |

---

## Flujo de trabajo paso a paso

### 1. Antes de empezar cualquier tarea

Asegúrate de tener `develop` actualizado:

```bash
git checkout develop
git pull origin develop
```

### 2. Crear tu rama para la tarea

El nombre de la rama debe ser descriptivo y en minúsculas, sin espacios:

```bash
git checkout -b feature/nombre-de-tu-tarea
```

Ejemplos reales:
```bash
git checkout -b feature/requerimientos-funcionales
git checkout -b feature/diagrama-casos-uso
git checkout -b feature/modelo-entidad-relacion
```

### 3. Trabajar en tu tarea

Guarda los archivos, haz commits frecuentes con mensajes claros:

```bash
git add .
git commit -m "docs: agregar tabla de requerimientos funcionales RF-001 a RF-010"
```

### 4. Subir tu rama a GitHub

```bash
git push origin feature/nombre-de-tu-tarea
```

### 5. Abrir un Pull Request (PR)

- Ve al repo en GitHub
- Aparecerá un banner amarillo con tu rama → clic en **"Compare & pull request"**
- Título del PR: igual al título del Issue que estás cerrando
- Descripción: escribe qué hiciste y menciona el Issue con `Closes #N`
  (ej: `Closes #3` cierra automáticamente el Issue 3 al hacer merge)
- Asigna a un compañero como **Reviewer**
- Clic en **"Create pull request"**

### 6. Revisión

El reviewer revisa, comenta si hay algo que corregir o aprueba.
Una vez aprobado, el líder hace el merge a `develop`.

---

## Convención de commits (Conventional Commits)

Todo commit debe tener este formato:

```
tipo: descripción breve en minúsculas
```

| Tipo | Cuándo usarlo | Ejemplo |
|------|---------------|---------|
| `feat` | Nueva funcionalidad | `feat: agregar endpoint POST /pqrs` |
| `fix` | Corrección de error | `fix: corregir validación de correo` |
| `docs` | Solo documentación | `docs: agregar especificación CU-003` |
| `chore` | Config, estructura, dependencias | `chore: agregar .gitignore para Node` |
| `refactor` | Reorganizar sin cambiar comportamiento | `refactor: separar rutas en archivos propios` |
| `style` | Formato, espacios (sin cambio de lógica) | `style: aplicar formato prettier` |
| `test` | Agregar o corregir pruebas | `test: agregar caso de prueba para login` |

### Reglas del mensaje de commit

- Máximo 72 caracteres en la primera línea
- En minúsculas siempre
- Sin punto al final
- En español está bien para este proyecto

---

## Reglas del equipo

1. **Nadie hace push directo a `main` ni a `develop`** — todo pasa por PR
2. **Máximo 1 tarea activa por persona** — termina lo que empezaste antes de tomar otra
3. **Una tarea está hecha solo cuando** está en el repo Y un compañero la revisó
4. **Los commits son frecuentes** — no acumules 3 días de trabajo en un solo commit
5. **Si tienes un conflicto que no puedes resolver**, avísale al líder antes de forzar cambios

---

## Estructura de carpetas

```
pqrs-supermarket/
├── frontend/         # App Angular (web + responsiva móvil)
├── backend/          # API REST con Node.js + Express
├── base-de-datos/    # Scripts SQL
├── docs/
│   ├── actas/        # Actas de reunión
│   ├── requerimientos/  # RF, RNF, Product Backlog
│   ├── diagramas/    # CU, arquitectura, ER
│   ├── prototipos/   # Capturas o exportaciones de diseño
│   └── pruebas/      # Plan y resultados de pruebas
├── README.md
└── CONTRIBUTING.md   # Este archivo
```

---

## Confirmación de lectura

Cada integrante debe escribir un comentario en el Issue #6 confirmando
que leyó este documento antes de empezar a trabajar.
