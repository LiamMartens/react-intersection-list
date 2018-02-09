module.exports.files = {
    javascripts: {
        joinTo: 'react-intersection-list.js'
    }
}

module.exports.paths = {
    watched: ['src'],
    public: 'lib'
}

module.exports.modules = {
    nameCleaner: path => path.replace(/^src\//, '')
}

module.exports.plugins = {
    babel: {
        presets: [['env', {
            targets: {
                browsers: ['last 2 versions']
            }
        }], 'react'],
        plugins: ['transform-object-rest-spread']
    }
}