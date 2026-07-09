# 📋 FASE 8: Pruebas y Documentación

## 🎯 Contexto para la IA
Este documento contiene las instrucciones para implementar la **Fase 8** del proyecto Vexum MX.

### ⚠️ REGLAS CRÍTICAS - LEER PRIMERO
1. **LEER OBLIGATORIAMENTE** el archivo `AIContext.md` en la raíz del proyecto antes de comenzar cualquier trabajo.
2. Seguir **ESTRICTAMENTE** todas las reglas, convenciones y patrones establecidos en `AIContext.md`.
3. Mantener consistencia con el código existente en el proyecto.
4. Usar el stack tecnológico definido en `AIContext.md`.
5. **REQUISITO:** Todas las fases anteriores (1-7) deben estar completas o casi completas.

---

## 📌 OBJETIVO DE ESTA FASE
Asegurar la calidad del sistema implementado mediante:
- Tests unitarios de componentes críticos
- Tests de integración de flujos completos
- Tests E2E del proceso de venta
- Documentación completa para usuarios y desarrolladores
- Optimización de performance
- Plan de despliegue y rollback

---

## ❓ PREGUNTAS OBLIGATORIAS ANTES DE COMENZAR
**LA IA DEBE HACER ESTAS PREGUNTAS Y ESPERAR RESPUESTA ANTES DE ESCRIBIR CÓDIGO:**

1. ¿Qué framework de testing se usa en el proyecto? (Jest, Vitest, Mocha, Cypress, Playwright)
2. ¿Ya existen tests configurados? ¿Cuál es la cobertura actual?
3. ¿Hay un servidor de testing o ambiente separado para pruebas?
4. ¿Existe documentación técnica previa que deba actualizarse?
5. ¿Se usa alguna herramienta de documentación? (Storybook, Docusaurus, GitBook)
6. ¿Hay CI/CD configurado? (GitHub Actions, GitLab CI, Jenkins)
7. ¿Qué métricas de calidad se requieren? (cobertura mínima, linting, etc.)
8. ¿Existen datos de prueba seedeados para testing?
9. ¿Se requiere testing en navegadores específicos?
10. ¿Hay impresora térmica disponible para pruebas reales de tickets?
11. ¿Existe un escáner de códigos de barras físico para pruebas?
12. ¿Se necesita documentación en video o solo escrita?
13. ¿Hay plantilla establecida para manuales de usuario?
14. ¿El proyecto tiene requisitos de accesibilidad verificables? (WCAG)
15. ¿Existen scripts de benchmark/performance ya configurados?
16. ¿Se requiere testing de carga/stress para el backend?
17. ¿Hay herramientas de monitoreo de performance? (Lighthouse, WebPageTest)
18. ¿Existe checklist de deployment previo?

---

## 📁 ÁREAS DE TESTING

### 8.1 Tests Unitarios (Backend)

#### Servicios a testear:
```javascript
// 1. Servicio de Ventas
describe('VentasService', () => {
  describe('crearVenta', () => {
    it('debe crear una venta con items válidos', async () => {...});
    it('debe fallar si no hay stock suficiente', async () => {...});
    it('debe generar folio consecutivo único', async () => {...});
    it('debe ser transaccional (rollback si falla)', async () => {...});
  });
  
  describe('registrarPago', () => {
    it('debe registrar pago parcial correctamente', async () => {...});
    it('debe completar venta cuando suma = total', async () => {...});
    it('debe rechazar pago mayor al saldo pendiente', async () => {...});
    it('debe manejar pagos mixtos (múltiples métodos)', async () => {...});
  });
});

// 2. Servicio de Cajas
describe('CajasService', () => {
  describe('abrirCaja', () => {
    it('debe abrir caja con saldo inicial', async () => {...});
    it('debe fallar si caja ya está abierta', async () => {...});
  });
  
  describe('cerrarCaja', () => {
    it('debe cerrar caja con saldo final', async () => {...});
    it('debe fallar si hay turnos abiertos', async () => {...});
  });
});

// 3. Servicio de Cortes
describe('CortesCajaService', () => {
  describe('generarCorte', () => {
    it('debe calcular totales por método de pago', async () => {...});
    it('debe incluir solo ventas del rango de fechas', async () => {...});
    it('debe generar número consecutivo de corte', async () => {...});
  });
  
  describe('reabrirCorte', () => {
    it('debe validar contraseña de superior', async () => {...});
    it('debe cambiar estado a reabierto', async () => {...});
    it('debe registrar auditoría del cambio', async () => {...});
  });
});

// 4. Servicio de Scanner/Códigos
describe('ProductosService', () => {
  describe('buscarPorCodigoBarras', () => {
    it('debe encontrar producto por código exacto', async () => {...});
    it('debe retornar null si no existe', async () => {...});
    it('debe manejar códigos con/sin checksum', async () => {...});
  });
});
```

