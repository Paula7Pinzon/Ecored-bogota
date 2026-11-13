const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba de salud del servidor
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, mensaje: 'Servidor EcoRed y MySQL conectados correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// ECO-1: Registro de usuarios
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const [existe] = await pool.query('SELECT id_usuario FROM usuarios WHERE correo = ?', [correo]);
    if (existe.length > 0) {
      return res.status(400).json({ error: 'Este correo ya está registrado' });
    }

    const [roles] = await pool.query('SELECT id_rol FROM roles WHERE nombre_rol = ?', [rol || 'Ciudadano']);
    const id_rol = roles.length > 0 ? roles[0].id_rol : 2;

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO usuarios (nombre, correo, password, id_rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, hash, id_rol]
    );

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ECO-2: Inicio de sesión con JWT
app.post('/api/auth/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    const [rows] = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.correo, u.password, r.nombre_rol AS rol 
       FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol WHERE u.correo = ?`,
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = rows[0];
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ECO-5: Consultar puntos de recolección
app.get('/api/puntos', async (req, res) => {
  try {
    const [puntos] = await pool.query('SELECT id_punto AS id, nombre, direccion, latitud AS lat, longitud AS lng FROM puntos_recoleccion');
    res.json(puntos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ECO-3, ECO-4 y ECO-7: Consultar registros de residuos
app.get('/api/residuos', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.id_residuo AS id, c.nombre_categoria AS tipo, r.cantidad_kg AS cantidad, 
              r.descripcion, COALESCE(p.nombre, 'Sin punto') AS punto, 
              DATE_FORMAT(r.fecha_registro, '%Y-%m-%d') AS fecha
       FROM residuos r
       JOIN categorias c ON r.id_categoria = c.id_categoria
       LEFT JOIN puntos_recoleccion p ON r.id_punto = p.id_punto
       ORDER BY r.fecha_registro DESC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ECO-3 y ECO-4: Crear registro de residuo
app.post('/api/residuos', async (req, res) => {
  try {
    const { usuario_id, tipo, cantidad, descripcion, id_punto } = req.body;
    if (!cantidad || Number(cantidad) <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0' });
    }

    const [cats] = await pool.query('SELECT id_categoria FROM categorias WHERE nombre_categoria = ?', [tipo]);
    if (cats.length === 0) return res.status(400).json({ error: 'Categoría inválida' });

    await pool.query(
      'INSERT INTO residuos (cantidad_kg, descripcion, id_usuario, id_categoria, id_punto) VALUES (?, ?, ?, ?, ?)',
      [cantidad, descripcion || '', usuario_id || 1, cats[0].id_categoria, id_punto || 1]
    );

    res.status(201).json({ mensaje: 'Residuo registrado en MySQL correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ECO-6: Gestión de usuarios (Listar y cambiar rol)
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id_usuario AS id, u.nombre, u.correo, r.nombre_rol AS rol 
       FROM usuarios u JOIN roles r ON u.id_rol = r.id_rol`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/usuarios/:id/rol', async (req, res) => {
  try {
    const { rol } = req.body;
    const [roles] = await pool.query('SELECT id_rol FROM roles WHERE nombre_rol = ?', [rol]);
    if (roles.length === 0) return res.status(400).json({ error: 'Rol no válido' });

    await pool.query('UPDATE usuarios SET id_rol = ? WHERE id_usuario = ?', [roles[0].id_rol, req.params.id]);
    res.json({ mensaje: 'Rol actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend EcoRed Bogotá corriendo en http://localhost:${PORT}`);
});
