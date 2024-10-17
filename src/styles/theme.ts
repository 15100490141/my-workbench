export const themes = {
  light: {
    background: "bg-white",
    text: "text-gray-900",
  },
  dark: {
    background: "bg-gray-900",
    text: "text-white",
  },
};

export const getThemeClasses = (theme: "light" | "dark") => {
  return `${themes[theme].background} ${themes[theme].text}`;
};
