# Guía de contribución — PQRS SuperMarket

Este documento explica cómo trabaja el equipo con Git para que todos
sigamos el mismo flujo y no haya conflictos.

---

## Estado actual de las ramas

```
main        ← versión estable. Solo recibe merge al CERRAR un sprint completo.
  └── develop   ← rama de integración general del proyecto.
        └── sprint1   ← rama activa del Sprint 1. Todo el trabajo actual va aquí.
```

> **Regla de oro:** Nadie hace push directo a `main` ni a `develop`.
> Todo cambio pasa por `sprint1` primero, y desde ahí se hace merge
> a `develop` al cerrar el sprint.

---

## Flujo de trabajo según la situación

### Situación A — Tengo una tarea nueva asignada en el sprint actual

Este es el caso normal. Sigue estos pasos en orden:

**1. Asegúrate de partir desde `sprint1` actualizado:**
```bash
git checkout sprint1
git pull origin sprint1
```

**2. Crea tu rama personal para la tarea:**
```bash
git checkout -b feature/nombre-descriptivo-de-tu-tarea
```

Ejemplos reales del proyecto:
```bash
git checkout -b feature/rnf-correccion-final
git checkout -b feature/diagrama-entidad-relacion
git checkout -b feature/prototipo-formulario-cliente
```

**3. Trabaja, guarda y haz commits frecuentes:**
```bash
git add .
git commit -m "docs: corregir RNF-04 para alinear con backlog"
```

**4. Sube tu rama a GitHub:**
```bash
git push origin feature/nombre-descriptivo-de-tu-tarea
```

**5. Abre un Pull Request en GitHub hacia `sprint1`** (no hacia `develop` ni `main`):
- Título del PR: igual al título del Issue que estás cerrando.
- Descripción: qué hiciste + menciona el Issue con `Closes #N`.
- Asigna un compañero como Reviewer.

---

### Situación B — Necesito corregir algo que ya está en `sprint1`

Aplica cuando el reviewer pidió cambios o encontraste un error después del merge.

```bash
# Primero actualiza sprint1
git checkout sprint1
git pull origin sprint1

# Crea una rama de corrección (nunca edites sprint1 directo)
git checkout -b fix/descripcion-del-error

# Haz los cambios, commit y push
git add .
git commit -m "fix: corregir criterio CA-03 del RNF-04"
git push origin fix/descripcion-del-error
```

Abre un nuevo PR hacia `sprint1` con descripción de qué se corrigió y por qué.

---

### Situación C — Alguien hizo cambios en `sprint1` y mi rama está desactualizada

Ocurre cuando tu compañero hizo merge antes que tú. Hay que traer esos cambios a tu rama:

```bash
# Estando en tu rama feature
git fetch origin
git merge origin/sprint1
```

Si hay conflictos, Git te los marcará en los archivos. Resuélvelos manualmente,
luego haz:
```bash
git add .
git commit -m "chore: resolver conflicto con sprint1"
```

Si el conflicto es complejo o no sabes cómo resolverlo, **avísale al líder
antes de forzar cualquier cambio.**

---

### Situación D — Subí algo a la rama equivocada (ej: directo a `main`)

Esto ya pasó en el proyecto. El procedimiento correcto para revertirlo sin
borrar el trabajo es:

**Paso 1** — Copia el archivo o cambio que subiste mal a un lugar seguro
(tu carpeta local, un bloc de notas, donde sea).

**Paso 2** — Avísale al líder para coordinar. No hagas `git revert` ni
`git reset` sin coordinación porque puede afectar a otros.

**Paso 3** — El líder revierte el commit en la rama incorrecta si es necesario.

**Paso 4** — Tú creas una rama `feature/` desde `sprint1` y subes el trabajo
correctamente por PR.

> La lección práctica: antes de hacer push, siempre verifica en qué rama estás
> con `git branch` o mirando GitKraken. El nombre de la rama aparece destacado
> en verde en la barra lateral izquierda.

---

## Ciclo de vida de una rama

```
sprint1 (actualizado)
    │
    ├── feature/mi-tarea   ← creas aquí, trabajas, haces commits
    │       │
    │       └── PR hacia sprint1 → revisión → merge
    │
sprint1 (con tu trabajo integrado)
```

Las ramas `feature/` y `fix/` se **borran** después del merge. No las acumules.
Para borrar una rama local ya mergeada:
```bash
git branch -d feature/nombre-de-tu-tarea
```

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
| `docs` | Solo documentación | `docs: corregir RNF-12 para app web Angular` |
| `chore` | Config, estructura, dependencias | `chore: agregar .gitignore para Node` |
| `refactor` | Reorganizar sin cambiar comportamiento | `refactor: separar rutas en archivos propios` |
| `style` | Formato, espacios (sin cambio de lógica) | `style: aplicar formato prettier` |
| `test` | Agregar o corregir pruebas | `test: agregar caso de prueba para login` |

**Reglas del mensaje:**
- Máximo 72 caracteres en la primera línea.
- En minúsculas siempre, sin punto al final.
- En español está bien para este proyecto.

---

## Reglas del equipo

1. **Nadie hace push directo a `main` ni a `develop`** — todo pasa por PR hacia `sprint1`.
2. **Nadie hace push directo a `sprint1`** — siempre desde una rama `feature/` o `fix/`.
3. **Máximo 1 tarea activa por persona** — termina lo que empezaste antes de tomar otra.
4. **Una tarea está hecha solo cuando** está en `sprint1` Y un compañero la revisó.
5. **Los commits son frecuentes** — no acumules días de trabajo en un solo commit.
6. **Ante un conflicto que no puedas resolver**, avísale al líder antes de forzar cambios.
7. **Verifica siempre en qué rama estás** antes de hacer `git push`.

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