module.exports = {
    pluginOptions: {
        electronBuilder: {
            // chainWebpackMainProcess: (config) => console.log(config),
            // chainWebpackRendererProcess: (config) => console.log(config),
            builderOptions: {
                appId: "supercrewapp",
                productName: "Supercrew",
                target: "nsis",
                files: {
                    filters: ['dist_electron/**/*']
                }
            },
        },
    },
};