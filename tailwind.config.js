module.exports = {
    purge: {
        enabled: !process.env.ROLLUP_WATCH,
        mode: "all",
        content: ["./public/index.html", "./src/**/*.svelte"],
    },
    darkMode: false,
    theme: {
        extend: {
            fontFamily: {
                sans: ["Roboto"],
            },
            colors: {
                "Cryptonauts-DarkBlue": "#00102A",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
