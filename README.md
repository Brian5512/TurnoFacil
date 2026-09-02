# TurnoFácil

Planificador semanal de horarios que funciona íntegramente en el navegador.

## Uso local

1. Descarga el repositorio como ZIP.
2. Extrae el contenido.
3. Abre `index.html` con un navegador moderno.

No requiere instalación ni conexión a Internet. Los datos se guardan automáticamente en el navegador. La opción **Respaldar datos** permite descargar trabajadores, disponibilidades, reglas e historial en JSON para restaurarlos en otro computador con **Importar respaldo**.

## Estructura

- `index.html`: estructura de la interfaz.
- `css/styles.css`: estilos visuales e impresión.
- `js/app.js`: trabajadores, disponibilidad, turnos, guardado y exportación.
- `assets/`: recursos gráficos.

## Funciones

- Agregar trabajadores con nombre, RUT, horas semanales y disponibilidad diaria mediante listas de hora “Desde” y “Hasta”.
- Registrar el cargo como **Crew** o **Crew-Master** y validar el dígito verificador del RUT al agregarlo.
- Asignar manualmente cada turno entre opciones compatibles con la disponibilidad, mostrando inicio y fin.
- Abrir automáticamente la semana vigente según la fecha del sistema, navegar entre semanas, conservar el historial y copiar la semana anterior.
- Respetar los cierres operacionales: 23:00 de lunes a jueves y domingo; 01:00 del día siguiente viernes y sábado.
- Aplicar jornadas por contrato: 30 horas en 5x2 (5 días de 6 horas), 20 horas en 4x3 (4 días de 5 horas) y 16 horas solamente sábado y domingo (2 días de 8 horas).
- Agregar una hora de colación no trabajada a todos los turnos y ofrecer alternativas de inicio cada 30 minutos dentro de la disponibilidad.
- Permitir duraciones manuales cada 30 minutos dentro del rango disponible, sin superar las horas contratadas ni el máximo de días del patrón.
- Limitar todas las alternativas al horario operativo: inicio desde las 09:00 y término máximo a la 01:00, respetando el cierre específico de cada día.
- Elegir manualmente entre opciones de turno válidas para cada día.
- Copiar y pegar turnos solamente cuando caben en la disponibilidad del trabajador de destino.
- Comparar horas asignadas con horas contratadas.
- Mostrar alertas por RUT, horas insuficientes y contratos por ajustar.
- Descargar el horario para Excel y guardarlo como PDF mediante la impresión del navegador.
- Abrir una vista individual con turno diario, horas históricas y cantidad de cierres por trabajador.
- Crear e importar respaldos completos en formato JSON.

## Privacidad

El repositorio no incluye nombres, RUT ni disponibilidades reales. Los dos trabajadores iniciales son ejemplos genéricos y pueden eliminarse o reemplazarse desde la interfaz.
