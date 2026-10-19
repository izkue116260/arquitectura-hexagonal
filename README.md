# Arquitectura hexagonal, paso a paso

Web pública para explicar arquitectura hexagonal con un único caso de uso (transferir dinero entre cuentas) que evoluciona de código acoplado a hexagonal. Ejemplos en TypeScript y React (hexagonal en el frontend: React como adaptador de entrada).

## Desarrollo

```bash
npm install
npm run dev
npm run build
```

## Estructura

- `src/pages/` — secciones (MDX) y portada
- `src/components/` — islas interactivas en React
- `src/layouts/` — layout base

## Hoja de ruta

1. [x] El problema + diagrama clicable
2. [ ] Puertos y adaptadores
3. [ ] Regla de dependencia
4. [ ] Testing con fakes
5. [ ] Slider antes/después y playground de adaptadores
6. [ ] Cuándo NO usarla y errores típicos
