import { useState } from 'react';

const LoginSignupUI = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const toggleForm = () => {
        setIsSignup(!isSignup);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isSignup ? '/api/signup' : '/api/login';
        const payload = isSignup ? { username, email, password } : { email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (data.success) {
                console.log(isSignup ? 'Signup successful!' : 'Login successful!', data);
                window.location.href = '/dashboard';
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error('Error during submission:', err);
            setError('Something went wrong.');
        }
    };

    return (
        <section className={`loginOrSignupField ${isSignup ? 'signup_ON' : ''}`}>
            <aside className="loginOrSignupFieldInner">
                <div className="switchButtonField">
                    <div className="switchButtonOuter" onClick={toggleForm}>
                        <div className="switchButtonInner"></div>
                    </div>
                </div>
                <form className="emailForm" onSubmit={handleSubmit}>
                    {isSignup && (
                        <input
                            type="text"
                            id="username"
                            className="input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        id="email"
                        className="input"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        className="input"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {isSignup && (
                        <div id="rememberMeField">
                            <label>
                                <input type="checkbox" id="rememberMe" />
                                <span></span>
                            </label>
                        </div>
                    )}
                    <input
                        type="submit"
                        id="submit"
                        value={isSignup ? "Sign Up" : "Join"}
                    />
                    {error && <p className="error">{error}</p>}
                </form>
                <a href="#" className="socialButton facebook">Facebook</a>
                <a href="#" className="socialButton twitter">Twitter</a>
                <a href="#" className="socialButton googleplus">Google +</a>
            </aside>

            <nav className="navigations">
                <ul>
                    <li><span className="normal">normal</span></li>
                    <li><span className="mode01">mode 2</span></li>
                    <li><span className="mode02">mode 3</span></li>
                    <li className="designer">
                        <a href="https://creativemarket.com/mselmany" target="_blank">
                            <img src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-ash2/t5/1117447_100001638983788_1284464661_q.jpg" alt="" />
                        </a>
                    </li>
                </ul>
            </nav>
        </section>
    );
};

export default LoginSignupUI;
