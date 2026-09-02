# TurnoFácil

## Producto

TurnoFácil es un planificador semanal local para construir horarios de trabajo a partir de la disponibilidad real y las horas contratadas de cada integrante. Debe funcionar como una herramienta operativa rápida, comprensible y confiable, tanto abierta directamente desde el computador como publicada en GitHub Pages.

## Usuario principal

La persona encargada de organizar los turnos de un equipo en Chile. Trabaja principalmente desde un computador y necesita revisar la semana completa, detectar horas pendientes y ajustar turnos sin depender de un sistema externo.

## Flujo principal

1. Registrar trabajadores con nombre, RUT, cargo, horas semanales y permiso de cierre.
2. Definir disponibilidad por día mediante una jornada completa, un rango de inicio y fin o no disponibilidad.
3. Asignar cada turno manualmente entre alternativas que respeten disponibilidad, contrato y reglas de jornada.
4. Revisar las alertas de horas pendientes y ajustar la semana.
5. Guardar historial, respaldar datos y exportar el resultado a Excel o PDF.

## Reglas confirmadas

- La interfaz y los mensajes están en español.
- Los cargos disponibles son Crew y Crew-Master.
- Los contratos de 30 horas deben completar exactamente 5 días de trabajo y 2 de descanso (5x2).
- Los contratos de 20 horas deben completar exactamente 4 días de trabajo y 3 de descanso (4x3).
- La disponibilidad se valida al crear al trabajador para asegurar que permita completar los días y horas pactados.
- Los contratos de 16 horas trabajan solo fines de semana.
- Cada turno suma una hora de colación a las horas efectivamente trabajadas.
- Los turnos pueden comenzar desde las 09:00.
- Lunes a jueves y domingo cierran a las 23:00.
- Viernes y sábado pueden extenderse hasta la 01:00 del día siguiente.
- Los turnos manuales nunca deben exceder la disponibilidad indicada.
- El estado se conserva localmente en el navegador.
- La semana completa debe verse sin desplazamiento horizontal en computador.

## Restricciones de implementación

- Mantener la aplicación como HTML, CSS y JavaScript estáticos, sin instalación obligatoria.
- Preservar los datos existentes y la compatibilidad de localStorage.
- Mantener la publicación en GitHub Pages y una copia descargable para uso local.
- La tabla semanal es la superficie principal; el diseño debe priorizar rapidez, legibilidad y control sobre decoración.
