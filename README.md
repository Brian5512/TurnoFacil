# TurnoFácil

Planificador semanal de horarios para equipos Burger King que funciona íntegramente en el navegador. Combina una barra lateral de operaciones con una planilla de cabeceras burdeos, días libres oscuros y turnos asignados sobre blanco.

## Uso local

1. Descarga el repositorio como ZIP.
2. Extrae el contenido.
3. Abre `index.html` con un navegador moderno.

No requiere instalación ni conexión a Internet; incluso la fuente Asap Condensed está incluida localmente. Los datos se guardan automáticamente en el navegador y el botón **Guardar horario** permite confirmar de forma explícita la semana en curso. La opción **Respaldar** descarga trabajadores, disponibilidades, reglas e historial en JSON para restaurarlos en otro computador mediante **Importar**.

## Estructura

- `index.html`: estructura de la interfaz.
- `css/styles.css`: estilos visuales e impresión.
- `js/app.js`: trabajadores, disponibilidad, turnos, guardado y exportación.
- `assets/`: recursos gráficos.

## Funciones

- Agregar trabajadores con nombre, RUT, horas semanales y disponibilidad diaria mediante listas de hora “Desde” y “Hasta”.
- Registrar el cargo como **Crew** o **Crew-Master** y validar el dígito verificador del RUT al agregarlo.
- Editar manualmente cada turno con dos listas, **Desde** y **Hasta**, que muestran alternativas cada 30 minutos dentro del horario configurado para el día.
- Marcar un día sin turno mediante su botón **Libre** y sumar automáticamente las horas de todos los turnos en la columna **Asignadas**.
- Abrir automáticamente la semana vigente según la fecha del sistema, navegar entre semanas y conservar el historial.
- Identificar el local con un nombre de tienda editable que queda guardado junto con la planificación.
- Editar la apertura y el cierre de cada día para la semana seleccionada; por defecto son 09:00–23:00, con cierre a la 01:00 viernes y sábado.
- Usar las horas contratadas como referencia para sugerir la duración inicial del turno, permitiendo trabajar cualquier día y distribuir la semana libremente.
- Agregar una hora de colación no trabajada a todos los turnos y ofrecer alternativas de inicio cada 30 minutos.
- Permitir duraciones manuales cada 30 minutos sin bloquear la asignación al alcanzar las horas contratadas.
- Consultar la disponibilidad como información de referencia, sin bloquear ni modificar la asignación manual del administrador.
- Permitir comenzar desde las 00:00 cuando la apertura del día esté configurada a esa hora.
- Elegir manualmente entre opciones de turno válidas para cada día.
- Copiar y pegar turnos respetando el cierre de cada día.
- Comparar horas asignadas con horas contratadas: el total se muestra en rojo cuando supera el contrato, sin impedir continuar editando.
- Descargar una planilla `.xls` compatible con Excel, inspirada en el horario operativo de Burger King, con columnas **Desde** y **Hasta**, días libres en negro y espacio para firma; también puede guardarse como PDF mediante la impresión del navegador.
- Abrir una vista individual con cargo, contrato, horas de la semana y turno diario por trabajador.
- Crear e importar respaldos completos en formato JSON.
- Navegar desde una barra lateral por semana, disponibilidades, horarios, trabajadores, vista individual, apertura/cierre y archivos.
- Usar una vista tipo planilla en escritorio y fichas individuales de trabajador en pantallas pequeñas.

## Privacidad

El repositorio no incluye nombres, RUT ni disponibilidades reales. Los dos trabajadores iniciales son ejemplos genéricos y pueden eliminarse o reemplazarse desde la interfaz. El almacenamiento pertenece al navegador, perfil y computador donde se usa la app; para mover o recuperar los datos se debe descargar un respaldo JSON.
