// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export async function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id }
    const rows = await query('SELECT id, usuario FROM usuarios WHERE id = ?', [decoded.id]);
    if (!rows.length) return res.status(401).json({ error: 'No autorizado: usuario no existe' });

    req.user = rows[0]; // { id, usuario }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'No autorizado: token inválido o expirado' });
  }
}
