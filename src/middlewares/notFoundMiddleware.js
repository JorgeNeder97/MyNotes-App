function notFoundMiddleware(req, res, next) {
    res.status(404).render('404-page', {title: 'MyNotes | 404', css: '404.css'});
    next();
}


module.exports = notFoundMiddleware;