CREATE DATABASE IF NOT EXISTS ecored_db;
USE ecored_db;

CREATE TABLE roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(50) NOT NULL
);

CREATE TABLE puntos_recoleccion (
    id_punto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200) NOT NULL,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL
);

CREATE TABLE residuos (
    id_residuo INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_kg DECIMAL(10,2) NOT NULL,
    descripcion TEXT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_categoria INT NOT NULL,
    id_punto INT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_punto) REFERENCES puntos_recoleccion(id_punto)
);

-- Datos iniciales
INSERT INTO roles (nombre_rol) VALUES
('Administrador'),
('Ciudadano'),
('Reciclador');

INSERT INTO categorias (nombre_categoria) VALUES
('Plástico'),
('Papel'),
('Vidrio'),
('Metal');

INSERT INTO puntos_recoleccion (nombre, direccion, latitud, longitud) VALUES
('Punto Verde', 'Cra 7 #45-10, Chapinero', 4.63280000, -74.06540000),
('Estación de reciclaje', 'Av 68 #22-15, Fontibón', 4.64860000, -74.11120000),
('Centro de acopio', 'Cll 80 #100-20, Engativá', 4.71100000, -74.11350000);
