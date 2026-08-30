---
name: TurnoFácil
description: "Mesa de operaciones semanal para planificar turnos con calma, precisión y alta densidad."
colors:
  forest: "#135b3a"
  forest-strong: "#0d442b"
  forest-soft: "#e8f3ec"
  forest-wash: "#f3f8f5"
  ink: "#17221b"
  muted: "#657269"
  subtle: "#657269"
  canvas: "#f2f4f0"
  paper: "#ffffff"
  paper-muted: "#f8f9f7"
  line: "#dce2db"
  line-strong: "#c9d2ca"
  amber: "#9a5a16"
  amber-soft: "#fff3df"
  danger: "#9d442e"
  danger-soft: "#fff0eb"
  focus: "#4d9a70"
typography:
  display:
    fontFamily: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
    fontSize: "clamp(25px, 2vw, 32px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.045em"
  headline:
    fontFamily: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
    fontSize: "23px"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
    fontSize: "13px"
    fontWeight: 400
  label:
    fontFamily: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
    fontSize: "11px"
    fontWeight: 720
rounded:
  sm: "7px"
  md: "11px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
    typography: "{typography.label}"
    rounded: "9px"
    padding: "0 15px"
    height: "42px"
  button-primary-hover:
    backgroundColor: "{colors.forest-strong}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "#34473a"
    typography: "{typography.label}"
    rounded: "9px"
    padding: "0 15px"
    height: "42px"
  button-text:
    backgroundColor: "transparent"
    textColor: "#46564b"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 9px"
    height: "29px"
  tab-default:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "34px"
  tab-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "34px"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "39px"
  status-rail:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "64px"
  schedule-cell:
    backgroundColor: "{colors.forest-wash}"
    textColor: "{colors.forest}"
    rounded: "6px"
    padding: "5px 6px"
  worker-disclosure:
    backgroundColor: "{colors.forest-soft}"
    textColor: "{colors.forest}"
    typography: "{typography.label}"
    rounded: "8px"
    padding: "0 12px"
    height: "44px"
---

# Design System: TurnoFácil

## Overview

**Creative North Star: "La Mesa de Operaciones Semanal"**

TurnoFácil se siente como una mesa de operaciones serena: la semana completa ocupa el centro, la información está compacta y cada control aparece donde ayuda a decidir. La interfaz privilegia precisión, confianza y lectura comparativa por encima de la expresión decorativa.

El sistema usa capas tonales planas, bordes finos y una única voz de acción en verde bosque. La densidad es deliberadamente alta en escritorio, pero los controles conservan estados perceptibles y, en pantallas estrechas, cada trabajador se convierte en una unidad desplegable de tamaño táctil accesible. No hay imágenes decorativas, gradientes ni desplazamiento horizontal para consultar la semana.

**Key Characteristics:**

- Tabla semanal como protagonista y fuente principal de verdad visual.
- Densidad operativa alta con jerarquía clara y números tabulares.
- Verde bosque único para acción, selección y confirmación.
- Capas tonales planas separadas por bordes, no por ornamentación.
- Respuesta móvil por divulgación progresiva de cada trabajador.

## Colors

La paleta combina verdes forestales sobrios con papeles fríos y estados semánticos discretos; el color siempre comunica función.

### Primary

- **Verde Operaciones:** Voz principal para acciones, selección, confirmación y encabezados de la grilla.
- **Bosque Profundo:** Estado de mayor énfasis para hover, encabezados persistentes y mensajes breves de confirmación.
- **Verde de Apoyo:** Fondo suave para controles seleccionados, roles, horas correctas y divulgaciones móviles.
- **Lavado de Turno:** Capa casi neutra que distingue recomendaciones y cabeceras de trabajador sin competir con los datos.

### Neutral

- **Tinta Operativa:** Texto principal y datos de mayor importancia.
- **Gris de Contexto:** Texto secundario, notas, metadatos y estados de menor jerarquía.
- **Lienzo Frío:** Fondo general de la aplicación.
- **Papel:** Superficie principal de paneles, celdas y campos.
- **Papel Atenuado:** Filas alternadas, pies de panel y superficies internas.
- **Línea Suave:** Divisores de baja presencia.
- **Línea Firme:** Contornos de campos, paneles y grupos de control.

### Semantic

- **Ámbar de Pendiente:** Advertencias y diferencias de horas que requieren revisión.
- **Ámbar de Fondo:** Capa tonal de soporte para advertencias.
- **Rojo de Excepción:** Eliminación, indisponibilidad y errores que exigen atención.
- **Rojo de Fondo:** Capa tonal de soporte para estados destructivos o no disponibles.
- **Verde de Foco:** Cambio de borde y anillo de foco visible en controles interactivos.

