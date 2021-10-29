module.exports = {
    apps: [{
        name: "my_app",
        cwd: "./CAB432-project-2/client",  
        script: "npm",
        args: "start"
    },
    {
        name: "back-end",
        cwd: "./CAB432-project-2/server",
        script: "node",
        args: "index.js"
    }
]

}