import db from "#db/client";

export async function createBiblioEntry({
  title,
  author,
  publicationYear,
  category,
  url
}) {
  const { rows: [entry] } = await db.query(
    `INSERT INTO biblio (title, author, publication_year, category, url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, author, publicationYear, category, url]
  );
  return entry;
};

export async function getBiblioEntries() { 
  const { rows } = await db.query(
    `SELECT * FROM biblio 
    ORDER BY publication_year DESC`
  );
  return rows;
};

export async function getBiblioEntryById(id) {
  const { rows: [entry] } = await db.query(
    `SELECT * FROM biblio 
    WHERE id = $1`,
    [id]
  );
  return entry;
};

export async function updateBiblioEntry(id, updates) {
  const { title, author, publicationYear, category, url } = updates;
  const { rows: [entry] } = await db.query(
    `UPDATE biblio
     SET title = COALESCE($1, title),
         author = COALESCE($2, author),
         publication_year = COALESCE($3, publicationYear),
         category = COALESCE($4, category),
         url = COALESCE($5, url)
     WHERE id = $6
     RETURNING *`,
    [title, author, publicationYear, category, url, id]
  );
  return entry;
};

export async function deleteBiblioEntry(id) {
  const { rows: [deleted] } = await db.query(
    `DELETE FROM biblio WHERE id = $1 RETURNING *`,
    [id]
  );
  return deleted;
}

export async function getBiblioEntriesByCategory(category) {
  const { rows } = await db.query(
    `SELECT * FROM biblio 
    WHERE category = $1 
    ORDER BY publication_year DESC`,
    [category]
  );
  return rows;
};
export async function getBiblioEntriesByAuthor(author) {
  const { rows } = await db.query(
    `SELECT * FROM biblio 
    WHERE author ILIKE $1 
    ORDER BY publication_year DESC`,
    [`%${author}%`]
  );
  return rows;
};