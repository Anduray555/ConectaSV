import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'

// Regression: every dashboard route must render without backend records.
const server = await createServer({ server: { middlewareMode: true, hmr: false } })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const routes = [
    '/dashboard/explorar', '/dashboard/mensajes', '/dashboard/documentos', '/dashboard/perfil',
    '/empresa/dashboard', '/empresa/ofertas', '/empresa/candidatos',
    '/empresa/documentos', '/empresa/mensajes', '/empresa/perfil',
  ]
  for (const route of routes) {
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: [route] }, React.createElement(App)))
    assert.ok(html.includes('class="dashboard'), `${route}: dashboard missing`)
    assert.doesNotMatch(html, /Banco Agrícola|Andrea Martínez|2024|Datos de ejemplo|Tutor de ejemplo/)
    assert.doesNotMatch(html, /NaN|undefined/)
    if (route.endsWith('/documentos')) {
      for (const title of ['Carta de solicitud', 'Perfil del proyecto', 'Plan de trabajo']) assert.ok(html.includes(title), `${route}: missing ${title}`)
      assert.doesNotMatch(html, /Expediente completo|>Disponible</)
    }
    if (route === '/empresa/dashboard') assert.equal((html.match(/<strong>—<\/strong>/g) ?? []).length, 4)
    console.log(`OK ${route}`)
  }
  // Regression: a pending/partial backend response must not crash the profile.
  const { default: PerfilEmpresa, FormularioPerfilEmpresa } = await server.ssrLoadModule('/src/pages/empresa/PerfilEmpresa.jsx')
  for (const context of [null, {}, { empresa: null, resumen: null }, { empresa: { sectores: null }, resumen: {} }]) {
    const html = renderToStaticMarkup(React.createElement(MemoryRouter, null,
      React.createElement(Routes, null,
        React.createElement(Route, { element: React.createElement(Outlet, { context }) },
          React.createElement(Route, { index: true, element: React.createElement(PerfilEmpresa) })),
      ),
    ))
    assert.ok(html.includes('Perfil sin cargar'))
    assert.ok(html.includes('Sin sectores registrados.'))
  }
  for (const empresa of [null, {}, { nombre: null, sectores: null, acerca: null }]) {
    const html = renderToStaticMarkup(React.createElement(FormularioPerfilEmpresa, { empresa, onCancelar() {} }))
    assert.ok(html.includes('Editar perfil de empresa'))
    assert.doesNotMatch(html, /undefined|NaN/)
  }
  console.log('OK perfil y formulario con datos nulos o parciales')
} finally {
  await server.close()
}
