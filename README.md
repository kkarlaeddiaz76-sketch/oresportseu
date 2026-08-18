# KitCraft Pro

Crea una plataforma web completa de comercio electrónico y personalización de ropa deportiva personalizada para la marca "ore.sports.eu / KitCraft". La web debe ser ultra moderna, rápida, completamente responsiva y ajustada rigurosamente a las siguientes especificaciones técnicas y funcionales:

==================================================

1. GUÍA DE ESTILOS Y PALETA DE COLORES (ESTRICTO)

==================================================

Toda la interfaz gráfica, componentes, botones, bordes, fondos y estados hover DEBEN utilizar ÚNICAMENTE la siguiente paleta de colores de 3 tonos:

- Negro Principal: RGB(0, 0, 0) / #000000 (Fondos oscuros, textos primarios)

- Blanco Puro: RGB(255, 255, 255) / #FFFFFF (Contraste, textos sobre fondo oscuro, tarjetas)

- Rojo Deportivo: RGB(255, 0, 0) / #FF0000 (Acentos, botones primarios, resaltados de selección y badges)

*(Prohibido usar verdes neón, azules u otros colores fuera de esta paleta estricta de 3 colores)*.

==================================================

2. NAVEGACIÓN Y CABECERA (NAVBAR)

==================================================

- Logo de la marca a la izquierda.

- Enlaces de navegación rápida: Inicio, Diseñador, Catálogo, Trabajos Realizados, Contacto.

- Junto al botón "Contacto", incluye un botón destacado de **"Guía de Tallas"** con un icono de cinta métrica.

- Botón Flotante de WhatsApp: Fijo en la esquina inferior derecha en toda la navegación para contacto directo.

==================================================

3. HERO SECTION (SECCIÓN PRINCIPAL)

==================================================

- Mantén las imágenes de fondo deportivas existentes para el Hero y de fondo por deporte.

- Badge de Confianza: Cerca del titular principal, incluye un distintivo que diga: *"⭐ +500 Equipos vestidos en España y Europa"*.

- Botón de Llamado a la Acción (CTA) directo hacia el Diseñador Interactivo.

==================================================

4. DISEÑADOR INTERACTIVO (SIMULADOR 2D/3D)

==================================================

Crea un configurador visual dinámico e interactivo con las siguientes capacidades:

A. Selección de Deporte y Siluetas Específicas:

  - Deportes disponibles: Fútbol, Baloncesto, Béisbol, Softball y Kickingball.

  - Al cambiar de deporte, ajusta la silueta base de la prenda (ej. Baloncesto sin mangas, Béisbol con botones, etc.).

B. Conmutador Vista Frontal / Trasera (Front & Back View):

  - Añade un control/botón flotante para alternar entre la vista "Frente" (Front) y "Espalda" (Back) de la camisa en tiempo real.

C. Lógica de Cortes de Camisas y Botones (Béisbol, Softball y Kickingball):

  - Opciones de Corte:

    1. Cuello Redondo o Cuello en V

    2. Camisa de 2 Botones: LOS BOTONES SE DEBEN MOSTRAR ÚNICAMENTE PEGADOS AL CUELLO / PECHO SUPERIOR. No debe aparecer la línea/costura vertical blanca continua por todo el centro de la camisa.

    3. Camisa de 6 Botones (Full Button): Muestra la abotonadura completa a lo largo de toda la parte frontal central con sus respectivos botones.

D. Personalización de Textos y Logotipo:

  - **Vista Frontal:**

    - Campo para ingresar el "Nombre del Equipo", el cual se renderiza centrado en el pecho de la franela.

    - Botón de "Subir Logo del Equipo" (fichero imagen PNG/JPG): Al cargar la imagen, esta debe previsualizarse aplicada automáticamente en las mangas de la camisa.

  - **Vista Trasera:**

    - Campo "Nombre del Jugador": Se renderiza en la parte superior de la espalda (curvado o recto).

    - Campo "Número": Se renderiza con tipografía deportiva grande en el centro de la espalda.

E. Selección de Telas:

  Permite al usuario elegir entre dos tipos de tela con tooltip informativo:

  1. **Tela Estándar:** Tejido microperforado transpirable de 170g.

  2. **Tela Premium:** Tejido liso de alta resistencia de 280g.

==================================================

5. MODAL DE GUÍA DE TALLAS

==================================================

Al hacer clic en el botón "Guía de Tallas" del Navbar, abre una ventana emergente flotante (Modal) con 3 pestañas limpias:

Pestaña 1: HOMBRE (Caballeros)

| TALLA | S | M | L | XL | 2XL | 3XL | 4XL |

|---|---|---|---|---|---|---|---|

| ALTO (cm) | 90 | 90 | 90 | 90 | 90 | 90 | 90 |

| ANCHO (cm) | 50 | 52 | 56 | 62 | 67 | 72 | 77 |

Pestaña 2: DAMAS

| TALLA | S | M | L | XL | 2XL | 3XL | 4XL |

|---|---|---|---|---|---|---|---|

| ALTO (cm) | 81 | 81 | 83 | 83 | 86 | 88 | 88 |

| ANCHO (cm) | 48 | 51 | 53 | 56 | 62 | 67 | 72 |

Pestaña 3: NIÑOS

| TALLA | 4 | 8 | 12 | 14 | 16 |

|---|---|---|---|---|---|

| ALTO (cm) | 57 | 62 | 68 | 69 | 71 |

| ANCHO (cm) | 34 | 38 | 42 | 44 | 46 |

Nota al pie del modal: *"La medida de Alto se toma desde el hombro hasta el borde inferior. El Ancho se mide de axila a axila."*

==================================================

6. SECCIÓN DE ROSTER Y PEDIDO GRUPAL

==================================================

- Tabla dinámica para agregar lista de jugadores (Nombre, Número y Talla).

- Campo de "Carga Rápida / Pegar Lista": Permite al usuario pegar texto como `10 - Pérez - L` para autocompletar la tabla de jugadores.

- Desplegable de tallas agrupado: Niños (4 al 16) y Adultos (S al 4XL).

- Cuadro de Resumen de Pedido con el distintivo: *"🚚 Envío gratis a toda España a partir de 10 uniformes"*.

==================================================

7. GALERÍA DE TRABAJOS REALIZADOS Y ACCESORIOS

==================================================

- Mantén las imágenes reales de uniformes confeccionados (Angeles, Monforte, Venemálaga, Giants).

- Efecto Lightbox / Modal: Al hacer clic en cualquier imagen, se amplía a pantalla completa.

- Overlay al pasar el cursor (Hover) con el botón: *"Quiero un diseño similar"*, que redirige a WhatsApp prellenando la consulta sobre ese modelo.

- Sección de Gorras Personalizadas con fotografías en alta definición de gorras con bordado 3D sobre fondo industrial/texturizado.

la primera foto es el logo:
la segundda imagen es la que vas a poner en el fondo del hero:
de la imagen 3 hasta la 6son las que vas a usar en la parte de diseños ya creados:
la imagen 7,8 ,9,10 son las que vas a usar en el apartado de deportes dependiendo de cada imagen futbol,basket,beisbol y kickingball

quiero una pagina profesinal

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://oresportseu.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/047e7366-7361-407f-944a-1339b05cbb87).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
