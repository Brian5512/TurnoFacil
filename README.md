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

- Agregar trabajadores con nombre, RUT, horas semanales y disponibilidad diaria.
- Generar una propuesta de horario compatible con la disponibilidad.
- Elegir manualmente entre opciones de turno válidas para cada día.
- Comparar horas asignadas con horas contratadas.
- Imprimir o descargar el horario como CSV.

## Privacidad

El repositorio no incluye nombres, RUT ni disponibilidades reales. Los dos trabajadores iniciales son ejemplos genéricos y pueden eliminarse o reemplazarse desde la interfaz.
