# TurnoFácil

Planificador semanal de horarios que funciona íntegramente en el navegador.

## Uso local

1. Descarga el repositorio como ZIP.
2. Extrae el contenido.
3. Abre `index.html` con un navegador moderno.

No requiere instalación ni conexión a Internet. Los datos que escribas se guardan mediante `localStorage` únicamente en el navegador y dispositivo donde uses la aplicación.

## Estructura

- `index.html`: estructura de la interfaz.
- `css/styles.css`: estilos visuales e impresión.
- `js/app.js`: trabajadores, disponibilidad, turnos, guardado y exportación.
- `assets/`: recursos gráficos.

## Funciones

- Agregar trabajadores con nombre, RUT, horas semanales y disponibilidad diaria mediante listas de hora “Desde” y “Hasta”.
- Generar recomendaciones compatibles con la disponibilidad y las horas semanales, mostrando inicio y fin de cada turno.
- Trabajar siempre con la semana completa vigente, de lunes a domingo, calculada desde la fecha del sistema.
- Respetar los cierres operacionales: 23:00 de lunes a jueves y domingo; 01:00 del día siguiente viernes y sábado.
- Aplicar jornadas por contrato: 30 horas en 5x2 (5 días de 6 horas), 20 horas en 4x3 (4 días de 5 horas) y 16 horas solamente sábado y domingo (2 días de 8 horas).
- Elegir manualmente entre opciones de turno válidas para cada día.
- Comparar horas asignadas con horas contratadas.
- Imprimir o descargar el horario como CSV.

## Privacidad

El repositorio no incluye nombres, RUT ni disponibilidades reales. Los dos trabajadores iniciales son ejemplos genéricos y pueden eliminarse o reemplazarse desde la interfaz.
