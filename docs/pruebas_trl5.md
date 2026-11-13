# Matriz de Pruebas Funcionales — Validación TRL 5 (EcoRed Bogotá)

| ID Prueba | Historia Jira | Módulo Evaluado | Caso de Prueba Ejecutado | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | ECO-1 | Registro de usuarios | Crear cuenta nueva con correo único y rol asignado. | Contraseña cifrada con `bcrypt` y registro guardado en tabla `usuarios`. | Aprobado |
| **CP-02** | ECO-2 | Inicio de sesión | Ingresar con credenciales válidas y generar sesión. | Validación exitosa, entrega de token JWT y acceso según rol. | Aprobado |
| **CP-03** | ECO-3 / ECO-4 | Registro y clasificación | Registrar residuo indicando categoría (`Plástico`, `Papel`, `Vidrio`, `Metal`) y cantidad `> 0`. | Persistencia en tabla `residuos` asociada al usuario y punto de acopio. | Aprobado |
| **CP-04** | ECO-5 | Geolocalización | Consultar puntos de recolección en mapa interactivo de Bogotá. | Renderizado de marcadores en Chapinero, Fontibón y Engativá desde MySQL. | Aprobado |
| **CP-05** | ECO-6 | Gestión de usuarios | Consultar listado de usuarios y actualizar rol desde perfil Administrador. | Actualización inmediata en tabla `usuarios` vía `PUT /api/usuarios/:id/rol`. | Aprobado |
| **CP-06** | ECO-7 | Estadísticas | Visualizar indicadores totales, diarios y porcentajes por material en Dashboard. | Cálculo dinámico en tiempo real basado en los registros reales de MySQL. | Aprobado |
