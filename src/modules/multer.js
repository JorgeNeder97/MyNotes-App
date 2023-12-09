const multer = require('multer');
const path = require('path');

const formatoImagen = ['.jpg', '.png', '.jpeg', '.svg', '.webp'];

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        if(formatoImagen.find(ext => ext == path.extname(file.originalname))) {
            cb(null, path.join(__dirname, '../../public/img/profile-img'));
        } 
        else {
            cb(null, path.join(__dirname, '../data/noteFiles'));
        }
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

module.exports = upload;