const express = require('express')

const router = express.Router()

// Controller
const { register, login, checkLogin } = require('../controllers/auth')
const { getMusics, addMusics, updateMusic, getDetailMusic, deleteMusic } = require('../controllers/music')
const { addArtist, updateArtist, getArtist, deleteArtist } = require('../controllers/artist')
const { getTransaction, addTransaction } = require('../controllers/transaction')

// Middleware
const { auth } = require('../middlewares/auth')
// Upload file
const { uploadFile } = require('../middlewares/uploadFile')

//route
router.post('/register', register)
router.post('/login', login)
router.get('/check', auth, checkLogin)

router.get('/musics', auth, getMusics)
router.patch('/music/:id', auth, uploadFile('attache', 'thumbnail'), updateMusic)
router.post('/music', auth, uploadFile('attache', 'thumbnail'), addMusics)
router.get('/music/:id', auth, getDetailMusic)
router.delete('/music/:id', auth, deleteMusic)

router.post('/artist', auth, addArtist)
router.patch('/artist/:id', auth, updateArtist)
router.get('/artists', auth, getArtist)
router.delete('/artist/:id', auth, deleteArtist)

router.get('/transactions', auth, getTransaction)
router.post('/transaction', auth, addTransaction)

module.exports = router