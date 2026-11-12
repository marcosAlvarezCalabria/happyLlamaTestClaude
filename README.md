# Happy Llama · Tarjeta de recuerdo (SPEC-HL-004)

Web estática de una sola página con dos modos, decididos por la URL:

- **Creador** (`/` sin parámetros, en español): la dueña escribe el mensaje, elige llama y fondo, y copia el enlace que se graba en el colgante NFC.
- **Visor** (`/?id=…&t=…`, en inglés): lo que ve quien recibe la llama. Mensaje personal + llama que reacciona al tocarla y se puede vestir.

Sin servidor, sin base de datos, sin analítica. El mensaje viaja en el enlace y el disfraz se guarda en el `localStorage` del móvil de quien la recibe, por tarjeta.

## Uso

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
```

## Desplegar en Netlify

`npm run build` y arrastra la carpeta `dist/` a [Netlify Drop](https://app.netlify.com/drop). No hay SSR ni funciones.

## Formato del enlace

```
https://sitio.netlify.app/?id=a7x9k&t=Pepito%20estuvo%20en%20Galway&f=Con%20cari%C3%B1o&b=0&l=1
```

| Parámetro | Qué es |
|---|---|
| `id` | Id corto aleatorio. Separa el disfraz guardado de cada tarjeta. |
| `t` | Mensaje. |
| `f` | "De parte de" (opcional). |
| `b` | Índice de la escena en `SCENES`. |
| `l` | Índice de la llama en `LLAMAS`. |

## Cambiar llamas, escenas y accesorios

Todo el catálogo está en [`src/lib/config.ts`](src/lib/config.ts) y los archivos en `public/assets/`.

- **Cambiar una imagen por otra**: suelta el archivo con el mismo nombre en `public/assets/llama/`, `scenes/` o `accessories/`. No hay que tocar código.
- **Añadir una escena o una llama**: suelta el archivo y añade una línea **al final** de `SCENES` / `LLAMAS`. No reordenes ni borres entradas: el índice está grabado en los colgantes ya vendidos.
- **Llama nueva**: PNG/WebP con fondo transparente. En `LLAMAS` indica `crop` (`[0, 0, ancho, alto]` si la imagen ya viene recortada) y los tres puntos de anclaje en píxeles de la imagen: `head` (coronilla y ancho de cabeza), `eyes` (punto medio y distancia entre ojos) y `neck` (centro y ancho del cuello). Los accesorios se colocan solos a partir de ahí.
- **Accesorio nuevo**: un SVG (o PNG transparente) en `public/assets/accessories/` y una línea en `ACCESSORIES` con su categoría (`slot`), proporción y punto de anclaje. Solo puede haber uno puesto por categoría.

Si falta la foto de la llama se muestra una llamita SVG de reserva; si falta la escena, un color plano.

## Hook del héroe

`window.onHeroTap()` dispara la reacción de la llama (saltito + destellos). La lógica está en [`src/lib/hero.ts`](src/lib/hero.ts).

## Pendiente antes de producción

- Confirmar con la dueña el catálogo real de accesorios (los actuales son ilustraciones de ejemplo).
- Confirmar los derechos de uso de las fotos de las escenas.
