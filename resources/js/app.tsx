import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Store API token in localStorage when available
        const token = (props.initialPage.props as any)?.auth?.token;

        if (token) {
            localStorage.setItem("api_token", token);
        } else if (!(props.initialPage.props as any)?.auth?.user) {
            // Clear token if user is not authenticated
            localStorage.removeItem("api_token");
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
