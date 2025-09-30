// controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query, pool } from '../db.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '2h' });

export async function register(req, res) {
  try {
    const { nombre, usuario, clave } = req.body || {};
    if (!nombre || !usuario || !clave) {
      return res.status(400).json({ error: 'nombre, usuario y clave son requeridos' });
    }

    const exists = await query('SELECT id FROM usuarios WHERE usuario = ?', [usuario]);
    if (exists.length) return res.status(400).json({ error: 'El usuario ya existe' });

    const hashed = await bcrypt.hash(clave, 10);

    const ins = await pool.execute(
      'INSERT INTO usuarios (nombre, usuario, clave) VALUES (?, ?, ?)',
      [nombre, usuario, hashed]
    );
    const insertId = ins[0].insertId;

    res.status(201).json({
      id: insertId,
      nombre,
      usuario,
      token: signToken(insertId)
    });
  } catch (err) {
    if (err?.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    console.error('[register]', err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
}

export async function login(req, res) {
  try {
    const { usuario, clave } = req.body || {};
    if (!usuario || !clave) {
      return res.status(400).json({ error: 'usuario y clave son requeridos' });
    }

    const r = await query(
      'SELECT id, usuario, clave FROM usuarios WHERE usuario = ?',
      [usuario]
    );
    if (!r.length) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = r[0];
    const ok = await bcrypt.compare(clave, user.clave);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({
      id: user.id,
      usuario: user.usuario,
      token: signToken(user.id),
    });
  } catch (err) {
    console.error('[login]', err);
    res.status(500).json({ error: 'Error iniciando sesión' });
  }
}

export async function me(req, res) {
  res.json({ id: req.user.id, usuario: req.user.usuario });
}