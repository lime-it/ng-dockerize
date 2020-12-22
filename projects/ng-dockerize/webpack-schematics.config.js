const CopyPlugin = require('copy-webpack-plugin');
const RemovePlugin = require('remove-files-webpack-plugin');
const spawn = require('child_process').spawn;
const colors = require('colors');

function regexTransformPath(regex){
    return function(targetPath, absolutePath){
        const test = new RegExp(regex);

        absolutePath = absolutePath.replace(/\\/g,'/');
        const path = test.exec(absolutePath);
        
        for(let i=1;i<path.length;i++)
            targetPath = targetPath.replace('['+i+']',path[i]);

        return Promise.resolve(targetPath);
    }
}

module.exports = {
    mode: "production",
    entry: './projects/ng-dockerize/dummy-entry.js',
    plugins: [
        new RemovePlugin({
            after: {
                test: [
                    {
                        folder: './dist',
                        method: (filePath) => {
                            return /main\.js$/.test(filePath);
                        }
                    } 
                ]
            }
        }),
        {
            apply: (compiler) => {
                compiler.hooks.afterEmit.tapAsync('CompileSchematicsPlugin', (compilation, callback) => {
                    const child = spawn('bash -c "./node_modules/.bin/tsc -p ./projects/ng-dockerize/tsconfig.schematics.json"', 
                        { cwd:process.cwd(), env: process.env, shell: true }
                    );
                    child.stdout.on('data', function (data) {
                        if(/error/i.test(data))
                            process.stdout.write(colors.red(data.toString()));
                        else
                            process.stdout.write(data);
                    });
                    child.stderr.on('data', function (data) {
                        process.stderr.write(colors.red(data.toString()));
                    });
                    child.on('exit',function(code, signal){
                        if(code!=0)
                            process.exit(1);
                        callback();
                    });
                });
            }
        },
        new CopyPlugin({
            patterns: [
                { from:'./projects/ng-dockerize/schematics/collection.json', to:'./ng-dockerize/schematics/collection.json'},
                { from:'./projects/ng-dockerize/schematics/*/*.json', to:'./ng-dockerize/schematics/[1]/[name].[ext]',
                    transformPath:regexTransformPath(/schematics\/(.+)\/.+\.json$/ig), noErrorOnMissing: true},
                { from:'./projects/ng-dockerize/schematics/*/files/**/*', to:'./ng-dockerize/schematics/[1]/[2]',
                    transformPath:regexTransformPath(/schematics\/(.+)\/(files\/(.+)\..*)$/ig), noErrorOnMissing: true} 
            ]
        })
    ],
};