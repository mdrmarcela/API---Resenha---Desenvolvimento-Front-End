import { useEffect, useState } from "react";

const ThemeButton = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

    useEffect(() => {
        document.querySelector("html").setAttribute("data-bs-theme", darkMode ? "dark" : "light");
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    return (
        <div className="form-check form-switch m-0">
            <input
                id="id-input-dark-theme"
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
            />
        </div>
    );
};

export default ThemeButton;