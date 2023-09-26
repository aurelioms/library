import { ChangeEvent, FC, useState } from "react"
import axios from "axios"
import './style.css'

export const Homepage: FC = () => {
    const [form, setForm] = useState({
        username: '',
        password: '',
    })

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        const { name, value } = e.target
        setForm((prevValues) => ({
            ...prevValues,
            [name]: value,
        }))
    }

    const handleLogin = async (): Promise<void> => {
        try {
            const response = await axios.post('api/v1/login', {
                username: form.username,
                password: form.password,
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="loginForm">
            <h1>LIBRARY</h1>
            <form>
                <div className="loginBox">
                    <label htmlFor="username">Username:</label>
                    <input
                        className="loginFormInput"
                        type="text"
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleInput}
                    />
                </div>
                <div className="loginBox">
                    <label htmlFor="password">Password:</label>
                    <input
                        className="loginFormInput"
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleInput}
                    />
                </div>
                <button type="button" onClick={handleLogin}>
                    Login
                </button>
            </form>
        </div>
    )
}