**Cobertura mínima requerida:**
```
- Services: 80% mínimo
- Controllers: 70% mínimo
- Utils/Helpers: 90% mínimo
- Models: Validaciones críticas 100%
```

---

### 8.2 Tests de Integración (API)

#### Endpoints a testear:
```javascript
// 1. Flujo completo de venta
describe('POST /api/ventas', () => {
  it('debe crear venta completa con múltiples items', async () => {
    const response = await request(app)
      .post('/api/ventas')
      .send({
        caja_id: uuid,
        turno_id: uuid,
        items: [
          { producto_id: uuid1, cantidad: 2, precio: 100 },
          { producto_id: uuid2, cantidad: 1, precio: 50 }
        ]
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('folio');
    expect(response.body.items).toHaveLength(2);
  });
  
  it('debe fallar con 400 si producto no existe', async () => {...});
  it('debe fallar con 400 si stock insuficiente', async () => {...});
  it('debe descontar inventario después de crear', async () => {...});
});

// 2. Flujo de pagos mixtos
describe('POST /api/ventas/:id/pagos', () => {
  it('debe aceptar múltiples pagos parciales', async () => {...});
  it('debe completar venta cuando suma = total', async () => {...});
  it('debe retornar saldo pendiente después de cada pago', async () => {...});
});

// 3. Cajas y turnos
describe('POST /api/cajas/:id/abrir', () => {
  it('debe abrir caja y registrar saldo inicial', async () => {...});
  it('debe fallar si usuario no tiene permisos', async () => {...});
});

// 4. Cortes de caja
describe('POST /api/cortes-caja', () => {
  it('debe generar corte con totales calculados', async () => {...});
  it('debe incluir solo ventas del periodo', async () => {...});
});

// 5. Dashboard
describe('GET /api/dashboard/resumen', () => {
  it('debe retornar métricas correctas para turno actual', async () => {...});
  it('debe filtrar por caja si se proporciona', async () => {...});
  it('debe manejar rangos de fechas personalizados', async () => {...});
});
```

---

### 8.3 Tests E2E (Frontend)

#### Flujos críticos a testear:
```javascript
// Usando Cypress, Playwright o similar

describe('Flujo Completo de Venta', () => {
  beforeEach(() => {
    cy.login('cajero', 'password123');
    cy.abrirCaja(1000); // Saldo inicial
    cy.iniciarTurno();
  });
  
  it('debe completar venta con escáner y pago mixto', () => {
    // Escanear productos
    cy.escanearProducto('750123456789'); // Coca Cola
    cy.escanearProducto('750987654321'); // Papas
    
    // Verificar carrito
    cy.get('[data-testid="carrito-items"]').should('have.length', 2);
    cy.get('[data-testid="total"]').should('contain', '$63.00');
    
    // Ir a cobrar
    cy.get('[data-testid="btn-cobrar"]').click();
    
    // Pago mixto
    cy.registrarPago('efectivo', 30);
    cy.registrarPago('tarjeta', 33);
    
    // Completar
    cy.get('[data-testid="btn-completar"]').click();
    
    // Verificar éxito
    cy.get('[data-testid="venta-exitosa"]').should('be.visible');
    cy.get('[data-testid="folio"]').should('exist');
    
    // Ver ticket
    cy.get('[data-testid="btn-ver-ticket"]').click();
    cy.get('[data-testid="ticket-modal"]').should('be.visible');
  });
  
  it('debe mostrar consulta rápida de precio con tecla modificadora', () => {
    cy.mantenerTeclaPresionada('Shift');
    cy.escanearProducto('750123456789');
    
    cy.get('[data-testid="modal-consulta"]')
      .should('be.visible')
      .and('contain', 'Coca Cola')
      .and('contain', '$18.00');
  });
});

describe('Gestión de Caja y Turnos', () => {
  it('debe permitir abrir caja, turno, hacer ventas y cerrar', () => {
    cy.abrirCaja(1000);
    cy.iniciarTurno();
    
    // Hacer 3 ventas
    cy.crearVentaDePrueba();
    cy.crearVentaDePrueba();
    cy.crearVentaDePrueba();
    
    cy.cerrarTurno();
    cy.verResumenTurno().should('contain', '3 transacciones');
    
    cy.cerrarCaja(4500); // Saldo final esperado
    cy.verificarCuadre();
  });
  
  it('debe requerir autorización para reaperturas', () => {
    cy.generarCorte();
    cy.intentareAbrirCorte();
    
    cy.modalAutorizacion()
      .should('be.visible');
    
    cy.ingresarPasswordSuperior('wrong');
    cy.get('[data-testid="error-auth"]').should('be.visible');
    
    cy.ingresarPasswordSuperior('correct123');
    cy.get('[data-testid="corte-reabierto"]').should('be.visible');
  });
});

describe('Impresión de Tickets', () => {
  it('debe generar ticket con todos los datos correctos', () => {
    cy.completarVenta();
    cy.verTicket();
    
    cy.get('[data-testid="ticket"]')
      .should('contain', 'VEXUM MX')
      .and('contain', 'RFC:')
      .and('contain', 'Folio:')
      .and('contain', 'Fecha:')
      .and('contain', 'TOTAL:')
      .and('contain', 'Gracias por su compra');
  });
  
  it('debe permitir imprimir ticket desde historial', () => {
    cy.navegarA('historial-ventas');
    cy.filtrarPorFolio('A00123');
    cy.clickAccion('reimprimir');
    
    cy.window().its('print').should('exist');
  });
});
```