### Named Rules

**The One Operational Voice Rule.** El verde bosque es el único acento primario; no introduzcas un segundo color de acción.

**The Semantic Restraint Rule.** Reserva ámbar y rojo para advertencia, indisponibilidad, error o eliminación; nunca los uses como decoración.

## Typography

**Display Font:** Segoe UI Variable (con Aptos, Segoe UI y sans-serif como respaldo)
**Body Font:** Segoe UI Variable (con Aptos, Segoe UI y sans-serif como respaldo)

**Character:** Una sola familia de sistema mantiene la interfaz inmediata, nativa y compacta. La jerarquía surge de peso, tamaño, espaciado y alineación; no de contrastes tipográficos ornamentales.

### Hierarchy

- **Display** (700, fluido entre 25px y 32px, 1.08): título de la semana y principal ancla de orientación.
- **Headline** (700, 23px, 1.15): títulos de diálogos y tareas focales.
- **Title** (700, 17px, 1.1): marca y títulos compactos de módulos.
- **Body** (400, 13px): explicaciones breves y contexto operativo.
- **Label** (650–780, 9–11px): pestañas, encabezados de tabla, controles compactos, estados y metadatos; las etiquetas de sección pueden usar mayúsculas con espaciado moderado.

### Named Rules

**The Tabular Operations Rule.** Horas, fechas, totales y rangos usan cifras tabulares para que las columnas se comparen sin saltos.

**The Compact, Never Cryptic Rule.** Reduce tamaño solo cuando peso, contraste y contexto preservan la lectura; los controles táctiles crecen en móvil aunque la tipografía siga compacta.

## Layout

El escritorio usa un espacio de trabajo fluido de ancho completo con máximo de 1680px, una barra superior fija de 64px y márgenes laterales adaptativos. La secuencia vertical es comando semanal, utilidades, métricas, alertas y panel de planificación; el espaciado corto de 4–16px mantiene la relación entre controles, mientras 22–36px reservan aire para el marco general.

La tabla usa distribución fija para mostrar trabajador, horas, siete días, permiso de cierre y eliminación dentro del ancho disponible. En escritorio, cada día ocupa aproximadamente 10% y el primer campo 15%; la superficie permite desplazamiento vertical interno, pero oculta el horizontal. Entre 901px y 1250px ajusta proporciones y márgenes sin alterar la estructura.

A 900px la tabla deja de comportarse como grilla y cada fila se convierte en una tarjeta de trabajador con dos columnas desplegables. A 620px pasa a una sola columna, apila acciones y expande pestañas y controles al ancho disponible. Los objetivos táctiles críticos alcanzan 40–44px y la tabla nunca obliga a desplazarse horizontalmente.

**The Week-in-One-View Rule.** En computador, los siete días deben seguir visibles en una sola superficie sin desplazamiento horizontal.

## Elevation & Depth

El sistema es plano por defecto. La profundidad se comunica mediante cambios tonales, bordes de 1px, filas alternadas y encabezados persistentes; las sombras se reservan para elementos realmente superpuestos o activos: pestaña seleccionada, estado guardado, toast y diálogo modal. La barra superior usa una transparencia fría con desenfoque sutil para mantener contexto al desplazarse.

### Shadow Vocabulary

- **Pestaña activa** (`0 1px 2px rgba(16,45,28,.12)`): separa apenas la opción seleccionada de su riel tonal.
- **Estado guardado** (`0 0 0 4px #e2f1e8`): halo compacto alrededor del punto de confirmación.
- **Toast operativo** (`0 12px 35px rgba(12,35,21,.28)`): eleva una confirmación temporal sobre la mesa.
- **Diálogo modal** (`0 28px 90px rgba(12,34,21,.28)`): única elevación amplia, respaldada por un fondo oscurecido y desenfocado.

### Named Rules

**The Flat-by-Default Rule.** No uses sombras en paneles, métricas, celdas o controles en reposo; bordes y tonos deben resolver la jerarquía.

## Shapes

La forma es suavemente técnica: radios pequeños de 7px para campos y controles densos, medios de 11px para grupos y resúmenes, y grandes de 16px para paneles y diálogos. Botones principales usan 9px, los detalles internos pueden bajar a 5–6px y solo los toggles adoptan cápsula completa. Todos los contornos son finos y continuos; los elementos bloqueados pueden usar borde discontinuo para expresar restricción.

