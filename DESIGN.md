---
name: TurnoFácil Burger King
description: "Planilla semanal Burger King convertida en una herramienta operativa local, compacta y reconocible."
colors:
  brown: "#35170c"
  brown-deep: "#281008"
  orange: "#cf3d00"
  orange-dark: "#a92f00"
  cream: "#f7f3ed"
  paper: "#fffdf9"
  burgundy: "#632b2e"
  burgundy-light: "#7b3638"
  off-shift: "#18110e"
  green: "#4c7f2d"
  danger: "#d63b26"
typography:
  display:
    fontFamily: '"Asap Condensed", "Segoe UI", sans-serif'
    fontWeight: 700
  body:
    fontFamily: '"Segoe UI Variable", Aptos, "Segoe UI", sans-serif'
rounded:
  control: "7px–10px"
  panel: "8px"
---

# Sistema visual

## Overview

Una planilla semanal Burger King llevada a una herramienta operativa: sidebar chocolate, acción naranja, papel blanco y cabeceras burdeos. La tabla es la fuente principal de verdad y conserva la lectura documental del horario físico.

## Colors

- Marrón para navegación e identidad estructural.
- Burdeos para fechas, días y encabezados de la planilla.
- Naranja oscuro para acciones principales con texto blanco de contraste suficiente.
- Marrón casi negro para días libres o sin disponibilidad; blanco para turnos asignados.
- Verde, ámbar y rojo se reservan para totales correctos, pendientes o excedidos.

## Typography

Los títulos y encabezados usan **Asap Condensed Bold**, incluida localmente en `assets/fonts/AsapCondensed-Bold.woff2`. Datos, controles y textos operativos usan Segoe UI Variable o su alternativa de sistema. Horas y fechas usan cifras tabulares. En la mesa operativa no se baja de 11 px para información principal.

## Layout

- Sidebar fija de 248 px en escritorio y 208 px entre 901–1280 px.
- Cabecera con tienda editable, título, logos, navegación semanal, Guardar horario y estado de guardado.
- Los siete días deben verse completos sin desplazamiento horizontal en computador.
- A 900 px o menos, la navegación se convierte en una retícula de dos filas y cada trabajador pasa a una ficha desplegable.
- A 620 px o menos, la ficha usa una sola columna y mantiene controles táctiles de 40–44 px.

## Elevation & Depth

La planilla se separa del lienzo crema con un borde oscuro fino y una sombra amplia de baja opacidad. Los diálogos son la única capa de elevación fuerte. Las celdas y controles cotidianos se distinguen por tono y borde, no por sombras decorativas.

## Shapes

Los controles usan radios de 3–10 px según su tamaño. El panel principal conserva 8 px para parecer una hoja de trabajo, no una tarjeta promocional. Las cápsulas se reservan para estados binarios como el permiso de cierre.

## Components

- Navegación: icono lineal, texto breve y fondo naranja únicamente para la sección activa.
- Guardar horario: botón naranja con icono de disquete; al guardar cambia temporalmente a verde y confirma mediante un mensaje.
- Nombre de tienda: campo subrayado en burdeos, naranja al foco.
- Tabla: cabecera burdeos, banda de fecha burdeos claro, cuadrícula definida y columna Asignadas semántica.
- Celda libre: bloque oscuro con selectores y acciones visibles en tonos claros.
- Celda asignada: papel blanco con selectores Desde/Hasta.
- Eliminar: botón rojo suave identificable, con confirmación antes de borrar.
- Diálogos: papel cálido, borde fino, campos de 43 px y foco visible.

## Do's and Don'ts

- Do mantener la planilla semanal como protagonista.
- Do usar bloques oscuros para días libres y papel blanco para turnos.
- Do mantener visibles los nombres completos de navegación en móvil.
- Do conservar el foco, el contraste y objetivos táctiles de al menos 40 px.
- Don't devolver las cabeceras a verde o naranja.
- Don't usar verde como fondo de los turnos.
- Don't añadir métricas o tarjetas que resten espacio a la semana.
- Don't resolver el móvil con desplazamiento horizontal de toda la interfaz.
- Don't convertir todos los controles en cápsulas.