---

### 8.4 Pruebas Manuales (Checklist)

#### Testing con hardware real:
```
[ ] Probar escáner de códigos de barras físico
    - Escaneo rápido continuo
    - Escaneo con producto en carrito
    - Escaneo de producto sin stock
    - Escaneo de producto inexistente
    
[ ] Probar impresión de tickets
    - Impresora térmica 58mm
    - Impresora térmica 80mm
    - Impresión desde Chrome
    - Impresión desde Firefox
    - Descarga de PDF
    
[ ] Probar en diferentes dispositivos
    - Desktop Chrome
    - Desktop Firefox
    - Desktop Edge
    - Tablet (si aplica)
    - Móvil (si aplica)
    
[ ] Pruebas de stress
    - 100 ventas consecutivas
    - Múltiples cajas simultáneas
    - Base de datos grande (10,000+ productos)
    
[ ] Pruebas de concurrencia
    - Dos cajeros vendiendo mismo producto
    - Corte de caja mientras se hace venta
    - Mismo usuario en dos sesiones
```

---

## 📁 DOCUMENTACIÓN

### 8.5 Manual de Usuario

#### Estructura sugerida:
```markdown
# Manual de Usuario - Vexum MX POS

## 1. Introducción
   - ¿Qué es Vexum MX?
   - Requisitos del sistema
   - Acceso al sistema

## 2. Primeros Pasos
   - Inicio de sesión
   - Configuración inicial
   - Datos del negocio

## 3. Operación Diaria
   ### 3.1 Apertura de Caja
   - Cómo abrir caja
   - Saldo inicial
   - Verificación

   ### 3.2 Inicio de Turno
   - Asignación de turnos
   - Cambio de cajero

   ### 3.3 Realizar Ventas
   - Agregar productos manualmente
   - Usar escáner de códigos de barras
   - Consulta rápida de precios
   - Editar carrito
   - Cobrar con pagos mixtos
   - Imprimir tickets

   ### 3.4 Cierre de Turno
   - Generar resumen
   - Observaciones
   - Cambio de turno

   ### 3.5 Corte de Caja
   - Cuándo hacer corte
   - Cómo generar corte
   - Interpretar reporte
   - Reapertura (con autorización)

   ### 3.6 Cierre de Caja
   - Arqueo de caja
   - Diferencias
   - Reporte final

## 4. Dashboard y Reportes
   - Interpretar métricas
   - Filtros disponibles
   - Exportar datos

## 5. Configuración
   - Datos del negocio
   - Impuestos
   - Tickets
   - Seguridad
   - Preferencias

## 6. Solución de Problemas
   - Preguntas frecuentes
   - Errores comunes
   - Contactar soporte

## 7. Atajos de Teclado
   - Lista completa de atajos
   - Configuración personalizada
```

---

### 8.6 Documentación Técnica

#### Estructura sugerida:
```markdown
# Documentación Técnica - Vexum MX

## 1. Arquitectura
   - Diagrama de componentes
   - Stack tecnológico
   - Flujo de datos

## 2. Base de Datos
   - Diagrama ER
   - Diccionario de datos
   - Migraciones
   - Índices

## 3. API Reference
   - Endpoints documentados
   - Ejemplos de request/response
   - Códigos de error
   - Autenticación

## 4. Frontend
   - Estructura de carpetas
   - Componentes principales
   - Estado global
   - Estilos

## 5. Backend
   - Estructura del proyecto
   - Services
   - Controllers
   - Middleware

## 6. Testing
   - Cómo correr tests
   - Escribir nuevos tests
   - Coverage requirements

## 7. Deployment
   - Requisitos de servidor
   - Variables de entorno
   - Proceso de deploy
   - Rollback plan

## 8. Troubleshooting
   - Logs
   - Debugging
   - Performance tuning
```

