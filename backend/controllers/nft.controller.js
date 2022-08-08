const db = require('../db')

const getImageName = () => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 32; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result
}

class NftController {
    async createNft(req, res) {
        try {
            const { tron_token, nft_name, nft_desc, nft_link } = req.body
            const creator = await db.query('SELECT * FROM users WHERE tron_token = $1', [tron_token])
            const newNft = await db.query('INSERT INTO nft (nft_name, nft_desc, nft_link, creator_id) values ($1, $2, $3, $4) RETURNING *', [nft_name, nft_desc, nft_link, creator.rows[0].id])
            res.status(200).json({ nft: newNft.rows[0] })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async createNftImage(req, res) {
        try {
            const nft_id = req.params.nft_id
            const file = req.files.file;
            const filename = getImageName()
            file.mv(`images/${filename + file.name.slice(file.name.lastIndexOf('.'))}`, (err) => { })
            await db.query(`UPDATE nft SET nft_image = $1 WHERE id = $2`, [filename + file.name.slice(file.name.lastIndexOf('.')), nft_id])
            res.status(200).json({ message: 'success' })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }

    async getNft(req, res) {
        try {
            const username = req.params.username
            const creator = await db.query('SELECT * FROM users WHERE username = $1', [username])
            const nfts = await db.query('SELECT * FROM nft WHERE creator_id = $1', [creator.rows[0].id])
            res.status(200).json({ data: nfts.rows })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }


    async deleteNft(req, res) {
        try {
            const { nft_id } = req.body
            await db.query('DELETE FROM nft WHERE id = $1', [nft_id])
            res.status(200).json({ message: 'success' })
        } catch (error) {
            res.status(error.status || 500).json({ error: true, message: error.message || 'Something broke!' })
        }
    }
}

module.exports = new NftController()