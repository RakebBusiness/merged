const pool = require('../config/database');

const coursModel = {
    async findAll() {
        const query = 'SELECT * FROM "COURS"';
        const result = await pool.query(query);
        return result.rows;
    },

    async findById(id, userId = null) {
        // ✅ CORRECTION : Ajout du JOIN pour récupérer les infos de l'enseignant
        const courseQuery = `
            SELECT 
                c.*,
                u."Nom" AS "nomEnseignant",
                u."Prenom" AS "prenomEnseignant",
                u."Email" AS "emailEnseignant"
            FROM "COURS" c
            LEFT JOIN "USER" u ON c."idEnseignant" = u."idUser"
            WHERE c."idCours" = $1
        `;
        const courseResult = await pool.query(courseQuery, [id]);

        if (courseResult.rows.length === 0) {
            return null;
        }

        const course = courseResult.rows[0];

        let isEnrolled = false;
        let enrollmentData = null;
        let isTeacher = false;

        if (userId) {
            isTeacher = course.idEnseignant === userId;

            const enrollmentQuery = `
                SELECT "enrolledAt", "finishedAt", "progress", "completed"
                FROM "ETUDIANT_COURS"
                WHERE "idUser" = $1 AND "idCours" = $2
            `;
            const enrollmentResult = await pool.query(enrollmentQuery, [userId, id]);
            isEnrolled = enrollmentResult.rows.length > 0;
            enrollmentData = enrollmentResult.rows[0] || null;
        }

        const sectionsQuery = `
            SELECT "idSection", "section", "theorie", "codeExample"
            FROM "COURS_SECTION"
            WHERE "idCours" = $1
            ORDER BY "idSection"
        `;
        const sectionsResult = await pool.query(sectionsQuery, [id]);

        const topicsQuery = `
            SELECT "idTopic", "nom"
            FROM "TOPIC"
            WHERE "idCours" = $1
            ORDER BY "idTopic"
        `;
        const topicsResult = await pool.query(topicsQuery, [id]);

        return {
            ...course,
            content: (isEnrolled || isTeacher) ? sectionsResult.rows : [],
            sections: sectionsResult.rows.map(s => ({ section: s.section })),
            topics: topicsResult.rows,
            isEnrolled,
            isTeacher,
            enrollmentData
        };
    },

    async findByTeacher(idEnseignant) {
        const query = 'SELECT * FROM "COURS" WHERE "idEnseignant" = $1';
        const result = await pool.query(query, [idEnseignant]);
        return result.rows;
    },

    async create(coursData) {
        const { titre, niveau, description, duree, idEnseignant, sections, topics } = coursData;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1️⃣ INSERT DU COURS (RIEN D'AUTRE)
            const insertCourseQuery = `
                INSERT INTO "COURS" ("titre", "niveau", "description", "duree", "idEnseignant")
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `;
            const courseResult = await client.query(insertCourseQuery, [
                titre,
                niveau,
                description,
                duree,
                idEnseignant
            ]);

            const course = courseResult.rows[0];

            // 2️⃣ INSERT DES SECTIONS
            if (sections && sections.length > 0) {
                for (const section of sections) {
                    await client.query(
                        `
                        INSERT INTO "COURS_SECTION"
                        ("section", "theorie", "codeExample", "idCours")
                        VALUES ($1, $2, $3, $4)
                        `,
                        [
                            section.section,
                            section.theorie,
                            section.codeExample || null,
                            course.idCours
                        ]
                    );
                }
            }

            // 3️⃣ INSERT DES TOPICS
            if (topics && topics.length > 0) {
                for (const topic of topics) {
                    await client.query(
                        `
                        INSERT INTO "TOPIC" ("nom", "idCours")
                        VALUES ($1, $2)
                        `,
                        [topic.nom, course.idCours]
                    );
                }
            }

            await client.query('COMMIT');
            return course;

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async update(id, coursData) {
        const { titre, niveau, description, duree, sections, topics } = coursData;

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateQuery = `
                UPDATE "COURS"
                SET "titre" = $1, "niveau" = $2, "description" = $3, "duree" = $4
                WHERE "idCours" = $5
                RETURNING *
            `;
            const result = await client.query(updateQuery, [titre, niveau, description, duree, id]);
            const course = result.rows[0];

            if (sections && sections.length > 0) {
                await client.query('DELETE FROM "COURS_SECTION" WHERE "idCours" = $1', [id]);

                for (const section of sections) {
                    const sectionQuery = `
                        INSERT INTO "COURS_SECTION" ("section", "theorie", "codeExample", "idCours")
                        VALUES ($1, $2, $3, $4)
                    `;
                    await client.query(sectionQuery, [
                        section.section,
                        section.theorie,
                        section.codeExample || null,
                        id
                    ]);
                }
            }

            if (topics && topics.length > 0) {
                await client.query('DELETE FROM "TOPIC" WHERE "idCours" = $1', [id]);

                for (const topic of topics) {
                    const topicQuery = `
                        INSERT INTO "TOPIC" ("nom", "idCours")
                        VALUES ($1, $2)
                    `;
                    await client.query(topicQuery, [
                        topic.nom,
                        id
                    ]);
                }
            }

            await client.query('COMMIT');
            return course;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    async delete(id) {
        const query = 'DELETE FROM "COURS" WHERE "idCours" = $1';
        await pool.query(query, [id]);
    },

    async enrollStudent(idUser, idCours) {
        const query = `
            INSERT INTO "ETUDIANT_COURS"
            ("idUser", "idCours", "tempsDebut", "tempsFin", "tempsConcentration", "enrolledAt", "progress", "completed")
            VALUES ($1, $2, 0, 0, 0, CURRENT_TIMESTAMP, 0, FALSE)
            ON CONFLICT ("idUser", "idCours") DO NOTHING
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, idCours]);
        return result.rows[0];
    },

    async finishCourse(idUser, idCours) {
        const query = `
            UPDATE "ETUDIANT_COURS"
            SET "completed" = TRUE, "finishedAt" = CURRENT_TIMESTAMP, "progress" = 100
            WHERE "idUser" = $1 AND "idCours" = $2
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, idCours]);
        return result.rows[0];
    },

    async updateProgress(idUser, idCours, progress) {
        const query = `
            UPDATE "ETUDIANT_COURS"
            SET "progress" = $3
            WHERE "idUser" = $1 AND "idCours" = $2
            RETURNING *
        `;
        const result = await pool.query(query, [idUser, idCours, progress]);
        return result.rows[0];
    },

    async isEnrolled(idUser, idCours) {
        const query = 'SELECT * FROM "ETUDIANT_COURS" WHERE "idUser" = $1 AND "idCours" = $2';
        const result = await pool.query(query, [idUser, idCours]);
        return result.rows.length > 0;
    },

    async getEnrolledCourses(idUser) {
        const query = `
            SELECT c.* FROM "COURS" c
            INNER JOIN "ETUDIANT_COURS" ec ON c."idCours" = ec."idCours"
            WHERE ec."idUser" = $1
        `;
        const result = await pool.query(query, [idUser]);
        return result.rows;
    }
};

module.exports = coursModel;