**The Proportional Radius Rule.** El radio crece con la escala del contenedor; no conviertas paneles grandes ni celdas operativas en cápsulas.

## Components

Los componentes se sienten precisos, contenidos y cercanos al lenguaje nativo del sistema operativo; el estado pesa más que el adorno.

### Buttons

- **Shape:** Rectángulo suavemente redondeado (9px), altura principal de 42px y padding horizontal de 15px.
- **Primary:** Fondo Verde Operaciones, texto blanco y peso 750; se reserva para generar, guardar o confirmar la tarea principal.
- **Hover / Focus:** Hover en Bosque Profundo, presión con escala 0.98 y foco visible de 3px derivado del Verde de Foco.
- **Secondary:** Papel con Línea Firme y texto verde grisáceo; el hover refuerza el borde y atenúa el fondo.
- **Text:** Control de utilidad de 29px, sin borde ni fondo en reposo; revela Papel y Verde Operaciones al pasar el puntero.

### Chips

- **Style:** Etiquetas compactas de 6px de radio y 5px por 8px de padding; usan Ámbar de Fondo para alertas, gris frío para datos y Verde de Apoyo para agregados.
- **State:** No actúan como un segundo sistema de acciones; resumen alertas o cantidades dentro del riel correspondiente.

### Cards / Containers

- **Corner Style:** 11px para métricas y alertas; 16px para el panel principal y los diálogos.
- **Background:** Papel sobre Lienzo Frío, con Papel Atenuado en franjas internas y filas alternadas.
- **Shadow Strategy:** Planas en reposo; solo los overlays reciben elevación amplia.
- **Border:** Línea Suave o Línea Firme de 1px según jerarquía.
- **Internal Padding:** Compacto, normalmente entre 10px y 16px.

### Inputs / Fields

- **Style:** Papel, Línea Firme de 1px, radio pequeño de 7px y altura de 39px en formularios; dentro de la tabla bajan a 23–31px para sostener densidad.
- **Focus:** El borde cambia a Verde de Foco y el control recibe un anillo exterior visible de 3px.
- **Error / Disabled:** Indisponibilidad usa Rojo de Fondo y Rojo de Excepción; deshabilitado usa gris frío, menor contraste y cursor no disponible.

### Navigation

La navegación semanal agrupa flechas, fecha y “Hoy” en un contenedor de 42px con Papel, Línea Firme y radio medio. Las pestañas viven en un riel gris verdoso de 3px de padding; la activa vuelve a Papel, toma Verde Operaciones y recibe la sombra mínima de selección. En móvil, los grupos crecen en altura y se distribuyen a todo el ancho.

### Status Rail

Las tres métricas forman un riel continuo de Papel con divisores internos, valores de 24px en Bosque Profundo y notas de 10–11px. Alertas y confirmaciones usan la misma geometría para mantener el diagnóstico cerca de la tabla sin añadir tarjetas decorativas.

### Schedule Cell

La celda de turno combina un selector compacto con un detalle de 62px. Una recomendación usa Lavado de Turno, borde verde suave y texto Verde Operaciones; apertura, intermedio y cierre se distinguen solo mediante bordes discretos. Inicio, fin y horas usan cifras tabulares, y la colación se separa con una línea discontinua.

### Worker Disclosure

Por debajo de 900px, cada trabajador se presenta como tarjeta y un botón “Ver semana” de 44px revela sus días. La cabecera usa Lavado de Turno, el botón Verde de Apoyo y el contenido se organiza en dos columnas; por debajo de 620px se reduce a una columna.

## Do's and Don'ts

### Do:

- **Do** mantener la tabla semanal como protagonista y las utilidades en una jerarquía secundaria.
- **Do** usar Verde Operaciones para acciones, selección y confirmación, y cifras tabulares para tiempos y totales.
- **Do** separar superficies con Papel, Papel Atenuado, bordes de 1px y radios proporcionales.
- **Do** conservar foco visible, estados semánticos legibles y objetivos táctiles de 40–44px en móvil.
- **Do** transformar cada trabajador en una tarjeta desplegable cuando la grilla ya no pueda leerse con comodidad.

### Don't:

- **Don't** introducir un segundo acento primario, gradientes o imágenes decorativas.
- **Don't** usar ámbar o rojo fuera de advertencias, indisponibilidad, error y eliminación.
- **Don't** elevar paneles y celdas en reposo con sombras; la profundidad cotidiana es tonal.
- **Don't** sacrificar la vista semanal completa por controles sobredimensionados ni habilitar desplazamiento horizontal en computador.
- **Don't** convertir la densidad en texto críptico: conserva contexto, contraste y estados claros.
