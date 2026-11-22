import assert from 'node:assert/strict'
import { createServer } from 'vite'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Routes, Route, Outlet } from 'react-router-dom'

// Regression: every dashboard route must render without backend records.
const server = await createServer({ server: { middlewareMode: true, hmr: false } })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const { AuthContext } = await server.ssrLoadModule('/src/context/AuthContext.js')

  // Las rutas están protegidas por rol: se simula una sesión ya iniciada con el rol de cada sección.
  const sesion = (role) => ({
    user: {
      id: 1, first_name: 'Prueba', first_surname: 'Render', email: 'prueba@test.sv', role,
      // Misma forma que UserResource (GET /api/auth/me)
      student_profile: role === 'student' ? {
        university: { id: 1, name: 'Universidad de Prueba', short_name: 'UP' },
        career: { id: 1, name: 'Ingeniería de Prueba' },
        interests: [{ id: 1, name: 'Interés de prueba' }],
      } : undefined,
      company_member: role === 'company' ? {
        phone: null, role: 'owner',
        company: { id: 1, name: 'Compañía Prueba', web_site: 'https://prueba.test', contact_number: '22223333', sector: 'Tecnología' },
      } : undefined,
    },
    loading: false,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
  })
  const rolDe = (route) => (route.startsWith('/empresa') ? 'company' : route.startsWith('/admin') ? 'admin' : 'student')
  const routes = [
    '/dashboard/explorar', '/dashboard/mensajes', '/dashboard/documentos', '/dashboard/perfil',
    '/empresa/dashboard', '/empresa/ofertas', '/empresa/candidatos',
    '/empresa/documentos', '/empresa/mensajes', '/empresa/perfil',
    '/admin/dashboard', '/admin/soporte', '/admin/usuarios', '/admin/perfil',
  ]
  for (const route of routes) {
    const html = renderToStaticMarkup(
      React.createElement(MemoryRouter, { initialEntries: [route] },
        React.createElement(AuthContext.Provider, { value: sesion(rolDe(route)) }, React.createElement(App))),
    )
    assert.ok(html.includes('class="dashboard'), `${route}: dashboard missing`)
    assert.doesNotMatch(html, /Banco Agrícola|Andrea Martínez|2024|Datos de ejemplo|Tutor de ejemplo/)
    assert.doesNotMatch(html, /NaN|undefined/)
    if (route.endsWith('/documentos')) {
      for (const title of ['Carta de solicitud', 'Perfil del proyecto', 'Plan de trabajo']) assert.ok(html.includes(title), `${route}: missing ${title}`)
      assert.doesNotMatch(html, /Expediente completo|>Disponible</)
    }
    // El perfil ya no está en la sidebar (se abre desde el menú de usuario), pero conserva su título.
    if (route === '/dashboard/perfil') assert.ok(html.includes('<h1>Mi Perfil</h1>'), `${route}: missing title`)
    if (route === '/admin/perfil') assert.ok(html.includes('<h1>Mi Perfil</h1>') && html.includes('prueba@test.sv'), `${route}: missing title or email`)
    if (route === '/empresa/perfil') assert.ok(html.includes('<h1>Perfil Empresa</h1>'), `${route}: missing title`)
    // El perfil se llena con los datos de la sesión.
    if (route === '/dashboard/perfil') for (const dato of ['Prueba Render', 'Ingeniería de Prueba · Universidad de Prueba', 'Interés de prueba']) assert.ok(html.includes(dato), `${route}: missing ${dato}`)
    if (route === '/empresa/perfil') for (const dato of ['Compañía Prueba', '>CP<', 'Tecnología', 'https://prueba.test', '22223333', 'prueba@test.sv']) assert.ok(html.includes(dato), `${route}: missing ${dato}`)
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
