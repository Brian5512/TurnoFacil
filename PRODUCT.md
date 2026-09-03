# TurnoFácil

## Producto

TurnoFácil es un planificador semanal local para equipos Burger King que permite construir horarios manuales y consultar por separado la disponibilidad de cada integrante. Debe funcionar como una herramienta operativa rápida, reconocible y confiable, tanto abierta directamente desde el computador como publicada en GitHub Pages.

## Usuario principal

La persona encargada de organizar los turnos de un equipo en Chile. Trabaja principalmente desde un computador y necesita revisar la semana completa, detectar horas pendientes y ajustar turnos sin depender de un sistema externo.

## Flujo principal

1. Registrar trabajadores con nombre, RUT, cargo, horas semanales y permiso de cierre.
2. Definir disponibilidad por día mediante una jornada completa, un rango de inicio y fin o no disponibilidad.
3. Configurar la apertura y el cierre de cada día y asignar los turnos manualmente, usando la disponibilidad solo como referencia.
4. Comparar las horas asignadas con las pactadas y ajustar la semana sin bloqueos automáticos.
5. Respaldar datos y exportar el resultado a Excel o PDF.

## Reglas confirmadas

- La interfaz y los mensajes están en español.
- Los cargos disponibles son Crew y Crew-Master.
- La distribución 5x2 o 4x3 sirve únicamente como referencia y no bloquea días de trabajo adicionales o distintos.
- La disponibilidad es informativa para el administrador y no bloquea la asignación manual.
- Los contratos de 16 horas pueden asignarse cualquier día cuando sea necesario.
- Cada turno suma una hora de colación a las horas efectivamente trabajadas.
- La apertura y el cierre se pueden modificar por día para cada semana sin eliminar turnos existentes.
- El horario predeterminado es 09:00–23:00; viernes y sábado cierran a la 01:00.
- Los selectores manuales permiten comenzar desde las 00:00 cuando la apertura del día lo permite.
- Los turnos manuales pueden diferir de la disponibilidad indicada por decisión del administrador.
- Las horas asignadas pueden superar las horas contratadas; el total se muestra en rojo sin bloquear la edición.
- El estado se conserva localmente en el navegador.
- La semana completa debe verse sin desplazamiento horizontal en computador.
- Todos los encabezados de día comparten el mismo tratamiento visual.
- La navegación principal vive en una barra lateral de escritorio; Horarios es la sección operativa principal.
- La identidad visual usa la paleta cálida de Burger King sin alterar reglas, datos ni compatibilidad local.
- Guardar horario genera una planilla `.xls` imprimible del local Plaza Bio Bio, con logo Burger King, título “Horario crew”, columna RUT, turnos unidos por un guion, días libres en negro y columna de firma ampliada.

## Restricciones de implementación

- Mantener la aplicación como HTML, CSS y JavaScript estáticos, sin instalación obligatoria.
- Preservar los datos existentes y la compatibilidad de localStorage.
- Mantener la publicación en GitHub Pages y una copia descargable para uso local.
- La tabla semanal es la superficie principal; el diseño debe priorizar rapidez, legibilidad y control sobre decoración.
- El logotipo, la paleta y el nombre Burger King se usan como identidad contextual del local; no deben convertirse en elementos interactivos.
