import { query, pool } from '../db.js';

async function attachCategorias(idLibro, categorias = []) {
  await pool.execute('DELETE FROM libros_categorias WHERE id_libro = ?', [idLibro]);
  if (Array.isArray(categorias) && categorias.length) {
    const values = categorias.map((idCat) => [idLibro, idCat]);
    await pool.execute(
      `INSERT INTO libros_categorias (id_libro, id_categoria) VALUES ${values.map(() => '(?, ?)').join(',')}`,
      values.flat()
    );
  }
}

function normalizeLibro(body = {}) {
  return {
    titulo: String(body.titulo || '').trim(),
    autor: body.autor ? String(body.autor).trim() : null,
    anio_publicacion: body.anio_publicacion || null,
    categorias: Array.isArray(body.categorias) ? body.categorias : []
  };
}

export async function listarLibros(_req, res) {
  const rows = await query(`
    SELECT l.id, l.titulo, l.autor, l.anio_publicacion,
           IFNULL(GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', '), '') AS categorias
    FROM libros l
    LEFT JOIN libros_categorias lc ON lc.id_libro = l.id
    LEFT JOIN categorias c ON c.id = lc.id_categoria
    GROUP BY l.id
    ORDER BY l.id DESC
  `);
  res.json(rows);
}

export async function obtenerLibro(req, res) {
  const { id } = req.params;
  const rows = await query(
    `SELECT l.id, l.titulo, l.autor, l.anio_publicacion,
            IFNULL(GROUP_CONCAT(c.nombre ORDER BY c.nombre SEPARATOR ', '), '') AS categorias
     FROM libros l
     LEFT JOIN libros_categorias lc ON lc.id_libro = l.id
     LEFT JOIN categorias c ON c.id = lc.id_categoria
     WHERE l.id = ?
     GROUP BY l.id`,
    [id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json(rows[0]);
}

export async function crearLibro(req, res) {
  const { titulo, autor, anio_publicacion, categorias } = normalizeLibro(req.body);
  if (!titulo) return res.status(400).json({ error: 'titulo es requerido' });

  const [result] = await pool.execute(
    'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
    [titulo, autor, anio_publicacion]
  );
  const idLibro = result.insertId;

  await attachCategorias(idLibro, categorias);

  res.status(201).json({ id: idLibro, titulo, autor, anio_publicacion, categorias });
}

export async function actualizarLibro(req, res) {
  const { id } = req.params;
  const { titulo, autor, anio_publicacion, categorias } = normalizeLibro(req.body);

  const existe = await query('SELECT id FROM libros WHERE id = ?', [id]);
  if (!existe.length) return res.status(404).json({ error: 'Libro no encontrado' });

  const sets = [];
  const params = [];
  if (titulo) { sets.push('titulo = ?'); params.push(titulo); }
  if (autor !== null) { sets.push('autor = ?'); params.push(autor); }
  if (anio_publicacion !== null) { sets.push('anio_publicacion = ?'); params.push(anio_publicacion); }

  if (sets.length) {
    params.push(id);
    await pool.execute(`UPDATE libros SET ${sets.join(', ')} WHERE id = ?`, params);
  }

  if (Array.isArray(req.body?.categorias)) {
    await attachCategorias(id, categorias);
  }

  return obtenerLibro(req, res);
}

export async function eliminarLibro(req, res) {
  const { id } = req.params;
  await pool.execute('DELETE FROM libros_categorias WHERE id_libro = ?', [id]);
  const [result] = await pool.execute('DELETE FROM libros WHERE id = ?', [id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Libro no encontrado' });
  res.json({ ok: true });
}

export async function listarCategorias(_req, res) {
  const rows = await query('SELECT id, nombre, descripcion FROM categorias ORDER BY nombre ASC');
  res.json(rows);
}

export async function crearCategoria(req, res) {
  const { nombre, descripcion } = req.body || {};
  if (!nombre) return res.status(400).json({ error: 'nombre es requerido' });

  const existe = await query('SELECT id FROM categorias WHERE nombre = ?', [nombre]);
  if (existe.length) return res.status(409).json({ error: 'la categoría ya existe' });

  const [ins] = await pool.execute(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion || null]
  );

  res.status(201).json({ id: ins.insertId, nombre, descripcion: descripcion || null });
}