---

### 8.7 README Actualizado

```markdown
# Vexum MX - Sistema POS

## Descripción
Sistema de punto de venta moderno con soporte para múltiples cajas, turnos, pagos mixtos y generación de tickets.

## Características Principales
- ✅ Escáner de códigos de barras
- ✅ Pagos mixtos (efectivo, tarjeta, transferencia)
- ✅ Gestión de turnos por empleado
- ✅ Cortes de caja con validación
- ✅ Tickets personalizables e imprimibles
- ✅ Dashboard en tiempo real
- ✅ Multi-caja
- ✅ Control de inventario

## Stack Tecnológico
- Frontend: [React/Vue/Angular - según AIContext.md]
- Backend: [Node.js/Express/NestJS - según AIContext.md]
- Base de Datos: [MySQL/PostgreSQL - según AIContext.md]
- ORM: [Sequelize/Prisma/TypeORM - según AIContext.md]

## Instalación
```bash
# Clonar repositorio
git clone ...

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migrate

# Seed inicial
npm run seed

# Iniciar desarrollo
npm run dev
```

## Tests
```bash
# Tests unitarios
npm run test:unit

# Tests de integración
npm run test:integration

# Tests E2E
npm run test:e2e

# Coverage
npm run test:coverage
```

## Deployment
Ver [GUÍA_DEPLOYMENT.md](./docs/GUÍA_DEPLOYMENT.md)

## Documentación Completa
- [Manual de Usuario](./docs/MANUAL_USUARIO.md)
- [Documentación Técnica](./docs/TECNICA.md)
- [API Reference](./docs/API.md)

## Licencia
[Tipo de licencia]
```

---

## ✅ ENTREGABLES ESPERADOS

1. **Tests**
   - Suite de tests unitarios (backend)
   - Tests de integración de APIs
   - Tests E2E de flujos críticos
   - Configuración de CI para tests automáticos

2. **Documentación**
   - Manual de usuario completo (PDF/Markdown)
   - Documentación técnica para desarrolladores
   - README actualizado
   - Guía de deployment
   - FAQ/Troubleshooting

3. **Optimizaciones**
   - Reporte de Lighthouse/WebPageTest
   - Optimización de queries lentas
   - Compresión de assets
   - Caché configurado

4. **Checklists**
   - Checklist de pre-deployment
   - Checklist de testing manual
   - Plan de rollback

---

## 🔍 CONSIDERACIONES TÉCNICAS

### Coverage mínimo recomendado:
```
- Backend: 80%
- Frontend components: 70%
- Critical paths: 95%
```

### Performance targets:
```
- Lighthouse Performance: >90
- First Contentful Paint: <1.5s
- Time to Interactive: <3.5s
- API Response Time (p95): <200ms
```

### Documentación:
```
- Todo endpoint debe tener ejemplo de uso
- Todo componente complejo debe tener comentarios
- Los flujos críticos deben tener diagramas
- Los errores comunes deben tener solución documentada
```

---

## 📝 NOTAS ADICIONALES

- Esta fase es crucial para la calidad a largo plazo
- No saltar tests aunque "todo funcione"
- La documentación es tan importante como el código
- Involucrar a usuarios reales en pruebas manuales
- Documentar decisiones técnicas importantes (ADRs)

---

## 🔄 CHECKLIST DE VERIFICACIÓN

- [ ] Leído AIContext.md completamente
- [ ] Respondidas todas las preguntas de clarificación
- [ ] Fases 1-7 completadas y verificadas
- [ ] Tests unitarios creados y aprobados
- [ ] Tests de integración creados y aprobados
- [ ] Tests E2E creados y aprobados
- [ ] Coverage mínimo alcanzado
- [ ] Manual de usuario completado
- [ ] Documentación técnica completada
- [ ] README actualizado
- [ ] Optimizaciones de performance aplicadas
- [ ] Checklist de deployment creado
- [ ] Plan de rollback documentado
- [ ] Commit final con mensaje descriptivo

---

**IMPORTANTE:** Esta fase cierra el ciclo de desarrollo principal. Asegurar que TODO esté documentado y testeado antes de considerar el proyecto completo.
