-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS biblioteca_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE biblioteca_db;

-- ==========================
-- Tabla de usuarios (login)
-- ==========================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  usuario VARCHAR(50) NOT NULL UNIQUE,
  clave VARCHAR(255) NOT NULL,     -- aquí guardaremos hash bcrypt, no la clave plana
  token VARCHAR(255) DEFAULT NULL, -- opcional: puedes almacenar último JWT emitido
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- Tabla de libros
-- ==========================
CREATE TABLE IF NOT EXISTS libros (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  autor VARCHAR(150),
  anio_publicacion YEAR,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- Tabla de categorías
-- ==========================
CREATE TABLE IF NOT EXISTS categorias (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

-- =========================================
-- Relación muchos a muchos libros-categorias
-- =========================================
CREATE TABLE IF NOT EXISTS libros_categorias (
  id_libro INT UNSIGNED NOT NULL,
  id_categoria INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_libro, id_categoria),
  CONSTRAINT fk_libro FOREIGN KEY (id_libro) REFERENCES libros(id) ON DELETE CASCADE,
  CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE
);


-- =========================================
-- Ejemplos
-- =========================================

-- Categorías
INSERT INTO categorias (nombre, descripcion)
VALUES 
  ('Ciencia Ficción', 'Libros de ciencia ficción'),
  ('Historia', 'Libros históricos'),
  ('Programación', 'Libros de desarrollo de software');

-- Libros
INSERT INTO libros (titulo, autor, anio_publicacion)
VALUES 
  ('Dune', 'Frank Herbert', 1965),
  ('Sapiens', 'Yuval Noah Harari', 2011),
  ('Clean Code', 'Robert C. Martin', 2008);

-- Asociaciones libro-categoría
INSERT INTO libros_categorias (id_libro, id_categoria) VALUES (1, 1); -- Dune → Ciencia Ficción
INSERT INTO libros_categorias (id_libro, id_categoria) VALUES (2, 2); -- Sapiens → Historia
INSERT INTO libros_categorias (id_libro, id_categoria) VALUES (3, 3); -- Clean Code → Programación