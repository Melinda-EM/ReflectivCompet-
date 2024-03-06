import axios from "axios";
import { useState } from "react";

export function useUser() {
    const [_isConnected, setIsConnected] = useState(() => (localStorage.getItem("isConnected") ?? "false") === "true")
    async function login(username, password) {
        try {
            await axios.post("/api/login", { username, password });
            setIsConnected(true);
            localStorage.setItem("isConnected", true);
            return true
        } catch (_) {
            return false
        }
    }

    async function logout() {
        if (!_isConnected) return
        setIsConnected(false);
        localStorage.setItem("isConnected", false);
        await axios.delete("/api/logout")
    }

    return { isConnected: _isConnected, login, logout }
}