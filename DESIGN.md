---
name: TurnoFácil Burger King
description: "Mesa operativa semanal cálida, compacta y reconocible para administrar turnos de un local Burger King."
colors:
  brown: "#35170c"
  brown-deep: "#281008"
  orange: "#ed4c05"
  orange-dark: "#cf3d00"
  cream: "#f7f3ed"
  paper: "#fffdf9"
  ink: "#2e1b13"
  muted: "#75645b"
  line: "#e2d6ca"
  green: "#4c7f2d"
  green-soft: "#e4f1d5"
  danger: "#d63b26"
typography:
  display: '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif'
  body: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
rounded:
  control: "7px–10px"
  panel: "16px"
---

# Sistema visual

## Dirección

La interfaz se siente como una estación de operaciones Burger King: enérgica pero ordenada. El marrón concentra navegación y encabezados, el naranja identifica la acción o sección principal y el crema reduce el cansancio durante jornadas largas. La identidad está presente sin competir con los horarios.

## Jerarquía

- La barra lateral fija reúne navegación, archivos y la acción Agregar trabajador.
- La cabecera superior muestra únicamente la semana, su navegación y el estado de guardado.
- La tabla semanal es la superficie dominante y siempre intenta mostrar los siete días completos en escritorio.
- Los totales usan verde cuando cumplen, ámbar cuando faltan horas y rojo cuando exceden lo pactado.

## Tipografía

Los títulos usan una voz redondeada y contundente; datos, controles y textos operativos usan Segoe UI Variable o su alternativa de sistema. Horas y fechas deben conservar cifras tabulares. Las etiquetas de tabla son compactas, mayúsculas y de alto contraste.

## Componentes

- Navegación: icono lineal, texto breve y fondo naranja solo para la sección activa.
- Botón principal: naranja con texto blanco; no hay botones decorativos secundarios del mismo peso.
- Tabla: cabecera marrón continua, columna Asignadas naranja, filas crema alternadas y bordes cálidos finos.
- Campos de turno: verde suave cuando están activos; gris crema cuando el día está libre.
- Diálogos: papel cálido, borde fino y sombra amplia solo por tratarse de una capa superpuesta.

## Reglas

- No habilitar desplazamiento horizontal de la semana en escritorio.
- No usar colores distintos para resaltar un día específico.
- No añadir métricas, alertas o tarjetas que resten espacio a la tabla.
- No convertir todos los controles en cápsulas; reservarlas para estados binarios.
- En móvil, transformar cada trabajador en una tarjeta desplegable y mantener objetivos táctiles de al menos 40px.
- Preservar foco visible, contraste y estados deshabilitados comprensibles.
