import React, { useState, useEffect } from "react";

const Context = React.createContext({} as any);

export const themes = {
  light: {
    color: "#141414",
    key: "light",
    body: "#e2e2e2",
    text: "#363537",
    toggleBorder: "#fff",
    gradient: "linear-gradient(#39598A, #79D7ED)",
    backgroundColor: "#fff",
    border: "2px solid grey",
    classOverride: "light-theme"
  },
  dark: {
    color: "#fff",
    body: "#363537",
    key: "dark",
    text: "#FAFAFA",
    toggleBorder: "#6B8096",
    gradient: "linear-gradient(#091236, #1E215D)",
    backgroundColor: "#141414",
    border: "",
    classOverride: "dark-theme"
  }
};

function ThemeProvider({ ...props }: any) {
  const [key, setThemeKey] = useState(
    window.localStorage.getItem("theme") || "light"
  );
  const [theme, setTheme] = useState(themes[key as "light" | "dark"]);
  const darkMode = key === "dark";

  const toggleTheme = () => {
    if (key === "light") {
      setTheme(themes["dark"]);
      setThemeKey("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      setTheme(themes["light"]);
      setThemeKey("light");
      window.localStorage.setItem("theme", "light");
    }
  };

  return (
    <Context.Provider value={{ theme, toggleTheme, darkMode }} {...props} />
  );
}

function useThemes() {
  const context = React.useContext(Context);

  if (context === undefined) {
    throw new Error(
      `Published page context not defined. Most likely you are using the
      usePage hook without wrapping the route in the page provider.`
    );
  }

  return context;
}

export { ThemeProvider, useThemes };
