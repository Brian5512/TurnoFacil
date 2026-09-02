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
- Editar manualmente cada turno con dos listas, **Desde** y **Hasta**, que muestran horas cada 30 minutos entre 00:00 y 23:00.
- Marcar un día sin turno mediante su botón **Libre** y sumar automáticamente las horas de todos los turnos en la columna **Asignadas**.
- Abrir automáticamente la semana vigente según la fecha del sistema, navegar entre semanas, conservar el historial y copiar la semana anterior.
- Respetar los cierres operacionales: 23:00 de lunes a jueves y domingo; 01:00 del día siguiente viernes y sábado.
- Aplicar jornadas por contrato: 30 horas en 5x2 (5 días de 6 horas), 20 horas en 4x3 (4 días de 5 horas) y 16 horas solamente sábado y domingo (2 días de 8 horas).
- Agregar una hora de colación no trabajada a todos los turnos y ofrecer alternativas de inicio cada 30 minutos.
- Permitir duraciones manuales cada 30 minutos, completando las horas contratadas en exactamente 5 días para 5x2, 4 días para 4x3 y sábado y domingo para 16 horas.
- Consultar la disponibilidad como información de referencia, sin bloquear ni modificar la asignación manual del administrador.
- Permitir seleccionar horas desde las 00:00 y respetar el cierre máximo específico de cada día.
- Elegir manualmente entre opciones de turno válidas para cada día.
- Copiar y pegar turnos respetando las reglas contractuales y el cierre de cada día.
- Comparar horas asignadas con horas contratadas.
- Descargar el horario para Excel y guardarlo como PDF mediante la impresión del navegador.
- Abrir una vista individual con turno diario, horas históricas y cantidad de cierres por trabajador.
- Crear e importar respaldos completos en formato JSON.

## Privacidad

El repositorio no incluye nombres, RUT ni disponibilidades reales. Los dos trabajadores iniciales son ejemplos genéricos y pueden eliminarse o reemplazarse desde la interfaz.
