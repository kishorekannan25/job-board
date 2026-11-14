import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'job-board:theme'

/** Light or dark mode, applied as a `dark` class on <html> and remembered in localStorage. */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() =>
        document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    )

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        try {
            localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // Storage blocked: the theme still works for this visit.
        }
    }, [theme])

    function toggleTheme() {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
    }

    return { theme, toggleTheme }
}
