// REQUIRED WITH ELECTRON:BUILD

module.exports = {
    pluginOptions: {
        electronBuilder: {
            chainWebpackMainProcess: (config) => console.log(config),
            chainWebpackRendererProcess: (config) => console.log(config),
            // mainProcessFile: 'src/background.ts',
            builderOptions: {
                appId: "supercrewapp",
                productName: "Supercrew App",
                target: "nsis",
                files: {
                    filters: ['dist_electron/**/*']
                }
            },
        },
    },
};